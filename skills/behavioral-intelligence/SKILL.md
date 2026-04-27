---

## name: behavioral-intelligence
description: Learning from user behavior to make your agent a better personal assistant. Covers interaction tracking, habit detection, LLM-based insight extraction, Sidekick memory sync, and applying learned preferences at runtime.

# Behavioral Intelligence

## Table of Contents

- [Overview](#overview)
- [When to Use Behavioral Intelligence](#when-to-use-behavioral-intelligence)
- [Choose Your Tier](#choose-your-tier)
- [What to Track — Habit Signals](#what-to-track--habit-signals)
- [Implementation: Event Collection](#implementation-event-collection)
  - [Schema](#schema)
  - [Server Function](#server-function)
  - [Client-Side Hook](#client-side-hook)
- [Implementation: Insight Extraction](#implementation-insight-extraction)
  - [Tier 1: Track + Summarize](#tier-1-track--summarize)
  - [Tier 2: Track + Aggregate + Summarize](#tier-2-track--aggregate--summarize)
  - [Detecting Seasonal/Cyclical Patterns](#detecting-seasonalcyclical-patterns)
- [Implementation: Sidekick Memory Sync](#implementation-sidekick-memory-sync)
  - [Proactive Sidekick Suggestions](#proactive-sidekick-suggestions)
- [Implementation: Using Insights at Runtime](#implementation-using-insights-at-runtime)
- [Maintenance](#maintenance)
- [Common Pitfalls](#common-pitfalls)
- [Key Takeaways](#key-takeaways)

## Overview

A good personal assistant remembers your habits without being told. The `user-profiles` skill covers **explicit** data — things the user directly tells you (location, interests, dietary preferences). Behavioral intelligence covers what you **learn by paying attention** — patterns in how the user actually uses your agent over days and weeks.

This isn't engagement optimization or content ranking like social media. The goal is simple: **make your agent more helpful by understanding the person using it.**

**What behavioral intelligence looks like across agents:**

- **Grocery List** — learns staple items the user re-adds every week, suggests them proactively
- **Calendar Hero** — notices the user always expands briefings for 1:1 meetings but skips all-hands, adapts detail level
- **Bookshelf** — learns the user finishes sci-fi fast but abandons non-fiction, adjusts recommendations
- **Package Tracker** — notices the user checks delivery status 5x/day for electronics but ignores grocery deliveries, tunes notification urgency
- **Coffee Calibrator** — remembers the user prefers light roasts and always adjusts grind finer on weekends
- **Alert Agent** — learns which alert topics get read vs dismissed, stops surfacing irrelevant ones
- **Album Curator** — tracks which genres are rising and falling in the user's listening habits, shares this with other agents
- **EatsFinder** — notices the user added 10 Japanese recipes this week, surfaces Japanese restaurants over others

**Key Principle:** Track meaningful interactions, periodically extract insights via LLM, sync summaries to Sidekick so all agents benefit.

## ⚠️ CRITICAL: Always Use Prompt Templates

**Every example in this skill shows inline prompts for brevity. In your actual code, you MUST use Handlebars templates from the `src/prompts/` directory.**

See `skills/prompt-templates/SKILL.md` for comprehensive guidance.

## When to Use Behavioral Intelligence

**✅ Use when:**

- Agent has repeated interactions over days/weeks (user comes back regularly)
- User actions carry implicit preference signals (choosing X over Y, skipping Z, repeating W)
- Agent could be more helpful by anticipating habits or adapting to patterns
- Examples: grocery lists (staples), news agents (topic preferences), calendar tools (meeting priorities), trackers (urgency sensitivity), recipe apps (ingredient preferences)

**❌ Don't use when:**

- Agent is single-use or stateless (QR code generator, unit converter, math game)
- All relevant preferences are already captured by explicit profile settings
- Interactions are too uniform to carry signal (e.g., a clock widget, a simple timer)
- Agent has very few users or very infrequent usage

**Examples:**

- ✅ Grocery list that learns staple items from repeated additions
- ✅ News agent that learns which topics the user reads vs skips
- ✅ Meeting prep tool that learns which meeting types need detailed briefings
- ✅ Recipe app that learns ingredient preferences from cooking history
- ❌ QR code generator (no behavioral pattern to learn)
- ❌ Simple countdown timer (uniform interaction, no preferences)
- ❌ Photo filter app (each use is independent)

## Choose Your Tier

Not every agent needs a sophisticated pipeline. Pick the level that fits your interaction complexity:

### Tier 1: Track + Summarize (Simple)

```
User interacts → Log event (DB) → Periodic LLM summary (cron) → Store insight → Sync to Sidekick
```

- Log meaningful interactions to a single events table
- Periodically summarize with one FAST LLM call
- Sync summary to Sidekick memory
- **Good for:** Most agents. Simpler interaction patterns, fewer event types, lower volume.
- **Cost:** ~1 FAST LLM call per user per day

### Tier 2: Track + Aggregate + Summarize (Advanced)

```
User interacts → Log event (DB) → Deterministic aggregation (cron) → LLM summary (cron) → Store insight → Sync to Sidekick
```

- Log interactions to events table
- Periodic deterministic aggregation: frequency counts, recency weighting, category grouping (no LLM — free)
- LLM summarization of aggregated data into human-readable insights
- Sync to Sidekick memory
- **Good for:** Agents with high-volume interactions, many categories, or complex entity relationships.
- **Cost:** ~1 FAST LLM call per user per day (aggregation is free DB math)

### Quick Decision: Tier 1 or 2?


| Question                  | Tier 1         | Tier 2                    |
| ------------------------- | -------------- | ------------------------- |
| How many event types?     | < 10           | 10+                       |
| Daily events per user?    | < 50           | 50+                       |
| Need per-category scores? | No             | Yes                       |
| Need recency weighting?   | LLM handles it | Code handles it precisely |


**When in doubt, start with Tier 1.** You can always add aggregation later.

## What to Track — Habit Signals

Think of interactions as **habit indicators**, not engagement metrics. What does this action tell you about the person?

### Repetition Signals

What does the user do repeatedly?

- Items re-added to lists (grocery staples, recurring tasks)
- Searches repeated across sessions (persistent interests)
- Same settings chosen again and again (preferred defaults)
- Same time-of-day usage (morning routine, evening wind-down)

→ **Indicates:** Staples, routines, preferences the user hasn't explicitly stated

### Choice Signals

When given options, what does the user pick?

- Items selected vs skipped from suggestions
- Categories expanded vs collapsed
- Suggestions accepted vs rejected vs modified
- Features used vs ignored

→ **Indicates:** Preferences, priorities, taste

### Timing Signals

When and how quickly does the user act?

- Morning vs evening usage patterns
- Immediate vs delayed response to notifications
- Day-of-week patterns (weekend vs weekday behavior)
- Frequency of manual checks between scheduled updates

→ **Indicates:** Routines, urgency sensitivity, when the agent matters most

### Friction Signals

What does the user correct or undo?

- Edits immediately after creation (agent got it wrong)
- Deletions and "not this" actions
- Dismissals with feedback ("not relevant", "already aware", "too generic")
- Settings changed right after seeing results

→ **Indicates:** What the agent got wrong, what to avoid, quality expectations

### Seasonal/Cyclical Signals

What does the user do at recurring times of year?

- Winter clothing purchases every October/November
- Holiday gift shopping or meal prep in December
- Lighter grocery lists in summer, heartier soups and stews in winter
- Annual subscription renewals, tax prep materials, back-to-school shopping
- Seasonal coffee preferences (iced drinks May-September, hot lattes in winter)
- Fitness goal spikes every January, outdoor activity tracking in spring

→ **Indicates:** Calendar-driven habits, seasonal needs, upcoming recurring purchases or routines

**Why this matters:** Seasonal patterns are some of the highest-value predictions a personal assistant can make because they enable *anticipation*. Instead of reacting to what the user is doing now, the agent can prepare for what they'll need next month.

**Cross-agent examples:**

- **Package Tracker** notices winter jacket purchases last October → **Radar** proactively suggests creates a price drop watch for winter jackets in September
- **Grocery List** sees cranberry and turkey additions every November → suggests them proactively as Thanksgiving approaches
- **Bookshelf** notices user reads light fiction every June → recommends beach reads as summer starts
- **Calendar Hero** sees annual performance review prep in Q4 → starts compiling accomplishments in advance
- **Crema** detects iced coffee preference May-September → switches default suggestions when weather warms

### Decision Tree: "Should I Track This?"

```
Does this action reflect a user choice or habit?
├── YES → Could knowing this pattern make the agent more helpful next time?
│   ├── YES → Track it ✓
│   └── NO → Skip it
└── NO → Is it just the system doing its thing? (loading, rendering, fetching)
    ├── YES → Skip it
    └── NO → Would tracking it feel invasive or creepy?
        ├── YES → Skip it
        └── NO → Track it ✓
```

**Examples of what to track:**

- ✅ User dismisses a suggestion with reason "not relevant"
- ✅ User adds "milk" to grocery list for the 4th week in a row
- ✅ User always checks the app between 7-8am
- ✅ User skips all-hands meeting briefings but reads 1:1 briefings
- ✅ User adds winter coat to package tracking every October (seasonal purchase pattern)
- ✅ User's grocery list shifts to holiday ingredients every December

**Examples of what NOT to track:**

- ❌ Page renders or component mounts (system behavior, not user choice)
- ❌ Scroll position or mouse movements (too granular, feels invasive)
- ❌ Every keystroke in a search box (track the submitted search instead)
- ❌ API response times (infrastructure, not behavior)

## Implementation: Event Collection

### Schema

```typescript
// src/schema.ts
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const interactionEvents = sqliteTable("interaction_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  owner: text("owner").notNull(),
  eventType: text("event_type").notNull(),       // e.g. "item_added", "suggestion_dismissed", "alert_read"
  entityType: text("entity_type"),               // e.g. "grocery_item", "recipe", "alert", "meeting"
  entityId: text("entity_id"),                   // ID of the specific entity
  metadata: text("metadata"),                    // JSON string for extra context
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// Tier 1: Just insights (LLM-generated summary)
export const behavioralInsights = sqliteTable("behavioral_insights", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  owner: text("owner").notNull(),
  summary: text("summary").notNull(),            // Human-readable insight summary
  habits: text("habits"),                        // JSON: learned habits and patterns
  preferences: text("preferences"),              // JSON: inferred preferences
  avoidances: text("avoidances"),                // JSON: things to avoid or de-prioritize
  generatedAt: integer("generated_at", { mode: "timestamp" }).notNull(),
});
```

**For Tier 2, add an aggregation table:**

```typescript
// Additional table for Tier 2 only
export const behavioralScores = sqliteTable("behavioral_scores", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  owner: text("owner").notNull(),
  category: text("category").notNull(),          // e.g. "sci-fi", "morning_routine", "1:1_meetings"
  score: integer("score").notNull().default(0),  // Weighted, decayed score
  signalCount: integer("signal_count").notNull().default(0),
  lastEventAt: integer("last_event_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});
```

### Server Function

Keep the logging function lightweight — just a DB insert, no LLM, no external calls.

```typescript
// src/server.ts
import { serverFunction, type ServerSdk } from "@dev-agents/sdk-server";
import { Type } from "@dev-agents/sdk-shared";
import { getUserTimeZone } from "@dev-agents/sdk-server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import * as schema from "./schema";
import { interactionEvents } from "./schema";

dayjs.extend(utc);
dayjs.extend(timezone);

export const logInteraction = serverFunction({
  description: "Log a user interaction event for behavioral learning",
  params: Type.Object({
    eventType: Type.String({ description: "Type of interaction, e.g. 'item_added', 'suggestion_dismissed'" }),
    entityType: Type.Optional(Type.String({ description: "Category of entity, e.g. 'grocery_item', 'recipe'" })),
    entityId: Type.Optional(Type.String({ description: "ID of the specific entity" })),
    metadata: Type.Optional(Type.Object({}, { additionalProperties: true, description: "Extra context as key-value pairs" })),
  }),
  execute: async (sdk: ServerSdk, { eventType, entityType, entityId, metadata }) => {
    const db = sdk.db<typeof schema>();
    const owner = sdk.getUser().email;

    await db.insert(interactionEvents).values({
      owner,
      eventType,
      entityType: entityType ?? null,
      entityId: entityId ?? null,
      metadata: metadata ? JSON.stringify(metadata) : null,
      createdAt: dayjs().tz(getUserTimeZone()).toDate(),
    });

    return { success: true };
  },
});
```

### Client-Side Hook

Use a fire-and-forget mutation so logging never blocks the UI.

```tsx
// In your App.tsx or a shared hooks file
import { useMutation } from "@tanstack/react-query";
import { call } from "@dev-agents/sdk-client";
import type { logInteraction } from "./server";

function useLogInteraction() {
  const mutation = useMutation({
    mutationFn: (event: {
      eventType: string;
      entityType?: string;
      entityId?: string;
      metadata?: Record<string, unknown>;
    }) => call<typeof logInteraction>("logInteraction", event),
  });

  // Return a fire-and-forget function — never await, never block UI
  return (event: Parameters<typeof mutation.mutate>[0]) => {
    mutation.mutate(event);
  };
}

// Usage in components:
function GroceryItem({ item, onAdd }) {
  const log = useLogInteraction();

  const handleAdd = () => {
    onAdd(item);
    log({
      eventType: "item_added",
      entityType: "grocery_item",
      entityId: item.id,
      metadata: { name: item.name, category: item.category },
    });
  };

  return <button onClick={handleAdd}>{item.name}</button>;
}

function SuggestionCard({ suggestion, onAccept, onDismiss }) {
  const log = useLogInteraction();

  return (
    <div>
      <p>{suggestion.text}</p>
      <button onClick={() => {
        onAccept(suggestion);
        log({ eventType: "suggestion_accepted", entityType: "suggestion", entityId: suggestion.id });
      }}>
        Accept
      </button>
      <button onClick={() => {
        onDismiss(suggestion);
        log({ eventType: "suggestion_dismissed", entityType: "suggestion", entityId: suggestion.id });
      }}>
        Not for me
      </button>
    </div>
  );
}
```

**Guidelines:**

- Log at the point of user action (button click, form submit, dismiss) — not on passive renders
- Never use `useQuery` for logging — queries refetch automatically on this platform
- Keep metadata minimal — just enough context to understand the pattern later
- Don't log duplicate events for the same action (one click = one event)

## Implementation: Insight Extraction

### Tier 1: Track + Summarize

A single background function that queries recent events and asks an LLM to identify patterns. Run daily via cron.

```typescript
// src/server.ts
import { backgroundFunction, type ServerSdk } from "@dev-agents/sdk-server";
import { Type } from "@dev-agents/sdk-shared";
import { and, eq, gte, desc } from "drizzle-orm";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { getUserTimeZone } from "@dev-agents/sdk-server";
import Handlebars from "handlebars";
import promptSource from "./prompts/summarize-behavior.handlebars";

dayjs.extend(utc);
dayjs.extend(timezone);

const template = Handlebars.compile(promptSource);

export const generateInsights = backgroundFunction({
  description: "Analyze recent interaction events and extract behavioral insights",
  params: Type.Object({}),
  execute: async (sdk: ServerSdk) => {
    const db = sdk.db<typeof schema>();
    const owner = sdk.getUser().email;

    // Get events from the last 30 days
    const thirtyDaysAgo = dayjs().tz(getUserTimeZone()).subtract(30, "days").toDate();
    const events = await db.select()
      .from(interactionEvents)
      .where(
        and(
          eq(interactionEvents.owner, owner),
          gte(interactionEvents.createdAt, thirtyDaysAgo)
        )
      )
      .orderBy(interactionEvents.createdAt);

    // Skip if no new events since last insight generation
    const existingInsight = await db.select()
      .from(behavioralInsights)
      .where(eq(behavioralInsights.owner, owner))
      .orderBy(desc(behavioralInsights.generatedAt))
      .limit(1);

    if (existingInsight[0]) {
      const newEvents = events.filter(e => e.createdAt > existingInsight[0]!.generatedAt);
      if (newEvents.length === 0) {
        console.log("No new events since last insight generation, skipping");
        return;
      }
    }

    if (events.length === 0) {
      console.log("No interaction events found, skipping insight generation");
      return;
    }

    // Summarize events for the LLM (don't send raw DB rows)
    const eventSummary = summarizeEventsForPrompt(events);

    // Single FAST LLM call to extract insights
    const insights = await sdk.callLLM(
      template({ events: eventSummary, previousInsights: existingInsight[0]?.summary ?? "None" }),
      Type.Object({
        summary: Type.String({ description: "2-3 sentence overview of the user's behavioral patterns" }),
        habits: Type.Array(Type.String({ description: "Observed habits, e.g. 'Adds milk every Sunday'" })),
        preferences: Type.Array(Type.String({ description: "Inferred preferences, e.g. 'Prefers sci-fi over non-fiction'" })),
        avoidances: Type.Array(Type.String({ description: "Things to avoid, e.g. 'Dismisses political news'" })),
      }),
      { modelVariant: "FAST" }
    );

    // Store the insight
    await db.insert(behavioralInsights).values({
      owner,
      summary: insights.summary,
      habits: JSON.stringify(insights.habits),
      preferences: JSON.stringify(insights.preferences),
      avoidances: JSON.stringify(insights.avoidances),
      generatedAt: dayjs().tz(getUserTimeZone()).toDate(),
    });

    console.log("Behavioral insights generated:", insights.summary);
  },
});

// Helper: condense raw events into a readable summary for the LLM
function summarizeEventsForPrompt(events: Array<{ eventType: string; entityType: string | null; metadata: string | null; createdAt: Date }>) {
  // Group by event type and count
  const counts: Record<string, number> = {};
  const recentExamples: string[] = [];

  for (const event of events) {
    const key = `${event.eventType}:${event.entityType ?? "unknown"}`;
    counts[key] = (counts[key] ?? 0) + 1;
  }

  // Include a few recent events with metadata for context
  const recent = events.slice(-20);
  for (const event of recent) {
    const meta = event.metadata ? JSON.parse(event.metadata) : {};
    recentExamples.push(
      `${event.eventType} on ${event.entityType ?? "unknown"} (${JSON.stringify(meta)}) at ${event.createdAt.toISOString()}`
    );
  }

  return {
    totalEvents: events.length,
    eventCounts: counts,
    recentExamples,
  };
}
```

**Example Handlebars template (`src/prompts/summarize-behavior.handlebars`):**

```handlebars
You are analyzing a user's interaction history with a personal agent to identify habits, preferences, and patterns.

## Interaction Summary (last 30 days)
Total events: {{events.totalEvents}}

### Event counts by type:
{{#each events.eventCounts}}
- {{@key}}: {{this}} times
{{/each}}

### Recent interactions:
{{#each events.recentExamples}}
- {{this}}
{{/each}}

{{#if previousInsights}}
## Previous Insights
{{previousInsights}}
{{/if}}

## Your Task
Analyze the interactions above and identify:
1. **Habits** — Recurring actions or routines (e.g., "Adds milk every Sunday", "Checks alerts first thing in the morning")
2. **Preferences** — What the user seems to prefer or prioritize (e.g., "Prefers detailed briefings for 1:1 meetings", "Gravitates toward sci-fi books")
3. **Avoidances** — What the user skips, dismisses, or ignores (e.g., "Dismisses political news", "Ignores all-hands meeting prep")
4. **Seasonal patterns** — Any cyclical or calendar-driven behaviors visible in the data or previous insights (e.g., "Shops for winter clothing in October", "Grocery list shifts to holiday ingredients in December", "Switches to iced coffee in May")

Focus on patterns that would help the agent be more useful. Ignore one-off actions. If previous insights exist, look for seasonal/cyclical patterns by comparing current behavior to past months. Note any changes or new patterns.
```

### Tier 2: Track + Aggregate + Summarize

Add a deterministic aggregation step before the LLM call. This is useful when you have many event types or high volume and want precise frequency/recency scores.

```typescript
// Step 1: Deterministic aggregation (no LLM — free)
// Imports: same as generateInsights above (and, eq, gte, dayjs, getUserTimeZone, etc.)

export const aggregateSignals = backgroundFunction({
  description: "Aggregate interaction events into behavioral scores",
  params: Type.Object({}),
  execute: async (sdk: ServerSdk) => {
    const db = sdk.db<typeof schema>();
    const owner = sdk.getUser().email;

    const thirtyDaysAgo = dayjs().tz(getUserTimeZone()).subtract(30, "days").toDate();
    const events = await db.select()
      .from(interactionEvents)
      .where(
        and(
          eq(interactionEvents.owner, owner),
          gte(interactionEvents.createdAt, thirtyDaysAgo)
        )
      );

    if (events.length === 0) return;

    // Group events by category (entityType or derived from metadata)
    const categoryScores: Record<string, { score: number; count: number; lastEventAt: Date }> = {};

    for (const event of events) {
      const category = event.entityType ?? "general";
      if (!categoryScores[category]) {
        categoryScores[category] = { score: 0, count: 0, lastEventAt: event.createdAt };
      }

      const entry = categoryScores[category]!;

      // Apply signal weight based on event type
      const weight = getSignalWeight(event.eventType);

      // Apply time decay — recent events matter more
      const ageInDays = (Date.now() - event.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      const decayFactor = Math.exp(-ageInDays / 14); // 14-day half-life

      entry.score += weight * decayFactor;
      entry.count += 1;
      if (event.createdAt > entry.lastEventAt) {
        entry.lastEventAt = event.createdAt;
      }
    }

    // Upsert scores
    for (const [category, data] of Object.entries(categoryScores)) {
      const existing = await db.select().from(behavioralScores)
        .where(and(eq(behavioralScores.owner, owner), eq(behavioralScores.category, category)))
        .limit(1);

      if (existing[0]) {
        await db.update(behavioralScores)
          .set({ score: Math.round(data.score), signalCount: data.count, lastEventAt: data.lastEventAt, updatedAt: dayjs().tz(getUserTimeZone()).toDate() })
          .where(eq(behavioralScores.id, existing[0].id));
      } else {
        await db.insert(behavioralScores).values({
          owner, category, score: Math.round(data.score), signalCount: data.count,
          lastEventAt: data.lastEventAt, updatedAt: dayjs().tz(getUserTimeZone()).toDate(),
        });
      }
    }

    console.log(`Aggregated scores for ${Object.keys(categoryScores).length} categories`);
  },
});

// Define signal weights for your agent's event types.
// Positive = user wants more of this. Negative = user wants less.
// These are examples — define weights that make sense for YOUR agent.
function getSignalWeight(eventType: string): number {
  // Explicit positive signals (user actively chose this)
  if (eventType === "item_saved" || eventType === "suggestion_accepted") return 3;
  if (eventType === "item_added" || eventType === "alert_read") return 2;

  // Implicit positive signals (user engaged)
  if (eventType === "item_viewed" || eventType === "detail_expanded") return 1;

  // Negative signals (user rejected this)
  if (eventType === "suggestion_dismissed") return -2;
  if (eventType === "dismissed_with_feedback") return -3;

  // Default for unknown events
  return 1;
}
```

**Then run `generateInsights` (same as Tier 1) but include the aggregated scores in the prompt for richer context.**

**Key:** The LLM's job is to synthesize patterns into actionable insights, not to do math. Let code handle counting and weighting; let the LLM handle understanding what the numbers mean for this person.

### Detecting Seasonal/Cyclical Patterns

Standard 30-day event retention is too short to spot annual cycles. You don't need to extend raw event retention — instead, leverage the **insight history** that already persists indefinitely.

**How it works:** Each daily `generateInsights` run produces a summary stored in `behavioralInsights`. Over months, you accumulate summaries like "November: user added winter clothing items" and "December: user shifted to holiday recipes." When the next November rolls around, the LLM has access to last year's insight summaries (via the `previousInsights` field in the prompt) and can identify the cycle — even though the raw events from last November were cleaned up long ago.

**What to do:**

1. **Include previous insights in the prompt** — The `generateInsights` example already passes `previousInsights`. Make sure you're querying enough history (last 3-6 insight summaries, not just the most recent one) so the LLM can spot multi-month patterns.
2. **Ask the LLM explicitly** — Add seasonal/cyclical pattern detection to your Handlebars template (see updated template below). The LLM already knows the current date via the system message, so it can reason about "it's September, and last October the user bought winter jackets."
3. **No new tables needed** — The insight summaries are your long-term memory. This approach costs nothing extra — you're already generating insights daily.

**When the agent is brand new:** Seasonal detection naturally improves over time. In the first year, the agent learns short-cycle habits. After 12+ months, it starts recognizing annual patterns from accumulated insight history. This is fine — don't try to shortcut it.

## Implementation: Sidekick Memory Sync

Sync the human-readable insight summary to Sidekick so other agents benefit. **Never sync raw events or numeric scores** — Sidekick needs to understand the person, not parse your data model.

```typescript
// src/server.ts
// Imports: same as generateInsights above (and, eq, desc, backgroundFunction, etc.)

export const syncInsightsToSidekick = backgroundFunction({
  description: "Sync behavioral insights to Sidekick memory",
  params: Type.Object({}),
  execute: async (sdk: ServerSdk) => {
    const db = sdk.db<typeof schema>();
    const owner = sdk.getUser().email;

    const insight = await db.select()
      .from(behavioralInsights)
      .where(eq(behavioralInsights.owner, owner))
      .orderBy(desc(behavioralInsights.generatedAt))
      .limit(1);

    if (!insight[0]) {
      console.log("No insights to sync");
      return;
    }

    const agentName = "Your Agent Name"; // Replace with your agent's name

    // NOTE: In real code, this prompt MUST be in src/prompts/*.handlebars
    await sdk.sidekickWithSchema(
      `${agentName} has learned the following about the user from their behavior patterns:

${insight[0].summary}

Habits: ${insight[0].habits}
Preferences: ${insight[0].preferences}
Things they tend to avoid: ${insight[0].avoidances}

Please update your memory about this user accordingly. This information may be useful for other agents too.`,
      Type.Object({
        acknowledged: Type.Boolean({ description: "Whether the memory update was processed" }),
      })
    );

    console.log("Behavioral insights synced to Sidekick");
  },
});
```

**When to sync:**

- ✅ After generating new insights (if they changed from previous)
- ✅ On a daily/weekly schedule alongside insight generation
- ❌ On every interaction event (wasteful — dozens of Sidekick calls per day)
- ❌ On every app load (wasteful)

**Cross-agent benefit examples:**

- Grocery List learns "user is vegetarian" → Calendar Hero suggests vegetarian restaurant options for lunch meetings
- Bookshelf learns "user loves sci-fi" → Podcast agent recommends sci-fi audiobooks
- Coffee Calibrator learns "user prefers light roasts" → Shopping agent knows this for gift suggestions
- Album Curator tracks rising/falling genre interest → Weekend Planner suggests concerts specific to genres trending upward in the user's taste
- EatsFinder notices 10 Japanese recipes added in 10 days → surfaces Japanese restaurants over other cuisines
- EatsFinder detects high-protein low-carb food choices over 3 weeks → Basket Builder surfaces high-protein ingredients; Sidekick suggests a workout tracker if the user hasn't installed one

**Follow the same Sidekick sync patterns from `skills/user-profiles/SKILL.md`** — use `backgroundFunction` (Sidekick calls take 30+ seconds), keep the prompt focused on what changed.

**Seasonal insights are especially valuable for Sidekick sync.** When one agent detects a seasonal pattern (e.g., "user buys winter clothing in October"), syncing that to Sidekick lets *other* agents anticipate the same cycle — a deal-finding agent can set up price alerts in September, a calendar agent can block shopping time, a budget agent can plan for the expense. These cross-agent seasonal anticipations are some of the most impressive personal assistant behaviors you can build.

### Proactive Sidekick Suggestions

When multiple agents sync behavioral insights to Sidekick, Sidekick gains a unique vantage point — it can see patterns *across* agents that no individual agent can detect. This enables a powerful class of proactive suggestions where Sidekick acts as a meta-assistant:

**Timing mismatches:**

> User consistently opens an agent around 8 PM every evening, but the agent's alert is set for 10 AM. Sidekick notices the gap and suggests: *"You usually check this around 8 PM but your alert fires at 10 AM — would you like to move it closer to when you actually use it?"*

**Duplicate coverage:**

> User has News/Feed, Tech News Pro, and LLM Lowdown all installed. All three surface AI news. User dismisses 60% of News/Feed alerts that duplicate Tech News Pro. Sidekick notices the overlap and suggests: *"You're getting overlapping AI coverage from three agents. Want me to configure News/Feed to focus on your non-tech interests instead?"*

**Cross-domain health intelligence:**

> EatsFinder detects high-protein low-carb food choices over the last 3 weeks. Sidekick connects the dots: the user might be on a fitness kick. It surfaces a workout tracker agent if the user hasn't installed one, and tells Basket Builder to prioritize high-protein ingredients.

**Genre-to-experience bridging:**

> Album Curator knows which music genres are rising in the user's interest. Weekend Planner doesn't track music at all — but Sidekick bridges the gap, suggesting concerts and live events specific to the genres the user is currently into.

These suggestions feel magical because they connect information the user never explicitly linked. The key enabler is behavioral insights synced from individual agents flowing into Sidekick's unified view of the person.

## Implementation: Using Insights at Runtime

Read pre-computed insights from the database — no LLM call needed at runtime, so it's free and fast.

```typescript
// src/server.ts — helper function other server functions can use
// Imports: eq, desc from "drizzle-orm"; serverFunction, type ServerSdk from "@dev-agents/sdk-server"

export const getBehavioralInsights = serverFunction({
  description: "Get the user's behavioral insights for personalization",
  params: Type.Object({}),
  execute: async (sdk: ServerSdk) => {
    const db = sdk.db<typeof schema>();
    const owner = sdk.getUser().email;

    const insight = await db.select()
      .from(behavioralInsights)
      .where(eq(behavioralInsights.owner, owner))
      .orderBy(desc(behavioralInsights.generatedAt))
      .limit(1);

    if (!insight[0]) {
      return null;
    }

    return {
      summary: insight[0].summary,
      habits: JSON.parse(insight[0].habits ?? "[]") as string[],
      preferences: JSON.parse(insight[0].preferences ?? "[]") as string[],
      avoidances: JSON.parse(insight[0].avoidances ?? "[]") as string[],
      generatedAt: insight[0].generatedAt,
    };
  },
});
```

### Application Patterns

**⚠️ IMPORTANT:** Explicit profile data always takes priority over behavioral insights. If the user explicitly said "I'm vegetarian" in their profile, that trumps any behavioral inference. Behavioral insights supplement the profile — they don't override it.

#### Smart Defaults

Pre-fill forms and suggestions with values the user frequently chooses:

```typescript
// In a grocery list agent — suggest staple items
export const getSuggestedItems = serverFunction({
  description: "Get suggested grocery items based on user habits",
  params: Type.Object({}),
  execute: async (sdk: ServerSdk) => {
    const db = sdk.db<typeof schema>();
    const owner = sdk.getUser().email;

    // Query frequently added items from events
    const recentAdds = await db.select()
      .from(interactionEvents)
      .where(
        and(
          eq(interactionEvents.owner, owner),
          eq(interactionEvents.eventType, "item_added"),
        )
      );

    // Count frequency per item
    const itemCounts: Record<string, number> = {};
    for (const event of recentAdds) {
      const meta = event.metadata ? JSON.parse(event.metadata) : {};
      if (meta.name) {
        itemCounts[meta.name] = (itemCounts[meta.name] ?? 0) + 1;
      }
    }

    // Return items added 3+ times as suggestions
    const staples = Object.entries(itemCounts)
      .filter(([, count]) => count >= 3)
      .sort(([, a], [, b]) => b - a)
      .map(([name]) => name);

    return { staples };
  },
});
```

#### Proactive Suggestions

Surface things the user might want before they ask:

```typescript
// "You usually add milk on Sundays — want to add it to this week's list?"
// Use insights to decide WHAT to suggest, then show in the UI
```

#### Adaptive Detail Level

Show more or less detail based on what the user engages with:

```typescript
// Calendar agent: user always expands 1:1 briefings but skips all-hands
// → Generate detailed briefings for 1:1s, minimal for all-hands
const insights = await getBehavioralInsights(sdk);
const detailLevel = insights?.preferences?.includes("detailed briefings for 1:1 meetings")
  ? "detailed"
  : "brief";
```

#### Notification Tuning

Only alert for patterns the user actually responds to:

```typescript
// Alert agent: user reads tech alerts within minutes but ignores politics alerts for days
// → Set tech alerts as urgent, reduce frequency of politics alerts
```

#### Seasonal Anticipation

Proactively surface suggestions based on calendar-driven patterns the agent has learned over time:

```typescript
// In a deal-finder or shopping agent — anticipate seasonal needs
export const getSeasonalSuggestions = serverFunction({
  description: "Get proactive suggestions based on seasonal behavior patterns",
  params: Type.Object({}),
  execute: async (sdk: ServerSdk) => {
    const insights = await getBehavioralInsights(sdk);
    if (!insights) return { suggestions: [] };

    // The insights summary already contains seasonal patterns
    // identified by the LLM from accumulated insight history.
    // Parse them from the habits/preferences arrays.
    const seasonalHabits = insights.habits.filter(
      (h) => h.toLowerCase().includes("every year")
        || h.toLowerCase().includes("seasonal")
        || /\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/i.test(h)
    );

    return { suggestions: seasonalHabits };
  },
});

// Example insights the LLM might produce over time:
// - "Shops for winter jackets in October every year"
// - "Adds holiday baking ingredients in early December"
// - "Switches to iced coffee drinks around May"
//
// Your agent can then surface these proactively:
// → "Last year you shopped for winter jackets around this time. Want to set up a price alert?"
```

## Maintenance

### Data Retention

Don't store interaction events forever. Raw events are only needed for periodic insight generation — once processed, the insights carry the value.

```typescript
// Add to your existing cron or create a weekly cleanup cron
// Imports: lt from "drizzle-orm"; dayjs, getUserTimeZone as above

export const cleanupOldEvents = backgroundFunction({
  description: "Delete interaction events older than 30 days",
  params: Type.Object({}),
  execute: async (sdk: ServerSdk) => {
    const db = sdk.db<typeof schema>();
    const cutoff = dayjs().tz(getUserTimeZone()).subtract(30, "days").toDate();

    await db.delete(interactionEvents)
      .where(lt(interactionEvents.createdAt, cutoff));

    console.log("Cleaned up interaction events older than 30 days");
  },
});
```

### Cost Budget


| Operation             | Frequency            | Cost                     |
| --------------------- | -------------------- | ------------------------ |
| Event logging         | Per interaction      | Free (DB insert)         |
| Aggregation (Tier 2)  | Daily cron           | Free (DB queries + math) |
| Insight generation    | Daily cron           | ~1 FAST LLM call         |
| Sidekick sync         | When insights change | ~1 Sidekick call         |
| Runtime insight reads | Per request          | Free (DB query)          |


**Total cost per user per day:** ~1 FAST LLM call + 0-1 conditional Sidekick syncs. Everything else is free database operations.

**Skip optimization:** If no new events since the last insight generation, skip the LLM call entirely. This is handled by the `generateInsights` function checking for new events before calling the LLM.

### Cron Setup

Add triggers in `agent.yaml`:

```yaml
triggers:
  - type: cron
    defaultSchedule: "0 3 * * *"    # Daily at 3am user's timezone
    entrypoint: generateInsights
    name: "Generate Behavioral Insights"

  # Tier 2 only: run aggregation before insight generation
  - type: cron
    defaultSchedule: "0 2 * * *"    # Daily at 2am (before insights)
    entrypoint: aggregateSignals
    name: "Aggregate Behavioral Signals"

  - type: cron
    defaultSchedule: "0 4 * * 0"    # Weekly Sunday at 4am
    entrypoint: syncInsightsToSidekick
    name: "Sync Insights to Sidekick"

  - type: cron
    defaultSchedule: "0 5 * * 0"    # Weekly Sunday at 5am
    entrypoint: cleanupOldEvents
    name: "Cleanup Old Interaction Events"
```

## Common Pitfalls

### ❌ Logging Events in a useQuery

```typescript
// WRONG — queries refetch automatically on this platform (~every 10s)
// This will log dozens of duplicate events per session
function ItemList({ items }) {
  const { data } = useQuery({
    queryKey: ["logView"],
    queryFn: () => call<typeof logInteraction>("logInteraction", {
      eventType: "list_viewed",
    }),
  });
}
```

**✅ Correct — use a mutation, fire once on user action:**

```typescript
function ItemList({ items }) {
  const log = useLogInteraction();

  // Log once when user explicitly opens the list, not on every render
  const handleItemClick = (item) => {
    log({ eventType: "item_viewed", entityType: "item", entityId: item.id });
  };
}
```

### ❌ Calling LLM on Every Event

```typescript
// WRONG — expensive, slow, unnecessary
export const logInteraction = serverFunction({
  execute: async (sdk, event) => {
    await db.insert(interactionEvents).values(event);
    // Don't do this! Costs money on every click
    await sdk.callLLM("Analyze this event...", schema);
  },
});
```

**✅ Correct — batch via daily cron:**

```typescript
// Log function: just a DB insert (free, fast)
export const logInteraction = serverFunction({
  execute: async (sdk, event) => {
    await db.insert(interactionEvents).values(event);
    return { success: true };
  },
});

// Separate cron job: one LLM call per day for all events
export const generateInsights = backgroundFunction({ /* ... */ });
```

### ❌ Over-Engineering When Tier 1 Is Sufficient

```typescript
// WRONG — your agent has 5 event types and ~20 events/day
// You don't need weighted aggregation, decay functions, and per-category scores
export const aggregateSignals = backgroundFunction({
  execute: async (sdk) => {
    // 100 lines of math for 20 events... overkill
  },
});
```

**✅ Correct — start with Tier 1, add complexity only when needed:**

```typescript
// Just summarize the events directly — the LLM can handle 20 events easily
export const generateInsights = backgroundFunction({
  execute: async (sdk) => {
    const events = await getRecentEvents(sdk);
    const insights = await sdk.callLLM(template({ events }), schema, { modelVariant: "FAST" });
    await saveInsights(sdk, insights);
  },
});
```

### ❌ Overriding Explicit Profile with Behavioral Guesses

```typescript
// WRONG — user explicitly set "vegetarian" in their profile
// but behavior shows they viewed a few chicken recipes
const diet = behavioralInsights.includes("interested in chicken recipes")
  ? "omnivore"    // DON'T override the user's explicit choice!
  : profile.diet;
```

**✅ Correct — explicit profile always wins:**

```typescript
// Profile is the source of truth. Behavioral insights supplement, never override.
const diet = profile.diet; // User said "vegetarian" — respect that

// Behavioral insights inform OTHER decisions:
// "User views Italian recipes most" → suggest Italian vegetarian options
```

### ❌ Syncing Raw Events to Sidekick

```typescript
// WRONG — Sidekick doesn't need 500 raw event rows
await sdk.sidekickWithSchema(
  `Here are the user's last 500 interaction events: ${JSON.stringify(rawEvents)}`,
  schema
);
```

**✅ Correct — sync the human-readable summary:**

```typescript
// Sidekick needs insights, not data dumps
await sdk.sidekickWithSchema(
  `The user tends to add milk, eggs, and bread weekly.
   They prefer detailed meeting briefings for 1:1s.
   They dismiss political news alerts.`,
  schema
);
```

### ❌ Storing Events Forever

```typescript
// WRONG — unbounded growth, database gets huge over months
// No cleanup, no retention policy
export const logInteraction = serverFunction({
  execute: async (sdk, event) => {
    await db.insert(interactionEvents).values(event);
    // Events accumulate forever...
  },
});
```

**✅ Correct — schedule regular cleanup:**

```typescript
// Weekly cron deletes events older than 30 days
// Insights persist — they carry the value, not the raw events
export const cleanupOldEvents = backgroundFunction({ /* see Maintenance section */ });
```

### ❌ Making the Agent Feel Creepy

```typescript
// WRONG — surfacing raw behavioral data to the user
<p>We noticed you check your phone at 2:47am every night.</p>
<p>You've been looking at moving companies 3x this week.</p>
```

**✅ Correct — use insights to be helpful, not to show off what you know:**

```typescript
// Just be quietly helpful — use the insight, don't announce it
// Instead of "We noticed you always buy milk on Sundays"
// → Just show milk in the suggested items on Sunday

// If you must explain: frame it as the agent adapting, not watching
<p>Based on your recent lists, here are some items you might want to add:</p>
```

## Key Takeaways

1. **Track choices, not views** — Log when the user makes a decision (add, dismiss, accept, skip), not when the system renders something
2. **Start with Tier 1** — A single events table + one daily LLM call is enough for most agents. Add aggregation only when you outgrow it.
3. **LLM for understanding, code for counting** — Let deterministic code handle frequencies and recency; let the LLM synthesize what the numbers mean for this person
4. **Explicit profile always wins** — Behavioral insights supplement the user's stated preferences, never override them
5. **Sync summaries to Sidekick, not raw data** — Other agents need to understand the person, not parse your event schema
6. **Budget: ~1 FAST LLM call/day** — Event logging and runtime reads are free DB operations. Skip the LLM call when there's nothing new.
7. **Clean up events regularly** — Keep 30 days of raw events. Insights persist and carry the value.
8. **Think beyond weeks** — Some of the most valuable patterns are seasonal (annual shopping, holiday routines, weather-driven preferences). Insight summaries persist and accumulate over months, giving the LLM long-term memory for free.
9. **Be helpful, not creepy** — Use behavioral insights to silently improve the experience. Don't announce what you've observed.

The patterns in this skill complement `skills/user-profiles/SKILL.md`. Use both together: profiles for what the user tells you, behavioral intelligence for what you learn by paying attention.