# Tool Server: imageunderstanding

**ID:** 6d596284-9ab0-47be-bcbb-cf8e72c2f028

**Short Description:** Image understanding

## Description

Performs a wide range of image processing and computer vision tasks including but not limited to image captioning, classification, and visual question answering

## Tools (1)

### understandImage

**Description:** Analyze and understand an image using AI. Provide an image URL and a text prompt describing what you want to know about the image (e.g., 'What objects are in this image?', 'Describe this scene', 'What text is visible?').

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "imageUrl",
    "prompt"
  ],
  "properties": {
    "prompt": {
      "type": "string",
      "description": "The question or instruction for analyzing the image. Be specific about what aspects you want to understand (e.g., objects, text, scene description, colors, etc.)."
    },
    "imageUrl": {
      "type": "string",
      "format": "uri",
      "description": "The URL of the image to analyze and understand"
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
          "type": "string",
          "description": "The error type, e.g. 'TimeoutError' or 'UnhandledError'."
        },
        "message": {
          "type": "string",
          "description": "A human-readable error message describing what went wrong."
        }
      },
      "description": "Present only when success is false.",
      "additionalProperties": false
    },
    "success": {
      "type": "boolean",
      "description": "Whether the image analysis completed successfully."
    },
    "analysis": {
      "type": "string",
      "description": "The analysis result in markdown format. May include headers, lists, and other markdown formatting."
    }
  },
  "additionalProperties": false
}
```

