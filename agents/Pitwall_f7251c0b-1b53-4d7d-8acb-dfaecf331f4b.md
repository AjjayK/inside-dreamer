# Agent: Pitwall

**ID:** f7251c0b-1b53-4d7d-8acb-dfaecf331f4b

## Description

# OVERVIEW
A comprehensive Formula 1 dashboard tracking drivers and constructors standings, race schedules with session timings in local timezone, team-specific customization, rumors and drama, and official news summaries. Features dynamic theming based on the user's favorite F1 team and a rich, characterful design with bespoke typography, motion, and spatial composition.

# KEY FEATURES
- **Standings Hub**, displays current drivers and constructors championships with live point totals, position changes, and visual hierarchy. Widget shows top 3 drivers at a glance.
- **Race Calendar & Session Timeline**, full F1 calendar with special emphasis on the upcoming race including FP1, FP2, FP3, qualifying, sprint, and race—all with session times converted to the user's local timezone. Countdown timers for imminent sessions.
- **Team Favorite Corner**, dedicated section showcasing the user's selected F1 team with team-specific stats, drivers, upcoming performances, and thematic styling. Onboarding flow allows team selection with theme auto-generation. Widget displays team status and next appearance.
- **Drama & Rumors Feed**, live stream of F1 gossip, controversies, and speculation sourced from racing media and social discourse. Posts are categorized, time-stamped, and linked to source material.
- **Official News Digest**, curated meaningful F1 news with AI-generated short-form summaries (3-5 sentences), clear bullet points of key takeaways, and direct links to full articles. Filters by topic (technical, regulatory, team news, driver moves).
- **Dynamic Theme System**, CSS variable-based theming that pulls the user's favorite team's official colors (primary, secondary, accent) and applies them across the entire interface—including typography weight, accent usage, and visual texture for context-specific character.

# VERBATIM INSTRUCTIONS
I want to build a full F1 tracker - it should have everything - drivers standing, constuctors standings, race schedule with specail callout for the upcoming race showing FP1 through race the timing of the session in the users local time. there should be a drama section that shows all the rummer spiralling around the sport and an offical news section that shows meaningful news and summarizies it into short bit size notes and links to where user can find more. the user should be able to set their fave team during onboarding and there should be a corner of the app dedicated to that team also the them should adjust to the teams colors

## Server Functions (23)

### generateCircuitAudio

**Description:** Generate an audio narration of a circuit overview

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "raceId"
  ],
  "properties": {
    "raceId": {
      "type": "string",
      "description": "The race stage ID to generate circuit audio for"
    }
  }
}
```

### generateDramaAudio

**Description:** Generate an audio summary of the latest F1 drama and rumors

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### generateNewsAudio

**Description:** Generate an audio summary of the latest F1 news headlines

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### generateNextRaceMoment

**Description:** Generate a famous F1 moment painting for the next upcoming race circuit

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### generateRaceMomentForCircuit

**Description:** Generate a famous F1 moment painting for a specific circuit

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "circuitId",
    "circuitName",
    "location",
    "country"
  ],
  "properties": {
    "country": {
      "type": "string",
      "description": "The circuit country"
    },
    "location": {
      "type": "string",
      "description": "The circuit location/city"
    },
    "circuitId": {
      "type": "string",
      "description": "The circuit/venue ID to generate a moment for"
    },
    "circuitName": {
      "type": "string",
      "description": "The circuit name"
    },
    "recentWinners": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "year",
          "driver",
          "team"
        ],
        "properties": {
          "team": {
            "type": "string"
          },
          "year": {
            "type": "number"
          },
          "driver": {
            "type": "string"
          }
        }
      }
    }
  }
}
```

### generateRaceSummary

**Description:** Generate a summary image of key moments for a completed race using NanoBanana Pro

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "raceId",
    "raceName"
  ],
  "properties": {
    "raceId": {
      "type": "string",
      "description": "The event stage ID of the completed race"
    },
    "raceName": {
      "type": "string",
      "description": "The race name"
    }
  }
}
```

### generateRaceSummaryAudio

**Description:** Generate an audio overview of a completed race summary

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "raceId"
  ],
  "properties": {
    "raceId": {
      "type": "string",
      "description": "The event stage ID of the completed race"
    }
  }
}
```

### getCircuitDetails

**Description:** Get comprehensive circuit information including records, weather, and statistics

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "raceId"
  ],
  "properties": {
    "raceId": {
      "type": "string",
      "description": "The race stage ID to get circuit details for"
    }
  }
}
```

### getConstructorStandings

**Description:** Get current F1 constructor championship standings

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getDriverStandings

**Description:** Get current F1 driver championship standings

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getF1Drama

**Description:** Get F1 drama, rumors, and controversies

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getF1News

**Description:** Get official F1 news with summaries

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getFavoriteTeams

**Description:** Get the user's favorite F1 teams (up to 3)

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getRaceMoment

**Description:** Get the famous F1 moment painting for a specific circuit

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "circuitId"
  ],
  "properties": {
    "circuitId": {
      "type": "string",
      "description": "The circuit/venue ID to get the moment for"
    }
  }
}
```

### getRaceSchedule

**Description:** Get the F1 race calendar for the current season

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getRaceSummaries

**Description:** Get all cached race summaries for completed races

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getSeasonCircuits

**Description:** Get all circuits for the current F1 season with basic info

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getTeamStats

**Description:** Get stats and drivers for a specific team

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "teamName"
  ],
  "properties": {
    "teamName": {
      "type": "string",
      "description": "The team name to get stats for"
    }
  }
}
```

### getTeams

**Description:** Get all F1 teams with their colors for team selection

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getUpcomingRace

**Description:** Get the next upcoming race with full session details

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### main

**Description:** Daily cron - generates race moment paintings for upcoming races and auto-generates summaries, images, and audio for recently completed races

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### resetFavoriteTeams

**Description:** Reset/clear the user's favorite teams selection

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### setFavoriteTeams

**Description:** Set the user's favorite F1 teams (up to 3, in order of preference)

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "teamIds"
  ],
  "properties": {
    "teamIds": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Array of team IDs in order of preference (max 3)"
    }
  }
}
```

