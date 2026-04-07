# Work Split — Pulse Break MVP

**Team:** Alex (Lead/Dev), Vince (UX/Design), Javin (Data/QA)  
**Timeline:** Days 1-8

---

## Day 1: Setup & Decision

### Alex (Lead/Developer)
- [ ] Create GitHub repo and project board
- [ ] Import issues from GITHUB_ISSUES.md
- [ ] **DECIDE:** React Native or Figma? (consult with team)
- [ ] If React Native: Initialize Expo project, test on device/simulator
- [ ] If Figma: Set up project file, create basic frames
- [ ] Share setup instructions with team

### Vince (UX/Design)
- [ ] Review MVP spec and provide feedback
- [ ] Sketch basic wireframes for 4 screens:
  - Home (check-in)
  - Break recommendation
  - Reflection prompt
  - History (if time allows)
- [ ] Define color palette (sage/teal/coral/cream from storyboard)
- [ ] Write 3-5 Let Them Theory reflection prompts
- [ ] Share wireframes + prompts with Alex by EOD

### Javin (Data/Engineering)
- [ ] Review MVP spec
- [ ] Design data models (CheckIn, Reflection)
- [ ] Define storage strategy (AsyncStorage or in-memory)
- [ ] Write sample data for testing
- [ ] Share data schema with Alex by EOD

**Day 1 Sync (End of Day):**
- Confirm tech stack decision
- Review wireframes and data models
- Align on Day 2-3 priorities

---

## Days 2-3: Feature 1 (Check-In) + Feature 2 (Evaluation)

### Alex (Primary Builder)
- [ ] Build home screen with emoji scale
- [ ] Implement check-in submission
- [ ] Add stress evaluation logic (1-2 low, 3 moderate, 4-5 high)
- [ ] Test data storage (save check-ins)
- [ ] Connect evaluation to break trigger
- [ ] **DEMO to team by end of Day 3**

### Vince (Support)
- [ ] Refine UI based on Day 2 build
- [ ] Create confirmation message copy
- [ ] Test UX flow (is it < 3 taps?)
- [ ] Provide feedback on visual design
- [ ] Prepare emoji assets if needed

### Javin (Support)
- [ ] Review data storage implementation
- [ ] Write helper functions (saveCheckIn, getCheckIns)
- [ ] Test data persistence
- [ ] Debug any storage issues
- [ ] Prepare sample data for history view

**Day 3 Milestone:** ✅ Check-in flow working end-to-end

---

## Days 4-5: Feature 3 (Break) + Feature 4 (Reflection)

### Alex (Primary Builder)
- [ ] Build break recommendation screen
- [ ] Add "Start Break" button with navigation
- [ ] Build reflection prompt screen
- [ ] Implement Let Them Theory prompts (use Vince's copy)
- [ ] Connect reflection responses to data storage
- [ ] Test full flow: check-in → evaluation → break → reflection
- [ ] **MINIMUM VIABLE DEMO complete by end of Day 5**

### Vince (Primary Content)
- [ ] Finalize reflection prompt copy
- [ ] Design break screen layout (message + button)
- [ ] Design reflection screen (prompt + yes/no buttons)
- [ ] Test end-to-end UX with Alex's build
- [ ] Gather feedback and iterate

### Javin (Support)
- [ ] Implement saveReflection function
- [ ] Link reflections to check-ins (foreign key relationship)
- [ ] Test data integrity (no orphaned records)
- [ ] Prepare controllable vs. uncontrollable ratio calculation
- [ ] Write test cases for critical path

**Day 5 Milestone:** ✅ Core demo ready (check-in → break → reflection)

---

## Day 6: Feature 5 (Storage) + Feature 6 (History) — IF TIME ALLOWS

### Alex (Builder)
- [ ] Polish existing features (UI cleanup, transitions)
- [ ] If time: Build history dashboard (list view or chart)
- [ ] If time: Test data persistence across app restarts
- [ ] Focus on making existing features feel smooth

### Vince (Polish)
- [ ] Final visual pass (spacing, colors, typography)
- [ ] Test on different screen sizes if React Native
- [ ] Ensure consistent design language
- [ ] Write any missing microcopy

### Javin (Data + History)
- [ ] Implement getWeeklyCheckIns function
- [ ] Calculate stress stats (avg per day, high stress count)
- [ ] Build controllable/uncontrollable ratio
- [ ] If time: Build chart data transformation
- [ ] Test edge cases (no data, single entry, etc.)

**Day 6 Decision Point:** History dashboard OR extra polish?

---

## Days 7-8: Polish + Demo Prep

### Alex (Lead)
- [ ] Final bug fixes
- [ ] Smooth out transitions and animations
- [ ] Test demo flow 5+ times
- [ ] Capture screen recording (backup for presentation)
- [ ] Take screenshots for pitch deck
- [ ] Write demo script (what to say during live demo)
- [ ] Deploy to Expo Go (if React Native) for team testing

### Vince (Presentation Support)
- [ ] Create pitch deck slides for MVP demo
- [ ] Write talking points for each screen
- [ ] Design any supporting graphics
- [ ] Practice demo with Alex
- [ ] Prepare answers to likely questions

### Javin (QA + Documentation)
- [ ] Test all user flows thoroughly
- [ ] Document known bugs/limitations
- [ ] Create backup plan (what if demo fails?)
- [ ] Test on different devices if possible
- [ ] Write technical Q&A responses for presentation

**Day 8 Milestone:** ✅ Demo-ready MVP, team rehearsed, backups prepared

---

## Communication Protocol

### Daily Standups (10 min, start of day)
- What did you ship yesterday?
- What are you building today?
- Any blockers?

### When Stuck (< 30 min)
- Try AI tools (Cursor, Claude, ChatGPT)
- Search docs/Stack Overflow
- Ask in team chat

### When Stuck (> 30 min)
- **Flag immediately** in Slack/Discord
- Team huddle to unblock
- Consider simplifying scope

### End of Day (5 min)
- Share progress screenshots
- Confirm tomorrow's priorities
- Celebrate wins

---

## Ownership Summary

**Alex (Lead/Developer):**
- Owns: All code implementation, technical decisions, deployment
- Supports: Team coordination, timeline management, demo execution

**Vince (UX/Design):**
- Owns: Visual design, UX flow, reflection prompts, presentation design
- Supports: User testing, feedback, pitch deck creation

**Javin (Data/Engineering):**
- Owns: Data models, storage strategy, queries, QA testing
- Supports: Technical troubleshooting, documentation, Q&A prep

**Everyone:**
- Ships working software
- Stays unblocked (asks for help)
- Attends daily standups
- Tests the demo flow
- Contributes to presentation

---

## Escalation Path

**If timeline slips:**
1. Cut Feature 6 (History) — demo without it
2. Cut Feature 2 calendar view (if separate from check-in)
3. Simplify Feature 4 (Reflection) — reduce to single prompt
4. **Last resort:** Show storyboard + wireframes instead of working app

**If React Native is too hard:**
- Pivot to Figma by end of Day 2 (no later!)
- Vince leads Figma build, Alex supports
- Lower demo expectations (clickable prototype vs. app)

**If someone is blocked:**
- Other team members swarm to unblock
- Temporarily reassign work
- Use AI tools aggressively to accelerate

---

**Remember:** 
- Done is better than perfect
- Ship the minimum viable demo by Day 5
- Everything after Day 5 is bonus polish
- The storyboard shows the full vision — the MVP just proves feasibility
