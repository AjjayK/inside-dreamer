# Tool Server: persondata

**ID:** a4d1f01d-dac2-47b0-9cf8-5675ff56b760

**Short Description:** Find fresh information about people from public sources.

## Description

This tool can find data about people which is not often available via search by using sources like LinkedIn.

## Tools (2)

### linkedin

**Description:** Get LinkedIn profile data and recent posts for a given LinkedIn profile URL

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "linkedin_url"
  ],
  "properties": {
    "linkedin_url": {
      "type": "string",
      "description": "The LinkedIn profile URL to analyze"
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
        "message": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "posts": {},
    "profile": {},
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

### personResearch

**Description:** Research a person by name and optionally company, email, or location. Attempts to find their LinkedIn profile first, then falls back to general web research if LinkedIn is unavailable.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "name"
  ],
  "properties": {
    "name": {
      "type": "string",
      "description": "The person's full name (required)"
    },
    "email": {
      "type": "string",
      "description": "Their email address (optional)"
    },
    "company": {
      "type": "string",
      "description": "The company they work at (optional)"
    },
    "location": {
      "type": "string",
      "description": "Their location, e.g. 'San Francisco' (optional)"
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
    "researchType",
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
    "posts": {
      "description": "LinkedIn posts if available"
    },
    "profile": {
      "description": "LinkedIn profile data if available"
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
      },
      "description": "Sources used for general research"
    },
    "success": {
      "type": "boolean"
    },
    "fetchedAt": {
      "type": "string"
    },
    "linkedinUrl": {
      "type": "string",
      "description": "The discovered LinkedIn profile URL, if found"
    },
    "researchType": {
      "enum": [
        "linkedin",
        "general"
      ],
      "type": "string",
      "description": "Whether LinkedIn data or general research was returned"
    },
    "generalResearch": {
      "type": "string",
      "description": "General research about the person if LinkedIn wasn't available"
    }
  },
  "additionalProperties": false
}
```

