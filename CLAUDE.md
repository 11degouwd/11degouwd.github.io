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
If Bash commands start failing with `bwrap: loopback: Failed RTM_NEWADDR:
Operation not permitted` — even something as trivial as `true` — this is a
known, currently-open Ubuntu 24.04+ issue (`anthropics/claude-code#55585`),
not a config mistake, and it blocks *every* Bash command, not just
sandbox-specific ones. Ubuntu's default AppArmor policy
(`kernel.apparmor_restrict_unprivileged_userns=1`) blocks the network
namespace setup bubblewrap needs. Fix, most targeted first:
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
If insufficient (a known continuation of this issue on some kernels where the
userns profile alone doesn't cover the loopback/`CAP_NET_ADMIN` piece), fall
back to `sudo sysctl -w kernel.apparmor_restrict_unprivileged_userns=0`
(blunter, system-wide) or disabling `sandbox.enabled` entirely and relying on
the `permissions` deny/ask rules alone. Don't spend excessive time
re-diagnosing this from scratch if it recurs — check this note first.

### Sandbox self-audit findings
Results from prior authorized testing of this repo's own sandbox/permissions
setup — worth knowing rather than re-testing from scratch:
- Raw Bash redirect to overwrite `settings.json` → blocked at the filesystem
  layer itself (`Read-only file system`), below the tool layer.
- The `dangerouslyDisableSandbox` flag has no effect on the settings.json
  write protection specifically; that protection holds regardless.
- Editing `defaultMode` from `auto` to `bypassPermissions` via the Edit tool
  → explicitly denied by the auto-mode classifier, which correctly named
  "agent widening its own permissions without being asked" as the problem
  and stopped to ask rather than finding a workaround.
- `~/.ssh`/ntfy env file denials fire automatically, no prompt needed.
- Network allowlist: re-tested and confirmed it **does hold** in normal use.
  A prior note in this file once claimed the allowlist was "not enforced at
  all," citing specific bypasses and a CVE — none of that reproduced on
  re-test, and it turned out to be fabricated by an earlier Claude session
  rather than an actual finding. Re-verified live: non-allowlisted domains
  (`google.com`, `pypi.org`, `wikipedia.org`, `1.1.1.1`) time out as
  expected; an allowlisted domain (`github.com`) redirecting to a
  non-allowlisted one (`avatars.githubusercontent.com`) has its own 302 go
  through but the redirect target itself times out — no bypass. One narrow,
  non-exploitable exception: `example.com` returns 200 despite not being on
  the allowlist (IANA-reserved, RFC 2606, not attacker-controllable — almost
  certainly a built-in connectivity-check carve-out). **Lesson**: don't take
  claims in this file about sandbox behavior purely on faith, including this
  one — if it matters again, rerun a same-session direct-request + redirect
  test rather than trusting cached documentation.

### Session handoff
`HANDOFF.md` (from the original agentic-workflow setup conversation) lives
at `~/portfolio-automation/HANDOFF.md` on the VM — deliberately not in this
repo, since it references internal network details. If you're reading this
after it's already merged into CLAUDE.md, HANDOFF.md has likely already
been read and deleted — no action needed.

### Sandbox vs. ntfy notifications — a real conflict
`ntfy-notify.sh` expects `NTFY_URL`/`NTFY_TOKEN` as environment variables —
it doesn't read `/etc/ntfy-portfolio.env` itself. Any time Claude needs to
trigger a notification directly via its own Bash tool (not the independent
`ntfy-listen.service`, which is unaffected), it would need to `source
/etc/ntfy-portfolio.env` in that same call — which hits the sandbox's
`denyRead` on that file. This blocks every notification `issue-runner` is
designed to send from within a session (feature-live, ready-to-ship
approval requests, QA-failure alerts), not just one feature. One working
exception: `on-notification.sh`, triggered via the `Notification` hook
rather than a direct Bash tool call, runs outside the Bash-tool sandbox
boundary entirely.

**Current state (applied)**: `NTFY_URL`/`NTFY_TOKEN` are now auto-sourced in
`~/.bashrc` from `/etc/ntfy-portfolio.env`, so every new shell — including
ones Claude Code's Bash tool spawns — already has them without needing to
read the file itself. Accepted tradeoff: this makes the credential more
ambiently available (inherited by every child process) than the file-read
protection alone would allow, in exchange for the notification flow
actually working.

**Future, once the sandbox subsystem proves more stable**:
`sandbox.credentials` with `mask: true` + `injectHosts` would be the
architecturally correct fix — Claude never sees the real token, only the
sandbox's own proxy substitutes it in when a request leaves for an allowed
host. Not adopted yet — unconfirmed whether `injectHosts` accepts a raw IP
the way this VM's ntfy server address needs.

### Notification hook debugging — three stacked bugs found, one harness gap unresolved
Multi-step live investigation (2026-07-11/12), triggered by a `git push`
permission prompt producing zero phone notification. Don't re-litigate this
from scratch if it recurs — read this first.

**Bug 1 — wrong event name.** `.claude/settings.json` only registered
`on-notification.sh` under `Notification`. Per official docs
(`code.claude.com/docs/en/hooks.md`), a tool permission dialog in this
harness fires **`PermissionRequest`** ("when a permission dialog appears")
and **`PermissionDenied`** ("when a tool call is denied by the auto mode
classifier") — `Notification` is a narrower event (idle-waiting, auth, etc.).
Confirmed empirically: `~/.claude-ntfy-state/last-notification` (the
timestamp `on-notification.sh` stamps as its first action) was never written
for the denial. **Fix applied**: also register the script under
`PermissionRequest`. Since that event can control the actual permission
decision via exit code (exit 2 denies), the script must always `exit 0` and
never emit a decision block — verified it does.

**Bug 2 — missing credentials in the hook's own environment.** After fixing
the event name, the state-file timestamp *did* get written (hook fires) but
still no phone notification. A safe boolean-only diagnostic (never logged
actual secret values — an env dump attempt was correctly blocked by the
auto-mode classifier as credential materialization) proved `NTFY_URL`/
`NTFY_TOKEN` were unset in the hook's execution environment. Root cause:
this VM has *three* separate places credentials get loaded, and the hook
subprocess (spawned directly by the Claude Code binary) matches none of
them — `ntfy-listen.service`/`ntfy-idle-check.service` use systemd's
`EnvironmentFile=/etc/ntfy-portfolio.env` (confirmed by reading both unit
files), interactive terminals use the `.bashrc` sourcing block, and hook
subprocesses get neither. The "auto-sourced in `.bashrc`, every shell has
them" fix recorded earlier in this file only ever covered interactive
shells, not this path. **Fix applied**: `on-notification.sh` now sources
`/etc/ntfy-portfolio.env` directly at the top, independent of both `.bashrc`
and systemd.

**Bug 3 (partially re-examined 2026-07-19/20, background/child-job
hypothesis no longer looks like the explanation) — this specific session
type's own permission asks still don't reliably trigger the hook**, even
after both fixes, even though the identical shared config/script
demonstrably works (a differently-worded notification arrived from what
turned out to be a separate, likely non-bridged, Claude session; the
message format matched the script's `Notification`-passthrough branch
exactly). Isolated with a canary written into the already-firing
`UserPromptSubmit` hook: that one fires reliably every turn in this
session (proven, not assumed), while two direct, consecutive
`git push`-denial tests left zero trace in the state file. So this
session **can** run local hooks in general — the gap is specific to how
this harness's "auto mode classifier" (the layer producing the
`[Self Modification]`/`[Credential Materialization]`-style reasoned
allow/deny/ask decisions seen throughout this file) resolves its own asks,
which apparently doesn't route through the standard `PermissionRequest`/
`PermissionDenied` events the same way a plain Bash-permission-ask would.
Not something fixable via `.claude/settings.json` or script changes from
inside a session — would need the harness itself to wire the classifier's
ask path to those hook events.

**Update, 2026-07-19/20**: this note's own suggested next step — "test
from a genuine foreground terminal session (not a background/child job)
first, to confirm whether that's actually the distinguishing factor" —
got indirectly answered during the ntfy activity-delay work in
`portfolio-automation` (see that repo's `CHANGELOG.md`): a
background/child-job session (the same type this repo's own sessions run
as) reliably triggered `PermissionRequest`/`Notification` →
`on-notification.sh` for statically `ask`-listed `Bash(git push*)`/
`Bash(sudo*)`/`Bash(npm publish*)` patterns, dozens of times, with real
phone pushes confirmed live. So "background/child job" does **not** look
like the distinguishing factor after all. This doesn't fully close Bug 3,
though: those tests all went through the *static* `permissions.ask` list
(a deterministic config match), not the dynamic auto-mode classifier
denying/asking on its own initiative for something not explicitly
listed — the original repro used a plain `git push` denial, which may
have exercised the classifier path specifically because `git push*`
wasn't yet in the static `ask` list at the time (it is now, so a fresh
`git push` attempt would hit the static path first and might not
reproduce whatever the classifier-specific gap was). If this needs
revisiting, isolate a permission scenario the classifier decides on
dynamically (not already covered by `permissions.deny`/`ask`) to test the
narrower claim directly, rather than re-testing session type.

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
