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

**Bug 3 (unresolved) — this specific session type's own permission asks
still don't reliably trigger the hook**, even after both fixes, even though
the identical shared config/script demonstrably works (a differently-worded
notification arrived from what turned out to be a separate, likely
non-bridged, Claude session; the message format matched the script's
`Notification`-passthrough branch exactly). Isolated with a canary written
into the already-firing `UserPromptSubmit` hook: that one fires reliably
every turn in this session (proven, not assumed), while two direct,
consecutive `git push`-denial tests left zero trace in the state file. So
this session **can** run local hooks in general — the gap is specific to
how this harness's "auto mode classifier" (the layer producing the
`[Self Modification]`/`[Credential Materialization]`-style reasoned
allow/deny/ask decisions seen throughout this file) resolves its own asks,
which apparently doesn't route through the standard `PermissionRequest`/
`PermissionDenied` events the same way a plain Bash-permission-ask would.
Not something fixable via `.claude/settings.json` or script changes from
inside a session — would need the harness itself to wire the classifier's
ask path to those hook events. If revisiting: test from a genuine foreground
terminal session (not a background/child job) first, to confirm whether
that's actually the distinguishing factor or a red herring.

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
- **Known gap, see Open TODOs**: whether this approval request reliably
  reaches Dan's phone via ntfy (as opposed to just sitting in a terminal/chat
  he isn't watching) is unconfirmed outside `issue-runner`'s own flow, which
  has its own working, hook-independent ntfy call. Don't assume a phone
  ping happens automatically for a push proposed outside that flow.

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

Below are pre-content-work blockers. Handle these in a project session
(opened inside this repo), not from an outside-the-repo/background session.

### 1. Confirm push-approval requests reach ntfy
`issue-runner`'s approval gate already sends its own `ntfy-notify.sh` call,
so that path works. `ship-automation` and any ad-hoc push Claude proposes
directly in a session do not — the approval-ask is just chat text today,
with no guaranteed phone notification if Dan isn't watching. Decide whether
those need their own `ntfy-notify.sh` call, then verify live before relying
on it.

### 2. Scope the ship-* skills correctly
`ship-content` should ship Hugo content changes only (`content/`);
`ship-automation` should only ever touch things outside this repo. Neither
is currently enforced — `ship-content` will happily commit any branch diff,
not just content. May need a third skill, `ship-site`, for Hugo
code/feature changes (layouts, CSS, JS, shortcodes) so the three don't
overlap.

### 3. Trim CLAUDE.md for conciseness
This file has grown long with incident writeups (sandbox/notification
debugging, etc.). Review and cut it down before starting content work.

### 4. Fix CI — currently fails on every push
Both `CI` and `Deploy Hugo site to GitHub Pages` have failed on every recent
push. Root cause (from the CI logs): `layouts/partials/project-cards.html`
calls `delimit .Params.tags "|"` on a portfolio page whose `tags` is nil —
Hugo build errors out, so the Playwright webserver never starts. There's
also an unrelated warning worth checking: "Missing company page:
companies/justinNeilEngineering".

### ntfy `help` command + richer `status` reply

### ntfy `help` command + richer `status` reply
Not yet built. Lives in `~/portfolio-automation/ntfy/ntfy-listen.sh` —
outside this repo, since it references the real ntfy server IP.
1. **`help` command**: reply to `PortfolioControl` with a message listing
   every available command, published **to `PortfolioControl` itself** (not
   `PortfolioStatus`) so the reply threads with the triggering command —
   ntfy has no cross-topic threading. Commands with no arguments (`restart`,
   `status`) get a one-tap ntfy action button firing back to
   `PortfolioControl`; commands needing a parameter (`push <branch>`, `force
   push <branch>`) list as text only, no fake buttons. `ntfy-notify.sh` is
   currently hardcoded to publish to `PortfolioStatus` only — add a topic
   argument or a small dedicated publish function for `Control` replies,
   without breaking existing `Status`-only call sites (issue-runner's
   feature-live/ready-to-ship notifications). `portfolio-vm`'s ntfy ACL was
   already widened to read-write on `PortfolioControl` specifically to
   support this reply-in-thread design (see `setup-instructions.md` Part
   5) — a deliberate choice over replying via `Status`, which would've
   kept the tighter one-way split but split the conversation across two
   topics in the phone app.
2. **Richer `status` reply**: expand beyond listener-alive + pending-approval
   count — e.g. `ntfy-listen.service`/`ntfy-idle-check.timer` active state,
   which `claude-main` tmux windows exist and what's running, last commit on
   `main`, disk space, uptime. Prioritize "is everything OK and what's it
   doing" over dumping raw data. **Known constraint**: `systemctl status`
   requires dbus (a Unix domain socket), which the sandbox blocks
   categorically — confirmed via `Failed to connect to bus: Operation not
   permitted`. Check process liveness with `pgrep -f ntfy-listen.sh` /
   `pgrep -f ntfy-idle-check.sh` instead (reads `/proc`, not blocked),
   even though it's less precise (can't explain *why* something failed,
   just whether the process exists).
3. `PortfolioStatus` stays one-way (VM write / phone read) for FYI pushes —
   don't widen it without a concrete reason.
4. Verification is mandatory before marking this done: confirm each piece
   (received/matched correctly, reply on the right topic, buttons visible
   only where they should be, buttons actually work when tapped, `status`
   values cross-checked against real VM state) **with Dan directly** for
   anything he'd perceive on his own phone — logs are only evidence for the
   VM-side steps. Also regression-check that existing `Status` pushes still
   work unchanged after `ntfy-notify.sh` gains a topic argument.

### Gmail contact-form test mailbox
- Forward + filter setup (test mailbox `danieldegouw.portfolio.test@gmail.com`)
  is confirmed working via the real browser form. That confirms the form →
  captcha → Formspree → personal-inbox pipeline; it does **not** yet confirm
  the filter/forward-to-test-mailbox path specifically, since that needs a
  `Subject: PORTFOLIO-QA-TEST` that nothing can currently produce.
- Known gotcha: don't use placeholder addresses like `test@example.com` in
  test submissions — Formspree's spam filter flags them on sight. Use the
  test mailbox's own address instead.
- Captcha is enforced on the live form and blocks raw `curl`/API submissions
  outright — a real open problem for the future Playwright contact-form test
  too, not just manual testing. **Do not attempt to bypass it
  programmatically.** Candidate approaches to research when building that
  test: Formspree's own testing/bypass mechanisms (check docs first), a
  separate test-mode endpoint without captcha, or accepting this check has
  to stay manual/semi-manual.
- Access scope decided, mechanism not: Claude gets `gmail.modify` on the test
  mailbox (read/label/archive/delete) with `gmail.send` and the broad
  `https://mail.google.com/` scope explicitly withheld, so sending is
  technically impossible rather than just discouraged. Whether that's via a
  Gmail MCP connector or a scoped OAuth app is still open — decide when
  actually building the contact-form test. Also confirm once, manually:
  Vacation Responder is off on that account, and no App Password has ever
  been generated for it (either would open a send path outside API scope).
- Still open: the `_subject` field mechanism for how Playwright sets a
  distinguishing subject on test submissions — entangled with the captcha
  problem above, since whatever approach is chosen also has to get past
  captcha to reach Formspree at all.
