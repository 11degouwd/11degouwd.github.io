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

## Mobile compatibility QA pass (2026-09-03)
Full-site qa-tester pass across desktop/iPhone 15/Pixel 8/iPad, light+dark,
requested specifically to check mobile compatibility of previously
disabled/troublesome features. Report-only, nothing fixed yet. Screenshots
and diagnostic JSON are in the agent's scratchpad (session-local `/tmp`, not
persisted) — re-run the pass if screenshots are needed again.

**Live bugs (visible on published content today):**
- [x] Abbreviation dotted-underline still shows on mobile on portfolio
      project pages (e.g. `/portfolio/keaaerospace/atmos-mk1-battery/`,
      under "HAPS"/"RF"). The mobile fix in `static/css/single.css`
      (`.company-page .page-content abbr[title] { text-decoration: none }`)
      was scoped to `.company-page` only; `layouts/portfolio/single.html`
      renders `<section id="single">` without that class, so project pages
      never got the fix. **Fixed 2026-09-09** (commit `ae81d5b`) — selector
      broadened to `#single .page-content abbr[title]`, covers both page
      types now.
- [x] Non-issue, per Dan (2026-09-09): "Atmos Mk1 Electrical Systems
      Architecture" project card thumbnail crop — flagged as illegible on
      the card thumbnail (`#portfolio-cards .project-img { object-fit:
      cover; height: 200px }` crops a wide technical diagram). Checked on
      his own phone and it looks fine — not pursuing a re-crop.
- [x] `/portfolio/` has a 12px horizontal overflow on every viewport
      (desktop + mobile) — the pagination-controls `<div class="row ...">`
      in `layouts/portfolio/list.html` was a raw Bootstrap `.row` (negative
      margins) not wrapped in a `.container`. **Fixed 2026-09-09** — replaced
      the `.row`/`.col-auto` grid wrapper with a plain flex-centered
      `.portfolio-pagination-wrap` div (new rule in `static/css/list.css`).
      Confirmed 0px overflow on desktop/iPhone 15/Pixel 8/iPad, light+dark,
      against both a full draft build and the real production build — note
      a much larger (~28px) overflow briefly appeared on mobile during
      testing, traced to this sandbox's CDN block preventing Bootstrap's
      `box-sizing: border-box` reset from loading (not a real site bug);
      confirmed 0px once Bootstrap was mocked in properly.
- [x] Non-issue, per Dan (2026-09-09): dark mode "content under
      development" disclaimer banner on `/portfolio/` (hardcoded hex colors
      `#fff3cd`/`#ffecb5`/`#664d03`, doesn't adapt to dark mode). Dan likes
      it staying the same color in both modes — not changing.
- [ ] Separate from the banner above: the active-page pagination pill on
      `/portfolio/` (Bootstrap's default `.pagination .active` styling,
      unstyled for dark mode) renders as a plain white box in dark mode —
      not intentional, not yet reviewed/decided on.
- [x] Duplicate `id="theme-toggle"` in the DOM — `layouts/partials/
      sections/header.html` rendered both a desktop and mobile toggle with
      the same id (plus duplicate `id="moon"`/`id="sun"` on the inner
      svgs). **Fixed 2026-09-09** — unique ids now (`theme-toggle-desktop`/
      `-mobile`, `moon-desktop`/`-mobile`, `sun-desktop`/`-mobile`); styling
      in `static/css/header.css`/`theme.css` moved from `#theme-toggle`/
      `#moon`/`#sun` to the `.theme-toggle`/`.icon-moon`/`.icon-sun`
      classes (JS already used the class, unaffected). Confirmed toggle
      still works both directions on desktop + mobile, zero console
      errors, no remaining duplicate ids on the page.

**Latent bug (not visible today, will appear once more content is published):**
- [x] Non-issue, per Dan (2026-09-09): portfolio card grid last-row width
      inconsistency (last card in an incomplete row would render ~8%
      narrower than its siblings on desktop/iPad, once more `draft: true`
      projects are un-drafted — `#portfolio-cards .project-cards-grid`'s
      `grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))` doesn't
      split evenly across a partial last row). Not fixing for now.

**Navigation/discoverability — Experience → Company → Projects**
(the specific friction point flagged as "the only friction part of the
site" — this section evaluates it directly, not a strict bug list):
- [x] No way back from a company page to the Experience section or
      Portfolio — no breadcrumb, no "← Back to Experience" link anywhere in
      `layouts/companies/section.html`. Only the main nav or browser
      back button. **Fixed 2026-09-09** (commit `ae81d5b`) — added a
      "← Back to Experience" link (→ `/#experience`) at the top of company
      pages, ~60px tap target.
- [x] The "Read More →" pill (the only strong signal that an Experience
      entry has a dedicated company page) measured ~32.8px tall on mobile —
      under the 44px WCAG-recommended touch target size. **Fixed 2026-09-09**
      — mobile-only padding increase in `static/css/experience.css`
      (`@media (max-width: 576px) { #experience .company-read-more { ... } }`),
      confirmed 67px tall on iPhone 15, desktop untouched.
- [x] Non-issue, per Dan (2026-09-09): the company-title heading text is
      styled identically (same color/weight) whether or not the company has
      a page, so there's no visual differentiator on the title itself.
      Considered two fixes — a permanent underline on linked titles, and a
      small chevron icon next to linked titles (previewed live, screenshots
      sent, looked clean in both light/dark and both viewports) — but Dan's
      call: the "Read More"/"Learn more" links already sitting right next to
      every linked title make it obvious there's more content regardless of
      whether the title itself looks clickable, so a title-level signal
      would just be clutter. Not pursuing either fix. Reverted the chevron
      preview from the working tree.
- Working correctly: "Projects at {Company}:" heading on company pages is
  clear/unambiguous; the Read More pill + secondary "Learn more" link are
  present for every company with a page and correctly absent for ones
  without (verified programmatically, not just visually).

**Confirmed working well (given prior flaky history — no fix needed):**
mobile navbar (hamburger/dropdown/click-outside-close), experience timeline
JS resize recompute, portfolio sidebar mobile sticky positioning, gallery/
Fancybox lightbox — all zero console errors on iPhone 15 + Pixel 8.
One architectural risk noted, not a bug: `navbarMobile.js` has no fallback
if the Bootstrap CDN (`cdn.jsdelivr.net`) ever fails to load for a real
visitor — mobile nav would be entirely non-functional with no local
fallback CSS/JS. Low likelihood, zero graceful degradation today.

**Testing caveat**: run in a sandboxed environment without real WebKit/
Firefox binaries available to install — iPhone 15/iPad were tested via
Chromium emulating those viewports/UA/touch, not real Safari. Safari-
specific rendering quirks were not verified by this pass.

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
