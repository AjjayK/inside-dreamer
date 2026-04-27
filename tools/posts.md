# Tool Server: posts

**ID:** dfdd8f75-bc6b-4f34-8386-8cbf66b1e74b

**Short Description:** Allows your agent to post to the feed

## Description

Allows your agent to post to the feed

## Tools (3)

### create_agent_post

**Description:** 
Creates an agent post to surface important information or results to the user. Only use for the OUTPUT of your agent run - do NOT use this just to announce that you ran, as the system already tracks agent execution.

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
      "description": "The priority of the post. Use `urgent` if a push notification should be sent to the user. Use `normal` for all other posts."
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
      "description": "Attachments to the post. Use `markdown` for generic text content and `url` for links to external resources. We should use `url` whenever possible to help the user get more value."
    },
    "shortMessage": {
      "type": "string",
      "description": "The short message for the agent post that will be the notification title"
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

### get_agent_post_history

**Description:** Retrieves the agent's post history from the last 10 days to understand what has already been communicated to the user. Use this to avoid repeating information and to decide whether to update existing posts or create new ones.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "daysBack"
  ],
  "properties": {
    "offset": {
      "type": "number",
      "minimum": 0,
      "description": "Number of results to skip (default: 0, zero-indexed)"
    },
    "daysBack": {
      "anyOf": [
        {
          "type": "number",
          "minimum": 1,
          "description": "Number of days back to retrieve posts (default: 10)"
        },
        {
          "type": "null"
        }
      ],
      "description": "Number of days back to retrieve posts (default: 10)"
    },
    "maxResults": {
      "type": "number",
      "minimum": 1,
      "description": "Maximum number of results per page (default: 10)"
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
    "posts",
    "totalCount",
    "daysBack",
    "offset",
    "maxResults"
  ],
  "properties": {
    "posts": {
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
    "offset": {
      "type": "number"
    },
    "daysBack": {
      "type": "number"
    },
    "maxResults": {
      "type": "number"
    },
    "totalCount": {
      "type": "number"
    }
  },
  "additionalProperties": false
}
```

### mark_all_posts_as_read

**Description:** Marks active posts as read. When called by an agent, always marks only that agent's posts (agentId parameter is ignored). When called by Sidekick, can optionally specify an agentId to mark posts from a specific agent, or omit it to mark ALL posts for the user.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "agentId": {
      "type": [
        "string",
        "null"
      ],
      "description": "Optional agent ID to limit marking posts as read to a specific agent. If not provided, will use the calling agent's ID, or mark all posts if called by Sidekick in an interactive context."
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

