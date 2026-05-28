# Implementation Plan

## LAGUNITA — Real-Time Lake Conditions & Tide Tracker

This plan turns `docs/prd.md` into a buildable roadmap. It (1) evaluates three competing
implementation strategies and selects one, then (2) lays out a thorough, step-by-step
build plan for the selected strategy.

---

## Part 1 — Strategy evaluation

Rating scale: **1 (worst) – 5 (best)**. We prefer **low complexity, high ease of
implementation, high elegance**. "Elegance" here = the right amount of machinery for a
single self-contained client-side artifact whose whole point is looking like a credible
instrument while being trivially honest underneath.

### Strategy A — Vanilla static page (HTML + Tailwind + ES-module JS + hand-rolled SVG)

A single `index.html`, Tailwind v4 pre-compiled to `style.css` (already the repo's
pattern), a small set of vanilla ES modules (data fetch/parse, the "model", unit
conversion, lore constants, render/wire-up), hand-authored SVG for the chart, sparkline,
seepage gauge, and seal. State in `localStorage`. Tests via Node's built-in `node:test`
on the pure modules.

- **Complexity: 5/5 (lowest).** No framework, no bundler runtime, no hydration. One page,
  a few small files. CI either publishes static as-is or runs one Tailwind compile.
- **Ease of implementation: 5/5.** Nothing fights us. The "flatline at zero" chart and
  pinned gauge are easier hand-drawn in SVG than coerced out of a chart library. The data
  layer is two `fetch` calls and two pure parsers. Highly parallelizable across modules.
- **Elegance: 5/5.** Exactly the machinery the artifact needs and no more. The bespoke SVG
  gives pixel-perfect control over the deadpan, museum-grade aesthetic the joke depends on.
  Self-contained, fast, resilient, easy to reason about and test.

### Strategy B — Vite + React + shadcn/ui + Tailwind + Recharts

A componentized React app: shadcn primitives (Card, Switch, Tooltip, Badge) for chrome,
Recharts for the trend/sparkline, Vite for the build, deployed as a static bundle.

- **Complexity: 2/5.** Adds a real build pipeline (Vite, React, JSX, a bundler), a CI build
  step that must succeed against `npm`/`pnpm`, base-path config so assets resolve under
  `/participants/imonroe/`, and a larger payload — all for one mostly-static page.
- **Ease of implementation: 3/5.** shadcn accelerates generic chrome (switch, cards,
  badges), but those are a small fraction of this UI. The load-bearing visuals — animated
  radial seepage gauge, the contour seal, the topographic background, and an area chart
  that must look like a perfect zero-flatline with an unreachable threshold line — are
  custom anyway, and Recharts actively fights a "always zero" aesthetic (auto-scaled axes,
  tooltips, responsive container quirks). Net: more setup, similar custom work.
- **Elegance: 2/5.** A React+bundler stack for a single deadpan static page is
  over-engineered; the framework weight is disproportionate to the payload and obscures
  how simple the thing actually is.

### Strategy C — Vanilla Web Components + Tailwind + a lightweight chart lib (uPlot)

Encapsulate each module as a custom element (`<lagunita-hero>`, `<seepage-gauge>`, …),
shared state via a tiny event bus, charts via uPlot.

- **Complexity: 3/5.** No framework, but custom-element lifecycle, shadow-DOM/Tailwind
  interplay, and a third-party chart dependency add ceremony beyond what one page needs.
- **Ease of implementation: 3/5.** Component encapsulation is nice but unnecessary for a
  single non-reused page; Tailwind utilities + shadow DOM require extra wiring, and uPlot
  must still be styled into the zero-flatline look.
- **Elegance: 4/5.** Conceptually tidy, but the encapsulation buys little for a one-page
  artifact with no component reuse, so it's elegance spent where it isn't needed.

### Scorecard & decision

| Strategy | Complexity | Ease | Elegance | Total |
|----------|:---------:|:----:|:--------:|:-----:|
| **A — Vanilla static + hand SVG** | **5** | **5** | **5** | **15** |
| B — Vite + React + shadcn + Recharts | 2 | 3 | 2 | 7 |
| C — Web Components + uPlot | 3 | 3 | 4 | 10 |

**Selected: Strategy A.**

**Why (and a note on shadcn):** the project guidance suggests considering shadcn to cut
front-end time. We deliberately decline it here because shadcn is a React component
library, and this dashboard's visual load is bespoke data-visualization and official-seal
craft — not the forms/dialogs/menus shadcn excels at. Adopting React+Vite+shadcn would add
a build pipeline, base-path config, and bundle weight while leaving the hard parts (gauge,
chart, seal, topo texture) custom regardless. Strategy A keeps Tailwind (already
configured in `src/input.css`) for layout speed, hand-rolls the few bespoke SVGs, and
ships a fast, resilient, fully static page — the lowest-complexity, highest-elegance fit
for the brief. If a later need for rich interactive components emerges, we can revisit.

---

## Part 2 — Build plan (Strategy A)

### 2.0 Architecture overview

```
participants/imonroe/
├── index.html              # Semantic structure + module containers (static-first)
├── style.css               # Compiled Tailwind output (committed) — DO NOT hand-edit
├── src/
│   └── input.css           # Tailwind source + @layer for bespoke component CSS
├── js/
│   ├── config.js           # Endpoints, thresholds, intervals, lore constants
│   ├── lore.js             # Static copy: stats, ticker bulletins, advisories
│   ├── units.js            # Pure unit conversion + number formatting
│   ├── data.js             # fetch + pure parsers for USGS & Open-Meteo (+ cache I/O)
│   ├── model.js            # The "brutally honest" hydrology model (always-zero logic)
│   ├── svg.js              # Pure SVG builders: area chart, sparkline, radial gauge, seal
│   ├── store.js            # localStorage read/write (defensive) + unit state
│   ├── ticker.js           # Conditions ticker (scroll + reduced-motion fallback)
│   ├── easteregg.js        # HISTORIC FILL detection + manual trigger + reversible state
│   └── main.js             # Orchestration: load → render → wire events → schedule refresh
├── tests/
│   ├── units.test.js       # node:test — conversions & formatting
│   ├── data.test.js        # node:test — USGS/Open-Meteo parsers w/ fixture payloads
│   └── model.test.js       # node:test — always-zero, trace bump, flood detection
├── tests/fixtures/         # Saved real API responses (normal + flood + empty)
├── docs/                   # prd.md, implementation_plan.md (this file)
├── designs/                # Pencil .pen design files (produced in the design pass)
├── package.json            # build (tailwind compile), test (node --test), format (prettier)
└── .prettierrc             # Formatting config
```

**Separation of concerns:** `units.js`, `data.js` (parsers), and `model.js` are **pure and
unit-tested**. `main.js`, `ticker.js`, `easteregg.js`, `store.js` own DOM/`localStorage`
side effects and are thin. SVG builders are pure (input data → SVG string/nodes).

**Module loading:** native ES modules (`<script type="module" src="js/main.js">`). No
bundler. Static content lives in `index.html` so the page is meaningful before JS runs;
JS enhances and hydrates the live numbers.

### 2.1 Build & deploy approach (resolve the static/CI question first)

- Tailwind v4 is compiled from `src/input.css` → `style.css`, matching the existing repo
  pattern. We **commit the compiled `style.css`** so the site is publishable even if CI
  runs no build step.
- `package.json` gains:
  - `"build": "npx @tailwindcss/cli -i src/input.css -o style.css --minify"`
  - `"test": "node --test"`
  - `"format": "prettier --write ."`
- The Pages workflow (`deploy-pages.yml`) runs `build` if present (using `npm install` since
  there's no committed lockfile) and then publishes the folder, stripping `package.json`/
  `node_modules`. Because we also commit `style.css`, both the build-runs and build-skipped
  paths yield a working site. **No server-side anything.** Verify asset paths are
  **relative** (`href="style.css"`, `src="js/main.js"`) so they resolve under the
  `/participants/imonroe/` subpath.
- Add bespoke component CSS (gauge keyframes, topographic background, ticker animation,
  status-pill styles, print/`prefers-reduced-motion` rules) inside `src/input.css` under
  `@layer components`, so it compiles into `style.css` (no extra stylesheet, no FOUC).

### 2.2 Step-by-step implementation

Steps are ordered so the page is demoable early and hardened progressively. Where marked
**∥**, work can be parallelized across modules/files.

**Step 1 — Scaffolding & tokens**
1. Confirm `src/input.css` tokens (cardinal/stone/pine, display/body fonts) — already present.
2. Add `@layer components` block in `src/input.css` for: `.status-pill`, `.topo-bg`,
   `.gauge`, `.ticker`, numeric/mono treatment, hairline rules. Add an
   `@keyframes` for the seepage gauge sweep and ticker scroll, each guarded by
   `prefers-reduced-motion`.
3. Set up `package.json` scripts and `.prettierrc`. Run the Tailwind build once to refresh
   `style.css`.

**Step 2 — Static HTML skeleton (semantic, accessible, mobile-first)**
1. Replace the placeholder `index.html` body with the full module structure from PRD §5:
   masthead/seal, hero readout, trend chart container, sparkline, seepage gauge, tide
   table, 7-day forecast, utilization stat, live creek module, ticker, salamander
   advisory, footer. Keep the existing skip link.
2. Use landmarks (`header`/`main`/`footer`), one `h1`, logical heading order. Bake the
   static lore values directly into the HTML so the page is meaningful without JS.
3. Reserve fixed space for live values to avoid layout shift on hydration.

**Step 3 — Config & lore (∥)**
1. `config.js`: endpoints (USGS IV, Open-Meteo), gauge id `11164500`, coords
   `37.4232,-122.1760`, flood threshold `11.0` ft, trace threshold `2` mm, refresh
   interval `5 min`, capacity `115_000_000` gal, seepage `-500` gal/min, trail `0.9` mi.
2. `lore.js`: ticker bulletin array, tide-table generator inputs, salamander advisory copy,
   "since 2001 / Jan 2023" constants, deadpan offline strings.

**Step 4 — Units module (pure, test-first) (∥)**
1. Implement `convert(value, quantity, system)` and `formatNumber(value, opts)` covering
   depth, discharge, volume, seepage rate, distance, temperature per PRD §6.
2. `units.test.js`: assert ft→m, cfs→m³/s, gal→L, mi→km, °F→°C; assert 0 stays 0; assert
   formatting (fixed decimals, thousands separators, tabular figures).

**Step 5 — Data layer (pure parsers + fetch + cache) (∥)**
1. `data.js` pure parsers:
   - `parseUsgs(json)` → `{ discharge:{value,unit,time}|null, gaugeHeight:{...}|null }`,
     matching variable codes, taking the latest value, mapping sentinels/non-finite → null.
   - `parseOpenMeteo(json)` → `[{ date, precipMm }]` for 7 days.
2. Fetch wrappers with `AbortController` timeout; on success write to `localStorage` cache
   with timestamp; on failure return cached payload if present, else `null`.
3. `data.test.js`: run parsers against saved fixtures in `tests/fixtures/` — a normal USGS
   payload, a flood-stage payload (gauge height ≥ 11 ft), an empty/sentinel payload, and a
   normal + rainy Open-Meteo payload.

**Step 6 — The model (pure, test-first) (∥)**
1. `model.js` `computeConditions({ usgs, openMeteo, now, overrides })` →
   `{ depthFt: 0, utilizationPct: 0, status: 'BONE_DRY'|'TRACE'|'HISTORIC_FILL',
      projectedInflowGal: 0, forecast: [{date, depthFt, trace}], tides: [...],
      seepageGalMin: -500, creek: {...}, floodActive: boolean }`.
2. Rules: depth/utilization always 0 unless flood active; status `TRACE` for the
   forecast-day bump only (display-level), `HISTORIC_FILL` when `gaugeHeightFt >= floodThreshold`
   or manual override; tide times deterministic from `now` (seeded), heights always 0;
   forecast maps precip → 0.01 ft trace when `precipMm >= traceThreshold`.
3. `model.test.js`: normal → all zeros + BONE_DRY; rainy forecast → that day shows trace;
   flood payload → HISTORIC_FILL + non-zero depth; manual override → HISTORIC_FILL.

**Step 7 — SVG builders (pure) (∥)**
1. `svg.js`: `areaChart(series, opts)` (30-day flatline + dashed unreachable threshold,
   gridlines, axis, `<title>`/`<desc>`), `sparkline(series)`, `radialGauge(value, opts)`
   (arc + needle/fill, pinned label), `seal()` (concentric contours + salamander glyph +
   ring text). All return accessible SVG with `role="img"` and labels.

**Step 8 — Store & unit toggle**
1. `store.js`: defensive `get/set` JSON helpers around `localStorage` (try/catch);
   `getUnits()/setUnits()` defaulting to imperial.
2. Wire the masthead toggle: a real, labeled control (`role="switch"`/`aria-checked` or a
   radio-group) that re-renders all unit-bearing values and persists the choice.

**Step 9 — Render & orchestration**
1. `main.js`: on load, render static + cached immediately, then fetch live data, run the
   model, and hydrate the hero, creek module, forecast, chart, sparkline, gauge, tide table.
2. `aria-live="polite"` on the depth/last-updated readout. Show skeleton/placeholder for
   live modules until first data resolves; show deadpan offline copy on failure.
3. Schedule USGS refresh on the configured interval; provide a manual refresh affordance.

**Step 10 — Conditions ticker**
1. `ticker.js`: continuous horizontal scroll of `lore.js` bulletins, pause on hover/focus.
2. Reduced-motion fallback: static rotating/paginated list. Provide the same bulletins as
   an `aria`-exposed list; mark the animated strip `aria-hidden`.

**Step 11 — HISTORIC FILL easter egg**
1. `easteregg.js`: detect real trigger from model `floodActive`; manual trigger via
   `?fill=1` and 5× seal click (counter in `store.js`).
2. Apply an `is-historic-fill` state class that re-themes the UI (alarm treatment, non-zero
   depth, emergency ticker bulletins, status pill HISTORIC FILL). Reversible via reload /
   toggling off. Keep it tasteful and clearly an easter egg.

**Step 12 — Accessibility & responsive hardening**
1. Verify contrast for every text/background and pill pairing (AA). Adjust tokens usage if needed.
2. Keyboard-test all controls; confirm visible focus. Validate landmark/heading structure.
3. Test reduced-motion, 200% zoom, and 320px width. Confirm SR equivalents for ticker/charts.

**Step 13 — Error/edge-state pass**
1. Force each failure mode from PRD §8 (API down, sentinel data, offline, corrupt cache)
   and confirm the page stays complete and the joke holds.

**Step 14 — Formatting, tests, and build**
1. `prettier --write .`; ensure `node --test` passes; run the Tailwind build and commit the
   refreshed `style.css`.
2. Manual smoke test in a browser (mobile + desktop viewports) confirming all PRD §12
   acceptance criteria.

### 2.3 Testing strategy

- **Unit (node:test):** units conversions/formatting, USGS/Open-Meteo parsers (fixture-
  driven), model logic (zeros, trace, flood). These are the correctness-critical pure cores.
- **Fixtures:** capture real API responses once into `tests/fixtures/` (normal, flood,
  empty/sentinel, rainy) so tests are deterministic and offline.
- **Manual/visual:** browser smoke test against acceptance criteria; informed by the Pencil
  designs in `designs/`.

### 2.4 Risks & mitigations

| Risk | Mitigation |
|------|-----------|
| API CORS/availability changes | Cache last-good in `localStorage`; deadpan offline fallback; static modules independent of network. |
| Asset paths break under subpath | Use relative paths throughout; verify on the live subpath. |
| CI build step flakiness | Commit compiled `style.css` so a skipped/failed build still yields a working site. |
| Chart library lock-in / fighting the zero aesthetic | Avoided — hand-rolled SVG. |
| Real flood never occurs to demo the easter egg | Manual trigger (`?fill=1` / 5× seal click). |
| Motion/animation accessibility | All animation guarded by `prefers-reduced-motion` with static fallbacks. |

### 2.5 Alignment with the downstream workflow

- **Design pass (`01-design-pass.md`):** this plan's module list (PRD §5) and visual
  direction (PRD §10) drive the Pencil designs saved to `designs/`.
- **Build pass (`02-build-pass-1.md`):** implement the steps above, reading the `designs/`
  for visual styling and writing tests + prettier as we go.
- **Review/second-build/docs passes:** the acceptance criteria (PRD §12) and this plan's
  step list are the checklist for the review and documentation passes.

### 2.6 Definition of done

All PRD §12 acceptance criteria met: a credible, accessible, responsive, fully static
client-side dashboard that reports the lake bone dry forever, is genuinely live off USGS +
Open-Meteo data with graceful degradation, supports a persistent metric/imperial toggle,
hides a reversible HISTORIC FILL easter egg, and passes its unit tests, lint, and build.
