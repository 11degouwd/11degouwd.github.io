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
button:
  enable: true
  name: "Resume"
  fileLocation: "resume.pdf" # Can be public url to access or a file in static/
  localFile: true # Set true if file is placed in static/resume/ , otherwise false if web URL
  download: true
  newPage: true
socialLinks: # Uses the socials defined in hugo.yaml
  fontAwesomeIcons:
    - github
    - twitter
  customIcons:
    - website
bottomImage:
  enable: false # Weird svg image that renders as + signs

# Required Hugo parameters
build:
  render: never
  list: never
---