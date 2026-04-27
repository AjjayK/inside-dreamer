# Tool Server: High Score Table

**ID:** c54ba7e8-b8ee-4dce-939f-5c878cb8333a

**Short Description:** Makes it easy for your agentic app to read and write a global high score table and work with other global app state.

## Description

Visit https://hiscore-mcp.dps-437.workers.dev/ to get a token for your unique table (the sidekick can also call tools to do this, but you might want to do it yourself)

Makes it easy for your agentic app to read and write a global high score table and work with other global app state.

## Tools (5)

### create_high_score_table

**Description:** Create a new high score table with a UUID and name, returns an authentication token

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "uuid",
    "name"
  ],
  "properties": {
    "name": {
      "type": "string"
    },
    "uuid": {
      "type": "string",
      "format": "uuid"
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
    "token",
    "uuid",
    "name"
  ],
  "properties": {
    "name": {
      "type": "string"
    },
    "uuid": {
      "type": "string"
    },
    "token": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

### get_high_scores

**Description:** Get sorted high scores from a table (highest first)

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "token"
  ],
  "properties": {
    "limit": {
      "type": "integer",
      "default": 10,
      "exclusiveMinimum": 0
    },
    "token": {
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
    "scores"
  ],
  "properties": {
    "scores": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "name",
          "score"
        ],
        "properties": {
          "name": {
            "type": "string"
          },
          "score": {
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

### insert_score

**Description:** Insert a new score entry into a high score table

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "token",
    "name",
    "score"
  ],
  "properties": {
    "name": {
      "type": "string"
    },
    "score": {
      "type": "number"
    },
    "token": {
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
    "success",
    "name",
    "score"
  ],
  "properties": {
    "name": {
      "type": "string"
    },
    "score": {
      "type": "number"
    },
    "success": {
      "type": "boolean"
    }
  },
  "additionalProperties": false
}
```

### set_val

**Description:** Set a custom key-value pair in a high score table

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "token",
    "key",
    "value"
  ],
  "properties": {
    "key": {
      "type": "string"
    },
    "token": {
      "type": "string"
    },
    "value": {
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
    "success",
    "key",
    "value"
  ],
  "properties": {
    "key": {
      "type": "string"
    },
    "value": {
      "type": "string"
    },
    "success": {
      "type": "boolean"
    }
  },
  "additionalProperties": false
}
```

### get_val

**Description:** Get a custom key-value pair from a high score table

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "token",
    "key"
  ],
  "properties": {
    "key": {
      "type": "string"
    },
    "token": {
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
    "key",
    "value"
  ],
  "properties": {
    "key": {
      "type": "string"
    },
    "value": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

