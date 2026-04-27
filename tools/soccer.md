# Tool Server: soccer

**ID:** 744988c5-4e55-4c42-b89d-768e7be46792

**Short Description:** Global soccer data and live scores

## Description

Global soccer data and live scores

## Tools (8)

### soccer_competitions

**Description:** Get list of all available soccer competitions worldwide with their IDs, names, and categories. Use this to find competition IDs for other tools. Returns competitions organized by country/category.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "name_filter": {
      "type": "string",
      "description": "Optional filter to search for competitions by name (e.g., 'Premier', 'Champions', 'Liga'). Case-insensitive partial matching."
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

### soccer_season_standings

**Description:** Get current standings for a soccer league/competition. Returns team rankings, points, wins, losses, draws, goals for/against, and performance metrics (home/away splits). Top competitions: UEFA Champions League (sr:competition:7), Premier League (sr:competition:17), LaLiga (sr:competition:8), Serie A (sr:competition:23), Bundesliga (sr:competition:35), Ligue 1 (sr:competition:34).

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
      "description": "The unique season ID from Sportradar (e.g., 'sr:season:118689' for Premier League 24/25). Use soccer_season_info tool to find season IDs for a competition."
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

### soccer_daily_matches

**Description:** Get soccer matches for a specific date with live scores, filtered by competition. Returns match summaries with teams, scores, status (scheduled/live/ended), start times, and statistics. IMPORTANT: Must specify competition_id to filter results (without filtering, returns 100+ matches worldwide). Use for live scores and match tracking. Top competitions: UEFA Champions League (sr:competition:7), Premier League (sr:competition:17), LaLiga (sr:competition:8), Serie A (sr:competition:23), Bundesliga (sr:competition:35), Ligue 1 (sr:competition:34).

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "date",
    "competition_id"
  ],
  "properties": {
    "date": {
      "type": "string",
      "description": "Date in YYYY-MM-DD format (e.g., '2025-10-08'). Use today's date for live scores."
    },
    "competition_id": {
      "type": "string",
      "description": "The competition ID to filter matches (e.g., 'sr:competition:17' for Premier League). Required to keep results manageable."
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

### soccer_season_info

**Description:** Get season information (including season IDs) for a specific competition. Returns list of seasons with IDs, names, start/end dates, and years. Use this to find season_id values needed for other tools like standings. Top competitions: UEFA Champions League (sr:competition:7), Premier League (sr:competition:17), LaLiga (sr:competition:8), Serie A (sr:competition:23), Bundesliga (sr:competition:35), Ligue 1 (sr:competition:34).

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "competition_id"
  ],
  "properties": {
    "competition_id": {
      "type": "string",
      "description": "The competition ID (e.g., 'sr:competition:17' for Premier League). Use soccer_competitions tool to find competition IDs."
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

### soccer_season_schedule

**Description:** Get full season schedule for a competition. Returns all matches with IDs, dates, teams, scores, and status. Can optionally filter by team_id to reduce response size. IMPORTANT: For team-specific queries, STRONGLY prefer using soccer_team_schedule tool instead - it is more efficient and includes past 30 matches plus all upcoming matches.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "season_id"
  ],
  "properties": {
    "team_id": {
      "type": "string",
      "description": "Optional: Team/competitor ID to filter results. If not provided, returns full schedule. Popular teams: Manchester United (sr:competitor:35), Manchester City (sr:competitor:17), Arsenal (sr:competitor:42), Chelsea (sr:competitor:38), Liverpool (sr:competitor:44), Real Madrid (sr:competitor:2829), Barcelona (sr:competitor:2817)."
    },
    "season_id": {
      "type": "string",
      "description": "The unique season ID from Sportradar (e.g., 'sr:season:118689' for Premier League 24/25). Use soccer_season_info tool to find season IDs."
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

### soccer_team_schedule

**Description:** Get match schedule for a specific team including past 30 matches and all upcoming matches. Perfect for answering questions like 'who did Newcastle play last?' or 'when is Liverpool's next match?'. Returns filtered match information including dates, opponents, scores, and competition. More efficient than season schedule when you only need one team's data.

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
      "description": "The unique team/competitor ID from Sportradar (e.g., 'sr:competitor:39' for Newcastle United). Can be found in match data from other tools or by searching competitions."
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

### soccer_match_summary

**Description:** Get detailed match summary including goal scorers, assists, team statistics, and play-by-play information. Perfect for answering 'who scored the goals?' or getting detailed match stats. Returns comprehensive match data with real-time updates (1-second cache for live matches).

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "match_id"
  ],
  "properties": {
    "match_id": {
      "type": "string",
      "description": "The unique match/sport event ID from Sportradar (e.g., 'sr:sport_event:50849967'). Can be obtained from schedule, daily matches, or team schedule tools."
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

### soccer_match_fun_facts

**Description:** Get interesting, human-readable fun facts about a match based on statistical information. Includes historical results, team performance trends, and noteworthy statistics (e.g., 'The most common result when these teams meet is 2-1' or 'Team X has scored in 10 consecutive matches'). Great for adding context to match discussions.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "match_id"
  ],
  "properties": {
    "match_id": {
      "type": "string",
      "description": "The unique match/sport event ID from Sportradar (e.g., 'sr:sport_event:50849967'). Can be obtained from schedule, daily matches, or team schedule tools."
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

