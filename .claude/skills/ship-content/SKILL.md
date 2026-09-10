---
name: ship-content
description: Update CHANGELOG.md for the current branch's content/ changes (portfolio/company/experience pages, homepage copy) and commit everything locally — never pushes. Use when the user asks to "commit and update the changelog", "commit with a changelog entry", or to wrap up a content edit with a documented commit. Specific to this repo (11degouwd.github.io), scoped to content/ — use ship-site instead for Hugo template/CSS/JS/shortcode changes, or ship-automation for changes outside this repo.
---

Wrap up the current branch's content/ changes with a changelog entry and a local commit. Do not push — this skill's job ends at the commit; pushing to `main` always goes through issue-runner's approval gate instead (see CLAUDE.md § Push & Deploy Governance).

This is the content counterpart to `ship-site` (Hugo layouts/CSS/JS/site code) and `ship-automation` (outside this repo, in `~/portfolio-automation`).

## Steps

1. **Check there's something to do.** `git status` and `git diff main...HEAD --stat` — if there are no changes vs `main`, say so and stop.
2. **Check scope.** Look at the changed files (excluding `CHANGELOG.md`/`TODO.md`, which any ship-* skill may touch). If the diff is entirely outside `content/` (layouts, CSS, JS, `hugo.yaml`, `tests/`), this is the wrong skill — tell Dan to use `ship-site` instead and stop. If it mixes `content/` with site-code changes, ask whether to split into separate commits or proceed together — don't just guess and bundle silently.
3. **Update the changelog first.** Invoke the `changelog-writer` subagent (same one the `/changelog` command uses) to write or update the changelog entry for these changes, including desktop + mobile screenshots where applicable. It splits entries between this repo's `CHANGELOG.md` (portfolio site changes) and `~/portfolio-automation/CHANGELOG.md` (Claude Code workspace/tooling changes — agents, skills, commands, CLAUDE.md files — kept outside this repo and never staged). It stages `CHANGELOG.md` itself when it writes a portfolio entry, but does not commit — let it finish before continuing. Skip this step only if the relevant changelog(s) are already staged/updated with an entry that clearly covers the current diff. If the diff is workspace-only, there may be nothing to stage from this step at all — that's expected, move on to step 4.
4. **Stage the rest of the changes.** Run `git status` to see what else needs staging, and add the specific changed files by name (not `git add -A`/`.`) — skip anything that looks like a secret or an unrelated in-progress edit.
5. **Review before committing.** `git diff --staged` to confirm everything staged actually belongs in this commit.
6. **Commit.** Message is 1-3 sentences: what changed and why, nothing else — no trailers (no `Co-Authored-By`, no session links), no narrated process. If the "why" isn't clear from the diff or task, ask Dan rather than guessing; don't spend much effort digging for it beyond that.
7. **Stop.** Do not run `git push` under any circumstances, even if it seems like the obvious next step. Report the commit hash and a one-line summary, and note explicitly that it hasn't been pushed.
