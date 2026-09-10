---
name: ship-site
description: Update CHANGELOG.md for the current branch's Hugo code/site changes (layouts, CSS, JS, shortcodes, hugo.yaml, tests) and commit everything locally — never pushes. Use when the user asks to "commit and update the changelog" for a feature/CSS/JS/template fix. Specific to this repo (11degouwd.github.io), scoped to site code rather than content/ — use ship-content instead for content/-only changes, or ship-automation for changes outside this repo.
---

Wrap up the current branch's Hugo site-code changes (layouts, partials, shortcodes, CSS, JS, `hugo.yaml`, `tests/`) with a changelog entry and a local commit. Do not push — this skill's job ends at the commit; pushing to `main` always goes through the approval gate in CLAUDE.md § Push & Deploy Governance.

This is the site-code counterpart to `ship-content` (content/-only) and `ship-automation` (outside this repo, in `~/portfolio-automation`).

## Steps

1. **Check there's something to do.** `git status` and `git diff main...HEAD --stat` — if there are no changes vs `main`, say so and stop.
2. **Check scope.** Look at the changed files (excluding `CHANGELOG.md`/`TODO.md`, which any ship-* skill may touch). If the diff is entirely under `content/`, this is the wrong skill — tell Dan to use `ship-content` instead and stop. If the diff mixes `content/` changes with site-code changes (layouts/CSS/JS/etc.), ask whether to split them into separate commits (content vs. code) or proceed together — don't just guess and bundle silently.
3. **Full-site QA before committing**, since site-code changes (templates, CSS, JS) carry more regression risk than a content-only edit and can affect every page, not just one. Run the `qa-tester` subagent per CLAUDE.md § Full-Site QA — desktop + mobile, light + dark, console errors, visual regressions — unless equivalent QA was already run earlier in this same conversation for these exact changes (don't re-run redundantly, but don't skip if it's never been checked).
4. **Update the changelog.** Invoke the `changelog-writer` subagent (same one `/changelog` uses) to write or update the `CHANGELOG.md` entry, including desktop + mobile screenshots where the change is visual. It stages `CHANGELOG.md` itself but does not commit — let it finish before continuing. Skip this step only if the changelog is already staged with an entry that clearly covers the current diff.
5. **Stage the rest of the changes.** Run `git status` to see what else needs staging, and add the specific changed files by name (not `git add -A`/`.`) — skip anything that looks like a secret or an unrelated in-progress edit. Double-check no `content/` files are being swept in unless step 2 explicitly decided to bundle them.
6. **Review before committing.** `git diff --staged` to confirm everything staged actually belongs in this commit.
7. **Commit.** Message is 1-3 sentences: what changed and why, nothing else — no trailers, no narrated process. If the "why" isn't clear from the diff or task, ask Dan rather than guessing.
8. **Stop.** Do not run `git push` under any circumstances. Report the commit hash and a one-line summary, and note explicitly that it hasn't been pushed.
