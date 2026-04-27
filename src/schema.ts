import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

// User profile — interests, location, preferences
export const userProfile = sqliteTable("user_profile", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  owner: text("owner").notNull(),
  location: text("location"),
  interests: text("interests"), // JSON array
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Watches — what the user wants to monitor
// sourceTypes can include: "email", "news", "web", "calendar", "flight", "contacts", "slack"
export const watches = sqliteTable("watches", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  owner: text("owner").notNull(),
  description: text("description").notNull(), // User's original natural language
  parsedTopics: text("parsed_topics").notNull(), // JSON array of extracted topics/keywords
  sourceTypes: text("source_types").notNull(), // JSON array: ["email", "news", "web", "calendar", "flight", "contacts", "slack"]
  urgency: text("urgency").notNull().default("digest"), // "instant" or "digest"
  status: text("status").notNull().default("active"), // "active", "paused", "completed"
  webUrl: text("web_url"), // Optional URL to monitor for web watches
  targetPrice: text("target_price"), // Optional target price for price/deal tracking (stored as string for flexibility)
  flightNumber: text("flight_number"), // Optional flight number for flight tracking (e.g., "UA123")
  slackChannels: text("slack_channels"), // Optional JSON array of Slack channel IDs to monitor
  contactEmails: text("contact_emails"), // Optional JSON array of contact emails to watch for relationship nudges
  digestTime: text("digest_time"), // Preferred daily digest time in "HH:mm" format (user's timezone), null = default 08:00
  checkInterval: integer("check_interval"), // Minutes between checks: 15, 30, 60, 120, 240, 1440, 10080. Null = legacy (use urgency field)
  preferredTime: text("preferred_time"), // "HH:mm" for daily/weekly watches (user's timezone), null for sub-daily
  preferredDay: text("preferred_day"), // "monday"-"sunday" for weekly watches, null otherwise
  snoozeUntil: integer("snooze_until", { mode: "timestamp" }), // When to auto-resume from snooze
  lastCheckedAt: integer("last_checked_at", { mode: "timestamp" }), // When this watch was last checked
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Alerts — matches found by monitoring
export const alerts = sqliteTable("alerts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  owner: text("owner").notNull(),
  watchId: integer("watch_id").notNull(),
  sourceType: text("source_type").notNull(), // "email", "news", "web", "calendar", "flight", "contacts", "slack"
  title: text("title").notNull(),
  snippet: text("snippet").notNull(), // Matched content excerpt
  explanation: text("explanation").notNull(), // Why it matched
  sourceUrl: text("source_url"), // Link to original
  sourceName: text("source_name"), // e.g. "TechCrunch", "Gmail"
  fullContent: text("full_content"), // Rich markdown report (detailed analysis)
  confidence: text("confidence"), // "high", "medium", "low" — relevance confidence
  dismissed: integer("dismissed", { mode: "boolean" }).notNull().default(false),
  dismissFeedback: text("dismiss_feedback"), // Why user dismissed
  read: integer("read", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// Processed items — deduplication tracking
export const processedItems = sqliteTable("processed_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  owner: text("owner").notNull(),
  uniqueId: text("unique_id").notNull(), // messageId for email, URL for news/web
  sourceType: text("source_type").notNull(),
  watchId: integer("watch_id"), // nullable — for cleanup on watch completion
  processedAt: integer("processed_at", { mode: "timestamp" }).notNull(),
}, (table) => [
  uniqueIndex("processed_items_unique").on(table.owner, table.uniqueId, table.watchId),
]);

// Stale processed items — archived from completed/deleted watches
export const staleProcessedItems = sqliteTable("stale_processed_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  owner: text("owner").notNull(),
  uniqueId: text("unique_id").notNull(),
  sourceType: text("source_type").notNull(),
  watchId: integer("watch_id"),
  processedAt: integer("processed_at", { mode: "timestamp" }).notNull(),
});

// Dismissal patterns — learn from user feedback
export const dismissalPatterns = sqliteTable("dismissal_patterns", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  owner: text("owner").notNull(),
  watchId: integer("watch_id").notNull(),
  pattern: text("pattern").notNull(), // JSON: keywords/sources to down-rank
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
