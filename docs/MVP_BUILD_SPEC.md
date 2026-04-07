# Pulse Break — MVP Build Specification

**Team:** Alex Chian Hsieh, Vince Watson, Javin Vance  
**Timeline:** 7-8 days max (presentation prep starts Day 9)  
**Stack Decision:** Day 1 (React Native + Expo OR Figma prototype)

---

## Purpose

Build a working demo that shows users how to:
1. Recognize when they're stressed
2. Take an intentional break to reset
3. Use the Let Them Theory framework to manage stress

**This is a demo for the presentation, not a production app.**

---

## Core Features (Build Order)

### ✅ PRIORITY 1 — Must Ship (Days 2-5)

#### 1. Stress Check-In
**What:** Quick stress logging interface  
**How:**
- 5-level emoji scale: 😊 🙂 😐 😟 😰
- Single tap logs entry with timestamp
- Optional "What's on your mind?" text field (200 char max)
- Confirmation: "Check-in logged. Keep going!"

**Data stored:**
```javascript
{
  id: UUID,
  timestamp: ISO date,
  stressLevel: 1-5,
  notes?: string
}
```

**Owner:** Alex  
**Done when:** User can tap emoji and see confirmation in < 3 seconds

---

#### 2. Stress Evaluation
**What:** Simple rule-based logic  
**How:**
- 1-2 = Low stress (green indicator)
- 3 = Moderate (yellow)
- 4-5 = High stress (red) → triggers break flow

**Owner:** Alex  
**Done when:** High stress (4-5) automatically shows break screen

---

#### 3. Break Recommendation
**What:** Clear call-to-action when stress is high  
**How:**
- Message: "Let's take a quick break to reset"
- Duration: "10-15 minutes"
- Button: "Start Break"
- (Optional) Show mock available time: "Next opening: 2:30 PM"

**Owner:** Alex  
**Done when:** Tapping "Start Break" goes to reflection screen

---

#### 4. Guided Reflection (Let Them Theory)
**What:** Short mindset reset prompts  
**How:**
- Display after "Start Break" is tapped
- Pre-written prompts (rotate randomly):
  - "Was this stressor within your control?"
    - Yes → "Let me decide what to do about this."
    - No → "That's not mine to carry. Let them."
  - "Focus on what you can control. Let go of the rest."
  - "This feeling is temporary. What can I control right now?"

**Data stored:**
```javascript
{
  id: UUID,
  checkInId: UUID (links to check-in),
  timestamp: ISO date,
  promptShown: string,
  userResponse?: "controllable" | "uncontrollable"
}
```

**Owner:** Vince (prompts + UX) → Alex (implementation)  
**Done when:** User sees reflection after every break, response is saved

---

### 📋 PRIORITY 2 — Ship If Time (Days 6-7)

#### 5. Data Storage
**What:** Persist data between sessions  
**How:**
- React Native: AsyncStorage or Expo SecureStore
- Figma: Not applicable (prototype only)

**Owner:** Javin (schema design) → Alex (implementation)  
**Done when:** Data survives app restart

---

#### 6. Stress History Dashboard
**What:** Visual pattern tracking  
**How:**
- Simple list view OR basic chart (line/bar)
- Show past 7 days of check-ins
- Display: emoji + timestamp + stress level
- (Optional) Stats: "3 high-stress moments this week"

**Owner:** Javin (data queries) → Alex (UI)  
**Done when:** User can see their past week at a glance

---

## User Flow (Critical Path)

```
1. Open app
2. See "How are you feeling?" with emoji scale
3. Tap emoji (e.g., 😰 - Very Stressed)
4. App evaluates: "High stress detected"
5. See "Let's take a quick break" with "Start Break" button
6. Tap "Start Break"
7. See reflection prompt: "Was this stressor within your control?"
8. Choose Yes/No
9. See encouraging message
10. Return to home screen (or view history)
```

**This flow must work smoothly end-to-end by Day 5.**

---

## What We're NOT Building

- ❌ Smartwatch/biometric tracking
- ❌ AI/ML features
- ❌ Push notifications or reminders
- ❌ Real calendar integration (Microsoft Graph API)
- ❌ Manager notification system
- ❌ Multi-user accounts/authentication
- ❌ Cloud sync or backup

**Keep it simple. Demo quality, not production quality.**

---

## Tech Stack

### Option A: React Native + Expo (Functional App)
- **Pros:** Real app you can demo on device
- **Cons:** Higher complexity, more setup time
- **Timeline risk:** Medium
- **Best if:** Team has React Native experience

### Option B: Figma Interactive Prototype
- **Pros:** Faster to build, no code bugs
- **Cons:** Not a real app, limited interactivity
- **Timeline risk:** Low
- **Best if:** Tight on time or React Native struggles

**DECISION DEADLINE: End of Day 1**

---

## Quality Expectations

- **Easy to use:** No learning curve, 3 steps or less to start break
- **Responsive:** Taps/clicks feel instant (< 300ms)
- **Smooth flow:** No broken states between check-in → break → reflection
- **Demo-ready:** Screenshots + screen recording prepared by Day 8

---

## Definition of Done (MVP Complete)

The MVP is ready to present when:

✅ User can log stress level  
✅ High stress (4-5) triggers break suggestion  
✅ User can start break and see reflection prompt  
✅ Data is saved (at minimum in-memory for demo)  
✅ Flow works end-to-end without crashes  
✅ UI is clean and professional  
✅ Demo can be completed in < 3 minutes  

**Bonus (if time):**  
📋 History dashboard shows past check-ins  
📋 Data persists between app restarts  

---

## Success Criteria

**For the presentation:**
- Live demo works smoothly
- Audience sees the Let Them Theory in action
- Differentiator is clear: proactive + behavioral framework
- Team can answer questions about full vision (Azure architecture)

**For the team:**
- Everyone contributed meaningfully
- Shipped working software in 2 weeks
- Learned mobile dev or prototyping skills
- Ready to present with confidence

---

## Notes

- **AI-enhanced development:** Use Cursor, Copilot, Claude, or other AI tools to accelerate coding
- **Daily standups:** Quick sync at start of each day (10 min max)
- **Blockers:** Flag immediately in Slack/Discord, don't wait
- **Scope creep:** Ruthlessly cut features if timeline slips

---

**Next Steps:**
1. Create GitHub repo
2. Import issues from GITHUB_ISSUES.md
3. Make Day 1 tech stack decision
4. Start building!
