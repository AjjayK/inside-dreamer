# Tool Server: granola

**ID:** 921b8d9f-87a9-4661-862b-1acc5b84b9d7

**Short Description:** Access Granola meeting notes & transcripts

## Description

Review & manage your activity in Granloa

## Tools (4)

### query_granola_meetings

**Description:** Query Granola about the user's meetings using natural language. Returns a tailored response with inline citation links in mark  (e.g. [[0]](url)) that reference source meeting notes.

IMPORTANT: The response includes numbered citation links to specific Granola meeting notes. These citations MUST be preserved in your response to the user — they provide transparency and allow the user to verify information by clicking through to the original notes.

When to use:
- User asks about what was discussed, decided, or action-items from meetings
- User asks about follow-ups, todos, or commitments from recent meetings
- User references 'Granola notes' or 'meeting notes'

When NOT to use:
- User is asking about calendar scheduling or upcoming events
- User explicitly asks for a specific meeting by ID (use get_meetings instead)

Prioritize using query_granola_meetings over list_meetings/get_meetings for open-ended or natural language queries about meeting content.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "query"
  ],
  "properties": {
    "query": {
      "type": "string",
      "minLength": 1,
      "description": "The query to run on Granola meeting notes"
    },
    "document_ids": {
      "type": "array",
      "items": {
        "type": "string",
        "format": "uuid"
      },
      "description": "Optional list of specific meeting IDs to limit context to"
    }
  },
  "additionalProperties": false
}
```

### list_meetings

**Description:** List the user's Granola meeting notes within a time range. Returns meeting titles and metadata.

IMPORTANT: For short-term questions about recent meeting details, prefer using query_granola_meetings instead.

When to use:
- User asks to list their meetings
- User asks about action items, decisions, or summaries from meetings over a longer or specific date range
- User asks about content from their meeting transcripts
- User references 'Granola notes' or 'meeting notes' or 'transcripts'

When NOT to use:
- User is asking about upcoming calendar events or scheduling
- User wants to create/modify calendar invites

Use get_meetings to retrieve detailed meeting content after identifying relevant meetings.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "custom_end": {
      "type": "string",
      "description": "ISO date for custom range end (required if time_range is 'custom')"
    },
    "time_range": {
      "enum": [
        "this_week",
        "last_week",
        "last_30_days",
        "custom"
      ],
      "type": "string",
      "default": "last_30_days",
      "description": "Time range to query meetings from"
    },
    "custom_start": {
      "type": "string",
      "description": "ISO date for custom range start (required if time_range is 'custom')"
    }
  },
  "additionalProperties": false
}
```

### get_meetings

**Description:** Get detailed meeting information for one or more Granola meetings by ID. Returns private notes, AI-generated summary, attendees, and metadata.
Use this when you already have specific meeting IDs (e.g. from list_meetings results). For open-ended questions about meeting content, use query_granola_meetings instead.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "meeting_ids"
  ],
  "properties": {
    "meeting_ids": {
      "type": "array",
      "items": {
        "type": "string",
        "format": "uuid"
      },
      "maxItems": 10,
      "minItems": 1,
      "description": "Array of meeting UUIDs (max 10)"
    }
  },
  "additionalProperties": false
}
```

### get_meeting_transcript

**Description:** Get the full transcript for a specific Granola meeting by ID. Returns only the verbatim transcript content, not summaries or notes.
Use this when the user needs exact quotes, specific wording, or wants to review what was literally said in a meeting. For summarized content or action items, use query_granola_meetings or list_meetings/get_meetings instead.

**Input Schema:**

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "meeting_id"
  ],
  "properties": {
    "meeting_id": {
      "type": "string",
      "format": "uuid",
      "description": "Meeting UUID"
    }
  },
  "additionalProperties": false
}
```

