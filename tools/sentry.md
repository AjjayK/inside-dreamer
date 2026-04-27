# Tool Server: sentry

**ID:** d8655a85-f40b-4309-8633-fa48655211fc

**Short Description:** Search, query, and debug errors intelligently

## Description

View & manage your team's data on Sentry

## Tools (13)

### whoami

**Description:** Identify the authenticated user in Sentry.

Use this tool when you need to:
- Get the user's name and email address.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {}
}
```

### find_organizations

**Description:** Find organizations that the user has access to in Sentry.

Use this tool when you need to:
- View organizations in Sentry
- Find an organization's slug to aid other tool requests
- Search for specific organizations by name or slug

Returns up to 25 results. If you hit this limit, use the query parameter to narrow down results.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "query": {
      "anyOf": [
        {
          "type": "string",
          "description": "Search query to filter results by name or slug. Use this to narrow down results when there are many items."
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "description": "Search query to filter results by name or slug. Use this to narrow down results when there are many items."
    }
  },
  "additionalProperties": false
}
```

### find_teams

**Description:** Find teams in an organization in Sentry.

Use this tool when you need to:
- View teams in a Sentry organization
- Find a team's slug and numeric ID to aid other tool requests
- Search for specific teams by name or slug

Returns up to 25 results. If you hit this limit, use the query parameter to narrow down results.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "organizationSlug"
  ],
  "properties": {
    "query": {
      "anyOf": [
        {
          "type": "string",
          "description": "Search query to filter results by name or slug. Use this to narrow down results when there are many items."
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "description": "Search query to filter results by name or slug. Use this to narrow down results when there are many items."
    },
    "regionUrl": {
      "anyOf": [
        {
          "type": "string",
          "description": "The region URL for the organization you're querying, if known. For Sentry's Cloud Service (sentry.io), this is typically the region-specific URL like 'https://us.sentry.io'. For self-hosted Sentry installations, this parameter is usually not needed and should be omitted. You can find the correct regionUrl from the organization details using the `find_organizations()` tool."
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "description": "The region URL for the organization you're querying, if known. For Sentry's Cloud Service (sentry.io), this is typically the region-specific URL like 'https://us.sentry.io'. For self-hosted Sentry installations, this parameter is usually not needed and should be omitted. You can find the correct regionUrl from the organization details using the `find_organizations()` tool."
    },
    "organizationSlug": {
      "type": "string",
      "description": "The organization's slug. You can find a existing list of organizations you have access to using the `find_organizations()` tool."
    }
  },
  "additionalProperties": false
}
```

### find_projects

**Description:** Find projects in Sentry.

Use this tool when you need to:
- View projects in a Sentry organization
- Find a project's slug to aid other tool requests
- Search for specific projects by name or slug

Returns up to 25 results. If you hit this limit, use the query parameter to narrow down results.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "organizationSlug"
  ],
  "properties": {
    "query": {
      "anyOf": [
        {
          "type": "string",
          "description": "Search query to filter results by name or slug. Use this to narrow down results when there are many items."
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "description": "Search query to filter results by name or slug. Use this to narrow down results when there are many items."
    },
    "regionUrl": {
      "anyOf": [
        {
          "type": "string",
          "description": "The region URL for the organization you're querying, if known. For Sentry's Cloud Service (sentry.io), this is typically the region-specific URL like 'https://us.sentry.io'. For self-hosted Sentry installations, this parameter is usually not needed and should be omitted. You can find the correct regionUrl from the organization details using the `find_organizations()` tool."
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "description": "The region URL for the organization you're querying, if known. For Sentry's Cloud Service (sentry.io), this is typically the region-specific URL like 'https://us.sentry.io'. For self-hosted Sentry installations, this parameter is usually not needed and should be omitted. You can find the correct regionUrl from the organization details using the `find_organizations()` tool."
    },
    "organizationSlug": {
      "type": "string",
      "description": "The organization's slug. You can find a existing list of organizations you have access to using the `find_organizations()` tool."
    }
  },
  "additionalProperties": false
}
```

### find_releases

**Description:** Find releases in Sentry.

Use this tool when you need to:
- Find recent releases in a Sentry organization
- Find the most recent version released of a specific project
- Determine when a release was deployed to an environment

<examples>
### Find the most recent releases in the 'my-organization' organization

```
find_releases(organizationSlug='my-organization')
```

### Find releases matching '2ce6a27' in the 'my-organization' organization

```
find_releases(organizationSlug='my-organization', query='2ce6a27')
```
</examples>

<hints>
- If the user passes a parameter in the form of name/otherName, its likely in the format of <organizationSlug>/<projectSlug>.
</hints>

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "organizationSlug"
  ],
  "properties": {
    "query": {
      "anyOf": [
        {
          "type": "string",
          "description": "Search for versions which contain the provided string."
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "description": "Search for versions which contain the provided string."
    },
    "regionUrl": {
      "anyOf": [
        {
          "type": "string",
          "description": "The region URL for the organization you're querying, if known. For Sentry's Cloud Service (sentry.io), this is typically the region-specific URL like 'https://us.sentry.io'. For self-hosted Sentry installations, this parameter is usually not needed and should be omitted. You can find the correct regionUrl from the organization details using the `find_organizations()` tool."
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "description": "The region URL for the organization you're querying, if known. For Sentry's Cloud Service (sentry.io), this is typically the region-specific URL like 'https://us.sentry.io'. For self-hosted Sentry installations, this parameter is usually not needed and should be omitted. You can find the correct regionUrl from the organization details using the `find_organizations()` tool."
    },
    "projectSlug": {
      "anyOf": [
        {
          "type": "string",
          "description": "The project's slug. This will default to all projects you have access to. It is encouraged to specify this when possible."
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "description": "The project's slug. This will default to all projects you have access to. It is encouraged to specify this when possible."
    },
    "organizationSlug": {
      "type": "string",
      "description": "The organization's slug. You can find a existing list of organizations you have access to using the `find_organizations()` tool."
    }
  },
  "additionalProperties": false
}
```

### get_issue_details

**Description:** Get detailed information about a specific Sentry issue by ID.

USE THIS TOOL WHEN USERS:
- Provide a specific issue ID (e.g., 'CLOUDFLARE-MCP-41', 'PROJECT-123')
- Ask to 'explain [ISSUE-ID]', 'tell me about [ISSUE-ID]'
- Want details/stacktrace/analysis for a known issue
- Provide a Sentry issue URL

DO NOT USE for:
- General searching or listing issues (use search_issues)
- Root cause analysis (use analyze_issue_with_seer)

TRIGGER PATTERNS:
- 'Explain ISSUE-123' → use get_issue_details
- 'Tell me about PROJECT-456' → use get_issue_details
- 'What happened in [issue URL]' → use get_issue_details

<examples>
### With Sentry URL (recommended - simplest approach)
```
get_issue_details(issueUrl='https://sentry.sentry.io/issues/6916805731/?project=4509062593708032&query=is%3Aunresolved')
```

### With issue ID and organization
```
get_issue_details(organizationSlug='my-organization', issueId='CLOUDFLARE-MCP-41')
```

### With event ID and organization
```
get_issue_details(organizationSlug='my-organization', eventId='c49541c747cb4d8aa3efb70ca5aba243')
```
</examples>

<hints>
- **IMPORTANT**: If user provides a Sentry URL, pass the ENTIRE URL to issueUrl parameter unchanged
- When using issueUrl, all other parameters are automatically extracted - don't provide them separately
- If using issueId (not URL), then organizationSlug is required
</hints>

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "eventId": {
      "type": "string",
      "description": "The ID of the event."
    },
    "issueId": {
      "type": "string",
      "description": "The Issue ID. e.g. `PROJECT-1Z43`"
    },
    "issueUrl": {
      "type": "string",
      "format": "uri",
      "description": "The URL of the issue. e.g. https://my-organization.sentry.io/issues/PROJECT-1Z43"
    },
    "regionUrl": {
      "anyOf": [
        {
          "type": "string",
          "description": "The region URL for the organization you're querying, if known. For Sentry's Cloud Service (sentry.io), this is typically the region-specific URL like 'https://us.sentry.io'. For self-hosted Sentry installations, this parameter is usually not needed and should be omitted. You can find the correct regionUrl from the organization details using the `find_organizations()` tool."
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "description": "The region URL for the organization you're querying, if known. For Sentry's Cloud Service (sentry.io), this is typically the region-specific URL like 'https://us.sentry.io'. For self-hosted Sentry installations, this parameter is usually not needed and should be omitted. You can find the correct regionUrl from the organization details using the `find_organizations()` tool."
    },
    "organizationSlug": {
      "type": "string",
      "description": "The organization's slug. You can find a existing list of organizations you have access to using the `find_organizations()` tool."
    }
  },
  "additionalProperties": false
}
```

### get_issue_tag_values

**Description:** Get tag value distribution for a specific Sentry issue.

Use this tool when you need to:
- Understand how an issue is distributed across different tag values
- Get aggregate counts of unique tag values (e.g., 'how many unique URLs are affected')
- Analyze which browsers, environments, or URLs are most impacted by an issue
- View the tag distributions page data programmatically

Common tag keys:
- `url`: Request URLs affected by the issue
- `browser`: Browser types and versions
- `browser.name`: Browser names only
- `os`: Operating systems
- `environment`: Deployment environments (production, staging, etc.)
- `release`: Software releases
- `device`: Device types
- `user`: Affected users

<examples>
### Get URL distribution for an issue
```
get_issue_tag_values(organizationSlug='my-organization', issueId='PROJECT-123', tagKey='url')
```

### Get browser distribution using issue URL
```
get_issue_tag_values(issueUrl='https://sentry.io/issues/PROJECT-123/', tagKey='browser')
```

### Get environment distribution
```
get_issue_tag_values(organizationSlug='my-organization', issueId='PROJECT-123', tagKey='environment')
```
</examples>

<hints>
- If user provides a Sentry URL, pass the ENTIRE URL to issueUrl parameter unchanged
- Common tag keys: url, browser, browser.name, os, environment, release, device, user
- Tag keys are case-sensitive
</hints>

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "tagKey"
  ],
  "properties": {
    "tagKey": {
      "type": "string",
      "pattern": "^[a-zA-Z0-9][a-zA-Z0-9._-]*$",
      "description": "The tag key to get values for (e.g., 'url', 'browser', 'environment', 'release')."
    },
    "issueId": {
      "type": "string",
      "description": "The Issue ID. e.g. `PROJECT-1Z43`"
    },
    "issueUrl": {
      "type": "string",
      "format": "uri",
      "description": "The URL of the issue. e.g. https://my-organization.sentry.io/issues/PROJECT-1Z43"
    },
    "regionUrl": {
      "anyOf": [
        {
          "type": "string",
          "description": "The region URL for the organization you're querying, if known. For Sentry's Cloud Service (sentry.io), this is typically the region-specific URL like 'https://us.sentry.io'. For self-hosted Sentry installations, this parameter is usually not needed and should be omitted. You can find the correct regionUrl from the organization details using the `find_organizations()` tool."
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "description": "The region URL for the organization you're querying, if known. For Sentry's Cloud Service (sentry.io), this is typically the region-specific URL like 'https://us.sentry.io'. For self-hosted Sentry installations, this parameter is usually not needed and should be omitted. You can find the correct regionUrl from the organization details using the `find_organizations()` tool."
    },
    "organizationSlug": {
      "type": "string",
      "description": "The organization's slug. You can find a existing list of organizations you have access to using the `find_organizations()` tool."
    }
  },
  "additionalProperties": false
}
```

### get_trace_details

**Description:** Get detailed information about a specific Sentry trace by ID.

USE THIS TOOL WHEN USERS:
- Provide a specific trace ID (e.g., 'a4d1aae7216b47ff8117cf4e09ce9d0a')
- Ask to 'show me trace [TRACE-ID]', 'explain trace [TRACE-ID]'
- Want high-level overview and link to view trace details in Sentry
- Need trace statistics and span breakdown

DO NOT USE for:
- General searching for traces (use search_events with trace queries)
- Individual span details (this shows trace overview)

TRIGGER PATTERNS:
- 'Show me trace abc123' → use get_trace_details
- 'Explain trace a4d1aae7216b47ff8117cf4e09ce9d0a' → use get_trace_details
- 'What is trace [trace-id]' → use get_trace_details

<examples>
### Get trace overview
```
get_trace_details(organizationSlug='my-organization', traceId='a4d1aae7216b47ff8117cf4e09ce9d0a')
```
</examples>

<hints>
- Trace IDs are 32-character hexadecimal strings
</hints>

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "organizationSlug",
    "traceId"
  ],
  "properties": {
    "traceId": {
      "type": "string",
      "pattern": "^[0-9a-fA-F]{32}$",
      "description": "The trace ID. e.g. `a4d1aae7216b47ff8117cf4e09ce9d0a`"
    },
    "regionUrl": {
      "anyOf": [
        {
          "type": "string",
          "description": "The region URL for the organization you're querying, if known. For Sentry's Cloud Service (sentry.io), this is typically the region-specific URL like 'https://us.sentry.io'. For self-hosted Sentry installations, this parameter is usually not needed and should be omitted. You can find the correct regionUrl from the organization details using the `find_organizations()` tool."
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "description": "The region URL for the organization you're querying, if known. For Sentry's Cloud Service (sentry.io), this is typically the region-specific URL like 'https://us.sentry.io'. For self-hosted Sentry installations, this parameter is usually not needed and should be omitted. You can find the correct regionUrl from the organization details using the `find_organizations()` tool."
    },
    "organizationSlug": {
      "type": "string",
      "description": "The organization's slug. You can find a existing list of organizations you have access to using the `find_organizations()` tool."
    }
  },
  "additionalProperties": false
}
```

### get_event_attachment

**Description:** Download attachments from a Sentry event.

Use this tool when you need to:
- Download files attached to a specific event
- Access screenshots, log files, or other attachments uploaded with an error report
- Retrieve attachment metadata and download URLs

<examples>
### Download a specific attachment by ID

```
get_event_attachment(organizationSlug='my-organization', projectSlug='my-project', eventId='c49541c747cb4d8aa3efb70ca5aba243', attachmentId='12345')
```

### List all attachments for an event

```
get_event_attachment(organizationSlug='my-organization', projectSlug='my-project', eventId='c49541c747cb4d8aa3efb70ca5aba243')
```

</examples>

<hints>
- If `attachmentId` is provided, the specific attachment will be downloaded as an embedded resource
- If `attachmentId` is omitted, all attachments for the event will be listed with download information
- The `projectSlug` is required to identify which project the event belongs to
</hints>

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "organizationSlug",
    "projectSlug",
    "eventId"
  ],
  "properties": {
    "eventId": {
      "type": "string",
      "description": "The ID of the event."
    },
    "regionUrl": {
      "anyOf": [
        {
          "type": "string",
          "description": "The region URL for the organization you're querying, if known. For Sentry's Cloud Service (sentry.io), this is typically the region-specific URL like 'https://us.sentry.io'. For self-hosted Sentry installations, this parameter is usually not needed and should be omitted. You can find the correct regionUrl from the organization details using the `find_organizations()` tool."
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "description": "The region URL for the organization you're querying, if known. For Sentry's Cloud Service (sentry.io), this is typically the region-specific URL like 'https://us.sentry.io'. For self-hosted Sentry installations, this parameter is usually not needed and should be omitted. You can find the correct regionUrl from the organization details using the `find_organizations()` tool."
    },
    "projectSlug": {
      "type": "string",
      "description": "The project's slug. You can find a list of existing projects in an organization using the `find_projects()` tool."
    },
    "attachmentId": {
      "anyOf": [
        {
          "type": "string",
          "description": "The ID of the attachment to download."
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "description": "The ID of the attachment to download."
    },
    "organizationSlug": {
      "type": "string",
      "description": "The organization's slug. You can find a existing list of organizations you have access to using the `find_organizations()` tool."
    }
  },
  "additionalProperties": false
}
```

### search_events

**Description:** Search for events AND perform counts/aggregations - the ONLY tool for statistics and counts.

Supports TWO query types:
1. AGGREGATIONS (counts, sums, averages): 'how many errors', 'count of issues', 'total tokens'
2. Individual events with timestamps: 'show me error logs from last hour'

USE THIS FOR ALL COUNTS/STATISTICS:
- 'how many errors today' → returns count
- 'count of database failures' → returns count
- 'total number of issues' → returns count
- 'average response time' → returns avg()
- 'sum of tokens used' → returns sum()

ALSO USE FOR INDIVIDUAL EVENTS:
- 'error logs from last hour' → returns event list
- 'database errors with timestamps' → returns event list
- 'trace spans for slow API calls' → returns span list

Dataset Selection (AI automatically chooses):
- errors: Exception/crash events
- logs: Log entries
- spans: Performance data, AI/LLM calls, token usage

DO NOT USE for grouped issue lists → use search_issues

<examples>
search_events(organizationSlug='my-org', naturalLanguageQuery='how many errors today')
search_events(organizationSlug='my-org', naturalLanguageQuery='count of database failures this week')
search_events(organizationSlug='my-org', naturalLanguageQuery='total tokens used by model')
search_events(organizationSlug='my-org', naturalLanguageQuery='error logs from the last hour')
</examples>

<hints>
- If the user passes a parameter in the form of name/otherName, it's likely in the format of <organizationSlug>/<projectSlug>.
- Parse org/project notation directly without calling find_organizations or find_projects.
</hints>

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "organizationSlug",
    "naturalLanguageQuery"
  ],
  "properties": {
    "limit": {
      "type": "number",
      "default": 10,
      "maximum": 100,
      "minimum": 1,
      "description": "Maximum number of results to return"
    },
    "regionUrl": {
      "anyOf": [
        {
          "type": "string",
          "description": "The region URL for the organization you're querying, if known. For Sentry's Cloud Service (sentry.io), this is typically the region-specific URL like 'https://us.sentry.io'. For self-hosted Sentry installations, this parameter is usually not needed and should be omitted. You can find the correct regionUrl from the organization details using the `find_organizations()` tool."
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "description": "The region URL for the organization you're querying, if known. For Sentry's Cloud Service (sentry.io), this is typically the region-specific URL like 'https://us.sentry.io'. For self-hosted Sentry installations, this parameter is usually not needed and should be omitted. You can find the correct regionUrl from the organization details using the `find_organizations()` tool."
    },
    "projectSlug": {
      "anyOf": [
        {
          "type": "string",
          "description": "The project's slug. You can find a list of existing projects in an organization using the `find_projects()` tool."
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "description": "The project's slug. You can find a list of existing projects in an organization using the `find_projects()` tool."
    },
    "organizationSlug": {
      "type": "string",
      "description": "The organization's slug. You can find a existing list of organizations you have access to using the `find_organizations()` tool."
    },
    "includeExplanation": {
      "type": "boolean",
      "default": false,
      "description": "Include explanation of how the query was translated"
    },
    "naturalLanguageQuery": {
      "type": "string",
      "minLength": 1,
      "description": "Natural language description of what you want to search for"
    }
  },
  "additionalProperties": false
}
```

### analyze_issue_with_seer

**Description:** Use Seer to analyze production errors and get detailed root cause analysis with specific code fixes.

Use this tool when you need:
- Detailed AI-powered root cause analysis
- Specific code fixes and implementation guidance
- Step-by-step troubleshooting for complex issues
- Understanding why an error is happening in production

What this tool provides:
- Root cause analysis with code-level explanations
- Specific file locations and line numbers where errors occur
- Concrete code fixes you can apply
- Step-by-step implementation guidance

This tool automatically:
1. Checks if analysis already exists (instant results)
2. Starts new AI analysis if needed (~2-5 minutes)
3. Returns complete fix recommendations

<examples>
### User: "What's causing this error? https://my-org.sentry.io/issues/PROJECT-1Z43"

```
analyze_issue_with_seer(issueUrl='https://my-org.sentry.io/issues/PROJECT-1Z43')
```

### User: "Can you help me understand why this is failing in production?"

```
analyze_issue_with_seer(organizationSlug='my-organization', issueId='ERROR-456')
```
</examples>

<hints>
- Use this tool when you need deeper analysis beyond basic issue details
- If the user provides an issueUrl, extract it and use that parameter alone
- The analysis includes actual code snippets and fixes, not just error descriptions
- Results are cached - subsequent calls return instantly
</hints>

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "issueId": {
      "type": "string",
      "description": "The Issue ID. e.g. `PROJECT-1Z43`"
    },
    "issueUrl": {
      "type": "string",
      "format": "uri",
      "description": "The URL of the issue. e.g. https://my-organization.sentry.io/issues/PROJECT-1Z43"
    },
    "regionUrl": {
      "anyOf": [
        {
          "type": "string",
          "description": "The region URL for the organization you're querying, if known. For Sentry's Cloud Service (sentry.io), this is typically the region-specific URL like 'https://us.sentry.io'. For self-hosted Sentry installations, this parameter is usually not needed and should be omitted. You can find the correct regionUrl from the organization details using the `find_organizations()` tool."
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "description": "The region URL for the organization you're querying, if known. For Sentry's Cloud Service (sentry.io), this is typically the region-specific URL like 'https://us.sentry.io'. For self-hosted Sentry installations, this parameter is usually not needed and should be omitted. You can find the correct regionUrl from the organization details using the `find_organizations()` tool."
    },
    "instruction": {
      "type": "string",
      "description": "Optional custom instruction for the AI analysis"
    },
    "organizationSlug": {
      "type": "string",
      "description": "The organization's slug. You can find a existing list of organizations you have access to using the `find_organizations()` tool."
    }
  },
  "additionalProperties": false
}
```

### search_issues

**Description:** Search for grouped issues/problems in Sentry - returns a LIST of issues, NOT counts or aggregations.

Uses AI to translate natural language queries into Sentry issue search syntax.
Returns grouped issues with metadata like title, status, and user count.

USE THIS TOOL WHEN USERS WANT:
- A LIST of issues: 'show me issues', 'what problems do we have'
- Filtered issue lists: 'unresolved issues', 'critical bugs'
- Issues by impact: 'errors affecting more than 100 users'
- Issues by assignment: 'issues assigned to me'
- User feedback: 'show me user feedback', 'feedback from last week'

DO NOT USE FOR COUNTS/AGGREGATIONS:
- 'how many errors' → use search_events
- 'count of issues' → use search_events
- 'total number of errors today' → use search_events
- 'sum/average/statistics' → use search_events

ALSO DO NOT USE FOR:
- Individual error events with timestamps → use search_events
- Details about a specific issue ID → use get_issue_details

REMEMBER: This tool returns a LIST of issues, not counts or statistics!

<examples>
search_issues(organizationSlug='my-org', naturalLanguageQuery='critical bugs from last week')
search_issues(organizationSlug='my-org', naturalLanguageQuery='unhandled errors affecting 100+ users')
search_issues(organizationSlug='my-org', naturalLanguageQuery='issues assigned to me')
search_issues(organizationSlug='my-org', naturalLanguageQuery='user feedback from production')
</examples>

<hints>
- If the user passes a parameter in the form of name/otherName, it's likely in the format of <organizationSlug>/<projectSlugOrId>.
- Parse org/project notation directly without calling find_organizations or find_projects.
- The projectSlugOrId parameter accepts both project slugs (e.g., 'my-project') and numeric IDs (e.g., '123456').
</hints>

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "organizationSlug",
    "naturalLanguageQuery"
  ],
  "properties": {
    "limit": {
      "type": "number",
      "default": 10,
      "maximum": 100,
      "minimum": 1,
      "description": "Maximum number of issues to return"
    },
    "regionUrl": {
      "anyOf": [
        {
          "type": "string",
          "description": "The region URL for the organization you're querying, if known. For Sentry's Cloud Service (sentry.io), this is typically the region-specific URL like 'https://us.sentry.io'. For self-hosted Sentry installations, this parameter is usually not needed and should be omitted. You can find the correct regionUrl from the organization details using the `find_organizations()` tool."
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "description": "The region URL for the organization you're querying, if known. For Sentry's Cloud Service (sentry.io), this is typically the region-specific URL like 'https://us.sentry.io'. For self-hosted Sentry installations, this parameter is usually not needed and should be omitted. You can find the correct regionUrl from the organization details using the `find_organizations()` tool."
    },
    "projectSlugOrId": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "description": "The project's slug or numeric ID (optional)"
    },
    "organizationSlug": {
      "type": "string",
      "description": "The organization's slug. You can find a existing list of organizations you have access to using the `find_organizations()` tool."
    },
    "includeExplanation": {
      "type": "boolean",
      "default": false,
      "description": "Include explanation of how the query was translated"
    },
    "naturalLanguageQuery": {
      "type": "string",
      "minLength": 1,
      "description": "Natural language description of issues to search for"
    }
  },
  "additionalProperties": false
}
```

### search_issue_events

**Description:** Search and filter events within a specific issue using natural language queries.

Use this to filter events by time, environment, release, user, trace ID, or other tags. The tool automatically constrains results to the specified issue.

For cross-issue searches use search_issues, for single event details use get_issue_details.

<examples>
search_issue_events(issueId='MCP-41', organizationSlug='my-org', naturalLanguageQuery='from last hour')
search_issue_events(issueUrl='https://sentry.io/.../issues/123/', naturalLanguageQuery='production with release v1.0')
</examples>

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "naturalLanguageQuery"
  ],
  "properties": {
    "limit": {
      "type": "number",
      "default": 50,
      "maximum": 100,
      "minimum": 1,
      "description": "Maximum number of events to return (1-100, default: 50)"
    },
    "issueId": {
      "type": "string",
      "description": "Issue ID (e.g., 'MCP-41', 'PROJECT-123'). Requires organizationSlug. Alternatively, use issueUrl."
    },
    "issueUrl": {
      "type": "string",
      "format": "uri",
      "description": "Full Sentry issue URL (e.g., 'https://sentry.io/organizations/my-org/issues/123/'). Includes both organization and issue ID."
    },
    "regionUrl": {
      "anyOf": [
        {
          "type": "string",
          "description": "The region URL for the organization you're querying, if known. For Sentry's Cloud Service (sentry.io), this is typically the region-specific URL like 'https://us.sentry.io'. For self-hosted Sentry installations, this parameter is usually not needed and should be omitted. You can find the correct regionUrl from the organization details using the `find_organizations()` tool."
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "description": "Sentry region URL. Optional - defaults to main region."
    },
    "projectSlug": {
      "anyOf": [
        {
          "type": "string",
          "description": "The project's slug. You can find a list of existing projects in an organization using the `find_projects()` tool."
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "description": "Project slug for better tag discovery. Optional - helps find project-specific tags."
    },
    "organizationSlug": {
      "anyOf": [
        {
          "type": "string",
          "description": "The organization's slug. You can find a existing list of organizations you have access to using the `find_organizations()` tool."
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "description": "Organization slug. Required when using issueId. Not needed when using issueUrl."
    },
    "includeExplanation": {
      "type": "boolean",
      "default": false,
      "description": "Include explanation of how the natural language query was translated to Sentry syntax"
    },
    "naturalLanguageQuery": {
      "type": "string",
      "minLength": 1,
      "description": "Natural language description of what events you want to find within this issue. Examples: 'from last hour', 'production with release v1.0', 'affecting user alice@example.com', 'with trace ID abc123'"
    }
  },
  "additionalProperties": false
}
```

