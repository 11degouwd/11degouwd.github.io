---
title: "Atmos Mk1 Solar System"
companySlug: "keaAerospace"
summary: "Designing and integrating the solar power system for the Atmos Mk1 — from cell characterisation and array geometry through to custom interconnects, MPPT integration, testing and flight validation."
# date: 2024-06-30
image: "image.jpg"
skills:
  - Systems Thinking
  - Electrical Design
  - Soldering
  - Harnessing
  - Testing & Characterisation
  - Modelling
  - Python
  - Mentoring
  - Process Creation
  - Integration
tags: 
  - Solar Design
  - UAVs

weight: 1
searchTags: "Kea Aerospace HAPS UAV Solar Atmos Mk1 Drone MPPT PV Array Characterisation"
searchDescription: "Designing, testing and integrating the solar power system for Atmos Mk1, including custom cell interconnects and MPPT integration"
enableReadingTime: true
# author: "Daniel de Gouw"
noDatePlaceholder: "2021 - 2025"
draft: true
---

The primary role of solar on a <abbr title="High Altitude Platform Station">HAPS</abbr> is to generate enough power to keep the aircraft flying whilst charging the batteries from the previous night. The solar system needs to do all of that across a day of changing sun angles and stratospheric temperatures. Getting the solar system right isn't just about peak output — it's about making the most of a fixed wing area across conditions that vary a lot, and building something that stays reliable across long endurance flights. The array is embedded in the wing structure, so a new panel means a whole new wing — expensive in both time and money.

My responsibility covered the solar system from requirements and high-level design through to integration, testing, characterisation and validation.

# What I Worked On

<!-- ORIGINAL NOTES:
- high level system design of requirements through to system architectures, implementation, integration, testing, characterising, modelling and validation.
- Defined the solar geometry and size given an airframe and the following high level goals:
  - Highest possible packing factor
  - effecient layout reducing conductor mass to MPPTs and inbetween cells (Cell interconnects)
- custom cell interconnect design with the mechanical team to achieve unique solar array geometry 
- large amount of testing and characterisation of cells. Included creating my own test rig where i could rotate panels to any angle with respect to a light source (sun or mock light) and equipment to generate PV,IV curves using python and a dc load
  - effect of different top skins
  - modelling of cells against irradiance, geometry and temperature changes
  - modelling of low sun angle performance
- Led and mentored a university team who created exxtremely valuable tools and processes for solar cell and array testing, verification/vaidation
  - Electroluminescence testing
  - Irrandiance testing under an LED light source with known spatial something and intensity
- Created and refined procedures for testing and manufacturing solar arrays
- Worked in closely with the MPPT design team - end result was a highly efficient system that integrated nicely into our system.
  - I do not want to mention that this was an external contractor who designed it and that I worked directly with them.
  - I defined requirements and made high level decisions. 
-->

- Defined solar array geometry and cell layout within the constraints of the fixed airframe, optimising for packing factor and minimising conductor mass
- Designed custom cell interconnects with the mechanical team to achieve a layout unique to the wing geometry
- Built a rotating test rig to characterise cells at any incidence angle against real and simulated light sources; generated <abbr title="Power-Voltage / Current-Voltage">PV/IV</abbr> curves using Python and a <abbr title="Direct Current">DC</abbr> load
  - Characterised the effect of different wing skin materials on cell output
  - Modelled cell behaviour against irradiance, temperature and geometry changes
  - Modelled low sun angle performance
- Led and mentored a university team that developed testing tools and processes for solar cell and array validation, including electroluminescence inspection and irradiance characterisation under a controlled <abbr title="Light Emitting Diode">LED</abbr> source
- Defined requirements for and worked closely with the <abbr title="Maximum Power Point Tracker">MPPT</abbr> design team; the resulting system integrated cleanly and performed well across the operating range
- Developed and refined manufacturing and testing procedures for the solar arrays


# Challenges

<!-- ORIGINAL NOTES:
- Having the wing shape predefined made it very difficult to get a high packing factor of solar cells whilst also ensuring certain solar array layouts/configurations could be met. 
  - This required the need for custom cell interconnects - this actually turned out to be a great decision for the following reasons:
    - Lower losses - interconnects were made larger and thicker to reduce losses
    - all paralell cells had interconnects tieing them together
      - increased overall reliability - the pv array is embedded into the wing and so new array meant a whole new wing ($$$)
      - any broken cell in a string would be significantly less likely to cause the pv array to fail
      - had the down side that micro current loops could occur at any parallel branch and increased risk of hotspots
  - Some scrifices had to be made, e.g. the biggest one was removing cells from the wing as a comprimise to all the constraints - meant marginally lower packing factor
- weight constraints and voltage choices and wing size - severly impacted design decisions, scope of feasible solutions was limited
  - is the following too much information for IP? how can i prevent it from sounding like heres what we found works and doesnt work - keep it generic
    - wing dihedral added complications to overall pv array efficiency which was not considered at the beginning and only found through flight testing. 
      - The dihedral should have been its own pv array
    - efficiency and weight budget could not afford pv array configurations utilising bypass diodes
      - these would have further increased reliability at the cost of increased weight (every gram counts, solar array also spans the entire wing which has very high aspect ratio and surface area)
      - configuration could not be met without large comprimises for the short chord length
  - Wing airfoil shape created interesting challanges with the geometry of cells when combined into an array. Found out after many flight tests:
    - We found that the time of day (incidence angles) needed to be considered early in the design process
    - low incidence angles could mean half the cells were fully shaded when the other half still had fair amount of sun.
    - bypass diodes could have been used here but wouldnt have made a massive difference, what should have happened was better arranged pv arrays
- once integrated onto the wing - it is hard to test and verify functionality
  - came up with clever ways to inspect for damage - wont go into detail but someone smart will join the dots here
-->

## Cell Layout and Interconnects

The wing shape was fixed before I started on the solar system. Maximising cell coverage while meeting series and parallel configuration requirements is harder than it sounds, particularly on a high aspect ratio wing with a short chord. Working within those constraints was what pushed us toward a custom interconnect design — developed jointly with the mechanical team — rather than anything off the shelf.

That ended up being the better outcome regardless. We could size the conductors for the actual current paths rather than accepting the resistance of a standard part, which reduced losses with a small compromise on mass. Connecting all parallel cells through shared interconnects also improved array reliability — the array is embedded in the wing structure, so replacing it means replacing the wing. A single broken cell in a string was much less likely to take down the full array as a result.

The tradeoff is that parallel branches introduce the possibility of circulating currents and hotspot risk. That was a known risk going in, and we did enough R&D on the array design to validate the approach and understand its limits before committing to it. Some cells in the array also had to be removed to resolve conflicts between the competing constraints — a marginal hit to packing factor, but the right call in the end.

## Weight, Voltage, and Configuration Constraints

Weight and voltage budget cut the feasible solution pool down significantly. The array mass budget covered cells, interconnects, encapsulant, and the full conductor run to the <abbr title="Maximum Power Point Trackers">MPPTs</abbr> — on an aircraft where every gram directly affects overnight endurance. Voltage targets were set partly by the bus architecture and partly by what the MPPT system could work with, which constrained the array configuration options and ruled out some approaches that would otherwise have been worth considering.

## Wing Geometry Effects

Several things only became clear through flight testing. The dihedral sections of the wing see a different incidence angle to the sun compared to the main span, and that affects output more than the initial modelling suggested. In hindsight, treating those regions as a separate zone from the start would have been the right call.

The airfoil shape introduced another interaction that wasn't obvious until we had flight data: at low sun angles, parts of the array could be in shadow while adjacent sections still had reasonable direct illumination. This is the kind of geometry and incidence angle interaction that's hard to fully characterise before you have real flight data — but it's also the kind of thing that should be worked through at the concept stage, before the airframe design is locked in.

Bypass diodes came up as a potential mitigation for both of those issues. The mass cost ruled them out — the weight wasn't compatible with the endurance requirements — and the wing chord length made the configuration geometry difficult regardless.

## Testing Integrated Arrays

Once the array is bonded into the wing, direct access is limited. I developed methods, building on what the university team discovered, to inspect and characterise the array in situ without disassembly. This made it possible to track performance changes over time and catch problems before they showed up in flight.


# General Approach

<!-- ORIGINAL NOTES:
- Rotating rig 
  - designed and built by me
  - platform that rotated on one axis to enable testing pv arrays outdoors - designed for test arrays up to 40cells (4x10) in size, allowing the same array size to be used in between tests
  - test covered:
    - cell layups and top skin
    - array configuration
    - general pv/iv tests that were explained in above sections
  - DC load and custom python script - I designed this base functionality (software team created a gui and rebuilt the code base from ground up)
  - custom lasercut alignment tool for sun angle correction
  - approach:
    - develop a test plan
    - develop an array of a specific size (e.g. 2x10 cells) and layup
    - set up the equipment and electrical connections (including setup of thermocouples without interferring with the array under test)
    - place the array on a rig, test to the plan (e.g. get PV/IV curves for the sun at different incidence angles on the array)
    - analyse the data, create or improve any models as relevant
- Working with a predefined airframe from the start — setting requirements within hard constraints
  - start by determining requirements for the solar system
  - iteratively work through configuration concepts on the wing, narrowing down the solutions to a select few
  - fully plan the interconnects, pv array configuration, pv array account and mppt locations
  - verify this conceptually meets the requirements (as feasible without actually doing it)
- Procedure development for manufacturing and testing — same approach as battery page
- How integration with the MPPT team worked in practice
  - I defined requirements, full formal document including environmental stuff
    - I defined the input and output voltages, the communication busses and messages
    - I defined the bounds on mass and efficiency
  - They scoped and created a set of verification steps - we agreed on these
  - they designed a prototype
  - I provided a test setup and we tested it
  - they provided a bunch of prototypes and i continued to test the products performance in a mock setup, paying particular attention to the integration within our setup
    - most challenging part was the communication busses and getting the info we didnt know we needed
    - went through many software revisions to nail down the data rates, information and control schemes
  - full ground tests transitioned into flight tests
  - confidence in system built up in flight tests - small tweaks to design made along the way
-->

## Test Rig and Characterisation

I designed and built a rotating test rig for characterising <abbr title="Photovoltaic">PV</abbr> arrays outdoors. It rotated on a single axis and was sized to hold test arrays up to 40 cells, with the same array size carried between runs to keep results comparable. A <abbr title="Direct Current">DC</abbr> load paired with a custom Python script handled data acquisition and <abbr title="Power-Voltage / Current-Voltage">PV/IV</abbr> curve generation, and a laser-cut alignment tool dealt with sun angle correction. The base functionality of the data acquisition was something I designed; the software team later rebuilt it from scratch with a proper GUI that was used across projects.

The test process was methodical: develop a test plan, build an array of a specific cell count and layup, set up the electrical connections including thermocouples without disturbing the array under test, then work through the plan — generating curves at different incidence angles and conditions. Each set of results fed back into the models, either validating them or pointing to where they needed refinement. As well as general cell characterisation, the rig was used to test different cell layups, top skin materials, and array configurations before committing to them on the actual wing.

I also developed custom procedures for manufacturing and testing solar arrays — covering everything from cell handling and layup through to test setup and sign-off criteria. Having those in place made the iterative testing work a lot easier to run consistently.

## Array Design

Before getting into layouts and configurations, I worked from requirements up — determining what the solar system needed to deliver given the airframe and energy budget, then iterating through configuration concepts within the wing geometry. That meant narrowing a broad solution space against the constraints until a small number of viable candidates remained, then fully working through each one: interconnect routing, array configuration, and <abbr title="Maximum Power Point Tracker">MPPT</abbr> placement. Anything that made it that far was verified conceptually against the requirements before any physical work began.

## MPPT Integration

I put together a formal requirements document for the <abbr title="Maximum Power Point Tracker">MPPT</abbr> system — covering input and output voltages, communication buses and messages, environmental requirements, and bounds on mass and efficiency. Before any design work started, we agreed a set of verification steps together, which gave both sides a clear picture of what success looked like.

Once a prototype was delivered, I built a test setup and we ran through the verification together. From that point the project was handed back to me — I tested around half a dozen prototypes in a mock setup replicating the actual integration environment, checking both that each unit performed to spec and that it integrated cleanly into the airframe. The most iterative part of the whole process was the communication side: data rates, the information the system needed to expose for effective monitoring and control, and the control schemes themselves all went through many software revisions before they were right. Getting that part locked down was harder than the electrical integration.

From there the system followed the same ground-test-then-flight-test path as the rest of the aircraft, with confidence built incrementally and small refinements made as real-world data came in.


# Key Takeaways

<!-- ORIGINAL NOTES:
- bypass diodes are a must - especially if the pv array is made to be as light as possible (therefore strength is limited) and the wing flexes under load (causing solar cells to crack) and for the regions where dihedral causes a drop or complete loss of solar performance and for the curvature of the wing causing issues either side of solar noon (relates to above points)
-->

Working within a fixed airframe is a different problem from designing the airframe and solar system together. Several constraints I was working against were set before I started, and some of them only revealed their full effect through flight testing. The lesson isn't that the analysis was wrong — it's that certain geometry and incidence angle interactions need to be worked through explicitly at the concept stage, before anything structural gets locked in.

Bypass diodes are the clearest example of a decision that looks like a tradeoff but is probably better treated as a baseline requirement. A lightweight wing flexes under load, cells develop fatigue cracks over time, different sections of the wing see different sun angles throughout the day, and low incidence angles can put part of the array in shadow while the rest still has direct illumination. Bypass diodes address several of those problems at once. On a next-generation design, I'd treat them as a starting point rather than something to evaluate against the weight budget.

Building the rotating test rig and developing the characterisation tooling early paid off. Having the ability to generate PV/IV curves quickly, simulate different incidence angles, and test the effect of different skin materials meant design decisions were based on real data from early in the programme. The university team's electroluminescence and irradiance testing extended that capability further and produced tools the company could continue to use long after the engagement ended. Scoping that work — explaining the problem to people who were motivated but new to it — also forced a more deliberate approach to documenting decisions and tradeoffs, which surfaces assumptions you've stopped questioning.

Defining requirements formally before the MPPT design work started, and agreeing verification criteria upfront with the design team, made the integration far more manageable than it could have been. Both sides knew what "done" looked like from the beginning. When the communication issues came up later — and they did, through many software revisions — the scope of the problem was contained. Without those upfront agreements, that kind of iterative debugging would have been a much harder conversation.
