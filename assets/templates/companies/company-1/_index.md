---
title: Company One # Title of the page and the name used to reference the company
logo: logo.png # Located in /static/images/THE_NAME_OF_THIS_MARKDOWN_FILE/
image: banner.jpg # Located in /static/images/THE_NAME_OF_THIS_MARKDOWN_FILE/
start: 2021 # Start date at this company. WARNING this is seperate from experience dates, check for alignment
end: 2024 # End date at this company. WARNING this is seperate from experience dates, check for alignment
---

## About Company One

Company One specialises in …

![Example Image](post.jpg)


Blank
{{< gallery >}}

gallery Defaults
{{< gallery src="someFolder" >}}

Single
{{< gallery src="post.jpg" >}}

gallery Grid
{{< gallery src="someFolder" layout="grid" cols="3" >}}

gallery Row
{{< gallery src="someFolder2" layout="row" max="8" >}}

gallery Single
{{< gallery src="someFolder3" layout="single" >}}

<!-- {{< gallery
  layout="row"
  max="5"
  thumbSize="40x"
  thumbQuality="20"
  fullSize="1400x"
  fullQuality="85"
  showCaption="false"
>}}


{{< gallery
  layout="grid"
  cols="3"
  thumbSize="60x"
  fullSize="1600x"
>}} -->


Projects
{{< company-projects companySlug="keaAerospace" showTitle="false" >}}

Projects (advanced)
{{< company-projects companySlug="keaAerospace" companyName="Some Company" showTitle="false" tagFilter="OMG, IOT" minWeight="1" >}}


Roles
{{< company-roles companySlug="keaAerospace" companyName="Some Company" showTitle="false" >}}



blah blah i did this and that etc