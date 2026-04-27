# Agent: Quote Spark

**ID:** e34ef08c-2630-443c-8d6a-1c8b2dbc2eca

## Description

# OVERVIEW
Quote Spark delivers personalized motivational quotes on your schedule. Set your preferred frequency (daily, weekly, etc.), choose topics that resonate with you, and select your language. The agent generates fresh quotes using LLM-powered selection with randomized topic mixing to keep content fresh and inspiring.

# KEY FEATURES
- **Configurable Frequency**, Set how often you receive quotes: daily, multiple times per day, weekly, or custom intervals
- **Topic Selection**, Pick from motivation themes (perseverance, courage, success, creativity, health, etc.) and the agent randomly mixes selected topics for variety
- **Language Support**, Generate quotes in your preferred language (English, Spanish, Hindi, etc.)
- **Smart Delivery**, Quotes post to your feed with optional push notifications, organized by generation date
- **Dynamic Generation**, Uses LLM queries with randomization to create contextually relevant quotes based on your topic selections

# VERBATIM INSTRUCTIONS
create a motivation quote generator. Have option for user to specify the generate frequency and also set language and also pick topics. YOu can run llm query based on requesteed generate frequency with randomization of topics to generate the quote

## Server Functions (9)

### deliverQuote

**Description:** Generate and deliver a motivational quote (cron trigger)

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### generateNow

**Description:** Generate a motivational quote immediately on demand

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getPreferences

**Description:** Gets the user's quote preferences from the database

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getQuotes

**Description:** Gets generated quotes for the current user

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "limit": {
      "type": "number",
      "description": "Max number of quotes to return (default 20)"
    }
  }
}
```

### initializePreferences

**Description:** Initialize user preferences from Sidekick knowledge (call once only)

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### main

**Description:** Periodic background task for Quote Spark

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### parsePreferencesText

**Description:** Parse a natural language description of user preferences into structured data using an LLM

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "userInput",
    "currentTopics",
    "currentFrequency",
    "currentLanguage"
  ],
  "properties": {
    "userInput": {
      "type": "string",
      "description": "Free-text description of what the user wants"
    },
    "currentTopics": {
      "type": "string",
      "description": "Comma-separated current topics for defaults"
    },
    "currentLanguage": {
      "type": "string",
      "description": "Current language setting for default"
    },
    "currentFrequency": {
      "type": "string",
      "description": "Current frequency setting for default"
    }
  }
}
```

### savePreferences

**Description:** Save user preferences and set up delivery schedule

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "frequency",
    "language",
    "topics"
  ],
  "properties": {
    "topics": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "List of motivational topics"
    },
    "language": {
      "type": "string",
      "description": "Language for generated quotes"
    },
    "frequency": {
      "type": "string",
      "description": "How often to deliver quotes: daily, twice_daily, three_times_daily, weekly, or custom"
    },
    "cronExpression": {
      "type": "string",
      "description": "Custom cron expression (used when frequency is 'custom')"
    }
  }
}
```

### syncPreferencesToSidekick

**Description:** Sync preference changes to Sidekick memory

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "frequency",
    "language",
    "topics"
  ],
  "properties": {
    "topics": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "language": {
      "type": "string"
    },
    "frequency": {
      "type": "string"
    }
  }
}
```

