# Tool Server: googlesearch

**ID:** b5d8e37e-aa48-4d72-8175-2b6c0fe1f321

**Short Description:** Search the web with Google

## Description

Google Search - best in class web search tool with Gemini AI grounding for current events, factual queries, and general knowledge

## Tools (2)

### askGemini

**Description:** AI-powered question answering tool that returns a synthesized answer with granular citations.

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
      "description": "The question to answer"
    }
  }
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
    "answer": {
      "type": "string"
    },
    "sources": {
      "type": "array",
      "items": {
        "type": "object",
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
    },
    "fetchedAt": {
      "type": "string"
    },
    "searchQueries": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "groundingSupports": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "text": {
            "type": "string"
          },
          "endIndex": {
            "type": "number"
          },
          "startIndex": {
            "type": "number"
          },
          "sourceIndices": {
            "type": "array",
            "items": {
              "type": "number"
            }
          }
        },
        "additionalProperties": false
      }
    }
  },
  "additionalProperties": false
}
```

### googleSearch

**Description:** USE THIS AS YOUR DEFAULT WEB SEARCH TOOL. Traditional "ten blue links" web search results from Google. Returns a list of search results with snippets, titles, and URLs - similar to what you see on a Google search results page. Use this when you want: direct access to individual web sources, to scan multiple result snippets quickly, to get a variety of perspectives without AI synthesis, or when you need the specific URLs for citation. Each result includes the exact text snippet from the source and its URL.

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
      "description": "The search query - use natural language or keywords, just like searching on Google"
    }
  }
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
    "results": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "url": {
            "type": "string",
            "format": "uri"
          },
          "title": {
            "type": "string"
          },
          "snippet": {
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
    "searchQueries": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "additionalProperties": false
}
```

