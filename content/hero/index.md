---
intro: "Hi, my name is"
title: "Daniel."
subtitle: "End-to-End Electronics and Systems Engineering." # OR the typical "Engineer. Coder. Problem Solver."
content: "Electronics and systems engineering across the full development lifecycle — with a strong interest in aerospace and integrated systems."
headshot:
  enable: false
  image: hero.jpg
  roundImage: false
background:
  enable: true
  image: "hero_bg_light.svg"   # lives in /static/images/ 1200x1200px
  # color: "#f0f4f8"
  darkmode:
    image: "hero_bg_dark.svg" # 1200x1200px
    # color: "#686363"
resumeButton:
  enable: true
  name: "Resume"
  fileName: "CV.pdf" # Can be public url (use full URL), or a file in static/resume
  local: true # Set true if file is local not a web URL
  download: true
  newPage: true
customButton:
  enable: true
  name: "Portfolio"
  location: "/portfolio" # Can be public url (use full URL), a site page, or a local file in static/
  local: false # Set true if location is a site page or local file, not a web URL
  download: false
  newPage: false
socialLinks: # Uses the socials defined in hugo.yaml
  fontAwesomeIcons:
    - linkedin
  # customIcons:
  #   - customName
bottomImage:
  enable: false # Weird svg image that renders as + signs

# Required Hugo parameters
build:
  render: never
  list: never
---