---
name: using-callllm-function
description: Using sdk.callLLM for LLM-powered transformations. Covers choosing between model variants for cost/speed/quality tradeoffs and when to use callLLM vs sidekickWithSchema vs Sidekick Tasks.
---

# Using sdk.callLLM

The `sdk.callLLM` function provides access to a general-purpose LLM for structured transformations, extractions, and classifications. It supports three model variants: **STANDARD** (more capable), **FAST** (quicker, cheaper), and **POWERFUL** (most capable, slowest).

## ⚠️ CRITICAL: Always Use Prompt Templates

**Every example in this skill shows inline prompts for brevity. In your actual code, you MUST use Handlebars templates from the `src/prompts/` directory.**

### Required Pattern

```typescript
// 1. Import the template source
import Handlebars from "handlebars";
import promptSource from "./prompts/classify-priority.handlebars";

// 2. Compile it
const template = Handlebars.compile(promptSource);

// 3. Use with sdk.callLLM
const result = await sdk.callLLM(
  template({ subject: email.subject, from: email.from }),
  schema,
  { modelVariant: "FAST" }
);
```

### Why This Matters

- **Never inline prompts** - they're hard to review, iterate, and maintain
- **All prompts in one place** - `src/prompts/` is your prompt library
- **Version control** - see prompt evolution over time
- **Separation of concerns** - logic in code, prompts in templates

❌ **All code examples below show inline strings for readability only. In real code, use templates.**

See `skills/prompt-templates/SKILL.md` for comprehensive guidance.

---

## Model Variants

```typescript
import { Type } from "@dev-agents/sdk-shared";

// FAST variant - quick, cost-effective tasks
const result = await sdk.callLLM(prompt, schema, { modelVariant: "FAST" });

// STANDARD variant (default) - more capable model
const result = await sdk.callLLM(prompt, schema, { modelVariant: "STANDARD" });

// POWERFUL variant - most capable model
const result = await sdk.callLLM(prompt, schema, { modelVariant: "POWERFUL" });
```

## When NOT to Use sdk.callLLM

**Use `sdk.sidekickWithSchema` when you need:**
- Access to user context, memory, or preferences
- Tools from other agents the user has installed
- Understanding that considers the user's history

**Use Sidekick Tasks (`create_sidekick_task`) when you need:**
- Multi-step workflows with decisions between steps
- Autonomous execution
- Iteration and adaptation based on intermediate results

**Use direct code when:**
- Transformation is deterministic (regex, string manipulation)
- You have structured input already
- No interpretation needed

```typescript
// Need user context or memory → use sidekickWithSchema
const profile = await sdk.sidekickWithSchema(
  "What do you know about the user's favorite sports teams and interests?",
  Type.Object({
    favoriteTeams: Type.Optional(Type.Array(Type.String())),
    sportsInterests: Type.Optional(Type.Array(Type.String()))
  })
);

// Deterministic transformation → use code
const date = dayjs("2024-03-15").format("MMMM D, YYYY");
```

## When to Use Each Variant

### Use FAST for:

| Task Type | Examples |
|-----------|----------|
| **Classification** | Sentiment analysis, category assignment, binary decisions |
| **Extraction** | Pulling structured data from text, parsing dates/amounts |
| **Simple transformations** | Format conversion, field mapping, normalization |
| **Pattern matching** | Finding specific patterns, entity recognition |
| **Summarization (brief)** | One-line summaries, key points extraction |

### Use STANDARD for:

| Task Type | Examples |
|-----------|----------|
| **Creative content** | Writing poems, stories, marketing copy |
| **Complex reasoning** | Multi-step analysis, nuanced decisions |
| **Long-form generation** | Detailed summaries, reports, documentation |
| **Nuanced understanding** | Tone analysis, subtle context interpretation |
| **Quality-critical output** | User-facing content, important decisions |

### Use POWERFUL for:

| Task Type | Examples |
|-----------|----------|
| **Multi-document synthesis** | Analyzing 5+ documents together, cross-referencing reports |
| **Complex financial/legal analysis** | Contract review, regulatory compliance assessment |
| **Expert-level problem solving** | Debugging complex system issues, architectural decisions |
| **Quality-critical output** | Executive briefings, important personal communications, complex creative projects |
| **When STANDARD fails** | Tasks where STANDARD returns low-confidence or incorrect results |

## Code Examples

### ✅ FAST: Classification

```typescript
// NOTE: In real code, this prompt MUST be in src/prompts/classify-email.handlebars
// This example shows inline strings for readability only

// Classify email priority - simple categorization
const { priority } = await sdk.callLLM(
  `Classify this email's priority:
   Subject: ${email.subject}
   From: ${email.from}`,
  Type.Object({
    priority: Type.Union([
      Type.Literal("urgent"),
      Type.Literal("normal"),
      Type.Literal("low")
    ])
  }),
  { modelVariant: "FAST" }
);
```


### ✅ STANDARD: Creative Writing

```typescript
// NOTE: In real code, this prompt MUST be in src/prompts/write-birthday-poem.handlebars
// This example shows inline strings for readability only

// Generate a personalized poem - needs creativity
const { poem } = await sdk.callLLM(
  `Write a short birthday poem for ${name} who loves ${hobby}`,
  Type.Object({
    poem: Type.String()
  }),
  { modelVariant: "STANDARD" }
);
```

### ✅ POWERFUL: Complex Multi-Document Analysis

```typescript
// NOTE: In real code, this prompt MUST be in src/prompts/analyze-reports.handlebars
// This example shows inline strings for readability only

// Synthesize insights from multiple quarterly reports - requires deep reasoning
const { analysis } = await sdk.callLLM(
  `Analyze these quarterly financial reports and provide:
   1. Key strategic trends across all quarters
   2. Risks with severity assessment
   3. Actionable recommendations

   Reports: ${JSON.stringify(quarterlyReports)}`,
  Type.Object({
    trends: Type.Array(Type.Object({
      trend: Type.String(),
      evidence: Type.String(),
      quarters: Type.Array(Type.String())
    })),
    risks: Type.Array(Type.Object({
      risk: Type.String(),
      severity: Type.Union([Type.Literal("low"), Type.Literal("medium"), Type.Literal("high")]),
      mitigation: Type.String()
    })),
    recommendations: Type.Array(Type.Object({
      action: Type.String(),
      priority: Type.Union([Type.Literal("immediate"), Type.Literal("short-term"), Type.Literal("long-term")]),
      rationale: Type.String()
    }))
  }),
  { modelVariant: "POWERFUL" }
);
```

## Quick Decision Tree

```
Is this task...

├── Classification/categorization? → FAST
├── Data extraction from text? → FAST
├── Format conversion? → FAST
├── Sentiment/boolean check? → FAST
├── Brief summary (1-2 sentences)? → FAST
│
├── Creative content generation? → STANDARD
├── Multi-step reasoning needed? → STANDARD
├── Long-form writing? → STANDARD
├── Quality-critical output? → STANDARD
├── Nuanced/subjective decision? → STANDARD
│
├── Highly complex reasoning? → POWERFUL
├── Research-grade analysis? → POWERFUL
├── Mission-critical output? → POWERFUL
├── Expert-level problem solving? → POWERFUL
│
└── Unsure? → Start with FAST, upgrade to STANDARD or POWERFUL if quality insufficient
```

### ⚠️ Combined Prompts: Choose the Variant for the Hardest Subtask

Many prompts combine multiple subtasks — e.g., extracting structured data AND filtering by relevance AND assessing urgency. When this happens, choose the model variant based on the **hardest** subtask, not the easiest.

❌ **Common mistake:** "I'm extracting data from text → extraction → FAST"
But the prompt also asks the LLM to filter by relevance and assess urgency — those are contextual judgment calls, not extraction. FAST will do poorly here.

✅ **Correct reasoning:** "This prompt extracts data (FAST), filters by relevance to the user (STANDARD), and assesses urgency (STANDARD) → use STANDARD"

**Signals that your prompt needs more than FAST:**
- Filtering or ranking based on user-specific context (preferences, relationships, history)
- Urgency or priority assessment relative to the current time
- Deciding whether content is "relevant" to a specific person or situation
- Any subjective judgment where reasonable people might disagree

If any subtask in your prompt matches these, upgrade the whole call — you can't mix model variants within a single prompt.

### Cost Considerations

**FAST variant:**
- ~3-5x cheaper per call than STANDARD
- Lower latency
- Best for high-volume operations
- Use in loops and batch processing

**STANDARD variant:**
- Higher cost, higher capability
- Better for user-facing content
- Use sparingly in background functions
- Worth it when quality matters

**POWERFUL variant:**
- ~5x more expensive per call than STANDARD
- Most capable, slowest
- Best for mission-critical and expert-level tasks
- Use only when STANDARD is insufficient
- Reserved for highest-stakes decisions

**Cost-efficient patterns:**

```typescript
// NOTE: In real code, all prompts MUST be in src/prompts/*.handlebars files
// These examples show inline strings for readability only

// ✅ GOOD: Use FAST in loops
for (const email of emails) {
  const { category } = await sdk.callLLM(
    `Categorize: ${email.subject}`,
    categorySchema,
    { modelVariant: "FAST" }  // Cheaper for batch operations
  );
}

// ✅ GOOD: FAST for filtering, STANDARD for final output
const relevantItems = [];
for (const item of items) {
  const { isRelevant } = await sdk.callLLM(
    `Is relevant: ${item.title}`,
    Type.Object({ isRelevant: Type.Boolean() }),
    { modelVariant: "FAST" }
  );
  if (isRelevant) relevantItems.push(item);
}

// Only use STANDARD for the final user-facing summary
const { summary } = await sdk.callLLM(
  `Create engaging summary of: ${JSON.stringify(relevantItems)}`,
  Type.Object({ summary: Type.String() }),
  { modelVariant: "STANDARD" }
);
```

## Prompt Content Guidelines

### Include All Available Context

When your prompt processes structured input (emails, API responses, trigger payloads), review all fields available on the input object before writing your template. Don't just pass the minimum — context you omit is context the LLM can't use.

❌ **Leaving data on the floor:**
```handlebars
{{!-- EmailData has from, to, subject, body, timestamp, labels, attachments --}}
{{!-- But this template only uses three fields: --}}
From: {{from}}
Subject: {{subject}}
Body: {{body}}
```

✅ **Including available context:**
```handlebars
From: {{from}}
To: {{to}}
Subject: {{subject}}
Sent: {{timestamp}}
{{#if labels}}Labels: {{#each labels}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
{{#if attachmentNames}}Attachments: {{attachmentNames}}{{/if}}

Body:
{{body}}
```

Not every field will matter for every prompt, but fields like timestamps, recipients, and labels are cheap to include and frequently improve the LLM's judgment. When in doubt, include it.

### Dates and the Current Time System Message

Every `callLLM` call automatically includes a system message with the current date and time in the **user's timezone**. This means the LLM already knows "now" — but any dates you pass in the prompt need to be in the same timezone to avoid confusion.

If your prompt includes dates or timestamps (event times, deadlines, email sent dates, etc.), **convert them to the user's timezone before passing them to the template**. Otherwise the LLM will see UTC timestamps alongside a current-time reference in the user's local time, and its reasoning about "is this soon?", "was this today?", or "is this urgent?" will be unreliable.

```typescript
// See skills/dates-times-timezones/SKILL.md for required dayjs setup.

// ✅ Convert dates to user's timezone before passing to template
const result = await sdk.callLLM(
  template({
    eventTime: dayjs(event.startTime).tz(getUserTimeZone()).format("LLLL"),
    deadline: dayjs(task.dueDate).tz(getUserTimeZone()).format("LLLL"),
    body: email.body,
  }),
  schema,
  { modelVariant: "STANDARD" }
);

// ❌ Don't pass raw UTC strings — the LLM will compare them against
//    the local-time system message and get confused
const result = await sdk.callLLM(
  template({
    eventTime: event.startTime, // "2025-10-21T18:30:00.000Z"
    deadline: task.dueDate,     // "2025-12-01T00:00:00.000Z"
    body: email.body,
  }),
  schema,
  { modelVariant: "STANDARD" }
);
```

**Output dates: don't ask the LLM to do timezone conversion.** Since the system message provides the current time in the user's timezone and your input dates should also be in the user's timezone (per above), the LLM naturally operates in user-local time. Any dates it returns — extracted or generated — should be treated as user-local. Convert to UTC in your code, not in the prompt.

```typescript
// ✅ Treat LLM output dates as user-local, convert in code
const { events } = await sdk.callLLM(template({ emailBody }), schema, {
  modelVariant: "STANDARD",
});

const storedEvents = events.map((e) => ({
  ...e,
  // Parse as user-local time, then convert to UTC for storage
  timestamp: dayjs(e.datetime).tz(getUserTimeZone()).utc().toISOString(),
}));

// ❌ Don't instruct the LLM to return UTC or convert timezones
// Prompts like "return all times in UTC" or "convert to ISO 8601 with Z suffix"
// force the LLM to do timezone math, which it will often get wrong.
```

See `skills/dates-times-timezones/SKILL.md` for full date/timezone handling patterns.

## Common Patterns

### Pattern 1: Fallback to STANDARD

```typescript
// Try FAST first, upgrade if quality is insufficient
let result = await sdk.callLLM(prompt, schema, { modelVariant: "FAST" });

if (!result || result.confidence < 0.7) {
  result = await sdk.callLLM(prompt, schema, { modelVariant: "STANDARD" });
}
```

### Pattern 2: Task-Based Selection

```typescript
type TaskType = "classify" | "extract" | "generate" | "analyze";

function getModelVariant(task: TaskType): "FAST" | "STANDARD" {
  const fastTasks: TaskType[] = ["classify", "extract"];
  return fastTasks.includes(task) ? "FAST" : "STANDARD";
}
```

### Pattern 3: Volume-Based Selection

```typescript
// Use FAST for high-volume, STANDARD for single important items
const modelVariant = items.length > 10 ? "FAST" : "STANDARD";

for (const item of items) {
  await sdk.callLLM(prompt, schema, { modelVariant });
}
```

## Summary

| Variant | Best For | Cost | Speed |
|---------|----------|------|-------|
| **FAST** | Classification, extraction, formatting, filtering | Low | Fast |
| **STANDARD** | Creative writing, complex reasoning, quality-critical content | Higher | Slower |
| **POWERFUL** | Expert-level reasoning, research-grade analysis, mission-critical tasks | Highest | Slowest |

**Default behavior:** When `modelVariant` is not specified, STANDARD is used.

**Rule of thumb:** If the task has a clear "right answer" that could be verified programmatically, use FAST. If quality is subjective or requires creativity, use STANDARD. If the task requires expert-level reasoning or is mission-critical, use POWERFUL.

