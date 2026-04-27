# Tool Server: ncaafb

**ID:** 6c326fee-6e8e-4d1f-977c-7c12eab9d0d5

**Short Description:** NCAA data and live scores

## Description

NCAA data and live scores

## Tools (4)

### ncaafb_season_schedule

**Description:** Get current NCAA Football (college football) season schedule. Returns comprehensive game information including teams, venues, scores, status (scheduled, inprogress, complete), broadcast details, and playoff/tournament information. IMPORTANT: STRONGLY recommended to use the team_alias parameter to filter by team - this significantly reduces response size and improves performance.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "team_alias": {
      "type": "string",
      "description": "Optional team alias to filter results (e.g., 'ALA' for Alabama, 'OSU' for Ohio State, 'UGA' for Georgia, 'MICH' for Michigan, 'TEX' for Texas, 'USC' for USC, 'ND' for Notre Dame). Team aliases vary by school. If not provided, returns all games for the season."
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

### ncaafb_game_boxscore

**Description:** Get detailed boxscore and play-by-play information for a specific NCAA Football game. Returns real-time scoring information, quarter-by-quarter scores, player and team statistics, game status, drive summaries, and complete play-by-play details. Use this for live scores when games are in progress or detailed stats after completion.

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

### ncaafb_season_standings

**Description:** Get NCAA Football season standings with detailed records for conferences and divisions. Returns comprehensive standings information including overall records, conference/division records, home/road/neutral records, winning/losing streaks, and team rankings. Updated every 2 minutes after games complete.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "season_type": {
      "enum": [
        "REG",
        "PST"
      ],
      "type": "string",
      "default": "REG",
      "description": "The season type: REG (Regular Season), PST (Postseason). Defaults to REG."
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

### ncaafb_team_roster

**Description:** Get comprehensive NCAA Football team roster including franchise information, active players, coaches, venue details, and team metadata. Returns detailed player information (name, position, jersey number, height, weight, status, eligibility), team details (alias, championships, founding year), and venue information. Updated in realtime as roster or player profile changes are made.

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
      "description": "The unique team ID from Sportradar (obtained from the season schedule). Format is typically a UUID like 'a13245ef-cbd8-4fe9-84dc-871daf34ff34'."
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

