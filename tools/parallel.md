# Tool Server: parallel

**ID:** 55227b83-bbfb-4509-a245-743e8f7ff2b3

**Short Description:** Parallel Web's Task API

## Description

Activate tasks that need detailed followups and expanded search.

## Tools (2)

### parallelEnrichment

**Description:** AI-powered data enrichment using Parallel's Task API.

**PROCESSOR SELECTION GUIDE**:
**lite**: Quick web searches (30-60s) | Simple facts, basic company info, straightforward data | $0.25 per task | Max 5 fields
**base**: Standard research (30-120s) | Moderate complexity, multiple sources, some verification needed | $0.50 per task | Max 5 fields
**core**: Deep research (60-300s) | Complex queries, cross-referencing, detailed analysis | $2.50 per task | Max 25 fields
**core2x**: Maximum depth research (120-300s) | Highest complexity, exhaustive research, comprehensive data | $5.00 per task | Max 25 fields

**TIMING**: Tasks complete via webhook (30s-5min depending on processor). Results are delivered when ready.

**PARAMETERS**: 
- input: Text or JSON object describing what to research
- enrichment_fields: Array of fields to extract with their types
- processor: Tier selection based on complexity

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "input",
    "enrichment_fields",
    "processor"
  ],
  "properties": {
    "input": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "object",
          "additionalProperties": {}
        }
      ],
      "description": "Input to enrich - either text or a JSON object"
    },
    "metadata": {
      "type": "object",
      "description": "Optional user-provided metadata",
      "additionalProperties": {
        "type": [
          "string",
          "number",
          "boolean"
        ]
      }
    },
    "processor": {
      "enum": [
        "lite",
        "base",
        "core",
        "core2x"
      ],
      "type": "string",
      "description": "Processor tier: lite (quick, $0.25), base (standard, $0.50), core (deep, $2.50), core2x (exhaustive, $5.00)"
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
        },
        "additionalProperties": false
      },
      "description": "Fields to extract from the research"
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

