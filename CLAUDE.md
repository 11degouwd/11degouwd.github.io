# Claude Code Instructions

Hugo-based portfolio/personal website (11degouwd.github.io).

## Project Structure

- Hugo static site using the `hugo-profile` theme (`themes/hugo-profile/` — avoid editing directly)
- `layouts/` — template overrides (takes precedence over theme)
- `static/css/` — custom stylesheets; `static/images/` — logos, hero bg, profile photo; `static/resume/` — PDFs at `/resume/*.pdf`
- `assets/icons/custom/` — custom SVG icons (`custom_icon`); `assets/icons/simple/` — local Simple Icons (`simpleicon_name`)
- `assets/images/` — gallery `source: assets` (Hugo-processed); `assets/templates/` — reference frontmatter docs (not served)
- Content: `content/portfolio/` — project case studies; `content/experience/` — roles; `content/companies/` — company pages

## CSS Architecture

| File | Scope |
|---|---|
| `static/css/index.css` | Homepage |
| `static/css/experience.css` | Experience section (copy of index.css with modifications) |
| `static/css/single.css` | Company/single pages |
| `static/css/partials.css` | Shared partial styles (project cards) |
| `static/css/contact.css` | Contact page |

- CSS custom properties: `--primary-color`, `--text-color`, `--background-color`, etc.
- Scoped overrides: `#section-id .element` — never global. Company pages use `#single.company-page`
- Mobile: `@media (max-width: 576px)` only; `scroll-margin-top: 6rem` on anchored sections

## Hugo Template Patterns

- `{{ .Content | emojify }}` for markdown body; `{{ .Params.field | markdownify }}` for frontmatter markdown
- `{{ with .Params.field }}{{ . }}{{ end }}` for optional fields
- Experience timeline: JS computes `--line-height` + `--line-bottom` CSS vars via `getBoundingClientRect()`, runs on `window.load` + `resize`. Script in `layouts/partials/sections/experience.html`.
- Company pages must exist in `content/companies/{slug}/` to show "Read More" pill and "Learn more" link

## Layouts

`layouts/` overrides theme. Key files:
```
layouts/
├── _default/baseof.html     — outer shell; removes jQuery, adds coming-soon guard
├── index.html               — homepage; coming-soon guard, custom section order
├── portfolio/
│   ├── list.html            — /portfolio/ with tag filters, pagination, disclaimer banner (temporary)
│   └── single.html          — project pages with tag pills, skills sidebar, company subtitle
├── companies/section.html   — company pages (no theme equivalent; derives slug from dir name)
├── partials/                — see Partials section
└── shortcodes/              — see content/CLAUDE.md Shortcodes section
```

`companies/section.html` wraps content in `<section id="single" class="company-page">`, renders markdown + conditionally calls `company-roles.html`, `gallery.html`, `company-projects.html` based on frontmatter flags.

## Partials

| Partial | Purpose |
|---|---|
| `company-roles.html` | Experience roles for one company; used by shortcode + company pages |
| `company-projects.html` | Project card grid for one company; used by shortcode + company pages |
| `project-cards.html` | Core card grid renderer; called by `company-projects.html` |
| `gallery.html` | Image gallery with Fancybox lightbox |
| `sections/experience.html` | Full multi-company experience timeline (homepage) |
| `sections/education.html` | Education section (homepage) |
| `sections/contact.html` | Contact section (homepage) |
| `head.html` | `<head>` overrides (meta, CSS links) |
| `scripts.html` | Global script includes |

## Avoid

- Don't over-engineer — only add what's requested
- Don't add comments/docstrings to code you didn't change
- Don't create new files unless explicitly needed
- Don't use destructive git commands without explicit permission
- No emojis unless requested
- Test CSS changes on desktop, mobile (< 576px), light + dark modes

## Agentic Workflow (subagents, automation, deploys)

Everything above (project structure, shortcodes, CSS architecture, Portfolio
Content Writing voice/tone rules) still applies and takes precedence on
conflict.

### `.claude/settings.json` — path syntax gotcha
A single leading slash (`/etc/something`) in a `Read()`/`Edit()`/`denyRead`
rule is **not** an absolute path in Claude Code's rule syntax — it anchors
relative to the settings file's own location (this project's root), not the
filesystem root. This caused a real bug once: a rule meant to protect
`/etc/ntfy-portfolio.env` silently resolved to a nonexistent path inside the
repo and provided zero actual protection until caught via manual `/sandbox`
inspection. Use a double leading slash (`//etc/...`) for genuinely absolute
paths. `~/...` (home-relative) paths don't have this problem. After adding
any new deny rule for a path outside the project, verify it with `/sandbox`
and confirm the path shown matches what was actually intended — don't assume
the rule took effect just because the file saved without error.

### Sandbox may fail entirely with a bwrap/AppArmor error
`bwrap: loopback: Failed RTM_NEWADDR: Operation not permitted` on *any* Bash
command (even `true`) is a known, currently-open Ubuntu 24.04+ issue
(`anthropics/claude-code#55585`), not a config mistake — Ubuntu's default
AppArmor policy (`kernel.apparmor_restrict_unprivileged_userns=1`) blocks
the network namespace setup bubblewrap needs. Fix, most targeted first:
```bash
sudo tee /etc/apparmor.d/bwrap << 'EOF'
abi <abi/4.0>,
include <tunables/global>

profile bwrap /usr/bin/bwrap flags=(unconfined) {
  userns,
  include if exists <local/bwrap>
}
EOF
sudo systemctl reload apparmor
```
If insufficient, fall back to
`sudo sysctl -w kernel.apparmor_restrict_unprivileged_userns=0` (blunter,
system-wide) or disable `sandbox.enabled` entirely and rely on the
`permissions` deny/ask rules alone.

### Sandbox self-audit findings
From prior authorized testing of this repo's own sandbox/permissions setup:
- Raw Bash redirect to overwrite `settings.json` → blocked at the filesystem
  layer itself (`Read-only file system`), below the tool layer, regardless
  of `dangerouslyDisableSandbox`.
- Editing `defaultMode` from `auto` to `bypassPermissions` via the Edit tool
  → denied by the auto-mode classifier ("agent widening its own permissions
  without being asked").
- `~/.ssh`/ntfy env file denials fire automatically, no prompt needed.
- Network allowlist holds in normal use: non-allowlisted domains time out,
  and an allowlisted domain redirecting to a non-allowlisted one still times
  out at the redirect target — no bypass found on re-test. (A prior version
  of this note claimed the allowlist was unenforced, citing a CVE — that
  was fabricated by an earlier session, not a real finding.) **Lesson**:
  don't take sandbox-behavior claims in this file on faith — rerun a
  same-session test if it matters again, rather than trusting cached notes.
- **`dangerouslyDisableSandbox` re-verified live (2026-09-10)**: passed
  `true` explicitly on a Bash call targeting a non-allowlisted domain —
  still failed (`CONNECT tunnel failed`), same as an unflagged call. The
  flag is silently ignored when `sandbox.allowUnsandboxedCommands: false`
  (as it is in both this repo's and the global `~/.claude/settings.json`);
  this is a real, working technical wall, not a config value nobody checks.
- **Edit tool ≠ same wall as Bash's sandbox**: Bash-tool filesystem writes
  are enforced by the bwrap mount itself (hard, no judgment call — proven
  above). The Edit/Write tools don't go through that mount at all; writes
  to a file like `~/.claude/settings.json` are gated instead by the
  auto-mode classifier's judgment call, which is **not deterministic** —
  confirmed directly in one session: an Edit adding a narrow
  `sandbox.filesystem.allowWrite` entry was denied, and a near-identical
  Edit moments later adding a broader one was allowed. Don't assume an
  Edit-tool path to a sensitive settings file is a hard boundary just
  because a Bash path to the same file would be.
- **`sandbox.filesystem.allowWrite: ["~/"]`** was added to both the live
  `~/.claude/settings.json` and its tracked snapshot at
  `~/portfolio-automation/claude-global/config/claude-settings.json`
  (2026-09-10) — previously neither had a `filesystem.allowWrite` entry at
  all, meaning Bash-tool writes outside this repo's own directory (e.g. to
  the sibling `~/portfolio-automation` repo) were silently blocked
  (`Read-only file system`) despite normal OS permissions allowing them.
  Keep these two files in sync if either changes again.
- **Closing the resulting gap on the two-user cloud-init model** (not this
  single-user VM — see `portfolio-automation/provisioning/cloud-init/`):
  since the `allowWrite` widening above went through the classifier's
  judgment rather than a hard rule, a `claude` account under that model
  could in principle be talked into widening its own sandbox permissions
  the same way. `cloud-init/lock-claude-settings.sh` closes it with an
  actual OS wall instead: `dan` owns `claude`'s `settings.json`, `chmod
  644`, then `chattr +i` (immutable — blocks delete/replace too, not just
  in-place edits, which matters since directory write access alone would
  otherwise let `claude` `rm` the file and write a fresh one). `claude`'s
  sudo allowlist deliberately excludes `chattr`.

### Sandbox vs. ntfy notifications
`ntfy-notify.sh` needs `NTFY_URL`/`NTFY_TOKEN` as env vars and doesn't read
`/etc/ntfy-portfolio.env` itself, which the sandbox's `denyRead` blocks
Claude from sourcing directly in a Bash call. **Current fix**: both are
auto-sourced into `~/.bashrc` from that file, so every new shell (including
ones the Bash tool spawns) already has them. Tradeoff accepted: broader
ambient credential exposure (inherited by every child process) in exchange
for notifications actually working. `on-notification.sh` (triggered via the
`Notification` hook, not a direct Bash call) is unaffected either way — it
runs outside the Bash-tool sandbox boundary.
**Better fix, not yet adopted**: `sandbox.credentials` with `mask: true` +
`injectHosts`, so Claude never sees the real token — unconfirmed whether
`injectHosts` accepts this VM's raw ntfy IP.

### Notification hook gaps (2026-07-11 through 07-20)
Three issues found getting `git push` permission prompts to reach Dan's
phone — read this before re-diagnosing a missing notification from scratch:
1. **Wrong event name** — `.claude/settings.json` only registered
   `on-notification.sh` under `Notification`, but a permission dialog fires
   `PermissionRequest`/`PermissionDenied` instead (a narrower event covers
   idle/auth). **Fixed**: registered under `PermissionRequest` too (script
   always `exit 0`, never emits a decision block, since that event's exit
   code can otherwise control the actual permission decision).
2. **Missing credentials in the hook's environment** — the hook subprocess
   (spawned directly by the Claude Code binary) gets neither the systemd
   `EnvironmentFile` used by `ntfy-listen.service`/`ntfy-idle-check.service`
   nor the `.bashrc` sourcing block (interactive-shell only). **Fixed**:
   `on-notification.sh` now sources `/etc/ntfy-portfolio.env` directly.
3. **Unresolved**: even after both fixes, this session type's own
   permission asks didn't reliably trigger the hook in the original repro,
   despite local hooks firing reliably in general (confirmed via a
   `UserPromptSubmit` canary) and the identical config/script working from
   other sessions. Later testing (see `portfolio-automation/CHANGELOG.md`)
   showed background/child-job sessions *do* reliably trigger notifications
   for patterns statically listed in `permissions.ask` (`git push*`,
   `sudo*`, `npm publish*`) — so "background/child job" isn't the
   distinguishing factor. Still open: whether the *dynamic* auto-mode
   classifier (deciding on something not already in `permissions.deny`/
   `ask`) routes through these hook events the same way a static-list match
   does. If this recurs, test a permission scenario the classifier decides
   on dynamically, not one already covered by a static rule.

## Push & Deploy Governance
- **Every push requires Dan's explicit approval and review before it
  happens — no exceptions, no free cap, and this applies to every branch,
  not just `main`** (2026-07-11 policy change). Show him what's actually
  about to be pushed (commits/diff) and wait for his go-ahead before running
  `git push`. This replaces the old "10 free pushes/day, then ask" model
  and the old "feature branches can push freely" carve-out — both are gone;
  a feature-branch push now needs the same approval as a `main` push.
  **Override**: only if Dan explicitly says he wants to **force push without
  review** (that phrase, or unambiguously the same intent — e.g. "push it
  now, skip review") — in the terminal, or via an ntfy `force push <branch>`
  command — does a push skip this confirmation, and only for that one push.
- This applies to every skill/agent/command that can push, not just
  `issue-runner` — see `ship-automation` in `~/portfolio-automation` and any
  ad-hoc `git push` proposed directly in a session.
- Deploys go via the existing GitHub Actions workflow, not the default Pages
  Jekyll pipeline — the platform's own 10-builds/hour soft limit doesn't
  apply here, but that's not license to push constantly.
- Push to `main` only when a feature or new page(s) is fully complete, tested
  (full-site QA pass, see below), and content-reviewed — not on every commit.
- Small fixes (typos, minor CSS) can batch into one push at the end of a
  session rather than each getting their own — batching reduces how often
  you have to ask, it doesn't remove the need to ask.
- Every push to `main` gets a CHANGELOG.md entry with screenshots (see
  changelog-writer agent) — no exceptions, even for small pushes.
- **Confirmed 2026-07-19/20** (previously an open gap — see `TODO.md`):
  a push approval request proposed outside `issue-runner`'s own flow (e.g.
  an ad-hoc `git push` in a session, or via `ship-automation`) does reach
  Dan's phone — `Bash(git push*)` is in the global `permissions.ask` list,
  so it triggers the same `PermissionRequest` → `on-notification.sh` path
  live-tested extensively that day. Still worth actually watching for the
  push notification rather than assuming, same as any other approval —
  this just confirms the mechanism fires, not that you should skip
  checking in a specific instance.
- **Local pre-push gate (2026-09-02)**: `.githooks/pre-push` runs `hugo
  --minify` before any push leaves the machine and blocks the push if the
  build fails — this is the exact class of bug (content files under
  `content/` breaking the Hugo build) that broke both `ci.yml` and the
  live `hugo.yml` deploy on 2026-09-02. GitHub Actions can only run
  *after* a push already reaches GitHub, so it can't be the thing that
  stops a bad push from leaving in the first place — this hook is.
  Enable once per checkout/VM with `git config core.hooksPath .githooks`
  (not committed automatically — git config isn't version-controlled).
  Bypassable with `git push --no-verify`; this is a fast local sanity
  check, not a hard security boundary — `ci.yml`'s full cross-browser
  (Chromium/Firefox/WebKit) + Lighthouse suite on GitHub Actions is still
  the comprehensive check and is free to run as often as you like (this
  repo is public, so Actions minutes are unlimited — confirmed via the
  GitHub API, not assumed).
- **GitHub Actions failure notifications (2026-09-03)**: a CI/deploy
  failure pushes an ntfy alert to Dan's phone automatically — no need to
  check the Actions tab. This is `~/portfolio-automation/ntfy/ntfy-github-actions-check.sh`,
  a systemd-timer poller (every 5 min) that reads this repo's public
  Actions API (no auth needed) and fires on any newly-completed run with
  `conclusion: failure`. It does **not** work by the workflow pushing to
  ntfy directly — a first attempt at that was reverted the same day
  because GitHub-hosted runners have no route into the LAN where ntfy
  actually lives; the poller runs the opposite direction, from inside the
  LAN. Full detail, install steps, and state file locations:
  `~/portfolio-automation/setup-instructions.md` Part 6 and that repo's
  `CHANGELOG.md` (2026-09-03 entry). Lives in `~/portfolio-automation`,
  not this repo, per the usual VM/ntfy-vs-website split — this repo's own
  session couldn't commit/install it directly (sandboxed, no write access
  outside this checkout, no `sudo`); check that repo's git log for whether
  it's actually been installed and pushed yet before assuming it's live.
- **Hugo version alignment (2026-09-09)**: `ci.yml`, `hugo.yml`, and the
  local `.githooks/pre-push` gate must all pin the *same* Hugo version —
  found during a `portfolio-automation` provisioning audit that `ci.yml`
  had drifted to floating `'latest'` and `hugo.yml` was stuck on a stale
  `0.125.7`, while the dev VM (and the pre-push gate) had moved on to
  `0.139.3`. All three now pin `0.139.3`. If you bump the VM's installed
  Hugo version, update both workflow files' `hugo-version:` in the same
  change — a pre-push pass with a newer/older Hugo than CI or the live
  deploy is exactly the false confidence this gate exists to prevent.

## Full-Site QA (required before every push to main)
In addition to feature-specific testing, run a full-site walkthrough:
- Visit every page reachable from the nav and from internal links (home,
  `/portfolio/`, every project page, every company page, `/contact/`, etc.)
- On each page: click every button, link, and interactive element (filters,
  gallery lightbox, pagination, tag pills, anchor links) and confirm it does
  what it should — no dead clicks, no JS errors, no layout breaks.
- Repeat across desktop, iPhone 15, Pixel 8, and iPad viewports, and both
  light and dark mode.
- Flag anything that looks visually wrong even if not strictly "broken":
  overlapping text, images not loading, misaligned cards, awkward wrapping,
  filter/gallery state getting stuck.
- This is the qa-tester subagent's job — see `.claude/agents/qa-tester.md`.

## Content Review (required before every push touching content/)
Any new or edited page copy goes through the content-reviewer subagent
before merging — see `.claude/agents/content-reviewer.md`. This enforces the
existing Voice and Tone / IP Protection rules above, plus spelling/grammar
and conciseness.

**Image suggestions**: content often gets written before photos exist. When
a page is missing images (or an existing page has a thin gallery), the
content-reviewer subagent should proactively suggest specific locations for
images (hero image, mid-content, gallery) with 2-3 alternative options per
slot, described precisely enough that Dan can go find or shoot something to
match — not one vague suggestion per section.

## Open TODOs

Tracked in [`TODO.md`](TODO.md) in this repo now, not inline here — that's
the current source of truth. (Automation/VM/ntfy-side TODOs, e.g. the ntfy
`help` command and the Gmail test-mailbox access mechanism, live in
`~/portfolio-automation/TODO.md` instead — this repo's list is website/repo
work only.)
