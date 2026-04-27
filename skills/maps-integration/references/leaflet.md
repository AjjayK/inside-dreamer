# Leaflet Implementation

## Setup

```bash
bun add leaflet react-leaflet
bun add -D @types/leaflet
cp node_modules/leaflet/dist/leaflet.css src/leaflet.css
cp node_modules/leaflet/dist/images/marker-icon.png static/
cp node_modules/leaflet/dist/images/marker-shadow.png static/
```

**IMPORTANT:** Do NOT load Leaflet CSS from CDN (unpkg, cdnjs, etc). Copy it locally as shown above, then import with `import "./leaflet.css"`. CDN loading can break and is unreliable.

## Basic Map

```tsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "./leaflet.css"; // Local copy - NOT from CDN

// Fix marker icons (use relative path, no leading slash)
const defaultIcon = L.icon({
  iconUrl: "static/marker-icon.png",
  shadowUrl: "static/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = defaultIcon;

function LocationMap({ locations, center }: { locations: Location[]; center: { lat: number; lng: number } }) {
  return (
    <MapContainer center={[center.lat, center.lng]} zoom={12} className="h-64 w-full">
      <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
      {locations.map((loc, i) => (
        <Marker key={i} position={[loc.lat, loc.lng]}>
          <Popup>{loc.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
```

## Tile Providers

```tsx
const TILES = {
  // CartoDB (recommended) - clean, modern
  // IMPORTANT: Voyager requires "/rastertiles/" in the path — tiles won't load without it.
  // light_all and dark_all do NOT use /rastertiles/. These URL patterns are correct as-is.
  // Copy these URLs exactly — do not "simplify" or normalize them.
  voyager: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  cartoLight: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  cartoDark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  
  // OpenStreetMap - standard
  osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  
  // ESRI - satellite imagery
  satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
};

// Recommended: use voyager (light) / dark_all (dark) as defaults
<TileLayer
  key={isDark ? "dark" : "light"}
  url={isDark ? TILES.cartoDark : TILES.voyager}
/>
```

## Fit Bounds

```tsx
import { useMap } from "react-leaflet";

function FitBounds({ locations }: { locations: { lat: number; lng: number }[] }) {
  const map = useMap();
  useEffect(() => {
    if (locations.length > 0) {
      map.fitBounds(L.latLngBounds(locations.map(l => [l.lat, l.lng])), { padding: [20, 20] });
    }
  }, [locations, map]);
  return null;
}
```

## Routes

```tsx
import { Polyline } from "react-leaflet";

<Polyline positions={route.map(p => [p.lat, p.lng])} pathOptions={{ color: "#3b82f6", weight: 4 }} />
```

## Light/Dark Mode

If the app supports light and dark mode, the map should also support it unless the user explicitly asks not to. There are several react-leaflet quirks to handle:

### Theme detection hook

Use `matchMedia` to detect the user's preferred color scheme and listen for changes:

```tsx
function useDarkMode(): boolean {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isDark;
}
```

### Map component

React-leaflet's `TileLayer` doesn't update when the `url` prop changes, and `MapContainer` ignores prop updates after initial render. Use a `key` prop to force tile layer remount, and a `ThemeSync` child component to update the container background:

```tsx
const TILES = {
  light: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
};

function ThemeSync({ isDark }: { isDark: boolean }) {
  const map = useMap();
  useEffect(() => {
    map.getContainer().style.background = isDark ? "#1a1a2e" : "#f0f0f0";
  }, [isDark, map]);
  return null;
}

function MyMap() {
  const isDark = useDarkMode();
  return (
    <MapContainer
      center={[20, 0]}
      zoom={3}
      className="w-full h-[400px] bg-[#f0f0f0] dark:bg-[#1a1a2e]"
    >
      <ThemeSync isDark={isDark} />
      <TileLayer
        key={isDark ? "dark" : "light"}
        url={isDark ? TILES.dark : TILES.light}
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />
      {/* markers, popups, etc. */}
    </MapContainer>
  );
}
```

### CSS overrides for leaflet.css

Leaflet UI elements (popups, zoom buttons, attribution) have hardcoded light backgrounds. Append these dark mode overrides to your local `leaflet.css` using `prefers-color-scheme`:

```css
/* Dark mode popup overrides */
@media (prefers-color-scheme: dark) {
  .leaflet-popup-content-wrapper,
  .leaflet-popup-tip {
    background: #1e1e2e;
    color: #e0e0e0;
    box-shadow: 0 3px 14px rgba(0,0,0,0.6);
  }
  .leaflet-container a.leaflet-popup-close-button { color: #aaa; }
  .leaflet-container a.leaflet-popup-close-button:hover,
  .leaflet-container a.leaflet-popup-close-button:focus { color: #ddd; }

  /* Dark mode control overrides (zoom buttons, attribution) */
  .leaflet-bar a {
    background-color: #2a2a3e;
    color: #e0e0e0;
    border-bottom-color: #444;
  }
  .leaflet-bar a:hover,
  .leaflet-bar a:focus { background-color: #353550; }
  .leaflet-container .leaflet-control-attribution {
    background: rgba(30, 30, 46, 0.8);
    color: #888;
  }
  .leaflet-container .leaflet-control-attribution a { color: #8888cc; }
}
```

### Popup content

Use Tailwind `dark:` variants for text colors inside popup content:

```tsx
<Popup>
  <div className="text-sm text-gray-900 dark:text-gray-100">
    <p className="font-semibold">{title}</p>
    <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
  </div>
</Popup>
```
