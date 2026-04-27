# Tool Server: Weather Vignette

**ID:** de094a9c-c03c-47fb-a3cc-75687f319314

**Short Description:** weathervignette - An AI video generation service that creates artistic weather vignettes

  What it does:

  The weathervignette MCP server generates short artistic videos (vignettes) that blend:
  1.

## Description

weathervignette - An AI video generation service that creates artistic weather vignettes

  What it does:

  The weathervignette MCP server generates short artistic videos (vignettes) that blend:
  1. Location-specific landmarks - Recognizable features of the specified city
  2. Current weather conditions - Visual representation of weather (sun, rain, clouds, snow, etc.)
  3. Artistic style - One of 5 styles: painterly, photorealistic, abstract, watercolor, or minimalist

## Tools (2)

### get_weather_video

**Description:** Get or create a weather video for a specific location, weather condition, and artistic style. Returns a ticket for tracking video generation progress.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "city",
    "region",
    "country",
    "conditions",
    "style"
  ],
  "properties": {
    "city": {
      "type": "string",
      "description": "City name (e.g., 'San Francisco')"
    },
    "style": {
      "enum": [
        "painterly",
        "photorealistic",
        "abstract",
        "watercolor",
        "minimalist"
      ],
      "type": "string",
      "description": "Art style for the video: painterly (impressionist painting), photorealistic (professional photography), abstract (Matisse-inspired), watercolor (soft painting), or minimalist (clean modern design)"
    },
    "region": {
      "type": "string",
      "description": "State or region (e.g., 'CA', 'California')"
    },
    "country": {
      "type": "string",
      "description": "Country name or 2-letter code (e.g., 'US', 'United States')"
    },
    "conditions": {
      "type": "string",
      "description": "Weather condition in lowercase (e.g., 'sunny', 'cloudy', 'rainy'). Must be a valid WeatherAPI condition."
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
    "status",
    "message"
  ],
  "properties": {
    "status": {
      "enum": [
        "completed",
        "processing"
      ],
      "type": "string",
      "description": "Status of the video generation"
    },
    "message": {
      "type": "string",
      "description": "Human-readable message about the status"
    },
    "imageUrl": {
      "type": "string",
      "description": "URL of the first frame image"
    },
    "ticketId": {
      "type": "string",
      "description": "Ticket ID for tracking video generation (only present when status is processing)"
    },
    "videoUrl": {
      "type": "string",
      "description": "URL of the completed video (only present when status is completed)"
    }
  },
  "additionalProperties": false
}
```

### check_video_status

**Description:** Check the status of an in-progress video generation using the ticket ID.

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
      "description": "The ticket ID returned from get_weather_video"
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
    "status",
    "message"
  ],
  "properties": {
    "error": {
      "type": "string",
      "description": "Error message (only present when status is failed)"
    },
    "status": {
      "enum": [
        "completed",
        "processing",
        "failed"
      ],
      "type": "string",
      "description": "Current status of the video generation"
    },
    "message": {
      "type": "string",
      "description": "Human-readable message about the status"
    },
    "imageUrl": {
      "type": "string",
      "description": "URL of the first frame image"
    },
    "videoUrl": {
      "type": "string",
      "description": "URL of the completed video (only present when status is completed)"
    }
  },
  "additionalProperties": false
}
```

