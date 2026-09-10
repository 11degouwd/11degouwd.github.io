# Changelog

## [Unreleased] — Fix Lighthouse CI silently auditing a dead port instead of the site

The "Run Lighthouse CI" step had `working-directory: tests`, so its `hugo server -D -p 1313` command ran with no `hugo.yaml` present (that file lives at the repo root) and failed immediately with "Unable to locate config file" — no server ever started on port 1313. Lighthouse then hit the dead port and got Chrome's own connection-error interstitial page instead of the real site, so it was always auditing an error page, not the portfolio. This was masked by an intentional `|| true` at the end of the step, so it never showed as a CI failure — found while investigating why the step logs showed `CHROME_INTERSTITIAL_ERROR`. Removed the `working-directory: tests` override (nothing else in the step needs it) so `hugo server` now runs from the repo root where `hugo.yaml` actually is.

**Changed files:** `.github/workflows/ci.yml`

## [Unreleased] — Fix intermittent CI console-error failure from hCaptcha localhost warning

Fixing the visual-snapshot CI failure (entry below) surfaced a second, previously-hidden failure: the "home page loads with no console errors" test failed intermittently on desktop-firefox/Pixel 8/iPad with `Warning: localhost detected. Please use a valid host.` This comes from hCaptcha's script (loaded sitewide via the homepage's Contact section), which validates its site key against the current hostname and always logs this on `localhost` — expected noise in CI/local dev, not a real site defect. The test now filters out this specific message via an `IGNORED_ERRORS` regex allowlist while still failing on any other console error.

**Changed files:** `tests/e2e/site.spec.ts`

## [Unreleased] — Fix CI failing on every push

The `CI` GitHub Actions check has failed on every push since this repo's inception. Root cause turned out to be the "visual snapshots" tests in `tests/e2e/site.spec.ts`, not the previously-suspected Hugo-template bug: they compare against baseline screenshots that were never actually committed (`tests/e2e/site.spec.ts-snapshots/` is deliberately gitignored until real baselines are reviewed, and that review never happened). Those two tests now skip in CI via `test.skip(!!process.env.CI, ...)`, while the rest of the suite (console errors, nav links, image checks, tag filtering) still runs normally in CI and the visual-snapshot tests still run locally as before.

**Changed files:** `tests/e2e/site.spec.ts`

## [Unreleased] — Match `/portfolio/` pagination colors to the filter tabs

The pagination row on `/portfolio/` (active page, normal/hover links, and disabled Previous/Next) used generic `--primary-color`/`--secondary-color`/`--text-color` variables instead of the indigo scheme already driving the "All" project-filter tabs above it — most visible as the active page pill rendering as a plain white box in dark mode, since those generic vars are configured white/dark-gray for dark mode in `hugo.yaml` (a section explicitly marked `# TODO Colors`, i.e. a known placeholder, not something to fix here). Rather than touch that broader placeholder scheme, `static/css/list.css` now points every pagination state (active, normal, hover, disabled) at the same `--project-filter-*` variables the filter tabs use, so the whole pagination row visually matches the filter tabs in both light and dark mode. Verified via computed-style comparison against the filter tabs (exact match for active/normal/disabled, hover confirmed distinct-but-in-family) and reconfirmed pagination click-to-navigate and the 0px overflow fix from the entry below are both still holding.

**Screenshots**
![desktop light](tests/e2e/feature-screenshots/portfolio-pagination-pill-dark-mode/desktop-chrome.png)
![desktop dark](tests/e2e/feature-screenshots/portfolio-pagination-pill-dark-mode/desktop-chrome-dark.png)

**Changed files:** `static/css/list.css`

## [Unreleased] — Fix portfolio page overflow and duplicate theme-toggle IDs

The `/portfolio/` page was rendering about 12px wider than the viewport on every device because the pagination controls used a raw Bootstrap grid row without a `.container` wrapper to cancel its negative margins — replaced with a simple centered flex wrapper. Separately, the header's desktop and mobile theme-toggle buttons (and their moon/sun icons) shared duplicate HTML ids, which is invalid markup; each now has a unique id, with the shared CSS moved to the existing classes so the toggle behavior is unchanged. Both found during the same mobile-compatibility QA pass as the fixes above.

**Screenshots**
![desktop](tests/e2e/feature-screenshots/portfolio-pagination-overflow-fix/desktop-chrome.png)
![mobile](tests/e2e/feature-screenshots/portfolio-pagination-overflow-fix/iphone-15.png)

**Changed files:** `layouts/portfolio/list.html`, `static/css/list.css`, `layouts/partials/sections/header.html`, `static/css/header.css`, `static/css/theme.css`

## [Unreleased] — Mobile fixes: abbreviation underline on project pages, company page back link

Fixed two mobile issues found during a full-site QA pass. The dotted underline under abbreviations (e.g. "HAPS", "RF") was still showing on mobile on portfolio project pages because the CSS fix only targeted company pages — it's now applied to both. Company pages also had no way back to the homepage Experience section besides the nav or browser back button, so a "← Back to Experience" link was added at the top of each company page.

**Screenshots**
![desktop](tests/e2e/feature-screenshots/company-back-link/desktop-chrome.png)
![mobile](tests/e2e/feature-screenshots/company-back-link/iphone-15.png)
![mobile abbr fix](tests/e2e/feature-screenshots/abbr-mobile-underline-fix/iphone-15.png)

**Changed files:** `static/css/single.css`, `layouts/companies/section.html`

## [Unreleased] — CI/CD: align Hugo version across ci.yml and hugo.yml

Found during a `portfolio-automation` provisioning audit: `ci.yml` was floating on `hugo-version: 'latest'` while `hugo.yml` (the actual live deploy) was pinned to `0.125.7` — neither matched the `0.139.3` already installed on the dev VM and used by the local `.githooks/pre-push` build gate. Three different Hugo versions validating "the same build" undercut the point of that gate: something could pass locally and in CI while behaving differently on the older Hugo actually deploying. Pinned both workflows to `0.139.3` so all three agree.

**Changed files:** `.github/workflows/ci.yml`, `.github/workflows/hugo.yml`

## [Unreleased] — Widen mobile tap target on Experience "Read More" pill

The "Read More →" pill on the homepage Experience section (e.g. the Kea Aerospace entry) was ~33px tall on mobile, under the 44px accessibility guideline for touch targets. Added mobile-only padding in `static/css/experience.css`, confirmed 67px tall on iPhone 15; desktop is unaffected. Found during the same mobile QA pass as the abbreviation underline and company-page back link fixes above.

**Changed files:** `static/css/experience.css`
