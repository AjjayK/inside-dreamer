# Agent: Recipe Store

**ID:** a6dff78a-f2fc-4629-9715-003a5cc7973b

## Description

# Recipe Store - Product Requirements Document

## Overview
Recipe Store is a personal recipe management application that helps users discover, save, and organize recipes from across the web. The app integrates with Chrome extension and iOS share sheets to make saving recipes effortless, and provides an intelligent discovery system to find new recipes based on user preferences.

## Core Functionality

### 1. Recipe Library (My Recipes)
A centralized library displaying all saved recipes with:
- **Search**: Filter recipes by name or ingredient
- **Source Filter**: Clickable filter chips to view recipes by source:
  - All: Show all recipes
  - Manual: Recipes added via text/JSON input
  - Web: Recipes discovered or crawled from websites
  - Cookbook: Recipes imported from images (OCR)
  - Each filter shows count of matching recipes
- **Recipe Cards** showing:
  - Recipe image, name, description
  - Time (prep/cook/total), servings, rating
  - Cuisine and category tags
  - Favorite heart icon
- **Recipe Detail View**: Full ingredients, step-by-step instructions, metadata, source URL
  - Source type tag displayed prominently (Manual/Web/Cookbook)
  - Source type is editable via dropdown when editing a recipe
- **Empty State**: Welcoming message with call-to-action to discover recipes

### 2. Recipe Discovery & Web Search
A dedicated search tab for finding new recipes across the web:
- **Search Bar**: Enter any query (e.g., "lemon chicken", "pasta carbonara")
- **Comprehensive Results**: Uses SerpAPI to return both Google recipe cards and organic search results (typically 10+ results per search)
- **Favorite Sources**:
  - Inline display of favorite chefs/sites below search bar
  - Click X to remove a favorite source
  - Click + Add to add a new favorite source (just enter the name)
  - Results from favorite sources appear first with a star badge
- **Progressive Loading**: Fast initial results followed by enhanced results
- **Caching**: Results cached for 5 minutes to prevent unnecessary refetches

### 3. Multi-Source Recipe Capture
Input trigger accepting content from:
- **Chrome Extension**: Share recipes while browsing
- **iOS Share Sheet**: Share from Safari or other apps
- **Content Types**:
  - URLs: Automatically parses recipe pages
  - Plain text: Extracts recipe information using AI
  - Markdown: Parses formatted recipe text

**Parsing**: Extracts structured data from URLs using schema.org format, or uses AI to parse unstructured text (only captures explicitly stated information).

### 4. Image-Based Recipe Import
Add recipes by uploading or capturing photos:
- **Upload Images**: Select one or more images from device
- **Camera Capture**: Take photos directly using device camera
- **Multi-Page Support**: Add multiple images for recipes spanning several pages
- **Page Ordering**: Reorder pages using up/down arrows
- **OCR Processing**: Extracts text from images using vision AI
- **Exact Reproduction**: Recipe is transcribed exactly as written—no paraphrasing or additions
- **First Image as Cover**: The first uploaded image becomes the recipe's cover photo
- **Source Types**: Cookbooks, magazines, handwritten notes, screenshots

The Image tab in the Add Recipe modal provides:
- Upload Image button (supports multiple selection)
- Take Photo button (uses device camera)
- Visual preview grid with page numbers
- Reorder/remove controls on hover

### 5. Profile & Personalization
On first launch, personalized onboarding flow:
- **Cooking Skill Level**: Beginner, intermediate, or advanced
- **Favorite Cuisines**: Preferred cuisine types
- **Dietary Restrictions**: Vegetarian, Vegan, Gluten-Free, etc.
- **Allergies**: Food allergies
- **Cuisines to Avoid**: Cuisines to exclude
- **Recipe Language**: Translate imported recipes to a preferred language (or keep as-is)
- **Auto-generate Images**: Automatically create AI-generated images for recipes that don't have photos

Profile pre-populated from Sidekick's knowledge of the user.

### 6. Auto-Generate Recipe Images
When enabled in settings, recipes imported without images automatically receive AI-generated food photography:
- **Background Processing**: Image generation happens asynchronously after recipe is saved
- **Prioritizes Real Images**: If a recipe already has an image (from URL parsing, etc.), that image is kept
- **Professional Quality**: AI generates appetizing food photography with natural lighting
- **Toggle Control**: Users can enable/disable this feature in onboarding or settings

### 7. Widget View
Compact widget displays up to 4 recipes with customizable selection:
- **Widget Selection**: Users can choose which favorites appear in the widget
  - In Favorites tab, hover over any recipe card to see a grid icon
  - Tap the grid icon to toggle whether that recipe shows in the widget
  - A counter below the search bar shows how many recipes are selected
- **Fallback Behavior**: If no recipes are selected for widget, displays most recent recipes
- **Display**: Recipe images with name, cuisine tag, and time
- **Interaction**: Click any recipe to view full details

## Design
- **Color Palette**: Sage green (#8B9D83) as primary theme color
- **Typography**: Clean, readable fonts with semantic colors for dark/light mode
- **Icons**: Lucide icon set for consistency
- **Layout**: Responsive grid for mobile and desktop
- **Tab Navigation**: Library / Discovery tabs

## Technical Implementation

### Database Schema
1. **user_profile**: Dietary preferences and cooking skill
2. **recipes**: All saved recipes with complete metadata
3. **discovery_cache**: Cached search results

### Server Functions
**Profile**: getUserProfile, initializeProfile, saveProfile
**Recipes**: getSavedRecipes, getRecipe, saveRecipe*, updateRecipe, deleteRecipe
**Discovery**: discoverRecipes
**Parsing**: parseRecipeFromUrlServer*, parseRecipeFromText*, parseRecipeFromImages*, processSharedContent*
**Image Generation**: generateRecipeImage, autoGenerateRecipeImage (background)
(*exported for external use)

### External APIs
- SerpAPI for comprehensive web search (recipe cards + organic results)
- Recipe Search API for enhanced discovery
- Recipe Parser API for URL extraction
- Image Understanding API for OCR
- NanoBanana Pro API for image upload
- Sidekick API for user preferences

### Frontend
- React with React Query
- Single-page application with tab navigation
- Optimistic updates for instant feedback
- Semantic CSS for dark/light mode support

## User Flows

**First-Time**: Profile setup → Empty library → Discover or share recipes
**Save from Web**: Share → Auto-parse → Save to library
**Discovery**: Search → View results → Save to library
**View Recipe**: Browse library → Click card → View details → Favorite/Back
**Import from Image**: Add Recipe → Image tab → Upload/capture photos → Reorder pages → Submit → OCR & save

## Success Criteria
- Recipes save correctly from all sources (URL, text, discovery, images)
- Image OCR accurately transcribes recipe text without embellishment
- Multi-page recipes combine correctly in page order
- Search and source type filtering work smoothly
- Source type filter shows accurate counts
- Source type can be edited per-recipe
- Profile preferences persist across sessions
- Widget shows user-selected favorites (or recent recipes as fallback)
- Widget selection persists across sessions
- Input trigger processes shared content
- UI is responsive and works in dark/light mode

---

**Status**: Production-ready
**Version**: 1.5.0
**Last Updated**: 2026-01-21


## Server Functions (42)

### addFavoriteRecipeSource

**Description:** Add a favorite recipe source (person or website) to prioritize in search results

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "name",
    "searchTerms"
  ],
  "properties": {
    "name": {
      "type": "string",
      "minLength": 1,
      "description": "Display name like 'Kenji Lopez-Alt' or 'Serious Eats'"
    },
    "searchTerms": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Terms to match (names, domains, handles)"
    }
  }
}
```

### autoGenerateRecipeImage

**Description:** Auto-generate an AI image for a recipe without an image (runs in background)

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "recipeId",
    "recipeName"
  ],
  "properties": {
    "recipeId": {
      "type": "string",
      "description": "The ID of the recipe to generate an image for"
    },
    "recipeName": {
      "type": "string",
      "description": "The recipe name for the image prompt"
    },
    "recipeDescription": {
      "type": "string",
      "description": "Optional description for better image generation"
    }
  }
}
```

### classifyRecipeCategory

**Description:** Classify a recipe into an appropriate category based on its name, ingredients, and steps

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "recipeName",
    "ingredients",
    "steps"
  ],
  "properties": {
    "steps": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "recipeName": {
      "type": "string"
    },
    "ingredients": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  }
}
```

### deleteFavoriteRecipeSource

**Description:** Remove a favorite recipe source

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
      "description": "Source ID"
    }
  }
}
```

### deleteRecipe

**Description:** Delete a recipe from the user's library

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "id"
  ],
  "properties": {
    "id": {
      "type": "string"
    }
  }
}
```

### discoverByChef

**Description:** Search for recipes by a specific chef or cook

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "chefName"
  ],
  "properties": {
    "chefName": {
      "type": "string",
      "minLength": 1,
      "description": "Name of the chef or cook"
    },
    "useCache": {
      "type": "boolean"
    }
  }
}
```

### discoverByIngredients

**Description:** Find recipes based on available ingredients (what's in my fridge)

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "ingredients"
  ],
  "properties": {
    "useCache": {
      "type": "boolean"
    },
    "ingredients": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 1,
      "description": "List of available ingredients"
    }
  }
}
```

### discoverRecipes

**Description:** Search for new recipes from across the web using both recipe database and Google search

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
      "description": "Search query for recipes"
    },
    "useCache": {
      "type": "boolean"
    }
  }
}
```

### dismissExtensionTip

**Description:** Mark the extension tip as dismissed so it won't show again

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### findRecipeByDescription

**Description:** Find recipes in the user's library by plain text description. Returns full recipe details for all matching recipes. Supports both specific queries ('pasta carbonara') and broad queries ('vegetarian recipes', 'quick dinners'). Use this when Sidekick needs to provide recipe information to the user.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "description"
  ],
  "properties": {
    "description": {
      "type": "string",
      "description": "Plain text description of the recipe(s) the user is asking about (e.g., 'pasta carbonara', 'vegetarian recipes', 'quick dinners', 'something with chicken')"
    }
  }
}
```

### generateRecipeFromDescription

**Description:** Generate a complete recipe from a natural language description using AI

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "description"
  ],
  "properties": {
    "description": {
      "type": "string",
      "minLength": 5,
      "description": "What the user wants to cook, e.g. 'a quick weeknight pasta with cherry tomatoes and garlic'"
    }
  }
}
```

### generateRecipeImage

**Description:** Generate an image for a recipe using AI

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "recipeName"
  ],
  "properties": {
    "recipeName": {
      "type": "string"
    },
    "recipeDescription": {
      "type": "string"
    }
  }
}
```

### getFavoriteRecipeSources

**Description:** Get all favorite recipe sources for search result prioritization

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getRecipe

**Description:** Get a single recipe by ID

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "id"
  ],
  "properties": {
    "id": {
      "type": "string"
    }
  }
}
```

### getRecipeShoppingList

**Description:** Get just the shopping list ingredients for a recipe found by plain text description. Returns a simplified list of ingredients suitable for shopping. Use this when Sidekick needs to provide a shopping list without the full recipe details.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "description"
  ],
  "properties": {
    "description": {
      "type": "string",
      "description": "Plain text description of the recipe (e.g., 'pasta carbonara', 'that chicken recipe', 'the soup I saved')"
    }
  }
}
```

### getRecommendedRecipes

**Description:** Get personalized recipe recommendations based on user profile

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "useCache": {
      "type": "boolean"
    }
  }
}
```

### getSavedRecipes

**Description:** Get all recipes saved in the user's library

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "cuisine": {
      "type": "string"
    },
    "category": {
      "type": "string"
    },
    "favoritesOnly": {
      "type": "boolean"
    }
  }
}
```

### getStarterRecipesStatus

**Description:** Check the status of starter recipes seeding

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getTrendingRecipes

**Description:** Get trending and seasonal recipes

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "useCache": {
      "type": "boolean"
    }
  }
}
```

### getUserProfile

**Description:** Gets the user's recipe preferences and dietary restrictions

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### initializeProfile

**Description:** Initialize user profile using sidekick knowledge (call once only)

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### onWeeklyRecipeSuggestions

**Description:** Callback from Sidekick Task with recipe suggestions. Posts results as a notification the user can act on.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "recipes"
  ],
  "properties": {
    "recipes": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "name",
          "url",
          "source",
          "description"
        ],
        "properties": {
          "url": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "source": {
            "type": "string"
          },
          "cuisine": {
            "type": "string"
          },
          "imageUrl": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "estimatedTime": {
            "type": "string"
          }
        }
      }
    },
    "requestContext": {
      "type": "string",
      "description": "If this was an on-demand request, the original user request text. Omit for weekly automatic suggestions."
    }
  }
}
```

### parseBulkRecipes

**Description:** Parse multiple recipes from JSON array or text

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "text"
  ],
  "properties": {
    "text": {
      "type": "string"
    }
  }
}
```

### parseIngredientsFromImage

**Description:** Analyze a fridge photo and identify available ingredients

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "imageData"
  ],
  "properties": {
    "imageData": {
      "type": "string",
      "description": "Base64 encoded image data or image URL"
    }
  }
}
```

### parseRecipeFromImages

**Description:** Parse a recipe from one or more images using OCR. Supports multiple pages of a recipe. Returns immediately, processes in background.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "images"
  ],
  "properties": {
    "images": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "data",
          "pageNumber"
        ],
        "properties": {
          "data": {
            "type": "string",
            "description": "Base64 encoded image data (data URL) or image URL"
          },
          "pageNumber": {
            "type": "number",
            "description": "Page number for ordering (1-indexed)"
          }
        }
      },
      "minItems": 1,
      "description": "Array of images to OCR, in page order"
    }
  }
}
```

### parseRecipeFromText

**Description:** Parse a recipe from unstructured text using LLM

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "text"
  ],
  "properties": {
    "text": {
      "type": "string",
      "minLength": 10
    }
  }
}
```

### parseRecipeFromUrlServer

**Description:** Parse a recipe from a URL and save it to the library

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "url"
  ],
  "properties": {
    "url": {
      "type": "string"
    }
  }
}
```

### parseRecipeUrl

**Description:** Parse a recipe URL and cache the result for fast subsequent access

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
      "description": "URL of the recipe to parse"
    }
  }
}
```

### processSharedContent

**Description:** Process content shared via Chrome extension or iOS share sheet

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

### requestRecipeSuggestions

**Description:** Find personalized recipe suggestions based on a specific request. Call this when the user asks for recipe ideas, meal suggestions, or wants to discover new recipes matching a theme or ingredient. This does NOT save any recipes — it only finds and presents suggestions. After results are posted, present the list to the user and ask which ones they would like to add to their library. Then use saveRecipeFromSuggestion for each recipe the user selects.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "request"
  ],
  "properties": {
    "request": {
      "type": "string",
      "minLength": 1,
      "description": "What the user is looking for, in their own words. Examples: \"quick weeknight chicken dinners\", \"vegetarian pasta ideas\", \"something impressive for a dinner party\""
    }
  }
}
```

### saveProfile

**Description:** Save or update user profile with dietary preferences

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "dietaryRestrictions",
    "favoriteCuisines",
    "cuisinesToAvoid",
    "allergies"
  ],
  "properties": {
    "allergies": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "cuisinesToAvoid": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "defaultLanguage": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "favoriteCuisines": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "autoGenerateImages": {
      "type": "boolean"
    },
    "dietaryRestrictions": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "weeklySuggestionTime": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

### saveRecipe

**Description:** Save a recipe to the user's library from discovery or manual entry (internal use only).

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "recipe"
  ],
  "properties": {
    "recipe": {
      "type": "object",
      "required": [
        "name",
        "sourceType",
        "ingredients",
        "steps"
      ],
      "properties": {
        "name": {
          "type": "string"
        },
        "tags": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "tips": {
          "type": "string"
        },
        "steps": {
          "type": "array",
          "items": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "object",
                "properties": {},
                "additionalProperties": true
              }
            ]
          }
        },
        "cuisine": {
          "type": "string"
        },
        "category": {
          "type": "string"
        },
        "cookTime": {
          "type": "string"
        },
        "imageUrl": {
          "type": "string"
        },
        "mealType": {
          "type": "string"
        },
        "prepTime": {
          "type": "string"
        },
        "servings": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "number"
            }
          ]
        },
        "subtitle": {
          "type": "string"
        },
        "sourceUrl": {
          "type": "string"
        },
        "totalTime": {
          "type": "string"
        },
        "difficulty": {
          "type": "string"
        },
        "sourceType": {
          "type": "string"
        },
        "ingredients": {
          "type": "array",
          "items": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "object",
                "properties": {},
                "additionalProperties": true
              }
            ]
          }
        },
        "introduction": {
          "type": "string"
        },
        "fullRecipeData": {
          "type": "object",
          "properties": {},
          "additionalProperties": true
        },
        "sourceReference": {
          "type": "string"
        }
      }
    }
  }
}
```

### saveRecipeFromSuggestion

**Description:** Save a recipe from a suggestion URL to the user's library. Only call this after the user has reviewed the suggestions and explicitly chosen which recipes they want to add.

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
      "description": "The recipe URL to import"
    },
    "name": {
      "type": "string",
      "description": "Recipe name for the notification"
    }
  }
}
```

### searchWebRecipes

**Description:** Search for recipes across the web - returns raw results with links to original pages

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
      "description": "Recipe search query"
    }
  }
}
```

### searchWebRecipesEnhanced

**Description:** Enhanced recipe search with richer data - use after fast search for additional results

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "query",
    "excludeUrls"
  ],
  "properties": {
    "query": {
      "type": "string",
      "minLength": 1,
      "description": "Recipe search query"
    },
    "excludeUrls": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "URLs to exclude (already shown from fast search)"
    }
  }
}
```

### searchWebRecipesFast

**Description:** Fast recipe search using recipe database and Google - returns comprehensive results

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
      "description": "Recipe search query"
    }
  }
}
```

### seedFavoriteRecipeSources

**Description:** Seed the default favorite recipe sources if none exist

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### seedStarterRecipes

**Description:** Seeds starter recipes for new users

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### updateFavoriteRecipeSource

**Description:** Update a favorite recipe source

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
      "description": "Source ID"
    },
    "name": {
      "type": "string",
      "minLength": 1
    },
    "priority": {
      "type": "number"
    },
    "searchTerms": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  }
}
```

### updateRecipe

**Description:** Update a recipe's fields

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "id"
  ],
  "properties": {
    "id": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "steps": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "cuisine": {
      "type": "string"
    },
    "category": {
      "type": "string"
    },
    "imageUrl": {
      "type": "string"
    },
    "servings": {
      "type": "number"
    },
    "userNotes": {
      "type": "string"
    },
    "isFavorite": {
      "type": "boolean"
    },
    "sourceType": {
      "type": "string",
      "description": "Source type: text, web, image, discovery, bulk_json"
    },
    "ingredients": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "introduction": {
      "type": "string"
    },
    "showInWidget": {
      "type": "boolean"
    },
    "cookTimeMinutes": {
      "type": "number"
    },
    "prepTimeMinutes": {
      "type": "number"
    },
    "totalTimeMinutes": {
      "type": "number"
    }
  }
}
```

### uploadRecipeImage

**Description:** Upload a user-provided image for a recipe

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "imageData",
    "fileName",
    "mimeType"
  ],
  "properties": {
    "fileName": {
      "type": "string",
      "description": "Original file name with extension"
    },
    "mimeType": {
      "type": "string",
      "description": "MIME type of the image (e.g., image/jpeg, image/png)"
    },
    "imageData": {
      "type": "string",
      "description": "Base64-encoded image data (without the data URL prefix)"
    }
  }
}
```

### weeklyRecipeSuggestions

**Description:** Weekly cron job that finds personalized recipe suggestions from the web

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

