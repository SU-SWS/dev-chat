Today we are going to participate in a hackathon.

Rules: 

- This repo is set up to automatically deploy via Github Pages.  That means we cannot use anything server-side; any logic, state management, or interactivity has to run in the browser only.  Any storage we might need (of user input or files for instance) should use `localStorage` if possible.
- You must only work within this folder (`imonroe`).  Each participant in the hackathon will have their own folder, and so we do not want to touch anyone elses work.
- You have the freedom to use whatever tooling you want.  However, I would strongly consider using a UI component library such as `shadCN` (https://ui.shadcn.com/) in order to cut down development for front-end features.  The goal here isn't to be as pretty as possible, it is to be as user-friendly and complete as possible.

I have put the basic idea of what we are supposed to build in the `docs/project-theme.md` file.

First, we need a product requirements document.  I want you to think hard, and construct a thorough product requirements document fully capturing everything we're going to need to implement.  This is going to serve as the foundation of what we build, so think through it. I want you to write up the PRD in the `docs/prd.md` document.

Then, read the contents of `docs/prd.md` file and think hard about how to implement it fully.  You should come up with at least three competing strategies.  Rate each of the strategies based on complexity, ease of implementation, and elegance.  Prefer low complexity, high ease of implementation, and high elegance.  Select the best strategy.

Then, I want you to think hard and come up with a thorough step-by-step implementation plan to build the project specified in the `docs/prd.md`.  Write up the plan in the document called `docs/implementation_plan.md`

When you are finished with that, commit the changes to the current branch, then let me know this step is complete and wait for my go-ahead before continuing. When I give the go-ahead, if the context window is growing large, run `/compact` first — then follow the instructions in @.claude/commands/01-design-pass.md


