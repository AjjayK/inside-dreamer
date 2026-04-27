# Tool Server: serpapi

**ID:** 0093db23-9572-451d-aad6-6b84499cdd33

**Short Description:** Search the web with SerpApi

## Description

Search the web with SerpApi

## Tools (1)

### search

**Description:** Search the web using SerpAPI Google search engine with comprehensive search results

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "q",
    "location"
  ],
  "properties": {
    "q": {
      "type": "string",
      "description": "The search query to execute"
    },
    "location": {
      "type": "string",
      "description": "Location to search from (e.g., 'Austin, Texas, United States')"
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
    "results": {},
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

