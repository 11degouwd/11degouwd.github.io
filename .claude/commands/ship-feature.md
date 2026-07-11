---
description: Take an issue number from start to a tested, documented, pushed branch ready for review
---

Take issue #$ARGUMENTS through the full workflow:
1. Use the issue-runner subagent to create a branch and implement the change
2. If content was touched, use the content-reviewer subagent before testing
3. Use the qa-tester subagent for a full-site walkthrough pass (desktop,
   iPhone 15, Pixel 8, iPad, light + dark mode) — not just the new feature
4. Use the changelog-writer subagent to document it with screenshots
5. Respect push governance: only push to main if under today's push cap and
   all checks pass. Otherwise push the feature branch only and report status.
6. Report back to me with a summary, branch name, and whether it went to
   main — do not merge to main without this full sequence passing
