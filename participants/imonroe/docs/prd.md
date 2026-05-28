# Product Requirements Document

## LAGUNITA — Real-Time Lake Conditions & Tide Tracker

> _An official-looking hydrological observatory for a lake that is, by design, almost never wet._
>
> **Tagline:** "Monitoring the absence of water since 2001."

---

## 1. Overview

### 1.1 The product

A single-page, client-side web dashboard styled as a solemn, museum-grade USGS-style
hydrology field station for **Lake Lagunita** at Stanford. It presents animated gauges,
a 30-day trend line, a sparkline, a tide table, a 7-day forecast, a seepage gauge, a
salamander breeding advisory, and a scrolling conditions ticker — all with the gravity
of a real government observatory.

The current depth always reads **0.00 ft**. Forever. The lake is bone dry.

### 1.2 The joke

The polish is the punchline. The closer the interface resembles a genuine,
authoritative hydrology dashboard, the funnier the eternal "bone dry" reading becomes.
The humor is **deadpan and earned**: the dashboard pulls **real, live data** from real
public APIs, runs it through a "brutally honest model," and the model — knowing the lake
hasn't been deliberately filled since 2001 and that the lakebed leaks ~500 gal/min —
reports zero with total confidence. **It is accurate and useless.** The flatline is earned.

### 1.3 Why this works

- It is **genuinely data-driven** and live (real creek telemetry, real precipitation).
- Every absurd stat is grounded in **real, documented lore** (see §3).
- The seriousness of the presentation is the entire comedic mechanism — so visual
  craft, typography, and restraint _are_ the feature, not decoration.

---

## 2. Goals, non-goals, and constraints

### 2.1 Goals

| # | Goal |
|---|------|
| G1 | Look indistinguishable from a real, authoritative hydrology dashboard at a glance. |
| G2 | Be genuinely live and data-driven (real USGS + Open-Meteo data), with zero backend. |
| G3 | Always, confidently, report that the lake is bone dry (0.00 ft, 0.0000% utilization). |
| G4 | Deliver the deadpan comedy through restraint, precision, and earned details. |
| G5 | Be fully accessible (WCAG 2.2 AA), responsive (mobile-first), and resilient to API failure. |
| G6 | Support a metric/imperial unit toggle that persists across visits. |
| G7 | Include a rare, dramatic "HISTORIC FILL EVENT" easter egg triggered by real flood data. |

### 2.2 Non-goals

- No user accounts, no backend, no database, no API keys, no analytics.
- No real hydrological accuracy beyond the live creek/precip numbers we surface verbatim.
- No multi-page navigation, routing, or CMS. One self-contained page.
- Not optimized for "pretty" over "complete" — completeness and credibility win ties.

### 2.3 Hard constraints

| # | Constraint | Source |
|---|-----------|--------|
| C1 | **Client-side only.** No server-side logic, SSR, or secrets. Deploys via GitHub Pages. | Hackathon rules |
| C2 | All persistence uses **`localStorage`** (no cookies, no IndexedDB needed). | Hackathon rules |
| C3 | All work stays inside `participants/imonroe/`. Never touch sibling folders. | `CLAUDE.md` |
| C4 | Must build/publish as static assets; published artifact strips `package.json`/lockfiles/`node_modules`. | `deploy-pages.yml` |
| C5 | Commits use the format `imonroe: <short description>`. | `CLAUDE.md` |
| C6 | External APIs must be **key-less and CORS-enabled** (verified: USGS IV + Open-Meteo are). | Theme |
| C7 | Live URL: `https://between-two-ferns.stanford.edu/participants/imonroe/`. | `CLAUDE.md` |

---

## 3. The lore (all real, all usable as copy)

These facts are baked in as **static constants** and surfaced as authoritative readouts.

| Fact | Becomes |
|------|---------|
| Dug ~1870s as a ~115-million-gallon reservoir for Leland Stanford's Palo Alto Stock Farm. | **Designed Capacity: 115,000,000 gal** |
| Not artificially filled for recreation since **2001**. | Flatline baseline + unreachable "recreational threshold · last achieved 2001" line on the chart. |
| Loses an estimated **~500 gal/min** to the permeable lakebed. | Animated radial **Seepage Gauge** pinned at −500 gal/min, always draining. |
| Now a flood-control basin and habitat for the endangered **California tiger salamander**. | **Salamander Breeding Advisory** module (status: DORMANT). |
| Filled by the heavy rains of **January 2023**. | "Last meaningful water event" readout + basis for the HISTORIC FILL easter egg. |
| Historically filled by diversion from **San Francisquito Creek**. | The live data hero (real creek gauge). |
| Perimeter trail is **~0.9 mi**. | Ticker bulletin + a distance stat that respects the unit toggle. |

All lore copy is written deadpan, in the register of a government field station.

---

## 4. Data sources (real, live, key-less, CORS-friendly)

### 4.1 Hero source — USGS Instantaneous Values (San Francisquito Creek at Stanford)

- **Gauge:** USGS 11164500 — "San Francisquito Creek at Stanford University, CA".
- **Endpoint:**
  `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=11164500&parameterCd=00060,00065&siteStatus=all`
- **Parameters:** `00060` = discharge (cfs), `00065` = gauge height (ft).
- **Parsing:** `value.timeSeries[]` → match on `variable.variableCode[0].value`
  (`"00060"` / `"00065"`) → take the **most recent** entry in `values[0].value[]`
  (`{ value, dateTime, qualifiers }`). USGS uses `-999999` (or similar) sentinel for
  "no data" — treat any non-finite or sentinel value as **missing**, not zero.
- **Use:** Display the real, ticking creek discharge and gauge height with timestamp.
  Then draw an arrow/relationship to **"Projected Lagunita inflow: 0 gal"** — because the
  diversion hasn't run in two decades. Real input, honest output.
- **Easter egg trigger:** Flood stage for this gauge runs roughly **11–14 ft** of gauge
  height. If `00065` ever genuinely meets/exceeds the configured flood threshold
  (default **11.0 ft**), flip the entire UI to the HISTORIC FILL state (see §5.10).

### 4.2 Forecast source — Open-Meteo

- **Endpoint:**
  `https://api.open-meteo.com/v1/forecast?latitude=37.4232&longitude=-122.1760&daily=precipitation_sum&hourly=precipitation&timezone=America/Los_Angeles`
- **Parsing:** `daily.time[]` + `daily.precipitation_sum[]` for the 7-day forecast.
- **Use:** The forecast normally predicts **0.00 ft every day** with a dry-sun icon. On a
  day where `precipitation_sum` exceeds a configured trace threshold (default **2 mm**),
  the forecast grudgingly bumps that day to **0.01 ft (trace)** with a wry footnote,
  then snaps back to bone dry.

### 4.3 Flavor link (no parsing)

- Link out to the NOAA river-forecast page for this creek, station **SFCC1**, purely for
  credibility. No data fetched.

### 4.4 Fetch behavior

- Both fetches occur on load and refresh on an interval (default **5 min** for USGS,
  once per session for Open-Meteo, with manual refresh available).
- Successful USGS/Open-Meteo payloads are cached to `localStorage` with a timestamp so a
  failed refresh can fall back to last-known data (see §8).

---

## 5. Dashboard modules (functional spec)

The page is a vertical scroll of modules over a faint topographic-contour rendering of
the dry lakebed, anchored by an official seal and serif headings. Mobile-first; modules
stack on small screens and arrange into a measured grid on larger screens.

### 5.1 Masthead / seal

- Official **seal** (SVG): concentric contour rings + a small salamander motif, ring text
  e.g. "LAGUNITA HYDROLOGICAL OBSERVATORY · EST. c. 1870".
- Title **LAGUNITA**, subtitle "Real-Time Lake Conditions & Tide Tracker", tagline.
- Station metadata line: station ID, datum, "data provisional — subject to revision"
  disclaimer (real USGS phrasing) for authenticity.
- Unit toggle control (see §6) lives in the masthead, persistent and keyboard-accessible.

### 5.2 Hero readout — Current Depth

- Giant **CURRENT DEPTH: 0.00 ft** (converts to **0.00 m** in metric).
- **▼ 0.00 ft (24h)** trend indicator.
- Status pill: **BONE DRY** (other possible states: TRACE, HISTORIC FILL — see §5.10).
- "Last updated" timestamp from the most recent successful data pull.

### 5.3 Water-level trend chart (30-day)

- A beautiful **area chart** of "water level": a perfect **flatline hugging zero**.
- A faint **dashed line near the top** labeled "recreational threshold · last achieved
  2001", forever out of reach.
- Hand-rendered SVG for exact aesthetic control; `role="img"` + descriptive label.
- Axis ticks, gridlines, and a tasteful y-axis with the threshold annotated.

### 5.4 Sparkline

- A compact inline **sparkline** (e.g., last 24h or 30-day micro-trend), also a flatline,
  paired with the hero or trend module. Decorative-grade precision, accessible label.

### 5.5 Seepage gauge (animated radial)

- Radial/arc gauge pinned at **−500 gal/min** (converts to L/min in metric), with a
  continuous, subtle "draining" animation (respects reduced-motion).
- Sublabel: "Net flux through permeable lakebed."

### 5.6 Tide table

- Today's **high tide** and **low tide**, both **0.00 ft**, at gravely precise,
  deterministic nonsense times (derived from the date so they change daily but are
  always zero). Columns: event, time, height, "coefficient" (nonsense but consistent).

### 5.7 7-day forecast

- Seven day cards, each predicting **0.00 ft** with a dry-sun icon — unless Open-Meteo
  reports meaningful precipitation that day, in which case that card grudgingly shows
  **0.01 ft (trace)** with a different icon and a footnote. Day labels from real forecast dates.

### 5.8 Utilization / capacity stat

- **Designed capacity 115,000,000 gal · Current contents ~0 gal · Utilization 0.0000%.**
- Capacity and contents convert with the unit toggle (gal ↔ L).
- A thin, empty capacity bar visualizes the 0.0000%.

### 5.9 Live creek module (the real hero data)

- Real **discharge (cfs / m³/s)** and **gauge height (ft / m)** for USGS 11164500, with
  the reading timestamp and a "provisional" tag.
- A visual relationship arrow: **Creek inflow → Projected Lagunita inflow: 0 gal.**
- Link to the NOAA SFCC1 page and to the USGS gauge page for credibility.

### 5.10 HISTORIC FILL EVENT (easter egg)

- **Real trigger:** USGS gauge height ≥ flood threshold (default 11.0 ft).
- **Manual trigger** (for demo, since real floods are rare): a hidden activation —
  `?fill=1` URL param **and** clicking the seal 5× — flips the UI into the event state.
- **Behavior:** The entire UI transforms to a frantic **"⚠ HISTORIC FILL EVENT IN
  PROGRESS"** state — alarmed color treatment, non-zero (real or simulated) depth, the
  ticker switches to emergency bulletins, status pill reads HISTORIC FILL. Clearly
  reversible (reload / toggle off). This is the one time it isn't zero.

### 5.11 Conditions ticker

- A horizontally scrolling ticker delivering deadpan bulletins, e.g.:
  - "Lakebed optimal for jogging · 0.9-mi perimeter trail fully operational"
  - "Gopher activity: NOMINAL · Salamanders: unbothered"
  - "Seepage steady at −500 gal/min · No inflow detected"
- Pausable on hover/focus. **Reduced-motion fallback:** a static, paginated/rotating list
  rather than continuous scroll. Accessible equivalent provided as a list (see §9).

### 5.12 Salamander Breeding Advisory

- Status module reading **DORMANT** (California tiger salamander), framed as an official
  wildlife advisory with a last-assessed date.

### 5.13 Footer

- Data attribution (USGS, Open-Meteo, NOAA), "not affiliated with USGS/Stanford" disclaimer,
  build/version, and a final deadpan one-liner.

---

## 6. Unit toggle (metric / imperial)

A persistent switch toggles the entire dashboard between **imperial** (default) and **metric**.

| Quantity | Imperial | Metric | Notes |
|----------|----------|--------|-------|
| Depth / gauge height | ft | m | `m = ft × 0.3048` |
| Discharge | cfs | m³/s | `m³/s = cfs × 0.0283168` |
| Volume (capacity, contents) | gal (US) | L | `L = gal × 3.78541` |
| Seepage rate | gal/min | L/min | same factor as volume |
| Distance (trail) | mi | km | `km = mi × 1.609344` |
| Temperature (if surfaced) | °F | °C | standard conversion |

- 0.00 stays 0.00 in both systems (the joke survives translation).
- Selection persists in `localStorage` (`lagunita.units`), defaulting to imperial.
- The toggle is a real, labeled, keyboard-operable control with an accessible name and
  state announced to assistive tech.

---

## 7. State & persistence

All state is in-browser. `localStorage` keys (namespaced `lagunita.*`):

| Key | Purpose |
|-----|---------|
| `lagunita.units` | `"imperial"` \| `"metric"` |
| `lagunita.usgs.cache` | Last successful USGS payload + fetch timestamp |
| `lagunita.openmeteo.cache` | Last successful Open-Meteo payload + fetch timestamp |
| `lagunita.sealClicks` | Transient counter toward the manual easter-egg trigger (optional) |

- All reads from `localStorage` are defensively parsed (try/catch, schema-checked) so a
  corrupt or absent value never breaks the page.
- No personal data is stored.

---

## 8. Error states & edge cases

The dashboard must **never break the joke**, even when offline or when an API fails.

| Scenario | Behavior |
|----------|----------|
| USGS fetch fails / times out | Fall back to cached reading if present; otherwise show "GAUGE OFFLINE — telemetry from San Francisquito Creek momentarily unavailable" in the deadpan register. The lake remains, as ever, bone dry. |
| USGS returns sentinel/no-data | Treat as missing (not 0); show "—" with the "provisional/unavailable" note. Depth readout stays 0.00 regardless. |
| Open-Meteo fetch fails | Forecast still renders 7 days of 0.00 ft dry-sun cards from static fallback (the static joke holds); no trace bumps. |
| Fully offline | Cached values + static lore render a complete, functional page. |
| First visit, no cache, both APIs down | Page is fully usable: all static modules render; live modules show graceful "offline" copy. |
| Clock/timezone differences | Tide/forecast times computed in `America/Los_Angeles`; timestamps labeled with timezone. |
| `prefers-reduced-motion` | All sweeps, ticker scroll, and transitions disabled/replaced with static equivalents. |
| Very small viewport (≤320px) | Layout remains legible; numbers never overflow; modules stack. |
| Slow connection | Skeleton/placeholder states for live modules; static modules render immediately. |
| Corrupt `localStorage` | Caught and ignored; defaults applied. |

---

## 9. Accessibility (WCAG 2.2 AA target)

- **Color contrast:** Cardinal (`#8c1515`/`#5f0f0f`) on cream (`#f8f5ef`/`#efe7d8`) and all
  status pills meet AA (≥4.5:1 for text, ≥3:1 for large text/UI). Verify every pairing.
- **Charts & gauges:** Each SVG has `role="img"` with a concise `aria-label` (and
  `<title>`/`<desc>`), plus an accessible text equivalent of the key value nearby.
- **Live regions:** The "current depth" / "last updated" readout uses `aria-live="polite"`
  so refreshes are announced calmly. The scrolling ticker is `aria-hidden`, with the same
  bulletins exposed to assistive tech as a static, readable list.
- **Keyboard:** Every interactive control (unit toggle, links, ticker pause, easter-egg
  affordances) is reachable and operable by keyboard with visible focus (focus styles
  already defined in `src/input.css`).
- **Motion:** Honor `prefers-reduced-motion` (rule already present in `src/input.css`).
- **Semantics:** Proper landmark structure (`header`/`main`/`footer`), one `h1`, logical
  heading order, a skip link (already present), and meaningful `alt`/labels.
- **Reduced reliance on color:** Status communicated by text + shape, not color alone.
- **Zoom/reflow:** Usable at 200% zoom and 320px width without loss of content/function.

---

## 10. Visual & content design direction

- **Palette:** Cream/parchment (`stone-50`/`stone-100`) with **cardinal** (`cardinal-700`/
  `cardinal-900`) accents; muted `stone-700` for secondary text; `pine-700` reserved for
  the salamander/wildlife advisory accent. (All tokens already defined in `src/input.css`.)
- **Typography:** Serif display (`font-display`, Georgia) for headings/seal/readouts;
  sans (`font-body`, Helvetica Neue) for body and data labels; a monospace treatment for
  precise numeric readouts to reinforce the "instrument" feel.
- **Texture:** A faint topographic-contour rendering of the dry lakebed behind the
  content (decorative, `aria-hidden`, low contrast so it never harms legibility).
- **Tone of voice:** Sober, bureaucratic, precise. Never winks at the camera. Comedy
  comes from treating absurdity with total institutional seriousness.
- **Layout:** Mobile-first single column → measured multi-column grid at `sm`/`md`/`lg`.
  Generous whitespace, hairline rules, tabular figures, official-document spacing.

---

## 11. Non-functional requirements

- **Performance:** First meaningful paint < 1.5s on a mid-tier mobile over 3G-class
  network; static content never blocked on network. Total JS payload small (vanilla,
  no heavy framework). No layout shift when live data arrives (reserved space).
- **Resilience:** Page is fully functional with JavaScript-driven enhancements failing
  gracefully; core content is in the HTML.
- **Browser support:** Latest 2 versions of Chrome, Firefox, Safari, Edge; iOS Safari and
  Android Chrome.
- **Privacy:** No tracking, no third-party scripts beyond the two named data APIs.
- **Maintainability:** Pure functions (parsing, unit conversion, model) separated from
  DOM/render code and unit-tested.

---

## 12. Acceptance criteria

The project is complete when:

1. The page loads as a credible, museum-grade hydrology dashboard on mobile and desktop.
2. **Current depth reads 0.00 ft (0.00 m), utilization 0.0000%**, in every normal state.
3. Real **USGS creek** discharge + gauge height render live, with timestamp, and degrade
   gracefully when the API is unavailable (cached → offline copy), never showing fake creek data.
4. Real **Open-Meteo** precipitation drives the 7-day forecast, including the rare
   **0.01 ft (trace)** bump on wet days, with a static fallback when the API fails.
5. All modules in §5 are present and behave per spec.
6. The **unit toggle** converts every applicable quantity and persists across reloads.
7. The **HISTORIC FILL** easter egg triggers on real flood-stage gauge height and via the
   documented manual affordance, and is cleanly reversible.
8. **Accessibility:** WCAG 2.2 AA checks pass (contrast, keyboard, reduced-motion, SR
   equivalents for ticker/charts, semantic structure).
9. The site is **fully static**, runs entirely client-side, persists via `localStorage`,
   and deploys cleanly to GitHub Pages under `participants/imonroe/`.
10. Unit tests cover the parsers, unit conversions, and the model logic, and pass.

---

## 13. Out of scope (explicitly)

- Real-time websockets, push notifications, or background sync.
- Historical data beyond what the live APIs return for the current window.
- Internationalization beyond the English/"El lago que casi no existe" flavor line.
- Any write/POST to external services.
