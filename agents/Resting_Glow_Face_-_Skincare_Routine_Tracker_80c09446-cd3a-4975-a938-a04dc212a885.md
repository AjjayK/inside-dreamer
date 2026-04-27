# Agent: Resting Glow Face - Skincare Routine Tracker

**ID:** 80c09446-cd3a-4975-a938-a04dc212a885

## Description

# OVERVIEW
A personalized skincare routine planner that starts with a comprehensive quiz about your skin profile, budget, and current products. The AI creates custom morning and evening routines, evaluates product compatibility, suggests alternatives, and intelligently adapts your plan based on cosmetic procedures and special events.

# KEY FEATURES
- **Smart Skin Profile Quiz**, Gathers age, skin condition, goals, location, current products, budget, and spending capacity to build your baseline
- **Routine Builder with Logic**, Creates morning and evening routines with ingredient analysis, product prioritization, and curated alternatives across price points—plus a "dream list" of premium options
- **Procedure-Aware Scheduling**, Logs cosmetic services (microneedling, Botox, facials, etc.) and automatically adjusts routines—e.g., holds retinol 3 days before procedures to avoid irritation
- **Ingredient & Compatibility Checks**, Identifies products that shouldn't mix together, flags those requiring downtime, and always reserves time for barrier repair
- **Event-Triggered Adjustments**, When a special event is coming, the system switches to an intensive prep routine with targeted treatments for optimal skin on the day

# COLLABORATION PROCESS

Before writing any code, the agent MUST act as a collaborative partner — not just an executor. Follow these three steps in order. Present findings in plain language (no jargon). Offer solutions, not just problems.

## Step 1: PRD Review (Sanity-Check Before Building)

Review this PRD and share findings with the builder, grouped as:

**Blockers** (must resolve before building):
- Vague requirements that two developers would interpret differently
- Contradictions between features (e.g., "keep it simple" vs. long feature list)
- Missing data — does a feature need information the app never collects?

**Questions** (need the builder's input):
- "What if" scenarios the PRD doesn't cover (user skips a step, search returns nothing, user comes back after a week)
- Ambiguous priorities — which features matter most if we have to choose?
- Success criteria — how will we know a feature is "done"?

**Suggestions** (could make it better):
- Improvements spotted while reading through
- Things that are well-defined and ready to build (call these out too — it builds confidence)

Format: short bullet list for each group. Explain *why* each item matters. Wait for the builder to respond before moving on.

## Step 2: MVP Scoping (Suggest a Smaller First Version)

After the PRD review, propose a smaller first version the builder can see working quickly:

**How to scope the MVP:**
- Identify the ONE core loop (the thing a user would do every time they open the app)
- Cut everything that isn't needed for that core loop to work end-to-end
- For each cut feature, briefly explain what gets deferred and why it's safe to defer
- Be specific: "I'd build [these screens/features] first, then add [these] after we confirm the core works"

**Present it as two lists:**
1. **MVP (build first):** The minimum set of features for the app to be useful
2. **Phase 2 (build after):** Everything else, roughly ordered by value

**Important:** Don't cut corners on quality — the MVP should feel complete for what it includes. A small thing that works well beats a big thing that feels half-done.

Wait for the builder to agree on scope before starting implementation.

## Step 3: Complexity Flagging (Flag Tricky Logic Early)

As you plan the build, flag anything that looks more complex than it sounds:

**What to flag:**
- Features where the logic has lots of "if this, then that" branches (e.g., ingredient interactions, procedure timing rules)
- Places where data from different parts of the app needs to stay in sync (e.g., changing a product in one place should update it everywhere)
- Features that depend on getting external data reliably (e.g., product search, location-based recommendations)
- Anything where getting it 90% right is easy but the last 10% is hard (e.g., timezone handling, smart scheduling)

**How to flag it:**
> "Heads up: [feature] sounds straightforward, but under the hood it involves [specific complexity]. Here's my plan to keep it manageable: [approach]. Does that sound right, or do you want to simplify it further?"

**For each flagged item, suggest:**
- A simpler version that still works (e.g., "instead of auto-detecting ingredient conflicts, we could start with a curated list of known conflicts")
- What we'd lose by simplifying (so the builder can make an informed choice)
- Whether it's worth building now or deferring to Phase 2

After the builder has reviewed the flags and made decisions, proceed to data planning and implementation.


# VERBATIM INSTRUCTIONS
let's create a new agent. it is a simple skincare routine tracker. Prerequisites: a user sees a quiz about their age, skin condition, objectives, place where they live and some roducts that they're currently using, their price levels, how much are they are wiling to allocate for th eskincare routine. after that AI uses these inputs to put together a plan for morning and evening routine for every day. The model must reason if these products are good, prioritize the when possible and provide alternatives (say a dream list n their price category) to meet the gaps in the routine. E.g. for your age and conditions using tretinoin would be more beneficial than off-the shelf retinol.  Constraints: some products do not mix together; some products require down time. Include options for cosmetic services (say botox, mirconeedling, facials etc) and and th emodel must adjust the routine based on when user logs their out of routine adjustments - e.g. i have mirconeedling on friday. The system adjusts so that no retinol is provided 3 days before. Constraint 2: when a user have a special event they need special face treatment. That also can change the routine. Always allocate time for barrier repair.

## Server Functions (23)

### addEvent

**Description:** Logs a special event and generates prep routine adjustments

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "eventName",
    "eventDate"
  ],
  "properties": {
    "notes": {
      "type": "string"
    },
    "eventDate": {
      "type": "string",
      "minLength": 1,
      "description": "YYYY-MM-DD"
    },
    "eventName": {
      "type": "string",
      "minLength": 1
    }
  }
}
```

### addProcedure

**Description:** Logs a cosmetic procedure and generates routine adjustments

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "procedureType",
    "scheduledDate"
  ],
  "properties": {
    "notes": {
      "type": "string"
    },
    "procedureType": {
      "type": "string",
      "minLength": 1,
      "description": "Type of procedure (microneedling, botox, chemical_peel, laser, facial, dermaplaning)"
    },
    "scheduledDate": {
      "type": "string",
      "minLength": 1,
      "description": "Date of procedure in YYYY-MM-DD format"
    }
  }
}
```

### analyzeProfile

**Description:** Analyzes a skin profile like a dermatologist consultation, returning concerns analysis and suggested routine steps

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### deleteEvent

**Description:** Deletes a special event and its associated routine adjustments

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

### deleteProcedure

**Description:** Deletes a procedure and its associated routine adjustments

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

### generateRoutines

**Description:** Generates a 7-day weekly skincare plan with per-day AM/PM routines and safety verification

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "confirmedSteps": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "category",
          "priority",
          "timeOfDay",
          "suggestedProduct",
          "activeIngredients"
        ],
        "properties": {
          "category": {
            "type": "string"
          },
          "priority": {
            "type": "string"
          },
          "timeOfDay": {
            "type": "string"
          },
          "suggestedProduct": {
            "type": "string"
          },
          "activeIngredients": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        }
      }
    }
  }
}
```

### getCheckinForDate

**Description:** Gets a skin check-in for a specific date, if any

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "date"
  ],
  "properties": {
    "date": {
      "type": "string",
      "description": "YYYY-MM-DD date string"
    }
  }
}
```

### getEvents

**Description:** Gets all special events for the user

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getGenerationJobStatus

**Description:** Gets the latest generation job status for the current user

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getProcedures

**Description:** Gets all logged procedures for the user

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getProfile

**Description:** Gets the user's skin profile from the database

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getRoutineForDate

**Description:** Gets the routine for a specific date, looking up the correct day of the weekly plan and checking for adjustments

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "date"
  ],
  "properties": {
    "date": {
      "type": "string",
      "description": "YYYY-MM-DD"
    }
  }
}
```

### getRoutines

**Description:** Gets the user's weekly skincare plan (7 days x AM/PM)

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getSkinCheckins

**Description:** Gets skin check-ins for the last N days

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "days": {
      "type": "number",
      "description": "Number of days to look back (default 30)"
    }
  }
}
```

### getTodayCheckin

**Description:** Gets today's skin check-in, if any

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getUpcomingAdjustments

**Description:** Gets all upcoming routine adjustments in the next 14 days

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

### saveProfile

**Description:** Saves or updates the user's skin profile

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "ageRange",
    "skinType",
    "skinConditions",
    "skinGoals",
    "currentProducts",
    "budgetRange"
  ],
  "properties": {
    "ageRange": {
      "type": "string",
      "minLength": 1
    },
    "location": {
      "type": "string"
    },
    "skinType": {
      "type": "string",
      "minLength": 1
    },
    "allergies": {
      "type": "string"
    },
    "skinGoals": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "budgetRange": {
      "type": "string",
      "minLength": 1
    },
    "routineTime": {
      "type": "string"
    },
    "monthlyBudget": {
      "type": "number"
    },
    "activesHistory": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "skinConditions": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "currentProducts": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "cosmeticProcedures": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "skincareExperience": {
      "type": "string"
    }
  }
}
```

### saveSkinCheckin

**Description:** Saves or updates a daily skin check-in (one per day per user). For today's check-ins, also adjusts tonight's evening routine based on skin feedback.

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "feeling",
    "date"
  ],
  "properties": {
    "date": {
      "type": "string",
      "description": "YYYY-MM-DD date string"
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Symptom tags e.g. dry, oily, breakouts, puffy_eyes"
    },
    "notes": {
      "type": "string",
      "description": "Optional free-text note"
    },
    "feeling": {
      "type": "string",
      "description": "How skin feels: great, good, okay, rough, breaking_out"
    },
    "routineLog": {
      "type": "object",
      "properties": {
        "evening": {
          "type": "array",
          "items": {
            "type": "object",
            "required": [
              "productName",
              "category",
              "done"
            ],
            "properties": {
              "done": {
                "type": "boolean"
              },
              "category": {
                "type": "string"
              },
              "productName": {
                "type": "string"
              }
            }
          }
        },
        "morning": {
          "type": "array",
          "items": {
            "type": "object",
            "required": [
              "productName",
              "category",
              "done"
            ],
            "properties": {
              "done": {
                "type": "boolean"
              },
              "category": {
                "type": "string"
              },
              "productName": {
                "type": "string"
              }
            }
          }
        }
      },
      "description": "What the user actually did: steps pre-checked from their planned routine, unchecked = skipped"
    }
  }
}
```

### searchAlternatives

**Description:** Finds alternative products for a given skincare product

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "productName"
  ],
  "properties": {
    "budgetRange": {
      "type": "string",
      "description": "User's budget preference"
    },
    "productName": {
      "type": "string",
      "minLength": 1,
      "description": "The product to find alternatives for"
    }
  }
}
```

### searchProducts

**Description:** Searches for skincare products, tools, and devices using AI-powered Google search

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
      "description": "Search query for the product, device, or tool"
    }
  }
}
```

### swapProduct

**Description:** Swaps a product in the weekly routine plan, replacing every occurrence of the old product with the new one

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "oldProductName",
    "newProductName",
    "category"
  ],
  "properties": {
    "category": {
      "type": "string",
      "minLength": 1,
      "description": "The product category (e.g. Cleanser, Moisturizer)"
    },
    "newProductName": {
      "type": "string",
      "minLength": 1,
      "description": "The replacement product"
    },
    "oldProductName": {
      "type": "string",
      "minLength": 1,
      "description": "The product currently in the routine"
    }
  }
}
```

### syncProfileToSidekick

**Description:** Syncs profile changes to Sidekick memory

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "ageRange",
    "skinType",
    "skinConditions",
    "skinGoals",
    "currentProducts",
    "budgetRange"
  ],
  "properties": {
    "ageRange": {
      "type": "string"
    },
    "location": {
      "type": "string"
    },
    "skinType": {
      "type": "string"
    },
    "allergies": {
      "type": "string"
    },
    "skinGoals": {
      "type": "string"
    },
    "budgetRange": {
      "type": "string"
    },
    "routineTime": {
      "type": "string"
    },
    "monthlyBudget": {
      "type": "number"
    },
    "activesHistory": {
      "type": "string"
    },
    "skinConditions": {
      "type": "string"
    },
    "currentProducts": {
      "type": "string"
    },
    "cosmeticProcedures": {
      "type": "string"
    },
    "skincareExperience": {
      "type": "string"
    }
  }
}
```

