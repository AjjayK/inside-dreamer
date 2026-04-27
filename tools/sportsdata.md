# Tool Server: sportsdata

**ID:** b6747965-a9ba-48b1-b8df-9f515e4f114a

**Short Description:** Fresh NBA, NFL, MLB, international and other sports data.

## Description

Fresh NBA, NFL, MLB, international and other sports data.

## Tools (4)

### sportsSearch

**Description:** Search for sports data using Google search. Handles team sports results (Soccer, American Football, Basketball, Hockey, Baseball, Cricket), game spotlight results, sports results for athletes, auto and moto racing sports results, league standings, etc. Examples: 'Lakers vs Warriors', 'Premier League standings', 'NFL scores today', 'Messi career stats', 'Formula 1 championship results', 'World Cup matches', 'NBA playoffs bracket'

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "q"
  ],
  "properties": {
    "q": {
      "type": "string",
      "description": "The sports search query to execute. Handles various sports queries including team matchups, league standings, player stats, racing results, etc. All date/time results are automatically converted to your timezone."
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
    "fetchedAt",
    "timezone"
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
    "timezone": {
      "type": "string",
      "description": "The user's timezone used for date/time conversions (e.g., 'America/Los_Angeles', 'Europe/London')"
    },
    "fetchedAt": {
      "type": "string"
    },
    "sports_results": {}
  },
  "additionalProperties": false
}
```

### olympics_seasons

**Description:** Get list of available Olympic Games seasons. Returns all Summer and Winter Olympics with their IDs and dates. Use this to find season IDs for medal table queries. All datetime fields are in UTC.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {},
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
    "data": {},
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
    "fetchedAt": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

### olympics_countries

**Description:** Get list of countries/NOCs (National Olympic Committees) that participate in the Olympics. Returns country codes, names, and IOC codes.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {},
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
    "data": {},
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
    "fetchedAt": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

### olympics_medal_table

**Description:** Get the medal table/standings for a specific Olympic Games. Returns gold, silver, bronze, and total medal counts for each country, sorted by ranking. Use olympics_seasons first to get the season_id.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "season_id"
  ],
  "properties": {
    "season_id": {
      "type": "string",
      "description": "The season ID from Sportradar (obtained from olympics_seasons). Example: '5066d835-89a1-492f-9db0-37e06ebaa919' for Paris 2024 Summer Olympics."
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
    "data": {},
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
    "fetchedAt": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

