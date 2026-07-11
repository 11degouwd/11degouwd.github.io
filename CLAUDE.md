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
