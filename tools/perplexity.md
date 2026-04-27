# Tool Server: perplexity

**ID:** 5c764c03-8f4c-41ba-bb1c-7001eb047ec2

**Short Description:** Research topics and answer questions

## Description

Research topics and answer questions with Perplexity

## Tools (2)

### sonarSearch

**Description:** Fast answers with reliable search results. CHEAPEST option - use this for quick facts, definitions, sports, health, finance content, or summarizing books/TV shows/movies. Perplexity is not good for up to the minute news - results are often outdated.

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
      "description": "The search query or question to search for using Perplexity's Sonar model"
    },
    "search_domain_filter": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "maxItems": 20,
      "description": "Filter search results to specific domains/URLs (allowlist) or exclude domains/URLs (denylist with - prefix). Up to 20 entries. Use domain names (e.g., 'wikipedia.org') or full URLs (e.g., 'https://en.wikipedia.org/wiki/Chess'). Denylist mode: prefix with '-' (e.g., '-reddit.com'). Cannot mix allowlist and denylist in the same request."
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
    "result": {
      "type": "string"
    },
    "sources": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "title",
          "url"
        ],
        "properties": {
          "url": {
            "type": "string",
            "format": "uri"
          },
          "title": {
            "type": "string"
          }
        },
        "additionalProperties": false
      }
    },
    "success": {
      "type": "boolean"
    }
  },
  "additionalProperties": false
}
```

### sonarProSearch

**Description:** Advanced search model for complex queries with deeper content understanding and 2x more search results than standard Sonar. MORE EXPENSIVE - use for complex research questions, comparative analysis across multiple sources, information synthesis and detailed reporting. Perplexity is not good for up to the minute news - results are often outdated.

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
      "description": "The complex research query requiring depth using Perplexity's Sonar Pro model"
    },
    "search_domain_filter": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "maxItems": 20,
      "description": "Filter search results to specific domains/URLs (allowlist) or exclude domains/URLs (denylist with - prefix). Up to 20 entries. Use domain names (e.g., 'wikipedia.org') or full URLs (e.g., 'https://en.wikipedia.org/wiki/Chess'). Denylist mode: prefix with '-' (e.g., '-reddit.com'). Cannot mix allowlist and denylist in the same request."
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
    "result": {
      "type": "string"
    },
    "sources": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "title",
          "url"
        ],
        "properties": {
          "url": {
            "type": "string",
            "format": "uri"
          },
          "title": {
            "type": "string"
          }
        },
        "additionalProperties": false
      }
    },
    "success": {
      "type": "boolean"
    }
  },
  "additionalProperties": false
}
```

