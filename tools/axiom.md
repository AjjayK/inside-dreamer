# Tool Server: axiom

**ID:** 7fae24d4-968a-4165-adc0-72f7c14d8a80

**Short Description:** Access Axiom logs & monitors

## Description

View & manage your team's Axiom logs

## Tools (8)

### listDatasets

**Description:** List all available datasets. For datasets you are curious about, use getDatasetFields() tool to find their schema.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {}
}
```

### getDatasetFields

**Description:** List all fields in a dataset.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "datasetName"
  ],
  "properties": {
    "datasetName": {
      "type": "string",
      "minLength": 1,
      "description": "The dataset name. You can find an list of datasets using the `listDatasets()` tool."
    }
  },
  "additionalProperties": false
}
```

### queryDataset

**Description:** # Instructions
1. Query Axiom datasets using Axiom Processing Language (APL). The query must be a valid APL query string.
2. ALWAYS get the schema of the dataset before running queries rather than guessing.
    You can do this by getting a single event and projecting all fields.
3. Keep in mind that there's a maximum row limit of 65000 rows per query.
4. Prefer aggregations over non aggregating queries when possible to reduce the amount of data returned.
5. Be selective in what you project in each query (unless otherwise needed, like for discovering the schema).
    It's expensive to project all fields.
6. ALWAYS restrict the time range of the query to the smallest possible range that
    meets your needs. This will reduce the amount of data scanned and improve query performance.
7. NEVER guess the schema of the dataset. If you don't where something is, use search first to find in which fields
    it appears.

# Examples
Basic:
- Filter: ['logs'] | where ['severity'] == "error" or ['duration'] > 500ms
- Time range: ['logs'] | where ['_time'] > ago(2h) and ['_time'] < now()
- Project rename: ['logs'] | project-rename responseTime=['duration'], path=['url']

Aggregations:
- Count by: ['logs'] | summarize count() by bin(['_time'], 5m), ['status']
- Multiple aggs: ['logs'] | summarize count(), avg(['duration']), max(['duration']), p95=percentile(['duration'], 95) by ['endpoint']
- Dimensional: ['logs'] | summarize dimensional_analysis(['isError'], pack_array(['endpoint'], ['status']))
- Histograms: ['logs'] | summarize histogram(['responseTime'], 100) by ['endpoint']
- Distinct: ['logs'] | summarize dcount(['userId']) by bin_auto(['_time'])

Search & Parse:
- Search all: search "error" or "exception"
- Parse logs: ['logs'] | parse-kv ['message'] as (duration:long, error:string) with (pair_delimiter=",")
- Regex extract: ['logs'] | extend errorCode = extract("error code ([0-9]+)", 1, ['message'])
- Contains ops: ['logs'] | where ['message'] contains_cs "ERROR" or ['message'] startswith "FATAL"

Data Shaping:
- Extend & Calculate: ['logs'] | extend duration_s = ['duration']/1000, success = ['status'] < 400
- Dynamic: ['logs'] | extend props = parse_json(['properties']) | where ['props.level'] == "error"
- Pack/Unpack: ['logs'] | extend fields = pack("status", ['status'], "duration", ['duration'])
- Arrays: ['logs'] | where ['url'] in ("login", "logout", "home") | where array_length(['tags']) > 0

Advanced:
- Union: union ['logs-app*'] | where ['severity'] == "error"
- Case: ['logs'] | extend level = case(['status'] >= 500, "error", ['status'] >= 400, "warn", "info")

Time Operations:
- Bin & Range: ['logs'] | where ['_time'] between(datetime(2024-01-01)..now())
- Multiple time bins: ['logs'] | summarize count() by bin(['_time'], 1h), bin(['_time'], 1d)
- Time shifts: ['logs'] | extend prev_hour = ['_time'] - 1h

String Operations:
- String funcs: ['logs'] | extend domain = tolower(extract("://([^/]+)", 1, ['url']))
- Concat: ['logs'] | extend full_msg = strcat(['level'], ": ", ['message'])
- Replace: ['logs'] | extend clean_msg = replace_regex("(password=)[^&]*", "\1***", ['message'])

Common Patterns:
- Error analysis: ['logs'] | where ['severity'] == "error" | summarize error_count=count() by ['error_code'], ['service']
- Status codes: ['logs'] | summarize requests=count() by ['status'], bin_auto(['_time']) | where ['status'] >= 500
- Latency tracking: ['logs'] | summarize p50=percentile(['duration'], 50), p90=percentile(['duration'], 90) by ['endpoint']
- User activity: ['logs'] | summarize user_actions=count() by ['userId'], ['action'], bin(['_time'], 1h)


**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "apl"
  ],
  "properties": {
    "apl": {
      "type": "string",
      "description": "The APL query to execute"
    },
    "endTime": {
      "type": "string",
      "default": "now",
      "description": "End time for the query range. A fixed (RFC3339) or relative (now, now-5m) time value. Defaults to \"now\"."
    },
    "startTime": {
      "type": "string",
      "default": "now-30m",
      "description": "Start time for the query range. A fixed (RFC3339) or relative (now, now-5m) time value. Defaults to \"now-30m\"."
    }
  },
  "additionalProperties": false
}
```

### getSavedQueries

**Description:** Retrieve saved/starred queries from Axiom - shows APL queries that users have bookmarked for reuse

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {}
}
```

### listDashboards

**Description:** List all available dashboards. Shows user-created dashboards with their metadata.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {}
}
```

### getDashboard

**Description:** Get detailed information about a specific dashboard by ID.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "dashboardId"
  ],
  "properties": {
    "dashboardId": {
      "type": "string",
      "description": "The dashboard ID. You can find a list of dashboards using the `listDashboards()` tool."
    }
  },
  "additionalProperties": false
}
```

### getMonitorHistory

**Description:** Get recent check history of monitor. Use the checkMonitors() tool to list all the monitors.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "monitorId"
  ],
  "properties": {
    "monitorId": {
      "type": "string",
      "description": "The monitor ID. You can find an list of monitors using the `checkMonitors()` tool."
    }
  },
  "additionalProperties": false
}
```

### checkMonitors

**Description:** Check all monitors and their statuses.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {}
}
```

