---
title: Kea Aerospace
logo: logo.png
image: atmos-1B-runway.jpg
start: 2021
# end: 
roles: # Enable Work experience at bottom of page
  enable: true
gallery: # Enable Gallery at bottom of page
  enable: true
  location: gallery # single image or directory
  source: bundle # "bundle" (page resources) or "static" (static/images folder) or "assets" (assets folder)
  layout: row # "grid", "row", or "single"
projects: # Enable Projects List at bottom of page
  enable: true
  # tagFilter: "tag1,tag2" # Allowed tags
  minWeight: 1 # Allowed minimum weight
---

## About Company One

Company One specialises in …

![Example Image](post.jpg)
fdvce

Blank
{{< gallery >}}

gallery Defaults
{{< gallery src="gallery" >}}

Single
{{< gallery src="post.jpg" >}}

Projects
{{< company-projects companySlug="keaAerospace" showTitle="false" >}}

Projects (advanced)
{{< company-projects companySlug="keaAerospace" companyName="Some Company" showTitle="false" tagFilter="OMG, IOT" minWeight="1" >}}

gallery Grid
{{< gallery src="gallery" layout="grid" cols="3" >}}

Roles
{{< company-roles companySlug="keaAerospace" companyName="Some Company" showTitle="false" >}}

gallery Row
{{< gallery src="gallery2" layout="row" max="8" >}}

gallery Single
{{< gallery src="gallery3" layout="single" >}}


blah blah i did this and that etc