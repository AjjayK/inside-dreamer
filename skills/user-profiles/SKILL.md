---
name: user-profiles
description: Managing per-user profile data with Sidekick sync. Covers one-time initialization via sidekickWithSchema, database-as-source-of-truth pattern, and syncing updates back to Sidekick memory.
---

# User Profile Management

## Table of Contents
- [Overview](#overview)
- [When to Use Profiles](#when-to-use-profiles)
- [Implementation Pattern](#implementation-pattern)
  - [Define Schema](#define-schema)
  - [Initial Profile Population](#initial-profile-population)
  - [Profile Management Flow](#profile-management-flow)
  - [Sidekick Memory Sync](#sidekick-memory-sync)
- [UI Best Practices](#ui-best-practices)
- [Common Pitfalls](#common-pitfalls)
- [Key Takeaways](#key-takeaways)

## Overview

Some agents benefit from maintaining user profile data (e.g., favorite sports teams, family composition, personal interests, location preferences). This skill covers the complete pattern for:

- Initializing profiles from Sidekick's existing knowledge of the user
- Managing profile lifecycle (first use, editing, persistence)
- Keeping Sidekick memory synchronized with profile changes
- Building user-friendly profile UIs that avoid forcing users to fill out forms

**Key Principle:** Call Sidekick ONCE to initialize, store in database, and sync updates back to Sidekick when the user makes changes.

## When to Use Profiles

**✅ Use profile data when:**
- Your agent's functionality is highly personalized (sports teams, family members, interests)
- You need consistent context across multiple sessions
- The data is relatively stable (not changing every session)
- Users benefit from reviewing and editing this information

**❌ Don't use profiles when:**
- You just need one-time user input (use direct UI state)
- The data changes frequently (fetch fresh each time)
- It's simple preferences that fit better as settings
- You're just trying to avoid asking the user questions (sometimes asking is better!)

**Examples:**
- ✅ Sports app tracking favorite teams and leagues
- ✅ Family calendar agent tracking family members and their schedules
- ✅ News digest tracking topics of interest
- ❌ Todo app (no profile needed, just store todos)
- ❌ Simple timer app (no persistent user context needed)

## Implementation Pattern

### Define Schema

**1. Identify Required Fields**

Think carefully about what context you need to best meet user goals. Make all fields optional since Sidekick may have incomplete information.

```typescript
// src/schema.ts
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const userProfile = sqliteTable("user_profile", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  location: text("location"), // Optional - may not know
  interests: text("interests"), // JSON array stored as text
  familyMembers: text("family_members"), // JSON array stored as text
  favoriteTeams: text("favorite_teams"), // JSON array stored as text
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});
```

**Note:** Store multi-value fields as JSON-stringified text. Use `JSON.parse()` when reading and `JSON.stringify()` when writing.

### Initial Profile Population

**Create a server function that calls Sidekick ONCE to get initial suggestions:**

```typescript
// src/server.ts
import { serverFunction, type ServerSdk } from "@dev-agents/sdk-server";
import { Type } from "@dev-agents/sdk-shared";
import * as schema from "./schema";
import { userProfile } from "./schema";

export const initializeProfile = serverFunction({
  description: "Initialize user profile from Sidekick knowledge (call once only)",
  params: Type.Object({}),
  execute: async (sdk: ServerSdk) => {
    // Check if profile already exists
    const db = sdk.db<typeof schema>();
    const existing = await db.select().from(userProfile).limit(1);

    if (existing[0]) {
      return { profile: existing[0], alreadyInitialized: true };
    }

    // Ask Sidekick for initial profile data
    const sidekickData = await sdk.sidekickWithSchema(
      `What do you know about the user's profile for a sports news agent?
       I need: location (city), favorite sports teams, sports interests (leagues/sports they follow),
       and any family members if relevant for family-oriented sports activities.

       Return whatever you know - it's fine if some fields are unknown.`,
      Type.Object({
        location: Type.Optional(Type.String()),
        favoriteTeams: Type.Optional(Type.Array(Type.String())),
        sportsInterests: Type.Optional(Type.Array(Type.String())),
        familyMembers: Type.Optional(Type.Array(Type.Object({
          name: Type.String(),
          relationship: Type.Optional(Type.String())
        })))
      })
    );

    // Return Sidekick's suggestions directly — do NOT save to database.
    // The user should review and confirm before anything is persisted.
    return {
      profile: sidekickData,
      alreadyInitialized: false
    };
  },
});
```

**Use a mutation (not a query) to trigger initialization:**

Initialization is a one-time action that changes state — that's a mutation, not a query. Queries on this platform refetch on an interval (~10s by default), which means even `staleTime: Infinity` won't prevent repeated calls. A mutation only runs when you explicitly call `.mutate()`.

```typescript
// App.tsx — use a mutation for initialization, a query only for reading
const { data: profile, isLoading } = useQuery({
  queryKey: ["userProfile"],
  queryFn: () => call<typeof getUserProfile>("getUserProfile", {}),
});

const initMutation = useMutation({
  mutationFn: () => call<typeof initializeProfile>("initializeProfile", {}),
});

// Trigger initialization exactly once when we confirm no profile exists.
// initMutation.isIdle is true only before the first mutate() call.
useEffect(() => {
  if (!isLoading && !profile?.id && initMutation.isIdle) {
    initMutation.mutate();
  }
}, [isLoading, profile?.id, initMutation.isIdle]);

// initMutation.data contains Sidekick's suggestions for pre-filling the form.
// It is NOT saved to the database — only user-confirmed data gets persisted.
```

### Profile Management Flow

**First Use Flow:**

1. Check database for existing profile (`getUserProfile`)
2. If no profile exists → trigger `initializeProfile` mutation (fires once)
3. `initializeProfile` calls Sidekick and returns suggestions (does NOT save to database)
4. Pre-fill the setup form with `initMutation.data` (Sidekick's suggestions)
5. User reviews, edits, and submits the form
6. On submit → save to database AND sync to Sidekick (see Sidekick Memory Sync section)

**Subsequent Sessions:**

1. Load profile from database (NOT from Sidekick)
2. Go directly to main app experience
3. DO NOT call `initializeProfile` again - the profile already exists
4. **Use profile as the source of truth for user preferences** - don't redundantly call tools to re-fetch information already in the profile (e.g., don't call `get_location` if profile has the user's home city). However, tools are still appropriate when you need real-time or contextual data (e.g., current weather at user's location, live sports scores)

**Profile Updates via Settings:**

1. User opens settings
2. Pass existing profile data as prop to settings component
3. Pre-fill settings form with existing profile (NOT from Sidekick)
4. Do NOT call `initializeProfile` — the profile already exists in the database
5. When user saves → update database AND sync to Sidekick (see next section)

### Sidekick Memory Sync

**⚠️ CRITICAL PATTERN**: When users update their profile, you MUST sync changes to Sidekick's memory.

**Why?** Sidekick maintains a cross-agent understanding of the user. When your agent learns new information (user moves cities, adds family members, changes interests), Sidekick needs to know so it can help other agents and provide better context.

**Implementation:**

```typescript
// 1. Server function to save profile (regular serverFunction)
export const saveUserProfile = serverFunction({
  description: "Save user profile to database",
  params: Type.Object({
    location: Type.Optional(Type.String()),
    favoriteTeams: Type.Optional(Type.Array(Type.String())),
    // ... other fields
  }),
  execute: async (sdk: ServerSdk, profileData) => {
    const db = sdk.db<typeof schema>();

    const existing = await db.select().from(userProfile).limit(1);

    if (existing[0]) {
      await db.update(userProfile)
        .set({
          location: profileData.location,
          favoriteTeams: JSON.stringify(profileData.favoriteTeams || []),
          updatedAt: dayjs().tz(getUserTimeZone()).toDate()
        })
        .where(eq(userProfile.id, existing[0].id));
    } else {
      await db.insert(userProfile).values({
        location: profileData.location,
        favoriteTeams: JSON.stringify(profileData.favoriteTeams || []),
        createdAt: dayjs().tz(getUserTimeZone()).toDate(),
        updatedAt: dayjs().tz(getUserTimeZone()).toDate()
      });
    }

    return { success: true };
  },
});

// 2. Background function to sync to Sidekick (MUST be backgroundFunction)
export const syncProfileToSidekick = backgroundFunction({
  description: "Sync profile changes to Sidekick memory",
  params: Type.Object({
    location: Type.Optional(Type.String()),
    favoriteTeams: Type.Optional(Type.Array(Type.String())),
    // ... other fields
  }),
  execute: async (sdk: ServerSdk, profileData) => {
    const agentName = "Sports News Agent"; // Your agent's name

    await sdk.sidekickWithSchema(
      `The user just updated their profile for ${agentName} as follows: ${JSON.stringify(profileData)}.
       Make any necessary updates to your memory about the user's sports preferences, location, and interests.`,
      Type.Object({
        success: Type.Boolean({ description: "Whether the memory update was successful" }),
      })
    );

    console.log("Profile synced to Sidekick");
  },
});
```

**Why backgroundFunction?** Calling `sdk.sidekickWithSchema` takes 30+ seconds. Using `backgroundFunction` prevents UI freezing.

**Client-side pattern:**

```typescript
// In your settings/profile form component
const saveProfileMutation = useMutation({
  mutationFn: (profile) => call<typeof saveUserProfile>("saveUserProfile", profile),
  onSuccess: (_, profile) => {
    // Invalidate profile query to refetch
    queryClient.invalidateQueries({ queryKey: ["userProfile"] });

    // Trigger background sync to Sidekick (non-blocking)
    call<typeof syncProfileToSidekick>("syncProfileToSidekick", profile);

    // Show success message
    toast.success("Profile saved!");
  },
});
```

**When to sync:**
- ✅ User explicitly updates their profile via settings
- ✅ User completes initial profile setup
- ❌ Every time you read the profile (wasteful)
- ❌ On every app load (wasteful)

## UI Best Practices

### Avoid Empty Text Boxes

Users don't want to fill out forms. Instead:

**✅ Good Approaches:**
- Chip/tag selection for interests (show common options, allow custom)
- Dropdown menus for location (with autocomplete)
- Pre-populated suggestions from Sidekick data
- Progressive disclosure (show basic fields first, "Add more" button)
- Visual cards for complex objects (family members with add/remove buttons)

**❌ Avoid:**
- Empty text boxes with just labels
- Long forms requiring all fields
- No suggestions or defaults

**Example - Chip selection instead of empty text box:**

```typescript
// ❌ Bad: Empty text box
<input type="text" placeholder="Enter your interests" />

// ✅ Good: Chips with suggestions
const [interests, setInterests] = useState<string[]>(sidekickData?.interests || []);
const suggestions = ["Sports", "Technology", "Music", "Travel"];

<div>
  {suggestions.map(item => (
    <button
      key={item}
      onClick={() => setInterests([...interests, item])}
      className={interests.includes(item) ? "bg-primary" : "bg-secondary"}
    >
      {item}
    </button>
  ))}
  {interests.map(item => (
    <span key={item}>{item} <button onClick={() => remove(item)}>×</button></span>
  ))}
</div>
```

### Loading States

Since initializing from Sidekick takes time, show proper loading UI:

```typescript
if (initMutation.isPending) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <LoadingIcon />
      <p className="mt-4 text-muted-foreground">
        Getting your profile information...
      </p>
    </div>
  );
}
```

## Common Pitfalls

### ❌ Using initializeProfile as Your Profile Data Source

```typescript
// WRONG - Queries refetch automatically (every ~10s on this platform),
// so this calls Sidekick repeatedly. On subsequent sessions when a profile
// already exists in the database, it still calls Sidekick unnecessarily.
function App() {
  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: () => call<typeof initializeProfile>("initializeProfile", {}),
  });
}
```

**✅ Correct — read from DB, initialize via mutation only when needed:**
```typescript
function App() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => call<typeof getUserProfile>("getUserProfile", {}),
  });

  const initMutation = useMutation({
    mutationFn: () => call<typeof initializeProfile>("initializeProfile", {}),
  });

  useEffect(() => {
    if (!isLoading && !profile?.id && initMutation.isIdle) {
      initMutation.mutate();
    }
  }, [isLoading, profile?.id, initMutation.isIdle]);

  // Subsequent sessions: profile exists in DB → go straight to main app
  if (profile?.id) {
    return <MainApp profile={profile} />;
  }

  // First time: show setup form pre-filled with Sidekick suggestions
  if (initMutation.data) {
    return <ProfileSetup suggestions={initMutation.data} />;
  }

  if (initMutation.isPending) {
    return <LoadingScreen />;
  }

  return <ProfileSetup />;
}
```

### ❌ Calling initializeProfile When User Opens Settings

```typescript
// WRONG - User already has a profile, don't call Sidekick again!
function SettingsModal() {
  const { data } = useQuery({
    queryKey: ["initProfile"],
    queryFn: () => call<typeof initializeProfile>("initializeProfile", {}),
  });
}
```

**✅ Correct:**
```typescript
function SettingsModal() {
  const { data: existingProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => call<typeof getUserProfile>("getUserProfile", {}),
  });

  // Use existingProfile to pre-fill form
}
```

### ❌ Pre-filling Form Fields Directly in Render Without Guard

```typescript
// WRONG - Can cause infinite re-renders
function ProfileForm({ sidekickData }) {
  const [location, setLocation] = useState("");

  // This runs every render!
  if (sidekickData?.location) {
    setLocation(sidekickData.location); // setState in render = bad
  }
}
```

**✅ Correct - Option 1: Guard with flag**
```typescript
function ProfileForm({ sidekickData }) {
  const [location, setLocation] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  if (!isInitialized && sidekickData?.location) {
    setLocation(sidekickData.location);
    setIsInitialized(true);
  }
}
```

**✅ Correct - Option 2: Use useEffect**
```typescript
function ProfileForm({ sidekickData }) {
  const [location, setLocation] = useState("");

  useEffect(() => {
    if (sidekickData?.location) {
      setLocation(sidekickData.location);
    }
  }, [sidekickData]);
}
```

**✅ Correct - Option 3: Initialize state from props**
```typescript
function ProfileForm({ existingProfile, sidekickData }) {
  const initialData = existingProfile || sidekickData?.profile || {};
  const [location, setLocation] = useState(initialData.location || "");
  // State initialized once, no re-render issues
}
```

### ❌ Calling Location Tool When Profile Has Location

```typescript
// WRONG - Profile already has location!
export const getLocalNews = serverFunction({
  execute: async (sdk: ServerSdk) => {
    const location = await get_location(sdk, {});
    // ...
  },
});
```

**✅ Correct:**
```typescript
export const getLocalNews = serverFunction({
  execute: async (sdk: ServerSdk) => {
    const db = sdk.db<typeof schema>();
    const profile = await db.select().from(userProfile).limit(1);

    if (!profile[0]?.location) {
      throw new Error("User location not set in profile");
    }

    const location = profile[0].location;
    // Use location from profile - highest priority source!
  },
});
```

### ❌ Forgetting to Sync Profile Updates to Sidekick

```typescript
// WRONG - Profile updated but Sidekick doesn't know!
const saveMutation = useMutation({
  mutationFn: (profile) => call<typeof saveUserProfile>("saveUserProfile", profile),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    // Missing: sync to Sidekick!
  },
});
```

**✅ Correct:**
```typescript
const saveMutation = useMutation({
  mutationFn: (profile) => call<typeof saveUserProfile>("saveUserProfile", profile),
  onSuccess: (_, profile) => {
    queryClient.invalidateQueries({ queryKey: ["userProfile"] });

    // Sync to Sidekick (backgroundFunction, non-blocking)
    call<typeof syncProfileToSidekick>("syncProfileToSidekick", profile);
  },
});
```

## Key Takeaways

When implementing user profiles, remember:

1. **Call Sidekick once** - Use `initializeProfile` only on first setup
2. **Database is primary** - Load from DB on all subsequent sessions
3. **Use a mutation for initialization** - Never put `initializeProfile` in a `useQuery`; mutations only run when explicitly called, queries refetch on an interval
4. **Sync updates to Sidekick** - Use `backgroundFunction` to keep Sidekick's memory current
5. **Profile for preferences, tools for data** - Use profile for stable user preferences (home location, favorite teams), but call tools when you need real-time or contextual information (current weather, live scores, current location)
6. **Good UX** - Pre-fill forms, use chips/dropdowns, avoid empty text boxes

The patterns and examples throughout this skill show you exactly how to implement each piece correctly.
