---
name: deep-links
description: Navigation patterns for agents — in-app routing with the History API or React Router, opening the full app from a widget with showInView, and creating external share links (dreamer.com/s/) with content-specific social metadata.
---

# Deep Links & Navigation

Three distinct types of navigation in agent apps:

| Type | When to use |
|------|-------------|
| [In-app routing](#in-app-routing) | Navigate between views/pages within the app itself |
| [Widget → app](#widget--app-navigation) | Open the full app from a dashboard widget, optionally landing on specific content |
| [External share links](#external-share-links) | Create a `dreamer.com/s/` link with content-specific social metadata for sharing externally |

---

## In-App Routing

Apps manage their own routing. You can use either the **History API** or **React Router** — both are seamlessly bridged to the parent window's browser history, so back/forward navigation works correctly.

> **Note:** These only work in app mode, not widget mode.

### History API (lightweight option)

```tsx
import { getLocation, setChangeHandler } from '@dev-agents/sdk-client';

// Read the current URL on mount to restore state from a deep link
const currentUrl = await getLocation();
const params = new URLSearchParams(new URL(currentUrl).search);
const itemId = params.get('item');

// Navigate to a new view — updates the URL bar and browser history
window.history.pushState({ itemId }, '', `/items/${itemId}`);

// Replace the current history entry without adding a new one
// (use for tab/filter changes that shouldn't add a back step)
window.history.replaceState({ tab: 'settings' }, '', '?tab=settings');

// Handle browser back/forward buttons
setChangeHandler((event) => {
  const url = event.location.url;
  // Re-render based on the new URL
});
```

### React Router (richer apps)

If your app has multiple distinct pages, React Router integrates cleanly:

```tsx
import { BrowserRouter, Route, Routes, useNavigate, Link } from 'react-router-dom';

function App({ renderContext }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/items/:id" element={<ItemDetail />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

function ItemList() {
  const navigate = useNavigate();
  return (
    <>
      {/* Declarative */}
      <Link to="/items/123">View item</Link>

      {/* Programmatic */}
      <button onClick={() => navigate(`/items/${id}`)}>Open</button>
    </>
  );
}
```

### When to use which

| Situation | Use |
|-----------|-----|
| Simple app with 2–3 views, light state | History API — less setup |
| Multiple distinct pages, complex routing | React Router |
| Need to preserve a filter/sort but not add a back step | `replaceState` |

---

## Widget → App Navigation

Use `showInView()` from `@dev-agents/sdk-client` to open the full app from a widget. You can optionally pass a path to land on specific content.

```tsx
import { showInView } from '@dev-agents/sdk-client';

export default function Widget({ renderContext }) {
  return (
    <div
      className="h-full w-full cursor-pointer"
      onClick={() => showInView('/items/123', 'app')}
    >
      {/* Widget content */}
    </div>
  );
}
```

**Signature:** `showInView(path?: string, viewType?: "app" | "widget")`

- `path` — route to navigate to when the app opens (e.g. `/items/123`, `/dashboard`). Omit to open the app at its default view.
- `viewType` — defaults to `"app"`. Pass `"widget"` to open in widget mode instead.

The app receives this path as its initial URL, so if you're using the History API or React Router to restore state from the URL, deep linking from widgets works automatically.

---

## External Share Links

Use `sdk.createShareLink()` (server-side) to create a short `dreamer.com/s/<uuid>` URL with custom OpenGraph metadata.

**When to use this instead of just linking to your agent:**

The agent page (`dreamer.com/a/my-agent`) shows generic metadata about the agent. If your agent produces a specific result — a generated image, a report, a chart — and the user shares it in Slack, iMessage, or on social media, the preview will show that generic info rather than anything about the content.

`createShareLink` lets you attach content-specific metadata so the preview shows exactly what you want. Crawlers see the OG tags; browsers are immediately redirected to `forwardingUrl`.

**`forwardingUrl` accepts:**
- An absolute path starting with `/` — resolved relative to the agent's page if the link has an associated agent (e.g. `/?view=report` → `dreamer.com/a/my-agent?view=report`), or relative to dreamer.com root if not.

```typescript
import { serverFunction, type ServerSdk } from "@dev-agents/sdk-server";

export const generateReport = serverFunction({
  params: Type.Object({ month: Type.String() }),
  execute: async (sdk: ServerSdk, { month }) => {
    // ... generate report, upload chart image ...
    const chartUrl = "https://cdn.example.com/charts/q1.png";

    const { shareUrl } = await sdk.createShareLink({
      forwardingUrl: `/?report=${month}`,  // absolute path, resolved relative to this agent's page
      metadata: {
        "og:title": `Sales Report — ${month}`,
        "og:description": "Revenue up 12% vs prior month",
        "og:image": chartUrl,
        "og:image:width": 1200,
        "og:image:height": 630,
      },
    });

    return { shareUrl };
    // shareUrl → "https://dreamer.com/s/<uuid>"
  },
});
```

**Available metadata fields** (all standard OG property names):

```typescript
{
  "og:title": string;           // Required
  "og:description"?: string;
  "og:image"?: string;          // Use stable URLs — see file-storage skill
  "og:image:width"?: number;    // Recommended: 1200
  "og:image:height"?: number;   // Recommended: 630
  "og:type"?: string;           // e.g. "article", "video.other"
  "og:video"?: string;
  "og:video:type"?: string;     // e.g. "video/mp4"
  "og:video:width"?: number;
  "og:video:height"?: number;
}
```

**Idempotent:** calling with the same `forwardingUrl` returns the same record — safe to call on every render without accumulating duplicates.

> **Image tip:** Use stable URLs for `og:image`. Presigned S3 URLs expire — persist images first with the `filestorage` tool (see `skills/file-storage/SKILL.md`), then use the returned stable URL.

