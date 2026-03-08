# Claude Code Instructions

This is a Hugo-based portfolio/personal website (11degouwd.github.io). These instructions persist across Claude Code sessions.

## Project Structure

- **Hugo static site** using the `hugo-profile` theme
- **Content organization:**
  - `content/portfolio/` — project case studies (company-based folders)
  - `content/experience/` — individual role markdown files (grouped by `companySlug`)
  - `content/companies/` — company overview pages
- **Key directories:**
  - `layouts/` — template overrides (takes precedence over theme)
  - `static/css/` — custom stylesheets
  - `static/images/` — global images (company logos, hero background, profile photo)
  - `static/resume/` — resume/CV PDF files served at `/resume/*.pdf`
  - `assets/icons/custom/` — custom SVG icons for techstack (referenced by `custom_icon`)
  - `assets/icons/simple/` — local Simple Icons SVGs for techstack (referenced by `simpleicon_name` without CDN)
  - `assets/images/` — image assets for gallery `source: assets` (Hugo-processed)
  - `assets/templates/` — reference template files with frontmatter documentation (not served)
  - `themes/hugo-profile/` — base theme (avoid editing directly)

## Development Workflow

- **Local server:** `hugo server` (runs on localhost:1313 by default)
- **Build:** `hugo` (generates to `public/`)
- **Git:** Deployed via GitHub Pages from `main` branch

## CSS Architecture

### File Organization
- `static/css/index.css` — homepage styles (experience, education, projects, etc.)
- `static/css/experience.css` — dedicated experience section styles (copy of index.css with modifications)
- `static/css/single.css` — company/single page styles
- `static/css/partials.css` — shared partial styles (project cards, etc.)
- `static/css/contact.css` — contact page styles

### CSS Conventions
- **CSS custom properties** for theming:
  - `--primary-color`, `--secondary-color`, `--background-color`
  - `--text-color`, `--text-content-color`, `--text-secondary-color`, `--text-link-color`
- **Scoped overrides:** Use `#section-id` or `.page-class` to avoid affecting global styles
  - Example: `#single.company-page` for company page-specific styles
- **Responsive:** Mobile-first with `@media (max-width: 576px)` for mobile overrides
- **Link hover pattern:** Growing underline effect using `::after` with `width: 0 → width: 100%` transition

### Important CSS Details
- **Company pages** wrapped with `#single.company-page` for scoping markdown content styles
- **Heading sizes** on company pages are proportionally reduced (h1 → 2.2em, h2 → 1.8em, etc.)
- **Scroll margin:** `scroll-margin-top: 6rem` on anchored sections to account for fixed navbar

## Hugo Template Patterns

### Content Processing
- Use `{{ .Content | emojify }}` for markdown content (Hugo processes markdown → HTML automatically)
- Use `{{ .Params.summary | markdownify }}` when manually rendering frontmatter markdown fields
- Use `{{ with .Params.field }}{{ . }}{{ end }}` for optional fields

### Experience Section
- Roles are in `content/experience/` with `companySlug` frontmatter linking to companies
- Grouped by company, sorted by most recent role first
- Timeline uses **JavaScript** to dynamically set `--line-height` and `--line-bottom` CSS variables
  - Script in `layouts/partials/sections/experience.html` measures dot-to-dot distances
  - Runs on `window.load` + `resize` for accuracy after CSS fully applies
- Company pages must exist in `content/companies/{slug}/` to show "Read More" pill and "Learn more" link

## Layouts Directory

Hugo resolves templates by looking in `layouts/` before `themes/hugo-profile/layouts/`. Any file in `layouts/` with the same path as a theme file silently overrides it.

### Template hierarchy summary

```
layouts/
├── _default/
│   ├── baseof.html       — base HTML shell (overrides theme)
│   ├── single.html       — fallback single page (blog posts, etc.)
│   └── list.html         — fallback list page (tag/category indexes)
├── index.html            — homepage
├── portfolio/
│   ├── single.html       — individual project pages
│   └── list.html         — /portfolio/ index page
├── companies/
│   └── section.html      — company overview pages (/companies/{slug}/)
├── partials/             — see Partials section below
└── shortcodes/           — see Shortcodes section below
```

---

### `layouts/_default/baseof.html`
**Applies to:** every page on the site as the outer HTML shell.

**Overrides theme to:**
- Comment out jQuery (unused)
- Add `siteStatus: "coming-soon"` guard — hides the navbar when site is in coming-soon mode
- Keep Bootstrap JS, navbarHighlight.js, and `scripts.html` partial

---

### `layouts/index.html`
**Applies to:** the homepage (`/`).

**Overrides theme to:**
- Add `siteStatus: "coming-soon"` guard — shows a "Coming Soon" placeholder instead of all sections when the site param is set and not running locally
- Replace the theme's `sections/projects.html` partial with `sections/techstack.html`, `sections/achievements.html` — different section order
- Loads `index.css` + `projects.css`

---

### `layouts/_default/single.html`
**Applies to:** any content not matched by a more specific layout (e.g., blog posts if added).

**Deviations from theme:** Essentially identical to the theme version — this override exists as a safety copy to allow future customisation without touching the theme.

---

### `layouts/_default/list.html`
**Applies to:** any section list not matched by a more specific layout.

**Deviations from theme:** Essentially identical to theme — exists as a safety copy.

---

### `layouts/portfolio/list.html`
**Applies to:** the `/portfolio/` index page listing all projects.

**Overrides theme's `projects/list.html` to:**
- Collect all unique tags across projects and render filter buttons (`data-tag` attributes)
- Render projects using the custom `project-cards.html` partial (instead of the theme's card style)
- Show company name on each card (`showCompanyName: true`)
- Support JS-driven tag filtering and optional pagination via `portfolioList.js`
- Read card dimensions and pagination settings from `hugo.yaml` params (`portfolio.cardHeight`, `portfolio.cardImgHeight`, `portfolio.enablepagination`, `portfolio.pagersize`)
- Exposes `window.portfolioConfig` object for the JS
- **Temporary:** contains a yellow disclaimer banner (remove when projects are finalised)

---

### `layouts/portfolio/single.html`
**Applies to:** individual project pages (`/portfolio/{company}/{project}/`).

**Overrides theme's `_default/single.html` to:**
- Show `companySlug` resolved to company name as a subtitle under the project title
- Show project date or a configurable placeholder (`singlePages.portfolio.noDatePlaceholder`) if no date set
- Replace the sidebar tags list with **styled tag pills** (`tag-btn` class, clickable)
- Add a **skills sidebar** (rendered from `skills` frontmatter as pills)
- Tag buttons redirect to `/portfolio/?tag=<tag>` instead of the theme's taxonomy pages
- Twitter share icon updated to X (𝕏)

---

### `layouts/companies/section.html`
**Applies to:** company overview pages (`/companies/{slug}/`).

**This is a new layout with no theme equivalent.** Company pages use the `section` type because `content/companies/{slug}/` folders are Hugo sections (they contain an `_index.md`).

**Key features:**
- Wraps the section in `<section id="single" class="company-page">` — the `.company-page` class scopes all CSS overrides in `single.css`
- Derives `companySlug` from the directory name (`{{ .File.Dir | path.Base }}`)
- Title block shows company name, optional subtitle/dates from frontmatter
- Featured image resolved from `static/images/{slug}/{image}` path
- Renders markdown content via `{{ .Content | emojify }}`
- **Conditionally renders three sections from frontmatter flags:**
  - `roles.enable: true` → calls `company-roles.html` partial
  - `gallery.enable: true` → calls `gallery.html` partial (all gallery params configurable from frontmatter)
  - `projects.enable: true` → calls `company-projects.html` partial (tag/weight/height filters from frontmatter)

**Company page frontmatter shape:**
```yaml
title: "Company Name"
logo: "logo.png"           # resolved from static/images/{slug}/logo.png
roles:
  enable: true
gallery:
  enable: true
  title: "Gallery"         # optional heading
  source: bundle           # bundle | static | assets
  layout: grid             # grid | row | single
  cols: 3
projects:
  enable: true
  minWeight: 2             # only show projects with weight >= 2
  tagFilter: "IoT,Embedded"
```

## Shortcodes

Shortcodes are in `layouts/shortcodes/` and delegate to their matching partial. Use them inside markdown content files.

### `{{< company-roles >}}`
Displays the experience roles for a given company (uses `layouts/partials/company-roles.html`).
- `companySlug` (required) — matches `companySlug` frontmatter in `content/experience/` files
- `companyName` (required) — display name used in the section heading
- `showTitle` (optional, default `true`) — show/hide the "Roles at {Company}" heading

**Usage examples:**
```
{{< company-roles companySlug="companySlug" companyName="Company Name" >}}
{{< company-roles companySlug="companySlug" companyName="Company Name" showTitle="false" >}}
```
**⚠ Do not use on a company page that has `roles.enable: true` in frontmatter** — see conflict note in the company page section above.

### `{{< company-projects >}}`
Displays a grid of project cards filtered by company (uses `layouts/partials/company-projects.html`).
- `companySlug` (required) — matches `companySlug` frontmatter in `content/portfolio/` files
- `companyName` (optional) — auto-detected from company page if omitted
- `showTitle` (optional, default `true`) — show/hide "Projects at {Company}" heading
- `showCompanyName` (optional, default `false`) — show company name on each card
- `tagFilter` (optional) — comma-separated tags for OR filtering (case-insensitive)
- `minWeight` (optional, default `1`) — minimum project `weight` frontmatter value to include
- `cardHeight` (optional, default `500`) — total card height in px (450–600)
- `excludeFolders` (optional) — comma-separated subfolder names to exclude

**Usage examples:**
```
{{< company-projects companySlug="companySlug" >}}
{{< company-projects companySlug="companySlug" showTitle="false" cardHeight="250" >}}
{{< company-projects companySlug="companySlug" tagFilter="Tag1,Tag2" minWeight="2" >}}
```
**⚠ Do not use on a company page that has `projects.enable: true` in frontmatter** — see conflict note in the company page section above.

### `{{< gallery >}}`
Displays an image gallery with lightbox support via Fancybox (uses `layouts/partials/gallery.html`).
- `src` (optional) — image pattern or subdirectory; defaults to all images in the page bundle
- `source` (optional, default `"bundle"`) — `"bundle"` (page resources, processed), `"static"` (from `static/images/`, no processing), `"assets"` (from `assets/images/`, processed)
- `layout` (optional, default `"grid"`) — `"grid"`, `"row"`, or `"single"`
- `cols` (optional, default `3`) — number of columns for grid layout
- `max` (optional, default `5`) — maximum visible images (hard cap at 5; extras shown as +N badge)
- `showCaption` (optional, default `false`) — show filename as caption
- `thumbSize` / `thumbQuality` — thumbnail resize (default `480x` / `60`) — bundle/assets only
- `fullSize` / `fullQuality` — lightbox image size (default `1200x` / `85`) — bundle/assets only

**Usage examples:**
```
{{< gallery >}}                                              // all images in page bundle, grid layout
{{< gallery src="subfolder" >}}                             // images from subfolder in bundle
{{< gallery src="photo.jpg" >}}                             // single specific image
{{< gallery src="subfolder" layout="grid" cols="3" >}}      // grid with 3 columns
{{< gallery src="subfolder" layout="row" max="8" >}}        // horizontal row, up to 8 images
{{< gallery src="subfolder" layout="single" >}}             // show first image, rest in lightbox only
{{< gallery src="subfolder" source="static" >}}             // images from static/images/subfolder/
{{< gallery src="subfolder" source="assets" >}}             // images from assets/images/subfolder/
```

## Partials

Custom partials in `layouts/partials/` (override theme equivalents where named the same):

| Partial | Purpose |
|---|---|
| `company-roles.html` | Renders experience roles for one company; used by shortcode + company pages |
| `company-projects.html` | Renders project card grid for one company; used by shortcode + company pages |
| `project-cards.html` | Core card grid renderer; called by `company-projects.html` |
| `gallery.html` | Image gallery with Fancybox lightbox; used by shortcode |
| `sections/experience.html` | Full multi-company experience timeline on homepage |
| `sections/education.html` | Education section on homepage |
| `sections/contact.html` | Contact section on homepage |
| `sections/header.html` | Site navbar |
| `sections/hero/index.html` | Hero/intro section |
| `sections/footer/index.html` | Site footer |
| `head.html` | `<head>` tag overrides (meta, CSS links) |
| `scripts.html` | Global script includes |

## Content Directory Structure

The `content/` folder drives all site data. Most section files use `build: render: never` so Hugo doesn't generate standalone pages for them — they're read by partials and templates as data sources.

**Date format:** All dates in frontmatter use `YYYY-MM-DD` (e.g. `2023-06-01`). Education dates are display strings (`"2019 - 2021"`). Omitting `end` on a role means it shows as "Present".

```
content/
├── hero/index.md          — Hero section data (no page rendered)
├── about/index.md         — About section data (no page rendered)
├── experience/            — One .md per role (no pages rendered)
│   ├── _index.md          — Section index (empty, required by Hugo)
│   └── Company-RoleName.md
├── education/index.md     — Education section data (no page rendered)
├── techstack/index.md     — Tech stack section data (no page rendered)
├── achievements/index.md  — Achievements section data (no page rendered)
├── contact/index.md       — Contact section data (no page rendered)
├── companies/             — Company overview pages (rendered as sections)
│   ├── _index.md          — Section index (empty, required by Hugo)
│   └── {companySlug}/
│       └── _index.md      — Company page content + frontmatter
├── portfolio/             — Project case studies (rendered as pages)
│   ├── _index.md          — Section index (empty, required by Hugo)
│   ├── {companySlug}/     — One subfolder per company (or "personal" for non-company projects)
│   │   └── {projectName}/
│   │       ├── index.md   — Project page content + frontmatter
│   │       └── image.jpg  — Project thumbnail (page bundle resource)
│   └── personal/          — Non-company projects use "personal" as the companySlug
│       └── {projectName}/
└── templateFiles/         — Reference/example markdown files (not linked in nav)
```

---

### `content/hero/index.md`
Controls the hero/intro section on the homepage.
```yaml
intro: "Intro line 1" # e.g. "Hi, my name is,
title: "Intro Line 2" # e.g. "Isabella."
subtitle: "Short punchy description/subtitle"
content: "Short tagline shown under the subtitle."
headshot:   # Includes a photo, e.g. a mugshot of the person, to the right side of the content
  enable: false
  image: hero.jpg        # static/images/hero.jpg
  roundImage: false
background: # Intended to be used instead of headshot - fills background to the right side of the hero content
  enable: true
  image: "hero_bg_light.svg"   # static/images/hero_bg_light.svg
  darkmode:                    # If a darkmode image is also required, it will use one in darkmode
    image: "hero_bg_dark.svg"  # static/images/hero_bg_dark.svg
resumeButton:            # this key enables the resume botton to be added
  enable: true           # Enables or disables the resume button
  name: "Resume"         # Name of the button
  fileName: "CV.pdf"     # static/resume/CV.pdf - filename can be changed, path is harcoded 
  local: true            # True if location is Local URL
  download: true         # True if link downloads a file
  newPage: true          # Opens link or download in new page
customButton:            # this key enables a custom botton to be added
  enable: true           # Enables or disables the custom button
  name: "Portfolio"      # Name of the button
  location: "/portfolio" # Public URL or local URL
  local: false           # True if location is Local URL
  download: false        # True if link downloads a file
  newPage: false         # Opens link or download in new page
socialLinks:             # references keys defined in hugo.yaml params.socialLinks
  fontAwesomeIcons:
    - socialName
bottomImage:
  enable: false
build:
  render: never
  list: never
```

---

### `content/about/index.md`
Controls the About section on the homepage.
```yaml
title: "About Me"
image: "me.jpg"          # static/images/me.jpg - Can be commented out if you dont need an image (e.g. a mugshot image)
content: |-              # Markdown supported
  Your bio text here.
skills:
  enable: true
  title: "Skills label text"
  items:
    - "Skill 1"
    - "Skill 2"
build:
  render: never
  list: never
```

---

### `content/experience/{Company}-{Role}.md`
One file per role. Not rendered as pages (`build: render: never`). Grouped by `companySlug` in the experience partial.
```yaml
title: Role Title
companySlug: companySlug    # must match a folder in content/companies/
start: YYYY-MM-DD           # used for sorting and display
# end: YYYY-MM-DD           # omit for current role (shows "Present")
location: City, Country     # optional
summary: |-                 # Markdown supported (rendered with markdownify)
  Short role summary.
  - Bullet points work here.
build:
  render: never
```
**Note:** The file name convention is `{CompanySlug}-{RoleName}.md` but only `companySlug` frontmatter matters for grouping.

---

### `content/education/index.md`
Controls the Education section. All data is in frontmatter — no markdown body.
```yaml
index: false
items:
  - title: "Degree Title"
    school:
      name: "University Name"
      url: "https://example.org"
    date: "2019 - 2021"
    GPA: "3.9 out of 5.0"    # optional
    content: |-               # Markdown supported
      Description and activities.
    featuredLink:             # optional
      enable: false
      name: "Link text"
      url: "https://example.com"
build:
  render: never
  list: never
```

---

### `content/techstack/index.md`
Controls the Tech Stack section. All data in frontmatter.
```yaml
title: "Technical Stack"
intro: "Short intro text."
technical_groups:
  - title: "Group Name"
    skills:
      # Devicon (https://devicon.dev/):
      - devicon_name: "python"
        devicon_suffix: "original"
        name: "Python"
      # SVG Porn CDN (https://svglogos.dev/):
      - svgporn_name: "icon-name"
        name: "Tool Name"
      # Simple Icons — local file from assets/icons/simple/:
      - simpleicon_name: "iconname"
        name: "Tool Name"
      # Simple Icons — local file with colour override:
      - simpleicon_name: "iconname"
        simpleicon_color: "#ff0000"
        name: "Tool Name"
      # Simple Icons — from CDN instead of local file:
      - simpleicon_name: "iconname"
        simpleicon_cdn: "cdn.jsdelivr.net/npm/simple-icons@latest/icons/"
        name: "Tool Name"
      # Custom icon — raw SVG from assets/icons/custom/:
      - custom_icon: "filename-without-extension"
        name: "Tool Name"
build:
  render: never
  list: never
```
**Icon sources (in priority order):**
- `devicon_name` + `devicon_suffix` → Devicon CDN (`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/`)
- `svgporn_name` → SVG Porn CDN (`https://svglogos.dev/`)
- `simpleicon_name` → local file from `assets/icons/simple/` (optionally override with `simpleicon_cdn` for CDN, or `simpleicon_color` to tint)
- `custom_icon` → raw SVG from `assets/icons/custom/` (served as-is, no colour processing)

---

### `content/achievements/index.md`
Controls the Achievements section (currently disabled via `hugo.yaml`).
```yaml
items:
  - title: "Achievement Title"
    content: "Description."
    url: https://example.com   # optional
    image: /images/achievement.jpg  # optional
build:
  render: never
  list: never
```

---

### `content/contact/index.md`
Controls the Contact section.
```yaml
content: "Short intro message."
btnName: Send Message
info:
  socialLinks:            # references keys from hugo.yaml params.socialLinks
    fontAwesomeIcons:
      - email
      - phone
      - linkedin
      - location
formspree:
  enable: true
  formId: "{formId}"      # from Formspree dashboard
  captchaSiteKey: "..."   # hCaptcha site key
  emailCaption: "Enter your email address"
  messageCaption: "Enter your message here"
  subjectCaption: "Enter subject"
  messageRows: 5
build:
  render: never
  list: never
```

---

### `content/companies/{companySlug}/_index.md`
Company overview pages. Uses `_index.md` (not `index.md`) because the folder is a Hugo section. Rendered by `layouts/companies/section.html`.
```yaml
title: "Company Name"
logo: "logo.png"              # resolved from static/images/{companySlug}/
image: "featured.jpg"         # resolved from static/images/{companySlug}/
start: YYYY                   # display year (string or int)
# end: YYYY                   # omit for current company
searchTags: "tag1 tag2"       # space-separated, boosts search relevance
searchDescription: "snippet"  # shown in search results
roles:
  enable: true                # show company-roles partial below content
gallery:
  enable: false
  title: "Gallery heading"    # optional
  location: "subfolder"       # subdirectory or image pattern
  source: bundle              # bundle | static | assets
  layout: row                 # grid | row | single
  cols: 3
projects:
  enable: true
  tagFilter: "Tag1,Tag2"      # optional OR filter
  minWeight: 1
  cardHeight: 250             # 150–400px
  excludeFolders: ""
```
**Markdown body:** Free-form markdown rendered after the title block. Supports all standard markdown plus Hugo shortcodes.

**Anchor links** — use `<div class="split-links">` for side-by-side internal links. The `#experience` and `#portfolio` section IDs are set automatically by the `company-roles` and `company-projects` partials when enabled via frontmatter:
```html
<div class="split-links">
  <a href="#experience">View my roles ↓</a>
  <a href="#portfolio">View my projects ↓</a>
</div>
```

**Gallery in markdown** — use the `gallery` shortcode directly in the body when you want a gallery mid-content rather than at the bottom. The gallery frontmatter section is for a bottom-of-page gallery only:
```
{{< gallery src="subfolder" layout="row" >}}
```

**⚠ Shortcode vs frontmatter conflict** — do **not** use `company-roles` or `company-projects` shortcodes in the markdown body if those sections are already enabled in frontmatter (`roles.enable: true` / `projects.enable: true`). The frontmatter sections render with specific `id="experience"` and `id="portfolio"` anchors. Adding shortcodes in the body would create duplicate IDs, causing anchor links (`#experience`, `#portfolio`) to behave unpredictably. Use one approach only:
- **Frontmatter** (recommended for standard layout — renders at bottom of page with correct anchors)
- **Shortcode in body** (use only if frontmatter sections are disabled — gives inline control but you must manage anchors manually)

---

### `content/portfolio/{companySlug}/{projectName}/index.md`
Individual project pages. Uses a page bundle (`index.md` + `image.jpg` in same folder) so the image is a bundle resource for Hugo image processing. Rendered by `layouts/portfolio/single.html`.
```yaml
title: "Project Title"
companySlug: "companySlug"    # links card to company; resolves company name in subtitle
summary: "One-line description shown on cards and in search."
date: YYYY-MM-DD              # shown in header; omit to show noDatePlaceholder ("In Development")
image: "image.jpg"            # page bundle resource (same folder as index.md)
skills:                       # shown in sidebar as pills
  - "Skill Name"
tags:                         # shown as filter buttons; used for tag filtering on /portfolio/
  - "Tag1"
  - "Tag2"
weight: 1                     # used by minWeight filter in company-projects; higher = more prominent
searchTags: "extra search terms"      # optional, boosts search
searchDescription: "search snippet"  # optional, overrides auto-generated snippet
enableReadingTime: true       # optional
draft: true                   # set false to publish
```
**Markdown body:** Full project case study content. Shortcodes (`gallery`, etc.) can be used here.

---

## `hugo.yaml` Configuration

The main site config file. Controls global site behaviour, theming, and section data.

### Key deviations from the theme's `exampleSite/hugo.yaml`

The theme's example file mixes **site config** with **section content** (hero text, experience items, education entries, etc.). This project moves all content into `content/` files instead, keeping `hugo.yaml` as **site config only**.

**Removed from hugo.yaml (now in content/ files):**
- `params.hero.*` content → `content/hero/index.md`
- `params.about.*` content → `content/about/index.md`
- `params.experience.items` → `content/experience/*.md`
- `params.education.items` → `content/education/index.md`
- `params.achievements.items` → `content/achievements/index.md`
- `params.projects.items` → `content/portfolio/` page bundles
- `params.contact.*` form config → `content/contact/index.md`

**Added to hugo.yaml (not in theme example):**
- `params.siteStatus` — `"live"` or `"coming-soon"` toggle
- `params.socialLinks` — centralised social links referenced by hero and contact content files
- `params.color.*` — full light + dark mode colour palette (theme has these commented out)
- `params.portfolio.*` — card dimensions, pagination settings for `/portfolio/`
- `params.navbar.showContactLast` — pins contact to end of nav
- `params.singlePages.portfolio.noDatePlaceholder` — "In Development" placeholder for undated projects
- `params.techstack.*` → `content/techstack/index.md` (custom section, not in theme)
- `markup.tableOfContents` — H1–H3 range configured

### Notable `hugo.yaml` settings reference

| Setting | Effect |
|---|---|
| `params.siteStatus` | `"coming-soon"` hides site behind placeholder (except on `hugo server`) |
| `params.color.primaryColor` | Accent colour used across all CSS custom properties |
| `params.color.darkmode.*` | Full dark mode palette |
| `params.portfolio.enablePagination` | Enables JS pagination on `/portfolio/` |
| `params.portfolio.pagerSize` | Items per page (must be set here, not in top-level `pagination`) |
| `params.portfolio.cardHeight` | Global default card height (overridable per company page) |
| `params.navbar.stickyNavBar.enable` | Sticky navbar |
| `params.navbar.showContactLast` | Pins contact menu item to end of nav |
| `params.socialLinks` | Central definition of email, phone, linkedin, location — referenced by hero and contact content files by key name |
| `markup.goldmark.renderer.unsafe` | Required `true` to allow raw HTML in markdown (used for `<div class="split-links">` etc.) |

### `params.socialLinks` — email and phone keys

The `email` and `phone` entries use **custom keys** (`mailto` and `tel`) instead of the standard `url` key. This is intentional: the contact partial has special handling for these to generate correct hyperlink protocols.

```yaml
params:
  socialLinks:
    fontAwesomeIcons:
      email:
        icon: fas fa-envelope
        mailto: user@example.com   # generates href="mailto:user@example.com"
      phone:
        icon: fas fa-phone
        tel: "+64 21 000 0000"     # generates href="tel:+6421000000" (spaces stripped)
      location:
        icon: fas fa-map-marker-alt
        location: City, Country    # displayed as plain text, no hyperlink
      linkedin:
        name: LinkedIn
        icon: fab fa-linkedin
        url: https://linkedin.com/in/username   # standard href
```

**Why this matters:** Using `mailto:` and `tel:` as link protocols (rather than `https://`) is required for email clients and phone diallers to open correctly on both desktop and mobile. The contact partial reads these keys specifically to prepend the correct protocol. If you add a new social link that needs a non-`https://` protocol, add a custom key and update the contact partial to handle it.

## Common Patterns

### Adding New Styles
1. **Read the target file first** to understand existing structure
2. **Prefer scoped selectors** (`#section .element`) over global styles
3. **Mobile:** Add mobile-specific rules inside existing `@media (max-width: 576px)` blocks
4. **Test both desktop and mobile** after changes

### File Editing
- **Always read files before editing** (Claude Code requirement)
- **Prefer Edit over Write** for existing files to preserve unrelated content
- **Never edit theme files directly** — override in `layouts/` instead

### Link Styling
Pattern for growing underline hover effect:
```css
a {
  display: inline-block;
  text-decoration: none;
  color: var(--text-link-color);
}
a::after {
  content: "";
  display: block;
  width: 0px;
  height: 2px;
  background-color: var(--primary-color);
  transition: all 0.25s cubic-bezier(0.645,0.045,0.355,1);
  opacity: 0.5;
}
a:hover::after,
a:focus::after,
a:active::after {
  width: 100%;
}
```

## Git Workflow

- **Commit messages:** Concise, descriptive (1-2 sentences)
- **Stage specific files** by name rather than `git add -A` (avoid accidentally staging .env, credentials)
- **Never force-push** or use destructive commands without explicit user request
- **PRs:** Use `gh pr create` with title + body (include Summary and Test plan sections)

## Known Issues / Temporary Code

- **Portfolio disclaimer banner** in `layouts/portfolio/list.html` is temporary (remove when projects are finalized)
- **Experience timeline script** uses vanilla JS (no jQuery) for compatibility

## Testing Checklist

When making CSS/layout changes:
1. Test on desktop (full width)
2. Test on mobile (< 576px width)
3. Check both light and dark modes if applicable
4. Verify hover states and transitions
5. Test with varying content lengths (short vs. long text)

## Avoid

- **Don't over-engineer** — only add what's requested, no premature abstractions
- **Don't add comments/docstrings** to code you didn't change
- **Don't create new files** unless explicitly needed — prefer editing existing files
- **Don't use destructive git commands** without explicit permission
- **No emojis** unless user explicitly requests them
