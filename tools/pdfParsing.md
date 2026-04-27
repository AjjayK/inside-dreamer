# Tool Server: pdfParsing

**ID:** 8a2ae069-0dda-4fd0-bc55-df7cc9764db8

**Short Description:** PDF parsing and document understanding

## Description

This tool can can process documents in PDF format, using native vision to understand entire document contexts. This goes beyond simple text extraction:
- Analyze and interpret content, including text, images, diagrams, charts, and tables, even in long documents up to 1000 pages.
- Summarize and answer questions based on both the visual and textual elements in a document.
- Transcribe document content (e.g. to HTML), preserving layouts and formatting, for use in downstream applications.

## Tools (1)

### parsePdf

**Description:** Parse and analyze a PDF document using AI. Provide a PDF URL and a text prompt describing what you want to extract or understand about the document (e.g., 'Summarize this document', 'Extract key findings', 'List all the main topics discussed').

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "pdfUrl",
    "prompt"
  ],
  "properties": {
    "pdfUrl": {
      "type": "string",
      "format": "uri",
      "description": "The URL of the PDF document to parse and analyze"
    },
    "prompt": {
      "type": "string",
      "description": "The question or instruction for analyzing the PDF. Be specific about what you want to extract or understand (e.g., summarization, key points, specific data extraction, etc.)."
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
    "analysis": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

