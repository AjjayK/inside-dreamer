# Tool Server: geocode

**ID:** dfd17031-a635-4f07-a982-6be2d61eb449

**Short Description:** Convert addresses to map coordinates

## Description

Get geocoding information about any address from the Google Maps Platform.

## Tools (2)

### geocodeAddress

**Description:** Convert an address string to geographic coordinates (latitude/longitude) using Google Geocoding API

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "address"
  ],
  "properties": {
    "region": {
      "type": "string",
      "description": "Region code for biasing results (e.g., 'us', 'uk')"
    },
    "address": {
      "type": "string",
      "description": "The address to geocode (e.g., '1600 Amphitheatre Parkway, Mountain View, CA')"
    },
    "language": {
      "type": "string",
      "description": "Language code for results (e.g., 'en', 'es')"
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
    "results": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "formattedAddress",
          "location",
          "locationType",
          "placeId",
          "types"
        ],
        "properties": {
          "types": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "placeId": {
            "type": "string"
          },
          "location": {
            "type": "object",
            "required": [
              "latitude",
              "longitude"
            ],
            "properties": {
              "latitude": {
                "type": "number"
              },
              "longitude": {
                "type": "number"
              }
            },
            "additionalProperties": false
          },
          "locationType": {
            "type": "string"
          },
          "formattedAddress": {
            "type": "string"
          }
        },
        "additionalProperties": false
      }
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

### latLngToPlusCode

**Description:** Convert geographic coordinates (latitude/longitude) to a Google Plus Code. Returns the full Plus Code with area bounds and center point.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "lat",
    "lng"
  ],
  "properties": {
    "lat": {
      "type": "number",
      "maximum": 90,
      "minimum": -90,
      "description": "Latitude coordinate"
    },
    "lng": {
      "type": "number",
      "maximum": 180,
      "minimum": -180,
      "description": "Longitude coordinate"
    },
    "length": {
      "type": "integer",
      "maximum": 15,
      "minimum": 4,
      "description": "Desired Plus Code length (default: 10). Longer codes are more precise. Standard length is 10 (~14m x 14m area)."
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
    "plusCode": {
      "type": "object",
      "required": [
        "fullCode",
        "bounds",
        "center"
      ],
      "properties": {
        "bounds": {
          "type": "object",
          "required": [
            "northeast",
            "southwest"
          ],
          "properties": {
            "northeast": {
              "type": "object",
              "required": [
                "lat",
                "lng"
              ],
              "properties": {
                "lat": {
                  "type": "number"
                },
                "lng": {
                  "type": "number"
                }
              },
              "additionalProperties": false
            },
            "southwest": {
              "type": "object",
              "required": [
                "lat",
                "lng"
              ],
              "properties": {
                "lat": {
                  "type": "number"
                },
                "lng": {
                  "type": "number"
                }
              },
              "additionalProperties": false
            }
          },
          "additionalProperties": false
        },
        "center": {
          "type": "object",
          "required": [
            "lat",
            "lng"
          ],
          "properties": {
            "lat": {
              "type": "number"
            },
            "lng": {
              "type": "number"
            }
          },
          "additionalProperties": false
        },
        "fullCode": {
          "type": "string",
          "description": "The full Plus Code (e.g., '849VCWC8+R9')"
        },
        "compoundCode": {
          "type": "string",
          "description": "The compound Plus Code with locality (e.g., 'CWC8+R9 Mountain View, CA')"
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

