---
name: alignment
description: Understanding and resolving alignment errors. When Sidekick calls or tasks are blocked, review and update your agent's description to match its actual functionality.
---

# Alignment

The platform checks that data your agent accesses or modifies aligns with the stated purpose and features in the agent description. If a mismatch is detected, the action is blocked with an alignment error.

## What Triggers Alignment Errors

Two action types are checked against the agent's description:

1. **`sdk.sidekickWithSchema` calls** — Queries to Sidekick for user context or memory
2. **`create_sidekick_task` tasks** — Autonomous background tasks delegated to Sidekick

When the platform determines that a call or task doesn't match what the agent's description says it does, the action is blocked and you'll see a message like:

> This sidekick call was blocked because it does not align with the agent's stated purpose. Please review your agent's description and ensure requests match its intended functionality.

## Example: Alignment Failure and Resolution

A **Trip Planner** agent is described as:

> "Helps users plan trips by finding flights, hotels, and activities."

The developer adds a new feature: an email-powered dashboard that reads the user's inbox for booking confirmations and receipts. A Sidekick Task is created to scan emails for trip-related data.

**Result:** The task is blocked. The agent's description says nothing about accessing email or aggregating receipts — only about finding flights, hotels, and activities.

**Resolution:** Update the description to cover the new functionality:

```bash
dreamer set-description "Helps users plan trips by finding flights, hotels, and activities. Monitors email for trip-related confirmations and receipts to provide a consolidated dashboard."
```

Now the Sidekick Task to scan emails aligns with the stated purpose, and the action succeeds.

## How to Iterate on Your Description

Use the `dreamer` CLI to view and update your agent's description:

```bash
# View the current description
dreamer get-description

# Set a new description explicitly
dreamer set-description "Your updated description here."

# Auto-generate a description from the PRD
dreamer set-description --generate
```

**Workflow when you hit an alignment error:**

1. `dreamer get-description` — see what the platform thinks your agent does
2. Compare with the action that was blocked — identify what's missing
3. `dreamer set-description "..."` — update to cover the blocked functionality.
4. Retry the blocked action

CRITICAL: While iterating, try to make incremental changes, preserving content that is not problematic, while also keeping style, tone and conciceness consistent.

## Best Practices

- **Write descriptions that cover all data domains the agent will touch.** If your agent reads email, accesses calendars, or queries user preferences, say so in the description.
- **Be specific about external data access.** "Accesses email" is better than nothing, but "Reads email for booking confirmations" is more precise and less likely to cause issues.
- **Update the description when adding new features.** Any time you add a Sidekick call or task that touches a new data domain, update the description first.
- **Use `--generate` after major changes.** If you've significantly expanded the agent's capabilities, `dreamer set-description --generate` can produce a description from the PRD that covers everything.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Sidekick call blocked after adding a new feature | Update description to mention the new data domain or capability |
| Sidekick Task blocked but the feature seems related to the description | Make the connection more explicit — the check looks for clear alignment, not loose association |
| Everything was working, then calls started failing | Check if the description was recently changed or reset (e.g., by `--generate`) and no longer covers existing features |
| `dreamer set-description --generate` produces a description that causes blocks | The PRD may not mention all data access patterns — set the description explicitly instead |
