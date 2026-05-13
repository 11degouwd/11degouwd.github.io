---
title: "Atmos Mk1 Battery Pack"
companySlug: "keaAerospace"
summary: "TBC"
# date: 2024-06-30
# image: "image.jpg"
skills:
  - Systems Thinking
  - Electrical Design
  - Spot Welding
  - Soldering
  - Harnessing
  - Risk Management
  - Integration
tags: 
  - Battery Design
  - HAPs
  - UAVs

weight: 1
searchTags: "Kea Aerospace Haps UAV Lithium Battery Pack Atmos Mk1 Drone"
searchDescription: "Designing, building and integrating the battery packs for Atmos Mk1"
enableReadingTime: true
# author: "Daniel de Gouw"
noDatePlaceholder: "2021 - 2024"
draft: true
---
A <abbr title="High Altitude Platform Station">HAPS</abbr> typically flies in the stratosphere above the weather systems and thus will always see the sun during the day. This means a HAPS can fly solely off solar power in daytime due to their wings typically containing large solar arrays providing excess energy. However, when flying during the night, one of the biggest challenges for a HAPS is having sufficient energy storage such that it remains in the stratosphere overnight for days on end. 

There are various different ways to store energy for HAPS, but only one practical solution exists for a long-endurance HAPS, specifically Kea Atmos. During my research it became immediately clear that Lithium batteries were the only real solution to this problem despite knowing the technology had some rather large limitations at the time. Lithium batteries can provide high-energy density storage with the ability to replenish this energy (i.e. through the day using solar) where in simple terms they will go through one charge/discharge cycle every day. The issue with high-energy density batteries is that there is a trade-off between high capacity and cycle life, meaning these batteries typically do not last long (in the order of days). As they wear out, their total capacity reduces, meaning there is less energy every single night. This directly adds to the challenges of ensuring sufficient energy storage and also the long-endurance aspect of a HAPS.

The biggest energy users on a HAPS are the propulsion system, thermal management systems, payloads and <abbr title="Radio Frequency">RF</abbr> systems. Reducing energy usage of these systems can significantly reduce the challenges seen in designing the energy storage system.

Designing the battery pack for the Atmos Mk1 was my responsibility — from initial research and cell selection through to electrical design, pack construction and integration. It was my aim to ensure that the pack had the highest energy density possible without sacrificing endurance. The capacity I could achieve set a hard ceiling on the energy budget for every other system on the aircraft overnight.

# What I Worked On

- Researched, selected and procured lithium cells, including supplier management
- Designed the current collector interconnect method for the pack
- Defined the geometric layout of the pack and the placement of cells
- Designed, tested and integrated a custom Battery Management System (BMS) ad supporting circuitry
- Manufactured the first prototype packs
- Led development of data driven models of the pack characteristics
  - Capacity
  - Charge/Discharge efficiencies
  - DCIR and ACIR
  - Effects of compression and temperature changes

# Challenges

## Bus Voltage

The bus voltage decision ended up being more restricted than I expected going in. The solar system (notably the array geometry, cell configuration and <abbr title="Maximum Power Point Tracker">MPPT</abbr> count) was already locked before I started on the battery, which cut down the options for how the pack could be arranged. The solar side ended up driving more of the battery architecture than I'd have liked. My preference was to run a higher bus voltage to keep wire mass down without overcomplicating the design during what was a fast R&D phase, but what the solar system could support put a ceiling on that and so did the availability of common ICs at that time. Fully working through energy system constraints early, especially before the airframe design is set, was an essential lesson for myself and the team. Changing solar cell geometry after the airframe design has been locked in is a very different problem to solving it at the concept stage.

## Cell Interconnects and Manufacturability

Lithium cells have aluminium cathode tabs and nickel anode tabs, and getting a reliable joint between them in a hand-built pack is harder than it sounds. You can't solder aluminium with standard techniques, and spot welding it at the tab thicknesses involved turned out to be very hit and miss. I spent a fair amount of time testing different approaches, including developing a method for soldering aluminium tabs directly — that didn't end up as the final solution, but the time wasn't wasted. Whatever the method, it needed to be electrically reliable, hold up mechanically, and be something I could reproduce by hand consistently. Getting to that point took real iteration on materials, tooling and process.

## Thermal

Testing thermal performance was trickier than I anticipated. Running single cells through a thermal chamber was straightforward but the results were essentially meaningless — the heat rejection from a single cell was so low it barely registered and I could not produce repeatable or accurate results. Testing a full pack gave much more useful data, especially considering any thermal insulation the pack may have had, but validating at stratospheric conditions is a different problem. That requires a <abbr title="Thermal Vacuum">TVAC</abbr> chamber, which isn't easy to get time in. Most of our validation ended up being thermal and vacuum tested separately, supported by simulation. Honestly, flight testing was where the most useful data came from. On top of that, deciding where and how to pull heat out of the pack was its own challenge — there are a few ways to approach it, but the lightweight constraint ruled out most of the obvious options and required careful thought about what was actually feasible. Adding survival heaters in the mix also meant we had to find ways to mitigate unintended heat losses. 

# General Approach

- supplier management and cell procurement (experimental batteries can be difficult)
- cell testing, modelling and validation
- pack design and configuration
  - system design considerations
    - Bus voltages / subsystem operational envelopes (pros and cons, C rating, voltage over long runs, efficiency)
  - Constraints:
    - thermal, geometry and integration
    - BMS and cell interconnect
    - Compression
    - Manufacturability
    - serviceability
  - High packing factor and efficient cell placement
  - Minimal Weight
  - S-P vs P-s vs hybrid? maybe not necessary
- building and testing
  - custom procedures
  - custom charging and testing station
  - manufacturing
    - Soldering/Spot Welding ???
    - Risk management
    - Custom tooling
  - BMS testing
  - regenerating pack curves (discharge, charge, DCIR modelling)
  - Thermal testing
- Integration and test flights
- Single electrical version, 2x prototype designs for electrical from maufacturing perspective, various prototypes for the thermal and mechanical design.

## Pack Design

## Pack Manufacturing

## Testing and Validation

# Key Takeaways

blah