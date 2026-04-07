# GitHub Issues — Pulse Break MVP

Copy-paste these issues into your GitHub repo or use GitHub CLI to bulk import.

---

## 🔴 PRIORITY 1 — MUST SHIP (Days 1-5)

---

### Issue #1: [Setup] Initialize Project & Make Tech Stack Decision

**Labels:** `setup`, `priority-1`, `day-1`  
**Assignee:** @alex

**Description:**
Set up the development environment and decide between React Native + Expo or Figma prototype.

**Tasks:**
- [ ] Create GitHub repository
- [ ] Set up project board with columns: Backlog, In Progress, Review, Done
- [ ] Import all issues from GITHUB_ISSUES.md
- [ ] **DECIDE: React Native or Figma?** (consult team)
- [ ] If React Native: Initialize Expo project with `npx create-expo-app pulse-break`
- [ ] If React Native: Install dependencies (React Navigation, AsyncStorage, UI library)
- [ ] If React Native: Test on iOS simulator or Android emulator
- [ ] If Figma: Create project file and share with team
- [ ] Document setup instructions in README.md

**Acceptance Criteria:**
- [ ] Repo is created and team has access
- [ ] Tech stack decision is documented in README
- [ ] Dev environment is working (can run "Hello World")
- [ ] Team can clone and run the project

**Deadline:** End of Day 1

---

### Issue #2: [Design] Create Wireframes & Design System

**Labels:** `design`, `priority-1`, `day-1`  
**Assignee:** @vince

**Description:**
Design basic wireframes for all core screens and establish visual design system.

**Tasks:**
- [ ] Sketch wireframes for 4 screens:
  - Home (stress check-in)
  - Break recommendation
  - Reflection prompt
  - History dashboard (if time allows)
- [ ] Define color palette (sage #7A9E7E, teal #3D8B8B, coral #D4715A, cream #F8F5EF)
- [ ] Choose typography (font sizes, weights)
- [ ] Design emoji scale visual treatment
- [ ] Create button styles (primary, secondary)
- [ ] Share Figma link or screenshots with team

**Acceptance Criteria:**
- [ ] All 4 screens have wireframes
- [ ] Color palette is documented
- [ ] Alex has design reference to build from

**Deadline:** End of Day 1

---

### Issue #3: [Data] Design Data Models & Storage Strategy

**Labels:** `data`, `priority-1`, `day-1`  
**Assignee:** @javin

**Description:**
Define data models for CheckIn and Reflection, and choose storage approach.

**Tasks:**
- [ ] Define CheckIn model schema:
  ```javascript
  {
    id: string (UUID),
    timestamp: string (ISO date),
    stressLevel: number (1-5),
    notes?: string
  }
  ```
- [ ] Define Reflection model schema:
  ```javascript
  {
    id: string (UUID),
    checkInId: string (foreign key),
    timestamp: string (ISO date),
    promptShown: string,
    userResponse?: "controllable" | "uncontrollable"
  }
  ```
- [ ] Choose storage: AsyncStorage (React Native) or in-memory (prototype)
- [ ] Create sample data (5-10 entries) for testing
- [ ] Document schema in `docs/DATA_MODELS.md`

**Acceptance Criteria:**
- [ ] Schemas are documented and approved by team
- [ ] Sample data is ready for testing
- [ ] Storage strategy is decided

**Deadline:** End of Day 1

---

### Issue #4: [Content] Write Let Them Theory Reflection Prompts

**Labels:** `content`, `priority-1`, `day-1`  
**Assignee:** @vince

**Description:**
Write 3-5 pre-written reflection prompts based on Let Them Theory framework.

**Tasks:**
- [ ] Write main prompt: "Was this stressor within your control?"
  - Yes option → "Great. Let me decide what to do about this."
  - No option → "That's not mine to carry. Let them."
- [ ] Write 2-3 additional prompts:
  - "Focus on what you can control. Let go of the rest."
  - "This feeling is temporary. What can I control right now?"
  - "What's one small action I can take?"
- [ ] Test prompts for tone (encouraging, not preachy)
- [ ] Share with team for feedback
- [ ] Save in `content/reflection-prompts.json`

**Acceptance Criteria:**
- [ ] 3-5 prompts written and approved
- [ ] JSON file ready for import into app

**Deadline:** End of Day 1

---

### Issue #5: [Feature] Build Stress Check-In Screen (Home)

**Labels:** `feature`, `priority-1`, `day-2`  
**Assignee:** @alex  
**Dependencies:** #1 (Setup), #2 (Design)

**Description:**
Build the home screen where users log their stress level with emoji scale.

**Tasks:**
- [ ] Create Home screen component
- [ ] Add "How are you feeling?" header
- [ ] Implement 5-level emoji scale:
  - 😊 (1 - Calm)
  - 🙂 (2 - Okay)
  - 😐 (3 - Mild)
  - 😟 (4 - Stressed)
  - 😰 (5 - Very Stressed)
- [ ] Make emojis tappable (single tap = submit)
- [ ] Add optional "What's on your mind?" text input (200 char max)
- [ ] Show confirmation message: "Check-in logged. Keep going!"
- [ ] Style per Vince's wireframes

**Acceptance Criteria:**
- [ ] User can tap any emoji
- [ ] Tapping emoji feels responsive (< 300ms)
- [ ] Confirmation message appears
- [ ] UI matches design system

**Deadline:** End of Day 2

---

### Issue #6: [Feature] Implement Check-In Data Storage

**Labels:** `feature`, `priority-1`, `day-2`  
**Assignee:** @alex, @javin  
**Dependencies:** #3 (Data Models), #5 (Check-In UI)

**Description:**
Save check-in data when user taps emoji.

**Tasks:**
- [ ] Create `saveCheckIn(stressLevel, notes?)` function
- [ ] Generate UUID for each check-in
- [ ] Store timestamp (ISO format)
- [ ] Save to AsyncStorage (or in-memory for prototype)
- [ ] Write `getCheckIns()` function to retrieve all entries
- [ ] Test: log 5 check-ins and verify they're saved
- [ ] Test: restart app and verify data persists (if AsyncStorage)

**Acceptance Criteria:**
- [ ] Check-ins are saved successfully
- [ ] Data includes: id, timestamp, stressLevel, notes
- [ ] Data persists (or is stored in session for prototype)
- [ ] No errors in console

**Deadline:** End of Day 2

---

### Issue #7: [Feature] Build Stress Evaluation Logic

**Labels:** `feature`, `priority-1`, `day-3`  
**Assignee:** @alex  
**Dependencies:** #5 (Check-In), #6 (Storage)

**Description:**
Evaluate stress level and trigger break recommendation if stress is high.

**Tasks:**
- [ ] Create `evaluateStress(level)` function:
  - 1-2 → return "low" (green indicator)
  - 3 → return "moderate" (yellow indicator)
  - 4-5 → return "high" (red indicator)
- [ ] Show visual indicator on confirmation screen
- [ ] If stress is high (4-5), automatically navigate to break screen
- [ ] If stress is low/moderate, stay on home screen
- [ ] Add 2-second delay before navigation (let user see confirmation)

**Acceptance Criteria:**
- [ ] Stress evaluation logic works correctly
- [ ] High stress (4-5) triggers break flow
- [ ] Low/moderate stress shows indicator but doesn't navigate
- [ ] Navigation feels smooth

**Deadline:** End of Day 3

---

### Issue #8: [Feature] Build Break Recommendation Screen

**Labels:** `feature`, `priority-1`, `day-4`  
**Assignee:** @alex  
**Dependencies:** #2 (Design), #7 (Evaluation)

**Description:**
Show break recommendation screen when high stress is detected.

**Tasks:**
- [ ] Create BreakRecommendation screen component
- [ ] Display message: "Let's take a quick break to reset"
- [ ] Show duration: "10-15 minutes"
- [ ] Add prominent "Start Break" button
- [ ] (Optional) Show mock available time: "Next opening: 2:30 PM"
- [ ] Style per Vince's wireframes
- [ ] Add navigation to reflection screen on button tap

**Acceptance Criteria:**
- [ ] Screen appears automatically after high stress check-in
- [ ] Message is clear and encouraging
- [ ] "Start Break" button is obvious and tappable
- [ ] Tapping button navigates to reflection screen

**Deadline:** End of Day 4

---

### Issue #9: [Feature] Build Guided Reflection Screen

**Labels:** `feature`, `priority-1`, `day-4`  
**Assignee:** @alex, @vince  
**Dependencies:** #4 (Prompts), #8 (Break Screen)

**Description:**
Show Let Them Theory reflection prompt after user starts break.

**Tasks:**
- [ ] Create Reflection screen component
- [ ] Load prompts from `content/reflection-prompts.json`
- [ ] Display random prompt (or main prompt: "Was this stressor within your control?")
- [ ] Add two response buttons:
  - "Yes, I can act" (controllable)
  - "No, let them" (uncontrollable)
- [ ] Show follow-up message based on response:
  - Yes → "Great. Let me decide what to do about this."
  - No → "That's not mine to carry. Let them."
- [ ] Add "Done" or "Back to Home" button
- [ ] Style per Vince's wireframes

**Acceptance Criteria:**
- [ ] Prompt is displayed clearly
- [ ] Both response options are tappable
- [ ] Correct follow-up message appears
- [ ] User can return to home screen

**Deadline:** End of Day 4

---

### Issue #10: [Feature] Save Reflection Responses

**Labels:** `feature`, `priority-1`, `day-5`  
**Assignee:** @alex, @javin  
**Dependencies:** #9 (Reflection UI), #6 (Storage)

**Description:**
Save user's reflection response and link it to the original check-in.

**Tasks:**
- [ ] Create `saveReflection(checkInId, promptShown, userResponse)` function
- [ ] Generate UUID for reflection
- [ ] Store timestamp
- [ ] Link to check-in via `checkInId`
- [ ] Save to AsyncStorage (or in-memory)
- [ ] Test: complete full flow (check-in → break → reflection)
- [ ] Verify reflection is saved with correct checkInId

**Acceptance Criteria:**
- [ ] Reflections are saved successfully
- [ ] Data includes: id, checkInId, timestamp, promptShown, userResponse
- [ ] Reflections are linked to correct check-ins
- [ ] No duplicate reflections for same check-in

**Deadline:** End of Day 5

---

### Issue #11: [Testing] End-to-End Flow Test

**Labels:** `testing`, `priority-1`, `day-5`  
**Assignee:** @javin  
**Dependencies:** All Priority 1 features

**Description:**
Test complete user flow from start to finish.

**Tasks:**
- [ ] Test flow: Open app → Log stress → See break → Start break → Complete reflection → Return home
- [ ] Test low stress (1-2): Should NOT trigger break
- [ ] Test moderate stress (3): Should NOT trigger break
- [ ] Test high stress (4-5): Should trigger break
- [ ] Test data persistence: Log check-in, restart app, verify data is still there
- [ ] Test on different devices/simulators if possible
- [ ] Document any bugs in separate issues

**Acceptance Criteria:**
- [ ] Full flow works without crashes
- [ ] All paths (low/moderate/high stress) work correctly
- [ ] Data persists between sessions
- [ ] Team agrees: "This is ready to demo"

**Deadline:** End of Day 5

---

## 📋 PRIORITY 2 — SHIP IF TIME (Days 6-7)

---

### Issue #12: [Feature] Build Stress History Dashboard

**Labels:** `feature`, `priority-2`, `day-6`  
**Assignee:** @alex, @javin  
**Dependencies:** #6 (Storage)

**Description:**
Show users their past check-ins in a list or chart view.

**Tasks:**
- [ ] Create History screen component
- [ ] Implement `getWeeklyCheckIns()` function (past 7 days)
- [ ] Display entries in list view:
  - Show: emoji, timestamp, stress level
  - Format: "😰 Very Stressed - Today, 2:30 PM"
- [ ] (Optional) Add simple chart (Victory Native or React Native Chart Kit)
- [ ] (Optional) Show stats: "3 high-stress moments this week"
- [ ] Add navigation to history from home screen (tab or button)

**Acceptance Criteria:**
- [ ] User can view past 7 days of check-ins
- [ ] List is sorted by date (newest first)
- [ ] Empty state shows: "No check-ins yet. Log your first one!"
- [ ] Navigation to/from history works smoothly

**Deadline:** End of Day 6 (if time allows)

---

### Issue #13: [Feature] Calculate Controllable vs Uncontrollable Ratio

**Labels:** `feature`, `priority-2`, `day-6`  
**Assignee:** @javin  
**Dependencies:** #10 (Reflection Storage), #12 (History)

**Description:**
Show users how many stressors were controllable vs. uncontrollable.

**Tasks:**
- [ ] Create `getReflectionStats()` function
- [ ] Count total reflections with responses
- [ ] Calculate ratio: controllable / total
- [ ] Display on history screen:
  - "This week: 2/5 stressors were within your control"
- [ ] Show insight: "Focus on what you can control. Let go of the rest."

**Acceptance Criteria:**
- [ ] Ratio is calculated correctly
- [ ] Display is clear and encouraging
- [ ] Handles edge case: 0 reflections with responses

**Deadline:** End of Day 6 (if time allows)

---

## 🎨 PRIORITY 3 — POLISH (Days 7-8)

---

### Issue #14: [Polish] UI/UX Refinement

**Labels:** `polish`, `priority-3`, `day-7`  
**Assignee:** @vince, @alex

**Description:**
Final visual pass to make everything feel polished.

**Tasks:**
- [ ] Consistent spacing across all screens
- [ ] Smooth transitions between screens
- [ ] Add subtle animations (emoji pop on tap, screen slides)
- [ ] Ensure color palette is consistent
- [ ] Check typography (sizes, weights, line heights)
- [ ] Test on different screen sizes
- [ ] Add loading states if needed
- [ ] Polish error messages

**Acceptance Criteria:**
- [ ] App feels professional and polished
- [ ] No visual bugs or misalignments
- [ ] Animations are smooth (not janky)
- [ ] Team agrees: "This looks good"

**Deadline:** Day 7

---

### Issue #15: [Demo] Prepare Screen Recording & Screenshots

**Labels:** `demo`, `priority-3`, `day-7`  
**Assignee:** @alex

**Description:**
Capture demo materials as backup for presentation.

**Tasks:**
- [ ] Record full demo flow (check-in → break → reflection → history)
- [ ] Keep video under 2 minutes
- [ ] Take screenshots of each screen:
  - Home (check-in)
  - Confirmation
  - Break recommendation
  - Reflection prompt
  - History (if built)
- [ ] Save to `demo/` folder in repo
- [ ] Upload to Google Drive as backup

**Acceptance Criteria:**
- [ ] Screen recording is smooth and clear
- [ ] Screenshots are high-quality (no pixelation)
- [ ] Files are accessible to team

**Deadline:** Day 7

---

### Issue #16: [Demo] Write Demo Script & Practice

**Labels:** `demo`, `priority-3`, `day-8`  
**Assignee:** @alex, @vince

**Description:**
Prepare talking points and practice live demo.

**Tasks:**
- [ ] Write demo script (what to say for each step)
- [ ] Time the demo (goal: under 3 minutes)
- [ ] Practice 5+ times
- [ ] Identify potential failure points
- [ ] Prepare backup plan (show screen recording if app crashes)
- [ ] Write answers to likely questions:
  - "How does it know when I'm stressed?" → Explain future biometric vision
  - "What's Let Them Theory?" → Explain controllable vs. uncontrollable
  - "Can this integrate with Microsoft Calendar?" → Yes, show Azure architecture

**Acceptance Criteria:**
- [ ] Demo can be completed in < 3 minutes
- [ ] Team is comfortable presenting live
- [ ] Backup plan is ready

**Deadline:** Day 8

---

### Issue #17: [QA] Final Bug Testing

**Labels:** `testing`, `priority-3`, `day-8`  
**Assignee:** @javin

**Description:**
Final round of testing to catch any remaining bugs.

**Tasks:**
- [ ] Test all user flows again
- [ ] Test edge cases:
  - No data in history
  - Very long notes (200+ chars)
  - Rapid tapping (double-submit prevention)
- [ ] Test on different devices (iOS and Android if possible)
- [ ] Document known limitations (what doesn't work?)
- [ ] Create "Known Issues" section in README

**Acceptance Criteria:**
- [ ] No critical bugs remain
- [ ] Known issues are documented
- [ ] Team is confident demo will work

**Deadline:** Day 8

---

## 📝 DOCUMENTATION

---

### Issue #18: [Docs] Update README with Setup Instructions

**Labels:** `documentation`, `day-1`  
**Assignee:** @alex

**Description:**
Write clear README so team (and future developers) can run the project.

**Tasks:**
- [ ] Add project description
- [ ] Document tech stack decision
- [ ] Write setup instructions:
  - Prerequisites (Node.js, Expo CLI, etc.)
  - Installation steps
  - How to run on simulator/emulator
- [ ] Add screenshots
- [ ] Link to design files, data models, etc.
- [ ] Add team credits

**Acceptance Criteria:**
- [ ] Anyone can clone repo and run project following README

**Deadline:** Day 1 (update as project evolves)

---

### Issue #19: [Docs] Document Architecture & Design Decisions

**Labels:** `documentation`, `day-8`  
**Assignee:** @javin

**Description:**
Document technical decisions for presentation Q&A.

**Tasks:**
- [ ] Create `docs/ARCHITECTURE.md`
- [ ] Document:
  - Why React Native vs. Figma (or vice versa)
  - Data storage approach
  - Why no external APIs in MVP
  - How full vision would use Azure
- [ ] Create diagram of data flow
- [ ] Link to storyboard for full architecture

**Acceptance Criteria:**
- [ ] Technical decisions are documented
- [ ] Team can reference this during Q&A

**Deadline:** Day 8

---

## 🚨 CONTINGENCY ISSUES (Only if needed)

---

### Issue #20: [Pivot] Figma Prototype Fallback

**Labels:** `contingency`, `priority-1`  
**Assignee:** @vince, @alex

**Description:**
IF React Native is too hard, pivot to Figma interactive prototype.

**Tasks:**
- [ ] Transfer wireframes to Figma prototype
- [ ] Create all 4 screens with full design
- [ ] Link screens with prototype interactions
- [ ] Test prototype flow
- [ ] Share prototype link for demo

**Trigger Condition:** React Native blockers > 4 hours on Day 2

**Deadline:** End of Day 3 (if triggered)

---

## Issue Import Instructions

**Option 1: Manual (Copy-Paste)**
1. Go to your GitHub repo → Issues tab
2. Click "New Issue"
3. Copy title and description from above
4. Add labels manually
5. Assign to team member
6. Repeat for all issues

**Option 2: GitHub CLI**
```bash
# Install GitHub CLI if needed
brew install gh

# Authenticate
gh auth login

# Create issues (example)
gh issue create --title "[Setup] Initialize Project" --body "..." --label "setup,priority-1" --assignee alex
```

**Option 3: Project Board**
1. Create GitHub Project
2. Add columns: Backlog, Day 1, Day 2-3, Day 4-5, Day 6-7, Day 8, Done
3. Move issues to appropriate columns
4. Use board view for daily standups

---

**Total Issues:** 20 (17 primary + 3 contingency)  
**Priority 1 (Must Ship):** 11 issues  
**Priority 2 (If Time):** 2 issues  
**Priority 3 (Polish):** 4 issues  
**Documentation:** 2 issues  
**Contingency:** 1 issue
