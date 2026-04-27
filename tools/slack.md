# Tool Server: slack

**ID:** 9fe76ad0-10ce-4eeb-9cc0-d6359eb707bf

**Short Description:** Manage your work in Slack

## Description

Get Sidekick and agents you build to help you keep up with what's happening in Slack (across multiple workspaces).

## Tools (11)

### listWorkspaces

**Description:** Get Slack workspaces available on this tool for this user.

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
    "workspaces"
  ],
  "properties": {
    "workspaces": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "teamId",
          "teamName",
          "type"
        ],
        "properties": {
          "type": {
            "enum": [
              "slack"
            ],
            "type": "string"
          },
          "teamId": {
            "type": "string"
          },
          "teamName": {
            "type": "string"
          },
          "teamDomain": {
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

### listChannels

**Description:** List all channels in a Slack workspace

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "teamId"
  ],
  "properties": {
    "teamId": {
      "type": "string",
      "description": "The Slack workspace team ID (NOT team name). REQUIRED: Use the teamId field from listWorkspaces response (e.g., T01ABC123XY, NOT 'ExampleCo')"
    },
    "excludeArchived": {
      "type": "boolean"
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
    "channels"
  ],
  "properties": {
    "channels": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "id",
          "name",
          "isChannel",
          "isGroup",
          "isIm",
          "isMpim",
          "isPrivate",
          "isArchived",
          "isMember"
        ],
        "properties": {
          "id": {
            "type": "string"
          },
          "isIm": {
            "type": "boolean"
          },
          "name": {
            "type": "string"
          },
          "topic": {
            "type": "object",
            "required": [
              "value",
              "creator",
              "lastSet"
            ],
            "properties": {
              "value": {
                "type": "string"
              },
              "creator": {
                "type": "string"
              },
              "lastSet": {
                "type": "number"
              }
            },
            "additionalProperties": false
          },
          "isMpim": {
            "type": "boolean"
          },
          "isGroup": {
            "type": "boolean"
          },
          "purpose": {
            "type": "object",
            "required": [
              "value",
              "creator",
              "lastSet"
            ],
            "properties": {
              "value": {
                "type": "string"
              },
              "creator": {
                "type": "string"
              },
              "lastSet": {
                "type": "number"
              }
            },
            "additionalProperties": false
          },
          "isMember": {
            "type": "boolean"
          },
          "isChannel": {
            "type": "boolean"
          },
          "isPrivate": {
            "type": "boolean"
          },
          "isArchived": {
            "type": "boolean"
          },
          "numMembers": {
            "type": "number"
          }
        },
        "additionalProperties": false
      }
    }
  },
  "additionalProperties": false
}
```

### getChannelInfo

**Description:** Get detailed information about a specific Slack channel

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "teamId",
    "channelId"
  ],
  "properties": {
    "teamId": {
      "type": "string",
      "description": "The Slack workspace team ID (NOT team name). REQUIRED: Use the teamId field from listWorkspaces response (e.g., T01ABC123XY, NOT 'ExampleCo')"
    },
    "channelId": {
      "type": "string"
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
    "channel"
  ],
  "properties": {
    "channel": {
      "type": "object",
      "required": [
        "id",
        "name",
        "isChannel",
        "isGroup",
        "isIm",
        "isMpim",
        "isPrivate",
        "isArchived",
        "isMember"
      ],
      "properties": {
        "id": {
          "type": "string"
        },
        "isIm": {
          "type": "boolean"
        },
        "name": {
          "type": "string"
        },
        "topic": {
          "type": "object",
          "required": [
            "value",
            "creator",
            "lastSet"
          ],
          "properties": {
            "value": {
              "type": "string"
            },
            "creator": {
              "type": "string"
            },
            "lastSet": {
              "type": "number"
            }
          },
          "additionalProperties": false
        },
        "isMpim": {
          "type": "boolean"
        },
        "isGroup": {
          "type": "boolean"
        },
        "purpose": {
          "type": "object",
          "required": [
            "value",
            "creator",
            "lastSet"
          ],
          "properties": {
            "value": {
              "type": "string"
            },
            "creator": {
              "type": "string"
            },
            "lastSet": {
              "type": "number"
            }
          },
          "additionalProperties": false
        },
        "isMember": {
          "type": "boolean"
        },
        "isChannel": {
          "type": "boolean"
        },
        "isPrivate": {
          "type": "boolean"
        },
        "isArchived": {
          "type": "boolean"
        },
        "numMembers": {
          "type": "number"
        }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

### listMessages

**Description:** List messages in a Slack channel

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "teamId",
    "channelId"
  ],
  "properties": {
    "limit": {
      "type": "number"
    },
    "cursor": {
      "type": "string"
    },
    "teamId": {
      "type": "string",
      "description": "The Slack workspace team ID (NOT team name). REQUIRED: Use the teamId field from listWorkspaces response (e.g., T01ABC123XY, NOT 'ExampleCo')"
    },
    "channelId": {
      "type": "string"
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
    "messages"
  ],
  "properties": {
    "messages": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "type",
          "text",
          "ts"
        ],
        "properties": {
          "ts": {
            "type": "string"
          },
          "text": {
            "type": "string"
          },
          "type": {
            "type": "string"
          },
          "user": {
            "type": "string"
          },
          "threadTs": {
            "type": "string"
          },
          "userName": {
            "type": "string",
            "description": "Human-readable username (display name or real name)"
          },
          "replyCount": {
            "type": "number"
          }
        },
        "additionalProperties": false
      }
    },
    "nextCursor": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

### getThread

**Description:** Get all messages in a Slack thread

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "teamId",
    "channelId",
    "threadTs"
  ],
  "properties": {
    "teamId": {
      "type": "string",
      "description": "The Slack workspace team ID (NOT team name). REQUIRED: Use the teamId field from listWorkspaces response (e.g., T01ABC123XY, NOT 'ExampleCo')"
    },
    "threadTs": {
      "type": "string"
    },
    "channelId": {
      "type": "string"
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
    "messages"
  ],
  "properties": {
    "messages": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "type",
          "text",
          "ts"
        ],
        "properties": {
          "ts": {
            "type": "string"
          },
          "text": {
            "type": "string"
          },
          "type": {
            "type": "string"
          },
          "user": {
            "type": "string"
          },
          "threadTs": {
            "type": "string"
          },
          "userName": {
            "type": "string",
            "description": "Human-readable username (display name or real name)"
          }
        },
        "additionalProperties": false
      }
    }
  },
  "additionalProperties": false
}
```

### sendMessage

**Description:** Send a message to a Slack channel or thread. Automatically detects and converts standard Markdown (e.g., **bold**, [links](url), - lists) to Slack's mrkdwn format.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "teamId",
    "channelId",
    "text"
  ],
  "properties": {
    "text": {
      "type": "string",
      "description": "The message text to send. Supports both standard Markdown (e.g., **bold**, - list items, [links](url)) and Slack's native mrkdwn syntax. Markdown is automatically detected and converted to Slack format."
    },
    "teamId": {
      "type": "string",
      "description": "The Slack workspace team ID (NOT team name). REQUIRED: Use the teamId field from listWorkspaces response (e.g., T01ABC123XY, NOT 'ExampleCo')"
    },
    "threadTs": {
      "type": "string"
    },
    "channelId": {
      "type": "string"
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
    "message"
  ],
  "properties": {
    "message": {
      "type": "object",
      "required": [
        "ts",
        "channel"
      ],
      "properties": {
        "ts": {
          "type": "string"
        },
        "channel": {
          "type": "string"
        }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

### searchMessages

**Description:** Search for messages across a Slack workspace

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "teamId",
    "query"
  ],
  "properties": {
    "page": {
      "type": "number"
    },
    "count": {
      "type": "number"
    },
    "query": {
      "type": "string"
    },
    "teamId": {
      "type": "string",
      "description": "The Slack workspace team ID (NOT team name). REQUIRED: Use the teamId field from listWorkspaces response (e.g., T01ABC123XY, NOT 'ExampleCo')"
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
    "messages",
    "total"
  ],
  "properties": {
    "total": {
      "type": "number"
    },
    "messages": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "type",
          "text",
          "ts"
        ],
        "properties": {
          "ts": {
            "type": "string"
          },
          "text": {
            "type": "string"
          },
          "type": {
            "type": "string"
          },
          "user": {
            "type": "string"
          },
          "threadTs": {
            "type": "string"
          },
          "userName": {
            "type": "string",
            "description": "Human-readable username (display name or real name)"
          },
          "channelId": {
            "type": [
              "string",
              "null"
            ]
          }
        },
        "additionalProperties": false
      }
    }
  },
  "additionalProperties": false
}
```

### generateSlackUrl

**Description:** Generate a Slack URL to link to a workspace, channel, message, or thread. Use this tool when you need to provide a clickable link to Slack content instead of just showing IDs. The tool automatically determines the URL type: teamId only = workspace, teamId + channelId = channel, teamId + channelId + messageTs = message, teamId + channelId + messageTs + threadTs = thread.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "teamId"
  ],
  "properties": {
    "teamId": {
      "type": "string",
      "description": "The Slack workspace team ID (NOT team name). REQUIRED: Use the teamId field from listWorkspaces response (e.g., T01ABC123XY, NOT 'ExampleCo')"
    },
    "threadTs": {
      "type": "string",
      "description": "The thread parent message timestamp. When provided, generates a thread URL with ?thread_ts parameter."
    },
    "channelId": {
      "type": "string",
      "description": "The channel ID (e.g., C07RAJT1272). Required for channel, message, and thread URLs."
    },
    "messageTs": {
      "type": "string",
      "description": "The message timestamp (e.g., 1760379308.402119). Required for message and thread URLs."
    },
    "teamDomain": {
      "type": "string",
      "description": "The Slack workspace domain (e.g., 'sdsa-ai' for sdsa-ai.slack.com). RECOMMENDED: Use the teamDomain field from listWorkspaces. If provided, generates workspace-specific URLs (*.slack.com/archives/...) instead of app.slack.com URLs."
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
    "url",
    "urlType"
  ],
  "properties": {
    "url": {
      "type": "string",
      "description": "The generated Slack URL"
    },
    "urlType": {
      "enum": [
        "workspace",
        "channel",
        "message",
        "thread"
      ],
      "type": "string",
      "description": "The type of URL generated"
    }
  },
  "additionalProperties": false
}
```

### parseSlackUrl

**Description:** Parse a Slack URL and extract the teamId, channelId, messageTs, and threadTs. Useful when a user provides a Slack link and you need to extract the IDs to use with other Slack tools.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "url"
  ],
  "properties": {
    "url": {
      "type": "string",
      "description": "The Slack URL to parse (e.g., https://app.slack.com/client/T01ABC/C01DEF/p1234567890123456)"
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
    "result": {
      "type": "object",
      "required": [
        "urlType"
      ],
      "properties": {
        "teamId": {
          "type": "string"
        },
        "urlType": {
          "enum": [
            "workspace",
            "channel",
            "message",
            "thread"
          ],
          "type": "string"
        },
        "threadTs": {
          "type": "string"
        },
        "channelId": {
          "type": "string"
        },
        "messageTs": {
          "type": "string"
        },
        "teamDomain": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "success": {
      "type": "boolean"
    }
  },
  "additionalProperties": false
}
```

### getUserInfo

**Description:** Get detailed information about a specific Slack user by their user ID. Use this to resolve user IDs (e.g., U01ABC123 from message.user field) to actual user profiles with names, emails, and other details.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "teamId",
    "slackUserId"
  ],
  "properties": {
    "teamId": {
      "type": "string",
      "description": "The Slack workspace team ID (NOT team name). REQUIRED: Use the teamId field from listWorkspaces response (e.g., T01ABC123XY, NOT 'ExampleCo')"
    },
    "slackUserId": {
      "type": "string",
      "description": "The Slack user ID to get information about (e.g., U01ABC123). This is found in the 'user' field of messages."
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
    "user"
  ],
  "properties": {
    "user": {
      "type": "object",
      "required": [
        "id",
        "teamId",
        "name",
        "isBot",
        "isAdmin",
        "isOwner",
        "isPrimaryOwner",
        "isRestricted",
        "isUltraRestricted",
        "deleted"
      ],
      "properties": {
        "id": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "email": {
          "type": "string"
        },
        "isBot": {
          "type": "boolean"
        },
        "teamId": {
          "type": "string"
        },
        "deleted": {
          "type": "boolean"
        },
        "isAdmin": {
          "type": "boolean"
        },
        "isOwner": {
          "type": "boolean"
        },
        "profile": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string"
            },
            "image24": {
              "type": "string"
            },
            "image32": {
              "type": "string"
            },
            "image48": {
              "type": "string"
            },
            "image72": {
              "type": "string"
            },
            "image192": {
              "type": "string"
            },
            "image512": {
              "type": "string"
            },
            "realName": {
              "type": "string"
            },
            "avatarHash": {
              "type": "string"
            },
            "statusText": {
              "type": "string"
            },
            "displayName": {
              "type": "string"
            },
            "statusEmoji": {
              "type": "string"
            }
          },
          "additionalProperties": false
        },
        "realName": {
          "type": "string"
        },
        "displayName": {
          "type": "string"
        },
        "isRestricted": {
          "type": "boolean"
        },
        "isPrimaryOwner": {
          "type": "boolean"
        },
        "isUltraRestricted": {
          "type": "boolean"
        }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

### listUsers

**Description:** List all users in a Slack workspace. Returns basic user information for all members. Useful for discovering users, building user directories, or bulk user operations.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "teamId"
  ],
  "properties": {
    "limit": {
      "type": "number"
    },
    "cursor": {
      "type": "string"
    },
    "teamId": {
      "type": "string",
      "description": "The Slack workspace team ID (NOT team name). REQUIRED: Use the teamId field from listWorkspaces response (e.g., T01ABC123XY, NOT 'ExampleCo')"
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
    "users"
  ],
  "properties": {
    "users": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "id",
          "teamId",
          "name",
          "isBot",
          "deleted"
        ],
        "properties": {
          "id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "isBot": {
            "type": "boolean"
          },
          "teamId": {
            "type": "string"
          },
          "deleted": {
            "type": "boolean"
          },
          "realName": {
            "type": "string"
          },
          "displayName": {
            "type": "string"
          }
        },
        "additionalProperties": false
      }
    },
    "nextCursor": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

