import {
  backgroundFunction,
  EmailTriggerParamsSchema,
  type EmailTriggerParams,
  type ServerSdk,
  serverFunction,
} from "@dev-agents/sdk-server";
import { getUserTimeZone, Type } from "@dev-agents/sdk-shared";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { and, desc, eq, inArray, lte, isNotNull } from "drizzle-orm";
import Handlebars from "handlebars";

import { create_agent_post } from "../tools/posts";
import { headlines, searchNews } from "../tools/news";
import { crawlUrlMarkdown } from "../tools/webcrawl";
// Gemini removed — Perplexity is the sole supplemental search source
import { sonarSearch } from "../tools/perplexity";
import { getFlightStatus } from "../tools/flightaware";
import { exaWebSearch } from "../tools/exa";
import { listAccounts as calListAccounts, getEventsForDay } from "../tools/calendar";
// contacts and slack tools are not connected yet
// import { contactsListAccounts, searchContacts } from "../tools/contacts";
// import { listWorkspaces, listChannels, slackListMessages } from "../tools/slack";
import { listAccounts as listMailAccounts, searchMessages as searchMailMessages } from "../tools/mail";
import { create_sidekick_task, query_running_sidekick_tasks } from "../tools/sidekicktasks";

import parseWatchSource from "./prompts/parse-watch.handlebars";
import matchEmailSource from "./prompts/match-email-to-watches.handlebars";
import matchNewsSource from "./prompts/match-news-to-watch.handlebars";
import matchWebSource from "./prompts/match-web-to-watch.handlebars";
import learnDismissalSource from "./prompts/learn-from-dismissal.handlebars";
import generateQueriesSource from "./prompts/generate-search-queries.handlebars";
import profileSource from "./prompts/get-user-profile-sidekick.handlebars";
import digestSource from "./prompts/digest-summary.handlebars";
import enrichArticleSource from "./prompts/enrich-article.handlebars";
import combineReportSource from "./prompts/combine-watch-report.handlebars";
import checkExpirySource from "./prompts/check-watch-expiry.handlebars";
import checkExpiryBatchSource from "./prompts/check-watches-expiry-batch.handlebars";
import matchCalendarSource from "./prompts/match-calendar-to-watch.handlebars";
import matchFlightSource from "./prompts/match-flight-to-watch.handlebars";
import matchContactsSource from "./prompts/match-contacts-to-watch.handlebars";
import matchSlackSource from "./prompts/match-slack-to-watch.handlebars";
import extractPriceSource from "./prompts/extract-price.handlebars";
import personalizedExamplesSource from "./prompts/personalized-watch-examples.handlebars";
import checkWatchesTaskSource from "./prompts/check-watches-task.handlebars";

import type * as schema from "./schema";
import {
  alerts,
  dismissalPatterns,
  processedItems,
  staleProcessedItems,
  userProfile,
  watches,
} from "./schema";

dayjs.extend(utc);
dayjs.extend(timezone);

const parseWatchTemplate = Handlebars.compile(parseWatchSource);
const matchEmailTemplate = Handlebars.compile(matchEmailSource);
const matchNewsTemplate = Handlebars.compile(matchNewsSource);
const matchWebTemplate = Handlebars.compile(matchWebSource);
const learnDismissalTemplate = Handlebars.compile(learnDismissalSource);
const generateQueriesTemplate = Handlebars.compile(generateQueriesSource);
const profileTemplate = Handlebars.compile(profileSource);
const digestTemplate = Handlebars.compile(digestSource);
const enrichArticleTemplate = Handlebars.compile(enrichArticleSource);
const combineReportTemplate = Handlebars.compile(combineReportSource);
const checkExpiryTemplate = Handlebars.compile(checkExpirySource);
const checkExpiryBatchTemplate = Handlebars.compile(checkExpiryBatchSource);
const matchCalendarTemplate = Handlebars.compile(matchCalendarSource);
const matchFlightTemplate = Handlebars.compile(matchFlightSource);
const matchContactsTemplate = Handlebars.compile(matchContactsSource);
const matchSlackTemplate = Handlebars.compile(matchSlackSource);
const extractPriceTemplate = Handlebars.compile(extractPriceSource);
const personalizedExamplesTemplate = Handlebars.compile(personalizedExamplesSource);
const checkWatchesTaskTemplate = Handlebars.compile(checkWatchesTaskSource);

const MAX_CRAWL_CONTENT_LENGTH = 8000;
const MAX_ENRICHMENTS_PER_QUERY = 2;
const CRAWL_TIMEOUT_MS = 30_000; // 30 second timeout for crawling
const PER_WATCH_TIMEOUT_MS = 180_000; // 3 minute timeout per watch
const OVERALL_BUDGET_MS = 540_000; // 9 minute total budget for all watches
const WATCH_CONCURRENCY = 3; // Process up to 3 watches in parallel
const WATCH_CHECK_INTERVAL_MS = 2 * 60 * 60 * 1000; // 2 hours between checks per watch

/** Wraps a promise with a timeout — rejects if it takes too long */
function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms: ${label}`)), ms)
    ),
  ]);
}

// ─── USER PROFILE ──────────────────────────────────────────────

export const getUserProfile = serverFunction({
  description: "Get the current user's profile",
  params: Type.Object({}),
  exported: true,
  execute: async (sdk: ServerSdk) => {
    const db = sdk.db<typeof schema>();
    const owner = sdk.getUser().email;
    const results = await db.select().from(userProfile).where(eq(userProfile.owner, owner)).limit(1);
    console.log("getUserProfile: found", results.length, "profiles");
    return results[0] || null;
  },
});

export const initializeProfile = serverFunction({
  description: "Initialize user profile from Sidekick knowledge (call once)",
  params: Type.Object({}),
  execute: async (sdk: ServerSdk) => {
    const db = sdk.db<typeof schema>();
    const owner = sdk.getUser().email;
    const existing = await db.select().from(userProfile).where(eq(userProfile.owner, owner)).limit(1);

    if (existing[0]) {
      console.log("initializeProfile: profile already exists");
      return { profile: existing[0], alreadyInitialized: true };
    }

    console.log("initializeProfile: asking Sidekick for profile data");
    const sidekickData = await sdk.sidekickWithSchema(
      profileTemplate({}),
      Type.Object({
        location: Type.Optional(Type.String()),
        interests: Type.Optional(Type.Array(Type.String())),
      })
    );

    console.log("initializeProfile: got Sidekick data", JSON.stringify(sidekickData));
    return { profile: sidekickData, alreadyInitialized: false };
  },
});

export const saveProfile = serverFunction({
  description: "Save or update user profile",
  params: Type.Object({
    location: Type.Optional(Type.String()),
    interests: Type.Optional(Type.Array(Type.String())),
  }),
  exported: true,
  execute: async (sdk: ServerSdk, { location, interests }) => {
    const db = sdk.db<typeof schema>();
    const owner = sdk.getUser().email;
    const now = dayjs().tz(getUserTimeZone()).toDate();

    const existing = await db.select().from(userProfile).where(eq(userProfile.owner, owner)).limit(1);

    if (existing[0]) {
      await db.update(userProfile)
        .set({
          location: location || existing[0].location,
          interests: interests ? JSON.stringify(interests) : existing[0].interests,
          updatedAt: now,
        })
        .where(eq(userProfile.id, existing[0].id));
      console.log("saveProfile: updated profile");
    } else {
      await db.insert(userProfile).values({
        owner,
        location: location || null,
        interests: interests ? JSON.stringify(interests) : null,
        createdAt: now,
        updatedAt: now,
      });
      console.log("saveProfile: created profile");
    }

    return { success: true };
  },
});

export const syncProfileToSidekick = backgroundFunction({
  description: "Sync profile changes to Sidekick memory",
  params: Type.Object({
    location: Type.Optional(Type.String()),
    interests: Type.Optional(Type.Array(Type.String())),
  }),
  execute: async (sdk: ServerSdk, profileData) => {
    await sdk.sidekickWithSchema(
      `The user just updated their profile for the Radar monitoring agent: ${JSON.stringify(profileData)}. Update your memory about the user's interests and location.`,
      Type.Object({ success: Type.Boolean() })
    );
    console.log("syncProfileToSidekick: synced");
  },
});

// ─── WATCH MANAGEMENT ──────────────────────────────────────────

export const createWatch = serverFunction({
  description: "Create a new watch from natural language description",
  params: Type.Object({
    description: Type.String({ minLength: 1, description: "Natural language description of what to monitor" }),
    urgency: Type.Optional(Type.String({ description: "Legacy: 'instant' or 'digest'. Prefer checkInterval instead." })),
    checkInterval: Type.Optional(Type.Number({ description: "Minutes between checks: 15, 30, 60, 120, 240, 1440 (daily), 10080 (weekly)" })),
    preferredTime: Type.Optional(Type.String({ description: "HH:mm for daily/weekly watches (user's timezone)" })),
    preferredDay: Type.Optional(Type.String({ description: "Day of week for weekly watches: monday, tuesday, etc." })),
    webUrl: Type.Optional(Type.String({ description: "Optional URL to monitor" })),
    targetPrice: Type.Optional(Type.String({ description: "Target price threshold for price tracking" })),
    flightNumber: Type.Optional(Type.String({ description: "Flight number to track (e.g., UA123)" })),
    slackChannels: Type.Optional(Type.Array(Type.String(), { description: "Slack channel names to monitor" })),
    contactEmails: Type.Optional(Type.Array(Type.String(), { description: "Contact emails for relationship nudges" })),
    digestTime: Type.Optional(Type.String({ description: "Legacy: Preferred daily digest time in HH:mm format" })),
  }),
  exported: true,
  execute: async (sdk: ServerSdk, { description, urgency, checkInterval, preferredTime, preferredDay, webUrl, targetPrice, flightNumber, slackChannels, contactEmails, digestTime }) => {
    const db = sdk.db<typeof schema>();
    const owner = sdk.getUser().email;
    const now = dayjs().tz(getUserTimeZone()).toDate();

    // Get user profile for context
    const profile = await db.select().from(userProfile).where(eq(userProfile.owner, owner)).limit(1);
    const userLocation = profile[0]?.location || undefined;
    const userInterests = profile[0]?.interests || undefined;

    console.log("createWatch: parsing description:", description);

    const parsed = await sdk.callLLM(
      parseWatchTemplate({ description, userLocation, userInterests }),
      Type.Object({
        topics: Type.Array(Type.String()),
        sourceTypes: Type.Array(Type.String()),
        suggestedUrgency: Type.String(),
        suggestedCheckInterval: Type.Optional(Type.Number()),
        needsClarification: Type.Boolean(),
        clarifyingQuestions: Type.Optional(Type.Array(Type.String())),
        webUrl: Type.Optional(Type.String()),
        flightNumber: Type.Optional(Type.String()),
        targetPrice: Type.Optional(Type.String()),
        contactEmails: Type.Optional(Type.Array(Type.String())),
        slackChannels: Type.Optional(Type.Array(Type.String())),
      }),
      { modelVariant: "STANDARD" }
    );

    console.log("createWatch: parsed result", JSON.stringify(parsed));

    if (!parsed) {
      return { needsClarification: false, watch: null, error: "Failed to parse watch" };
    }

    if (parsed.needsClarification && parsed.clarifyingQuestions && parsed.clarifyingQuestions.length > 0) {
      return {
        needsClarification: true,
        clarifyingQuestions: parsed.clarifyingQuestions,
        parsedTopics: parsed.topics,
        suggestedUrgency: parsed.suggestedUrgency,
        suggestedCheckInterval: parsed.suggestedCheckInterval,
        sourceTypes: parsed.sourceTypes,
      };
    }

    const finalUrl = webUrl || parsed.webUrl || null;
    const finalSourceTypes = parsed.sourceTypes;
    if (finalUrl && !finalSourceTypes.includes("web")) {
      finalSourceTypes.push("web");
    }

    // Resolve extra fields from explicit params or LLM-parsed values
    const finalFlightNumber = flightNumber || parsed.flightNumber || null;
    const finalTargetPrice = targetPrice || parsed.targetPrice || null;
    const finalContactEmails = contactEmails || parsed.contactEmails || null;
    const finalSlackChannels = slackChannels || parsed.slackChannels || null;

    // Auto-add source types based on resolved fields
    if (finalFlightNumber && !finalSourceTypes.includes("flight")) {
      finalSourceTypes.push("flight");
    }
    if (finalContactEmails && finalContactEmails.length > 0 && !finalSourceTypes.includes("contacts")) {
      finalSourceTypes.push("contacts");
    }

    // Determine check interval: explicit param > LLM suggestion > derive from urgency > default 120
    const finalCheckInterval = checkInterval
      || parsed.suggestedCheckInterval
      || (urgency === "digest" || parsed.suggestedUrgency === "digest" ? 1440 : 120);
    // Derive urgency for backward compatibility
    const finalUrgency = finalCheckInterval >= 1440 ? "digest" : "instant";

    const inserted = await db.insert(watches).values({
      owner,
      description,
      parsedTopics: JSON.stringify(parsed.topics),
      sourceTypes: JSON.stringify(finalSourceTypes),
      urgency: finalUrgency,
      checkInterval: finalCheckInterval,
      preferredTime: preferredTime || (finalCheckInterval >= 1440 ? (digestTime || "08:00") : null),
      preferredDay: preferredDay || null,
      status: "active",
      webUrl: finalUrl,
      targetPrice: finalTargetPrice,
      flightNumber: finalFlightNumber,
      slackChannels: finalSlackChannels ? JSON.stringify(finalSlackChannels) : null,
      contactEmails: finalContactEmails ? JSON.stringify(finalContactEmails) : null,
      digestTime: digestTime || null,
      createdAt: now,
      updatedAt: now,
    }).returning();

    console.log("createWatch: created watch", inserted[0]?.id);

    return {
      needsClarification: false,
      watch: inserted[0],
    };
  },
});

export const getWatches = serverFunction({
  description: "Get all watches for the current user",
  params: Type.Object({}),
  exported: true,
  execute: async (sdk: ServerSdk) => {
    const db = sdk.db<typeof schema>();
    const owner = sdk.getUser().email;
    const results = await db.select().from(watches)
      .where(eq(watches.owner, owner))
      .orderBy(desc(watches.createdAt));
    console.log("getWatches: returning", results.length, "watches");
    return results;
  },
});

export const getPersonalizedExamples = serverFunction({
  description: "Get personalized watch examples based on Sidekick's knowledge of the user",
  params: Type.Object({}),
  execute: async (sdk: ServerSdk) => {
    const db = sdk.db<typeof schema>();
    const owner = sdk.getUser().email;

    // Get existing watches so we don't suggest duplicates
    const existingWatches = await db.select({ description: watches.description })
      .from(watches)
      .where(eq(watches.owner, owner));

    try {
      const result = await sdk.sidekickWithSchema(
        personalizedExamplesTemplate({
          existingWatches: existingWatches.length > 0
            ? existingWatches.map(w => w.description)
            : null,
        }),
        Type.Object({
          suggestions: Type.Array(Type.String(), { minItems: 1, maxItems: 3 }),
        })
      );

      console.log("getPersonalizedExamples: got", result?.suggestions?.length || 0, "suggestions");
      return { suggestions: result?.suggestions || [] };
    } catch (error) {
      console.error("getPersonalizedExamples: failed", error);
      return { suggestions: [] };
    }
  },
});

export const updateWatch = serverFunction({
  description: "Update a watch's settings",
  params: Type.Object({
    id: Type.Number({ description: "Watch ID" }),
    urgency: Type.Optional(Type.String()),
    checkInterval: Type.Optional(Type.Number({ description: "Minutes between checks: 15, 30, 60, 120, 240, 1440, 10080" })),
    preferredTime: Type.Optional(Type.String({ description: "HH:mm for daily/weekly watches" })),
    preferredDay: Type.Optional(Type.String({ description: "Day of week for weekly watches" })),
    status: Type.Optional(Type.String()),
    description: Type.Optional(Type.String()),
    webUrl: Type.Optional(Type.String()),
    snoozeUntil: Type.Optional(Type.String({ description: "ISO date string for snooze end, or null to clear" })),
    targetPrice: Type.Optional(Type.String({ description: "Target price threshold for price tracking" })),
    flightNumber: Type.Optional(Type.String({ description: "Flight number to track (e.g., UA123)" })),
    slackChannels: Type.Optional(Type.Array(Type.String(), { description: "Slack channel names to monitor" })),
    contactEmails: Type.Optional(Type.Array(Type.String(), { description: "Contact emails for relationship nudges" })),
    digestTime: Type.Optional(Type.String({ description: "Legacy: Preferred daily digest time in HH:mm format" })),
  }),
  exported: true,
  execute: async (sdk: ServerSdk, { id, urgency, checkInterval, preferredTime, preferredDay, status, description, webUrl, snoozeUntil, targetPrice, flightNumber, slackChannels, contactEmails, digestTime }) => {
    const db = sdk.db<typeof schema>();
    const owner = sdk.getUser().email;
    const now = dayjs().tz(getUserTimeZone()).toDate();

    const existing = await db.select().from(watches)
      .where(and(eq(watches.id, id), eq(watches.owner, owner)))
      .limit(1);

    if (!existing[0]) {
      return { success: false, error: "Watch not found" };
    }

    const updates: Record<string, unknown> = { updatedAt: now };
    if (checkInterval !== undefined) {
      updates.checkInterval = checkInterval;
      // Derive urgency for backward compatibility
      updates.urgency = checkInterval >= 1440 ? "digest" : "instant";
    } else if (urgency) {
      updates.urgency = urgency;
    }
    if (preferredTime !== undefined) updates.preferredTime = preferredTime || null;
    if (preferredDay !== undefined) updates.preferredDay = preferredDay || null;
    if (status) updates.status = status;
    if (webUrl !== undefined) updates.webUrl = webUrl || null;
    if (targetPrice !== undefined) updates.targetPrice = targetPrice || null;
    if (flightNumber !== undefined) updates.flightNumber = flightNumber || null;
    if (slackChannels !== undefined) updates.slackChannels = slackChannels.length > 0 ? JSON.stringify(slackChannels) : null;
    if (contactEmails !== undefined) updates.contactEmails = contactEmails.length > 0 ? JSON.stringify(contactEmails) : null;
    if (digestTime !== undefined) updates.digestTime = digestTime || null;

    // Handle snooze
    if (snoozeUntil === "null" || snoozeUntil === "") {
      updates.snoozeUntil = null;
      // If clearing snooze, also resume watch
      if (!status) updates.status = "active";
    } else if (snoozeUntil) {
      updates.snoozeUntil = dayjs(snoozeUntil).tz(getUserTimeZone()).toDate();
      updates.status = "paused";
    }

    // If description changed, re-parse topics
    if (description && description !== existing[0].description) {
      updates.description = description;

      // Get user profile for context
      const profile = await db.select().from(userProfile).where(eq(userProfile.owner, owner)).limit(1);
      const userLocation = profile[0]?.location || undefined;
      const userInterests = profile[0]?.interests || undefined;

      try {
        const parsed = await sdk.callLLM(
          parseWatchTemplate({ description, userLocation, userInterests }),
          Type.Object({
            topics: Type.Array(Type.String()),
            sourceTypes: Type.Array(Type.String()),
            suggestedUrgency: Type.String(),
            needsClarification: Type.Boolean(),
            clarifyingQuestions: Type.Optional(Type.Array(Type.String())),
            webUrl: Type.Optional(Type.String()),
          }),
          { modelVariant: "STANDARD" }
        );

        if (parsed) {
          updates.parsedTopics = JSON.stringify(parsed.topics);
          updates.sourceTypes = JSON.stringify(parsed.sourceTypes);
          if (!urgency) updates.urgency = parsed.suggestedUrgency;
          if (parsed.webUrl && !webUrl) updates.webUrl = parsed.webUrl;
        }
      } catch (error) {
        console.error("updateWatch: failed to re-parse description", error);
        // Keep old topics if re-parse fails
      }
    }

    await db.update(watches).set(updates).where(eq(watches.id, id));
    console.log("updateWatch: updated watch", id, "fields:", Object.keys(updates).join(", "));
    return { success: true };
  },
});

export const deleteWatch = serverFunction({
  description: "Delete a watch",
  params: Type.Object({
    id: Type.Number({ description: "Watch ID" }),
  }),
  exported: true,
  execute: async (sdk: ServerSdk, { id }) => {
    const db = sdk.db<typeof schema>();
    const owner = sdk.getUser().email;

    await db.delete(watches).where(and(eq(watches.id, id), eq(watches.owner, owner)));
    await db.delete(alerts).where(and(eq(alerts.watchId, id), eq(alerts.owner, owner)));
    await db.delete(dismissalPatterns).where(and(eq(dismissalPatterns.watchId, id), eq(dismissalPatterns.owner, owner)));
    // Archive processedItems to stale table before deleting
    const itemsToArchive = await db.select().from(processedItems)
      .where(and(eq(processedItems.watchId, id), eq(processedItems.owner, owner)));
    if (itemsToArchive.length > 0) {
      await db.insert(staleProcessedItems).values(itemsToArchive.map(item => ({
        owner: item.owner,
        uniqueId: item.uniqueId,
        sourceType: item.sourceType,
        watchId: item.watchId,
        processedAt: item.processedAt,
      })));
      await db.delete(processedItems).where(and(eq(processedItems.watchId, id), eq(processedItems.owner, owner)));
    }
    console.log("deleteWatch: deleted watch", id, "and related data");
    return { success: true };
  },
});

// ─── ALERT MANAGEMENT ──────────────────────────────────────────

export const getAlerts = serverFunction({
  description: "Get alerts for the current user",
  params: Type.Object({
    watchId: Type.Optional(Type.Number({ description: "Filter by watch ID" })),
    includeRead: Type.Optional(Type.Boolean({ description: "Include read alerts" })),
    limit: Type.Optional(Type.Number({ description: "Max alerts to return" })),
  }),
  exported: true,
  execute: async (sdk: ServerSdk, { watchId, includeRead, limit }) => {
    const db = sdk.db<typeof schema>();
    const owner = sdk.getUser().email;

    const conditions = [eq(alerts.owner, owner), eq(alerts.dismissed, false)];
    if (watchId) conditions.push(eq(alerts.watchId, watchId));
    if (!includeRead) conditions.push(eq(alerts.read, false));

    const results = await db.select().from(alerts)
      .where(and(...conditions))
      .orderBy(desc(alerts.createdAt))
      .limit(limit || 50);

    console.log("getAlerts: returning", results.length, "alerts");
    return results;
  },
});

export const getAlertCounts = serverFunction({
  description: "Get count of unread alerts, both total and per watch",
  params: Type.Object({}),
  exported: true,
  execute: async (sdk: ServerSdk) => {
    const db = sdk.db<typeof schema>();
    const owner = sdk.getUser().email;

    const unread = await db.select({ watchId: alerts.watchId }).from(alerts)
      .where(and(eq(alerts.owner, owner), eq(alerts.dismissed, false), eq(alerts.read, false)));

    // Build per-watch counts
    const perWatch: Record<number, number> = {};
    for (const a of unread) {
      perWatch[a.watchId] = (perWatch[a.watchId] || 0) + 1;
    }

    return { unreadCount: unread.length, perWatch };
  },
});

export const markAlertRead = serverFunction({
  description: "Mark an alert as read",
  params: Type.Object({
    id: Type.Number({ description: "Alert ID" }),
  }),
  exported: true,
  execute: async (sdk: ServerSdk, { id }) => {
    const db = sdk.db<typeof schema>();
    const owner = sdk.getUser().email;

    await db.update(alerts)
      .set({ read: true })
      .where(and(eq(alerts.id, id), eq(alerts.owner, owner)));

    console.log("markAlertRead: marked alert", id, "as read");
    return { success: true };
  },
});

export const dismissAlert = serverFunction({
  description: "Dismiss an alert and optionally learn from it",
  params: Type.Object({
    id: Type.Number({ description: "Alert ID" }),
    feedback: Type.Optional(Type.String({ description: "Why the alert was irrelevant" })),
  }),
  exported: true,
  execute: async (sdk: ServerSdk, { id, feedback }) => {
    const db = sdk.db<typeof schema>();
    const owner = sdk.getUser().email;

    const alertResults = await db.select().from(alerts)
      .where(and(eq(alerts.id, id), eq(alerts.owner, owner)))
      .limit(1);

    if (!alertResults[0]) {
      return { success: false, error: "Alert not found" };
    }

    const alert = alertResults[0];

    await db.update(alerts)
      .set({ dismissed: true, dismissFeedback: feedback || null })
      .where(eq(alerts.id, id));

    // Learn from dismissal
    const watchResults = await db.select().from(watches)
      .where(eq(watches.id, alert.watchId))
      .limit(1);

    if (watchResults[0]) {
      const existingDismissals = await db.select().from(dismissalPatterns)
        .where(and(eq(dismissalPatterns.watchId, alert.watchId), eq(dismissalPatterns.owner, owner)));

      try {
        const learned = await sdk.callLLM(
          learnDismissalTemplate({
            watchDescription: watchResults[0].description,
            alertTitle: alert.title,
            alertSnippet: alert.snippet,
            alertSource: alert.sourceName,
            feedback,
            existingPatterns: existingDismissals.map(d => d.pattern),
          }),
          Type.Object({
            pattern: Type.String(),
          }),
          { modelVariant: "FAST" }
        );

        if (learned) {
          await db.insert(dismissalPatterns).values({
            owner,
            watchId: alert.watchId,
            pattern: learned.pattern,
            createdAt: dayjs().tz(getUserTimeZone()).toDate(),
          });

          console.log("dismissAlert: learned pattern:", learned.pattern);
        }
      } catch (error) {
        console.error("dismissAlert: failed to learn from dismissal", error);
      }
    }

    return { success: true };
  },
});

export const markAllAlertsRead = serverFunction({
  description: "Mark all alerts as read for a watch (or all watches)",
  params: Type.Object({
    watchId: Type.Optional(Type.Number({ description: "Specific watch ID, or omit for all" })),
  }),
  exported: true,
  execute: async (sdk: ServerSdk, { watchId }) => {
    const db = sdk.db<typeof schema>();
    const owner = sdk.getUser().email;

    const conditions = [eq(alerts.owner, owner), eq(alerts.dismissed, false), eq(alerts.read, false)];
    if (watchId) conditions.push(eq(alerts.watchId, watchId));

    const unread = await db.select({ id: alerts.id }).from(alerts)
      .where(and(...conditions));

    for (const a of unread) {
      await db.update(alerts).set({ read: true }).where(eq(alerts.id, a.id));
    }

    console.log("markAllAlertsRead: marked", unread.length, "alerts as read", watchId ? `for watch ${watchId}` : "for all watches");
    return { success: true, count: unread.length };
  },
});

export const dismissAllAlerts = serverFunction({
  description: "Dismiss all alerts for a watch",
  params: Type.Object({
    watchId: Type.Number({ description: "Watch ID" }),
  }),
  exported: true,
  execute: async (sdk: ServerSdk, { watchId }) => {
    const db = sdk.db<typeof schema>();
    const owner = sdk.getUser().email;

    const toDismiss = await db.select({ id: alerts.id }).from(alerts)
      .where(and(eq(alerts.owner, owner), eq(alerts.watchId, watchId), eq(alerts.dismissed, false)));

    for (const a of toDismiss) {
      await db.update(alerts).set({ dismissed: true }).where(eq(alerts.id, a.id));
    }

    console.log("dismissAllAlerts: dismissed", toDismiss.length, "alerts for watch", watchId);
    return { success: true, count: toDismiss.length };
  },
});

// ─── SIDEKICK TASK HELPER FUNCTIONS (callable mid-execution) ────

export const checkProcessedUrls = serverFunction({
  description: "Check which URLs have already been processed for a watch. Returns new (not yet processed) and already-processed URLs. Call this after searching to filter out already-seen articles before crawling.",
  params: Type.Object({
    watchId: Type.Number({ description: "The watch ID to check against" }),
    urls: Type.Array(Type.String(), { description: "URLs from search results to check" }),
  }),
  exported: true,
  execute: async (sdk: ServerSdk, { watchId, urls }) => {
    const db = sdk.db<typeof schema>();
    const owner = sdk.getUser().email;

    if (urls.length === 0) {
      return { newUrls: [], alreadyProcessedUrls: [] };
    }

    const [processed, staleProcessed] = await Promise.all([
      db.select({ uniqueId: processedItems.uniqueId })
        .from(processedItems)
        .where(and(
          eq(processedItems.owner, owner),
          eq(processedItems.watchId, watchId),
          inArray(processedItems.uniqueId, urls),
        )),
      db.select({ uniqueId: staleProcessedItems.uniqueId })
        .from(staleProcessedItems)
        .where(and(
          eq(staleProcessedItems.owner, owner),
          inArray(staleProcessedItems.uniqueId, urls),
        )),
    ]);

    const processedSet = new Set([
      ...processed.map(p => p.uniqueId),
      ...staleProcessed.map(p => p.uniqueId),
    ]);

    const newUrls = urls.filter(url => !processedSet.has(url));
    const alreadyProcessedUrls = urls.filter(url => processedSet.has(url));

    console.log("checkProcessedUrls: watch", watchId, "checked", urls.length, "URLs,", newUrls.length, "new,", alreadyProcessedUrls.length, "already processed");

    return { newUrls, alreadyProcessedUrls };
  },
});

export const markUrlsProcessed = serverFunction({
  description: "Mark URLs as processed for a watch so they won't be re-checked in future runs. Call this after filtering out non-matching articles (Step 5) and after crawling matched articles (Step 9).",
  params: Type.Object({
    watchId: Type.Number({ description: "The watch ID" }),
    urls: Type.Array(Type.String(), { description: "URLs to mark as processed" }),
  }),
  exported: true,
  execute: async (sdk: ServerSdk, { watchId, urls }) => {
    const db = sdk.db<typeof schema>();
    const owner = sdk.getUser().email;
    const now = dayjs().tz(getUserTimeZone()).toDate();

    let marked = 0;
    for (const url of urls) {
      try {
        await db.insert(processedItems).values({
          owner,
          uniqueId: url,
          sourceType: "news",
          watchId,
          processedAt: now,
        });
        marked++;
      } catch {
        // Unique constraint — already processed, skip
      }
    }

    console.log("markUrlsProcessed: watch", watchId, "marked", marked, "of", urls.length, "URLs as processed");
    return { marked };
  },
});

export const getDismissalPatterns = serverFunction({
  description: "Get dismissal patterns for a watch. These are patterns learned from the user's previous alert dismissals — content matching these patterns should be filtered out as irrelevant.",
  params: Type.Object({
    watchId: Type.Number({ description: "The watch ID" }),
  }),
  exported: true,
  execute: async (sdk: ServerSdk, { watchId }) => {
    const db = sdk.db<typeof schema>();
    const owner = sdk.getUser().email;

    const patterns = await db.select().from(dismissalPatterns)
      .where(and(
        eq(dismissalPatterns.owner, owner),
        eq(dismissalPatterns.watchId, watchId),
      ));

    console.log("getDismissalPatterns: watch", watchId, "returning", patterns.length, "patterns");
    return { patterns: patterns.map(p => p.pattern) };
  },
});

export const getPastReports = serverFunction({
  description: "Get recent reports with full content for a watch. Use during the synthesis step to compare new articles against past reports and produce only incremental updates — never repeat information already reported.",
  params: Type.Object({
    watchId: Type.Number({ description: "The watch ID" }),
    limit: Type.Optional(Type.Number({ description: "Max number of reports to return. Defaults to 5." })),
  }),
  exported: true,
  execute: async (sdk: ServerSdk, { watchId, limit }) => {
    const db = sdk.db<typeof schema>();
    const owner = sdk.getUser().email;
    const maxReports = limit || 5;

    const recentAlerts = await db.select().from(alerts)
      .where(and(
        eq(alerts.watchId, watchId),
        eq(alerts.owner, owner),
        eq(alerts.dismissed, false),
        isNotNull(alerts.fullContent),
      ))
      .orderBy(desc(alerts.createdAt))
      .limit(maxReports);

    const reports = recentAlerts.map(a => ({
      title: a.title,
      fullContent: a.fullContent!.substring(0, 2000),
      sourceUrl: a.sourceUrl,
      sourceName: a.sourceName,
      createdAt: dayjs(a.createdAt).tz(getUserTimeZone()).format("YYYY-MM-DD HH:mm"),
    }));

    console.log("getPastReports: watch", watchId, "returning", reports.length, "reports");
    return { reports };
  },
});

// ─── MONITORING: EMAIL ──────────────────────────────────────────

export const handleIncomingEmail = backgroundFunction({
  description: "Process incoming emails and match against active watches",
  params: EmailTriggerParamsSchema,
  exported: true,
  execute: async (sdk: ServerSdk, params: EmailTriggerParams) => {
    const db = sdk.db<typeof schema>();
    const owner = sdk.getUser().email;
    const now = dayjs().tz(getUserTimeZone()).toDate();

    // Get active watches that monitor email
    const activeWatches = await db.select().from(watches)
      .where(and(eq(watches.owner, owner), eq(watches.status, "active")));

    const emailWatches = activeWatches.filter(w => {
      const sources: string[] = JSON.parse(w.sourceTypes);
      return sources.includes("email");
    });

    if (emailWatches.length === 0) {
      console.log("handleIncomingEmail: no email watches active, skipping");
      return;
    }

    // Get dismissal patterns for context
    const watchIds = emailWatches.map(w => w.id);
    const patterns = await db.select().from(dismissalPatterns)
      .where(and(eq(dismissalPatterns.owner, owner), inArray(dismissalPatterns.watchId, watchIds)));

    for (const email of params.messages) {
      try {
        // Deduplicate
        const existing = await db.select().from(processedItems)
          .where(and(eq(processedItems.owner, owner), eq(processedItems.uniqueId, email.messageId)))
          .limit(1);

        if (existing.length > 0) {
          console.log("handleIncomingEmail: already processed", email.messageId);
          continue;
        }

        console.log("handleIncomingEmail: processing email from", email.from, "subject:", email.subject);

        const result = await sdk.callLLM(
          matchEmailTemplate({
            from: email.from,
            subject: email.subject,
            body: email.body || "(no body available)",
            watches: emailWatches.map(w => ({
              id: w.id,
              description: w.description,
              parsedTopics: w.parsedTopics,
            })),
            dismissalPatterns: patterns.length > 0
              ? patterns.map(p => ({ watchId: p.watchId, pattern: p.pattern }))
              : null,
          }),
          Type.Object({
            matches: Type.Array(Type.Object({
              watchId: Type.Number(),
              title: Type.String(),
              snippet: Type.String(),
              explanation: Type.String(),
              confidence: Type.Optional(Type.String()),
              fullContent: Type.Optional(Type.String()),
            })),
          }),
          { modelVariant: "STANDARD" }
        );

        // Record as processed (watchId set to null — email is checked against all watches)
        await db.insert(processedItems).values({
          owner,
          uniqueId: email.messageId,
          sourceType: "email",
          watchId: null,
          processedAt: now,
        });

        if (!result) {
          console.log("handleIncomingEmail: LLM returned null for email", email.messageId);
          continue;
        }

        // Create alerts for matches
        for (const match of result.matches) {
          const watchExists = emailWatches.find(w => w.id === match.watchId);
          if (!watchExists) continue;

          await db.insert(alerts).values({
            owner,
            watchId: match.watchId,
            sourceType: "email",
            title: match.title,
            snippet: match.snippet,
            explanation: match.explanation,
            confidence: match.confidence || "medium",
            sourceName: email.from,
            fullContent: match.fullContent || null,
            dismissed: false,
            read: false,
            createdAt: now,
          });

          console.log("handleIncomingEmail: created alert for watch", match.watchId, `(confidence: ${match.confidence || "medium"})`);

          // Instant notification for urgent watches
          if (watchExists.urgency === "instant") {
            try {
              await create_agent_post(sdk, {
                shortMessage: match.title,
                attachments: [{ type: "markdown", content: match.fullContent || `**${match.title}**\n\n${match.snippet}\n\n*Why:* ${match.explanation}\n\n*From:* ${email.from}` }],
                duration: "read_once",
                priority: "urgent",
              });
            } catch (err) {
              console.error("handleIncomingEmail: failed to create post", err);
            }
          }
        }
      } catch (error) {
        console.error("handleIncomingEmail: failed to process email", email.messageId, error);
        continue;
      }
    }
  },
});

// ─── MONITORING: NEWS & WEB (CRON) ─────────────────────────────

/** Shared type for matched articles returned by news/perplexity checks */
interface MatchedArticle {
  title: string;
  snippet: string;
  explanation: string;
  confidence: string;
  url: string;
  source: string;
  enrichedContent: string | null;
}

interface NewsCheckResult {
  matchedArticles: MatchedArticle[];
  /** URLs of matched articles — only mark as processed after alert creation succeeds */
  pendingProcessedUrls: string[];
}

async function checkNewsForWatch(
  sdk: ServerSdk,
  db: ReturnType<ServerSdk["db"]>,
  watch: typeof watches.$inferSelect,
  owner: string,
  now: Date
): Promise<NewsCheckResult> {
  const topics: string[] = JSON.parse(watch.parsedTopics);
  if (topics.length === 0) return { matchedArticles: [], pendingProcessedUrls: [] };

  // Get dismissal patterns and recent alerts for semantic dedup
  const [patterns, recentAlertsList] = await Promise.all([
    db.select().from(dismissalPatterns)
      .where(and(eq(dismissalPatterns.owner, owner), eq(dismissalPatterns.watchId, watch.id))),
    db.select().from(alerts)
      .where(and(eq(alerts.watchId, watch.id), eq(alerts.owner, owner)))
      .orderBy(desc(alerts.createdAt))
      .limit(10),
  ]);

  const recentAlertsForPrompt = recentAlertsList.length > 0
    ? recentAlertsList.map(a => ({
      title: a.title,
      snippet: a.snippet,
      createdAt: dayjs(a.createdAt).tz(getUserTimeZone()).format("YYYY-MM-DD HH:mm"),
    }))
    : null;

  // Generate search queries
  let queries: string[];
  try {
    const queryResult = await sdk.callLLM(
      generateQueriesTemplate({
        watchDescription: watch.description,
        watchTopics: JSON.stringify(topics),
      }),
      Type.Object({
        queries: Type.Array(Type.String()),
      }),
      { modelVariant: "FAST" }
    );
    queries = queryResult ? queryResult.queries.slice(0, 2) : topics.slice(0, 2);
  } catch (error) {
    console.error("checkNewsForWatch: failed to generate queries for watch", watch.id, error);
    queries = topics.slice(0, 2);
  }

  // Collect ALL matched articles across all queries before creating a single alert
  const allMatchedArticles: Array<{
    title: string;
    snippet: string;
    explanation: string;
    confidence: string;
    url: string;
    source: string;
    enrichedContent: string | null;
  }> = [];
  const pendingUrls: string[] = []; // matched article URLs — deferred until alert creation

  for (const query of queries) {
    try {
      const newsResult = await headlines(sdk, { topic: query });

      if (!newsResult.success || !newsResult.headlines || newsResult.headlines.length === 0) {
        console.log("checkNewsForWatch: no headlines for query:", query);
        continue;
      }

      // Filter out already-processed articles
      const newArticles = [];
      for (const article of newsResult.headlines) {
        const existing = await db.select().from(processedItems)
          .where(and(eq(processedItems.owner, owner), eq(processedItems.uniqueId, article.url), eq(processedItems.watchId, watch.id)))
          .limit(1);
        if (existing.length === 0) {
          newArticles.push(article);
        }
      }

      if (newArticles.length === 0) {
        console.log("checkNewsForWatch: all articles already processed for query:", query);
        continue;
      }

      // Check relevance — add recency hint when many articles
      const matchResult = await sdk.callLLM(
        matchNewsTemplate({
          watchDescription: watch.description,
          watchTopics: JSON.stringify(topics),
          dismissalPatterns: patterns.length > 0 ? JSON.stringify(patterns.map(p => p.pattern)) : null,
          recentAlerts: recentAlertsForPrompt,
          lastCheckedAt: newArticles.length > 30 && watch.lastCheckedAt
            ? dayjs(watch.lastCheckedAt).tz(getUserTimeZone()).format("YYYY-MM-DD HH:mm")
            : null,
          articles: newArticles.map(a => ({
            title: a.title,
            source: a.source || "Unknown",
            description: a.description || a.summary || "",
            url: a.url,
          })),
        }),
        Type.Object({
          matches: Type.Array(Type.Object({
            articleIndex: Type.Number(),
            title: Type.String(),
            snippet: Type.String(),
            explanation: Type.String(),
            confidence: Type.Optional(Type.String()),
          })),
        }),
        { modelVariant: "FAST" }
      );

      // Determine which articles matched
      const matchedIndices = new Set(
        (matchResult?.matches || []).map(m => m.articleIndex)
      );

      // Mark NON-matched articles as processed immediately (won't re-check them)
      for (let i = 0; i < newArticles.length; i++) {
        if (matchedIndices.has(i)) continue; // defer matched articles
        const article = newArticles[i];
        if (!article) continue;
        try {
          await db.insert(processedItems).values({
            owner,
            uniqueId: article.url,
            sourceType: "news",
            watchId: watch.id,
            processedAt: now,
          });
        } catch {
          // Unique constraint — already processed
        }
      }

      if (!matchResult || matchResult.matches.length === 0) {
        console.log("checkNewsForWatch: no matches for query:", query);
        continue;
      }

      // Enrich matched articles (crawl for full content) and collect them
      let enrichmentCount = 0;
      for (const match of matchResult.matches) {
        const article = newArticles[match.articleIndex];
        if (!article) continue;

        let enrichedContent: string | null = null;
        if (enrichmentCount < MAX_ENRICHMENTS_PER_QUERY && article.url) {
          try {
            console.log("checkNewsForWatch: crawling article for enrichment:", article.url);
            const crawlResult = await withTimeout(
              crawlUrlMarkdown(sdk, { url: article.url }),
              CRAWL_TIMEOUT_MS,
              `crawl ${article.url}`
            );

            if (crawlResult.success && crawlResult.markdown) {
              const truncatedContent = crawlResult.markdown.substring(0, MAX_CRAWL_CONTENT_LENGTH);

              const enrichResult = await sdk.callLLM(
                enrichArticleTemplate({
                  watchDescription: watch.description,
                  articleTitle: article.title,
                  articleSource: article.source || "Unknown",
                  articleUrl: article.url,
                  articleContent: truncatedContent,
                }),
                Type.Object({
                  report: Type.String(),
                }),
                { modelVariant: "STANDARD" }
              );

              if (enrichResult) {
                enrichedContent = enrichResult.report;
                console.log("checkNewsForWatch: enriched article successfully");
              }
            }
            enrichmentCount++;
          } catch (err) {
            console.error("checkNewsForWatch: failed to enrich article, using snippet fallback", err);
          }
        }

        allMatchedArticles.push({
          title: match.title,
          snippet: match.snippet,
          explanation: match.explanation,
          confidence: match.confidence || "medium",
          url: article.url,
          source: article.source || "News",
          enrichedContent,
        });
        pendingUrls.push(article.url);
      }
    } catch (error) {
      console.error("checkNewsForWatch: error checking news for query:", query, error);
      continue;
    }
  }

  // Return matched articles — alert creation happens in createCombinedNewsAlert
  if (allMatchedArticles.length === 0) {
    console.log("checkNewsForWatch: no matches found across all queries for watch", watch.id);
    return { matchedArticles: [], pendingProcessedUrls: [] };
  }

  console.log("checkNewsForWatch: found", allMatchedArticles.length, "matched articles for watch", watch.id);
  return { matchedArticles: allMatchedArticles, pendingProcessedUrls: pendingUrls };
}

async function checkWebForWatch(
  sdk: ServerSdk,
  db: ReturnType<ServerSdk["db"]>,
  watch: typeof watches.$inferSelect,
  owner: string,
  now: Date
) {
  if (!watch.webUrl) return;

  const topics: string[] = JSON.parse(watch.parsedTopics);

  // Check if this URL was already processed for this watch — skip re-crawl
  const webUniqueId = `web-${watch.id}-${watch.webUrl}`;
  const existingWeb = await db.select().from(processedItems)
    .where(and(eq(processedItems.owner, owner), eq(processedItems.uniqueId, webUniqueId), eq(processedItems.watchId, watch.id)))
    .limit(1);

  if (existingWeb.length > 0) {
    console.log("checkWebForWatch: URL already processed for watch", watch.id, "skipping re-crawl");
    return;
  }

  try {
    const crawlResult = await withTimeout(
      crawlUrlMarkdown(sdk, { url: watch.webUrl }),
      CRAWL_TIMEOUT_MS,
      `crawl ${watch.webUrl}`
    );

    if (!crawlResult.success || !crawlResult.markdown) {
      console.log("checkWebForWatch: failed to crawl", watch.webUrl);
      return;
    }

    const contentStr = crawlResult.markdown.substring(0, MAX_CRAWL_CONTENT_LENGTH);

    // Get dismissal patterns, recent alerts, and past reports for semantic dedup
    const [patterns, recentAlertsList] = await Promise.all([
      db.select().from(dismissalPatterns)
        .where(and(eq(dismissalPatterns.owner, owner), eq(dismissalPatterns.watchId, watch.id))),
      db.select().from(alerts)
        .where(and(eq(alerts.watchId, watch.id), eq(alerts.owner, owner)))
        .orderBy(desc(alerts.createdAt))
        .limit(10),
    ]);

    const pastReports = recentAlertsList
      .filter(a => a.fullContent)
      .slice(0, 3)
      .map(a => ({
        title: a.title,
        fullContent: a.fullContent!.substring(0, 2000),
        createdAt: dayjs(a.createdAt).tz(getUserTimeZone()).format("YYYY-MM-DD HH:mm"),
      }));

    // Check content against watch — LLM semantic dedup replaces content hash
    const matchResult = await sdk.callLLM(
      matchWebTemplate({
        watchDescription: watch.description,
        watchTopics: JSON.stringify(topics),
        content: contentStr,
        dismissalPatterns: patterns.length > 0 ? JSON.stringify(patterns.map(p => p.pattern)) : null,
        recentAlerts: recentAlertsList.length > 0
          ? recentAlertsList.map(a => ({
            title: a.title,
            snippet: a.snippet,
            createdAt: dayjs(a.createdAt).tz(getUserTimeZone()).format("YYYY-MM-DD HH:mm"),
          }))
          : null,
        pastReports: pastReports.length > 0 ? pastReports : null,
      }),
      Type.Object({
        matched: Type.Boolean(),
        title: Type.Optional(Type.String()),
        snippet: Type.Optional(Type.String()),
        explanation: Type.Optional(Type.String()),
        confidence: Type.Optional(Type.String()),
        fullContent: Type.Optional(Type.String()),
      }),
      { modelVariant: "STANDARD" }
    );

    if (matchResult && matchResult.matched && matchResult.title && matchResult.snippet && matchResult.explanation) {
      await db.insert(alerts).values({
        owner,
        watchId: watch.id,
        sourceType: "web",
        title: matchResult.title,
        snippet: matchResult.snippet,
        explanation: matchResult.explanation,
        confidence: matchResult.confidence || "medium",
        sourceUrl: watch.webUrl,
        sourceName: crawlResult.title || watch.webUrl,
        fullContent: matchResult.fullContent || null,
        dismissed: false,
        read: false,
        createdAt: now,
      });

      console.log("checkWebForWatch: created web alert for watch", watch.id, `(confidence: ${matchResult.confidence || "medium"})`);

      if (watch.urgency === "instant") {
        try {
          await create_agent_post(sdk, {
            shortMessage: matchResult.title,
            attachments: [{
              type: "markdown",
              content: matchResult.fullContent || `**${matchResult.title}**\n\n${matchResult.snippet}\n\n*Why:* ${matchResult.explanation}\n\n[View source](${watch.webUrl})`,
            }],
            duration: "read_once",
            priority: "urgent",
          });
        } catch (err) {
          console.error("checkWebForWatch: failed to create post", err);
        }
      }
    }

    // Mark URL as processed for this watch — won't re-crawl until processedItems is cleaned
    try {
      await db.insert(processedItems).values({
        owner,
        uniqueId: webUniqueId,
        sourceType: "web",
        watchId: watch.id,
        processedAt: now,
      });
    } catch {
      // Unique constraint — already processed
    }
  } catch (error) {
    console.error("checkWebForWatch: error checking web for watch", watch.id, error);
  }
}

// ─── MONITORING: PERPLEXITY SUPPLEMENT ───────────────────────────

async function checkPerplexityForWatch(
  sdk: ServerSdk,
  db: ReturnType<ServerSdk["db"]>,
  watch: typeof watches.$inferSelect,
  owner: string,
  _now: Date
): Promise<MatchedArticle[]> {
  const topics: string[] = JSON.parse(watch.parsedTopics);
  if (topics.length === 0) return [];

  try {
    const query = `${watch.description} latest news and updates`;
    console.log("checkPerplexityForWatch: searching for watch", watch.id, "query:", query);

    const perplexityResult = await sonarSearch(sdk, { query });

    if (!perplexityResult.success || !perplexityResult.result) {
      console.log("checkPerplexityForWatch: no result for watch", watch.id);
      return [];
    }

    // No processedItems dedup for Perplexity — responses vary each time,
    // so content hashing is unreliable. Semantic dedup via recentAlerts in the LLM prompt.

    // Get dismissal patterns and recent alerts for matching
    const [patterns, recentAlertsList] = await Promise.all([
      db.select().from(dismissalPatterns)
        .where(and(eq(dismissalPatterns.owner, owner), eq(dismissalPatterns.watchId, watch.id))),
      db.select().from(alerts)
        .where(and(eq(alerts.watchId, watch.id), eq(alerts.owner, owner)))
        .orderBy(desc(alerts.createdAt))
        .limit(10),
    ]);

    const matchResult = await sdk.callLLM(
      matchWebTemplate({
        watchDescription: watch.description,
        watchTopics: JSON.stringify(topics),
        content: perplexityResult.result.substring(0, 3000),
        dismissalPatterns: patterns.length > 0 ? JSON.stringify(patterns.map(p => p.pattern)) : null,
        recentAlerts: recentAlertsList.length > 0
          ? recentAlertsList.map(a => ({
            title: a.title,
            snippet: a.snippet,
            createdAt: dayjs(a.createdAt).tz(getUserTimeZone()).format("YYYY-MM-DD HH:mm"),
          }))
          : null,
      }),
      Type.Object({
        matched: Type.Boolean(),
        title: Type.Optional(Type.String()),
        snippet: Type.Optional(Type.String()),
        explanation: Type.Optional(Type.String()),
        confidence: Type.Optional(Type.String()),
        fullContent: Type.Optional(Type.String()),
      }),
      { modelVariant: "STANDARD" }
    );

    if (matchResult && matchResult.matched && matchResult.title && matchResult.snippet && matchResult.explanation) {
      const sourceUrl = perplexityResult.sources?.[0]?.url || undefined;
      console.log("checkPerplexityForWatch: matched for watch", watch.id, `(confidence: ${matchResult.confidence || "medium"})`);
      return [{
        title: matchResult.title,
        snippet: matchResult.snippet,
        explanation: matchResult.explanation,
        confidence: matchResult.confidence || "medium",
        url: sourceUrl || "",
        source: "Perplexity AI Search",
        enrichedContent: matchResult.fullContent || null,
      }];
    }

    return [];
  } catch (error) {
    console.error("checkPerplexityForWatch: error for watch", watch.id, error);
    return [];
  }
}

// ─── MONITORING: CALENDAR ──────────────────────────────────────

async function checkCalendarForWatch(
  sdk: ServerSdk,
  db: ReturnType<ServerSdk["db"]>,
  watch: typeof watches.$inferSelect,
  owner: string,
  now: Date
) {
  const topics: string[] = JSON.parse(watch.parsedTopics);
  const today = dayjs().tz(getUserTimeZone()).format("YYYY-MM-DD");
  const tomorrow = dayjs().tz(getUserTimeZone()).add(1, "day").format("YYYY-MM-DD");

  try {
    // Get calendar accounts
    const accounts = await calListAccounts(sdk, {});
    if (!accounts.accounts || accounts.accounts.length === 0) {
      console.log("checkCalendarForWatch: no calendar accounts connected");
      return;
    }

    // Collect events from all accounts for today and tomorrow
    const allEvents: Array<{ summary: string; startTimeLocal: string; endTimeLocal: string; isAllDay: boolean; location: string | null; attendeeCount: number; start: string; end: string }> = [];

    for (const account of accounts.accounts) {
      for (const day of [today, tomorrow]) {
        try {
          const result = await getEventsForDay(sdk, {
            account: account.email,
            day,
            maxResults: 100,
          });
          for (const event of result.events) {
            const realAttendees = event.attendees?.filter(
              (a: { email?: string }) => !a.email?.includes("@resource.calendar.google.com")
            ) || [];
            allEvents.push({
              summary: event.summary,
              startTimeLocal: event.startTimeLocal,
              endTimeLocal: event.endTimeLocal,
              isAllDay: event.isAllDay,
              location: event.location,
              attendeeCount: realAttendees.length,
              start: event.start,
              end: event.end,
            });
          }
        } catch (err) {
          console.error(`checkCalendarForWatch: failed to fetch calendar for ${account.email} on ${day}`, err);
        }
      }
    }

    if (allEvents.length === 0) {
      console.log("checkCalendarForWatch: no events found for watch", watch.id);
      return;
    }

    // Calculate meeting hours (exclude all-day events)
    let totalMinutes = 0;
    for (const event of allEvents) {
      if (!event.isAllDay) {
        const start = dayjs(event.start).tz(getUserTimeZone());
        const end = dayjs(event.end).tz(getUserTimeZone());
        totalMinutes += end.diff(start, "minute");
      }
    }
    const meetingHours = Math.round(totalMinutes / 60 * 10) / 10;

    // Deduplicate
    const uniqueId = `calendar-${watch.id}-${today}-${allEvents.length}-${meetingHours}`;
    const existing = await db.select().from(processedItems)
      .where(and(eq(processedItems.owner, owner), eq(processedItems.uniqueId, uniqueId)))
      .limit(1);

    if (existing.length > 0) {
      console.log("checkCalendarForWatch: already processed for watch", watch.id);
      return;
    }

    await db.insert(processedItems).values({
      owner,
      uniqueId,
      sourceType: "calendar",
      watchId: watch.id,
      processedAt: now,
    });

    // Get recent alerts for dedup
    const recentAlertsList = await db.select().from(alerts)
      .where(and(eq(alerts.watchId, watch.id), eq(alerts.owner, owner)))
      .orderBy(desc(alerts.createdAt))
      .limit(10);

    const matchResult = await sdk.callLLM(
      matchCalendarTemplate({
        watchDescription: watch.description,
        watchTopics: JSON.stringify(topics),
        date: `${today} and ${tomorrow}`,
        events: allEvents,
        eventCount: allEvents.length,
        meetingHours,
        recentAlerts: recentAlertsList.length > 0
          ? recentAlertsList.map(a => ({
            title: a.title,
            snippet: a.snippet,
            createdAt: dayjs(a.createdAt).tz(getUserTimeZone()).format("YYYY-MM-DD HH:mm"),
          }))
          : null,
      }),
      Type.Object({
        matched: Type.Boolean(),
        title: Type.Optional(Type.String()),
        snippet: Type.Optional(Type.String()),
        explanation: Type.Optional(Type.String()),
        confidence: Type.Optional(Type.String()),
        fullContent: Type.Optional(Type.String()),
      }),
      { modelVariant: "STANDARD" }
    );

    if (matchResult && matchResult.matched && matchResult.title && matchResult.snippet && matchResult.explanation) {
      await db.insert(alerts).values({
        owner,
        watchId: watch.id,
        sourceType: "calendar",
        title: matchResult.title,
        snippet: matchResult.snippet,
        explanation: matchResult.explanation,
        confidence: matchResult.confidence || "medium",
        sourceName: "Google Calendar",
        fullContent: matchResult.fullContent || null,
        dismissed: false,
        read: false,
        createdAt: now,
      });

      console.log("checkCalendarForWatch: created calendar alert for watch", watch.id);

      if (watch.urgency === "instant") {
        try {
          await create_agent_post(sdk, {
            shortMessage: matchResult.title,
            attachments: [{
              type: "markdown",
              content: matchResult.fullContent || `**${matchResult.title}**\n\n${matchResult.snippet}\n\n*Why:* ${matchResult.explanation}`,
            }],
            duration: "read_once",
            priority: "urgent",
          });
        } catch (err) {
          console.error("checkCalendarForWatch: failed to create post", err);
        }
      }
    }
  } catch (error) {
    console.error("checkCalendarForWatch: error for watch", watch.id, error);
  }
}

// ─── MONITORING: FLIGHT TRACKING ───────────────────────────────

async function checkFlightForWatch(
  sdk: ServerSdk,
  db: ReturnType<ServerSdk["db"]>,
  watch: typeof watches.$inferSelect,
  owner: string,
  now: Date
) {
  if (!watch.flightNumber) return;

  try {
    console.log("checkFlightForWatch: checking flight", watch.flightNumber, "for watch", watch.id);

    const flightResult = await getFlightStatus(sdk, { ident: watch.flightNumber });

    if (!flightResult.success || !flightResult.flights || flightResult.flights.length === 0) {
      console.log("checkFlightForWatch: no flight data for", watch.flightNumber);
      return;
    }

    // Use the most recent / active flight
    const flight = flightResult.flights[0]!;

    // Build a unique ID based on flight status to avoid duplicate alerts for same state
    const statusKey = `${flight.status}-${flight.gate_origin}-${flight.gate_destination}-${flight.estimated_off}-${flight.estimated_in}`;
    const uniqueId = `flight-${watch.id}-${Buffer.from(statusKey).toString("base64").substring(0, 40)}`;

    const existing = await db.select().from(processedItems)
      .where(and(eq(processedItems.owner, owner), eq(processedItems.uniqueId, uniqueId)))
      .limit(1);

    if (existing.length > 0) {
      console.log("checkFlightForWatch: no status change for flight", watch.flightNumber);
      return;
    }

    await db.insert(processedItems).values({
      owner,
      uniqueId,
      sourceType: "flight",
      watchId: watch.id,
      processedAt: now,
    });

    // Get recent alerts for dedup
    const recentAlertsList = await db.select().from(alerts)
      .where(and(eq(alerts.watchId, watch.id), eq(alerts.owner, owner)))
      .orderBy(desc(alerts.createdAt))
      .limit(10);

    const flightDataStr = JSON.stringify({
      ident: flight.ident,
      status: flight.status,
      origin: flight.origin,
      destination: flight.destination,
      scheduled_off: flight.scheduled_off,
      estimated_off: flight.estimated_off,
      actual_off: flight.actual_off,
      scheduled_in: flight.scheduled_in,
      estimated_in: flight.estimated_in,
      actual_in: flight.actual_in,
      gate_origin: flight.gate_origin,
      gate_destination: flight.gate_destination,
      terminal_origin: flight.terminal_origin,
      terminal_destination: flight.terminal_destination,
      departure_delay: flight.departure_delay,
      arrival_delay: flight.arrival_delay,
      cancelled: flight.cancelled,
      diverted: flight.diverted,
      progress_percent: flight.progress_percent,
      baggage_claim: flight.baggage_claim,
    }, null, 2);

    const matchResult = await sdk.callLLM(
      matchFlightTemplate({
        watchDescription: watch.description,
        flightNumber: watch.flightNumber,
        flightData: flightDataStr,
        recentAlerts: recentAlertsList.length > 0
          ? recentAlertsList.map(a => ({
            title: a.title,
            snippet: a.snippet,
            createdAt: dayjs(a.createdAt).tz(getUserTimeZone()).format("YYYY-MM-DD HH:mm"),
          }))
          : null,
      }),
      Type.Object({
        matched: Type.Boolean(),
        title: Type.Optional(Type.String()),
        snippet: Type.Optional(Type.String()),
        explanation: Type.Optional(Type.String()),
        confidence: Type.Optional(Type.String()),
        fullContent: Type.Optional(Type.String()),
        flightLanded: Type.Optional(Type.Boolean()),
      }),
      { modelVariant: "STANDARD" }
    );

    if (matchResult && matchResult.matched && matchResult.title && matchResult.snippet && matchResult.explanation) {
      await db.insert(alerts).values({
        owner,
        watchId: watch.id,
        sourceType: "flight",
        title: matchResult.title,
        snippet: matchResult.snippet,
        explanation: matchResult.explanation,
        confidence: matchResult.confidence || "high",
        sourceName: `FlightAware (${watch.flightNumber})`,
        fullContent: matchResult.fullContent || null,
        dismissed: false,
        read: false,
        createdAt: now,
      });

      console.log("checkFlightForWatch: created flight alert for watch", watch.id);

      if (watch.urgency === "instant") {
        try {
          await create_agent_post(sdk, {
            shortMessage: matchResult.title,
            attachments: [{
              type: "markdown",
              content: matchResult.fullContent || `**${matchResult.title}**\n\n${matchResult.snippet}`,
            }],
            duration: "read_once",
            priority: "urgent",
          });
        } catch (err) {
          console.error("checkFlightForWatch: failed to create post", err);
        }
      }

      // Auto-complete watch if flight has landed
      if (matchResult.flightLanded) {
        await db.update(watches)
          .set({ status: "completed", updatedAt: now })
          .where(eq(watches.id, watch.id));
        console.log("checkFlightForWatch: auto-completed watch", watch.id, "— flight landed");

        try {
          await create_agent_post(sdk, {
            shortMessage: `Flight ${watch.flightNumber} has landed`,
            attachments: [{
              type: "markdown",
              content: `Your flight watch for **${watch.flightNumber}** has been automatically completed — the flight has landed.`,
            }],
            duration: "read_once",
            priority: "normal",
          });
        } catch (err) {
          console.error("checkFlightForWatch: failed to notify completion", err);
        }
      }
    }
  } catch (error) {
    console.error("checkFlightForWatch: error for watch", watch.id, error);
  }
}

// ─── MONITORING: PRICE/DEAL TRACKING ───────────────────────────

async function checkPriceForWatch(
  sdk: ServerSdk,
  db: ReturnType<ServerSdk["db"]>,
  watch: typeof watches.$inferSelect,
  owner: string,
  now: Date
) {
  if (!watch.targetPrice) return;

  const topics: string[] = JSON.parse(watch.parsedTopics);
  const targetPriceNum = parseFloat(watch.targetPrice);

  try {
    // Strategy 1: If there's a URL, crawl it for price
    if (watch.webUrl) {
      console.log("checkPriceForWatch: crawling URL for price:", watch.webUrl);
      const crawlResult = await withTimeout(
        crawlUrlMarkdown(sdk, { url: watch.webUrl }),
        CRAWL_TIMEOUT_MS,
        `crawl ${watch.webUrl}`
      );

      if (crawlResult.success && crawlResult.markdown) {
        const content = crawlResult.markdown.substring(0, MAX_CRAWL_CONTENT_LENGTH);

        const priceResult = await sdk.callLLM(
          extractPriceTemplate({
            watchDescription: watch.description,
            targetPrice: watch.targetPrice,
            url: watch.webUrl,
            content,
          }),
          Type.Object({
            currentPrice: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
            productName: Type.Optional(Type.String()),
            currency: Type.Optional(Type.String()),
            priceDropped: Type.Boolean(),
            previousPrice: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
            onSale: Type.Optional(Type.Boolean()),
          }),
          { modelVariant: "FAST" }
        );

        if (priceResult && priceResult.currentPrice != null) {
          const priceKey = `${priceResult.currentPrice}-${priceResult.onSale}`;
          const uniqueId = `price-${watch.id}-${priceKey}`;

          const existing = await db.select().from(processedItems)
            .where(and(eq(processedItems.owner, owner), eq(processedItems.uniqueId, uniqueId)))
            .limit(1);

          if (existing.length > 0) {
            console.log("checkPriceForWatch: price unchanged for watch", watch.id);
            return;
          }

          await db.insert(processedItems).values({
            owner,
            uniqueId,
            sourceType: "web",
            watchId: watch.id,
            processedAt: now,
          });

          if (priceResult.priceDropped || priceResult.currentPrice <= targetPriceNum) {
            const title = `Price drop: ${priceResult.productName || watch.description} now ${priceResult.currency || "$"}${priceResult.currentPrice}`;
            const snippet = `Current price: ${priceResult.currency || "$"}${priceResult.currentPrice} (target: ${priceResult.currency || "$"}${watch.targetPrice})${priceResult.previousPrice ? ` — was ${priceResult.currency || "$"}${priceResult.previousPrice}` : ""}`;

            await db.insert(alerts).values({
              owner,
              watchId: watch.id,
              sourceType: "web",
              title,
              snippet,
              explanation: `Price is at or below your target of ${priceResult.currency || "$"}${watch.targetPrice}`,
              confidence: "high",
              sourceUrl: watch.webUrl,
              sourceName: priceResult.productName || "Price Tracker",
              fullContent: `**${title}**\n\n${snippet}\n\n${priceResult.onSale ? "This item appears to be **on sale**." : ""}\n\n[View product](${watch.webUrl})`,
              dismissed: false,
              read: false,
              createdAt: now,
            });

            console.log("checkPriceForWatch: price drop alert for watch", watch.id, "current:", priceResult.currentPrice, "target:", watch.targetPrice);

            if (watch.urgency === "instant") {
              try {
                await create_agent_post(sdk, {
                  shortMessage: title,
                  attachments: [{
                    type: "markdown",
                    content: `**${title}**\n\n${snippet}\n\n[View product](${watch.webUrl})`,
                  }],
                  duration: "read_once",
                  priority: "urgent",
                });
              } catch (err) {
                console.error("checkPriceForWatch: failed to create post", err);
              }
            }
          } else {
            console.log("checkPriceForWatch: price", priceResult.currentPrice, "still above target", watch.targetPrice, "for watch", watch.id);
          }
        }
      }
    }

    // Strategy 2: Use exa to find deals across the web
    if (!watch.webUrl && topics.length > 0) {
      console.log("checkPriceForWatch: searching exa for deals on:", watch.description);
      try {
        const exaResult = await exaWebSearch(sdk, {
          query: `${watch.description} price deal under ${watch.targetPrice}`,
          summary: true,
          numResults: 5,
        });

        if (exaResult.results && exaResult.results.length > 0) {
          for (const result of exaResult.results) {
            if (!result.url) continue;

            const uniqueId = `exa-price-${watch.id}-${result.url}`;
            const existing = await db.select().from(processedItems)
              .where(and(eq(processedItems.owner, owner), eq(processedItems.uniqueId, uniqueId)))
              .limit(1);

            if (existing.length > 0) continue;

            await db.insert(processedItems).values({
              owner,
              uniqueId,
              sourceType: "web",
              watchId: watch.id,
              processedAt: now,
            });

            // Check if the deal mentions a relevant price
            const content = result.summary || result.text || result.title || "";
            if (content.length > 0) {
              const priceResult = await sdk.callLLM(
                extractPriceTemplate({
                  watchDescription: watch.description,
                  targetPrice: watch.targetPrice,
                  url: result.url,
                  content: content.substring(0, 3000),
                }),
                Type.Object({
                  currentPrice: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
                  productName: Type.Optional(Type.String()),
                  currency: Type.Optional(Type.String()),
                  priceDropped: Type.Boolean(),
                  previousPrice: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
                  onSale: Type.Optional(Type.Boolean()),
                }),
                { modelVariant: "FAST" }
              );

              if (priceResult && priceResult.priceDropped && priceResult.currentPrice != null) {
                const title = `Deal found: ${priceResult.productName || watch.description} at ${priceResult.currency || "$"}${priceResult.currentPrice}`;

                await db.insert(alerts).values({
                  owner,
                  watchId: watch.id,
                  sourceType: "web",
                  title,
                  snippet: `Found at ${priceResult.currency || "$"}${priceResult.currentPrice} (target: ${priceResult.currency || "$"}${watch.targetPrice})`,
                  explanation: `Price is at or below your target from ${result.title || result.url}`,
                  confidence: "medium",
                  sourceUrl: result.url,
                  sourceName: result.title || "Deal Search",
                  fullContent: `**${title}**\n\n${content.substring(0, 500)}\n\n[View deal](${result.url})`,
                  dismissed: false,
                  read: false,
                  createdAt: now,
                });

                console.log("checkPriceForWatch: exa deal alert for watch", watch.id);
                break; // One deal alert per check cycle
              }
            }
          }
        }
      } catch (err) {
        console.error("checkPriceForWatch: exa search failed for watch", watch.id, err);
      }
    }
  } catch (error) {
    console.error("checkPriceForWatch: error for watch", watch.id, error);
  }
}

// ─── MONITORING: CONTACTS (RELATIONSHIP NUDGES) ────────────────

async function checkContactsForWatch(
  _sdk: ServerSdk,
  _db: ReturnType<ServerSdk["db"]>,
  watch: typeof watches.$inferSelect,
  _owner: string,
  _now: Date
) {
  // Contacts tool is not available in this environment
  console.log("checkContactsForWatch: contacts tool not available, skipping watch", watch.id);
  return;
}

// ─── MONITORING: SLACK ─────────────────────────────────────────

async function checkSlackForWatch(
  _sdk: ServerSdk,
  _db: ReturnType<ServerSdk["db"]>,
  watch: typeof watches.$inferSelect,
  _owner: string,
  _now: Date
) {
  // Slack tool is not available in this environment
  console.log("checkSlackForWatch: slack tool not available, skipping watch", watch.id);
  return;
}

/** Combine matched articles from news + perplexity into a single alert with past-report context */
async function createCombinedNewsAlert(
  sdk: ServerSdk,
  db: ReturnType<ServerSdk["db"]>,
  watch: typeof watches.$inferSelect,
  owner: string,
  now: Date,
  allMatchedArticles: MatchedArticle[]
) {
  if (allMatchedArticles.length === 0) return;

  console.log("createCombinedNewsAlert: combining", allMatchedArticles.length, "articles for watch", watch.id);

  // Get past reports (fullContent) for incremental dedup and dismissal patterns
  const [pastAlerts, patterns] = await Promise.all([
    db.select().from(alerts)
      .where(and(eq(alerts.watchId, watch.id), eq(alerts.owner, owner)))
      .orderBy(desc(alerts.createdAt))
      .limit(5),
    db.select().from(dismissalPatterns)
      .where(and(eq(dismissalPatterns.owner, owner), eq(dismissalPatterns.watchId, watch.id))),
  ]);

  const pastReports = pastAlerts
    .filter(a => a.fullContent)
    .map(a => ({
      title: a.title,
      fullContent: a.fullContent!.substring(0, 2000),
      createdAt: dayjs(a.createdAt).tz(getUserTimeZone()).format("YYYY-MM-DD HH:mm"),
    }));

  // Build the combined report using POWERFUL model
  let combinedReport: string | null = null;
  const firstArticle = allMatchedArticles[0]!;

  try {
    const combineResult = await sdk.callLLM(
      combineReportTemplate({
        watchDescription: watch.description,
        articles: allMatchedArticles.map(a => ({
          title: a.title,
          source: a.source,
          url: a.url,
          snippet: a.snippet,
          explanation: a.explanation,
          enrichedContent: a.enrichedContent,
        })),
        pastReports: pastReports.length > 0 ? pastReports : null,
        dismissalPatterns: patterns.length > 0 ? JSON.stringify(patterns.map(p => p.pattern)) : null,
      }),
      Type.Object({
        report: Type.String(),
      }),
      { modelVariant: "POWERFUL" }
    );

    if (combineResult && combineResult.report) {
      combinedReport = combineResult.report;
    }
  } catch (err) {
    console.error("createCombinedNewsAlert: failed to combine report, using fallback", err);
  }

  // If LLM returned empty report (nothing new), skip alert creation
  if (combinedReport !== null && combinedReport.trim() === "") {
    console.log("createCombinedNewsAlert: LLM returned empty report (no new info), skipping alert for watch", watch.id);
    return;
  }

  // Fallback if LLM combine failed
  if (!combinedReport) {
    if (allMatchedArticles.length === 1) {
      combinedReport = firstArticle.enrichedContent ||
        `**${firstArticle.title}**\n\n${firstArticle.snippet}\n\n*Why this matters:* ${firstArticle.explanation}\n\n[Source: ${firstArticle.source}](${firstArticle.url})`;
    } else {
      combinedReport = allMatchedArticles.map(a =>
        `**${a.title}** (${a.source})\n${a.enrichedContent || a.snippet}\n`
      ).join("\n---\n\n");
    }
  }

  // Build title and metadata
  const combinedTitle = allMatchedArticles.length === 1
    ? firstArticle.title
    : `${allMatchedArticles.length} updates: ${watch.description}`;

  const combinedSnippet = allMatchedArticles.length === 1
    ? firstArticle.snippet
    : allMatchedArticles.map(a => a.title).join(" | ");

  const confidenceOrder = ["high", "medium", "low"];
  const bestConfidence = allMatchedArticles.reduce((best, a) => {
    const bestIdx = confidenceOrder.indexOf(best);
    const curIdx = confidenceOrder.indexOf(a.confidence);
    return curIdx < bestIdx ? a.confidence : best;
  }, "low");

  const allSources = [...new Set(allMatchedArticles.map(a => a.source))].join(", ");

  await db.insert(alerts).values({
    owner,
    watchId: watch.id,
    sourceType: "news",
    title: combinedTitle,
    snippet: combinedSnippet,
    explanation: allMatchedArticles.length === 1
      ? firstArticle.explanation
      : `Found ${allMatchedArticles.length} relevant articles from ${allSources}`,
    confidence: bestConfidence,
    sourceUrl: firstArticle.url || null,
    sourceName: allMatchedArticles.length === 1 ? firstArticle.source : allSources,
    fullContent: combinedReport,
    dismissed: false,
    read: false,
    createdAt: now,
  });

  console.log("createCombinedNewsAlert: created combined alert for watch", watch.id, "with", allMatchedArticles.length, "articles");

  // Single instant notification
  if (watch.urgency === "instant") {
    try {
      await create_agent_post(sdk, {
        shortMessage: combinedTitle,
        attachments: [{
          type: "markdown",
          content: combinedReport || combinedSnippet,
        }],
        duration: "read_once",
        priority: "urgent",
      });
    } catch (err) {
      console.error("createCombinedNewsAlert: failed to create post", err);
    }
  }
}

/** Process a single watch — runs all source checks, combining news+perplexity into one alert */
async function processOneWatch(
  sdk: ServerSdk,
  db: ReturnType<ServerSdk["db"]>,
  watch: typeof watches.$inferSelect,
  owner: string,
  now: Date
) {
  const sources: string[] = JSON.parse(watch.sourceTypes);
  const otherChecks: Promise<void>[] = [];

  // ─── NEWS + PERPLEXITY: run in parallel, then combine into one alert ───
  if (sources.includes("news")) {
    const [newsSettled, perplexitySettled] = await Promise.allSettled([
      checkNewsForWatch(sdk, db, watch, owner, now),
      checkPerplexityForWatch(sdk, db, watch, owner, now),
    ]);

    const newsResult: NewsCheckResult = newsSettled.status === "fulfilled"
      ? newsSettled.value
      : { matchedArticles: [], pendingProcessedUrls: [] };
    const perplexityArticles: MatchedArticle[] = perplexitySettled.status === "fulfilled" ? perplexitySettled.value : [];
    const allNewsArticles: MatchedArticle[] = [...newsResult.matchedArticles, ...perplexityArticles];

    if (allNewsArticles.length > 0) {
      try {
        await createCombinedNewsAlert(sdk, db, watch, owner, now, allNewsArticles);

        // Mark matched news articles as processed ONLY after alert creation succeeded
        for (const url of newsResult.pendingProcessedUrls) {
          try {
            await db.insert(processedItems).values({
              owner,
              uniqueId: url,
              sourceType: "news",
              watchId: watch.id,
              processedAt: now,
            });
          } catch {
            // Unique constraint — already processed
          }
        }
      } catch (error) {
        console.error("processOneWatch: combined news alert failed for watch", watch.id, error);
        // Matched articles NOT marked as processed — will be retried next cycle
      }
    }
  }

  // ─── WEB MONITORING (URL-based) ───
  if (sources.includes("web") && watch.webUrl) {
    otherChecks.push(
      checkWebForWatch(sdk, db, watch, owner, now)
        .catch(error => { console.error("processOneWatch: web check failed for watch", watch.id, error); })
    );
  }

  // Web watches without a URL now use Perplexity via the news flow above (Gemini removed)

  // ─── PRICE TRACKING ───
  if (sources.includes("web") && watch.targetPrice) {
    otherChecks.push(
      checkPriceForWatch(sdk, db, watch, owner, now)
        .catch(error => { console.error("processOneWatch: price check failed for watch", watch.id, error); })
    );
  }

  if (sources.includes("calendar")) {
    otherChecks.push(
      checkCalendarForWatch(sdk, db, watch, owner, now)
        .catch(error => { console.error("processOneWatch: calendar check failed for watch", watch.id, error); })
    );
  }

  if (sources.includes("flight")) {
    otherChecks.push(
      checkFlightForWatch(sdk, db, watch, owner, now)
        .catch(error => { console.error("processOneWatch: flight check failed for watch", watch.id, error); })
    );
  }

  if (sources.includes("contacts")) {
    otherChecks.push(
      checkContactsForWatch(sdk, db, watch, owner, now)
        .catch(error => { console.error("processOneWatch: contacts check failed for watch", watch.id, error); })
    );
  }

  if (sources.includes("slack")) {
    otherChecks.push(
      checkSlackForWatch(sdk, db, watch, owner, now)
        .catch(error => { console.error("processOneWatch: slack check failed for watch", watch.id, error); })
    );
  }

  await Promise.allSettled(otherChecks);
}

/** Run tasks with a concurrency limit */
async function runWithConcurrency<T>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<void>,
  budgetStartMs: number,
  budgetMs: number,
  labelFn: (item: T) => string,
): Promise<{ completed: number; skipped: number }> {
  let completed = 0;
  let skipped = 0;
  let index = 0;

  async function runNext(): Promise<void> {
    while (index < items.length) {
      // Check overall time budget before starting a new item
      const elapsed = Date.now() - budgetStartMs;
      if (elapsed > budgetMs) {
        const remaining = items.length - index;
        skipped += remaining;
        console.log(`runWithConcurrency: time budget exceeded (${Math.round(elapsed / 1000)}s), skipping ${remaining} remaining items`);
        index = items.length; // stop the loop
        return;
      }

      const currentIndex = index++;
      const item = items[currentIndex]!;
      const label = labelFn(item);
      const startTime = Date.now();
      console.log(`runWithConcurrency: starting ${label}`);

      try {
        await withTimeout(fn(item), PER_WATCH_TIMEOUT_MS, label);
      } catch (error) {
        console.error(`runWithConcurrency: ${label} timed out or failed after ${Math.round((Date.now() - startTime) / 1000)}s`, error);
      }

      console.log(`runWithConcurrency: finished ${label} in ${Math.round((Date.now() - startTime) / 1000)}s`);
      completed++;
    }
  }

  // Launch `concurrency` number of workers
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => runNext());
  await Promise.allSettled(workers);

  return { completed, skipped };
}

async function runWatchCheck(sdk: ServerSdk, forceAll = false) {
  const overallStart = Date.now();
  const db = sdk.db<typeof schema>();
  const owner = sdk.getUser().email;
  const now = dayjs().tz(getUserTimeZone()).toDate();

  // ─── AUTO-RESUME SNOOZED WATCHES ───
  const snoozedWatches = await db.select().from(watches)
    .where(and(
      eq(watches.owner, owner),
      eq(watches.status, "paused"),
      isNotNull(watches.snoozeUntil),
      lte(watches.snoozeUntil, now),
    ));

  for (const snoozed of snoozedWatches) {
    await db.update(watches)
      .set({ status: "active", snoozeUntil: null, updatedAt: now })
      .where(eq(watches.id, snoozed.id));
    console.log("runWatchCheck: auto-resumed snoozed watch", snoozed.id, "—", snoozed.description);
  }

  // ─── SELECT ONLY "DUE" WATCHES ───
  // A watch is due if it has never been checked (lastCheckedAt IS NULL)
  // or if enough time has passed since its last check (>= WATCH_CHECK_INTERVAL_MS).
  // Digest watches are skipped here — they are checked inside sendDigest at their scheduled hour.
  const cutoff = dayjs(now).tz(getUserTimeZone()).subtract(WATCH_CHECK_INTERVAL_MS, "millisecond").toDate();
  const allActiveWatches = await db.select().from(watches)
    .where(and(eq(watches.owner, owner), eq(watches.status, "active")));

  // When forceAll (manual "Check Now"), process all watches. Otherwise, only instant watches that are due.
  const dueWatches = forceAll
    ? allActiveWatches
    : allActiveWatches
        .filter(w => w.urgency === "instant")
        .filter(w => !w.lastCheckedAt || w.lastCheckedAt <= cutoff);

  console.log("runWatchCheck:", dueWatches.length, "due instant watches out of", allActiveWatches.length, "active (forceAll:", forceAll, "concurrency:", WATCH_CONCURRENCY, ")");

  if (dueWatches.length === 0) {
    console.log("runWatchCheck: no watches are due, exiting");
    return;
  }

  // ─── PROCESS DUE WATCHES IN PARALLEL WITH CONCURRENCY LIMIT ───
  // lastCheckedAt is updated per-watch AFTER successful processing
  const { completed, skipped } = await runWithConcurrency(
    dueWatches,
    WATCH_CONCURRENCY,
    async (watch) => {
      await processOneWatch(sdk, db, watch, owner, now);
      // Update lastCheckedAt only after this watch has been processed
      await db.update(watches)
        .set({ lastCheckedAt: now })
        .where(eq(watches.id, watch.id));
    },
    overallStart,
    OVERALL_BUDGET_MS,
    (watch) => `watch ${watch.id} (${watch.description.substring(0, 40)})`,
  );

  console.log(`runWatchCheck: processed ${completed} watches, skipped ${skipped}, elapsed ${Math.round((Date.now() - overallStart) / 1000)}s`);

  // ─── BATCH CHECK FOR EXPIRING WATCHES ───
  // Skip if we're already over 90% of budget
  const elapsed = Date.now() - overallStart;
  if (elapsed > OVERALL_BUDGET_MS * 0.9) {
    console.log("runWatchCheck: skipping expiry check — time budget nearly exhausted");
    return;
  }

  if (allActiveWatches.length === 0) return;

  try {
    // Gather recent alerts for all watches in parallel
    const watchesWithAlerts = await Promise.all(
      allActiveWatches.map(async (watch) => {
        const recentAlerts = await db.select().from(alerts)
          .where(and(eq(alerts.watchId, watch.id), eq(alerts.owner, owner)))
          .orderBy(desc(alerts.createdAt))
          .limit(5);

        return {
          id: watch.id,
          description: watch.description,
          topics: watch.parsedTopics,
          createdAt: dayjs(watch.createdAt).tz(getUserTimeZone()).format("YYYY-MM-DD"),
          recentAlerts: recentAlerts.map(a => ({
            title: a.title,
            sourceName: a.sourceName || "Unknown",
            createdAt: dayjs(a.createdAt).tz(getUserTimeZone()).format("YYYY-MM-DD"),
          })),
        };
      })
    );

    const expiryResult = await sdk.callLLM(
      checkExpiryBatchTemplate({ watches: watchesWithAlerts }),
      Type.Object({
        results: Type.Array(Type.Object({
          watchId: Type.Number(),
          shouldComplete: Type.Boolean(),
          reason: Type.Optional(Type.String()),
        })),
      }),
      { modelVariant: "FAST" }
    );

    if (expiryResult?.results) {
      for (const result of expiryResult.results) {
        if (!result.shouldComplete) continue;

        const watch = allActiveWatches.find(w => w.id === result.watchId);
        if (!watch) continue;

        await db.update(watches)
          .set({ status: "completed", updatedAt: now })
          .where(eq(watches.id, result.watchId));
        console.log("runWatchCheck: auto-completed watch", result.watchId, "reason:", result.reason);

        // Archive processedItems for this completed watch to stale table
        try {
          const itemsToArchive = await db.select().from(processedItems)
            .where(eq(processedItems.watchId, result.watchId));
          if (itemsToArchive.length > 0) {
            await db.insert(staleProcessedItems).values(itemsToArchive.map(item => ({
              owner: item.owner,
              uniqueId: item.uniqueId,
              sourceType: item.sourceType,
              watchId: item.watchId,
              processedAt: item.processedAt,
            })));
            await db.delete(processedItems).where(eq(processedItems.watchId, result.watchId));
            console.log("runWatchCheck: archived", itemsToArchive.length, "processedItems for completed watch", result.watchId);
          }
        } catch (archiveErr) {
          console.error("runWatchCheck: failed to archive processedItems for watch", result.watchId, archiveErr);
        }

        try {
          await create_agent_post(sdk, {
            shortMessage: `Watch completed: ${watch.description.substring(0, 50)}`,
            attachments: [{
              type: "markdown",
              content: `Your watch **"${watch.description}"** has been automatically completed.\n\n**Reason:** ${result.reason || "The purpose of this watch appears to have been fulfilled."}`,
            }],
            duration: "read_once",
            priority: "normal",
          });
        } catch (err) {
          console.error("runWatchCheck: failed to notify about completed watch", err);
        }
      }
    }
  } catch (error) {
    console.error("runWatchCheck: batch expiry check failed", error);
  }

  console.log(`runWatchCheck: total elapsed ${Math.round((Date.now() - overallStart) / 1000)}s`);
}

// ─── SIDEKICK TASK COMPLETION CALLBACK ──────────────────────────

export const onWatchCheckComplete = serverFunction({
  description: "Receives results from the Sidekick Task that checked a watch. Stores alerts and updates lastCheckedAt. URLs are already marked as processed during task execution via markUrlsProcessed.",
  params: Type.Object({
    watchId: Type.Number({ description: "The watch ID that was checked" }),
    checked: Type.Boolean({ description: "Whether the watch was successfully checked" }),
    alerts: Type.Array(Type.Object({
      sourceType: Type.String({ description: "Source type, e.g. 'news'" }),
      title: Type.String({ description: "Short alert title, max 80 chars" }),
      snippet: Type.String({ description: "Most relevant excerpt, 1-2 sentences" }),
      explanation: Type.String({ description: "Why this matches the watch, 1 sentence" }),
      confidence: Type.Optional(Type.String({ description: "high or medium" })),
      sourceUrl: Type.Optional(Type.String({ description: "URL of the source article" })),
      sourceName: Type.Optional(Type.String({ description: "Name of the publication, e.g. Reuters" })),
      fullContent: Type.Optional(Type.String({ description: "Detailed incremental markdown report, under 500 words" })),
    })),
  }),
  exported: true,
  execute: async (sdk: ServerSdk, { watchId, checked, alerts: alertResults }) => {
    const db = sdk.db<typeof schema>();
    const owner = sdk.getUser().email;
    const now = dayjs().tz(getUserTimeZone()).toDate();

    console.log("onWatchCheckComplete: received results for watch", watchId, "checked:", checked, "alerts:", alertResults.length);

    if (!checked) {
      console.log("onWatchCheckComplete: watch", watchId, "was not checked, skipping");
      return;
    }

    // Verify watch exists and belongs to owner
    const watchRows = await db.select().from(watches)
      .where(and(eq(watches.id, watchId), eq(watches.owner, owner)))
      .limit(1);
    const watch = watchRows[0];
    if (!watch) {
      console.log("onWatchCheckComplete: watch", watchId, "not found or not owned, skipping");
      return;
    }

    let totalAlerts = 0;

    for (const alertData of alertResults) {
      try {
        // Check for duplicate alert by title
        const existingAlert = await db.select().from(alerts)
          .where(and(
            eq(alerts.watchId, watchId),
            eq(alerts.owner, owner),
            eq(alerts.title, alertData.title),
          ))
          .limit(1);
        if (existingAlert.length > 0) {
          console.log("onWatchCheckComplete: skipping duplicate alert:", alertData.title);
          continue;
        }

        await db.insert(alerts).values({
          owner,
          watchId,
          sourceType: alertData.sourceType,
          title: alertData.title,
          snippet: alertData.snippet,
          explanation: alertData.explanation,
          confidence: alertData.confidence || "medium",
          sourceUrl: alertData.sourceUrl || null,
          sourceName: alertData.sourceName || null,
          fullContent: alertData.fullContent || null,
          dismissed: false,
          read: false,
          createdAt: now,
        });
        totalAlerts++;
      } catch (err) {
        console.error("onWatchCheckComplete: failed to insert alert for watch", watchId, err);
      }
    }

    // Update lastCheckedAt
    await db.update(watches)
      .set({ lastCheckedAt: now })
      .where(eq(watches.id, watchId));

    console.log("onWatchCheckComplete: inserted", totalAlerts, "alerts for watch", watchId);
  },
});

// ─── EXPIRY CHECK (extracted from runWatchCheck) ────────────────

async function runExpiryCheck(
  sdk: ServerSdk,
  db: ReturnType<ServerSdk["db"]>,
  owner: string,
  allActiveWatches: Array<typeof watches.$inferSelect>,
  now: Date,
) {
  if (allActiveWatches.length === 0) return;

  console.log("runExpiryCheck: checking", allActiveWatches.length, "active watches for expiry");

  try {
    const watchesWithAlerts = await Promise.all(
      allActiveWatches.map(async (watch) => {
        const recentAlerts = await db.select().from(alerts)
          .where(and(eq(alerts.watchId, watch.id), eq(alerts.owner, owner)))
          .orderBy(desc(alerts.createdAt))
          .limit(5);

        return {
          id: watch.id,
          description: watch.description,
          topics: watch.parsedTopics,
          createdAt: dayjs(watch.createdAt).tz(getUserTimeZone()).format("YYYY-MM-DD"),
          recentAlerts: recentAlerts.map(a => ({
            title: a.title,
            sourceName: a.sourceName || "Unknown",
            createdAt: dayjs(a.createdAt).tz(getUserTimeZone()).format("YYYY-MM-DD"),
          })),
        };
      })
    );

    const expiryResult = await sdk.callLLM(
      checkExpiryBatchTemplate({ watches: watchesWithAlerts }),
      Type.Object({
        results: Type.Array(Type.Object({
          watchId: Type.Number(),
          shouldComplete: Type.Boolean(),
          reason: Type.Optional(Type.String()),
        })),
      }),
      { modelVariant: "FAST" }
    );

    if (expiryResult?.results) {
      for (const result of expiryResult.results) {
        if (!result.shouldComplete) continue;

        const watch = allActiveWatches.find(w => w.id === result.watchId);
        if (!watch) continue;

        await db.update(watches)
          .set({ status: "completed", updatedAt: now })
          .where(eq(watches.id, result.watchId));
        console.log("runExpiryCheck: auto-completed watch", result.watchId, "reason:", result.reason);

        // Archive processedItems for this completed watch
        try {
          const itemsToArchive = await db.select().from(processedItems)
            .where(eq(processedItems.watchId, result.watchId));
          if (itemsToArchive.length > 0) {
            await db.insert(staleProcessedItems).values(itemsToArchive.map(item => ({
              owner: item.owner,
              uniqueId: item.uniqueId,
              sourceType: item.sourceType,
              watchId: item.watchId,
              processedAt: item.processedAt,
            })));
            await db.delete(processedItems).where(eq(processedItems.watchId, result.watchId));
            console.log("runExpiryCheck: archived", itemsToArchive.length, "processedItems for completed watch", result.watchId);
          }
        } catch (archiveErr) {
          console.error("runExpiryCheck: failed to archive processedItems for watch", result.watchId, archiveErr);
        }

        try {
          await create_agent_post(sdk, {
            shortMessage: `Watch completed: ${watch.description.substring(0, 50)}`,
            attachments: [{
              type: "markdown",
              content: `Your watch **"${watch.description}"** has been automatically completed.\n\n**Reason:** ${result.reason || "The purpose of this watch appears to have been fulfilled."}`,
            }],
            duration: "read_once",
            priority: "normal",
          });
        } catch (err) {
          console.error("runExpiryCheck: failed to notify about completed watch", err);
        }
      }
    }
  } catch (error) {
    console.error("runExpiryCheck: batch expiry check failed", error);
  }
}

// ─── NON-NEWS SOURCE PROCESSING (direct in background function) ──

/** Process non-news sources directly — these are fast (2-6 calls each) and won't hang */
async function processNonNewsSources(
  sdk: ServerSdk,
  db: ReturnType<ServerSdk["db"]>,
  watch: typeof watches.$inferSelect,
  owner: string,
  now: Date
) {
  const sources: string[] = JSON.parse(watch.sourceTypes);
  const checks: Promise<void>[] = [];

  if (sources.includes("web") && watch.webUrl) {
    checks.push(
      checkWebForWatch(sdk, db, watch, owner, now)
        .catch(error => { console.error("processNonNewsSources: web check failed for watch", watch.id, error); })
    );
  }

  if (sources.includes("web") && watch.targetPrice) {
    checks.push(
      checkPriceForWatch(sdk, db, watch, owner, now)
        .catch(error => { console.error("processNonNewsSources: price check failed for watch", watch.id, error); })
    );
  }

  if (sources.includes("calendar")) {
    checks.push(
      checkCalendarForWatch(sdk, db, watch, owner, now)
        .catch(error => { console.error("processNonNewsSources: calendar check failed for watch", watch.id, error); })
    );
  }

  if (sources.includes("flight")) {
    checks.push(
      checkFlightForWatch(sdk, db, watch, owner, now)
        .catch(error => { console.error("processNonNewsSources: flight check failed for watch", watch.id, error); })
    );
  }

  if (sources.includes("contacts")) {
    checks.push(
      checkContactsForWatch(sdk, db, watch, owner, now)
        .catch(error => { console.error("processNonNewsSources: contacts check failed for watch", watch.id, error); })
    );
  }

  if (sources.includes("slack")) {
    checks.push(
      checkSlackForWatch(sdk, db, watch, owner, now)
        .catch(error => { console.error("processNonNewsSources: slack check failed for watch", watch.id, error); })
    );
  }

  if (checks.length > 0) {
    await Promise.allSettled(checks);
    console.log("processNonNewsSources: completed", checks.length, "checks for watch", watch.id);
  }
}

/** Check if a watch has news as a source type */
function hasNewsSource(watch: typeof watches.$inferSelect): boolean {
  const sources: string[] = JSON.parse(watch.sourceTypes);
  return sources.includes("news");
}

/** Check if a watch has non-news sources */
function hasNonNewsSources(watch: typeof watches.$inferSelect): boolean {
  const sources: string[] = JSON.parse(watch.sourceTypes);
  return sources.some(s => s !== "news");
}

// ─── WATCH DUE CHECK (frequency-based) ──────────────────────────

/** Get the effective check interval for a watch, falling back to urgency-based defaults */
function getEffectiveCheckInterval(watch: typeof watches.$inferSelect): number {
  if (watch.checkInterval != null) return watch.checkInterval;
  // Legacy fallback: instant = 120 min (2 hours), digest = 1440 min (daily)
  return watch.urgency === "instant" ? 120 : 1440;
}

/** Check if a watch is due for checking based on its frequency settings */
function isWatchDue(watch: typeof watches.$inferSelect, now: Date): boolean {
  const interval = getEffectiveCheckInterval(watch);
  const nowDayjs = dayjs(now).tz(getUserTimeZone());

  // Sub-daily watches: simple interval check
  if (interval < 1440) {
    if (!watch.lastCheckedAt) return true;
    const elapsed = now.getTime() - watch.lastCheckedAt.getTime();
    return elapsed >= interval * 60 * 1000;
  }

  // Daily watches: check if current time matches preferredTime (within 15-min window)
  if (interval === 1440) {
    const preferredTime = watch.preferredTime || watch.digestTime || "08:00";
    const [prefHour, prefMin] = preferredTime.split(":").map(Number);
    const currentHour = nowDayjs.hour();
    const currentMin = nowDayjs.minute();

    // Check if we're within the 15-min window starting at preferredTime
    const prefTotalMin = (prefHour || 0) * 60 + (prefMin || 0);
    const currentTotalMin = currentHour * 60 + currentMin;
    const inWindow = currentTotalMin >= prefTotalMin && currentTotalMin < prefTotalMin + 15;

    if (!inWindow) return false;
    if (!watch.lastCheckedAt) return true;

    // Must be at least 20 hours since last check (handles edge cases)
    const elapsed = now.getTime() - watch.lastCheckedAt.getTime();
    return elapsed >= 20 * 60 * 60 * 1000;
  }

  // Weekly watches: check day + time
  if (interval === 10080) {
    const preferredDay = watch.preferredDay || "monday";
    const currentDay = nowDayjs.format("dddd").toLowerCase();
    if (currentDay !== preferredDay) return false;

    const preferredTime = watch.preferredTime || watch.digestTime || "08:00";
    const [prefHour, prefMin] = preferredTime.split(":").map(Number);
    const currentHour = nowDayjs.hour();
    const currentMin = nowDayjs.minute();

    const prefTotalMin = (prefHour || 0) * 60 + (prefMin || 0);
    const currentTotalMin = currentHour * 60 + currentMin;
    const inWindow = currentTotalMin >= prefTotalMin && currentTotalMin < prefTotalMin + 15;

    if (!inWindow) return false;
    if (!watch.lastCheckedAt) return true;

    const elapsed = now.getTime() - watch.lastCheckedAt.getTime();
    return elapsed >= 6 * 24 * 60 * 60 * 1000; // At least 6 days
  }

  // Custom intervals: treat as sub-daily
  if (!watch.lastCheckedAt) return true;
  const elapsed = now.getTime() - watch.lastCheckedAt.getTime();
  return elapsed >= interval * 60 * 1000;
}

// ─── SIDEKICK TASK DISPATCHER (news only) ───────────────────────

async function dispatchWatchTask(
  sdk: ServerSdk,
  db: ReturnType<ServerSdk["db"]>,
  watch: typeof watches.$inferSelect,
  owner: string,
) {
  // Minimal context — the task pulls its own data via exported functions
  // (checkProcessedUrls, getDismissalPatterns, getPastReports, markUrlsProcessed)
  const watchData = {
    id: watch.id,
    description: watch.description,
    parsedTopics: watch.parsedTopics,
  };

  const currentDate = dayjs().tz(getUserTimeZone()).format("YYYY-MM-DD HH:mm:ss z");

  const taskResult = await create_sidekick_task(sdk, {
    instructions: checkWatchesTaskTemplate({
      watch: watchData,
      currentDate,
    }),
    description: `Check watch: ${watch.description.substring(0, 50)}`,
    completionCallback: "onWatchCheckComplete",
  });

  console.log("dispatchWatchTask: dispatched task for watch", watch.id, "sandboxId:", taskResult.sandboxId, "isExisting:", taskResult.isExisting);
  return taskResult;
}

// ─── CHECK WATCHES (frequency-based + source-routed) ────────────

export const checkWatches = backgroundFunction({
  description: "Check all active watches for new matches (cron handler)",
  params: Type.Object({}),
  exported: true,
  execute: async (sdk: ServerSdk) => {
    const db = sdk.db<typeof schema>();
    const owner = sdk.getUser().email;
    const now = dayjs().tz(getUserTimeZone()).toDate();

    // ─── AUTO-MIGRATE LEGACY WATCHES (no checkInterval set) ───
    const legacyWatches = await db.select().from(watches)
      .where(and(eq(watches.owner, owner), eq(watches.status, "active")));

    for (const w of legacyWatches) {
      if (w.checkInterval == null) {
        const newInterval = w.urgency === "instant" ? 120 : 1440;
        const newPreferredTime = w.urgency === "digest" ? (w.digestTime || "08:00") : null;
        await db.update(watches)
          .set({ checkInterval: newInterval, preferredTime: newPreferredTime, updatedAt: now })
          .where(eq(watches.id, w.id));
        console.log("checkWatches: migrated legacy watch", w.id, "→ checkInterval:", newInterval);
      }
    }

    // ─── AUTO-RESUME SNOOZED WATCHES ───
    const snoozedWatches = await db.select().from(watches)
      .where(and(
        eq(watches.owner, owner),
        eq(watches.status, "paused"),
        isNotNull(watches.snoozeUntil),
        lte(watches.snoozeUntil, now),
      ));

    for (const snoozed of snoozedWatches) {
      await db.update(watches)
        .set({ status: "active", snoozeUntil: null, updatedAt: now })
        .where(eq(watches.id, snoozed.id));
      console.log("checkWatches: auto-resumed snoozed watch", snoozed.id, "—", snoozed.description);
    }

    // ─── SELECT ALL ACTIVE WATCHES & FILTER DUE ───
    const allActiveWatches = await db.select().from(watches)
      .where(and(eq(watches.owner, owner), eq(watches.status, "active")));

    const dueWatches = allActiveWatches.filter(w => isWatchDue(w, now));

    console.log("checkWatches:", dueWatches.length, "due watches out of", allActiveWatches.length, "active");

    if (dueWatches.length > 0) {
      // ─── CHECK FOR ALREADY RUNNING SIDEKICK TASKS ───
      let alreadyRunningDescriptions: string[] = [];
      try {
        const running = await query_running_sidekick_tasks(sdk, {});
        alreadyRunningDescriptions = running.runningAgents.map(a => a.description);
        console.log("checkWatches:", running.count, "sidekick tasks already running");
      } catch (err) {
        console.error("checkWatches: failed to query running tasks, proceeding anyway", err);
      }

      let newsDispatched = 0;
      let newsSkipped = 0;
      let directProcessed = 0;

      for (const watch of dueWatches) {
        // ─── NEWS → Sidekick Task (async, won't hang background function) ───
        if (hasNewsSource(watch)) {
          const taskDescription = `Check watch: ${watch.description.substring(0, 50)}`;

          if (alreadyRunningDescriptions.some(d => d === taskDescription)) {
            console.log("checkWatches: task already running for watch", watch.id, "— skipping news");
            newsSkipped++;
          } else {
            try {
              await dispatchWatchTask(sdk, db, watch, owner);
              newsDispatched++;
            } catch (err) {
              console.error("checkWatches: failed to dispatch news task for watch", watch.id, err);
            }
          }
        }

        // ─── Non-news sources → process directly (fast, 2-6 calls each) ───
        if (hasNonNewsSources(watch)) {
          try {
            await processNonNewsSources(sdk, db, watch, owner, now);
            directProcessed++;
          } catch (err) {
            console.error("checkWatches: direct processing failed for watch", watch.id, err);
          }
        }

        // Update lastCheckedAt for non-news-only watches (news updates via callback)
        if (!hasNewsSource(watch)) {
          await db.update(watches)
            .set({ lastCheckedAt: now })
            .where(eq(watches.id, watch.id));
        }
      }

      console.log("checkWatches: news dispatched:", newsDispatched, "skipped:", newsSkipped, "direct processed:", directProcessed);
    }

    // ─── BATCH EXPIRY CHECK (lightweight, stays in background function) ───
    try {
      await runExpiryCheck(sdk, db, owner, allActiveWatches, now);
    } catch (err) {
      console.error("checkWatches: expiry check failed", err);
    }

    console.log("checkWatches: done");
  },
});

// ─── MANUAL CHECK ───────────────────────────────────────────────

export const runCheckNow = backgroundFunction({
  description: "Manually trigger a check for watches. If watchId is provided, checks only that specific watch. Otherwise checks all active watches. Use getWatches first to find the watchId.",
  params: Type.Object({
    watchId: Type.Optional(Type.Number({ description: "Specific watch ID to check. Omit to check all watches." })),
  }),
  exported: true,
  execute: async (sdk: ServerSdk, { watchId }) => {
    const db = sdk.db<typeof schema>();
    const owner = sdk.getUser().email;

    const now = dayjs().tz(getUserTimeZone()).toDate();

    if (watchId) {
      console.log("runCheckNow: starting manual check for watch", watchId);

      const watchResults = await db.select().from(watches)
        .where(and(eq(watches.id, watchId), eq(watches.owner, owner), eq(watches.status, "active")))
        .limit(1);

      const watch = watchResults[0];
      if (!watch) {
        console.log("runCheckNow: watch not found or not active:", watchId);
        return;
      }

      // Source-based routing: news → Sidekick Task, others → direct
      if (hasNewsSource(watch)) {
        try {
          await dispatchWatchTask(sdk, db, watch, owner);
          console.log("runCheckNow: dispatched news task for watch", watchId);
        } catch (error) {
          console.error("runCheckNow: failed to dispatch news task for watch", watchId, error);
        }
      }

      if (hasNonNewsSources(watch)) {
        try {
          await processNonNewsSources(sdk, db, watch, owner, now);
          console.log("runCheckNow: processed non-news sources for watch", watchId);
        } catch (error) {
          console.error("runCheckNow: non-news processing failed for watch", watchId, error);
        }
      }

      // Update lastCheckedAt if no news source (news updates via callback)
      if (!hasNewsSource(watch)) {
        await db.update(watches)
          .set({ lastCheckedAt: now })
          .where(eq(watches.id, watch.id));
      }
    } else {
      console.log("runCheckNow: starting manual check for all watches");
      const allActiveWatches = await db.select().from(watches)
        .where(and(eq(watches.owner, owner), eq(watches.status, "active")));

      let newsDispatched = 0;
      let directProcessed = 0;
      for (const watch of allActiveWatches) {
        if (hasNewsSource(watch)) {
          try {
            await dispatchWatchTask(sdk, db, watch, owner);
            newsDispatched++;
          } catch (err) {
            console.error("runCheckNow: failed to dispatch news task for watch", watch.id, err);
          }
        }

        if (hasNonNewsSources(watch)) {
          try {
            await processNonNewsSources(sdk, db, watch, owner, now);
            directProcessed++;
          } catch (err) {
            console.error("runCheckNow: non-news processing failed for watch", watch.id, err);
          }
        }

        if (!hasNewsSource(watch)) {
          await db.update(watches)
            .set({ lastCheckedAt: now })
            .where(eq(watches.id, watch.id));
        }
      }
      console.log("runCheckNow: news dispatched:", newsDispatched, "direct processed:", directProcessed, "total:", allActiveWatches.length);
    }
  },
});

// sendDigest removed — checkWatches now handles all watches via frequency-based scheduling
