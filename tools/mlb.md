# Tool Server: mlb

**ID:** 432b0ea3-d241-4f37-8fdb-6cc6cd89b730

**Short Description:** MLB data and live scores

## Description

MLB data and live scores

## Tools (4)

### mlb_daily_schedule

**Description:** Get MLB games scheduled for a specific date. Returns games with status (scheduled/inprogress/closed), scores, times, and venues. Best for checking today's games or live scores. Much more focused than the full season schedule.

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

### mlb_league_schedule

**Description:** Get full MLB league schedule. Returns games with dates, times, teams, venues, scores, and game status. IMPORTANT: STRONGLY recommended to use the team_alias parameter to filter by team - this significantly reduces response size and improves performance.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "team_alias": {
      "type": "string",
      "description": "Optional: Team alias to filter results. If not provided, returns full schedule. Common aliases: ATL (Braves), BAL (Orioles), BOS (Red Sox), CHC (Cubs), CHW (White Sox), CIN (Reds), CLE (Guardians), COL (Rockies), DET (Tigers), HOU (Astros), KC (Royals), LAA (Angels), LAD (Dodgers), MIA (Marlins), MIL (Brewers), MIN (Twins), NYM (Mets), NYY (Yankees), OAK (Athletics), PHI (Phillies), PIT (Pirates), SD (Padres), SEA (Mariners), SF (Giants), STL (Cardinals), TB (Rays), TEX (Rangers), TOR (Blue Jays), WSH (Nationals)."
    },
    "season_type": {
      "enum": [
        "PRE",
        "REG",
        "PST",
        "AST"
      ],
      "type": "string",
      "default": "REG",
      "description": "Season type: PRE (Preseason), REG (Regular Season), PST (Postseason), AST (All-Star). Defaults to REG."
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

### mlb_game_boxscore

**Description:** Get detailed game boxscore with inning-by-inning scoring, player stats, runs, hits, errors, and current game state. Returns comprehensive statistics including pitcher outcomes, baserunners, and play-by-play data. Real-time updates for live games (2-second cache).

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
      "description": "The unique game ID from Sportradar (obtained from the league schedule). Format is typically a UUID."
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

### mlb_season_standings

**Description:** Get MLB season standings with team records, win/loss statistics, winning percentages, games behind, and current streaks. Returns comprehensive standings data organized by league and division (AL East, AL Central, AL West, NL East, NL Central, NL West).

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
        "PST",
        "AST"
      ],
      "type": "string",
      "default": "REG",
      "description": "Season type: PRE (Preseason), REG (Regular Season), PST (Postseason), AST (All-Star). Defaults to REG."
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

