# Tool Server: transitland

**ID:** e7f006c3-3cbd-42db-ad32-96c6bb1c10cb

**Short Description:** Local transit information

## Description

Agency, stops & departure information for local transit.

## Tools (3)

### find_agencies_near_location

**Description:** Find transit agencies/operators near a geographic location or address. Use this FIRST to discover which transit agencies serve an area (e.g., 'BART', 'Caltrain', 'Muni'), then use those exact agency names with search_stops_near_location or get_departures_from_stop to find stops/departures operated by specific agencies. Returns the official transit operators, not bus stops or facilities named after them. You can provide either lat/lon coordinates OR an address (which will be geocoded).

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "lat": {
      "type": "number",
      "description": "Latitude of the search location. Either provide lat/lon OR address (not both)."
    },
    "lon": {
      "type": "number",
      "description": "Longitude of the search location. Either provide lat/lon OR address (not both)."
    },
    "limit": {
      "type": "integer",
      "maximum": 1000,
      "description": "Maximum results (default: 50)",
      "exclusiveMinimum": 0
    },
    "radius": {
      "type": "number",
      "description": "Search radius in meters (default: 10000, max: 100000)"
    },
    "address": {
      "type": "string",
      "description": "Address to search near (e.g., '1600 Amphitheatre Parkway, Mountain View, CA'). Will be geocoded to coordinates. Either provide address OR lat/lon (not both)."
    },
    "agency_name": {
      "type": "string",
      "description": "Filter results to agencies matching this name (case-insensitive partial match). Example: 'Caltrain' or 'BART'."
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
    "count": {
      "type": "number"
    },
    "error": {
      "type": "string"
    },
    "success": {
      "type": "boolean"
    },
    "fetchedAt": {
      "type": "string"
    },
    "operators": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "onestop_id",
          "name"
        ],
        "properties": {
          "name": {
            "type": "string",
            "description": "Operator/agency name"
          },
          "feeds": {
            "type": "array",
            "items": {},
            "description": "Associated GTFS feeds"
          },
          "website": {
            "type": [
              "string",
              "null"
            ],
            "description": "Website URL"
          },
          "agencies": {
            "type": "array",
            "items": {},
            "description": "Associated agencies"
          },
          "timezone": {
            "type": [
              "string",
              "null"
            ],
            "description": "Timezone"
          },
          "onestop_id": {
            "type": "string",
            "description": "Unique Onestop ID for the operator"
          },
          "short_name": {
            "type": [
              "string",
              "null"
            ],
            "description": "Short name"
          }
        },
        "additionalProperties": true
      }
    }
  },
  "additionalProperties": false
}
```

### search_stops_near_location

**Description:** Search for transit stops near a geographic location or address. When agency_name is specified, returns ONLY stops actually operated by that transit agency - NOT stops that merely mention the agency in their name. For example, 'agency_name: BART' returns BART subway stations (operated by BART), but excludes bus stops named 'Embarcadero BART Drop Off' (operated by bus companies). Always use agency_name parameter when searching for a specific transit operator's stops. You can provide either lat/lon coordinates OR an address (which will be geocoded).

IMPORTANT: For finding 'closest' or 'nearby' stops, use radius: 1000-2000 (meters). DO NOT use large radius values - the API does NOT sort results by distance, so a large radius returns random distant stops instead of the closest ones. Maximum radius is 5000m.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "lat": {
      "type": "number",
      "description": "Latitude of the search location. Either provide lat/lon OR address (not both)."
    },
    "lon": {
      "type": "number",
      "description": "Longitude of the search location. Either provide lat/lon OR address (not both)."
    },
    "limit": {
      "type": "integer",
      "maximum": 1000,
      "description": "Maximum results (default: 100)",
      "exclusiveMinimum": 0
    },
    "radius": {
      "type": "number",
      "default": 2000,
      "description": "Search radius in meters. CRITICAL: For 'closest' or 'nearby' stops, use 1000-2000m. DO NOT USE 10000+ - API returns random stops within radius, NOT sorted by distance. Using large radius (>5000m) will return distant random stops, not the closest ones. Values >5000m are auto-corrected to 5000m. Default: 2000m."
    },
    "search": {
      "type": "string",
      "description": "Search for stops by name or ID. Performs a text search on stop names and stop IDs. Example: 'Market' to find stops with 'Market' in their name."
    },
    "address": {
      "type": "string",
      "description": "Address to search near (e.g., '1600 Amphitheatre Parkway, Mountain View, CA'). Will be geocoded to coordinates. Either provide address OR lat/lon (not both)."
    },
    "route_type": {
      "type": "array",
      "items": {
        "type": "number"
      },
      "description": "STRONGLY RECOMMENDED: Filter by transit mode. Common values: 2=Rail/Train (Caltrain, Amtrak), 1=Subway/Metro (BART, Muni Metro), 0=Tram/Light Rail, 3=Bus, 4=Ferry. Use this to find specific types of transit."
    },
    "agency_name": {
      "type": "string",
      "description": "IMPORTANT: Filter to ONLY stops actually operated/served by this transit agency. Returns stops where the agency runs service, NOT stops that merely mention the agency name. Examples: 'BART' returns only BART subway stations (not bus stops near BART), 'Caltrain' returns only Caltrain train stations, 'Muni' returns only Muni-operated stops. This performs server-side filtering by agency operator."
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
    "count": {
      "type": "number"
    },
    "error": {
      "type": "string"
    },
    "stops": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "onestop_id"
        ],
        "properties": {
          "stop_id": {
            "type": [
              "string",
              "null"
            ],
            "description": "GTFS stop ID"
          },
          "geometry": {
            "type": "object",
            "required": [
              "type",
              "coordinates"
            ],
            "properties": {
              "type": {
                "type": "string"
              },
              "coordinates": {
                "type": "array",
                "items": {
                  "type": "number"
                },
                "description": "Longitude, Latitude"
              }
            },
            "description": "Geographic coordinates",
            "additionalProperties": false
          },
          "stop_name": {
            "type": [
              "string",
              "null"
            ],
            "description": "Stop name"
          },
          "onestop_id": {
            "type": "string",
            "description": "Unique Onestop ID for the stop"
          },
          "route_stops": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "route": {
                  "type": "object",
                  "properties": {
                    "route_id": {
                      "type": [
                        "string",
                        "null"
                      ]
                    },
                    "route_type": {
                      "type": [
                        "number",
                        "null"
                      ],
                      "description": "GTFS route type"
                    },
                    "route_color": {
                      "type": [
                        "string",
                        "null"
                      ]
                    },
                    "route_long_name": {
                      "type": [
                        "string",
                        "null"
                      ]
                    },
                    "route_short_name": {
                      "type": [
                        "string",
                        "null"
                      ]
                    }
                  },
                  "additionalProperties": true
                }
              },
              "additionalProperties": true
            },
            "description": "Routes serving this stop"
          },
          "location_type": {
            "type": [
              "number",
              "null"
            ],
            "description": "GTFS location type (0=stop, 1=station, etc.)"
          }
        },
        "additionalProperties": true
      }
    },
    "success": {
      "type": "boolean"
    },
    "warning": {
      "type": "string"
    },
    "fetchedAt": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

### get_departures_from_stop

**Description:** Get upcoming departures from a specific transit stop. Shows when buses, trains, etc. will arrive/depart from the stop. Can filter by agency name for user-friendly filtering.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "stop_id"
  ],
  "properties": {
    "date": {
      "type": "string",
      "description": "Specific date in YYYY-MM-DD format (e.g., '2025-10-26'). Without 'next' parameter, returns departures starting from midnight (00:00:00) on this date."
    },
    "next": {
      "type": "integer",
      "description": "Seconds into the future to search (default: 3600 = 1 hour). Defines the time window duration. With relative_date/date, window starts at current time on that date. Without date parameters, starts from now.",
      "exclusiveMinimum": 0
    },
    "limit": {
      "type": "integer",
      "maximum": 1000,
      "description": "Maximum results (default: 100)",
      "exclusiveMinimum": 0
    },
    "stop_id": {
      "type": "string",
      "description": "The Onestop ID of the stop (e.g., 's-9q8yyugptw-16st~mission'). Get this from search_stops_near_location."
    },
    "route_type": {
      "type": "integer",
      "description": "Filter by GTFS route type: 2=Rail/Train, 1=Subway/Metro, 0=Tram/Light Rail, 3=Bus, 4=Ferry. Useful for multimodal stations."
    },
    "agency_name": {
      "type": "string",
      "description": "Filter departures to agencies matching this name (case-insensitive partial match). Example: 'Caltrain', 'BART', 'Muni'."
    },
    "relative_date": {
      "type": "string",
      "description": "Relative date: 'TODAY', 'NEXT_MONDAY', 'NEXT_TUESDAY', etc. When used with 'next', the time window starts at the current wall-clock time on that date. Without 'next', returns departures from midnight onwards."
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
    "stop": {
      "type": "object",
      "properties": {
        "stop_name": {
          "type": "string"
        },
        "onestop_id": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "count": {
      "type": "number"
    },
    "error": {
      "type": "string"
    },
    "success": {
      "type": "boolean"
    },
    "fetchedAt": {
      "type": "string"
    },
    "departures": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "trip": {
            "type": "object",
            "properties": {
              "route": {
                "type": "object",
                "properties": {
                  "agency": {
                    "type": "object",
                    "properties": {
                      "agency_id": {
                        "type": [
                          "string",
                          "null"
                        ]
                      },
                      "agency_name": {
                        "type": [
                          "string",
                          "null"
                        ]
                      }
                    },
                    "additionalProperties": true
                  },
                  "route_id": {
                    "type": [
                      "string",
                      "null"
                    ]
                  },
                  "route_type": {
                    "type": [
                      "number",
                      "null"
                    ]
                  },
                  "route_color": {
                    "type": [
                      "string",
                      "null"
                    ]
                  },
                  "route_long_name": {
                    "type": [
                      "string",
                      "null"
                    ]
                  },
                  "route_short_name": {
                    "type": [
                      "string",
                      "null"
                    ]
                  }
                },
                "additionalProperties": true
              },
              "trip_id": {
                "type": [
                  "string",
                  "null"
                ]
              },
              "trip_headsign": {
                "type": [
                  "string",
                  "null"
                ]
              }
            },
            "description": "Trip information",
            "additionalProperties": true
          },
          "arrival_time": {
            "type": [
              "string",
              "null"
            ],
            "description": "Scheduled arrival time"
          },
          "service_date": {
            "type": [
              "string",
              "null"
            ],
            "description": "Service date"
          },
          "stop_headsign": {
            "type": [
              "string",
              "null"
            ],
            "description": "Headsign at this stop"
          },
          "departure_time": {
            "type": [
              "string",
              "null"
            ],
            "description": "Scheduled departure time"
          },
          "continuous_pickup": {
            "type": [
              "number",
              "null"
            ]
          },
          "continuous_drop_off": {
            "type": [
              "number",
              "null"
            ]
          }
        },
        "additionalProperties": true
      }
    }
  },
  "additionalProperties": false
}
```

