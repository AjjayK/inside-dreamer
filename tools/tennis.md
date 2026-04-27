# Tool Server: tennis

**ID:** 59df13c7-9da0-4e73-ad0a-f636f43f58df

**Short Description:** Keep up with Tennis across the world

## Description

ATP & WTA Competitions, with details, and Rankings

## Tools (9)

### tennis_competitions

**Description:** Get list of tennis competitions/tournaments. Returns tournaments organized by category (ATP, WTA, ITF, Grand Slams, etc.) with competition IDs. Use the competition_id with tennis_season_schedule to get match schedules. Filter by name or level to narrow results.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "name": {
      "type": "string",
      "description": "Optional: Filter competitions by name (case-insensitive partial match). Example: 'australian' to find Australian Open, 'wimbledon' for Wimbledon, 'us open' for US Open."
    },
    "level": {
      "enum": [
        "grand_slam",
        "atp_1000",
        "atp_500",
        "atp_250",
        "wta_1000",
        "wta_500",
        "wta_250",
        "atp_challenger",
        "wta_125",
        "itf_men",
        "itf_women",
        "atp_finals",
        "wta_finals",
        "atp_championships",
        "wta_championships"
      ],
      "type": "string",
      "description": "Optional: Filter by tournament level. Values: 'grand_slam' (Australian Open, French Open, Wimbledon, US Open), 'atp_1000'/'wta_1000' (Masters/Premier Mandatory), 'atp_500'/'wta_500', 'atp_250'/'wta_250', 'atp_challenger', 'wta_125', 'itf_men'/'itf_women', 'atp_finals'/'wta_finals' (year-end championships)."
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

### tennis_season_schedule

**Description:** Get the full schedule for a specific tennis season/tournament. Returns all matches in the season with dates, players, scores, and status. Automatically finds the season for the given year and competition. All datetime fields are in UTC.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "year",
    "competition_id"
  ],
  "properties": {
    "year": {
      "type": "number",
      "description": "The year of the tournament. Example: 2025 for the 2025 Australian Open. The tool will find the matching season for this year."
    },
    "competition_id": {
      "type": "string",
      "description": "The competition ID from Sportradar (obtained from tennis_competitions). Example: 'sr:competition:2567' for Australian Open Men Singles."
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

### tennis_daily_schedule

**Description:** Get tennis matches scheduled for a specific date within a season. Returns matches with status, scores, players, and tournament info. Requires a season_id to filter results to a specific tournament. All datetime fields are in UTC.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "season_id"
  ],
  "properties": {
    "date": {
      "type": "string",
      "description": "Date in YYYY-MM-DD format (e.g., '2025-06-15'). If not provided, defaults to today."
    },
    "season_id": {
      "type": "string",
      "description": "The season ID from Sportradar. Use tennis_season_schedule with competition_id and year instead for easier access. Example: 'sr:season:98745'."
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

### tennis_live_matches

**Description:** Get currently live tennis matches. Returns real-time scores, set scores, game scores, and match status. Use this for live score tracking. Very short cache (10 seconds) for real-time updates. Optionally filter by competition. All datetime fields are in UTC.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "competition_id": {
      "type": "string",
      "description": "Optional competition ID to filter live matches (obtained from tennis_competitions). Example: 'sr:competition:2567' for Australian Open Men Singles. If not provided, returns all live matches."
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

### tennis_match_timeline

**Description:** Get detailed point-by-point timeline for a specific tennis match. Returns every point, game, and set with timestamps. Use this for detailed match analysis or live tracking of a specific match. All datetime fields are in UTC.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "sport_event_id"
  ],
  "properties": {
    "sport_event_id": {
      "type": "string",
      "description": "The sport event ID from Sportradar (obtained from schedule or live matches). Example: 'sr:sport_event:12345678'."
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

### tennis_tournament_bracket

**Description:** Get the tournament bracket/draw for a specific tennis season. Returns the full bracket structure with all rounds, matches, and results. Use this to display tournament draws and track progression.

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
      "description": "The season ID from Sportradar. Use tennis_season_schedule with competition_id and year instead for easier access. Example: 'sr:season:98745'."
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

### tennis_rankings

**Description:** Get current tennis player rankings. Returns ATP and WTA singles and doubles rankings with player names, ranking points, and movement. Use this for leaderboard displays.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "ranking_type": {
      "enum": [
        "atp",
        "wta"
      ],
      "type": "string",
      "default": "atp",
      "description": "The ranking type: 'atp' for men's rankings, 'wta' for women's rankings."
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

### tennis_race_rankings

**Description:** Get tennis race rankings (year-to-date points). Returns ATP Race to Turin and WTA Race to Finals rankings. These rankings determine qualification for year-end championships.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "ranking_type": {
      "enum": [
        "atp",
        "wta"
      ],
      "type": "string",
      "default": "atp",
      "description": "The ranking type: 'atp' for men's race, 'wta' for women's race."
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

### tennis_player_profile

**Description:** Get detailed profile for a tennis player. Returns biographical info, career statistics, recent results, and tournament history.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "competitor_id"
  ],
  "properties": {
    "competitor_id": {
      "type": "string",
      "description": "The competitor/player ID from Sportradar. Example: 'sr:competitor:14882' for Novak Djokovic."
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

