# Agent: EatsFinder

**ID:** 68300136-59cf-40dc-b9d2-9fdf05a1ba14

## Description

# OVERVIEW
Monitor all major fast food chains, independent restaurants, bakeries, and coffee shops across New England for new menu items, limited-time offers, promos, and local deals. Posts clean notifications when something drops, keeping you updated on what's happening in Hartford, Springfield, and beyond without app-hopping.

# KEY FEATURES
- **Monitor All Chains + Local Spots**, Watch McDonald's, Chipotle, Dunkin, Taco Bell, and independent cafes, bakeries, and restaurants across New England. Get alerts for new items and LTOs as they post.
- **Bakery & Coffee Shop Focus**, Track seasonal pastries, new roasts, limited-edition drinks, and cafe deals. Perfect for discovering new local roasters and bakeries in Hartford and Springfield.
- **Promo Code Hunting**, Searches RetailMeNot, brand sites, Reddit, and local review sites for verified promo codes with discount amounts and expiry dates.
- **Regional Filtering**, Set your favorite chains, cafes, and bakeries by area—Hartford, Springfield, Boston region—and only see deals relevant to you.
- **Apple-Style Cards**, Minimal design showing deal name, discount %, code/link, location, and expiry. Zero clutter. Perfect for cafe exploring and discovering new local favorites.

# VERBATIM INSTRUCTIONS
alright so basically we want a extremely clean intereface like apple for this. this is what we are doing"Agent On Guard
Build an agent that monitors something and acts when conditions are met. Want an email when there's a price drop on a flight you've been tracking? A notification when a Slack channel goes silent?"

lets deep dive research on the web and look useful areas that can tackle this general questions for productivity or deal finding etc. i love different fast foods etc but personally i have a proble,m because i have to have every app downloaded and following people on instagram to get the news on whats coming. maybe lets researc this? 

lets also search for other ideas and make a blueprint

we also want to look at bakeries and coffee shops

## Server Functions (16)

### claimDeal

**Description:** Mark a deal as used/claimed by the user for savings tracking

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "dealId"
  ],
  "properties": {
    "dealId": {
      "type": "number",
      "description": "ID of the deal to claim"
    }
  }
}
```

### getDeals

**Description:** Get all deals from database for the current user

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "category": {
      "type": "string",
      "description": "Filter by category: fast_food, bakery, coffee, local"
    },
    "unseenOnly": {
      "type": "boolean",
      "description": "Only return unseen deals"
    }
  }
}
```

### getFoodHolidays

**Description:** Get upcoming food holidays

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getSavingsSummary

**Description:** Get the user's total savings from claimed deals

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getTaskProgress

**Description:** Get progress status for a running task

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
      "description": "The task key to check progress for"
    }
  }
}
```

### getUserProfile

**Description:** Read user profile from database

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### initializeProfile

**Description:** Initialize user profile from Sidekick knowledge (call once only)

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### main

**Description:** Scheduled deal scan — monitors for new deals, promos, BOGOs, app exclusives, and events

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### markDealSeen

**Description:** Mark a deal as seen

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "dealId"
  ],
  "properties": {
    "dealId": {
      "type": "number",
      "description": "The deal ID to mark as seen"
    }
  }
}
```

### onDealScanComplete

**Description:** Called by sidekick task when deal scanning is complete with structured deal data

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "deals",
    "summary"
  ],
  "properties": {
    "deals": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "title",
          "restaurant",
          "category",
          "dealType",
          "description"
        ],
        "properties": {
          "price": {
            "type": "string",
            "description": "Price or discount amount"
          },
          "title": {
            "type": "string",
            "description": "Name of the deal or menu item"
          },
          "region": {
            "type": "string",
            "description": "national or specific region"
          },
          "category": {
            "type": "string",
            "description": "fast_food, bakery, coffee, or local"
          },
          "dealType": {
            "type": "string",
            "description": "app_deal, bogo, deal, promo, event, hack, new_item, or lto"
          },
          "imageUrl": {
            "type": "string",
            "description": "URL of a food image"
          },
          "promoCode": {
            "type": "string",
            "description": "Promo code if applicable"
          },
          "sourceUrl": {
            "type": "string",
            "description": "URL of the source article"
          },
          "expiryDate": {
            "type": "string",
            "description": "Expiry date if known"
          },
          "launchDate": {
            "type": "string",
            "description": "When item launched (YYYY-MM-DD or descriptive like 'March 2026')"
          },
          "restaurant": {
            "type": "string",
            "description": "Restaurant or chain name"
          },
          "description": {
            "type": "string",
            "description": "1-2 sentence summary of the deal"
          },
          "availability": {
            "type": "string",
            "description": "limited_time, permanent, rotating, seasonal, or unknown"
          },
          "estimatedSavings": {
            "type": "number",
            "description": "Estimated savings in cents (e.g. 550 = $5.50)"
          }
        }
      }
    },
    "summary": {
      "type": "string",
      "description": "Brief summary of what was found"
    }
  }
}
```

### onDealScanProgress

**Description:** Receives progress updates from the deal scanning sidekick task

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
      "description": "Current status in active form (e.g., 'Searching for chain deals')"
    },
    "imperativeStatus": {
      "type": "string",
      "minLength": 1,
      "description": "Current status in imperative form (e.g., 'Search for chain deals')"
    }
  }
}
```

### onFoodHolidaysFound

**Description:** Called by sidekick task with upcoming food holidays

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "holidays"
  ],
  "properties": {
    "holidays": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "name",
          "date",
          "description"
        ],
        "properties": {
          "date": {
            "type": "string",
            "description": "Date in YYYY-MM-DD format"
          },
          "name": {
            "type": "string",
            "description": "Name of the holiday"
          },
          "chains": {
            "type": "string",
            "description": "JSON array of chain names"
          },
          "freeItem": {
            "type": "string",
            "description": "What you get free"
          },
          "sourceUrl": {
            "type": "string",
            "description": "Source URL"
          },
          "description": {
            "type": "string",
            "description": "What happens, who participates"
          }
        }
      }
    }
  }
}
```

### runScanNow

**Description:** Run a deal scan immediately (manual trigger)

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### saveUserProfile

**Description:** Save or update user profile in database

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "region": {
      "type": "string"
    },
    "categories": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "favoriteChains": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  }
}
```

### scrapeImagesForDeals

**Description:** Scrape images for deals that are missing them

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### syncProfileToSidekick

**Description:** Sync profile changes to Sidekick memory

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "region": {
      "type": "string"
    },
    "categories": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "favoriteChains": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  }
}
```

