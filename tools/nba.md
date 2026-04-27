# Tool Server: nba

**ID:** d0002296-6aa5-4556-934a-3155901e1962

**Short Description:** NBA data and live scores

## Description

NBA data and live scores

## Tools (4)

### nba_daily_schedule

**Description:** Get NBA games scheduled for a specific date. Returns games with status (scheduled/inprogress/closed), scores, times, venues, and broadcast info. Best for checking today's games or live scores. Very short 10-second cache for real-time updates.

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

### nba_season_schedule

**Description:** Get full NBA season schedule. Returns games with dates, times, teams, venues, scores, and game status. IMPORTANT: STRONGLY recommended to use the team_alias parameter to filter by team - this significantly reduces response size and improves performance. 10-second cache for real-time updates.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "team_alias": {
      "type": "string",
      "description": "Optional: Team alias to filter results. If not provided, returns full schedule. Common aliases: ATL (Hawks), BOS (Celtics), BKN (Nets), CHA (Hornets), CHI (Bulls), CLE (Cavaliers), DAL (Mavericks), DEN (Nuggets), DET (Pistons), GSW (Warriors), HOU (Rockets), IND (Pacers), LAC (Clippers), LAL (Lakers), MEM (Grizzlies), MIA (Heat), MIL (Bucks), MIN (Timberwolves), NOP (Pelicans), NYK (Knicks), OKC (Thunder), ORL (Magic), PHI (76ers), PHX (Suns), POR (Trail Blazers), SAC (Kings), SAS (Spurs), TOR (Raptors), UTA (Jazz), WAS (Wizards)."
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

### nba_game_boxscore

**Description:** Get detailed game boxscore with player stats, team scores by quarter, leaders, and current game state. Returns comprehensive statistics including shooting percentages, rebounds, assists, turnovers, and more. Real-time updates for live games (10-second cache).

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

### nba_season_standings

**Description:** Get NBA season standings organized by conference and division. Returns wins, losses, win percentage, streaks, point differential, and various records (home/road, conference, division, last 10 games). Updated every 2 minutes after game completion.

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
        "IST",
        "PIT"
      ],
      "type": "string",
      "default": "REG",
      "description": "Season type: PRE (Preseason), REG (Regular Season), PST (Postseason), IST (In-Season Tournament), PIT (Play-In Tournament). Defaults to REG."
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

