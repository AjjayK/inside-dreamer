# Tool Server: wolfram

**ID:** 18c3c368-b5fd-4266-b7cb-1fedca3694a2

**Short Description:** Computational queries and calculations

## Description

Wolfram|Alpha computational queries, mathematical calculations, scientific data lookups, and factual knowledge retrieval

## Tools (1)

### wolframAlphaQuery

**Description:** Query Wolfram Alpha with natural language and return the LLM API response.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "input"
  ],
  "properties": {
    "input": {
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
    "fetchedAt"
  ],
  "properties": {
    "error": {
      "type": "object",
      "required": [
        "type",
        "message"
      ],
      "properties": {
        "type": {
          "type": "string"
        },
        "message": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "query": {
      "type": "string"
    },
    "result": {
      "type": "string"
    },
    "success": {
      "type": "boolean"
    },
    "fetchedAt": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

