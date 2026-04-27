# Tool Server: sidekicktasks

**ID:** 7fc68b05-7387-4c5e-b08e-615eeeb61d91

**Short Description:** sidekick tasks - powerful sidekick subagent

## Description

Sidekick Tasks - Your Most Powerful Tool

## Tools (3)

### create_sidekick_task

**Description:** Creates a sidekick task to execute a specific task autonomously in a sandboxed environment.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "description",
    "instructions"
  ],
  "properties": {
    "postToFeed": {
      "type": "boolean",
      "description": "Whether the task should post to the feed. If completionCallback is not set, this must be true (defaults to true). If completionCallback is set, this defaults to false."
    },
    "description": {
      "type": "string",
      "description": "A short description of what the sidekick task will do (e.g., 'Analyzing logs', 'Generating report')"
    },
    "instructions": {
      "type": "string",
      "description": "Detailed instructions for the sidekick task to execute. Be very specific about what should be done."
    },
    "progressCallback": {
      "type": "string",
      "description": "The name of a server function on the calling agent (which receives string arguments called 'status' (status in active form, e.g. \"Searching for events\") and 'imperativeStatus' (e.g. \"Search for events\")) to call with updates on the progress of the sidekick task."
    },
    "completionCallback": {
      "type": "string",
      "description": "The name of a server function on the calling agent (which can take any shape of typed data as input) to call with the final result of the sidekick task."
    }
  },
  "additionalProperties": false
}
```

**Output Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "success"
  ],
  "properties": {
    "message": {
      "type": "string"
    },
    "success": {
      "type": "boolean"
    },
    "sandboxId": {
      "type": "string"
    },
    "isExisting": {
      "type": "boolean",
      "description": "True if returning an existing running agent (e.g. if a sidekick task is already running for the same user and agent with the same instructions)"
    },
    "ephemeralAgentId": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

### query_running_sidekick_tasks

**Description:** Queries for any currently running sidekick tasks created by this agent. Returns information about all sidekick tasks that were started by the calling agent and are in 'starting' or 'running' state.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {},
  "additionalProperties": false
}
```

**Output Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "runningAgents",
    "count"
  ],
  "properties": {
    "count": {
      "type": "number"
    },
    "runningAgents": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "sandboxId",
          "ephemeralAgentId",
          "description",
          "state",
          "createdAt"
        ],
        "properties": {
          "state": {
            "type": "string"
          },
          "createdAt": {
            "type": "string"
          },
          "sandboxId": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "ephemeralAgentId": {
            "type": "string"
          }
        },
        "additionalProperties": false
      }
    }
  },
  "additionalProperties": false
}
```

### cancel_sidekick_task

**Description:** Cancels a running sidekick task that was created by this agent. The task will be stopped and its sandbox will be destroyed.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "sandboxId"
  ],
  "properties": {
    "sandboxId": {
      "type": "string",
      "description": "The sandbox ID of the sidekick task to cancel"
    }
  },
  "additionalProperties": false
}
```

**Output Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "success"
  ],
  "properties": {
    "message": {
      "type": "string"
    },
    "success": {
      "type": "boolean"
    }
  },
  "additionalProperties": false
}
```

