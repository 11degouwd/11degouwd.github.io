# TODO — 11degouwd.github.io

Website/repo work only — building and editing the site itself. Run from a
Claude Code session opened inside this repo. For VM/ntfy/tooling work, see
the separate list in `~/portfolio-automation/TODO.md`.

## From VM setup verification (setup-instructions.md)
- [ ] `hugo server -D` runs cleanly from `~/11degouwd.github.io`
- [ ] `cd tests && npx playwright test` runs (even if some assertions fail
      against placeholder selectors — it should at least execute)
- [x] `.claude/settings.json`'s Notification hook fires — confirmed
      extensively 2026-07-19/20 (see `~/portfolio-automation/CHANGELOG.md`):
      the hook config moved to the global `~/.claude/settings.json` in
      commit `a90c07a` and is machine-wide, not project-scoped, so
      dozens of live-confirmed pushes from `PermissionRequest`/
      `Notification` firing during that work (including from a
      background/child-job session, the same session type this repo's
      own sessions run as) directly cover this item — no need to
      re-trigger it from inside this specific repo.

## Pre-content-work blockers (from CLAUDE.md § Open TODOs)
- [x] Confirm push-approval requests reach ntfy — confirmed 2026-07-19/20:
      `Bash(git push*)` is in the global `permissions.ask` list, so any
      ad-hoc push proposed directly in a session (in this repo or any
      other) triggers the same `PermissionRequest` → `on-notification.sh`
      path live-tested extensively that day. `issue-runner`'s own gate was
      already confirmed separately before this.
- [ ] Scope the ship-* skills correctly — `ship-content` should only touch
      `content/`, `ship-automation` only outside this repo; neither is
      enforced yet. May need a third skill, `ship-site`, for Hugo
      code/feature changes (layouts, CSS, JS, shortcodes).
- [ ] Trim CLAUDE.md for conciseness — it's grown long with incident
      writeups (sandbox/notification debugging, etc.); cut down before
      starting content work.
- [ ] Fix CI — fails on every push. Root cause:
      `layouts/partials/project-cards.html` calls
      `delimit .Params.tags "|"` on a portfolio page whose `tags` is nil.
      Also check the "Missing company page:
      companies/justinNeilEngineering" warning.

## Contact-form Playwright test
- [ ] Build the actual Playwright test for the contact form (currently
      untested). Captcha blocks raw `curl`/API submissions — don't try to
      bypass it programmatically; research Formspree's own
      testing/bypass mechanisms or a separate test-mode endpoint first, or
      accept this stays a manual/semi-manual check.
- [ ] Decide + implement the `_subject` field mechanism so test
      submissions can be tagged `PORTFOLIO-QA-TEST` (needed for the
      automation-side Gmail filter to route them — see
      `~/portfolio-automation/TODO.md`). Either add a hidden `_subject`
      field to the form template (touches production markup) or bypass
      the UI and POST directly to Formspree for this one check.
