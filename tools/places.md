# Tool Server: places

**ID:** 03e99f6f-7d69-435d-85c0-eed59a1ac470

**Short Description:** Get information about nearby places and businesses

## Description

Get detailed information about nearby places and businesses using the Google Place API

## Tools (3)

### searchNearby

**Description:** Search for places near a specific location using Google Places API. Useful for finding restaurants, stores, and other points of interest.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "latitude",
    "longitude"
  ],
  "properties": {
    "latitude": {
      "type": "number",
      "description": "Latitude of the center point for the search"
    },
    "longitude": {
      "type": "number",
      "description": "Longitude of the center point for the search"
    },
    "radiusMeters": {
      "type": "number",
      "default": 5000,
      "maximum": 50000,
      "minimum": 1,
      "description": "Search radius in meters (1-50000, default 5000)"
    },
    "includedTypes": {
      "type": "array",
      "items": {
        "enum": [
          "restaurant",
          "cafe",
          "bar",
          "bakery",
          "store",
          "supermarket",
          "hotel",
          "gas_station",
          "parking",
          "bank",
          "atm",
          "hospital",
          "pharmacy",
          "gym",
          "movie_theater",
          "museum",
          "park"
        ],
        "type": "string"
      },
      "description": "Types of places to include (up to 50). More types can be added to this list over time as needed."
    },
    "maxResultCount": {
      "type": "integer",
      "default": 10,
      "maximum": 20,
      "minimum": 1,
      "description": "Maximum number of results to return (1-20, default 10)"
    },
    "rankPreference": {
      "enum": [
        "DISTANCE",
        "POPULARITY"
      ],
      "type": "string",
      "default": "DISTANCE",
      "description": "How to rank results: DISTANCE or POPULARITY"
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
    "places": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "id",
          "name",
          "address",
          "location"
        ],
        "properties": {
          "id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "types": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "rating": {
            "type": "number"
          },
          "address": {
            "type": "string"
          },
          "openNow": {
            "type": "boolean"
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
          "priceLevel": {
            "type": "string"
          },
          "primaryType": {
            "type": "string"
          },
          "primaryPhoto": {
            "type": "object",
            "required": [
              "name",
              "widthPx",
              "heightPx"
            ],
            "properties": {
              "name": {
                "type": "string",
                "description": "Photo resource name"
              },
              "widthPx": {
                "type": "number",
                "description": "Original photo width in pixels"
              },
              "heightPx": {
                "type": "number",
                "description": "Original photo height in pixels"
              },
              "photoUrl": {
                "type": "string",
                "description": "Direct CDN URL to the photo image (safe to use in img tags)"
              },
              "authorAttributions": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "uri": {
                      "type": "string"
                    },
                    "photoUri": {
                      "type": "string"
                    },
                    "displayName": {
                      "type": "string"
                    }
                  },
                  "additionalProperties": false
                },
                "description": "Attribution information for the photo"
              }
            },
            "description": "Primary photo of the place",
            "additionalProperties": false
          },
          "businessStatus": {
            "type": "string"
          },
          "userRatingCount": {
            "type": "number"
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

### textSearch

**Description:** Search for places using a text query (e.g., 'pizza in New York', 'best coffee shops near me'). Returns places ranked by relevance to the query.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "textQuery"
  ],
  "properties": {
    "openNow": {
      "type": "boolean",
      "description": "Only return places that are currently open"
    },
    "minRating": {
      "type": "number",
      "maximum": 5,
      "minimum": 0,
      "description": "Filter results to places with at least this rating (0-5)"
    },
    "textQuery": {
      "type": "string",
      "description": "The search query text (e.g., 'restaurants in San Francisco')"
    },
    "priceLevels": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Filter by price levels (array of: 'PRICE_LEVEL_FREE', 'PRICE_LEVEL_INEXPENSIVE', 'PRICE_LEVEL_MODERATE', 'PRICE_LEVEL_EXPENSIVE', 'PRICE_LEVEL_VERY_EXPENSIVE')"
    },
    "includedType": {
      "type": "string",
      "description": "Filter results to a specific place type (e.g., 'restaurant', 'cafe', 'bar', 'bakery', 'store', 'supermarket', 'hotel', 'gas_station', 'parking', 'bank', 'atm', 'hospital', 'pharmacy', 'gym', 'movie_theater', 'museum', 'park')"
    },
    "maxResultCount": {
      "type": "integer",
      "default": 10,
      "maximum": 20,
      "minimum": 1,
      "description": "Maximum number of results to return (1-20, default 10)"
    },
    "rankPreference": {
      "type": "string",
      "default": "RELEVANCE",
      "description": "How to rank results: 'RELEVANCE' (default) or 'DISTANCE' (requires location restriction)"
    },
    "restrictLatitude": {
      "type": "number",
      "description": "Optional latitude for location restriction (results MUST be within this area). Use with restrictLongitude and restrictRadiusMeters."
    },
    "restrictLongitude": {
      "type": "number",
      "description": "Optional longitude for location restriction (results MUST be within this area). Use with restrictLatitude and restrictRadiusMeters."
    },
    "restrictRadiusMeters": {
      "type": "number",
      "maximum": 50000,
      "minimum": 1,
      "description": "Optional radius in meters for location restriction (1-50000). Results will ONLY include places within this area. Use with restrictLatitude and restrictLongitude."
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
    "places": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "id",
          "name",
          "address",
          "location"
        ],
        "properties": {
          "id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "types": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "rating": {
            "type": "number"
          },
          "address": {
            "type": "string"
          },
          "openNow": {
            "type": "boolean"
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
          "priceLevel": {
            "type": "string"
          },
          "primaryType": {
            "type": "string"
          },
          "primaryPhoto": {
            "type": "object",
            "required": [
              "name",
              "widthPx",
              "heightPx"
            ],
            "properties": {
              "name": {
                "type": "string",
                "description": "Photo resource name"
              },
              "widthPx": {
                "type": "number",
                "description": "Original photo width in pixels"
              },
              "heightPx": {
                "type": "number",
                "description": "Original photo height in pixels"
              },
              "photoUrl": {
                "type": "string",
                "description": "Direct CDN URL to the photo image (safe to use in img tags)"
              },
              "authorAttributions": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "uri": {
                      "type": "string"
                    },
                    "photoUri": {
                      "type": "string"
                    },
                    "displayName": {
                      "type": "string"
                    }
                  },
                  "additionalProperties": false
                },
                "description": "Attribution information for the photo"
              }
            },
            "description": "Primary photo of the place",
            "additionalProperties": false
          },
          "businessStatus": {
            "type": "string"
          },
          "userRatingCount": {
            "type": "number"
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

### getPlaceDetails

**Description:** Get detailed information about a specific place using its Place ID. Returns comprehensive details including contact info, hours, photos, reviews, and more.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "placeId"
  ],
  "properties": {
    "placeId": {
      "type": "string",
      "description": "The unique Place ID (e.g., 'ChIJj61dQgK6j4AR4GeTYWZsKWw'). Obtained from textSearch, searchNearby, or other Google Places APIs."
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
    "places": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "id",
          "name",
          "address",
          "location"
        ],
        "properties": {
          "id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "types": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "rating": {
            "type": "number"
          },
          "address": {
            "type": "string"
          },
          "openNow": {
            "type": "boolean"
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
          "priceLevel": {
            "type": "string"
          },
          "primaryType": {
            "type": "string"
          },
          "primaryPhoto": {
            "type": "object",
            "required": [
              "name",
              "widthPx",
              "heightPx"
            ],
            "properties": {
              "name": {
                "type": "string",
                "description": "Photo resource name"
              },
              "widthPx": {
                "type": "number",
                "description": "Original photo width in pixels"
              },
              "heightPx": {
                "type": "number",
                "description": "Original photo height in pixels"
              },
              "photoUrl": {
                "type": "string",
                "description": "Direct CDN URL to the photo image (safe to use in img tags)"
              },
              "authorAttributions": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "uri": {
                      "type": "string"
                    },
                    "photoUri": {
                      "type": "string"
                    },
                    "displayName": {
                      "type": "string"
                    }
                  },
                  "additionalProperties": false
                },
                "description": "Attribution information for the photo"
              }
            },
            "description": "Primary photo of the place",
            "additionalProperties": false
          },
          "businessStatus": {
            "type": "string"
          },
          "userRatingCount": {
            "type": "number"
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

