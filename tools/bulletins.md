# Tool Server: bulletins

**ID:** fc058b64-c462-40aa-b755-dbfb9db67710

**Short Description:** Make posts in your feed

## Description

Tools for creating posts in your feed.

## Tools (3)

### create_agent_bulletin

**Description:** 
Creates an agent bulletin to surface important information or results to the user. Only use for the OUTPUT of your agent run - do NOT use this just to announce that you ran, as the system already tracks agent execution.

Always add source URLs as their own attachment if they exist.


**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "shortMessage",
    "attachments",
    "duration",
    "priority"
  ],
  "properties": {
    "duration": {
      "type": "string",
      "const": "read_once"
    },
    "priority": {
      "anyOf": [
        {
          "enum": [
            "normal",
            "urgent"
          ],
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "description": "The priority of the bulletin. Use `urgent` if a push notification should be sent to the user. Use `normal` for all other bulletins."
    },
    "attachments": {
      "type": "array",
      "items": {
        "anyOf": [
          {
            "type": "object",
            "required": [
              "type",
              "content"
            ],
            "properties": {
              "type": {
                "type": "string",
                "const": "markdown"
              },
              "content": {
                "type": "string",
                "description": "Markdown content to display to the user. Any URLs in the Markdown should also be included as a URL attachment."
              }
            },
            "additionalProperties": false
          },
          {
            "type": "object",
            "required": [
              "type",
              "content"
            ],
            "properties": {
              "type": {
                "type": "string",
                "const": "url"
              },
              "content": {
                "type": "string",
                "description": "A URL to a resource of interest to the user"
              }
            },
            "additionalProperties": false
          }
        ]
      },
      "description": "Attachments to the bulletin. Use `markdown` for generic text content and `url` for links to external resources. We should use `url` whenever possible to help the user get more value."
    },
    "shortMessage": {
      "type": "string",
      "description": "The short message for the agent bulletin that will be the notification title"
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
    "success": {
      "type": "boolean"
    }
  },
  "additionalProperties": false
}
```

### get_agent_bulletin_history

**Description:** Retrieves the agent's bulletin history from the last 10 days to understand what has already been communicated to the user. Use this to avoid repeating information and to decide whether to update existing bulletins or create new ones.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "daysBack"
  ],
  "properties": {
    "daysBack": {
      "anyOf": [
        {
          "type": "number",
          "maximum": 30,
          "minimum": 1,
          "description": "Number of days back to retrieve bulletins (default: 10, max: 30)"
        },
        {
          "type": "null"
        }
      ],
      "description": "Number of days back to retrieve bulletins (default: 10, max: 30)"
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
    "bulletins",
    "totalCount",
    "daysBack"
  ],
  "properties": {
    "daysBack": {
      "type": "number"
    },
    "bulletins": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "id",
          "shortMessage",
          "status",
          "createdAt",
          "hasAttachments",
          "attachmentContents"
        ],
        "properties": {
          "id": {
            "type": "string"
          },
          "status": {
            "type": "string"
          },
          "createdAt": {
            "type": "string"
          },
          "shortMessage": {
            "type": "string"
          },
          "hasAttachments": {
            "type": "boolean"
          },
          "attachmentContents": {
            "type": "string"
          }
        },
        "additionalProperties": false
      }
    },
    "totalCount": {
      "type": "number"
    }
  },
  "additionalProperties": false
}
```

### mark_all_bulletins_as_read

**Description:** Marks all active bulletins as read. Use this when the user has acknowledged or processed all the bulletins and you want to clear their unread status.

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
    "success": {
      "type": "boolean"
    }
  },
  "additionalProperties": false
}
```

