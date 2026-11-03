# Module 5
- [ ] Strengthen safety screening and add acknowledgment before feedback; verify rules and real chat flow.
- [x] Connect completed chat sessions and single linked feedback to existing external tables; no schema or policy changes.
- [x] Verify failure and reset behavior; 20 tests passed, build OK, actual external request returned database permission error 42501; recommendation remains usable with no false success.
- [ ] Verify successful real session insert/returned ID and linked feedback — blocked by existing external chat_sessions permissions (42501); feedback cannot be submitted without a returned session ID.
- [x] Build public Chat navigation and three-question guided intake.
- [x] Add personalized rules, guardrails, human checkpoint, reset and local feedback placeholder.
- [x] Verify rules and desktop/mobile conversation flow: 15 tests passed; all three recommendation paths, Other, guardrail, feedback, reset and mobile navigation passed; build OK.

# Module 4
- [x] Upgrade homepage without unsupported claims.
- [x] Build Marketing Engine: brand, illustrative persona, reusable copy, 10 posts, 3 scripts, 14-day calendar.
- [x] Implement preference comparisons, clipboard, TXT/CSV exports, honest unconfigured saved-assets state.
- [x] Verify desktop/mobile interactions and existing routes: six content/export tests passed; clipboard, downloads, both comparisons, reset, calendar links and empty saved state passed in browser; no page errors or horizontal overflow; build OK.
- [x] External marketing persistence — completed in the subsequent Save Assets and A/B voting tasks.