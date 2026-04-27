# Agent: Where's my Stuff

**ID:** dd692b80-7951-4154-8e81-2e6ec46bbfcb

## Description

# OVERVIEW
A personal memory agent that helps you remember where you stored your belongings. Capture the moment you put something away—voice note, photo, or both—and the agent builds a searchable library of your objects and their locations. Light on friction, powered by LLM understanding.

# KEY FEATURES
- **Voice + Image Capture**, record what you're storing and snap a photo of the location. Either works alone; both make memories richer. LLM transcribes, extracts object names, locations, and attributes automatically.
- **Share to App**, snap a photo in your camera app and share it directly to Where's my Stuff. The agent processes the image (with optional voice note) and creates a memory on the spot.
- **Searchable Memory**, find items by keyword or ask natural language questions like 'Where are my winter gloves?' Full-text search across object names, locations, and descriptions.
- **Micro-Task Friendly**, no need to complete everything at once. Record voice now, add a photo later, review tags when you have time. Each step is independent and fast.
- **Persistent Personal Library**, all your stored memories remain in your searchable collection. Edit, delete, or enrich entries anytime as your life changes.

# VERBATIM INSTRUCTIONS
1. Overview
Where’s my Stuff is a dreamer agent that helps users remember where they stored their belongings. It combines voice recording, image capture, and LLM-powered understanding to create a searchable personal memory of objects and their locations.
The agent is designed around a simple insight: people constantly forget where they put things. Where’s my Stuff turns the act of storing something into a quick, narrated moment that the agent remembers for you.
2. Problem Statement
People frequently misplace or forget where they stored household items, documents, seasonal belongings, and other personal objects. Existing solutions like note-taking apps or spreadsheets require deliberate, structured data entry that most people abandon quickly. There is no lightweight tool that lets you simply speak or snap a photo while you are in the moment of putting something away.
3. Product Vision
Where’s my Stuff aims to be the fastest, most natural way to log where you put something. The interaction should feel as simple as telling a friend, "Hey, I just put my passport in the top drawer of the bedroom closet." The app captures that intent through voice and image, uses an LLM to understand and parse the information, and builds a persistent, searchable memory over time.

3.1 Design Principles
•	Capture-first, organize-later: Users should never feel like they have to complete every step in a single session. Recording a voice note or capturing a picture or both is enough. They can add, tags, and refinements whenever they have time.
•	Micro-task friendly: Tagging, editing, and enriching memories are designed as small, bite-sized tasks the user can knock out in spare moments.
•	Privacy by default: All AI processing and data storage happens locally on the device. No personal content is sent to the cloud.
•	LLM as a living layer: The LLM continuously refines and updates memory throughout the lifecycle of an entry, from initial capture to later edits and additions.
4. Target Users
The primary audience includes anyone who stores physical belongings across multiple locations and struggles to recall where things are. Key personas include:
•	The Organizer: Someone who tidies regularly but forgets which drawer or box they sorted things into. Needs a quick capture tool during cleanup sessions.
•	The Seasonal Storer: Puts away holiday decorations, winter clothes, or travel gear for months and cannot recall exact locations when the season returns.
•	The Document Keeper: Stores important paperwork (passports, warranties, insurance documents) in specific places but cannot remember which folder or safe they used.
•	The Shared Household Member: Lives with family or roommates and needs to remember communal storage decisions ("We moved the extra towels to the hallway closet").
5. Core Functionality
5.1 Capture Workflow
The capture experience is the heart of the app. It is designed to be fast and forgiving. Users do not need to complete all steps in one session. They can record a voice note now or add a photo, and tag items whenever they get time. Each of these is a small, independent task.

Entry Points
Users can initiate a memory capture in two ways:
•	In-App Capture: Open the app, go to the Capture tab, and start recording/capture. This is the primary flow for deliberate storage sessions.
•	Share-to-App (Image): While browsing photos or using the camera, the user can share an image directly to Where’s my Stuff. The app receives the image, the user can optionally record a voice note describing it, and the LLM processes the information to create or update a memory entry.

Step-by-Step Capture Flow
The capture workflow consists of several stages, but the key principle is that none of them are mandatory in a single session:

Step	Action	Description	Required?
1	Voice Recording	User speaks naturally about what they are storing and where. Audio is captured with real-time visualization.	Starting point
2	Image Capture	User takes a photo of the storage location. Can also be shared to the app externally at any time.	Starting point if user prefers image; 
3	LLM Processing	The LLM transcribes the voice note and analyzes text (and image, if available) to extract object names, locations, attributes, and context.	Automatic
4	Review & Tagging	User reviews extracted tags on the image, repositions them, edits names, or adds new tags manually. This is a micro-task that can be done later.	Optional, can do later
5	Save	Memory entry is saved to the local database and becomes searchable.	Yes

Important: The user does not have to complete voice + image + tagging + save in a single continuous session. They might record a voice note quickly while putting something away, then come back hours later to attach a photo and review tags. These are designed as tiny, completable tasks.
5.2 LLM Role Throughout the Lifecycle
The LLM is not a one-shot tool that runs only during initial capture. It plays an active role at multiple points in the memory lifecycle:

Stage	LLM Behavior
Voice Capture	Transcribes voice to text. Extracts object names, locations, attributes, and parent locations from the transcript. If an image is present, performs multimodal analysis to enrich and validate extractions.
Image Capture	When the user attaches an image to an existing voice-only entry, the LLM re-analyzes the combined text + image to update and refine the memory with any new context from the photo. If no voice, it uses only image to get context
Tag Editing	When the user edits, adds, or removes tags, the LLM can update the memory accordingly, reconciling user corrections with its prior understanding.
Search & Retrieval	Interprets natural language search queries. Generates conversational responses that help the user locate their belongings, drawing from stored memories.
Share-to-App	When an image is shared into the app from an external source, the LLM processes it to identify objects and infer storage context, creating or updating memory entries accordingly.

This lifecycle approach means the memory improves over time. An entry that starts as a rough voice note gets progressively richer as the user adds images, reviews tags, and the LLM reconciles new information.
5.3 Search & Retrieval
The search experience is designed to feel conversational and instant:
•	Full-text search: Users can search by object name, location, description, or any attribute. Results surface matching memory entries with relevant details.
•	Natural language queries: Users can ask questions like "Where are my winter gloves?" or "What did I put in the garage last month?" The LLM generates a natural language response based on stored memories.
•	Browse all items: An items list view lets users scroll through all stored memories, sorted by recency. Each entry shows the object, location, and thumbnail image if available.
5.4 Item Management
Users have full control over their stored memories:
•	View all stored items in a scrollable list
•	Delete individual items when no longer needed
•	Manually add items using a quick-entry form (for users who prefer typing over speaking)
•	Edit existing entries to correct or update information
6. Share-to-App Flow
In addition to in-app capture, Where’s my Stuff supports receiving images shared from other apps (gallery, camera, file managers). This enables a natural workflow where:
1.	The user takes a photo of a storage location using their phone's camera or finds an existing photo in their gallery.
2.	They use the system Share menu to send the image to Where’s my Stuff.
3.	Where’s my Stuff opens with the shared image pre-loaded. The user can optionally record a voice note to describe what they stored.
4.	The LLM processes the image (and voice, if provided) to extract memory information.
5.	The entry is added to the user's memory and becomes searchable.

This flow is especially useful when the user is in the middle of another task and wants to quickly log a storage location without switching fully into the app.
7. Micro-Task Philosophy
A core product principle of Where’s my Stuff is that memory capture is not an all-or-nothing event. The workflow is deliberately broken into small, independent tasks:

Micro-Task	When It Happens	Time Required
Record a voice note	In the moment, while putting something away	5–15 seconds
Snap a photo	Right after, or later when you have a moment	5 seconds
Share an image	Anytime, from gallery or camera	3 seconds
Review & edit tags	Later, when browsing or during idle moments	10–30 seconds per entry
Add manual details	When you want to enrich an entry	15–60 seconds

This design respects the user's time and context. Someone in the middle of organizing a closet should not need to stop and carefully label everything. They speak, maybe snap a photo, and move on. The refinement happens when they have a quiet moment.
8. Memory Data Model
Each memory entry stored by the app captures the following information:

Field	Description	Source
Object Name	The item being stored (e.g., "passport", "winter jacket")	LLM extraction or manual entry
Location	Where the item is stored (e.g., "bedroom closet, top shelf")	LLM extraction or manual entry
Description	Additional context or notes about the item	LLM extraction or manual entry
Object Attribute	Visual or physical characteristics (e.g., "red", "leather")	LLM extraction
Parent Location	Broader location context (e.g., "home", "office", "garage")	LLM extraction
Image	Photo of the storage location, optionally with positioned tags	Camera capture or shared image
Timestamp	When the memory was created	Automatic
Source Type	How the entry was created (voice, image, or manual)	Automatic

All data is stored locally on the user's device. Full-text search indexing ensures fast retrieval across all fields.
9. Key Screens & Navigation
The app is organized around four primary tabs:

Screen	Purpose
Capture	The primary input screen. Guides the user through voice recording, image capture, LLM processing, and tag review. Also the entry point for images shared from external apps.
Find	Search interface for locating stored items. Supports both keyword search and natural language queries with LLM-generated responses.
Items	Browsable list of all stored memories. Allows viewing, editing, and deleting entries. Also supports manual item creation.
Settings	App configuration including model management and preferences.
10. Future Considerations
The following features are under consideration for future versions but are not part of the current scope:
•	Shared household mode where multiple family members contribute to and search a shared memory.
•	Smart reminders that proactively surface items (e.g., "You stored your ski gear in the basement last March. Winter is approaching.").
11. Success Metrics (future optimization)
The following indicators will measure whether the product is achieving its goals:
•	Capture completion rate: Percentage of started capture sessions that result in a saved memory. Target: >70% for voice-only entries.
•	Micro-task engagement: Frequency with which users return to review tags, add images, or refine entries after initial capture.
•	Search success rate: Percentage of search queries that result in the user finding the item they were looking for.
•	LLM extraction accuracy: How often the LLM correctly identifies object names, locations, and attributes without user correction.
•	Retention: 7-day and 30-day retention rates, indicating whether users find ongoing value in the app.



## Server Functions (11)

### addImageToMemory

**Description:** Add an image to an existing memory and re-analyze with LLM

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "memoryId",
    "imageBase64"
  ],
  "properties": {
    "memoryId": {
      "type": "number",
      "description": "The memory ID to add image to"
    },
    "imageBase64": {
      "type": "string",
      "description": "Base64-encoded image data"
    },
    "imageMimeType": {
      "type": "string",
      "description": "MIME type of image"
    }
  }
}
```

### addManualItem

**Description:** Manually add a memory item without voice or image processing

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "objectName",
    "location"
  ],
  "properties": {
    "location": {
      "type": "string",
      "minLength": 1,
      "description": "Where the item is stored"
    },
    "objectName": {
      "type": "string",
      "minLength": 1,
      "description": "Name of the item"
    },
    "description": {
      "type": "string",
      "description": "Additional notes"
    },
    "parentLocation": {
      "type": "string",
      "description": "Broader location area"
    },
    "objectAttribute": {
      "type": "string",
      "description": "Physical characteristics"
    }
  }
}
```

### deleteMemory

**Description:** Delete a memory by ID

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "id"
  ],
  "properties": {
    "id": {
      "type": "number",
      "description": "The memory ID to delete"
    }
  }
}
```

### getMemories

**Description:** Get all memories for the current user, sorted by most recent first

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getMemory

**Description:** Get a single memory by ID

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "id"
  ],
  "properties": {
    "id": {
      "type": "number",
      "description": "The memory ID"
    }
  }
}
```

### handleSharedImage

**Description:** Process images shared to the app from external sources

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

### main

**Description:** Periodic background task

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### nlSearch

**Description:** Natural language search - ask a question like 'Where are my winter gloves?' and get a conversational answer

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
      "description": "Natural language question about where something is stored"
    }
  }
}
```

### processCapture

**Description:** Process a capture: upload media, transcribe audio, analyze image, extract memory, save to database

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "audioBase64": {
      "type": "string",
      "description": "Base64-encoded audio data"
    },
    "imageBase64": {
      "type": "string",
      "description": "Base64-encoded image data"
    },
    "audioMimeType": {
      "type": "string",
      "description": "MIME type of audio, e.g. audio/webm"
    },
    "imageMimeType": {
      "type": "string",
      "description": "MIME type of image, e.g. image/jpeg"
    }
  }
}
```

### searchMemories

**Description:** Search memories by keyword across all text fields

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
      "description": "Search keyword"
    }
  }
}
```

### updateMemory

**Description:** Update fields on an existing memory

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "id"
  ],
  "properties": {
    "id": {
      "type": "number",
      "description": "The memory ID to update"
    },
    "location": {
      "type": "string",
      "description": "Updated location"
    },
    "objectName": {
      "type": "string",
      "description": "Updated item name"
    },
    "description": {
      "type": "string",
      "description": "Updated description"
    },
    "parentLocation": {
      "type": "string",
      "description": "Updated parent location"
    },
    "objectAttribute": {
      "type": "string",
      "description": "Updated attributes"
    }
  }
}
```

