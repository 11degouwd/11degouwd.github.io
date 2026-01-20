---
intro: "Hi, my name is"
title: "Daniel."
subtitle: "End-to-End Electronics and Systems Engineering." # OR the typical "Engineer. Coder. Problem Solver."
content: "Electronics and systems engineering across the full development lifecycle — with a strong interest in aerospace and integrated systems."
# image: hero.jpg
# roundImage: true # Make hero image circular | default false
background:
  enable: true
  # image: "hero_bkgnd_v1.svg"   # lives in /static/images/
  # imageLight: "hero_bkgnd_v1.svg"
  imageLight: "post.jpg"
  imageDark: "hero_bkgnd_v1.svg"
button:
  enable: true
  name: "Resume"
  url: "/resume/resume.pdf" # Can be public url to access or a file in static/
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