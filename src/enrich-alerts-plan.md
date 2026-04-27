# Enrich Alerts — Implementation Plan

## Goal

Make Radar produce proper readable reports instead of shallow 1-2 sentence snippets. Every alert source (news, web, Gemini, email) should give you a meaningful summary you can actually read and understand without clicking through.

## Task Breakdown

| # | Task | What happens |
|---|------|-------------|
| **1** | Read database migration skill | Need to learn the safe way to add columns before touching schema |
| **2** | Read frontend design skill | Need to follow the right patterns for the expanded alert UI |
| **3** | Read prompt templates skill | Need to follow the right patterns for new/updated prompts |
| **4** | Read callLLM skill | Need to understand model variant choices for the enrichment step |
| **5** | Add `fullContent` column to `alerts` table in `schema.ts` | New nullable text column to store the rich report alongside the existing short snippet |
| **6** | Create `src/prompts/enrich-article.handlebars` | New prompt that takes full article text + watch context and produces a proper readable report (key facts, why it matters, relevant details) |
| **7** | Update `src/prompts/match-web-to-watch.handlebars` | Add `fullContent` to the output — it already has the full page content, just needs to produce a richer summary |
| **8** | Update `src/prompts/match-email-to-watches.handlebars` | Same — already has full email body, add `fullContent` to output |
| **9** | Modify `checkNewsForWatch` in `server.ts` | After headline matching identifies hits, crawl each matched article URL with `crawlUrlMarkdown`, truncate to ~8K chars, pass to enrichment prompt, store result in `fullContent`. Cap at 3 crawls per query. Wrap in try/catch so failures fall back to headline-only snippet. |
| **10** | Modify `checkWebForWatch` in `server.ts` | Use the new richer output from the updated web prompt, store `fullContent` |
| **11** | Modify `checkGeminiForWatch` in `server.ts` | Same — use richer output, store `fullContent` |
| **12** | Modify `handleIncomingEmail` in `server.ts` | Use richer output from updated email prompt, store `fullContent` |
| **13** | Update `src/prompts/digest-summary.handlebars` | Feed truncated `fullContent` (when available) instead of short snippets, so the daily digest is also more informative |
| **14** | Update `AlertCard` in `App.tsx` | Make alerts expandable — tap to reveal the full report. Show snippet in collapsed view, `fullContent` in expanded view. Fall back to snippet if `fullContent` is missing. |
| **15** | Typecheck and build | `bun run typecheck && bun run build` |
| **16** | Push | `dreamer push` |

## Key Design Decisions

- **Filter first, crawl second** — headline matching stays as a cheap filter. We only spend time/money crawling articles that already matched. Keeps costs low.
- **Graceful fallback everywhere** — if a crawl fails (paywall, timeout, bot-blocking), the alert still gets created with the short snippet. No data lost.
- **Truncation limits** — crawled content capped at ~8K chars before sending to AI. Digest uses truncated `fullContent` (~1K chars per alert) to avoid prompt bloat.
- **Cap crawls per run** — max 3 full article crawls per query per watch, so one check cycle doesn't become extremely slow or expensive.
- **Short snippet stays** — used for push notifications, widget view, and the collapsed alert card. `fullContent` is the expanded "read more" view.

## What Stays the Same

- Watch creation and parsing
- Deduplication logic (processedItems table)
- Dismissal learning
- Instant push notifications (still use short snippet)
- Cron schedule (every 2 hours)
- Profile/settings
