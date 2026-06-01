# Claude Code Instructions

Hugo-based portfolio/personal website (11degouwd.github.io).

## Project Structure

- Hugo static site using the `hugo-profile` theme (`themes/hugo-profile/` — avoid editing directly)
- `layouts/` — template overrides (takes precedence over theme)
- `static/css/` — custom stylesheets; `static/images/` — logos, hero bg, profile photo; `static/resume/` — PDFs at `/resume/*.pdf`
- `assets/icons/custom/` — custom SVG icons (`custom_icon`); `assets/icons/simple/` — local Simple Icons (`simpleicon_name`)
- `assets/images/` — gallery `source: assets` (Hugo-processed); `assets/templates/` — reference frontmatter docs (not served)
- Content: `content/portfolio/` — project case studies; `content/experience/` — roles; `content/companies/` — company pages

## Development Workflow

- `hugo server` — local server (localhost:1313); `hugo` — build to `public/`
- Deployed via GitHub Pages from `main` branch

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
└── shortcodes/              — see Shortcodes section
```

`companies/section.html` wraps content in `<section id="single" class="company-page">`, renders markdown + conditionally calls `company-roles.html`, `gallery.html`, `company-projects.html` based on frontmatter flags.

## Shortcodes

### `{{< company-roles >}}`
- `companySlug` (required), `companyName` (required), `showTitle` (default `true`)
- **⚠ Do not use on a company page with `roles.enable: true`** — creates duplicate `#experience` anchor
```
{{< company-roles companySlug="companySlug" companyName="Company Name" >}}
{{< company-roles companySlug="companySlug" companyName="Company Name" showTitle="false" >}}
```

### `{{< company-projects >}}`
- `companySlug` (required), `companyName` (auto-detected), `showTitle` (default `true`), `showCompanyName` (default `false`), `tagFilter` (comma-sep OR), `minWeight` (default `1`), `cardHeight` (default `500`), `excludeFolders`
- **⚠ Do not use on a company page with `projects.enable: true`** — creates duplicate `#portfolio` anchor
```
{{< company-projects companySlug="companySlug" >}}
{{< company-projects companySlug="companySlug" showTitle="false" cardHeight="250" >}}
{{< company-projects companySlug="companySlug" tagFilter="Tag1,Tag2" minWeight="2" >}}
```

### `{{< gallery >}}`
- `src` (pattern/subdir), `source` (`bundle`/`static`/`assets`, default `bundle`), `layout` (`grid`/`row`/`single`), `cols` (default `3`), `max` (default `5`), `showCaption` (default `false`), `thumbSize`/`thumbQuality`, `fullSize`/`fullQuality`
```
{{< gallery >}}
{{< gallery src="subfolder" layout="grid" cols="3" >}}
{{< gallery src="subfolder" layout="row" max="8" >}}
{{< gallery src="photo.jpg" layout="single" >}}
{{< gallery src="subfolder" source="static" >}}
{{< gallery src="subfolder" source="assets" >}}
```

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

## Content Directory Structure

Dates: `YYYY-MM-DD` for all dates. Education uses display strings (`"2019 - 2021"`). Omit `end` on a role for "Present".

```
content/
├── hero/index.md, about/index.md, education/index.md
├── techstack/index.md, achievements/index.md, contact/index.md
├── experience/            — one .md per role (build: render: never)
│   ├── _index.md
│   └── {Company}-{Role}.md
├── companies/             — rendered sections
│   ├── _index.md
│   └── {companySlug}/_index.md   ← uses _index.md (section, not leaf bundle)
└── portfolio/             — rendered pages (page bundles)
    ├── _index.md
    ├── {companySlug}/{projectName}/index.md + image.jpg
    └── personal/{projectName}/   ← non-company projects
```

### `content/experience/{Company}-{Role}.md`
```yaml
title: Role Title
companySlug: companySlug    # must match folder in content/companies/
start: YYYY-MM-DD
# end: YYYY-MM-DD           # omit for "Present"
location: City, Country     # optional
summary: |-                 # markdown supported
  Summary text.
build:
  render: never
```

### `content/companies/{companySlug}/_index.md`
```yaml
title: "Company Name"
logo: "logo.png"            # static/images/{companySlug}/logo.png
image: "featured.jpg"       # static/images/{companySlug}/
start: YYYY
# end: YYYY
searchTags: "tag1 tag2"
searchDescription: "snippet"
roles:
  enable: true
gallery:
  enable: false
  title: "Gallery"          # optional
  location: "subfolder"
  source: bundle            # bundle | static | assets
  layout: row               # grid | row | single
  cols: 3
projects:
  enable: true
  tagFilter: "Tag1,Tag2"    # optional OR filter
  minWeight: 1
  cardHeight: 250           # 150–400px
  excludeFolders: ""
```
Anchor links: `<div class="split-links">` renders side-by-side links. `#experience` and `#portfolio` IDs are set by the partials when enabled via frontmatter. Use `{{< gallery src="subfolder" layout="row" >}}` inline for mid-content galleries; frontmatter gallery renders at bottom only.

### `content/portfolio/{companySlug}/{projectName}/index.md`
```yaml
title: "Project Title"
companySlug: "companySlug"
summary: "One-line description."
date: YYYY-MM-DD            # omit → shows noDatePlaceholder ("In Development")
image: "image.jpg"          # page bundle resource
skills: ["Skill Name"]      # sidebar pills
tags: ["Tag1", "Tag2"]      # filter buttons; links to /portfolio/?tag=
weight: 1                   # used by minWeight filter
searchTags: "extra terms"   # optional
draft: true                 # set false to publish
```

### `content/techstack/index.md` — icon sources (priority order)
```yaml
technical_groups:
  - title: "Group Name"
    skills:
      - devicon_name: "python"        # https://devicon.dev/
        devicon_suffix: "original"
        name: "Python"
      - svgporn_name: "icon-name"     # https://svglogos.dev/
        name: "Tool"
      - simpleicon_name: "iconname"   # assets/icons/simple/ (local)
        simpleicon_color: "#ff0000"   # optional colour override
        name: "Tool"
      - simpleicon_name: "iconname"
        simpleicon_cdn: "cdn.jsdelivr.net/npm/simple-icons@latest/icons/"
        name: "Tool"
      - custom_icon: "filename"       # assets/icons/custom/ (raw SVG)
        name: "Tool"
```

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

## Avoid

- Don't over-engineer — only add what's requested
- Don't add comments/docstrings to code you didn't change
- Don't create new files unless explicitly needed
- Don't use destructive git commands without explicit permission
- No emojis unless requested
- Test CSS changes on desktop, mobile (< 576px), light + dark modes

## Portfolio Content Writing

When converting rough notes into portfolio page content (`content/portfolio/**/*.md`):

### Voice and tone
- Write in first person, past tense, direct — as the engineer who did the work
- Short sentences. Specific details. Honest about tradeoffs
- No corporate filler: avoid "leverage", "robust", "seamlessly", "significant", "meaningful", "non-trivial", "notoriously"
- Avoid AI-sounding phrases: "It is worth noting", "This allowed us to", "In order to", "It became clear that"
- Preferred phrases: "harder than it sounds", "hit and miss", "genuinely", "the right call", "in hindsight", "paid off"
- Three short paragraphs beats one long one. Break at natural thought boundaries

### IP protection
- No specific design values, dimensions, or proprietary system names
- No internal team structures, supplier names, or contractor relationships
- Frame discoveries as "found through flight testing" not "here's what went wrong with X"
- Tradeoffs can be described generically — what was ruled out and why — without revealing what was chosen
- When uncertain whether something is too specific, keep it generic or omit it

### Process for converting notes
1. Read all notes first to understand full scope before writing anything
2. Write prose paragraphs — do not just clean up the bullets into bullet form
3. Keep original notes as HTML comments (`<!-- ORIGINAL NOTES: ... -->`) immediately above the section they belong to
4. Add suggested additions or TODOs also as HTML comments (`<!-- TODO: ... -->`) so the user can expand later
5. Where a section is marked TBC, leave a detailed `<!-- TODO: ... -->` comment with suggested topics
6. Use `<abbr title="Full Name">ABBR</abbr>` for all technical acronyms on first use per section

### Structure conventions
- Intro: 1–2 paragraphs. Role of the system in the broader aircraft first, then scope of your work
- What I Worked On: bullet list (can have sub-bullets). Action verbs, specific deliverables
- Challenges: `##` subsections, one per major challenge. Prose only, no bullets
- General Approach: `##` subsections. HOW you worked, not WHAT you built (that's Challenges)
- Key Takeaways: prose paragraphs. Lessons, not summaries. What you'd do differently, what was validated
