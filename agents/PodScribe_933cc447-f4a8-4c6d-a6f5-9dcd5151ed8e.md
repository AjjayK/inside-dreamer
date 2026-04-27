# Agent: PodScribe

**ID:** 933cc447-f4a8-4c6d-a6f5-9dcd5151ed8e

## Description

# OVERVIEW
PodScribe turns podcast listening into a searchable, reviewable knowledge base. Share an episode URL or upload audio, and the agent streams it with a built-in player. Generate transcripts, AI summaries, and searchable chapters. Save key moments as snips by tapping while you listen—each snip captures the exact timestamp, transcript quote, and speaker context. Review snips daily and sync everything to Notion, Readwise, or Markdown.

# KEY FEATURES
- **Built-in audio playback**, Stream podcast episodes or uploaded audio directly in the agent with a simple player interface; tap to create snips at key moments
- **Instant transcripts & chapters**, AI-generated summaries and topic segments for any episode; full searchable transcript with speaker labels; real-time progress bar shows processing stages
- **Snips: one-tap capture**, Save key moments while listening; each snip locks in the timestamp, exact transcript quote, speaker context, and AI summary. Tapping a saved snip navigates to the episode and seeks the player to that exact moment
- **Chat with episodes**, Ask questions in natural language about what you heard; get answers with precise timestamps to jump back to the audio moment
- **Daily recap & review loop**, Revisit saved snips with spaced repetition-style prompts; mark as remembered, star, or tag for deeper learning
- **One-click knowledge exports**, Sync snips, transcripts, and summaries directly to Notion, Readwise, or Markdown—no copy-paste required. Re-exporting to Notion updates the same page instead of creating duplicates; Notion page ID is tracked per episode; graceful fallback creates new page if update fails

# VERBATIM INSTRUCTIONS
PRD (Product Requirements Document): “PodScribe” — a free AI podcast learning player
1) Summary
Product name: PodScribe
One-liner: A free podcast player that turns listening into a searchable, reviewable knowledge base—through transcripts, AI (Artificial Intelligence) notes, and one-tap “snips” captured while you listen.
Inspiration / reference behavior: Snipd’s feature set around AI-generated transcripts, chapters, summaries, headphone/voice snipping, chat-with-episodes, and exports to knowledge tools. 
Pricing constraint: 100% free (no subscription tiers mentioned anywhere in-product).
________________________________________
2) Problem statement
People listen to podcasts to learn—but audio is “non-indexable” in the moment:
•	You can’t easily save a key idea while commuting/running/driving.
•	You can’t search or re-find a specific quote later.
•	You forget insights because there’s no review loop (spaced repetition, recap).
•	Notes end up fragmented across apps; exporting is painful.
PodScribe solves this by making listening behave more like reading: searchable text, highlights, review, and sharing—without breaking the listening flow. (Comparable behaviors exist in Snipd: transcripts with speaker identification, headphone snipping that creates a highlight with transcript + summary, daily recap, and exports.) 
________________________________________
3) Goals and success metrics
Primary goals
1.	Capture: Let users save key moments hands-free while listening (headphones, car, watch, voice). 
2.	Recall: Make every listened episode searchable and “chat-able” so users can instantly retrieve ideas and moments. 
3.	Retention: Provide a lightweight daily review loop (recap/spaced repetition). 
4.	Knowledge flow: One-click export/sync to note systems (e.g., Notion, Readwise, Markdown-based apps). 
________________________________________
4) Target users & personas
1.	The Commuter Learner: listens while driving; needs hands-free capture and later review. (Car integrations + steering-wheel capture are important.) 
2.	The Workout Listener: uses headphones/wearables; wants quick capture + offline. 
3.	The Knowledge Builder (PKM — Personal Knowledge Management): wants exports to Notion/Readwise/Obsidian/Markdown. 
4.	The Researcher: needs transcripts, speaker labels, chapter navigation, and precise retrieval. 
________________________________________
5) Scope (what we will build)
5.1 Content coverage & library portability
Requirements
•	Search and play podcasts from a broad catalog.
•	If a podcast can’t be found, provide user feedback flow + support for adding via RSS feed. 
•	Support private RSS feed adding for membership/premium feeds (user brings the feed URL). 
•	Import subscriptions from other podcast apps via:
o	Direct guided imports (e.g., Apple Podcasts) and OPML (Outline Processor Markup Language) where applicable. 
•	Lightweight organization:
o	Custom podcast lists (with filters like played/unplayed, number of episodes, etc.) 
o	Archive episodes to keep feeds clean 
Non-goals
•	Being a “music app”
•	Hosting user-generated public podcast feeds (we’re a player + learning layer)
________________________________________
5.2 Core listening experience (table stakes + “smart listening”)
Requirements
•	Smooth playback with queue, downloads, and offline listening.
•	Auto-download modes:
o	Smart downloads, queue downloads, new episode downloads; Wi-Fi only option; auto cleanup of older episodes. 
•	Skip intro/outro per show using detected segments/chapters. 
•	Chapter navigation, including hands-free “chapter skipping” patterns (e.g., headphone gestures). 

________________________________________
5.3 Episode understanding (transcripts, structure, previews)
Requirements
•	Full transcripts with speaker identification; searchable. 
•	“Engaging / real-time animated” transcript reading mode (as a product spec outcome). 
•	AI-generated chapters (topic segments) for navigation. 
•	AI episode summaries to preview before listening. 
•	“Key highlights before you listen” (AI Snips / highlights preview). 
Quality requirement: transcript alignment
•	The product must handle transcript/audio misalignment caused by dynamic ad insertion (DAI — Dynamic Ad Insertion) gracefully (e.g., resync strategy, warnings, user reporting). 
________________________________________
5.4 Capture: Snips (highlights) while listening
Definition
A snip is a saved moment that includes: audio clip (or pointer), transcript excerpt, speaker context, and an AI summary/note. (This is how Snipd describes headphone snipping behavior.) 
Capture methods
1.	Headphone capture: user triggers a gesture (e.g., skip-back control / triple-tap) → confirmation cue → snip created. 
2.	In-app capture: tap a “Create snip” button (must work even without headphones). (Analogous watch behavior exists.) 
3.	Car capture: steering wheel / car UI interaction while driving; user reviews later. 
4.	Voice assistant capture (iOS): create snips with Siri-style flows (voice-first capture). 
Snip customization requirements
•	Snip title generation toggle, summary format options (short/long/custom prompt), and snip duration (auto vs fixed). 
________________________________________
5.5 Recall: Library, search, and “chat with episodes”
Requirements
•	A “Listening Library” that stores:
o	listened episodes
o	saved snips
o	episode summaries/chapters/transcripts
•	Search across:
o	episode titles/show names
o	transcripts
o	snip notes
•	Chat with episodes:
o	user asks a question in natural language
o	response includes quotes + timestamps and supports jumping back to the audio moment 
•	“Chat shortcuts” / prompt buttons:
o	one-tap prompts like summary, quiz, reflection questions, best quotes, etc. (customizable) 
________________________________________
5.6 Review loop: Daily recap (spaced repetition)
Requirements
•	A Daily Recap widget/screen that surfaces previously saved snips for review using spaced repetition style cadence. 
•	Actions in recap:
o	mark as “remembered”
o	star/favorite
o	tag/topic label
o	jump back to original audio moment
________________________________________
5.7 Knowledge building: sharing + exporting/syncing
Sharing requirements
•	Share a snip as:
o	text summary
o	audio/video clip (where available)
o	shareable quote cards with speaker context 
Export/sync requirements
•	Notion integration: create/update a database organized by episodes; includes snip note, transcript, episode AI notes, link to original audio, metadata, snip counts. 
•	Readwise integration: sync snip note, transcript, audio link, metadata; support filtering what gets synced. 
•	Markdown export for broad compatibility (and direct import into other tools). 
•	Obsidian sync experience (plugin-like behavior): sync transcript, AI summary, notes, snip link, mentioned books, guest names, rich metadata; allow formatting customization. 
•	Optional: Glasp sync integration (highlights exported into a knowledge graph / highlight system). 
________________________________________
5.8 “Go beyond podcasts”: YouTube + uploads
Requirements
•	Import YouTube videos via share sheet or URL paste; process into transcript/chapters; allow chat; offline listening; do not require video playback. 
•	Upload audio files from phone and from desktop upload portal; optionally process with AI features; enable chat and offline. 
•	Support audiobooks from partner libraries (e.g., Libro.fm import behavior exists in Snipd; PodScribe should support “external audiobook library import” as a concept). 
________________________________________
5.9 Discovery overlays (optional but differentiating)
Requirements
•	“Guests” pages: bios, appearances, and “similar guests” exploration. 
•	“Mentioned books”: extract books mentioned; show most-cited per show. 
•	“Video snips”: 2–5 minute video highlight feed for select shows; jump into full episode. 
________________________________________
6) Out of scope (explicit)
•	Full video watching inside the app (YouTube imports are for listening + learning; no video playback) 
•	Social network features (followers, public feeds) beyond share links/cards
________________________________________
7) User journeys (happy paths)
Journey A: “Save a moment while walking”
1.	User plays an episode.
2.	Hears a valuable insight → clicks a button to create snip. 
3.	PodScribe saves snip with transcript excerpt + speaker + AI summary (based on user’s chosen format). 
4.	Later, user opens Daily Recap and reviews it. 
Journey B: “Find that quote from last week”
1.	User opens an episode they listened to.
2.	Uses chat to ask: “What did they say about X?” 
3.	Gets answer with quotes + timestamps → taps timestamp → audio jumps to moment. 
Journey C: “Build my second brain”
1.	User connects Notion/Readwise/Markdown export. 
2.	Every snip automatically lands in their notes with metadata.
3.	Weekly: user searches notes system; opens original audio from links.
________________________________________
8) Requirements prioritization (MVP → V1)
MVP (must ship)
•	Playback + subscribe + search + queue/downloads + offline 
•	Transcripts + transcript search 
•	Create snips (in-app + headphones) + snip customization basics 
•	Chapters + episode summaries 
•	Chat with episodes + chat shortcuts 
•	Daily Recap 
•	Notion + Readwise integrations 
V1
•	YouTube import + audio uploads 
•	Guests + mentioned books 
•	Video snips discovery 
•	Obsidian + Glasp sync experiences 
________________________________________
9) Risks & mitigations
1.	Transcript mismatch due to dynamic ads → implement alignment strategy + user reporting + graceful degradation. 
2.	User trust (notes accuracy) → always allow “tap to verify” by jumping to the audio timestamp (chat + snips). 
3.	Hands-free safety → driving mode defaults to minimal interaction; review/edit later. 
________________________________________
10) Open questions (to resolve during discovery)
•	Should PodScribe generate a personalized “summary email” after listening sessions? (Snipd advertises this behavior; it can improve recall.) 
•	How aggressive should auto-snipping be (always-on vs opt-in per episode/show)? 
•	Should “Video snips” be curated (editorial) or algorithmic, and which shows qualify? 
•	Default privacy stance for exports/sharing (especially integrations like highlight platforms).

let's keep option 1. Update the blue print to reflect that

## Server Functions (32)

### backfillEmptySnips

**Description:** Backfill snips that were created before transcript was available

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "episodeId"
  ],
  "properties": {
    "episodeId": {
      "type": "number",
      "description": "ID of the episode"
    }
  }
}
```

### chatWithEpisode

**Description:** Ask a question about a podcast episode

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "episodeId",
    "question"
  ],
  "properties": {
    "question": {
      "type": "string",
      "minLength": 1,
      "description": "Question to ask about the episode"
    },
    "episodeId": {
      "type": "number",
      "description": "ID of the episode"
    }
  }
}
```

### createSnip

**Description:** Create a snip (saved moment) for an episode

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "episodeId",
    "timestamp"
  ],
  "properties": {
    "speaker": {
      "type": "string",
      "description": "Speaker name"
    },
    "episodeId": {
      "type": "number",
      "description": "ID of the episode"
    },
    "timestamp": {
      "type": "number",
      "description": "Timestamp in seconds"
    },
    "transcriptExcerpt": {
      "type": "string",
      "description": "Transcript text at this moment"
    }
  }
}
```

### deleteSnip

**Description:** Delete a snip

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "snipId"
  ],
  "properties": {
    "snipId": {
      "type": "number",
      "description": "ID of the snip to delete"
    }
  }
}
```

### exportToMarkdown

**Description:** Export episode data as Markdown text

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "episodeId"
  ],
  "properties": {
    "episodeId": {
      "type": "number",
      "description": "ID of the episode to export"
    }
  }
}
```

### exportToNotion

**Description:** Export episode data (snips, transcript, summary) to Notion

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "episodeId"
  ],
  "properties": {
    "episodeId": {
      "type": "number",
      "description": "ID of the episode to export"
    }
  }
}
```

### getChatHistory

**Description:** Get chat history for an episode

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "episodeId"
  ],
  "properties": {
    "episodeId": {
      "type": "number",
      "description": "ID of the episode"
    }
  }
}
```

### getCurrentlyPlaying

**Description:** Get the most recently played episode with its progress

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getDailyRecap

**Description:** Get snips due for review today

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getEpisodeById

**Description:** Get a single episode by ID with all related data

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "episodeId"
  ],
  "properties": {
    "episodeId": {
      "type": "number",
      "description": "ID of the episode"
    }
  }
}
```

### getEpisodes

**Description:** Get episodes for a podcast

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "podcastId"
  ],
  "properties": {
    "limit": {
      "type": "number",
      "description": "Max episodes to return"
    },
    "offset": {
      "type": "number",
      "description": "Offset for pagination"
    },
    "podcastId": {
      "type": "number",
      "description": "ID of the podcast"
    }
  }
}
```

### getPopularPodcasts

**Description:** Get a curated list of popular podcasts with artwork from iTunes

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "genre": {
      "type": "string",
      "description": "Filter by genre name like Technology, Business, Science, etc."
    }
  }
}
```

### getProcessingStatus

**Description:** Get the processing status for an episode

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "episodeId"
  ],
  "properties": {
    "episodeId": {
      "type": "number",
      "description": "ID of the episode"
    }
  }
}
```

### getRecentEpisodeCounts

**Description:** Get count of episodes published in last 7 days per podcast

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getSnips

**Description:** Get snips for an episode or all snips

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "episodeId": {
      "type": "number",
      "description": "Filter by episode ID"
    }
  }
}
```

### getSubscriptions

**Description:** Get all subscribed podcasts

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getTranscript

**Description:** Get the transcript for an episode

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "episodeId"
  ],
  "properties": {
    "episodeId": {
      "type": "number",
      "description": "ID of the episode"
    }
  }
}
```

### main

**Description:** Periodic background task: refreshes all subscribed podcast feeds and notifies about new episodes

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### previewPodcast

**Description:** Fetch a podcast RSS feed and return podcast info plus recent episodes without subscribing. Used for previewing a podcast before subscribing.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "feedUrl"
  ],
  "properties": {
    "feedUrl": {
      "type": "string",
      "minLength": 1,
      "description": "RSS feed URL of the podcast"
    }
  }
}
```

### processEpisode

**Description:** Transcribe and analyze a podcast episode (generates transcript, chapters, and summary)

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "episodeId"
  ],
  "properties": {
    "episodeId": {
      "type": "number",
      "description": "ID of the episode to process"
    }
  }
}
```

### refreshPodcastFeed

**Description:** Refresh episodes from a podcast's RSS feed

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "podcastId"
  ],
  "properties": {
    "podcastId": {
      "type": "number",
      "description": "ID of the podcast to refresh"
    }
  }
}
```

### researchSnip

**Description:** Research the topic from a snip using web search and AI analysis. Creates a Sidekick task that searches the web and posts a research brief to the feed.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "snipId"
  ],
  "properties": {
    "snipId": {
      "type": "number",
      "description": "ID of the snip to research"
    }
  }
}
```

### reviewSnip

**Description:** Mark a snip as reviewed with spaced repetition scheduling

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "snipId",
    "remembered"
  ],
  "properties": {
    "snipId": {
      "type": "number",
      "description": "ID of the snip"
    },
    "remembered": {
      "type": "boolean",
      "description": "Whether the user remembered this snip"
    }
  }
}
```

### saveListeningProgress

**Description:** Save playback position for an episode

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "episodeId",
    "position"
  ],
  "properties": {
    "position": {
      "type": "number",
      "description": "Playback position in seconds"
    },
    "completed": {
      "type": "boolean"
    },
    "episodeId": {
      "type": "number",
      "description": "ID of the episode"
    }
  }
}
```

### savePreviewEpisode

**Description:** Save a podcast (unsubscribed) and a single episode to the database so the user can access full episode features without subscribing

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "feedUrl",
    "podcastTitle",
    "podcastAuthor",
    "podcastImageUrl",
    "podcastDescription",
    "episodeTitle",
    "episodeAudioUrl"
  ],
  "properties": {
    "feedUrl": {
      "type": "string",
      "minLength": 1
    },
    "episodeTitle": {
      "type": "string"
    },
    "podcastTitle": {
      "type": "string"
    },
    "podcastAuthor": {
      "type": "string"
    },
    "episodeAudioUrl": {
      "type": "string"
    },
    "episodeDuration": {
      "type": "string"
    },
    "episodeImageUrl": {
      "type": "string"
    },
    "podcastImageUrl": {
      "type": "string"
    },
    "episodeDescription": {
      "type": "string"
    },
    "episodePublishedAt": {
      "type": "string"
    },
    "podcastDescription": {
      "type": "string"
    }
  }
}
```

### searchAllTranscripts

**Description:** Search across all episode transcripts for a query. Returns matching segments grouped by episode with timestamps, speaker names, and surrounding context.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "query"
  ],
  "properties": {
    "query": {
      "type": "string",
      "minLength": 1,
      "description": "Search text to find across all transcripts"
    }
  }
}
```

### searchPodcasts

**Description:** Search for podcasts by name or topic using iTunes catalog

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "query"
  ],
  "properties": {
    "query": {
      "type": "string",
      "minLength": 1,
      "description": "Search query for finding podcasts"
    }
  }
}
```

### searchTranscript

**Description:** Search within an episode transcript

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "episodeId",
    "query"
  ],
  "properties": {
    "query": {
      "type": "string",
      "minLength": 1,
      "description": "Search text"
    },
    "episodeId": {
      "type": "number",
      "description": "ID of the episode"
    }
  }
}
```

### subscribePodcast

**Description:** Subscribe to a podcast by its RSS feed URL

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "feedUrl"
  ],
  "properties": {
    "feedUrl": {
      "type": "string",
      "minLength": 1,
      "description": "RSS feed URL of the podcast"
    }
  }
}
```

### unsubscribePodcast

**Description:** Unsubscribe from a podcast

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "podcastId"
  ],
  "properties": {
    "podcastId": {
      "type": "number",
      "description": "ID of the podcast"
    }
  }
}
```

### updateSnip

**Description:** Update a snip's properties

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "snipId"
  ],
  "properties": {
    "tags": {
      "type": "string"
    },
    "title": {
      "type": "string"
    },
    "snipId": {
      "type": "number",
      "description": "ID of the snip"
    },
    "starred": {
      "type": "boolean"
    }
  }
}
```

### weeklyDigest

**Description:** Generate and post a weekly learning digest summarizing podcast listening, snips, and review activity

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

