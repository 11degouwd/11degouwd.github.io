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

- Bus voltages - solution that satisfied all systems
- Pack construction - cell interconnects and manufacturability
- 

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