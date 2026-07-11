## Portfolio Content Writing

When converting rough notes into portfolio page content (`content/portfolio/**/*.md`):

### Voice and tone
- Write in first person, past tense, direct — as the engineer who did the work
- Short sentences. Specific details. Honest about tradeoffs
- No corporate filler: avoid "leverage", "robust", "seamlessly", "significant", "meaningful", "non-trivial", "notoriously"
- Avoid AI-sounding phrases: "It is worth noting", "This allowed us to", "In order to", "It became clear that"
- Preferred phrases: "harder than it sounds", "hit and miss", "genuinely", "the right call", "in hindsight", "paid off"
- Three short paragraphs beats one long one. Break at natural thought boundaries

### IP protection
- No specific design values, dimensions, or proprietary system names
- No internal team structures, supplier names, or contractor relationships
- Frame discoveries as "found through flight testing" not "here's what went wrong with X"
- Tradeoffs can be described generically — what was ruled out and why — without revealing what was chosen
- When uncertain whether something is too specific, keep it generic or omit it

### Process for converting notes
1. Read all notes first to understand full scope before writing anything
2. Write prose paragraphs — do not just clean up the bullets into bullet form
3. Keep original notes as HTML comments (`<!-- ORIGINAL NOTES: ... -->`) immediately above the section they belong to
4. Add suggested additions or TODOs also as HTML comments (`<!-- TODO: ... -->`) so the user can expand later
5. Where a section is marked TBC, leave a detailed `<!-- TODO: ... -->` comment with suggested topics
6. Use `<abbr title="Full Name">ABBR</abbr>` for all technical acronyms on first use per section

### Structure conventions
- Intro: 1–2 paragraphs. Role of the system in the broader aircraft first, then scope of your work
- What I Worked On: bullet list (can have sub-bullets). Action verbs, specific deliverables
- Challenges: `##` subsections, one per major challenge. Prose only, no bullets
- General Approach: `##` subsections. HOW you worked, not WHAT you built (that's Challenges)
- Key Takeaways: prose paragraphs. Lessons, not summaries. What you'd do differently, what was validated
