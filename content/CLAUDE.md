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
