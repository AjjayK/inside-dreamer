# Tool Server: flightaware

**ID:** 0eeaaab7-23cc-40ad-bfc8-29e8cf75b9c8

**Short Description:** Live and historical flight tracking

## Description

Live and historical flight tracking via FlightAware

## Tools (2)

### getLastFlight

**Description:** Get the last flight information for an aircraft by registration number. Returns detailed flight history including origin, destination, times, and status.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "registration"
  ],
  "properties": {
    "registration": {
      "type": "string",
      "description": "Aircraft registration (e.g., N545DB)"
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
    "raw": {},
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
        "status": {
          "type": "number"
        },
        "details": {},
        "message": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "flights": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "type": {
            "type": [
              "string",
              "null"
            ],
            "description": "Flight type"
          },
          "ident": {
            "type": [
              "string",
              "null"
            ],
            "description": "Flight identifier"
          },
          "route": {
            "type": [
              "string",
              "null"
            ],
            "description": "Flight route"
          },
          "origin": {
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "city": {
                    "type": [
                      "string",
                      "null"
                    ],
                    "description": "Airport city"
                  },
                  "code": {
                    "type": [
                      "string",
                      "null"
                    ],
                    "description": "Airport code"
                  },
                  "name": {
                    "type": [
                      "string",
                      "null"
                    ],
                    "description": "Airport name"
                  },
                  "code_lid": {
                    "type": [
                      "string",
                      "null"
                    ],
                    "description": "Local airport identifier"
                  },
                  "timezone": {
                    "type": [
                      "string",
                      "null"
                    ],
                    "description": "Airport timezone"
                  },
                  "code_iata": {
                    "type": [
                      "string",
                      "null"
                    ],
                    "description": "IATA airport code"
                  },
                  "code_icao": {
                    "type": [
                      "string",
                      "null"
                    ],
                    "description": "ICAO airport code"
                  },
                  "airport_info_url": {
                    "type": [
                      "string",
                      "null"
                    ],
                    "description": "URL to airport information"
                  }
                },
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ],
            "description": "Origin airport"
          },
          "status": {
            "type": [
              "string",
              "null"
            ],
            "description": "Flight status"
          },
          "blocked": {
            "type": [
              "boolean",
              "null"
            ],
            "description": "Whether flight is blocked"
          },
          "diverted": {
            "type": [
              "boolean",
              "null"
            ],
            "description": "Whether flight was diverted"
          },
          "operator": {
            "type": [
              "string",
              "null"
            ],
            "description": "Operator name"
          },
          "actual_in": {
            "type": [
              "string",
              "null"
            ],
            "description": "Actual gate arrival time"
          },
          "actual_on": {
            "type": [
              "string",
              "null"
            ],
            "description": "Actual wheels-on time"
          },
          "atc_ident": {
            "type": [
              "string",
              "null"
            ],
            "description": "ATC identifier"
          },
          "cancelled": {
            "type": [
              "boolean",
              "null"
            ],
            "description": "Whether flight was cancelled"
          },
          "filed_ete": {
            "type": [
              "number",
              "null"
            ],
            "description": "Filed estimated time enroute in seconds"
          },
          "actual_off": {
            "type": [
              "string",
              "null"
            ],
            "description": "Actual wheels-off time"
          },
          "actual_out": {
            "type": [
              "string",
              "null"
            ],
            "description": "Actual gate departure time"
          },
          "codeshares": {
            "anyOf": [
              {
                "type": "array",
                "items": {
                  "type": "string"
                }
              },
              {
                "type": "null"
              }
            ],
            "description": "Codeshare flight identifiers"
          },
          "ident_iata": {
            "type": [
              "string",
              "null"
            ],
            "description": "IATA flight identifier"
          },
          "ident_icao": {
            "type": [
              "string",
              "null"
            ],
            "description": "ICAO flight identifier"
          },
          "destination": {
            "anyOf": [
              {
                "$ref": "#/properties/flights/items/properties/origin/anyOf/0"
              },
              {
                "type": "null"
              }
            ],
            "description": "Destination airport"
          },
          "gate_origin": {
            "type": [
              "string",
              "null"
            ],
            "description": "Origin gate"
          },
          "estimated_in": {
            "type": [
              "string",
              "null"
            ],
            "description": "Estimated gate arrival time"
          },
          "estimated_on": {
            "type": [
              "string",
              "null"
            ],
            "description": "Estimated wheels-on time"
          },
          "fa_flight_id": {
            "type": [
              "string",
              "null"
            ],
            "description": "FlightAware unique flight ID"
          },
          "registration": {
            "type": [
              "string",
              "null"
            ],
            "description": "Aircraft registration"
          },
          "scheduled_in": {
            "type": [
              "string",
              "null"
            ],
            "description": "Scheduled gate arrival time"
          },
          "scheduled_on": {
            "type": [
              "string",
              "null"
            ],
            "description": "Scheduled wheels-on time"
          },
          "aircraft_type": {
            "type": [
              "string",
              "null"
            ],
            "description": "Aircraft type"
          },
          "arrival_delay": {
            "type": [
              "number",
              "null"
            ],
            "description": "Arrival delay in seconds"
          },
          "baggage_claim": {
            "type": [
              "string",
              "null"
            ],
            "description": "Baggage claim area"
          },
          "estimated_off": {
            "type": [
              "string",
              "null"
            ],
            "description": "Estimated wheels-off time"
          },
          "estimated_out": {
            "type": [
              "string",
              "null"
            ],
            "description": "Estimated gate departure time"
          },
          "flight_number": {
            "type": [
              "string",
              "null"
            ],
            "description": "Flight number"
          },
          "operator_iata": {
            "type": [
              "string",
              "null"
            ],
            "description": "IATA operator code"
          },
          "operator_icao": {
            "type": [
              "string",
              "null"
            ],
            "description": "ICAO operator code"
          },
          "position_only": {
            "type": [
              "boolean",
              "null"
            ],
            "description": "Position only flight"
          },
          "scheduled_off": {
            "type": [
              "string",
              "null"
            ],
            "description": "Scheduled wheels-off time"
          },
          "scheduled_out": {
            "type": [
              "string",
              "null"
            ],
            "description": "Scheduled gate departure time"
          },
          "filed_airspeed": {
            "type": [
              "number",
              "null"
            ],
            "description": "Filed airspeed in knots"
          },
          "filed_altitude": {
            "type": [
              "number",
              "null"
            ],
            "description": "Filed altitude in feet"
          },
          "route_distance": {
            "type": [
              "number",
              "null"
            ],
            "description": "Route distance"
          },
          "codeshares_iata": {
            "anyOf": [
              {
                "type": "array",
                "items": {
                  "type": "string"
                }
              },
              {
                "type": "null"
              }
            ],
            "description": "IATA codeshare identifiers"
          },
          "departure_delay": {
            "type": [
              "number",
              "null"
            ],
            "description": "Departure delay in seconds"
          },
          "terminal_origin": {
            "type": [
              "string",
              "null"
            ],
            "description": "Origin terminal"
          },
          "actual_runway_on": {
            "type": [
              "string",
              "null"
            ],
            "description": "Actual runway arrival time"
          },
          "gate_destination": {
            "type": [
              "string",
              "null"
            ],
            "description": "Destination gate"
          },
          "progress_percent": {
            "type": [
              "number",
              "null"
            ],
            "description": "Flight progress percentage"
          },
          "actual_runway_off": {
            "type": [
              "string",
              "null"
            ],
            "description": "Actual runway departure time"
          },
          "seats_cabin_coach": {
            "type": [
              "number",
              "null"
            ],
            "description": "Coach seats"
          },
          "seats_cabin_first": {
            "type": [
              "number",
              "null"
            ],
            "description": "First class seats"
          },
          "inbound_fa_flight_id": {
            "type": [
              "string",
              "null"
            ],
            "description": "Inbound flight ID"
          },
          "seats_cabin_business": {
            "type": [
              "number",
              "null"
            ],
            "description": "Business class seats"
          },
          "terminal_destination": {
            "type": [
              "string",
              "null"
            ],
            "description": "Destination terminal"
          },
          "foresight_predictions_available": {
            "type": [
              "boolean",
              "null"
            ],
            "description": "Whether foresight predictions are available"
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
    },
    "registration": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

### getFlightStatus

**Description:** Get current and recent flight status by flight number or tail number. Returns detailed information about all matching flights including real-time status, times, delays, and route information.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "ident"
  ],
  "properties": {
    "ident": {
      "type": "string",
      "description": "Flight identifier - can be a flight number (e.g., 'ba285', 'dal123') or tail number (e.g., 'N545DB')"
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
    "raw": {},
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
        "status": {
          "type": "number"
        },
        "details": {},
        "message": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "ident": {
      "type": "string"
    },
    "flights": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "type": {
            "type": [
              "string",
              "null"
            ],
            "description": "Flight type"
          },
          "ident": {
            "type": [
              "string",
              "null"
            ],
            "description": "Flight identifier"
          },
          "route": {
            "type": [
              "string",
              "null"
            ],
            "description": "Flight route"
          },
          "origin": {
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "city": {
                    "type": [
                      "string",
                      "null"
                    ],
                    "description": "Airport city"
                  },
                  "code": {
                    "type": [
                      "string",
                      "null"
                    ],
                    "description": "Airport code"
                  },
                  "name": {
                    "type": [
                      "string",
                      "null"
                    ],
                    "description": "Airport name"
                  },
                  "code_lid": {
                    "type": [
                      "string",
                      "null"
                    ],
                    "description": "Local airport identifier"
                  },
                  "timezone": {
                    "type": [
                      "string",
                      "null"
                    ],
                    "description": "Airport timezone"
                  },
                  "code_iata": {
                    "type": [
                      "string",
                      "null"
                    ],
                    "description": "IATA airport code"
                  },
                  "code_icao": {
                    "type": [
                      "string",
                      "null"
                    ],
                    "description": "ICAO airport code"
                  },
                  "airport_info_url": {
                    "type": [
                      "string",
                      "null"
                    ],
                    "description": "URL to airport information"
                  }
                },
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ],
            "description": "Origin airport"
          },
          "status": {
            "type": [
              "string",
              "null"
            ],
            "description": "Flight status"
          },
          "blocked": {
            "type": [
              "boolean",
              "null"
            ],
            "description": "Whether flight is blocked"
          },
          "diverted": {
            "type": [
              "boolean",
              "null"
            ],
            "description": "Whether flight was diverted"
          },
          "operator": {
            "type": [
              "string",
              "null"
            ],
            "description": "Operator name"
          },
          "actual_in": {
            "type": [
              "string",
              "null"
            ],
            "description": "Actual gate arrival time"
          },
          "actual_on": {
            "type": [
              "string",
              "null"
            ],
            "description": "Actual wheels-on time"
          },
          "atc_ident": {
            "type": [
              "string",
              "null"
            ],
            "description": "ATC identifier"
          },
          "cancelled": {
            "type": [
              "boolean",
              "null"
            ],
            "description": "Whether flight was cancelled"
          },
          "filed_ete": {
            "type": [
              "number",
              "null"
            ],
            "description": "Filed estimated time enroute in seconds"
          },
          "actual_off": {
            "type": [
              "string",
              "null"
            ],
            "description": "Actual wheels-off time"
          },
          "actual_out": {
            "type": [
              "string",
              "null"
            ],
            "description": "Actual gate departure time"
          },
          "codeshares": {
            "anyOf": [
              {
                "type": "array",
                "items": {
                  "type": "string"
                }
              },
              {
                "type": "null"
              }
            ],
            "description": "Codeshare flight identifiers"
          },
          "ident_iata": {
            "type": [
              "string",
              "null"
            ],
            "description": "IATA flight identifier"
          },
          "ident_icao": {
            "type": [
              "string",
              "null"
            ],
            "description": "ICAO flight identifier"
          },
          "destination": {
            "anyOf": [
              {
                "$ref": "#/properties/flights/items/properties/origin/anyOf/0"
              },
              {
                "type": "null"
              }
            ],
            "description": "Destination airport"
          },
          "gate_origin": {
            "type": [
              "string",
              "null"
            ],
            "description": "Origin gate"
          },
          "estimated_in": {
            "type": [
              "string",
              "null"
            ],
            "description": "Estimated gate arrival time"
          },
          "estimated_on": {
            "type": [
              "string",
              "null"
            ],
            "description": "Estimated wheels-on time"
          },
          "fa_flight_id": {
            "type": [
              "string",
              "null"
            ],
            "description": "FlightAware unique flight ID"
          },
          "registration": {
            "type": [
              "string",
              "null"
            ],
            "description": "Aircraft registration"
          },
          "scheduled_in": {
            "type": [
              "string",
              "null"
            ],
            "description": "Scheduled gate arrival time"
          },
          "scheduled_on": {
            "type": [
              "string",
              "null"
            ],
            "description": "Scheduled wheels-on time"
          },
          "aircraft_type": {
            "type": [
              "string",
              "null"
            ],
            "description": "Aircraft type"
          },
          "arrival_delay": {
            "type": [
              "number",
              "null"
            ],
            "description": "Arrival delay in seconds"
          },
          "baggage_claim": {
            "type": [
              "string",
              "null"
            ],
            "description": "Baggage claim area"
          },
          "estimated_off": {
            "type": [
              "string",
              "null"
            ],
            "description": "Estimated wheels-off time"
          },
          "estimated_out": {
            "type": [
              "string",
              "null"
            ],
            "description": "Estimated gate departure time"
          },
          "flight_number": {
            "type": [
              "string",
              "null"
            ],
            "description": "Flight number"
          },
          "operator_iata": {
            "type": [
              "string",
              "null"
            ],
            "description": "IATA operator code"
          },
          "operator_icao": {
            "type": [
              "string",
              "null"
            ],
            "description": "ICAO operator code"
          },
          "position_only": {
            "type": [
              "boolean",
              "null"
            ],
            "description": "Position only flight"
          },
          "scheduled_off": {
            "type": [
              "string",
              "null"
            ],
            "description": "Scheduled wheels-off time"
          },
          "scheduled_out": {
            "type": [
              "string",
              "null"
            ],
            "description": "Scheduled gate departure time"
          },
          "filed_airspeed": {
            "type": [
              "number",
              "null"
            ],
            "description": "Filed airspeed in knots"
          },
          "filed_altitude": {
            "type": [
              "number",
              "null"
            ],
            "description": "Filed altitude in feet"
          },
          "route_distance": {
            "type": [
              "number",
              "null"
            ],
            "description": "Route distance"
          },
          "codeshares_iata": {
            "anyOf": [
              {
                "type": "array",
                "items": {
                  "type": "string"
                }
              },
              {
                "type": "null"
              }
            ],
            "description": "IATA codeshare identifiers"
          },
          "departure_delay": {
            "type": [
              "number",
              "null"
            ],
            "description": "Departure delay in seconds"
          },
          "terminal_origin": {
            "type": [
              "string",
              "null"
            ],
            "description": "Origin terminal"
          },
          "actual_runway_on": {
            "type": [
              "string",
              "null"
            ],
            "description": "Actual runway arrival time"
          },
          "gate_destination": {
            "type": [
              "string",
              "null"
            ],
            "description": "Destination gate"
          },
          "progress_percent": {
            "type": [
              "number",
              "null"
            ],
            "description": "Flight progress percentage"
          },
          "actual_runway_off": {
            "type": [
              "string",
              "null"
            ],
            "description": "Actual runway departure time"
          },
          "seats_cabin_coach": {
            "type": [
              "number",
              "null"
            ],
            "description": "Coach seats"
          },
          "seats_cabin_first": {
            "type": [
              "number",
              "null"
            ],
            "description": "First class seats"
          },
          "inbound_fa_flight_id": {
            "type": [
              "string",
              "null"
            ],
            "description": "Inbound flight ID"
          },
          "seats_cabin_business": {
            "type": [
              "number",
              "null"
            ],
            "description": "Business class seats"
          },
          "terminal_destination": {
            "type": [
              "string",
              "null"
            ],
            "description": "Destination terminal"
          },
          "foresight_predictions_available": {
            "type": [
              "boolean",
              "null"
            ],
            "description": "Whether foresight predictions are available"
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
    },
    "num_pages": {
      "type": "number"
    }
  },
  "additionalProperties": false
}
```

