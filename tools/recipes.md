# Tool Server: recipes

**ID:** 3161afe7-7acb-485f-8533-f78b8ed0de3e

**Short Description:** Find high quality recipes from the web

## Description

Find high quality recipes from the web

## Tools (2)

### recipeSearch

**Description:** Search for recipes using SerpAPI and extract JSON-LD recipe data from cooking websites

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
      "description": "The recipe search query (e.g., 'pumpkin risotto', 'chocolate cake')"
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
    "query": {
      "type": "string"
    },
    "recipes": {
      "type": "array"
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

### parseRecipeFromUrl

**Description:** Parse JSON-LD recipe data from a specific URL. Use this when you already have a recipe URL and want to extract structured recipe data from it.

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
      "description": "The URL of the recipe page to parse (e.g., 'https://www.example.com/recipes/chocolate-cake')"
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
      "type": "string"
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
    "recipe": {},
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

