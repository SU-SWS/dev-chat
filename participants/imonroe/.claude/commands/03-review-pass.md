We are now going to do a review pass to catch any problems which may have gotten through.

I want you to take a thorough look through code in the project with a critical eye and find: 

- Any bugs in the code. This includes syntax problems, logic problems, or test failures.
- Any redundant or unused code.  There should be no dead code branches.
- Uncaptured exceptions.  All exceptions should be caught and presented to the user with friendly, non-technical explanations, with suggestions to correct them.
- Deprecated functions, or out of date versions of libraries/modules.
- Anywhere we're deviating from the designs found in the `designs/` directory.
- Security issues
- Accessiblity issues.  We are shooting for WCAG 2.1 AA compliance https://www.w3.org/WAI/WCAG22/quickref/?versions=2.1&currentsidebar=%23col_customize&levels=aaa 

IMPORTANT: Do not try to fix any problems you find.  This is a review pass, so whatever issues you find should be documented in the `docs/fix-checklist.md` file along with all the pertinent details.  This will create a backlog of problems to look through and fix in a future step.

When you have completed your review and written the issues into the `docs/fix-checklist.md` file, commit the changes to the current branch, then let me know this step is complete and wait for my go-ahead before continuing. When I give the go-ahead, if the context window is growing large, run `/compact` first — then follow the instructions in @.claude/commands/04-build-pass-2.md

