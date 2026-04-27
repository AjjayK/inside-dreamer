# Tool Server: googlerouting

**ID:** 0a76007c-c5b7-4684-8500-f439b6157316

**Short Description:** Get routing information from Google Maps

## Description

Get travel directions, including way points, with optional traffic awareness. Also includes transit planning tool.

## Tools (2)

### computeRoute

**Description:** Get directions between two or more locations. Supports driving, walking, bicycling, and two-wheeler modes. Can include intermediate waypoints for multi-stop routes. Returns distance, duration, encoded polyline for map display, and turn-by-turn directions. Use getTransitRoute for public transit.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "origin",
    "destination"
  ],
  "properties": {
    "units": {
      "enum": [
        "METRIC",
        "IMPERIAL"
      ],
      "type": "string",
      "default": "METRIC",
      "description": "Unit system for display (affects localized text only, distanceMeters is always metric)"
    },
    "origin": {
      "type": "string",
      "description": "Starting location. Accepts: address string (e.g., '1600 Amphitheatre Parkway, Mountain View, CA'), lat/lng (e.g., '37.4,-122.0'), or place ID (e.g., 'ChIJ...' or 'place_id:ChIJ...')"
    },
    "waypoints": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "maxItems": 25,
      "description": "Optional intermediate stops (up to 25). Each accepts: address, lat/lng, or place ID. Visited in order unless optimizeWaypointOrder is true."
    },
    "avoidTolls": {
      "type": "boolean",
      "default": false,
      "description": "Avoid toll roads"
    },
    "travelMode": {
      "enum": [
        "DRIVE",
        "WALK",
        "BICYCLE",
        "TWO_WHEELER"
      ],
      "type": "string",
      "default": "DRIVE",
      "description": "Mode of transportation. DRIVE for car, WALK for walking, BICYCLE for biking, TWO_WHEELER for motorcycle/scooter"
    },
    "destination": {
      "type": "string",
      "description": "Ending location. Same formats as origin: address, lat/lng, or place ID"
    },
    "avoidFerries": {
      "type": "boolean",
      "default": false,
      "description": "Avoid ferries"
    },
    "avoidHighways": {
      "type": "boolean",
      "default": false,
      "description": "Avoid highways"
    },
    "departureTime": {
      "type": "string",
      "description": "Departure time in ISO 8601 format (e.g., '2026-01-25T09:00:00Z'). If not specified, uses current time. Used for traffic calculations."
    },
    "routingPreference": {
      "enum": [
        "TRAFFIC_UNAWARE",
        "TRAFFIC_AWARE",
        "TRAFFIC_AWARE_OPTIMAL"
      ],
      "type": "string",
      "default": "TRAFFIC_AWARE",
      "description": "Traffic awareness. TRAFFIC_AWARE (default) balances accuracy and speed. TRAFFIC_AWARE_OPTIMAL provides best accuracy but higher latency. TRAFFIC_UNAWARE ignores traffic (faster, cheaper). Only applies to DRIVE and TWO_WHEELER modes."
    },
    "optimizeWaypointOrder": {
      "type": "boolean",
      "default": false,
      "description": "If true and waypoints are provided, Google will reorder them for the most efficient route. The optimized order is returned in optimizedWaypointOrder."
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
      "additionalProperties": false
    },
    "route": {
      "type": "object",
      "properties": {
        "legs": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "steps": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "duration": {
                      "type": "string",
                      "description": "Duration of this step (e.g., '120s')"
                    },
                    "instruction": {
                      "type": "string",
                      "description": "Navigation instruction text"
                    },
                    "distanceMeters": {
                      "type": "number",
                      "description": "Distance of this step in meters"
                    }
                  },
                  "additionalProperties": false
                },
                "description": "Turn-by-turn directions"
              },
              "duration": {
                "type": "string",
                "description": "Duration with traffic (e.g., '1200s')"
              },
              "distanceMeters": {
                "type": "number",
                "description": "Total distance of this leg in meters"
              },
              "staticDuration": {
                "type": "string",
                "description": "Duration without traffic"
              }
            },
            "additionalProperties": false
          },
          "description": "Route legs (one per origin-waypoint-destination segment)"
        },
        "duration": {
          "type": "string",
          "description": "Total duration with traffic (e.g., '1800s')"
        },
        "warnings": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Route warnings"
        },
        "description": {
          "type": "string",
          "description": "Route description/summary"
        },
        "distanceMeters": {
          "type": "number",
          "description": "Total route distance in meters"
        },
        "staticDuration": {
          "type": "string",
          "description": "Total duration without traffic"
        },
        "encodedPolyline": {
          "type": "string",
          "description": "Encoded polyline for map display"
        }
      },
      "additionalProperties": false
    },
    "success": {
      "type": "boolean"
    },
    "fetchedAt": {
      "type": "string"
    },
    "fallbackInfo": {
      "type": "object",
      "properties": {
        "reason": {
          "type": "string"
        },
        "routingMode": {
          "type": "string"
        }
      },
      "description": "Info if route fell back to a different mode",
      "additionalProperties": false
    },
    "optimizedWaypointOrder": {
      "type": "array",
      "items": {
        "type": "number"
      },
      "description": "Optimized order of waypoints (only present if optimizeWaypointOrder was true)"
    }
  },
  "additionalProperties": false
}
```

### getTransitRoute

**Description:** Get public transit directions including buses, subways, trains, and ferries. Returns detailed transit information including line names, departure times, and transfer instructions.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "origin",
    "destination"
  ],
  "properties": {
    "units": {
      "enum": [
        "METRIC",
        "IMPERIAL"
      ],
      "type": "string",
      "default": "METRIC"
    },
    "origin": {
      "type": "string",
      "description": "Starting location. Accepts: address, lat/lng, or place ID"
    },
    "arrivalTime": {
      "type": "string",
      "description": "Desired arrival time in ISO 8601 format. Cannot be used with departureTime."
    },
    "destination": {
      "type": "string",
      "description": "Destination. Accepts: address, lat/lng, or place ID"
    },
    "departureTime": {
      "type": "string",
      "description": "Departure time in ISO 8601 format (e.g., '2026-01-25T09:00:00Z'). If neither departure nor arrival time is set, uses current time."
    },
    "transitPreferences": {
      "type": "array",
      "items": {
        "enum": [
          "BUS",
          "SUBWAY",
          "TRAIN",
          "LIGHT_RAIL",
          "RAIL"
        ],
        "type": "string"
      },
      "description": "Preferred transit modes. If not specified, all modes are considered. Options: BUS, SUBWAY, TRAIN, LIGHT_RAIL, RAIL"
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
      "additionalProperties": false
    },
    "route": {
      "type": "object",
      "properties": {
        "legs": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "steps": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "duration": {
                      "type": "string",
                      "description": "Duration"
                    },
                    "travelMode": {
                      "type": "string",
                      "description": "WALK or TRANSIT"
                    },
                    "instruction": {
                      "type": "string",
                      "description": "Navigation instruction"
                    },
                    "distanceMeters": {
                      "type": "number",
                      "description": "Distance in meters"
                    },
                    "transitDetails": {
                      "type": "object",
                      "properties": {
                        "headsign": {
                          "type": "string",
                          "description": "Destination shown on vehicle"
                        },
                        "lineName": {
                          "type": "string",
                          "description": "Transit line name"
                        },
                        "stopCount": {
                          "type": "number",
                          "description": "Number of stops"
                        },
                        "agencyName": {
                          "type": "string",
                          "description": "Transit agency name"
                        },
                        "arrivalStop": {
                          "type": "string",
                          "description": "Alighting stop name"
                        },
                        "arrivalTime": {
                          "type": "string",
                          "description": "Arrival time"
                        },
                        "vehicleType": {
                          "type": "string",
                          "description": "BUS, SUBWAY, RAIL, etc."
                        },
                        "departureStop": {
                          "type": "string",
                          "description": "Boarding stop name"
                        },
                        "departureTime": {
                          "type": "string",
                          "description": "Departure time"
                        },
                        "lineShortName": {
                          "type": "string",
                          "description": "Transit line short name (e.g., '6', 'L')"
                        }
                      },
                      "additionalProperties": false
                    }
                  },
                  "additionalProperties": false
                }
              },
              "duration": {
                "type": "string"
              },
              "distanceMeters": {
                "type": "number"
              }
            },
            "additionalProperties": false
          }
        },
        "duration": {
          "type": "string"
        },
        "warnings": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "description": {
          "type": "string"
        },
        "distanceMeters": {
          "type": "number"
        },
        "encodedPolyline": {
          "type": "string"
        }
      },
      "additionalProperties": false
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

