# Tool Server: timers

**ID:** 17e7bce1-5590-4f7f-a3a8-84aa3dee1549

**Short Description:** Set timers to run tasks at a future time

## Description

Set and manage timers to run tasks at a future time. This can be used to run tasks after a delay, run a task once at a specific timer, or defer processing to a later time.

## Tools (3)

### set

**Description:** Set a timer for this agent to run at a future time. Like setTimeout in JavaScript - one-time execution.

Use this when you need to:
- Run a task after a delay (e.g., "remind me in 5 hours")
- Schedule a specific future time (e.g., "run at 3 AM tomorrow")
- Defer processing to a later time

The timer will execute the specified entrypoint function with the given parameters at the scheduled time.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "scheduledTime"
  ],
  "properties": {
    "params": {
      "type": "object",
      "description": "Optional parameters to pass to the function",
      "additionalProperties": {}
    },
    "entrypoint": {
      "type": "string",
      "default": "main",
      "description": "The function name to call (defaults to 'main')"
    },
    "scheduledTime": {
      "type": "string",
      "description": "ISO 8601 timestamp when to run (e.g., '2024-10-29T20:00:00Z')"
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
    "error": {
      "type": "string"
    },
    "agentId": {
      "type": "string"
    },
    "success": {
      "type": "boolean"
    },
    "timerId": {
      "type": "string"
    },
    "entrypoint": {
      "type": "string"
    },
    "scheduledTime": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

### list

**Description:** List all pending timers for this agent

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
    "success"
  ],
  "properties": {
    "error": {
      "type": "string"
    },
    "success": {
      "type": "boolean"
    },
    "totalCount": {
      "type": "number"
    },
    "agentTimers": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "id",
          "scheduledTime",
          "entrypoint",
          "createdAt"
        ],
        "properties": {
          "id": {
            "type": "string"
          },
          "params": {
            "type": "object",
            "additionalProperties": {}
          },
          "createdAt": {
            "type": "string"
          },
          "entrypoint": {
            "type": "string"
          },
          "scheduledTime": {
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

### cancel

**Description:** Cancel a pending timer

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "agentTimerId"
  ],
  "properties": {
    "agentTimerId": {
      "type": "string",
      "description": "The ID of the timer to cancel"
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
    "error": {
      "type": "string"
    },
    "success": {
      "type": "boolean"
    }
  },
  "additionalProperties": false
}
```

