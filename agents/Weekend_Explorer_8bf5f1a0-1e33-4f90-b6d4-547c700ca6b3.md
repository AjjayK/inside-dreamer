# Agent: Weekend Explorer

**ID:** 8bf5f1a0-1e33-4f90-b6d4-547c700ca6b3

## Description

# OVERVIEW
Weekend Explorer finds interesting things to do in your local area for the upcoming weekend. It runs every Thursday at 7 PM and uses your location, calendar, interests, and local weather to curate personalized activity recommendations for Saturday and Sunday. The agent learns from your feedback to improve future suggestions.

# KEY FEATURES
- **Enrollment Experience**: On first use, an enrollment sidekick LLM call gathers your interests, location, family preferences, and lifestyle to build a user profile. You review and edit this profile before it's finalized.
- **Smart Calendar Integration**: Checks your weekend calendar and uses event locations to find complementary activities nearby.
- **Weather-Aware Recommendations**: Retrieves the weekend forecast and filters to indoor-only activities if weather is inclement.
- **Multi-Source Event Discovery**: Conducts 5+ targeted searches for events matching your preferences, verifies event dates, and retrieves full web results for validation.
- **Feedback Loop**: Displays recommendations in a full app view where you can thumbs-up or thumbs-down suggestions with optional feedback. Stores your preferences to refine future recommendations.

# DESIGN
- **Visual Style**: Bright, exploratory design with a vibrant teal/coral accent palette. The primary theme color is teal (#1A9B8E), evoking discovery and outdoor exploration. The design feels inviting and activity-focused, with clear visual hierarchy for event cards.
- **Bulletin / Feed Post**: Compact summary card showing Saturday and Sunday recommendations (3-4 events per day), including calendar items already planned. Includes current weather conditions and a call-to-action to view full details. Sent as an urgent push notification.
- **App / Full View**: Interactive event cards with photos, descriptions, verified dates, times, and locations. Each card has thumbs-up / thumbs-down buttons with an optional feedback text field (e.g., "Not interested in museums," "Already saw this," "Too far away"). Shows a weather banner at the top with temperature and conditions for each day.

# VERBATIM INSTRUCTIONS

**Enrollment Flow (Run Once on First Use):**
1. Use a sidekick prompt to gather user profile information using the following context collection process:
   - Retrieve the user's home location and work location (if available)
   - Extract user interests from their memory: specific activity types (outdoor, cultural, culinary, fitness, family-friendly, solo, etc.)
   - Note any family members and their ages/interests from the user's memory
   - Identify mobility constraints or accessibility needs (if any are documented)
   - Gather any time/travel preferences (max distance willing to travel, preferred times of day, etc.)
   - Compile all this into a clear, editable profile
   - Display the profile to the user and allow them to edit or confirm it before storing
   - Store the finalized profile in agent-managed persistent storage for use in all future runs

**Main Agent Flow (Runs Every Thursday at 7 PM):**
This primarily uses a sidekick task.

1. **Retrieve User Profile**: Load the stored enrollment profile (location, interests, family info, preferences).

2. **Check Weekend Calendar**: Query the user's calendar for Saturday and Sunday events. For each event, extract the location and note its distance from the user's home location.

3. **Get Weather Forecast**: Retrieve the weather forecast for Saturday and Sunday. If either day has severe/inclement weather (rain, snow, extreme heat/cold), mark that day as "indoor-only."

4. **Generate Search Queries**: Based on the user's interests, family configuration, and calendar items, create 5+ specific search queries. Examples:
   - Activities near any existing calendar event locations
   - Outdoor activities if weather permits
   - Child-friendly activities if the user has children
   - Niche interests (e.g., "jazz venues," "farmers markets," "hiking trails")
   - Seasonal or time-specific events
   - Restaurants or food experiences matching interests

5. **Search and Retrieve Results**: For each search query, retrieve the top results and fetch the full web pages to verify:
   - Event/venue exists and is actually operating
   - Event is happening on the specific date (Saturday or Sunday)
   - Time and location details are accurate
   - Is it appropriate given weather conditions

6. **Filter and Rank**: Cross-reference results against:
   - User's stored preferences (interests, liked/disliked categories)
   - Feedback history (exclude activities previously marked thumbs-down or categories the user rejected)
   - Distance from user's home or relevant calendar event locations
   - Weather appropriateness
   - Family suitability (if applicable)

7. **Create Recommendations**: Select 3–4 of the best-matched events for each day. For each:
   - Include event name, type (activity category), time, location, distance from home or nearest calendar event
   - Add a one-sentence description of why it might appeal to the user
   - Flag if it's already on their calendar
   - Include a link to more details
   - Include an image related to the event (extracted from the web page related to it - prefer the opengraph data you'll find with the crawlUrl tool, fall back on other images)

8. **Compose Bulletin**: Create a bulletin with:
   - Header showing Saturday and Sunday with weather summary
   - For each day: list calendar items (if any) and the 3–4 recommended activities
   - Short visual summary (e.g., emoji or icon per activity type)
   - Call-to-action button to view full details and provide feedback

9. **Post Bulletin**: Post to the user's feed with priority "urgent" to trigger a push notification.

10. **Display App View**: In the full app view, show all recommendations as interactive cards with thumbs-up/thumbs-down voting and optional feedback fields. Store all votes and feedback in persistent storage, tagged with activity type and date, for use in future recommendation logic.

11. **Update Feedback Log**: Each time the user rates a recommendation, update the stored feedback history. Use this history to inform future searches and filters (e.g., if the user consistently rejects museum events, deprioritize or skip those in future recommendations).

**Persistence & State:**
- Enrollment profile: stored once after user confirmation
- Feedback history: appended after each user vote, includes timestamp, activity type, user's rating, and optional feedback text
- All data is persisted and retrieved on each weekly run

---

# PLANNING CONVERSATION
Below is the conversation between the author and an assistant that is helping them to create their agent. Keep in mind the author's original intent while building the agent:

**Author**: Make an agent that runs every Thursday evening at 7pm and finds interesting things for the user to do in their local area during the upcoming weekend. Have an enrollment experience where you first have the sidekick provide information about the user, their location, their family and their interests, then show that to the user and let them edit it if desired. On each invocation of the main agent function, first check the weather forecast for the days in question. First check the user’s calendar for anything they are already planning to do. Use the location of any events on their calendar to suggest complementary things nearby. If the location of an event on their calendar is far from their home location, use that as the central search location for that particular day. Next check the weather forecast for the days in question. If the weather is inclement, suggest only indoor activities, else suggest indoor and outdoor. Issue at least 5 searches for events that might match the user’s preferences. Retrieve and read the underlying web results. For each event check specifically that it is definitely happening on the day in question. Make a final recommendation of 3 or 4 events the user could choose each day. Finally, post a bulletin to the user’s feed containing a clear summary of the dates you’ve picked, suggestions for Saturday and Sunday, including stuff already on their calendar; make it a push notification too. Make it possible for the user to look at all the events selected in the full app view and give thumbs up or thumbs down on any recommendations, providing a reason for any thumbs down. Store the log of stuff they liked or didn’t and use it when deciding what to recommend in future.

**Assistant**: I'll help you create this weekend activity agent. Let me start by checking the available product knowledge to understand the agent capabilities better, then build the blueprint.

**Assistant**: Let me get more details on triggers and notifications since those are key to this agent:

**Assistant**: Perfect! Now I have what I need. Let me create the blueprint for your weekend activity agent:

**Assistant**: Great! I've created a blueprint for **Weekend Explorer**—an agent that discovers personalized activities for your weekends.

## What it does:

**First-time setup**: An enrollment flow collects your location, interests, family info, and preferences. You review and edit everything before it's finalized.

**Every Thursday at 7 PM**: The agent:
- Checks your weekend calendar and uses event locations to suggest nearby activities
- Gets the weather forecast and filters to indoor-only if needed
- Runs 5+ targeted searches for events matching your interests
- Verifies each event is actually happening on the right day
- Ranks recommendations based on your interests and feedback history
- Posts a bulletin to your feed with 3–4 suggestions per day + push notification
- Lets you thumbs-up or thumbs-down in the app, storing your feedback to improve future picks

**Feedback loop**: It tracks what you like/dislike and uses that to refine recommendations over time.

The design uses teal/coral colors with a discovery vibe. The bulletin gives you a quick summary in your feed, and the full app view shows interactive cards where you can rate each suggestion.

**What would you like to adjust?** Review the blueprint and let me know if you want changes to:
- How often it runs or what time
- What data gets collected during enrollment
- The recommendation logic
- The UI/design approach
- Anything else


## Server Functions (11)

### generateRecommendationsNow

**Description:** Manually trigger generation of weekend recommendations

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getCurrentProgress

**Description:** Get the most recent progress update for the current generation run

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getGenerationStatus

**Description:** Check if recommendations are currently being generated

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getRecommendations

**Description:** Get recommendations for the current or upcoming weekend

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getUserProfile

**Description:** Get the user's profile if it exists

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### initializeProfile

**Description:** Initialize profile using sidekick's knowledge - call ONCE only

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### main

**Description:** Weekly background function that finds weekend activities

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### reportToDoStatus

**Description:** Report progress on a todo item during recommendation generation. Called automatically by the sidekick task system via progressCallback.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "status"
  ],
  "properties": {
    "status": {
      "type": "string",
      "description": "The current progress status message"
    }
  }
}
```

### saveProfile

**Description:** Save or update the user's profile

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "location",
    "interests",
    "familyMembers"
  ],
  "properties": {
    "location": {
      "type": "string"
    },
    "interests": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "workLocation": {
      "type": "string"
    },
    "familyMembers": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "name"
        ],
        "properties": {
          "age": {
            "type": "number"
          },
          "name": {
            "type": "string"
          },
          "interests": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        }
      }
    },
    "preferredTimes": {
      "type": "string"
    },
    "maxTravelDistance": {
      "type": "string"
    },
    "mobilityConstraints": {
      "type": "string"
    }
  }
}
```

### storeRecommendations

**Description:** Store weekend recommendations from the sidekick task. Called by the sidekick task when complete.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "weekendDate",
    "recommendations"
  ],
  "properties": {
    "weekendDate": {
      "type": "string",
      "description": "Saturday date in YYYY-MM-DD format"
    },
    "recommendations": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "day",
          "eventName",
          "eventType",
          "description",
          "location",
          "isCalendarEvent"
        ],
        "properties": {
          "day": {
            "type": "string",
            "description": "saturday or sunday"
          },
          "url": {
            "type": "string"
          },
          "time": {
            "type": "string"
          },
          "distance": {
            "type": "string"
          },
          "imageUrl": {
            "type": "string"
          },
          "location": {
            "type": "string"
          },
          "eventName": {
            "type": "string"
          },
          "eventType": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "isCalendarEvent": {
            "type": "boolean"
          }
        }
      }
    }
  }
}
```

### submitFeedback

**Description:** Submit feedback on a recommendation

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "recommendationId",
    "rating",
    "activityType"
  ],
  "properties": {
    "rating": {
      "type": "string",
      "description": "up or down"
    },
    "activityType": {
      "type": "string"
    },
    "feedbackText": {
      "type": "string"
    },
    "recommendationId": {
      "type": "number"
    }
  }
}
```

