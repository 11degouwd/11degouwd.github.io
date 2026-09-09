# Changelog

## [Unreleased] — Mobile fixes: abbreviation underline on project pages, company page back link

Fixed two mobile issues found during a full-site QA pass. The dotted underline under abbreviations (e.g. "HAPS", "RF") was still showing on mobile on portfolio project pages because the CSS fix only targeted company pages — it's now applied to both. Company pages also had no way back to the homepage Experience section besides the nav or browser back button, so a "← Back to Experience" link was added at the top of each company page.

**Screenshots**
![desktop](tests/e2e/feature-screenshots/company-back-link/desktop-chrome.png)
![mobile](tests/e2e/feature-screenshots/company-back-link/iphone-15.png)
![mobile abbr fix](tests/e2e/feature-screenshots/abbr-mobile-underline-fix/iphone-15.png)

**Changed files:** `static/css/single.css`, `layouts/companies/section.html`
