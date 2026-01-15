---
intro: "Hi, my name is"
title: "Daniel."
subtitle: "I build things for the web"
content: "A passionate web app developer. I tend to make use of modern web technologies to build websites that look great, feel fantastic, and function correctly."
image: hero.svg
bottomImage:
  enable: false # Weird svg image that renders as + signs
# roundImage: true # Make hero image circular | default false
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

# Required Hugo parameters
build:
  render: never
  list: never
---