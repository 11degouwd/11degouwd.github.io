---
intro: "Hi, my name is" 
title: "Isabella."
subtitle: "I build things for the web"
content: "A passionate web app developer. I tend to make use of modern web technologies to build websites that look great, feel fantastic, and function correctly."
image: hero.svg # Image to include, stored in /static/images/ .  Image must contain a filetype!
bottomImage:
  enable: false # Weird svg image that renders as + signs, personal preference
roundImage: true # Make hero image circular | default false
button: # A customisable button to download anything, i.e. Your CV
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