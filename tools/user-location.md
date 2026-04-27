# Tool Server: user-location

**ID:** dfc7e4c9-1d73-48c2-b017-c2b63ff3be36

**Short Description:** Provides information about the user's locations

## Tools (1)

### get_location

**Description:** Get a user's saved location (home, work, or latest). Returns location coordinates, accuracy, timestamp, and description.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "type"
  ],
  "properties": {
    "type": {
      "enum": [
        "home",
        "work",
        "latest"
      ],
      "type": "string",
      "description": "The type of location to retrieve: home, work, or latest"
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
      "additionalProperties": false
    },
    "success": {
      "type": "boolean"
    },
    "location": {
      "type": "object",
      "required": [
        "latitude",
        "longitude",
        "accuracyMeters",
        "timestamp",
        "description",
        "provider"
      ],
      "properties": {
        "altitude": {
          "type": "number"
        },
        "latitude": {
          "type": "number"
        },
        "provider": {
          "enum": [
            "android",
            "ios",
            "browser",
            "manual"
          ],
          "type": "string"
        },
        "longitude": {
          "type": "number"
        },
        "timestamp": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "accuracyMeters": {
          "type": "number"
        },
        "altitudeAccuracyMeters": {
          "type": "number"
        }
      },
      "additionalProperties": false
    },
    "fetchedAt": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

