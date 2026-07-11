---
name: ship-content
description: Update CHANGELOG.md for the current branch's changes and commit everything (code + changelog) locally — never pushes. Use when the user asks to "commit and update the changelog", "commit with a changelog entry", or to wrap up a feature branch with a documented commit. Specific to this repo (11degouwd.github.io) — for changes to ~/portfolio-automation itself, use ship-automation instead, which also pushes.
---

Wrap up the current branch's changes with a changelog entry and a local commit. Do not push — this skill's job ends at the commit; pushing to `main` always goes through issue-runner's approval gate instead (see CLAUDE.md § Push & Deploy Governance).

## Steps

1. **Check there's something to do.** `git status` and `git diff main...HEAD --stat` — if there are no changes vs `main`, say so and stop.
2. **Update the changelog first.** Invoke the `changelog-writer` subagent (same one the `/changelog` command uses) to write or update the changelog entry for these changes, including desktop + mobile screenshots where applicable. It splits entries between this repo's `CHANGELOG.md` (portfolio site changes) and `~/portfolio-automation/CHANGELOG.md` (Claude Code workspace/tooling changes — agents, skills, commands, CLAUDE.md files — kept outside this repo and never staged). It stages `CHANGELOG.md` itself when it writes a portfolio entry, but does not commit — let it finish before continuing. Skip this step only if the relevant changelog(s) are already staged/updated with an entry that clearly covers the current diff. If the diff is workspace-only, there may be nothing to stage from this step at all — that's expected, move on to step 3.
3. **Stage the rest of the changes.** Run `git status` to see what else needs staging, and add the specific changed files by name (not `git add -A`/`.`) — skip anything that looks like a secret or an unrelated in-progress edit.
4. **Review before committing.** `git diff --staged` to confirm everything staged actually belongs in this commit.
5. **Commit.** Write a concise commit message describing why the change was made (not just what), following this repo's existing commit style (`git log` for reference) and ending with the `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>` trailer.
6. **Stop.** Do not run `git push` under any circumstances, even if it seems like the obvious next step. Report the commit hash and a one-line summary, and note explicitly that it hasn't been pushed.
