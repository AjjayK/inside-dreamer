# Agent: Absolute Cinema

**ID:** f5a02cdf-1093-4636-b3e8-9574915b88dc

## Description

# Absolute Cinema - Product Requirements Document

## Overview

Absolute Cinema is a personal movie watchlist curator that helps users track films they want to watch, rate movies they've seen, and discover personalized recommendations. The app features a cinema-themed aesthetic with gold and dark blue colors, evoking a classic movie theater experience.

## Core Features

### 1. Movie Watchlist Management

**Adding Movies**
- Search for movies by title using The Movie Database (TMDb) API
- Search results display poster, title, year, rating, genres, and overview
- Add movies to watchlist with a single click
- Movies are automatically enriched with director, writer, and cast information (fetched from Wikipedia/IMDB)
- Track where each movie was added from (search, curator recommendation, popular picks, or shared link)

**Viewing the Watchlist**
- Two main views:
  - **Coming Attractions**: Unwatched movies in the queue
  - **The Vault**: Movies that have been watched
- Filter movies by genre using pill buttons
- Search movies by title, director, or cast
- Sort by date added/watched, rating, or title
- Movie cards show poster, title, year, and rating

**Movie Details**
- Click any movie to view full details in a modal
- Shows poster, backdrop image, title, year, TMDb rating, genres
- Displays director, writer, and top 5 cast members
- Shows full overview/synopsis
- Indicates how the movie was added (search, curator, popular, link)

**Marking Movies as Watched**
- Mark any unwatched movie as watched
- Optionally provide a personal rating (1-10 scale)
- Watch date is automatically recorded

**Removing Movies**
- Remove any movie from the watchlist via the detail modal

### 2. Daily Pick ("Now Showing")

**Selection Algorithm**
- Each day, the app selects one unwatched movie as the featured pick
- Selection considers:
  - User's genre preferences (based on highly-rated watched movies)
  - How long the movie has been in the queue (older movies get a boost)
  - Recency penalty for recently featured movies (avoids repetition)
  - Random factor for variety

**Display**
- Featured prominently at the top of the main view
- Shows in the widget view as the primary content
- Daily cron trigger at 6 PM generates the pick and sends a notification

### 3. Curator's Picks (Recommendations)

**Two Types of Recommendations**

1. **Curated For You** (Sidekick-powered)
   - AI analyzes user's watched and rated movies
   - Considers loved movies (rated 7+), disliked movies (rated 4-), and recent viewing patterns
   - Searches for movies from multiple sources: theaters, new releases, critically acclaimed films, hidden gems
   - Each recommendation includes a personalized reason explaining why it fits the user's taste
   - Avoids repeating previous recommendations

2. **Popular Now**
   - Fetches currently popular movies from TMDb
   - LLM selects 5 movies that best match the user's taste profile
   - Falls back to top 5 popular if user has no taste profile yet

**Refresh Behavior**
- Weekly automatic refresh on Fridays at 10 AM
- Manual refresh available via button in the UI
- Shows loading state during generation (can take a few minutes for Sidekick analysis)
- Movies already in watchlist are automatically filtered out

**Adding Curator Picks**
- Click any curator pick to view details with personalized recommendation reason
- Add to watchlist with one click
- Movie is removed from curator picks when added

### 4. Link/Share Integration

**Input Trigger**
- Accepts shared links (IMDB, TMDb, or any movie-related URL)
- Also accepts plain text movie titles

**Processing**
- Crawls the shared URL to extract movie title
- Searches TMDb to find the movie
- Adds to watchlist automatically
- Sends notification confirming the addition
- Handles duplicates gracefully (notifies if already in watchlist)

## User Interface

### Full App View

**Header**
- App logo and name ("Absolute Cinema")
- Stats showing count of movies to watch and watched
- "Add Movie" button to open search modal

**Main Content**
- Now Showing section with daily pick
- Tab navigation: Coming Attractions | The Vault | Curator's Picks
- Filter bar with genre pills and search
- Sort dropdown (Date, Rating, Title)
- Grid of movie cards (responsive: 3-6 columns based on screen size)

**Modals**
- Search modal for finding and adding movies
- Movie detail modal with full info and actions
- Watched modal for marking movies as watched with rating
- Curator pick modal with recommendation reason

### Widget View

- Compact view for dashboard display
- Shows daily pick poster as full background
- Overlay with "Now Showing" label, title, year, rating
- Footer with to-watch and watched counts
- Graceful empty state when no movies in watchlist

### Visual Design

- Dark theme with navy blue background (#0A0E27)
- Gold accent color (#E5B80B) for highlights and interactive elements
- Cinema-inspired typography:
  - Display font: Bebas Neue (headings)
  - Body font: Lato (text)
- Movie posters with hover effects (border glow, slight lift)
- Smooth transitions and loading states

## Data Model

### Movies Table
- TMDb ID (unique identifier)
- Title, year, genres, overview
- Poster and backdrop URLs
- TMDb rating and vote count
- Director, writer, cast (comma-separated)
- Date added, watch date, personal rating
- Daily pick date (for rotation algorithm)
- Source (search, curator, popular, link)

### Curator Picks Table
- Same movie metadata as movies table
- Recommendation reason
- Source (sidekick or popular)
- Generated timestamp

### Settings Table
- Key-value store for user preferences

## Triggers

1. **Tonight's Feature Pick** (Cron: daily at 6 PM)
   - Generates daily movie pick
   - Sends notification with movie details

2. **Weekly Curator's Picks** (Cron: Fridays at 10 AM)
   - Refreshes curator recommendations
   - Runs Sidekick analysis for personalized picks
   - Fetches fresh popular movies

3. **Add Movie to Watchlist** (Input trigger)
   - Accepts: text/uri-list, text/plain
   - Processes shared links and movie titles

## External Integrations

- **TMDb API**: Movie search, popular movies, metadata
- **Web Crawl**: Extracting movie info from URLs, fetching credits from Wikipedia/IMDB
- **Sidekick Tasks**: AI-powered taste analysis and recommendation generation
- **Agent Posts**: Notifications for daily picks and link processing

## Exported Functions

The following functions are available for external integration:

- `searchMoviesForWatchlist`: Search TMDb for movies
- `addMovieToWatchlist`: Add a movie with full metadata
- `getWatchlist`: Retrieve watchlist with filtering/sorting
- `markAsWatched`: Mark movie as watched with optional rating
- `getDailyPick`: Get today's featured movie
- `getRecommendations`: Get personalized recommendations
- `receiveCuratorPicks`: Callback for Sidekick to submit curated picks
- `weeklyCuratorPicks`: Trigger weekly recommendation refresh
- `processMovieLink`: Process shared movie links
- `main`: Daily pick generation entry point

## Empty States

- **First-time users**: Onboarding view explaining features with CTA to add first movie
- **Empty watchlist tab**: Cinema-themed message encouraging adding films
- **No search results**: Friendly message suggesting different search terms
- **No curator picks**: Message about watching/rating movies to get recommendations


## Server Functions (45)

### addCuratorPickToWatchlist

**Description:** Add a curator pick to the watchlist

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "pickId"
  ],
  "properties": {
    "pickId": {
      "type": "number",
      "description": "Curator pick ID"
    }
  }
}
```

### addMovieToWatchlist

**Description:** Add a movie to the watchlist from search results

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "tmdbId",
    "title"
  ],
  "properties": {
    "year": {
      "type": "number",
      "description": "Release year"
    },
    "title": {
      "type": "string",
      "description": "Movie title"
    },
    "genres": {
      "type": "string",
      "description": "Comma-separated genres"
    },
    "source": {
      "type": "string",
      "description": "Where the movie was added from: search, curator, popular, link"
    },
    "tmdbId": {
      "type": "number",
      "description": "TMDb movie ID"
    },
    "overview": {
      "type": "string",
      "description": "Movie overview"
    },
    "posterUrl": {
      "type": "string",
      "description": "Poster image URL"
    },
    "tmdbRating": {
      "type": "number",
      "description": "TMDb rating"
    },
    "backdropUrl": {
      "type": "string",
      "description": "Backdrop image URL"
    },
    "tmdbVoteCount": {
      "type": "number",
      "description": "TMDb vote count"
    }
  }
}
```

### batchFetchStreamingInfo

**Description:** Fetch streaming info for up to N movies that are missing it

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "limit": {
      "type": "number",
      "default": 5,
      "description": "Max movies to process"
    }
  }
}
```

### checkMovieStatus

**Description:** Check if a movie is already in the user's watchlist, has been watched, or was recently recommended. Use this to verify each movie before recommending it.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "title"
  ],
  "properties": {
    "year": {
      "type": "number",
      "description": "The release year (recommended for accuracy)"
    },
    "title": {
      "type": "string",
      "description": "The movie title to check"
    }
  }
}
```

### clearTaskProgress

**Description:** Clear the progress for a task (called when task completes)

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "taskKey"
  ],
  "properties": {
    "taskKey": {
      "type": "string",
      "description": "The task key to clear progress for"
    }
  }
}
```

### dismissCuratorPick

**Description:** Dismiss a curator pick (remove it from recommendations without adding to watchlist)

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "pickId"
  ],
  "properties": {
    "pickId": {
      "type": "number",
      "description": "Curator pick ID to dismiss"
    }
  }
}
```

### fetchMovieStreamingInfo

**Description:** Fetch streaming provider info for a movie that doesn't have it yet

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "movieId"
  ],
  "properties": {
    "movieId": {
      "type": "number",
      "description": "Movie ID in the database"
    }
  }
}
```

### getCuratorPicks

**Description:** Get stored curator picks (pre-generated recommendations with credits)

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getDailyPick

**Description:** Get today's movie pick from unwatched movies

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getDismissedPicks

**Description:** Get all movies the user has previously dismissed from recommendations

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getMovie

**Description:** Get a single movie by ID

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "movieId"
  ],
  "properties": {
    "movieId": {
      "type": "number",
      "description": "Movie database ID"
    }
  }
}
```

### getPackStatus

**Description:** Get whether the current batch of curator picks has been opened (pack opening experience)

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getRecommendations

**Description:** Get personalized movie recommendations from collection and popular movies

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "discoverNew": {
      "type": "boolean",
      "description": "Include new movie suggestions"
    },
    "fromCollection": {
      "type": "boolean",
      "description": "Include recommendations from existing collection"
    }
  }
}
```

### getSettings

**Description:** Get user settings for the app

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getStats

**Description:** Get watchlist statistics

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getTaskProgress

**Description:** Get the current progress of a background task, with timeout handling

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "taskKey"
  ],
  "properties": {
    "taskKey": {
      "type": "string",
      "description": "The task key to get progress for (e.g., 'curator-refresh')"
    }
  }
}
```

### getTasteProfile

**Description:** Get the user's cinema taste profile

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getWatchlist

**Description:** Get all movies in the watchlist with optional filtering and sorting

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "genre": {
      "type": "string",
      "description": "Filter by genre name"
    },
    "filter": {
      "anyOf": [
        {
          "type": "string",
          "const": "all"
        },
        {
          "type": "string",
          "const": "unwatched"
        },
        {
          "type": "string",
          "const": "watched"
        }
      ]
    },
    "sortBy": {
      "anyOf": [
        {
          "type": "string",
          "const": "dateAdded"
        },
        {
          "type": "string",
          "const": "title"
        },
        {
          "type": "string",
          "const": "year"
        },
        {
          "type": "string",
          "const": "tmdbRating"
        },
        {
          "type": "string",
          "const": "personalRating"
        },
        {
          "type": "string",
          "const": "watchDate"
        }
      ]
    },
    "sortOrder": {
      "anyOf": [
        {
          "type": "string",
          "const": "asc"
        },
        {
          "type": "string",
          "const": "desc"
        }
      ]
    }
  }
}
```

### initSession

**Description:** Initialize the user session — runs the owner migration and ensures triggers are set up

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### main

**Description:** Daily cron job to generate the day's movie pick and optionally notify the user

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### markAsWatched

**Description:** Mark a movie as watched with optional personal rating

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "movieId"
  ],
  "properties": {
    "rating": {
      "type": "number",
      "maximum": 10,
      "minimum": 1,
      "description": "Personal rating 1-10"
    },
    "movieId": {
      "type": "number",
      "description": "Movie database ID"
    },
    "watchDate": {
      "type": "string",
      "description": "Watch date in ISO format, defaults to today"
    }
  }
}
```

### markCuratorPickAsWatched

**Description:** Add a curator pick to the watchlist and immediately mark it as already watched

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "pickId"
  ],
  "properties": {
    "pickId": {
      "type": "number",
      "description": "Curator pick ID"
    },
    "rating": {
      "type": "number",
      "maximum": 10,
      "minimum": 1,
      "description": "Personal rating 1-10"
    }
  }
}
```

### markPackOpened

**Description:** Mark the current batch of curator picks as opened

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### onCuratorProgress

**Description:** Callback for Sidekick task progress updates during curator picks generation

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "status",
    "imperativeStatus"
  ],
  "properties": {
    "status": {
      "type": "string",
      "minLength": 1,
      "description": "Current status in active form (e.g., 'Searching for movies')"
    },
    "imperativeStatus": {
      "type": "string",
      "minLength": 1,
      "description": "Current status in imperative form (e.g., 'Search for movies')"
    }
  }
}
```

### onTasteProfileProgress

**Description:** Callback for Sidekick task progress updates during taste profile generation

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "status",
    "imperativeStatus"
  ],
  "properties": {
    "status": {
      "type": "string",
      "minLength": 1,
      "description": "Current status"
    },
    "imperativeStatus": {
      "type": "string",
      "minLength": 1,
      "description": "Imperative form status"
    }
  }
}
```

### overrideDailyPick

**Description:** Manually set a specific unwatched movie as tonight's pick

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "movieId"
  ],
  "properties": {
    "movieId": {
      "type": "number",
      "description": "The database ID of the movie to set as tonight's pick"
    }
  }
}
```

### processMovieLink

**Description:** Process a movie link shared to the agent and add it to the watchlist

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

### receiveCuratorPicks

**Description:** Receive intelligently selected movie picks from Sidekick analysis. Call with an array of movie objects under the key 'movies'. Each object must have tmdbId, title, year, and reason.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "movies"
  ],
  "properties": {
    "movies": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "tmdbId",
          "title",
          "year",
          "reason"
        ],
        "properties": {
          "year": {
            "type": "number",
            "description": "Release year"
          },
          "title": {
            "type": "string",
            "description": "Movie title (English)"
          },
          "reason": {
            "type": "string",
            "description": "Brief explanation of why this movie was recommended for this user"
          },
          "tmdbId": {
            "type": "number",
            "description": "TMDb ID for the movie"
          },
          "inTheaters": {
            "type": "boolean",
            "description": "Whether this movie is currently in theaters"
          },
          "releaseDate": {
            "type": "string",
            "description": "Full release date in YYYY-MM-DD format"
          },
          "originalTitle": {
            "type": "string",
            "description": "Original title in native language for non-English films (e.g., Сталкер for Stalker)"
          }
        }
      },
      "description": "Array of selected movies with their TMDb IDs, titles, release years, and recommendation reasons"
    }
  }
}
```

### receiveTasteProfile

**Description:** Receive the generated taste profile from Sidekick analysis

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "profileName",
    "tagline",
    "topGenres",
    "vibes"
  ],
  "properties": {
    "vibes": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Creative vibes/themes the user is drawn to"
    },
    "tagline": {
      "type": "string",
      "description": "Short tagline describing the profile"
    },
    "topGenres": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "genre",
          "note"
        ],
        "properties": {
          "note": {
            "type": "string"
          },
          "genre": {
            "type": "string"
          }
        }
      },
      "description": "Top genre preferences with notes"
    },
    "profileName": {
      "type": "string",
      "description": "Creative name for the taste profile"
    },
    "favoriteEras": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "fullAnalysis": {
      "type": "string",
      "description": "Full analysis paragraphs"
    },
    "favoriteDirectors": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  }
}
```

### refreshCuratorPicks

**Description:** Generate fresh curator picks using intelligent analysis

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### refreshTasteProfile

**Description:** Generate a fresh taste profile based on the user's watching history

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### removeDismissedPick

**Description:** Remove a movie from the dismissed list so it can be recommended again

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
      "description": "Dismissed pick ID to remove"
    }
  }
}
```

### removeFromWatchlist

**Description:** Remove a movie from the watchlist

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "movieId"
  ],
  "properties": {
    "movieId": {
      "type": "number",
      "description": "Movie database ID"
    }
  }
}
```

### repackCuratorPicks

**Description:** Reset pack status so picks appear as unopened (for testing the pack opening animation)

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### resetCuratorSchedule

**Description:** Reset curator picks schedule to default (replaces personal trigger with default schedule)

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### restoreCuratorPick

**Description:** Restore a previously dismissed curator pick (puts it at the top of the pile)

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "tmdbId",
    "title",
    "year",
    "genres",
    "overview",
    "posterUrl",
    "backdropUrl",
    "tmdbRating",
    "tmdbVoteCount",
    "director",
    "writer",
    "cast",
    "reason",
    "source",
    "releaseDate",
    "inTheaters",
    "generatedAt"
  ],
  "properties": {
    "cast": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "year": {
      "anyOf": [
        {
          "type": "number"
        },
        {
          "type": "null"
        }
      ]
    },
    "title": {
      "type": "string",
      "description": "Movie title"
    },
    "genres": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "reason": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "source": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "tmdbId": {
      "type": "number",
      "description": "TMDb ID of the movie"
    },
    "writer": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "director": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "overview": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "posterUrl": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "inTheaters": {
      "anyOf": [
        {
          "type": "boolean"
        },
        {
          "type": "null"
        }
      ]
    },
    "tmdbRating": {
      "anyOf": [
        {
          "type": "number"
        },
        {
          "type": "null"
        }
      ]
    },
    "backdropUrl": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "generatedAt": {
      "type": "string",
      "description": "Original generatedAt timestamp (ISO string) to preserve pack status"
    },
    "releaseDate": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "tmdbVoteCount": {
      "anyOf": [
        {
          "type": "number"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

### searchMoviesForWatchlist

**Description:** Search for movies by title using The Movie Database. Returns matching movies with poster, year, rating, and genres.

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
      "description": "Movie title to search for"
    },
    "minRating": {
      "type": "number",
      "description": "Minimum TMDb rating filter (0-10). If not provided, uses the user's saved preference."
    }
  }
}
```

### skipDailyPick

**Description:** Skip the current daily pick and get a new one

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### startTasteProfileRefresh

**Description:** Check requirements and start taste profile generation if possible

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### unmarkAsWatched

**Description:** Remove watched status from a movie

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "movieId"
  ],
  "properties": {
    "movieId": {
      "type": "number",
      "description": "Movie database ID"
    }
  }
}
```

### updateCuratorSchedule

**Description:** Update the curator picks schedule (creates a personal trigger)

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "cronExpression"
  ],
  "properties": {
    "cronExpression": {
      "type": "string",
      "description": "Cron expression for the schedule (e.g., '0 10 * * 5' for Friday at 10 AM)"
    }
  }
}
```

### updateMinRating

**Description:** Update the minimum TMDb rating threshold for movies

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "minRating"
  ],
  "properties": {
    "minRating": {
      "type": "number",
      "maximum": 10,
      "minimum": 0,
      "description": "Minimum TMDb rating (0-10 scale)"
    }
  }
}
```

### updatePostSettings

**Description:** Update post notification settings

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "postDailyPick": {
      "type": "boolean",
      "description": "Whether to create a post for tonight's pick"
    },
    "postCuratorPicks": {
      "type": "boolean",
      "description": "Whether to create a post when curator picks are generated"
    }
  }
}
```

### updateRating

**Description:** Update personal rating for a watched movie

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "movieId"
  ],
  "properties": {
    "rating": {
      "type": "number",
      "maximum": 10,
      "minimum": 1,
      "description": "Personal rating 1-10, null to remove"
    },
    "movieId": {
      "type": "number",
      "description": "Movie database ID"
    }
  }
}
```

### weeklyCuratorPicks

**Description:** Weekly cron job to refresh curator picks and taste profile on Fridays

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

