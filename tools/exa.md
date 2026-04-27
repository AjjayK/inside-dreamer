# Tool Server: exa

**ID:** 8c746439-17cb-424e-8c00-7b56aed01af0

**Short Description:** Search the web

## Description

Enables your sidekick to search the web

## Tools (1)

### exaWebSearch

**Description:** Search the web using Exa and return structured results with advanced filtering and content extraction capabilities. In general, prefer to use Google tools when available. Use this tool only when you think it's better for the job.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "query"
  ],
  "properties": {
    "query": {
      "type": "string",
      "description": "The search query to find relevant web content"
    },
    "summary": {
      "type": "boolean",
      "description": "Include an LLM-generated summary of the page content"
    },
    "numResults": {
      "type": "number",
      "description": "Number of search results to return (default: 10)"
    },
    "maxCharacters": {
      "type": "number",
      "description": "Maximum characters to include in content text"
    },
    "useAutoprompt": {
      "type": "boolean",
      "description": "Use Exa's autoprompt feature"
    },
    "excludeDomains": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Exclude specific domains from results"
    },
    "includeDomains": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Limit results to specific domains"
    },
    "highlightSelector": {
      "type": "string",
      "description": "HTML selector for content to highlight"
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
    "raw": {},
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
        "status": {
          "type": "number"
        },
        "details": {},
        "message": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "query": {
      "type": "string"
    },
    "params": {
      "type": "object",
      "properties": {
        "summary": {
          "type": "boolean"
        },
        "numResults": {
          "type": "number"
        },
        "maxCharacters": {
          "type": "number"
        },
        "useAutoprompt": {
          "type": "boolean"
        },
        "excludeDomains": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "includeDomains": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "highlightSelector": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "results": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "url": {
            "type": "string",
            "format": "uri"
          },
          "text": {
            "type": "string"
          },
          "score": {
            "type": "number"
          },
          "title": {
            "type": "string"
          },
          "author": {
            "type": "string"
          },
          "summary": {
            "type": "string"
          },
          "highlights": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "publishedDate": {
            "type": "string"
          }
        },
        "additionalProperties": false
      }
    },
    "success": {
      "type": "boolean"
    },
    "fetchedAt": {
      "type": "string"
    },
    "totalResults": {
      "type": "number"
    }
  },
  "additionalProperties": false
}
```

