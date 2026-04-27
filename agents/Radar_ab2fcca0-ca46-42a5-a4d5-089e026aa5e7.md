# Agent: Radar

**ID:** ab2fcca0-ca46-42a5-a4d5-089e026aa5e7

## Description

# OVERVIEW
Radar is a universal monitoring agent that watches multiple information sources (email, news feeds, web sources) for updates matching your interests. When something you care about happens, Radar alerts you with context and a clear explanation of why it matched—eliminating the need to manually check dozens of sources. Create watches in plain language, set urgency levels (instant or digest), and train the system through feedback to reduce false alerts.

# KEY FEATURES
- **Natural language watch creation**, describe what you want to monitor in plain text—no filters or config screens needed. The system asks clarifying questions if your intent is ambiguous, then activates a structured watch.
- **Multi-source monitoring**, watches track email inboxes (Gmail, Outlook), RSS feeds, news APIs, and **web** sources. Matches are evaluated against your watch criteria and delivered as alerts with source context.
- **Smart alert delivery**, choose instant push notifications for urgent watches or daily/weekly digests for lower-priority items. Each alert explains why it matched and links to the source.
- **Feedback loop and refinement**, dismiss irrelevant alerts and the system learns. Track your watches, pause/resume/edit them, and auto-retire watches when their purpose is fulfilled (e.g., after a ruling is published).
- **Cross-platform sync**, access watches and manage alerts on web and mobile. Dismissals and edits sync instantly across all devices.

# VERBATIM INSTRUCTIONS
Radar | Smart Remainder Agent


1. Problem Statement
People are surrounded by information streams — email, news, apps, government portals, e-commerce sites, social media — but they have no unified way to say “tell me when something I care about happens.” Instead, they resort to repeatedly checking dozens of sources, setting crude keyword alerts that generate noise, or simply missing things that matter.
A parent misses the school district’s enrollment window because it was buried in a newsletter. A renter doesn’t see the apartment price drop because they stopped refreshing Zillow. A patient misses a cancellation slot with their specialist because the portal notification went to spam. These aren’t edge cases — they’re everyday life.
The cost of not solving this is measured in missed opportunities, wasted time, unnecessary anxiety, and the cognitive load of manually tracking things that a system should handle.
2. Goals
•	Reduce missed life moments: Users should catch at least 90% of the events and updates they previously missed, within the first 30 days of active use.
•	Eliminate manual checking: Reduce the number of times users manually check information sources by 70% within 60 days.
•	Build trust through precision: Achieve a signal-to-noise ratio where at least 80% of alerts are rated “useful” by the user.
•	Make intent expression effortless: 90% of users should be able to set up their first watch in under 2 minutes, using natural language, with no configuration screens.
•	Become a daily habit: Achieve 60% weekly active usage among users who have at least 3 active watches.
3. Non-Goals
•	Not a task manager or to-do app. Radar tells you when something happens. It does not help you plan or organize your response. Integrating task management adds complexity without serving the core “watch and alert” loop.
•	Not a financial advisor. Radar can alert you when a price drops or a rate changes, but it will not recommend whether to buy, sell, or act. Offering advice introduces regulatory and liability concerns.
•	Not a social media monitoring tool for brands. The product is built for personal use. Brand monitoring, sentiment analysis, and marketing analytics are a different product category.
•	Not building custom scrapers for v1. Source integrations will use official APIs and structured feeds. Screen scraping introduces fragility and legal risk.
•	No automation or actions. Radar will not auto-purchase, auto-reply, or auto-book on your behalf. The user is always the decision-maker. Automation introduces safety and trust risks that are premature for v1.
 
4. User Stories
4.1 Watch Creation
•	As a user, I want to describe what I care about in plain language so that I don’t need to learn filters, boolean logic, or configuration screens.
•	As a user, I want the system to ask me smart follow-up questions when my intent is vague so that my watch is precise enough to avoid noise.
•	As a user, I want to set the urgency level of a watch (instant, daily digest, weekly summary) so that I’m not overwhelmed by non-urgent alerts.
•	As a user, I want to see example watches when I first open the app so that I understand what’s possible and get inspired.
4.2 Personal Life Watches
•	As a parent, I want to watch for enrollment openings at specific schools or programs so that I don’t miss application windows for my kids.
•	As a renter, I want to track apartment listings matching my criteria so that I’m the first to know when something opens up.
•	As a patient, I want to watch for cancellation slots with a specific doctor so that I can get an earlier appointment.
•	As a consumer, I want to set a target price for a product and be alerted when it drops below that price so that I get the best deal without checking daily.
•	As a traveler, I want to watch for flight deals to specific destinations within a date range so that I can book when the price is right.
•	As a homeowner, I want to be alerted when my property tax assessment is published so that I have time to review and dispute if needed.
•	As a job seeker, I want to passively watch for roles matching my criteria at specific companies so that I’m aware of opportunities even when not actively searching.
4.3 Relationship and Wellbeing Watches
•	As a busy professional, I want to be reminded if I haven’t reached out to a close friend or family member in a while so that I stay connected to the people who matter.
•	As a user, I want to watch for free evenings in my calendar and get nudged to make plans so that I don’t let social time slip away.
•	As a hobbyist, I want to be alerted when tickets go on sale for events I’d enjoy so that I don’t find out after they’re sold out.
4.4 Alerts and Digests
•	As a user, I want each alert to explain why it matched my watch, not just that it matched, so that I can quickly decide whether to act.
•	As a user, I want to receive a daily digest of lower-priority matches so that I stay informed without being interrupted.
•	As a user, I want to dismiss an alert and have the system learn from that so that future alerts become more relevant.
•	As a user, I want to snooze a watch temporarily so that I can pause it during vacation without deleting it.
4.5 Cross-Source Intelligence
•	As a user, I want the system to connect dots across multiple sources and alert me to patterns so that I notice things I wouldn’t catch by checking each source individually.
•	As a user, I want the system to proactively suggest new watches based on my activity so that I discover monitoring opportunities I hadn’t thought of.
4.6 Workplace Watches (Secondary)
•	As a team lead, I want to watch for messages where a teammate sounds frustrated or blocked so that I can offer support early.
•	As a manager, I want to be alerted if a project deadline is at risk based on signals across email and project tools so that I can intervene before it’s too late.
•	As an employee, I want to watch for internal job postings matching my growth goals so that I’m aware of opportunities within my company.
 
5. Requirements
5.1 Must-Have (P0)
Requirement	Description & Acceptance Criteria
Natural language watch creation	User describes a watch in plain text. The LLM parses intent, extracts key parameters (topic, threshold, location, time constraints), and creates a structured watch. Acceptance: user can create a watch without touching any dropdown, slider, or config screen.
Clarifying conversation	When a watch description is ambiguous, the system asks 1–3 follow-up questions to sharpen intent before activating the watch. Acceptance: vague inputs like “cheap flights” produce clarifying questions about destination, dates, and budget.
Email source integration	Connect a user’s email (Gmail, Outlook) and monitor incoming messages against active watches. Acceptance: new emails matching a watch trigger an alert within 5 minutes.
News and web feed monitoring	Monitor RSS feeds, news APIs, and structured web sources for matches. Acceptance: a watch for “news about [topic]” surfaces relevant articles from major sources.
Alert delivery with context	Each alert includes: the matched content snippet, a plain-language explanation of why it matched, the source link, and the watch it relates to. Acceptance: user can understand and act on an alert without opening the source.
Instant and digest modes	User chooses per-watch whether to receive instant push notifications or a batched daily/weekly digest. Acceptance: digest arrives at the user’s chosen time with a clean summary.
Dismiss and feedback loop	User can dismiss an alert as irrelevant. System uses dismissals to refine future matching for that watch. Acceptance: after 5+ dismissals on a theme, false positives on that theme decrease measurably.
Multi-platform access	Available as mobile app (iOS, Android) and web dashboard. Alerts are synced across platforms. Acceptance: an alert dismissed on mobile does not reappear on web.
Watch management	User can view, edit, pause, resume, and delete watches. Acceptance: all CRUD operations work and changes take effect within 60 seconds.
Expiring watches	Watches that auto-deactivate when their purpose is fulfilled. E.g., a watch for a court ruling that retires once the ruling is published.

5.2 Nice-to-Have (P1)
Requirement	Description & Acceptance Criteria
Calendar integration	Connect Google Calendar or Outlook. Enable watches like “alert me if I have 3 free evenings this week” or “warn me if someone books over my focus time.”
Price and deal tracking	Integrate with e-commerce and travel APIs to track prices. User sets a target price; system alerts when it’s met.
Relevance scoring	Each alert shows a confidence level (high / medium / low). User can configure per-watch minimum confidence to control noise.
Relationship nudges	Track communication patterns with user-designated contacts. Nudge if no interaction has occurred within a user-set window.
Watch suggestions	System proactively suggests new watches based on the user’s existing watches and alert interaction patterns.
Snooze and scheduling	Temporarily pause a watch for a set duration. Useful for vacations or temporary situations.
Workplace integrations	Connect Slack, Jira, GitHub, and other work tools for workplace-oriented watches.
Government and civic sources	Monitor government portals, court dockets, city council agendas, immigration status pages, etc.
Cross-source synthesis	Correlate signals across multiple sources to surface patterns no single source would reveal. E.g., combining a news article + an email + a calendar event into one alert.

5.3 Future Considerations (P2)
Requirement	Description & Acceptance Criteria
	
Shared watches	Allow multiple users (families, teams) to share a watch and receive alerts collectively.
Conditional / chained watches	Enable watches that activate only when a condition is met. E.g., “If the Fed raises rates, start watching mortgage rates.”

## Server Functions (17)

### checkWatches

**Description:** Check all active watches for new matches (cron handler)

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### createWatch

**Description:** Create a new watch from natural language description

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "description"
  ],
  "properties": {
    "webUrl": {
      "type": "string",
      "description": "Optional URL to monitor"
    },
    "urgency": {
      "type": "string",
      "description": "'instant' or 'digest'"
    },
    "description": {
      "type": "string",
      "minLength": 1,
      "description": "Natural language description of what to monitor"
    }
  }
}
```

### deleteWatch

**Description:** Delete a watch

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
      "description": "Watch ID"
    }
  }
}
```

### dismissAlert

**Description:** Dismiss an alert and optionally learn from it

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
      "description": "Alert ID"
    },
    "feedback": {
      "type": "string",
      "description": "Why the alert was irrelevant"
    }
  }
}
```

### getAlertCounts

**Description:** Get count of unread alerts, both total and per watch

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getAlerts

**Description:** Get alerts for the current user

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "limit": {
      "type": "number",
      "description": "Max alerts to return"
    },
    "watchId": {
      "type": "number",
      "description": "Filter by watch ID"
    },
    "includeRead": {
      "type": "boolean",
      "description": "Include read alerts"
    }
  }
}
```

### getUserProfile

**Description:** Get the current user's profile

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### getWatches

**Description:** Get all watches for the current user

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### handleIncomingEmail

**Description:** Process incoming emails and match against active watches

**Input Schema:**

```json
{
  "type": "object",
  "required": [
    "messages",
    "totalCount",
    "batchSize"
  ],
  "properties": {
    "messages": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "from",
          "to",
          "subject",
          "timestamp",
          "messageId",
          "account"
        ],
        "properties": {
          "to": {
            "type": "string"
          },
          "body": {
            "type": "string"
          },
          "from": {
            "type": "string"
          },
          "labels": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "account": {
            "type": "string"
          },
          "subject": {
            "type": "string"
          },
          "threadId": {
            "type": "string"
          },
          "messageId": {
            "type": "string"
          },
          "timestamp": {
            "type": "string"
          },
          "attachments": {
            "type": "array",
            "items": {
              "type": "object",
              "required": [
                "filename",
                "mimeType"
              ],
              "properties": {
                "size": {
                  "type": "number"
                },
                "filename": {
                  "type": "string"
                },
                "mimeType": {
                  "type": "string"
                },
                "attachmentId": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "batchSize": {
      "type": "number"
    },
    "totalCount": {
      "type": "number"
    }
  }
}
```

### initializeProfile

**Description:** Initialize user profile from Sidekick knowledge (call once)

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### main

**Description:** Scheduled check for all watches

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### markAlertRead

**Description:** Mark an alert as read

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
      "description": "Alert ID"
    }
  }
}
```

### runCheckNow

**Description:** Manually trigger a check for all active watches

**Input Schema:**

```json
{
  "type": "object",
  "properties": {}
}
```

### saveProfile

**Description:** Save or update user profile

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "location": {
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
```

### sendDigest

**Description:** Send daily digest of new alerts

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
    "location": {
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
```

### updateWatch

**Description:** Update a watch's settings

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
      "description": "Watch ID"
    },
    "status": {
      "type": "string"
    },
    "urgency": {
      "type": "string"
    },
    "description": {
      "type": "string"
    }
  }
}
```

