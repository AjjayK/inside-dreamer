# Tool Server: skibum

**ID:** 30c92a05-19ad-415a-8d6e-c3f7eaf7d814

**Short Description:** Provides snow conditions and lift status for top global ski resorts.

## Description

Provides snow conditions and lift status for top global ski resorts.

## Tools (2)

### list_resorts

**Description:** List all ski resorts with pagination support

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "page": {
      "type": "number",
      "default": 1,
      "description": "Page number for pagination"
    },
    "per_page": {
      "type": "number",
      "default": 100,
      "description": "Number of resorts per page"
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
    "page",
    "per_page",
    "pre_page",
    "next_page",
    "total",
    "total_pages",
    "data"
  ],
  "properties": {
    "data": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "slug",
          "name",
          "country",
          "location",
          "url"
        ],
        "properties": {
          "url": {
            "type": "string",
            "description": "API URL for resort details"
          },
          "name": {
            "type": "string",
            "description": "Resort name"
          },
          "slug": {
            "type": "string",
            "description": "Resort identifier slug"
          },
          "region": {
            "type": "string",
            "description": "Region/state code"
          },
          "country": {
            "type": "string",
            "description": "Country code"
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
          }
        },
        "additionalProperties": false
      },
      "description": "Array of resort data"
    },
    "page": {
      "type": "number",
      "description": "Current page number"
    },
    "total": {
      "type": "number",
      "description": "Total number of resorts"
    },
    "per_page": {
      "type": "number",
      "description": "Number of resorts per page"
    },
    "pre_page": {
      "type": [
        "number",
        "null"
      ],
      "description": "Previous page number (null if on first page)"
    },
    "next_page": {
      "type": [
        "number",
        "null"
      ],
      "description": "Next page number (null if on last page)"
    },
    "total_pages": {
      "type": "number",
      "description": "Total number of pages"
    }
  },
  "additionalProperties": false
}
```

### get_resort_conditions

**Description:** Get detailed conditions for a specific ski resort including lift status and snow conditions. Use slug='demo' for testing with mock data.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "slug"
  ],
  "properties": {
    "slug": {
      "type": "string",
      "description": "The resort slug (e.g., 'whistler-blackcomb', 'vail', 'aspen-mountain', or 'demo' for testing)"
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
    "data"
  ],
  "properties": {
    "data": {
      "type": "object",
      "required": [
        "slug",
        "name",
        "country",
        "region",
        "href",
        "units",
        "location",
        "lifts"
      ],
      "properties": {
        "href": {
          "type": "string",
          "description": "Resort website URL"
        },
        "name": {
          "type": "string",
          "description": "Resort name"
        },
        "slug": {
          "type": "string",
          "description": "Resort identifier slug"
        },
        "lifts": {
          "type": "object",
          "required": [
            "status",
            "stats"
          ],
          "properties": {
            "stats": {
              "type": "object",
              "required": [
                "open",
                "hold",
                "scheduled",
                "closed",
                "percentage"
              ],
              "properties": {
                "hold": {
                  "type": "number",
                  "description": "Number of lifts on hold"
                },
                "open": {
                  "type": "number",
                  "description": "Number of lifts open"
                },
                "closed": {
                  "type": "number",
                  "description": "Number of lifts closed"
                },
                "scheduled": {
                  "type": "number",
                  "description": "Number of lifts scheduled"
                },
                "percentage": {
                  "type": "object",
                  "required": [
                    "open",
                    "hold",
                    "scheduled",
                    "closed"
                  ],
                  "properties": {
                    "hold": {
                      "type": "number",
                      "description": "Percentage of lifts on hold"
                    },
                    "open": {
                      "type": "number",
                      "description": "Percentage of lifts open"
                    },
                    "closed": {
                      "type": "number",
                      "description": "Percentage of lifts closed"
                    },
                    "scheduled": {
                      "type": "number",
                      "description": "Percentage of lifts scheduled"
                    }
                  },
                  "additionalProperties": false
                }
              },
              "additionalProperties": false
            },
            "status": {
              "type": "object",
              "description": "Lift status by lift name (open/closed/hold/scheduled)",
              "additionalProperties": {
                "type": "string"
              }
            }
          },
          "additionalProperties": false
        },
        "units": {
          "type": "string",
          "description": "Measurement units (metric/imperial)"
        },
        "region": {
          "type": "string",
          "description": "Region/state code"
        },
        "country": {
          "type": "string",
          "description": "Country code"
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
        "conditions": {
          "type": "object",
          "required": [
            "base",
            "season",
            "twelve_hours",
            "twentyfour_hours",
            "fortyeight_hours",
            "seven_days"
          ],
          "properties": {
            "base": {
              "type": "number",
              "description": "Base depth in cm or inches"
            },
            "season": {
              "type": "number",
              "description": "Season total snowfall"
            },
            "seven_days": {
              "type": "number",
              "description": "Snowfall in last 7 days"
            },
            "twelve_hours": {
              "type": "number",
              "description": "Snowfall in last 12 hours"
            },
            "fortyeight_hours": {
              "type": "number",
              "description": "Snowfall in last 48 hours"
            },
            "twentyfour_hours": {
              "type": "number",
              "description": "Snowfall in last 24 hours"
            }
          },
          "description": "Snow conditions (may not be available for all resorts)",
          "additionalProperties": false
        }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

