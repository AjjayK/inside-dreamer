# Tool Server: nhl

**ID:** 62a6704b-3abc-4ced-b15a-38c76297be43

**Short Description:** NHL data & live updates

## Description

NHL data & live updates

## Tools (5)

### nhl_daily_schedule

**Description:** Get NHL games scheduled for a specific date. Returns games with status (scheduled/inprogress/closed), scores, times, venues, and broadcast info. Best for checking today's games or live scores. Very short 10-second cache for real-time updates. All datetime fields are in UTC.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "date": {
      "type": "string",
      "description": "Date in YYYY-MM-DD format (e.g., '2025-10-08'). If not provided, defaults to today."
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

### nhl_season_schedule

**Description:** Get full NHL season schedule. Returns games with dates, times, teams, venues, scores, and game status. IMPORTANT: STRONGLY recommended to use the team_alias parameter to filter by team - this significantly reduces response size and improves performance. 10-second cache for real-time updates. All datetime fields are in UTC.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "team_alias": {
      "type": "string",
      "description": "Optional: Team alias to filter results. If not provided, returns full schedule. Common aliases: ANA (Ducks), ARI (Coyotes), BOS (Bruins), BUF (Sabres), CGY (Flames), CAR (Hurricanes), CHI (Blackhawks), COL (Avalanche), CBJ (Blue Jackets), DAL (Stars), DET (Red Wings), EDM (Oilers), FLA (Panthers), LAK (Kings), MIN (Wild), MTL (Canadiens), NSH (Predators), NJD (Devils), NYI (Islanders), NYR (Rangers), OTT (Senators), PHI (Flyers), PIT (Penguins), SJS (Sharks), SEA (Kraken), STL (Blues), TBL (Lightning), TOR (Maple Leafs), VAN (Canucks), VGK (Golden Knights), WSH (Capitals), WPG (Jets)."
    },
    "season_type": {
      "enum": [
        "PRE",
        "REG",
        "PST"
      ],
      "type": "string",
      "default": "REG",
      "description": "Season type: PRE (Preseason), REG (Regular Season), PST (Postseason/Playoffs). Defaults to REG."
    },
    "season_year": {
      "type": "number",
      "description": "The season year (e.g., 2025, 2024). If not provided, defaults to current year."
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

### nhl_game_boxscore

**Description:** Get detailed game boxscore with player stats, team scores by period, leaders, and current game state. Returns comprehensive statistics including goals, assists, shots, saves, penalties, and more. Real-time updates for live games (10-second cache). All datetime fields are in UTC.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "game_id"
  ],
  "properties": {
    "game_id": {
      "type": "string",
      "description": "The unique game ID from Sportradar (obtained from the schedule). Format is typically a UUID."
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

### nhl_season_standings

**Description:** Get NHL season standings organized by conference and division. Returns wins, losses, overtime losses, points, goals for/against, streaks, and various records (home/road, conference, division, last 10 games). Updated every 2 minutes after game completion.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "season_type": {
      "enum": [
        "PRE",
        "REG",
        "PST"
      ],
      "type": "string",
      "default": "REG",
      "description": "Season type: PRE (Preseason), REG (Regular Season), PST (Postseason). Defaults to REG."
    },
    "season_year": {
      "type": "number",
      "description": "The season year (e.g., 2025, 2024). If not provided, defaults to current year."
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

### nhl_team_profile

**Description:** Get comprehensive NHL team profile including franchise information, active roster, coaches, venue details, and team metadata. Returns detailed player information (name, position, jersey number, nationality), team colors, and venue information.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "team_id"
  ],
  "properties": {
    "team_id": {
      "type": "string",
      "description": "The unique team ID from Sportradar (obtained from the schedule or standings). Format is typically a UUID."
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

