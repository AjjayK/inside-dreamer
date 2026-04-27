# Tool Server: news

**ID:** 2984d5b3-be81-4618-bbba-e75822bf9b18

**Short Description:** Access news headlines and summaries

## Description

Access news headlines and summaries from a wide range of sources

## Tools (5)

### headlines

**Description:** PRIMARY TOOL FOR BREAKING NEWS AND CURRENT EVENTS: Fetches today's headlines from 10+ live news sources (Ars Technica, Axios, BBC, CNN, Fox News, Guardian, Hacker News, NY Post, NYTimes, Semafor, Techmeme) filtered by topic. Use for: 'What's happening with X?', 'Latest news about Y', breaking stories, current events. Results include summaries when available; use webcrawl's 'crawlUrl' tool to fetch full article content when needed. For searching archives, use 'searchNews' instead. All timestamps are in UTC.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "topic"
  ],
  "properties": {
    "topic": {
      "type": "string",
      "description": "The news topic to get headlines for (e.g., 'artificial intelligence', 'politics', 'climate change', 'tech industry', 'sports')"
    },
    "sources": {
      "type": "array",
      "items": {
        "enum": [
          "hacker_news",
          "cnn",
          "bbc",
          "nytimes",
          "nypost",
          "guardian",
          "fox_news",
          "axios",
          "semafor",
          "techmeme",
          "ars_technica"
        ],
        "type": "string"
      },
      "description": "Optional: Filter to specific sources. Available: ars_technica, axios, bbc, cnn, fox_news, guardian, hacker_news, nypost, nytimes, semafor, techmeme."
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
    "count": {
      "type": "number",
      "description": "Number of stories returned"
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
      "description": "Error details if success=false",
      "additionalProperties": false
    },
    "topic": {
      "type": "string",
      "description": "The topic that was searched"
    },
    "sources": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Sources that returned results"
    },
    "success": {
      "type": "boolean",
      "description": "Whether the request succeeded"
    },
    "fetchedAt": {
      "type": "string",
      "description": "When data was fetched (ISO 8601 UTC)"
    },
    "headlines": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "sourceId",
          "source",
          "title",
          "url",
          "rankScore"
        ],
        "properties": {
          "url": {
            "type": "string",
            "description": "Canonical link to full article"
          },
          "score": {
            "type": "number",
            "description": "Engagement score (e.g., HN points)"
          },
          "title": {
            "type": "string",
            "description": "Article headline"
          },
          "author": {
            "type": "string",
            "description": "Article author name"
          },
          "source": {
            "type": "string",
            "description": "Human-readable source name"
          },
          "content": {
            "type": "string",
            "description": "Full article content. Three modes: (1) Full text for self-posts like HN 'Ask HN', (2) URL to lightweight readable version like lite.cnn.com, (3) undefined - use summary or fetch from url"
          },
          "pubDate": {
            "type": "string",
            "description": "Publication date (ISO 8601 UTC, e.g., 2024-01-15T14:30:00.000Z)"
          },
          "summary": {
            "type": "string",
            "description": "Short article preview/excerpt from feed"
          },
          "imageUrl": {
            "type": "string",
            "description": "Article thumbnail/image URL"
          },
          "sourceId": {
            "enum": [
              "hacker_news",
              "cnn",
              "bbc",
              "nytimes",
              "nypost",
              "guardian",
              "fox_news",
              "axios",
              "semafor",
              "techmeme",
              "ars_technica"
            ],
            "type": "string",
            "description": "Source identifier"
          },
          "rankScore": {
            "type": "number",
            "description": "Ranking score (higher = more relevant/recent)"
          },
          "description": {
            "type": "string",
            "description": "DEPRECATED: use 'summary'. Article summary if available"
          },
          "sourceLogoUrl": {
            "type": "string",
            "description": "URL to source's logo image"
          }
        },
        "additionalProperties": false
      },
      "description": "Stories sorted by rankScore descending"
    }
  },
  "additionalProperties": false
}
```

### searchNews

**Description:** ARCHIVE SEARCH: Search news archives using sources with real search APIs. Best for finding specific stories, historical news, or searching by keywords with date ranges. Results include summaries when available; use webcrawl's 'crawlUrl' tool to fetch full article content when needed. For current news on a topic, use the 'headlines' tool instead. All timestamps are in UTC.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "query"
  ],
  "properties": {
    "limit": {
      "type": "number",
      "default": 30,
      "maximum": 100,
      "minimum": 1,
      "description": "Maximum number of results to return (1-100, default: 30)"
    },
    "query": {
      "type": "string",
      "description": "Search query - keywords to search for in article archives"
    },
    "topic": {
      "type": "string",
      "description": "Optional: Topic for AI relevance filtering to improve result quality (e.g., 'artificial intelligence', 'politics')."
    },
    "toDate": {
      "type": "string",
      "description": "Optional: End date in YYYY-MM-DD format (UTC)."
    },
    "sources": {
      "type": "array",
      "items": {
        "enum": [
          "hacker_news"
        ],
        "type": "string"
      },
      "description": "Optional: Which search sources to use. Available: 'hacker_news' (Algolia HN Search). Default: hacker_news."
    },
    "fromDate": {
      "type": "string",
      "description": "Optional: Start date in YYYY-MM-DD format (UTC)."
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
    "query",
    "fetchedAt"
  ],
  "properties": {
    "count": {
      "type": "number",
      "description": "Number of stories returned"
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
      "description": "Error details if success=false",
      "additionalProperties": false
    },
    "query": {
      "type": "string",
      "description": "The search query used"
    },
    "topic": {
      "type": "string",
      "description": "Topic filter applied (if any)"
    },
    "toDate": {
      "type": "string",
      "description": "End date filter applied (YYYY-MM-DD UTC)"
    },
    "results": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "sourceId",
          "source",
          "title",
          "url",
          "rankScore"
        ],
        "properties": {
          "url": {
            "type": "string",
            "description": "Canonical link to full article"
          },
          "score": {
            "type": "number",
            "description": "Engagement score (e.g., HN points)"
          },
          "title": {
            "type": "string",
            "description": "Article headline"
          },
          "author": {
            "type": "string",
            "description": "Article author name"
          },
          "source": {
            "type": "string",
            "description": "Human-readable source name"
          },
          "content": {
            "type": "string",
            "description": "Full article content. Three modes: (1) Full text for self-posts like HN 'Ask HN', (2) URL to lightweight readable version like lite.cnn.com, (3) undefined - use summary or fetch from url"
          },
          "pubDate": {
            "type": "string",
            "description": "Publication date (ISO 8601 UTC, e.g., 2024-01-15T14:30:00.000Z)"
          },
          "summary": {
            "type": "string",
            "description": "Short article preview/excerpt from feed"
          },
          "imageUrl": {
            "type": "string",
            "description": "Article thumbnail/image URL"
          },
          "sourceId": {
            "enum": [
              "hacker_news",
              "cnn",
              "bbc",
              "nytimes",
              "nypost",
              "guardian",
              "fox_news",
              "axios",
              "semafor",
              "techmeme",
              "ars_technica"
            ],
            "type": "string",
            "description": "Source identifier"
          },
          "rankScore": {
            "type": "number",
            "description": "Ranking score (higher = more relevant/recent)"
          },
          "sourceLogoUrl": {
            "type": "string",
            "description": "URL to source's logo image"
          }
        },
        "additionalProperties": false
      },
      "description": "Stories sorted by rankScore descending"
    },
    "sources": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Sources that returned results"
    },
    "success": {
      "type": "boolean",
      "description": "Whether the request succeeded"
    },
    "fromDate": {
      "type": "string",
      "description": "Start date filter applied (YYYY-MM-DD UTC)"
    },
    "fetchedAt": {
      "type": "string",
      "description": "When data was fetched (ISO 8601 UTC)"
    }
  },
  "additionalProperties": false
}
```

### hackerNewsTopStories

**Description:** Fetch top stories from Hacker News with scores and URLs. Consider using the 'headlines' tool instead for multi-source news.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "limit": {
      "type": "number",
      "default": 30,
      "maximum": 30,
      "minimum": 1,
      "description": "Number of top stories to fetch (1-30, default: 30)"
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
    "count": {
      "type": "number"
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
    "stories": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "id",
          "title",
          "score",
          "url"
        ],
        "properties": {
          "id": {
            "type": "number"
          },
          "url": {
            "type": "string"
          },
          "score": {
            "type": "number"
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
    }
  },
  "additionalProperties": false
}
```

### cnnTopStories

**Description:** Fetch top stories from CNN Lite by parsing the homepage. Consider using the 'headlines' tool instead for multi-source news.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
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
    "fetchedAt"
  ],
  "properties": {
    "count": {
      "type": "number"
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
    "stories": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "title",
          "url"
        ],
        "properties": {
          "url": {
            "type": "string"
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
    }
  },
  "additionalProperties": false
}
```

### bbcNewsHeadlines

**Description:** Fetch news headlines from BBC News RSS feed with descriptions and publication dates. Consider using the 'headlines' tool instead for multi-source news.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "limit": {
      "type": "number",
      "default": 20,
      "maximum": 50,
      "minimum": 1,
      "description": "Number of headlines to fetch (1-50, default: 20)"
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
    "count": {
      "type": "number"
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
    "stories": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "title",
          "description",
          "link",
          "pubDate"
        ],
        "properties": {
          "link": {
            "type": "string"
          },
          "title": {
            "type": "string"
          },
          "pubDate": {
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

