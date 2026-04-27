# Tool Server: nfl

**ID:** 1947c067-dfec-40d2-b01e-c6a96ee24a7b

**Short Description:** NFL data and live scores

## Description

NFL data and live scores

## Tools (4)

### nfl_season_schedule

**Description:** Get full NFL season schedule. Returns comprehensive game information including teams, venues, scores, status (scheduled, inprogress, complete), and broadcast details. IMPORTANT: STRONGLY recommended to use the team_alias parameter to filter by team - this significantly reduces response size and improves performance.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "team_alias": {
      "type": "string",
      "description": "Optional: Team alias to filter results. If not provided, returns full schedule. Valid aliases: ARI (Cardinals), ATL (Falcons), BAL (Ravens), BUF (Bills), CAR (Panthers), CHI (Bears), CIN (Bengals), CLE (Browns), DAL (Cowboys), DEN (Broncos), DET (Lions), GB (Packers), HOU (Texans), IND (Colts), JAX (Jaguars), KC (Chiefs), LV (Raiders), LAC (Chargers), LAR (Rams), MIA (Dolphins), MIN (Vikings), NE (Patriots), NO (Saints), NYG (Giants), NYJ (Jets), PHI (Eagles), PIT (Steelers), SF (49ers), SEA (Seahawks), TB (Buccaneers), TEN (Titans), WAS (Commanders)."
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

### nfl_game_boxscore

**Description:** Get detailed boxscore and play-by-play information for a specific NFL game. Returns real-time scoring information, quarter-by-quarter scores, player and team statistics, game status, and complete play-by-play details. Use this for live scores when games are in progress or detailed stats after completion.

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
      "description": "The unique game ID from Sportradar (obtained from the season schedule). Format is typically a UUID like 'a13245ef-cbd8-4fe9-84dc-871daf34ff34'."
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

### nfl_season_standings

**Description:** Get NFL season standings with detailed records for divisions and conferences. Returns comprehensive standings information including overall records, division/conference records, home/road records, winning/losing streaks, and team rankings. Updated every 2 minutes after games complete.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "season_type": {
      "enum": [
        "REG",
        "PRE",
        "PST"
      ],
      "type": "string",
      "default": "REG",
      "description": "The season type: REG (Regular Season), PRE (Preseason), PST (Postseason). Defaults to REG."
    },
    "season_year": {
      "type": "number",
      "description": "The season year (e.g., 2025, 2024). If not provided, defaults to current season."
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

### nfl_team_profile

**Description:** Get comprehensive NFL team profile including franchise information, active roster, coaches, venue details, team colors, and historical achievements. Returns detailed player information (name, position, experience, jersey number), team metadata (championships, founding year, owner), and venue information. Updated in realtime as roster or player profile changes are made.

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
      "description": "The unique team ID from Sportradar (obtained from the season schedule). Format is typically a UUID like '386bdbf9-9eea-4869-bb9a-274b0bc66e80'."
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

