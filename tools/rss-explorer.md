# Tool Server: rss-explorer

**ID:** 565fb88b-a5e5-49d2-9c11-453beae728b0

**Short Description:** Explore popular RSS feeds

## Description

Explore popular RSS feeds

## Tools (2)

### fetchRSSFeed

**Description:** Fetch and RSS feed by its URL and returns parsed title, description and content.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "url",
    "limit"
  ],
  "properties": {
    "url": {
      "type": "string",
      "format": "uri",
      "description": "The RSS feed URL to fetch and parse"
    },
    "limit": {
      "type": "number",
      "description": "Maximum number of items to return"
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
    "url": {
      "type": "string",
      "format": "uri"
    },
    "feed": {
      "type": "object",
      "required": [
        "items"
      ],
      "properties": {
        "link": {
          "type": "string"
        },
        "items": {
          "type": "array",
          "items": {
            "type": "object",
            "required": [
              "title",
              "description",
              "content",
              "link"
            ],
            "properties": {
              "link": {
                "type": "string"
              },
              "title": {
                "type": "string"
              },
              "content": {
                "type": "string"
              },
              "imageUrl": {
                "type": "string"
              },
              "description": {
                "type": "string"
              }
            },
            "additionalProperties": false
          }
        },
        "title": {
          "type": "string"
        },
        "description": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
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
    "success": {
      "type": "boolean"
    },
    "fetchedAt": {
      "type": "string"
    },
    "itemCount": {
      "type": "number"
    }
  },
  "additionalProperties": false
}
```

### listRSSFeeds

**Description:** List RSS feeds and a description of what they are about, the categories they belong to, and the URL of the feed.

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

**Output Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "success",
    "feeds",
    "feedCount",
    "categories",
    "fetchedAt"
  ],
  "properties": {
    "feeds": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "required": [
          "url",
          "focus",
          "category"
        ],
        "properties": {
          "url": {
            "type": "string",
            "format": "uri"
          },
          "focus": {
            "type": "string"
          },
          "category": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        "additionalProperties": false
      }
    },
    "success": {
      "type": "boolean"
    },
    "feedCount": {
      "type": "number"
    },
    "fetchedAt": {
      "type": "string"
    },
    "categories": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "additionalProperties": false
}
```

