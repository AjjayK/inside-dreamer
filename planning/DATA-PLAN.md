# Data Plan for Radar

## External Data Requirements

1. **Email monitoring** — Monitor user's Gmail inbox for matches against active watches
   - Visual: None needed
2. **News monitoring** — Search news headlines and articles for topics matching watches
   - Visual: Source logos (provided by news tool), article images when available
3. **Web content monitoring** — Crawl specific URLs or search the web for watch-relevant updates
   - Visual: None needed
4. **User profile / interests** — Initialize user's interests and preferences from Sidekick
   - Visual: None needed

## User Profile

**Does this agent collect user profile data?** Yes

- Fields needed: interests (topics the user cares about), location (for local news/events)
- **Implementation**: See `skills/user-profiles/SKILL.md` for complete pattern
- **Sidekick Sync**: Profile changes must sync to Sidekick memory

## Data Sources

### 1. Email Monitoring

**Tool**: `mail` (Gmail integration via email triggers)
**Approach**: Use email triggers (published, catch-all for INBOX) to receive incoming emails. Match them against active watches using LLM classification.

**Test Command**: `dreamer call-tool -s mail -n listAccounts '{}'`
**Sample Output**: `{"accounts": [{"email": "ajjay.ferrari@gmail.com", "type": "gmail"}]}`

**Processing Strategy**:
- Email trigger fires on new INBOX emails
- For each email, use `sdk.callLLM` (FAST) to check if it matches any active watches
- If matched, create an alert with explanation

### 2. News & Web Search Monitoring

**Tool**: `news` (headlines, searchNews)
**Test Command**: `dreamer call-tool -s news -n headlines '{"topic": "technology", "maxResults": 3}'`
**Sample Output**: Returns structured headlines with title, url, description, pubDate, source, imageUrl, rankScore

**Test Command**: `dreamer call-tool -s news -n searchNews '{"query": "artificial intelligence", "maxResults": 3}'`
**Sample Output**: Returns similar structure from Hacker News and other sources

**Processing Strategy**:
- Cron trigger runs every 2 hours
- For each active watch with news/web source type, query news tool with relevant search terms
- Use `sdk.callLLM` (FAST) to evaluate relevance and extract match explanation
- Deduplicate by URL to avoid repeat alerts

### 3. Web Crawling (for specific URL watches)

**Tool**: `webcrawl` (crawlUrlMarkdown)
**Test Command**: `dreamer call-tool -s webcrawl -n crawlUrlMarkdown '{"url": "https://news.ycombinator.com"}'`
**Sample Output**: Returns markdown content of the page with metadata

**Processing Strategy**:
- Used within cron trigger for watches that specify a URL to monitor
- Crawl the URL, compare content to watch criteria via LLM
- Track previously seen content hashes to detect changes

### 4. Google Search (for broad web watches)

**Tool**: `googlesearch` (askGemini)
**Test Command**: `dreamer call-tool -s googlesearch -n askGemini '{"query": "school enrollment openings spring 2026 San Francisco"}'`
**Sample Output**: Returns AI-synthesized answer with sources and grounding supports

**Processing Strategy**:
- Used for watches that need general web intelligence (e.g., "tell me when X happens")
- Query Gemini with watch-specific questions
- Use the answer + sources to create rich alerts

## Sidekick Task Evaluation

**Are there workflow steps that should be combined into a sidekick task?**

### Watch Creation (Clarifying Conversation)
**Steps involved**: Parse user's natural language watch description, ask clarifying questions, extract structured parameters
**Why direct**: User is waiting for response in the UI. Use `sdk.callLLM` to parse the watch and generate clarifying questions. This is a straightforward extraction task.

### Cron-based Monitoring (News + Web)
**Steps involved**: For each active watch, search news/web, evaluate relevance, create alerts
**Why direct**: This is a batch processing workflow with known steps. Use `sdk.callLLM` (FAST) for relevance evaluation. Each step is mechanical — query tool, classify result, store alert.

### Email Matching
**Steps involved**: Receive email, check against active watches, create alert if matched
**Why direct**: Single email → compare against watches → store result. Simple classification task suitable for `sdk.callLLM` (FAST).

### Steps kept as direct implementation
**Steps**: All monitoring steps (email matching, news search, web crawl, alert creation)
**Why direct**: Each step is a known tool call + classification. No multi-step reasoning or adaptive behavior needed. Cost control is important since these run frequently.

## Caching Requirements

### RSS Feed List
**Latency observed**: 1.2s
**Displayed in UI**: No (used server-side only for feed discovery)
**Caching strategy**: Not needed — only used during watch setup

## Controlling Costs

1. **Deduplication**: Track processed email IDs and news article URLs to skip already-seen content
2. **Incremental processing**: Only process new content since last check
3. **FAST model**: Use FAST variant for all classification/matching tasks
4. **Batch LLM calls**: When checking multiple watches against a single piece of content, batch them into one LLM call
5. **Skip unchanged**: For URL monitoring, hash page content and skip LLM if unchanged
6. **Rate limit cron**: Check every 2 hours, not more frequently

## Implementation Sequence

### Server Functions (implement and test in order):

1. **`initializeProfile`** — Get user interests from Sidekick (one-time)
2. **`saveProfile`** — Save/update user profile
3. **`syncProfileToSidekick`** — Background sync profile changes
4. **`getUserProfile`** — Read profile from DB
5. **`createWatch`** — Parse natural language, create structured watch
6. **`getWatches`** — List all watches for user
7. **`updateWatch`** — Edit watch (urgency, status, description)
8. **`deleteWatch`** — Remove a watch
9. **`getAlerts`** — Get alerts for user (with pagination)
10. **`dismissAlert`** — Mark alert as dismissed with optional feedback
11. **`checkWatches`** — Cron handler: check news/web sources for all active watches
12. **`handleIncomingEmail`** — Email trigger handler: match emails against watches
13. **`runCheckNow`** — Manual trigger to run checks immediately

Remember to `dreamer push` and `dreamer call-server` to test each function.
