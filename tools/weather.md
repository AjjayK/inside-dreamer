# Tool Server: weather

**ID:** 05967733-4f5d-4194-bdd9-7396e42125d8

**Short Description:** Real-time and forecast weather information

## Description

Provides real-time and forecast weather information, marine forecast, and tides.

## Tools (4)

### getCurrentWeather

**Description:** Get current weather, air quality, and pollen data for a given location using WeatherAPI.com. Includes temperature, conditions, wind, humidity, UV index, air quality data (CO, NO2, O3, SO2, PM2.5, PM10, and air quality indices), and pollen levels (hazel, alder, birch, oak, grass, mugwort, and ragweed).

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "location"
  ],
  "properties": {
    "location": {
      "type": "string",
      "description": "The location to get weather for (can be city name, coordinates, etc.)"
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
    "data": {
      "type": "object",
      "properties": {
        "uv": {
          "type": "number"
        },
        "pollen": {
          "type": "object",
          "properties": {
            "oak": {
              "type": "number"
            },
            "alder": {
              "type": "number"
            },
            "birch": {
              "type": "number"
            },
            "grass": {
              "type": "number"
            },
            "hazel": {
              "type": "number"
            },
            "mugwort": {
              "type": "number"
            },
            "ragweed": {
              "type": "number"
            }
          },
          "additionalProperties": false
        },
        "humidity": {
          "type": "number"
        },
        "wind_kph": {
          "type": "number"
        },
        "wind_mph": {
          "type": "number"
        },
        "condition": {
          "type": "string"
        },
        "localTime": {
          "type": "string"
        },
        "air_quality": {
          "type": "object",
          "properties": {
            "co": {
              "type": "number"
            },
            "o3": {
              "type": "number"
            },
            "no2": {
              "type": "number"
            },
            "so2": {
              "type": "number"
            },
            "pm10": {
              "type": "number"
            },
            "pm2_5": {
              "type": "number"
            },
            "us_epa_index": {
              "type": "number"
            },
            "gb_defra_index": {
              "type": "number"
            }
          },
          "additionalProperties": false
        },
        "feelslike_c": {
          "type": "number"
        },
        "feelslike_f": {
          "type": "number"
        },
        "temperature_c": {
          "type": "number"
        },
        "temperature_f": {
          "type": "number"
        }
      },
      "additionalProperties": false
    },
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
      "type": "string"
    },
    "fetchedAt": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

### getWeatherForecast

**Description:** Get a 1-7 day weather forecast with air quality and pollen data for a given location using WeatherAPI.com. Includes current conditions, daily forecasts with temperature ranges, conditions, air quality metrics (CO, NO2, O3, SO2, PM2.5, PM10, and air quality indices), and pollen levels (hazel, alder, birch, oak, grass, mugwort, and ragweed).

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "location"
  ],
  "properties": {
    "days": {
      "type": "integer",
      "default": 7,
      "maximum": 7,
      "minimum": 1,
      "description": "Number of days to forecast (1-7) starting from today. Default is 7 days. Make sure the day you care about is included."
    },
    "location": {
      "type": "string",
      "description": "The location to get forecast for (can be city name, coordinates, etc.)"
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
    "forecast": {},
    "location": {
      "type": "string"
    },
    "fetchedAt": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

### getMarineConditions

**Description:** Get marine weather conditions and forecast including tides, wave heights, swell, and water temperature for coastal locations using WeatherAPI.com

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "location"
  ],
  "properties": {
    "days": {
      "type": "integer",
      "default": 1,
      "maximum": 7,
      "minimum": 1,
      "description": "Number of days to forecast (1-7)"
    },
    "location": {
      "type": "string",
      "description": "The coastal location to get marine conditions for (can be city name, coordinates, etc.)"
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
    "marine": {},
    "success": {
      "type": "boolean"
    },
    "location": {
      "type": "string"
    },
    "fetchedAt": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

### getWeatherAlerts

**Description:** Get active weather alerts for a given location using WeatherAPI.com. Returns severe weather warnings, watches, and advisories including severity, urgency, event type, affected areas, and instructions.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "location"
  ],
  "properties": {
    "location": {
      "type": "string",
      "description": "The location to get alerts for (can be city name, coordinates, etc.)"
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
    "alerts": {},
    "success": {
      "type": "boolean"
    },
    "location": {
      "type": "string"
    },
    "fetchedAt": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

