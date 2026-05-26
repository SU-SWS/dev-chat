# Dev Chat Hackathon — imonroe

## Scope
All work stays inside `participants/imonroe/`. Do not touch any other folder in the repo.

## Stack
- Tailwind CSS v4 (via CLI, no config file)
- Plain HTML + vanilla JS — no framework unless the theme clearly calls for one
- `src/input.css` → compiled to `style.css` at build time

## Build commands
```bash
npm run build   # one-shot compile (minified)
npm run dev     # watch mode
```

Run `npm run build` after any change to `index.html` or `src/input.css` so `style.css` stays in sync before committing.

## Design tokens (already in src/input.css)
- `cardinal-700` / `cardinal-900` — Stanford red (`#8c1515` / `#5f0f0f`)
- `stone-50` / `stone-100` / `stone-700` — warm neutrals
- `font-display` — Georgia serif (headings)
- `font-body` — Helvetica Neue sans (body)

## Workflow during the hackathon
1. Theme is announced — decide on a concept quickly (2–3 min max)
2. Sketch the page structure in `index.html` using Tailwind utility classes
3. Run `npm run dev` for live CSS recompilation while building
4. Run `npm run build` before committing
5. Commit: `git add participants/imonroe && git commit -m "imonroe: <description>" && git push`

## Commit format
```
imonroe: <short description>
```

## Live URL
`https://between-two-ferns.stanford.edu/participants/imonroe/`
