# Agent: Pour Decisions

**ID:** 98f0c541-99b1-4669-95cb-5df4b30fbe7e

## Description

# OVERVIEW
Pour Decisions is a cocktail recipe management agent that helps users discover, create, organize, and save cocktail recipes. Users can search for recipes by name or ingredients, create custom recipes with detailed ingredients and steps, rate and favorite their collections, and generate appealing visual representations of their cocktails. The agent provides an intuitive interface for browsing, managing, and curating a personal cocktail library.

# KEY FEATURES

## Recipe Discovery & Search
- **Smart Search**: Users can search for cocktails by name or ingredient(s) using a search bar
- **AI-Powered Suggestions**: When a user searches, an LLM suggests the top 5 relevant cocktails
- **Automated Recipe Collection**: For each suggested cocktail:
  - Searches Google for authentic recipe sources
  - Crawls the recipe webpage to extract content
  - Uses AI to parse ingredients (with measurements) and step-by-step instructions
  - Generates a beautiful AI image of the cocktail
- **Progress Tracking**: Shows real-time progress indicators as recipes are being processed (searching, crawling, extracting, generating image)
- **Save to Collection**: Users can save discovered recipes to their personal library

## Recipe Management
- **Personal Library**: View all saved recipes in a grid layout with images
- **Ratings**: Rate recipes from 1-5 stars to track personal preferences
- **Favorites**: Mark recipes as favorites with a heart icon
- **Search & Filter**: Filter saved recipes by name, favorites status
- **Delete Recipes**: Remove recipes from the collection

## Custom Recipe Creation
- **Manual Entry**: Create custom cocktail recipes from scratch
- **Detailed Fields**:
  - Recipe name (required)
  - Description (optional)
  - Ingredients with amounts (dynamic list, can add multiple)
  - Step-by-step instructions (dynamic list, can add multiple steps)
- **Optional AI Image**: Choose whether to generate an AI image for custom recipes
- **Immediate Save**: Custom recipes are saved directly to the personal library

## Visual Recipe Cards
- **Beautiful Images**: Each recipe displays an AI-generated image of the cocktail
- **Hover Animation**: Images smoothly zoom in when hovering over recipe cards
- **Recipe Information**: Cards show the cocktail name, description snippet, and rating
- **Quick Actions**:
  - Toggle favorite status with heart button
  - Rate directly from the card
  - Delete recipes
  - Click to view full details

## Recipe Detail View
- **Modal Display**: Full recipe details shown in an elegant modal overlay
- **Complete Information**:
  - Full-size cocktail image
  - Complete description
  - All ingredients with precise measurements
  - Numbered step-by-step instructions
  - Link to original recipe source (for discovered recipes)

## Widget View (Home Screen)
- **Featured Recipe**: Displays the most recently saved recipe
- **Quick Preview**: Shows recipe image, name, and rating
- **Recipe Count**: Displays total number of saved recipes
- **Compact Design**: Optimized for small widget display (300x300px)

# DESIGN

The application features a warm, sophisticated aesthetic inspired by mixology and bar culture, with a primary theme color of deep amber/gold (#C19A6B). The design balances elegance with approachability.

## Color Palette
- **Primary Color**: Amber/Gold (#C19A6B) - used for branding, buttons, and accents
- **Star Ratings**: Amber (#FBBF24) when filled
- **Favorites**: Red (#EF4444) when active
- **Status Indicators**:
  - Green for completed operations
  - Red for errors
  - Amber for in-progress states

## Layout & Components

### App (Full Screen)
- **Header**: Large title "Pour Decisions" in amber, with tagline
- **Search Section**: Prominent search bar with icon and button
- **Search Results**: Displays progress cards for each cocktail being processed
- **Filter Bar**: Search input, favorites toggle button, and create recipe button
- **Recipe Grid**: Responsive 3-column grid (1 column on mobile, 2 on tablet, 3 on desktop)
- **Recipe Cards**:
  - 200px height images with overflow hidden
  - Smooth scale transform on hover (1.02x zoom on card, 1.1x on image)
  - Glassmorphic favorite button overlay
  - Star rating controls
  - Delete button
- **Modals**:
  - Detail modal with full recipe information
  - Create modal with form for custom recipes
  - Dark backdrop with blur effect

### Widget (Home Screen)
- **Compact Layout**: Vertical flex layout optimized for small space
- **Featured Recipe**:
  - 132px height image
  - Recipe name and rating
  - Total recipe count
- **Empty State**: Friendly message prompting user to open the app

## Interactions
- **Smooth Transitions**: All hover states and animations use CSS transitions
- **Progress Feedback**: Loading spinners and status badges show operation progress
- **Optimistic Updates**: UI updates immediately when toggling favorites or ratings
- **Confirmation Dialogs**: Delete actions require confirmation

# TECHNICAL IMPLEMENTATION

## Data Flow
1. **Search**: User enters cocktail name/ingredient → LLM suggests 5 cocktails → For each:
   - Google search for recipe URL
   - Browser-based web crawl to extract content
   - LLM extraction of structured recipe data
   - AI image generation
2. **Save**: Structured recipe data stored in SQLite database
3. **Display**: React Query manages data fetching and caching
4. **Updates**: Mutations with query invalidation keep UI in sync

## Database Schema
- **recipes table**:
  - id (auto-increment primary key)
  - name, description
  - ingredients (JSON array)
  - instructions (JSON array)
  - imageUrl, sourceUrl
  - rating (1-5), isFavorite (boolean)
  - isCustom (boolean flag for user-created recipes)
  - createdAt, updatedAt timestamps

## Server Functions
- `searchCocktails`: Multi-step search and recipe collection
- `saveRecipe`: Save discovered recipes
- `getUserRecipes`: Fetch all recipes with optional filters
- `updateRecipe`: Update rating or favorite status
- `deleteRecipe`: Remove recipe from collection
- `createCustomRecipe`: Create user-defined recipes with optional image generation

## Tools Used
- **googlesearch**: Finding recipe URLs from Google
- **webcrawl** (renderUrlGrabContent): Browser-based scraping to bypass bot detection
- **image-generator** (generateImage): AI-generated cocktail images with specific prompt template
- **sdk.callLLM**: Cocktail suggestions and recipe data extraction

## Performance Optimizations
- Sequential web crawling to avoid rate limits
- Parallel image generation when possible
- Database-first approach (check before fetching)
- React Query caching with proper invalidation
- Error handling with graceful degradation

---

# IMPLEMENTATION STATUS
✅ **Fully Implemented** - All features from the product requirements are complete and deployed.


## Server Functions (7)

### createCustomRecipe

**Description:** Create a custom cocktail recipe with optional image generation

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "name",
    "ingredients",
    "instructions",
    "generateImage"
  ],
  "properties": {
    "name": {
      "type": "string",
      "minLength": 1
    },
    "rating": {
      "type": "number",
      "maximum": 5,
      "minimum": 1
    },
    "isFavorite": {
      "type": "boolean"
    },
    "description": {
      "type": "string"
    },
    "ingredients": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "name",
          "amount"
        ],
        "properties": {
          "name": {
            "type": "string"
          },
          "amount": {
            "type": "string"
          }
        }
      }
    },
    "instructions": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "generateImage": {
      "type": "boolean",
      "description": "Whether to generate an AI image for this recipe"
    }
  }
}
```

### deleteRecipe

**Description:** Delete a recipe from the user's collection

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "id"
  ],
  "properties": {
    "id": {
      "type": "number"
    }
  }
}
```

### getSearchProgress

**Description:** Get the progress of a cocktail search

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "invocationId"
  ],
  "properties": {
    "invocationId": {
      "type": "string",
      "description": "The invocation ID returned when starting a search"
    }
  }
}
```

### getUserRecipes

**Description:** Get all saved cocktail recipes for the user

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "searchQuery": {
      "type": "string"
    },
    "filterRating": {
      "type": "number",
      "maximum": 5,
      "minimum": 1
    },
    "filterFavorites": {
      "type": "boolean"
    }
  }
}
```

### saveRecipe

**Description:** Save a cocktail recipe to the user's collection

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "name",
    "ingredients",
    "instructions"
  ],
  "properties": {
    "name": {
      "type": "string",
      "minLength": 1
    },
    "rating": {
      "type": "number",
      "maximum": 5,
      "minimum": 1
    },
    "imageUrl": {
      "type": "string"
    },
    "sourceUrl": {
      "type": "string"
    },
    "isFavorite": {
      "type": "boolean"
    },
    "description": {
      "type": "string"
    },
    "ingredients": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "name",
          "amount"
        ],
        "properties": {
          "name": {
            "type": "string"
          },
          "amount": {
            "type": "string"
          }
        }
      }
    },
    "instructions": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  }
}
```

### searchCocktails

**Description:** Search for cocktail recipes by name or ingredients

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
      "description": "Cocktail name or ingredient(s) to search for"
    }
  }
}
```

### updateRecipe

**Description:** Update a recipe's rating or favorite status

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "id"
  ],
  "properties": {
    "id": {
      "type": "number"
    },
    "rating": {
      "type": "number",
      "maximum": 5,
      "minimum": 1
    },
    "isFavorite": {
      "type": "boolean"
    }
  }
}
```

