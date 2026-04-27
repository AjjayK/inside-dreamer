# Agent: Artwork of the Day

**ID:** c6e466d1-c72b-486d-ae19-7dbb9933e727

## Description

# OVERVIEW
A daily Renaissance-themed art curator that surfaces one famous artwork from museums worldwide each day. Tap to expand and explore detailed information about the piece, artist, movement, and related works.

# KEY FEATURES
- **Daily Masterpiece**, Displays a curated famous artwork every day from museum APIs like the Art Institute of Chicago, Rijksmuseum, and Metropolitan Museum of Art
- **Detailed Exploration**, Tap to see high-resolution image, artwork title, artist name, creation date, art movement, and rich descriptive text
- **Artist Context**, Browse the painter's biography and discover their other famous works with links to museum collections
- **Renaissance Aesthetic**, Beautifully designed with period-appropriate typography, ornamental frames, and classical art-inspired UI elements
- **Global Collection**, Rotates through celebrated works from major museums worldwide to provide diverse and culturally rich daily selections

# VERBATIM INSTRUCTIONS
The Art Institute of Chicago and a bunch of other large museums and art galleries around the world maintain free APIs for their large collection of artworks. I want to create an "Artwork of the Day" app where users will see one of the more famous artworks from around the world every day, a new one. Clicking on that image would expand it and show them the detailed image, plus all the other information around it:
- which art movement it is from
- when it was painted
- who was the artist
- what are their other famous works
- a brief description of the artwork if possible
- as well as the painter
Can you make this happen? Again we're going for an art-based theme so make it very Renaissance-themed

## Server Functions (5)

### curateArtwork

**Description:** Curates a new artwork of the day by creating a sidekick task to research famous artworks

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getArtworkDetails

**Description:** Gets detailed information about a specific artwork

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
      "description": "The artwork ID"
    }
  }
}
```

### getTodaysArtwork

**Description:** Gets today's artwork or the most recent one available

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### main

**Description:** Checks if today's artwork exists and triggers curation if needed

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### storeArtwork

**Description:** Stores a curated artwork in the database. Called by the sidekick task upon completion.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "title",
    "artistName",
    "creationDate",
    "artMovement",
    "description",
    "artistBio",
    "otherFamousWorks",
    "imageUrl",
    "museumName"
  ],
  "properties": {
    "title": {
      "type": "string",
      "minLength": 1,
      "description": "The title of the artwork"
    },
    "medium": {
      "type": "string",
      "description": "The medium used, e.g. 'Oil on canvas'"
    },
    "imageUrl": {
      "type": "string",
      "minLength": 1,
      "description": "Direct URL to an image of the artwork, preferably from Wikimedia Commons"
    },
    "artistBio": {
      "type": "string",
      "minLength": 1,
      "description": "A 2-3 sentence biography of the artist"
    },
    "artistName": {
      "type": "string",
      "minLength": 1,
      "description": "The full name of the artist"
    },
    "museumName": {
      "type": "string",
      "minLength": 1,
      "description": "Name of the museum housing the artwork"
    },
    "artMovement": {
      "type": "string",
      "minLength": 1,
      "description": "The art movement, e.g. 'Post-Impressionism'"
    },
    "description": {
      "type": "string",
      "minLength": 1,
      "description": "A 2-4 sentence description of the artwork"
    },
    "creationDate": {
      "type": "string",
      "minLength": 1,
      "description": "When the artwork was created, e.g. '1889' or 'c. 1503-1519'"
    },
    "museumLocation": {
      "type": "string",
      "description": "City and country of the museum, e.g. 'New York, USA'"
    },
    "otherFamousWorks": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "title",
          "year"
        ],
        "properties": {
          "year": {
            "type": "string",
            "description": "Year or date range of creation"
          },
          "title": {
            "type": "string",
            "description": "Title of the work"
          }
        }
      },
      "description": "3-5 other famous works by the same artist"
    }
  }
}
```

