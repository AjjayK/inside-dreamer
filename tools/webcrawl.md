# Tool Server: webcrawl

**ID:** 562b96b9-77b8-49c3-9dd5-a47cae72dcee

**Short Description:** Read any web page

## Description

Enables your sidekick to read any web page

## Tools (5)

### crawlUrl

**Description:** Fetch a web page and extract the main article content using Readability.

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
      "format": "uri",
      "description": "The URL to crawl and extract content from"
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
    "success"
  ],
  "properties": {
    "url": {
      "type": "string",
      "format": "uri",
      "description": "The URL that was crawled"
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
      "description": "Error details if the crawl failed",
      "additionalProperties": false
    },
    "title": {
      "type": "string",
      "description": "The page title"
    },
    "byline": {
      "type": "string",
      "description": "The article author or byline, if detected"
    },
    "success": {
      "type": "boolean",
      "description": "Whether the crawl succeeded"
    },
    "fetchedAt": {
      "type": "string",
      "description": "ISO 8601 timestamp of when the page was fetched"
    },
    "openGraph": {
      "type": "object",
      "properties": {
        "url": {
          "type": "string",
          "description": "og:url — the canonical URL"
        },
        "type": {
          "type": "string",
          "description": "og:type (e.g. website, article)"
        },
        "audio": {
          "type": "string",
          "description": "og:audio URL"
        },
        "image": {
          "type": "string",
          "description": "og:image URL"
        },
        "title": {
          "type": "string",
          "description": "og:title"
        },
        "video": {
          "type": "string",
          "description": "og:video URL"
        },
        "locale": {
          "type": "string",
          "description": "og:locale (e.g. en_US)"
        },
        "imageAlt": {
          "type": "string",
          "description": "og:image:alt text"
        },
        "siteName": {
          "type": "string",
          "description": "og:site_name"
        },
        "imageWidth": {
          "type": "string",
          "description": "og:image:width in pixels"
        },
        "description": {
          "type": "string",
          "description": "og:description"
        },
        "imageHeight": {
          "type": "string",
          "description": "og:image:height in pixels"
        }
      },
      "description": "OpenGraph metadata extracted from the page",
      "additionalProperties": false
    },
    "textLength": {
      "type": "number",
      "description": "Length of the extracted text content in characters"
    },
    "readableHtml": {
      "type": "string",
      "description": "The page content extracted by Readability as clean HTML"
    }
  },
  "additionalProperties": false
}
```

### crawlUrlMarkdown

**Description:** Fetch a web page and convert its full content to clean Markdown, with page metadata (title, description, Open Graph tags, etc.) in a structured format. Produces concise, LLM-friendly output.

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
      "format": "uri",
      "description": "The URL to crawl and extract content from as Markdown"
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
    "success"
  ],
  "properties": {
    "url": {
      "type": "string",
      "format": "uri",
      "description": "The URL that was crawled"
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
      "description": "Error details if the crawl failed",
      "additionalProperties": false
    },
    "title": {
      "type": "string",
      "description": "The page title from the <title> tag"
    },
    "success": {
      "type": "boolean",
      "description": "Whether the crawl succeeded"
    },
    "markdown": {
      "type": "string",
      "description": "Page content as Markdown"
    },
    "metadata": {
      "type": "object",
      "description": "Page metadata as a flat JSON object. Keys use '_' to replace ':' (e.g. og_image, og_title, twitter_image)",
      "propertyNames": {
        "type": "string"
      },
      "additionalProperties": {
        "type": "string"
      }
    },
    "fetchedAt": {
      "type": "string",
      "description": "ISO 8601 timestamp of when the page was fetched"
    },
    "textLength": {
      "type": "number",
      "description": "Length of the markdown content in characters (includes markdown syntax)"
    }
  },
  "additionalProperties": false
}
```

### crawlUrlRaw

**Description:** Fetch a URL and return the raw content without any processing. Supports HTML, JSON, XML, plain text, and other text-based content types. Unlike crawlUrl, this tool does NOT extract readable content using Readability - it returns the complete, unprocessed response body as received from the server. Use this when you need the full page structure, raw API responses, or when Readability extraction is not desired.

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
      "format": "uri",
      "description": "The URL to fetch raw content from"
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
    "success"
  ],
  "properties": {
    "url": {
      "type": "string",
      "format": "uri",
      "description": "The URL that was crawled"
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
      "description": "Error details if the crawl failed",
      "additionalProperties": false
    },
    "rawHtml": {
      "type": "string",
      "description": "The complete unprocessed content as received from the server"
    },
    "success": {
      "type": "boolean",
      "description": "Whether the crawl succeeded"
    },
    "fetchedAt": {
      "type": "string",
      "description": "ISO 8601 timestamp of when the page was fetched"
    },
    "contentType": {
      "type": "string",
      "description": "The Content-Type header from the response (e.g. text/html, application/json)"
    },
    "contentLength": {
      "type": "number",
      "description": "Length of the raw content in characters"
    }
  },
  "additionalProperties": false
}
```

### renderUrlGrabContent

**Description:** Render a web page using a headless browser (browserless.io) and extract the main article content using Readability. This tool ALWAYS uses a full Chrome browser to render JavaScript, handle dynamic content, and bypass bot detection. It then extracts readable content. Use this for JavaScript-heavy sites, sites with bot protection, or when you need guaranteed browser rendering with clean article extraction. This tool costs $0.012 per request.

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
      "format": "uri",
      "description": "The URL to render with a browser and extract content from"
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
    "success"
  ],
  "properties": {
    "url": {
      "type": "string",
      "format": "uri",
      "description": "The URL that was crawled"
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
      "description": "Error details if the crawl failed",
      "additionalProperties": false
    },
    "title": {
      "type": "string",
      "description": "The page title"
    },
    "byline": {
      "type": "string",
      "description": "The article author or byline, if detected"
    },
    "success": {
      "type": "boolean",
      "description": "Whether the crawl succeeded"
    },
    "fetchedAt": {
      "type": "string",
      "description": "ISO 8601 timestamp of when the page was fetched"
    },
    "openGraph": {
      "type": "object",
      "properties": {
        "url": {
          "type": "string",
          "description": "og:url — the canonical URL"
        },
        "type": {
          "type": "string",
          "description": "og:type (e.g. website, article)"
        },
        "audio": {
          "type": "string",
          "description": "og:audio URL"
        },
        "image": {
          "type": "string",
          "description": "og:image URL"
        },
        "title": {
          "type": "string",
          "description": "og:title"
        },
        "video": {
          "type": "string",
          "description": "og:video URL"
        },
        "locale": {
          "type": "string",
          "description": "og:locale (e.g. en_US)"
        },
        "imageAlt": {
          "type": "string",
          "description": "og:image:alt text"
        },
        "siteName": {
          "type": "string",
          "description": "og:site_name"
        },
        "imageWidth": {
          "type": "string",
          "description": "og:image:width in pixels"
        },
        "description": {
          "type": "string",
          "description": "og:description"
        },
        "imageHeight": {
          "type": "string",
          "description": "og:image:height in pixels"
        }
      },
      "description": "OpenGraph metadata extracted from the page",
      "additionalProperties": false
    },
    "textLength": {
      "type": "number",
      "description": "Length of the extracted text content in characters"
    },
    "readableHtml": {
      "type": "string",
      "description": "The page content extracted by Readability as clean HTML"
    }
  },
  "additionalProperties": false
}
```

### renderUrlGrabAllContent

**Description:** Render a web page using a headless browser (browserless.io) and return the complete raw HTML without any processing. This tool ALWAYS uses a full Chrome browser to render JavaScript, handle dynamic content, and bypass bot detection. Unlike renderUrlGrabContent, it does NOT run Readability - it returns the full rendered HTML including all scripts, styles, and page structure. Use this for JavaScript-heavy sites where you need the complete rendered page structure. This tool costs $0.012 per request.

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
      "format": "uri",
      "description": "The URL to render with a browser and return complete HTML from"
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
    "success"
  ],
  "properties": {
    "url": {
      "type": "string",
      "format": "uri",
      "description": "The URL that was crawled"
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
      "description": "Error details if the crawl failed",
      "additionalProperties": false
    },
    "rawHtml": {
      "type": "string",
      "description": "The complete unprocessed content as received from the server"
    },
    "success": {
      "type": "boolean",
      "description": "Whether the crawl succeeded"
    },
    "fetchedAt": {
      "type": "string",
      "description": "ISO 8601 timestamp of when the page was fetched"
    },
    "contentType": {
      "type": "string",
      "description": "The Content-Type header from the response (e.g. text/html, application/json)"
    },
    "contentLength": {
      "type": "number",
      "description": "Length of the raw content in characters"
    }
  },
  "additionalProperties": false
}
```

