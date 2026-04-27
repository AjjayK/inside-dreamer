# Tool Server: nanobananapro

**ID:** 8d60e6cc-622a-494a-8bca-6a886382c29c

**Short Description:** Google Image Generation with the Nano Banana Pro model

## Description

Generate compelling visuals/infographics and more via Sidekick or your agents

## Tools (2)

### generateImageNBPro

**Description:** Generate an image using the NanoBanana Pro model based on a descriptive prompt. This model offers advanced image generation capabilities with support for various aspect ratios and styles.

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
      "description": "The prompt to generate an image from using NanoBanana Pro. For realistic images, use photography terms. Mention camera angles, lens types, lighting, and fine details to guide the model toward a photorealistic result. To create stickers, icons, or assets, be explicit about the style and request a transparent background."
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

### imagePlusTextToImageNBPro

**Description:** Generate a new image using NanoBanana Pro based on one or more input images and a text prompt. This performs image-to-image generation, modifying or transforming the input image(s) according to the text instructions.

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

