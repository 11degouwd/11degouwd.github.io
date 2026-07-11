---
name: site-config
description: Reference for hugo.yaml site config settings (params.siteStatus, color, portfolio pagination/cardHeight, navbar, noDatePlaceholder, goldmark unsafe) and the params.socialLinks email/phone/location/linkedin format. Use when editing hugo.yaml or site-wide settings.
---

## `hugo.yaml` Key Settings

All section content moved to `content/` files. `hugo.yaml` is site config only.

| Setting | Effect |
|---|---|
| `params.siteStatus` | `"coming-soon"` hides site except on `hugo server` |
| `params.color.primaryColor` | Accent colour across all CSS custom properties |
| `params.portfolio.enablePagination` / `pagerSize` | JS pagination on `/portfolio/` |
| `params.portfolio.cardHeight` | Global default card height |
| `params.navbar.showContactLast` | Pins Contact to end of nav |
| `params.singlePages.portfolio.noDatePlaceholder` | Placeholder for undated projects |
| `markup.goldmark.renderer.unsafe` | Required `true` for raw HTML in markdown |

**`params.socialLinks` — email and phone use custom keys** (not `url`) so the contact partial can prepend the correct protocol:
```yaml
email:
  icon: fas fa-envelope
  mailto: user@example.com     # → href="mailto:..."
phone:
  icon: fas fa-phone
  tel: "+64 21 000 0000"       # → href="tel:..." (spaces stripped)
location:
  icon: fas fa-map-marker-alt
  location: City, Country      # plain text, no link
linkedin:
  icon: fab fa-linkedin
  url: https://linkedin.com/in/username
```
