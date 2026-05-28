# AI Dump

## Working constraints

- Build everything inside `participants/joegl/`
- Total hackathon build time is about 1 hour
- Theme: build something completely useless
- Desired tone: Taskmaster-style commitment to an absurd premise
- Best fit: small static web app with a clear joke and one satisfying interaction loop

## Product guidance

- The joke should be understandable within a few seconds
- The app should act overly serious about a pointless problem
- A Stanford twist helps the bit land faster
- Scope should stay narrow enough to polish presentation, copy, and interaction

## Current direction

- Explore ideas inspired by `Taskmaster`
- Prefer concepts that feel like a fake official tool, quiz, judge, or ceremonial evaluator
- No implementation has started yet
- New direction: build a suite of useless evaluators rather than a single joke app
- Preferred mechanic: pull in real benign data and transform it into useless metrics, judgments, or ceremonial evaluations

## Candidate ingredients

- Arbitrary scoring
- Fake authority
- Rules that sound precise but are obviously ridiculous
- Dramatic reveal screens
- Stanford campus references
- Real weather, time, map, or transit data used for unserious conclusions

## Portfolio concept

- One site containing multiple useless tools
- Shared tone: fake bureaucracy, precise scoring, ceremonial verdicts
- Shared data spine: weather, time, optional geolocation, optional reverse geocoding
- Shared UI pattern: input card, live conditions card, absurd score breakdown, final certificate/verdict
- Chosen implementation stack: plain `index.html`, `style.css`, and `script.js`
- Avoid frameworks and build tooling unless a later feature strictly requires it

## Current app candidates

- `Official Loitering Certification Exam`
- `Outdoor Hardship Calculator`
- `Queue Suffering Index`
- `Vibes Audit Engine`
- `Personal Gravitas Forecaster`
- `Official Errand Difficulty Bureau`

## Reusable implementation pieces

- Data fetch layer for current weather and time-based derived metrics
- Optional location permission flow
- Shared score engine that turns inputs into weighted sub-scores
- Shared result screen with rank, explanation, and downloadable or shareable copy
- Copywriting system: dead-serious labels, categories, and faux-official language
- Weather source selected: Open-Meteo browser-side forecast API with no key

## Current implementation status

- Static app shell exists
- Shared live weather fetch exists
- Current evaluators exist:
	- `Outdoor Hardship Calculator`
	- `Vibes Audit Engine`
	- `Official Loitering Certification Exam`
	- `Queue Suffering Index`
	- `Personal Gravitas Forecaster`
	- `Official Errand Difficulty Bureau`
- Local browser validation passed with live weather data rendering and tool switching working
- New evaluator scoring was recalibrated after first pass saturation so tools produce differentiated scores under the same conditions
- Shareable certificate panel now exists in the result view
- Copy-to-clipboard action works for the active tool's current result
- Control labels, captions, and submit button text now adapt per tool
- Score panel accent theming now changes per tool via `body[data-tool]`
- Current brand direction: `Stanford Bureau of Useful Metrics`
- Tone direction: faux-official Stanford-adjacent administration played completely straight
- Certificate language now uses registrar-style copy and a mock institutional sign-off
- Typography direction now uses a formal serif plus neutral sans to feel university-adjacent
- Visual identity now includes a parody mock shield logo and explicit non-official disclaimer text
- Default jurisdiction is now `Redwood City, CA` with a preset location selector for nearby cities
- Weather display now uses Fahrenheit and mph
- Browser-location denial path now degrades cleanly instead of blocking use of the app
- Palette was pushed further toward cardinal red, off-white, and restrained gold to reduce the earlier tan cast
- Each calculator now maps to a distinct faux office with its own office code, office banner, and explanatory note
- The shared select now renders 5 tool-specific options instead of reusing one generic 3-option set
- Two extra sliders now exist: composure and theatrics
- Mock logo was simplified from the shield treatment to a cleaner parody wordmark block
- Controls now stage changes; calculators no longer auto-recompute on every input change
- The submit button is now the intentional reveal moment, with result pop animation and scroll-to-result behavior
- Slider helper text now says `Selected` instead of `Current` to clarify that values are staged inputs
- Certificate parody disclaimer was moved to the footer/sign-off position
- Stanford atmosphere now leans further into cardinal red plus a small redwood motif

## Sensible build order

- Start with a weather-and-time-driven app because it proves the shared data layer
- Best first builds:
	- `Outdoor Hardship Calculator`
	- `Vibes Audit Engine`
	- `Official Loitering Certification Exam`
- After the first app works, reuse the same data for the others and swap scoring logic plus copy