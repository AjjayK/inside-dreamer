# What I Learned Beta-Testing Dreamer

I spent the past few months as a beta tester on the Dreamer platform, shipping a handful of agents end-to-end and contributing to several of the design discussions along the way. This article is what I took away from that process, specifically about how the platform's architecture makes "vibecoding" actually scale beyond the demo.

Most agent frameworks fall apart the moment you need composability, per-user state, or long-running background work. The systems that survive that transition do so because of structural decisions, not feature lists. Dreamer is the first one I've used where those decisions are deliberate enough to write down. So that's what this is: not a tutorial, not documentation, just the architectural part of the platform from the perspective of someone who built on it before it was public.

## What Dreamer Is

Dreamer is a cloud platform for personal software, what its team calls "Software 3.0," intelligence-native applications you describe rather than program. It began as an independent platform and the team is now part of Meta Superintelligence Labs.

A note on terminology before going further: the team frames Dreamer as an *operating system* for this kind of software, and I'll use that framing throughout. It's not a literal OS (there's no bare metal, no scheduler, no device drivers, it runs on conventional cloud infrastructure), but it's deliberately built around OS abstractions: a privileged kernel-style process, sandboxed per-user processes, mediated IPC, a permission model bound to those primitives. The framing is a design commitment, not a tagline, and once you see what those abstractions buy you it earns the term. Throughout this article, "OS" means *built like an OS*, not *is an OS*.

Concretely: instead of installing apps from a store, you talk to a system agent, **Sidekick**, and tell it what you want. *"Watch the school district site and ping me when enrollment opens."* *"Track this flight."* *"Turn my unread email into a morning podcast."* Sidekick either routes the request to an existing agent on your account, or writes a new one end-to-end and installs it for you. The agents it builds are real software with a database, a UI, scheduled triggers, and API access. They just happen to be authored by an agent in minutes rather than by a developer over weeks.

That build-by-conversation flow is what "vibecoding" means in practice. Most attempts at it collapse because the resulting software has nowhere to live and nothing to compose with. You get a one-shot script, not an app you can rely on. Dreamer's answer is to treat per-user isolation, inter-agent calls, persistent memory, and scheduling as platform primitives: the OS-style abstractions noted above. The rest of this article is about how the platform is structured around those primitives, and why those structural choices are what take vibecoding from a demo to something you can actually rely on.

<video src="https://github.com/AjjayK/inside-dreamer/raw/refs/heads/master/demo/dreamer_demo.mp4" controls width="720"></video>

## The Kernel-and-Sub-Agents Model

Dreamer's core decision is to treat the system as an OS, not a framework. There is one process with privileged access to the user's data and to every installed agent, and that process is Sidekick, the kernel. Everything else (every agent you install, every agent you build) runs sandboxed in its own VM with its own database, and is reachable only through Sidekick. The official line: *"the only entity in the Dreamer system that has access to all the tools and all the agents."*

Sub-agents do not call each other directly. They call Sidekick, and Sidekick Tasks. This is the same pattern as syscalls in a Unix kernel, and it solves the same problem: a small, audited set of mediated paths instead of an open mesh of peer-to-peer connections.

What this buys the platform is composability without coupling. When Dreamer's docs talk about an article discovered by your news agent landing in your read-later agent (even when the two were built by different people), that's not a custom integration. It's two sub-agents publishing typed functions and Sidekick stitching them together at the user's request.

## The Three Execution Layers

Once you build a non-trivial agent on Dreamer, you find yourself operating across three layers, and the code has to be legible to all of them:

```
L1  Sidekick (kernel, per-user)
    Holds memory. Sees every installed agent and every connected tool.
    Routes user intent into sub-agent function calls.
    Builds and edits sub-agents using a Claude-Code-like coding harness
    underneath its conversational interface.

L2  Sub-agent (your code, sandboxed VM, per-user database)
    Server functions, background functions, scheduled triggers, UI.
    Owns its data. Makes its own LLM calls.

L3  Sidekick Task (autonomous research agent, spawned on demand)
    A long-running agentic loop in a fresh VM, given a natural-language
    prompt and a typed tool surface. Calls back UP into the spawning
    sub-agent's exported functions while also using its own broad set of
    platform tools.
```

Sidekick (L1) wears two hats. At runtime, it routes the user's intent into the right sub-agent's exported functions. At build time, it *is* the IDE: a Claude-Code-like coding harness lives underneath the conversational interface, operating the `dreamer` CLI as a peer to whatever the user is asking for. There isn't a separate "coding agent" in the system. There's Sidekick, and Sidekick has a coding mode.

The non-obvious move is L3. A sub-agent can spawn an autonomous agent that *uses the spawning sub-agent as part of its toolbelt*. Concretely: your sub-agent pulls some piece of state from its DB, packages it into instructions, and hands it to a Sidekick Task with a completion callback. The Task then calls your sub-agent's exported functions, alongside whatever platform tools it already has access to (calendar, email, web search, etc.), to complete the work. When the Task finishes, it invokes a named completion handler with a typed payload.

This is the same primitive as a worker queue, but with a flipped polarity from how most agent frameworks think about it. You aren't shelling out to a worker that does a known job. You're spawning a peer agent that uses you. The intelligence is supplied at runtime by infrastructure the platform manages, while you supply the durable state and the API surface.

## `exported: true` Is the ABI

<video src="https://github.com/AjjayK/inside-dreamer/raw/refs/heads/master/demo/sidekick_demo.mp4" controls width="720"></video>

The whole inter-agent protocol collapses into one flag in the SDK: `exported: true` on a server function. That flag does two things at once:

1. It exposes the function to **Sidekick**, so other agents (yours, or strangers' agents the same user installed) can invoke it through the kernel.
2. It exposes the function to **Sidekick Tasks** that your own agent spawns, so the L3 prompt can list it as an available tool.

One flag, two consumers. The function's `description` field stops being human documentation and becomes prompt context for whichever agent decides when to call it. The parameter schema stops being request validation and becomes the tool-use schema another agent reads to construct calls.

This is where the platform diverges sharply from plain MCP. An MCP server exposes tools to one class of consumer: an LLM-driven client. Dreamer's exported functions serve peer agents, child agents, *and* the kernel's natural-language router with the same definition. The unit of software stops being "an app" and becomes "an exported-function surface a kernel agent can compose."

The judgment call shifts accordingly. When you decide whether to mark a function exported, you're not deciding whether it's part of a conventional public API. You're deciding whether you want this capability in the user's Sidekick toolbelt — something Sidekick can reach for autonomously, with no UI in front of the user, whenever the user's intent or another agent's workflow makes it relevant.

## Memory Lives in the Kernel

Most agent frameworks let each agent keep its own memory. Dreamer does the opposite: per-user memory lives in Sidekick, and sub-agents read it on demand through a typed kernel call describing the schema they want back. If a sub-agent learns something new about the user (a new location, a preference, an interest), it writes that back to Sidekick so other agents benefit.

This sounds like a minor detail and is actually load-bearing. It means installing a new agent doesn't have to require re-onboarding. Depending on how the agent author designed things, a fresh install can read what Sidekick already knows about you and start working. The platform documents the pattern in the `user-profiles` skill: call Sidekick once on first use, populate a local cache table from what comes back, and sync any user edits back so other agents benefit. Cross-agent personalization happens for free because there is exactly one source of truth about the user.

The cost is that your hot path can't round-trip through the kernel on every call, which is why the local cache exists in the first place. It's a bargain worth making, but it forces a discipline: the local cache is *not* the source of truth, and whoever is editing your code (whether human or Sidekick in coding mode) has to know that.

## What Changes When the Author Is an Agent

The reason all of this hangs together is that the platform assumes the primary author of the code is itself an agent — Sidekick in coding mode, running a Claude-Code-like harness underneath its conversational surface. This is not a stylistic choice. It's the load-bearing assumption that makes vibecoding work at scale.

A few things follow from it:

**The repo's `CLAUDE.md` is a runtime spec, not documentation.** Conventions like "all prompts live in `src/prompts/` as Handlebars templates," "every user-data table has an `owner` column," "never use native `Date`" — these are not preferences. They're invariants Sidekick must preserve so the resulting sub-agent slots into the platform correctly. The `skills/` directory is on-demand context expansion: pulled per task instead of carried in every conversation, so the harness doesn't burn its context budget on framework docs it doesn't need.

**The CLI is designed for two operators.** Commands like `dreamer call-tool`, `dreamer call-server`, `dreamer database --query`, `dreamer logs --run <id>` are equally usable by a human and by Sidekick probing behavior empirically. Because LLM-driven control flow has no static guarantees, empirical probing is how you verify anything. The platform makes that the default path, not the escape hatch.

**Every sub-agent is two programs in two languages.** This is the part that surprised me most during beta-testing, and it's worth unpacking. When you build a sub-agent, you're authoring two pieces of software at the same time:

- **Program 1 is TypeScript** — `server.ts`, `App.tsx`, `schema.ts`. It defines server functions, wires up the database, calls `sdk.callLLM()`, calls `create_sidekick_task()`. It has a compiler, a type system, IDE autocomplete, and static guarantees: rename a function, the call site errors immediately.
- **Program 2 is natural-language prompts** — the `.handlebars` files in `src/prompts/`. These are what the LLMs and Sidekick Tasks actually *execute*. The task pipeline a Sidekick Task follows isn't TypeScript orchestration code; it's an English document the Task reads and acts on. The TypeScript around it is glue: load the template, fill in variables, hand the rendered prompt to `create_sidekick_task`.

The catch is that **the prompts carry the load-bearing logic, not the TypeScript**. The TypeScript just sets the stage. The actual reasoning, the actual decisions, the actual workflow live in a Markdown-ish file with no compiler, no types, no autocomplete, no test framework. A typo in a Handlebars file doesn't fail typecheck. An ambiguous instruction doesn't surface until a real Sidekick Task acts on it badly, possibly hours later in a cron run. The only feedback loop is `dreamer logs --run <id>` after the fact.

The platform doesn't pretend otherwise. It builds tight observability around the prompt program (task transcripts, per-run logs, cancellation primitives) because static analysis cannot. Once you've shipped a few agents, you learn to treat `.handlebars` files with the same care as `.ts` files, and to read logs the way a backend engineer reads stack traces. That shift in instinct is the actual learning curve of the platform, not the SDK.

## Why It Scales

The honest answer to "why does this scale where other agent frameworks don't" comes down to three properties of the architecture:

**Isolation by default.** Every sub-agent is sandboxed and per-user. There is no shared global state, no neighbor agent that can corrupt yours, no upgrade that requires coordination across installs. You add an agent, install it for one user, evolve it independently of every other agent on the platform.

**Mediation by Sidekick.** Inter-agent calls go through one auditable kernel. Permission, observability, and policy live in one place. The sub-agent author writes a function and decides whether to export it; everything downstream (who can call it, when, with what consent) is the kernel's problem, not the agent's.

**Intelligence is rented, not owned.** Sub-agents don't ship a research agent or a planner. When they need autonomous multi-step reasoning, they spawn a Sidekick Task and pass a prompt. The intelligence is supplied at runtime by infrastructure the platform manages. This means a sub-agent's own code stays small, focused on durable state and API surface, and the heavy reasoning gets the platform's best model and its best agentic loop without each agent having to re-implement them.

These three properties compound. Isolation makes it safe to install many agents per user. Mediation makes it safe for those agents to compose through Sidekick. Renting intelligence keeps each agent's surface area small enough that Sidekick, in coding mode, can build one in a single conversation and modify it in another.

## Closing Thought

The thing I keep coming back to from beta-testing: most of what people call "agent frameworks" today are libraries for building *one* agent. Dreamer is a platform built like an operating system for *many* agents that compose. The difference shows up in places you don't expect: in how memory works, in what one boolean flag means, in why your sub-agent is simultaneously a callee and a caller of other agents.

Once you internalize that the right unit of software is an exported function surface that a kernel agent can compose, everything else in the platform starts looking obvious in hindsight. That's the part worth taking elsewhere even if you never build on Dreamer. The future of personal software is probably not bigger apps. It's smaller, sharper API surfaces that some kernel agent (yours or someone else's) knows how to wire together on a user's behalf.

## Explore the Codebase

This repo is one Dreamer sub-agent (L2) end-to-end. It does not contain Sidekick, the VM isolation layer, or the coding harness — those live inside the platform and aren't shipped with any sub-agent. What it does contain is everything an L2 sub-agent is made of, so you can see in code what the SDK surface looks like, how a sub-agent is laid out, and which conventions it has to follow.

A walkthrough, in roughly the order things connect:

1. [`agent.yaml`](agent.yaml) — the manifest. Declares the agent's UI views (app, widget) and its triggers (cron, email). Triggers point at background functions in `src/server.ts`.
2. [`src/schema.ts`](src/schema.ts) — the per-agent SQLite schema, defined with Drizzle. Every user-data table carries an `owner` column.
3. [`src/server.ts`](src/server.ts) — all server entry points. Look here for `serverFunction` and `backgroundFunction` definitions, the `exported: true` flag in use, calls into Sidekick memory via `sdk.sidekickWithSchema`, and a Sidekick Task dispatched with `create_sidekick_task` plus its completion callback.
4. [`src/prompts/`](src/prompts/) — the Handlebars templates that hold the natural-language logic. The long task prompt is what an L3 Sidekick Task actually executes when the agent dispatches one.
5. [`tools/`](tools/) — the platform integrations available to this agent (news, calendar, email, web crawl, and so on). Dreamer maintains these connectors; the agent imports the ones it needs.
6. [`CLAUDE.md`](CLAUDE.md) — the rules Sidekick is expected to follow when editing this codebase. It describes the conventions, not the runtime.
7. [`skills/`](skills/) — domain-specific guides (database migrations, dates/timezones, Sidekick Tasks, frontend design, and so on) that Sidekick pulls in only when the task at hand touches that domain.

Reading these files will show you concretely what an L2 sub-agent on Dreamer looks like. The kernel-side behavior described in this article — routing, isolation, Sidekick Task execution — has to be taken on the platform's word or verified by building agents and reading the runtime logs.

---

*This article reflects my own understanding of the Dreamer platform from beta-testing it. I don't speak for the Dreamer team, and any architectural claims are my interpretation of what I observed. Where I've gotten things wrong, the mistakes are mine.*
