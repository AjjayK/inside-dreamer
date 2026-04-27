# Tool Server: videogen

**ID:** 2e21c59b-9712-46b4-9f7b-b1efcdba6bff

**Short Description:** Generate 8 second videos with audio from text or text and image prompts

## Description

Create high-quality, 8-second videos with Veo 3.1, Google's latest AI video generator. Simply describe what you have in mind or upload a photo and watch your ideas come to life with native audio generation.

## Tools (2)

### generateVideo

**Description:** Start generating a video based on a text prompt using Gemini Veo 3. Optionally provide an image URL to use as the starting frame. Returns a ticket ID immediately that can be used to check the status. Video generation runs in the background and may take several minutes.

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
      "description": "The text prompt describing the video you want to generate. Be detailed about the scene, actions, camera movements, and visual style. Example: 'A close up of two people staring at a cryptic drawing on a wall, torchlight flickering.'"
    },
    "imageUrl": {
      "type": "string",
      "format": "uri",
      "description": "Optional URL of an image to use as the starting frame for the video. If provided, the video will begin with this image and animate based on the prompt."
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
    "ticketId": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

### checkVideoStatus

**Description:** Check the status of a video generation job using the ticket ID returned from generateVideo. Returns the status (pending/completed/failed) and the video URL if completed.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "ticketId"
  ],
  "properties": {
    "ticketId": {
      "type": "string",
      "description": "The ticket ID returned from the generateVideo tool"
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
    "status": {
      "enum": [
        "pending",
        "completed",
        "failed"
      ],
      "type": "string"
    },
    "success": {
      "type": "boolean"
    },
    "videoUrl": {
      "type": "string",
      "format": "uri"
    }
  },
  "additionalProperties": false
}
```

