# Agent: Pocketable

**ID:** aa5102f2-f18f-4c6f-b22c-9b94483d20f0

## Description

# OVERVIEW
Pocketable is an agent designed to help you save, summarize, tag, and listen to web articles efficiently. It integrates with the share trigger to capture articles, automatically crawls their content, generates detailed summaries, and classifies them into "think" or "chill" categories with additional tags based on content analysis.

## Core Features Implemented
- **Article capture via share trigger**: Users can share URLs from their browser or other apps, and Pocketable will automatically process them
- **Web crawling**: Uses the webcrawl tool to fetch and extract readable content from any web page
- **OpenGraph metadata capture**: Automatically extracts and stores OpenGraph metadata (title, description, image) when available
- **AI-powered summarization**: Generates both detailed (2-3 paragraphs) and short summaries (1-2 sentences) using LLM
- **Intelligent categorization**: Automatically classifies articles as "think" (analytical/deep content) or "chill" (lighter content)
- **Smart tagging**: Generates 3-5 relevant content-based tags for each article
- **Audio summaries**: Creates engaging multi-voice podcast-style audio using ElevenLabs TTS with male-1 voice for narration and female-1 voice for quotes
- **Podcast feed bulletins**: Automatically posts bulletins to user's feed with article title, summary, and audio URL after successful audio generation
- **Audio playback controls**: Play/pause functionality with variable speed control (0.5x - 2x)
- **Article management**: Archive articles when done, provide thumbs up/down feedback
- **Responsive UI**: Both compact widget view and full app view with category filtering
- **Rich article preview**: Displays OpenGraph description and image (when available) in full app view for better article preview

## User Workflow
1. User shares a URL via the share sheet (triggers "Add Article to Pocketable")
2. Pocketable crawls the article content
3. AI analyzes and generates summary, tags, category classification, and audio script
4. ElevenLabs generates multi-voice audio (narration + quotes)
5. Bulletin is posted to user's feed with article title, short summary, audio MP3 URL, and source URL
6. Article appears in widget and app UI with playback controls
7. User can read summary, listen to audio (from bulletin or in-app), archive when done, and provide feedback

# DESIGN
- **Semantic Color System**: Uses Tailwind's semantic color tokens (foreground, background, primary, secondary, etc.) for automatic dark/light mode support
- **Widget UI**:
  - Compact, scrollable list (max 5 recent articles)
  - Shows title and short summary (truncated to 2 lines)
  - Play button for audio, archive button, feedback buttons
  - Links to original article with external link icon
  - Category badge (think/chill)
- **Full App UI**:
  - Top-level filter buttons: All / Think / Chill
  - Article cards with full summary, all tags, author byline
  - OpenGraph description displayed in italic text between title and summary (when available)
  - OpenGraph image displayed as inset on right side of article card (when available, 128x128px, rounded corners)
  - Complete playback controls (play/pause + speed selector when playing)
  - Archive and feedback buttons
  - Responsive layout (mobile and desktop friendly)
- **Icons**: Uses Lucide React icon library for consistency
- **Responsive Design**: Adapts to different screen sizes, widget constraints (~300x300px), and full screen app mode

# TECHNICAL IMPLEMENTATION

## Server Functions (src/server.ts)
- **handleInput**: Input trigger handler that processes URLs from share sheet
  - Checks for duplicate articles
  - Crawls URL using webcrawl tool (extracts content and OpenGraph metadata)
  - Stores OpenGraph data (title, description, image, imageAlt, siteName, etc.) when available
  - Generates summary, classification, tags, and audio script in single LLM call (cost optimization)
  - Creates multi-voice audio with ElevenLabs
  - Posts bulletin with article title, short summary, audio URL, and source URL
  - Stores article with all metadata in KV store
- **saveUrl**: Exported function for sidekick integration to save and process a single article URL (includes bulletin posting)
- **getArticles**: Getter function that returns all articles sorted by date (filtering done client-side)
- **archiveArticle**: Marks an article as archived
- **unarchiveArticle**: Unarchives an article
- **recordFeedback**: Tracks thumbs up/down per domain+tag combination for future recommendation features
- **getUserFeedback**: Returns feedback data (not exported)

## Frontend (src/App.tsx)
- **ArticleItem component**: Reusable article card with audio playback logic
  - HTML5 Audio API for playback
  - React state for play/pause and speed control
  - Speed cycling through 7 presets
  - Displays OpenGraph description in italic text (full app view only)
  - Displays OpenGraph image as inset thumbnail (full app view only, 128x128px)
  - Responsive layout with flex for image and text alignment
- **WidgetView**: Compact view showing 5 most recent unarchived articles
- **AppView**: Full view with category filtering and all article details
- **Client-side filtering**: Category and archive status filtering done in React for performance

## Data Storage
- Articles stored as array in KV store under "articles" key with complete metadata including:
  - Core fields: id, url, title, byline, summary, shortSummary, category, tags, audioUrl, readableHtml
  - Metadata: addedAt, archived, processing status, userFeedback
  - OpenGraph data: title, description, image, imageAlt, imageWidth, imageHeight, url, type, siteName
- User feedback stored under "userFeedback" key as domain:tag → {thumbsUp, thumbsDown} map
- Persistent across sessions

## Tools Used
- **webcrawl** (v1.0.6): Fetches and extracts readable content from URLs
  - Extracts article title, byline, and main content
  - Captures OpenGraph metadata (title, description, image, etc.) when available
- **text-to-speech** (v1.0.0): ElevenLabs multi-voice audio generation
  - male-1 voice for narration
  - female-1 voice for "Quote!" and quoted text
- **bulletins** (v1.0.0): Creates agent bulletins for user's feed
  - Posts article summaries with audio URLs for podcast-style consumption
  - Attachments include markdown summary, audio URL, and source URL

## AI Features
- **Content Analysis**: Single LLM call to generate summary (detailed + short), category classification, tags, and audio script structure
- **Smart Audio Script**: LLM creates engaging narration with identified quotes
- **Multi-Voice Synthesis**: Alternates between male and female voices for dynamic podcast-style audio
- **Cost Optimization**:
  - Single LLM call instead of multiple separate calls
  - Articles processed once and cached permanently
  - No recurring costs or scheduled jobs
  - Deduplication prevents reprocessing same URLs

## Known Limitations
- **Quote Detection**: Audio script uses heuristic quote detection; may not perfectly identify all quotes in complex articles
- **Client-side Filtering**: Category filtering done in React rather than server-side for simplicity with useServerGetterFunction API
- **Bulletin Error Handling**: If bulletin creation fails, the article is still processed successfully (bulletins are treated as non-critical)

## Server Functions (10)

### archiveArticle

**Description:** Archive an article

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "articleId"
  ],
  "properties": {
    "articleId": {
      "type": "string",
      "minLength": 1,
      "description": "The ID of the article to archive"
    }
  }
}
```

### deleteArticle

**Description:** Permanently delete an article

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "articleId"
  ],
  "properties": {
    "articleId": {
      "type": "string",
      "minLength": 1,
      "description": "The ID of the article to delete"
    }
  }
}
```

### getArticles

**Description:** Get all articles

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getUserFeedback

**Description:** Get all user feedback data

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### handleInput

**Description:** Handle input from share sheet to add articles

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "message": {
      "type": "string"
    },
    "attachments": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "contentType",
          "data"
        ],
        "properties": {
          "data": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "contentType": {
            "type": "string"
          }
        }
      }
    }
  }
}
```

### migrateData

**Description:** Migrate article and feedback data from JSON files in src/ directory to the database

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### recordFeedback

**Description:** Record user feedback (thumbs up or down) for an article. Toggles feedback if clicked again.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "articleId",
    "feedback"
  ],
  "properties": {
    "feedback": {
      "anyOf": [
        {
          "type": "string",
          "const": "up"
        },
        {
          "type": "string",
          "const": "down"
        }
      ]
    },
    "articleId": {
      "type": "string",
      "minLength": 1,
      "description": "The ID of the article"
    }
  }
}
```

### saveUrl

**Description:** Save and process a single article URL. The article will be crawled, summarized, categorized as 'think' or 'chill', tagged, and an audio summary will be generated.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "url"
  ],
  "properties": {
    "url": {
      "type": "string",
      "minLength": 1,
      "description": "The URL of the article to save and process"
    }
  }
}
```

### toggleCategory

**Description:** Toggle an article's category between think and chill

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "articleId"
  ],
  "properties": {
    "articleId": {
      "type": "string",
      "minLength": 1,
      "description": "The ID of the article"
    }
  }
}
```

### unarchiveArticle

**Description:** Unarchive an article

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "articleId"
  ],
  "properties": {
    "articleId": {
      "type": "string",
      "minLength": 1,
      "description": "The ID of the article to unarchive"
    }
  }
}
```

