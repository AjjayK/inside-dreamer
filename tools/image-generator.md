# Tool Server: image-generator

**ID:** 1e600d32-8720-4d2a-813d-dd9381aa17dd

**Short Description:** Generate images with powerful models

## Description

Generate images with powerful models

## Tools (2)

### generateImage

**Description:** Generate an image based on a descriptive prompt, save it to cloud storage and return the URL

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "prompt"
  ],
  "properties": {
    "prompt": {
      "type": "string",
      "description": "The prompt to generate an image from. For realistic images, use photography terms. Mention camera angles, lens types, lighting, and fine details to guide the model toward a photorealistic result. To create stickers, icons, or assets, be explicit about the style and request a transparent background."
    },
    "aspectRatio": {
      "enum": [
        "1:1",
        "2:3",
        "3:2",
        "3:4",
        "4:3",
        "4:5",
        "5:4",
        "9:16",
        "16:9",
        "21:9"
      ],
      "type": "string",
      "description": "The aspect ratio of the generated image. Options: 1:1 (square), 2:3, 3:2, 3:4, 4:3, 4:5, 5:4, 9:16 (portrait), 16:9 (landscape), 21:9 (ultra-wide). Defaults to 1:1 if not specified."
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
    "imageUrl": {
      "type": "string",
      "format": "uri"
    }
  },
  "additionalProperties": false
}
```

### imagePlusTextToImage

**Description:** Generate a new image based on one or more input images and a text prompt. This performs image-to-image generation, modifying or transforming the input image(s) according to the text instructions.

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
      "description": "The text prompt describing how to transform or modify the input image(s). Be specific about the desired changes, style, or modifications."
    },
    "imageUrl": {
      "anyOf": [
        {
          "type": "string",
          "format": "uri"
        },
        {
          "type": "array",
          "items": {
            "type": "string",
            "format": "uri"
          }
        }
      ],
      "description": "The URL(s) of the input image(s) to use as a base for generation. Can be a single URL string or an array of URL strings for multiple images."
    },
    "aspectRatio": {
      "enum": [
        "1:1",
        "2:3",
        "3:2",
        "3:4",
        "4:3",
        "4:5",
        "5:4",
        "9:16",
        "16:9",
        "21:9"
      ],
      "type": "string",
      "description": "The aspect ratio of the generated image. Options: 1:1 (square), 2:3, 3:2, 3:4, 4:3, 4:5, 5:4, 9:16 (portrait), 16:9 (landscape), 21:9 (ultra-wide). Defaults to matching the input image aspect ratio if not specified."
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
    "imageUrl": {
      "type": "string",
      "format": "uri"
    }
  },
  "additionalProperties": false
}
```

