---
title: "HAPs Electrical Systems Architecture"
companySlug: "keaAerospace"
summary: "Leading and designing the electrical system architecture for High Altitude Platforms (HAPs) and smaller low altitude Unmanned Aerial Vehicles (UAVs)."
# date: 2021-08-01
# image: "image.jpg"
skills:
  - System Architecture
  - Systems Thinking
  - Risk Management
  - Leadership
  - Teamwork
  - Integration
tags: 
  - System Architecture
  - HAPs
  - UAVs

weight: 1
searchTags: "Kea Aerospace Haps UAV System Architecture Atmos Mk1 MK2 R6 R7 Drone"
searchDescription: "Leading and designing the electrical system architecture"
enableReadingTime: true
#author: "Daniel de Gouw"
noDatePlaceholder: "2021 - Present"
draft: false
---
The Atmos Mk1 project began with me designing the initial electrical system architecture and later evolved into more of a lead systems architect role as the project and team expanded. Using a top-down design approach inspired by proven Radio Control (RC) aircraft architectures, I defined the first high-level avionics and power system layout capable of stratospheric operation.

As the system matured through multiple design iterations and flight testing, the platform successfully reached altitudes above 56,000 ft, validating the early architectural decisions.

# What I Worked On
Specifically, I focused on the overall architecture, power systems (e.g. Battery, Solar, Power conversion, Power distribution, etc.), embedded systems (excluding the autopilot system), lighting systems, what/how data is collected, ground station architecture and network infrastructure (including uplink/downlink). I generated several requirements documents for systems and subsystems and defined what standards a system should be tested to. Design decisions ranged from simple choices such as cable insulation materials, bus voltages, and communication bus types to more complex decisions involving power distribution unit (PDU) architecture, battery design and RF system choices. I designed the first eight architecture versions, iterating alongside flight testing, before transitioning the design ownership to the team and mentoring them through the next 10+ major versions. 

I also worked on various other smaller airframes where in some cases I led the system architecture, PCB design and integration. I was able to apply many of the same methodologies and learnings from the Mk1 platform, but on a much smaller and more compact scale. These aircraft were restricted to low altitude flights (below 10,000ft) due to airframe limitation which in turn simplified design constraints.

# Challenges
Many of the challenges revolved around operating within an environment where there was little information on and very few people had the experience of operating within. Other challenges were created directly from requiring a low SWaP (Size, Weight, and Power) vehicle in almost every aspect to achieve stratospheric flight. Operating in the stratosphere meant the entire system could be subject to challenging conditions such as temperatures below -55degC, pressures below 60mbar (very low but not yet considered a vacuum), and radiation to name a few. Furthermore, flying the Atmos Mk1 <abbr title="Unmanned Aerial Vehicle">UAV</abbr> from ground level to the stratosphere also meant the entire system must operate reliably in two very different environments, not to mention the weather systems it may pass through along the way. This was a challenge for various aspects of the initial avionics design such as thermal management challenges caused by low atmospheric density, along with outgassing and high-voltage arcing considerations. These challenges were overcome through careful selection and research into subsystems and/or components prior to purchasing or designing. In many cases I designed and performed environmental and electrical validation tests on components and subsystems to not only ensure they could operate under stratospheric conditions but also have high confidence in their reliability. In other cases it was obvious, whether through testing or looking at the datasheets, that some components or subsystems required modifications such as thermal management circuits, custom heat sinking or conformal coating. 

# General Approach
Factoring in the company’s expected 2 year project timeline, limited in-house skill coverage and limited budget, I needed to determine what systems could (or should) be purchased off-the-shelf, and what systems could (or should) be manufactured in-house or even outsourced. My decisions on this matter were heavily influenced by what could be done to get the first prototype flying as soon as possible and what subsystems might require the most R&D to get the first prototype in the stratosphere as soon as possible. I prioritized getting a flyable prototype into the air as early as possible rather than pursuing a perfect theoretical design with many undiscovered unknowns. This approach allowed the company to quickly iterate on procedures, designs and systems to create a significantly more reliable UAV. Redundancy was another area that I had to compromise on initially in almost every area due to the low SWaP constraints, therefore creating a need for systems to be thoroughly tested and the capability of doing so to be within reach. 

## When to Design In-House
I prioritized in-house designs for subsystems and/or components where the solution was unique to our application, or the solution needed to remain as fluid as possible given our objectives, or existing products were simply just not suitable given all other constraints (e.g. SWaP). This meant we had the greatest flexibility and control over the final solution that was tailored to our needs. On the very rare occasion, I would prioritize outsourcing a design if the solution was unique to our application but the company lacked the technical expertise or capability. In these scenarios I would work in with external contractors to create the solution for us.

## When to Buy
I prioritized common-off-the-shelf (COTS) components where existing products perfectly suited our application (at least initially even for low altitude flights), or the effort to ‘reinvent the wheel’ was simply not worth it to the business. In some cases, I flagged specific COTS components to be one of the first things to be revisited and upgraded to an in-house design once the system was proven to work for initial flight, making these components a small stepping stone. I found that choosing COTS components often introduces new compromises and/or undesirable architecture changes to a system which can increase the complexity, increase the design time and/or introduce integration issues. I was very careful when designing the system architecture to ensure that all COTS components would have high confidence with integration on paper and preferably that an alternative solution existed wherever possible. 

# Key Takeaways
Designing the system architecture from the earliest concept stages enhanced my holistic systems thinking and reinforced the importance of integration-focused thinking when developing complex platforms. It highlighted the importance of developing a detailed system architecture for complex systems, providing a clear and structured blueprint to guide the project in the initial stages. The experience further strengthened my ability to design robust systems within defined constraints and requirements. 

Working on the smaller airframes further strengthed my skills in systems thinking and integration, both in the concept and implementation stages.
