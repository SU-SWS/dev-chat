# 🛠️ Dev Chat Hackathon

Welcome! This is our shared workspace for the Dev Chat hackathon session. Everything you build today will live here and be published to our Stanford-hosted Pages site for the world to marvel at (or question).
 
---
 
## Getting started
 
### 1. Clone the repo
 
```bash
git clone https://github.com/SU-SWS/dev-chat.git
cd dev-chat
```
 
### 2. Create your folder
 
Inside the `participants/` directory, create a folder using your first name or GitHub username. Keep it lowercase and no spaces.
 
```bash
mkdir participants/[YOURNAME]
```
 
### 3. Add your files
 
At minimum, you need an `index.html` in your folder. Everything else is up to you.
 
```
participants/
  [YOURNAME]/
    index.html       ← required
    style.css        ← optional
    script.js        ← optional
    anything-else/   ← go wild
```
 
### 4. Build your thing
 
You have 50 minutes. Go.
 
A few ground rules:
- Keep everything inside your own folder
- Your project should be web-based and run in the browser
- Have fun with it

### 5. Commit and push
 
When you are done (or when time is up, whichever comes first):
 
```bash
git add participants/yourname
git commit -m "yourname: add project"
git push
```
 
If you run into a merge conflict on push, just pull first:
 
```bash
git pull --rebase
git push
```
 
---
 
## Viewing your project live

Once pushed, your project will be live at:

```
https://between-two-ferns.stanford.edu/participants/[YOURNAME]/
```

The main landing page for the gallery lives at:

```
https://between-two-ferns.stanford.edu/
```

It may take a minute or two for GitHub Pages to pick up new changes after a push.

---

## Build and publishing

This repo is deployed through GitHub Actions and GitHub Pages.

### How the build works

- Every push to `main` triggers the Pages workflow.
- The workflow loops through every folder in `participants/`.
- If a participant folder has a `package.json`, the workflow installs dependencies and runs its `build` script.
- Package manager detection is automatic:
  - `pnpm-lock.yaml` → pnpm
  - `yarn.lock` → yarn
  - otherwise → npm
- If a participant project is plain static HTML/CSS/JS with no `package.json`, it is published as-is with no build step.

### How publishing works

- After builds complete, the workflow prepares a clean Pages artifact from the repository contents.
- Build-only files such as `node_modules` and package manager lockfiles are removed from the published artifact.
- The artifact is then deployed to GitHub Pages, which serves the site on the custom domain:

```
https://between-two-ferns.stanford.edu/
```

### What this means for participants

- Keep all of your project files inside your own folder under `participants/`.
- If your project needs a build step, include a `package.json` and a `build` script in that folder.
- If your project does not need a build step, a simple `index.html` is enough.
 
---
 
## Folder structure
 
```
/
├── index.html              ← gallery page (do not edit)
├── participants/
│   ├── yourname/           ← your folder
│   └── ...
└── README.md
```
 
---
 
## Questions?
 
Ping in #between-two-ferns or just ask during the session. Good luck! 🎉
