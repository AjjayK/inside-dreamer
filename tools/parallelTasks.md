# Tool Server: parallelTasks

**ID:** b1241667-8c89-44ba-9364-4096f8187974

**Short Description:** Parallel Web Systems Task API

## Description

Activate tasks that need detailed followups and expanded search.

## Tools (2)

### parallelEnrichment

**Description:** AI-powered data enrichment using Parallel's Task API. Enriches ONE item at a time. Returns a run_id immediately that can be used to check the status. Enrichment runs in the background and may take 30s-5min depending on complexity.

**IMPORTANT**: This tool processes a SINGLE item per call. For multiple items (e.g., enriching 5 companies), you must call this tool once per item. For batch enrichment of many items, consider creating a Sidekick Task to handle the multiple calls and status checks.

**USAGE**: After calling this tool, use parallelEnrichmentStatus with the returned run_id to poll for results.

**PARAMETERS**: 
- input: Text or JSON object describing ONE item to research (e.g. "Ford Mustang" or {"company": "Anthropic"})
- enrichment_fields: Array of fields to extract with their types (max 25 fields). The processor tier is automatically selected based on the number of fields.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "input",
    "enrichment_fields"
  ],
  "properties": {
    "input": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "object",
          "propertyNames": {
            "type": "string"
          },
          "additionalProperties": {}
        }
      ],
      "description": "Input to enrich - either text or a JSON object"
    },
    "metadata": {
      "type": "object",
      "description": "Optional user-provided metadata",
      "propertyNames": {
        "type": "string"
      },
      "additionalProperties": {
        "anyOf": [
          {
            "type": "string"
          },
          {
            "type": "number"
          },
          {
            "type": "boolean"
          }
        ]
      }
    },
    "enrichment_fields": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "name",
          "type"
        ],
        "properties": {
          "name": {
            "type": "string",
            "description": "Field name to extract"
          },
          "type": {
            "enum": [
              "string",
              "number",
              "boolean"
            ],
            "type": "string",
            "description": "Expected data type for this field"
          },
          "description": {
            "type": "string",
            "description": "Optional description to guide extraction"
          }
        }
      },
      "maxItems": 25,
      "description": "Fields to extract from the research (max 25)"
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
      "description": "Error information if enrichment failed",
      "additionalProperties": false
    },
    "run_id": {
      "type": "string",
      "description": "Parallel task run ID"
    },
    "status": {
      "type": "string",
      "description": "Task status: 'running', 'completed', or 'failed'"
    },
    "message": {
      "type": "string",
      "description": "Human-readable status message"
    },
    "success": {
      "type": "boolean"
    },
    "warnings": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Any warnings from the enrichment process"
    },
    "citations": {
      "type": "array",
      "items": {},
      "description": "Citations and sources used for enrichment (structure varies by processor)"
    },
    "fetchedAt": {
      "type": "string",
      "description": "ISO timestamp of when enrichment completed"
    },
    "processor": {
      "type": "string",
      "description": "Processor used for enrichment"
    },
    "reasoning": {
      "type": "string",
      "description": "Reasoning behind the enrichment"
    },
    "confidence": {
      "type": "number",
      "description": "Confidence score (0-1) for the enrichment results"
    },
    "enriched_item": {
      "description": "Original item enriched with new fields"
    }
  },
  "additionalProperties": false
}
```

### parallelEnrichmentStatus

**Description:** Check the status of a Parallel enrichment task by run_id. Use this after calling parallelEnrichment to get the results when the task completes.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "run_id"
  ],
  "properties": {
    "run_id": {
      "type": "string",
      "description": "The Parallel task run_id returned from parallelEnrichment"
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
      "description": "Error information if enrichment failed",
      "additionalProperties": false
    },
    "run_id": {
      "type": "string",
      "description": "Parallel task run ID"
    },
    "status": {
      "type": "string",
      "description": "Task status: 'running', 'completed', or 'failed'"
    },
    "message": {
      "type": "string",
      "description": "Human-readable status message"
    },
    "success": {
      "type": "boolean"
    },
    "warnings": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Any warnings from the enrichment process"
    },
    "citations": {
      "type": "array",
      "items": {},
      "description": "Citations and sources used for enrichment (structure varies by processor)"
    },
    "fetchedAt": {
      "type": "string",
      "description": "ISO timestamp of when enrichment completed"
    },
    "processor": {
      "type": "string",
      "description": "Processor used for enrichment"
    },
    "reasoning": {
      "type": "string",
      "description": "Reasoning behind the enrichment"
    },
    "confidence": {
      "type": "number",
      "description": "Confidence score (0-1) for the enrichment results"
    },
    "enriched_item": {
      "description": "Original item enriched with new fields"
    }
  },
  "additionalProperties": false
}
```

