# AI Assistant Prompts — Pulse Break MVP

Use these prompts with Claude, ChatGPT, Cursor, or other AI coding assistants to accelerate development.

---

## How to Use This File

1. **Copy the entire prompt** (including context + task)
2. **Paste into your AI assistant** (Claude, ChatGPT, Cursor chat, etc.)
3. **Review the generated code** carefully
4. **Test the code** before committing
5. **Iterate** if needed ("Can you make X more responsive?")

---

## 🔴 PRIORITY 1 — Days 1-5

---

### Issue #1: Initialize Expo Project

**For:** Claude, ChatGPT, Cursor

```
I'm building a React Native app called Pulse Break using Expo. It's a stress management app for workplace wellness.

Can you help me:
1. Generate the exact terminal commands to initialize a new Expo project
2. Install these dependencies:
   - @react-navigation/native
   - @react-navigation/bottom-tabs
   - @react-native-async-storage/async-storage
   - react-native-paper (for UI components)
3. Set up a basic tab navigation structure with 3 tabs: Home, History, Settings
4. Create the folder structure: /screens, /components, /utils, /data

Please provide:
- Complete terminal commands
- Basic App.js with navigation setup
- Folder structure diagram
- Next steps for running on simulator

Tech stack: Expo SDK 51+, React Navigation 6+
```

---

### Issue #2: Design Color System

**For:** Claude, ChatGPT

```
I need to create a color system for my React Native app using these brand colors:

- Sage: #7A9E7E (primary)
- Teal: #3D8B8B (secondary)
- Coral: #D4715A (accent)
- Cream: #F8F5EF (background)
- Ink: #1C2B2B (text)

Can you create:
1. A theme.js file with all colors organized
2. Light/dark mode variants
3. Semantic color names (e.g., primary, secondary, success, error)
4. Typography scale (headings, body, labels)
5. Spacing scale (margin/padding values)

The app should feel calm and professional, targeting Gen Z professionals.
```

---

### Issue #5: Build Stress Check-In Screen

**For:** Claude, ChatGPT, Cursor

```
I'm building a stress check-in screen for a React Native app. 

Requirements:
- Header: "How are you feeling?"
- 5 emoji buttons in a row:
  - 😊 (Calm - level 1)
  - 🙂 (Okay - level 2)
  - 😐 (Mild - level 3)
  - 😟 (Stressed - level 4)
  - 😰 (Very Stressed - level 5)
- Each emoji should be large, tappable (44pt minimum)
- When tapped, show brief haptic feedback
- Optional text input below: "What's on your mind?" (200 char limit)
- Submit button appears after emoji is selected
- Color palette: sage #7A9E7E, teal #3D8B8B, coral #D4715A, cream #F8F5EF

Can you create:
1. Complete CheckInScreen.js component
2. Use React Navigation
3. Save data structure: { id: UUID, timestamp: ISO, stressLevel: 1-5, notes: string }
4. Navigate to confirmation screen after submit
5. Use React Native Paper for UI components

Please include TypeScript types if possible.
```

---

### Issue #6: Implement AsyncStorage for Check-Ins

**For:** Claude, ChatGPT

```
I need to implement local data storage for stress check-ins in React Native using AsyncStorage.

Data model:
```javascript
interface CheckIn {
  id: string;        // UUID
  timestamp: string; // ISO date
  stressLevel: number; // 1-5
  notes?: string;    // Optional
}
```

Can you create a data utility file (utils/storage.js) with these functions:

1. `saveCheckIn(stressLevel, notes?)` 
   - Generates UUID
   - Creates timestamp
   - Saves to AsyncStorage under key "check_ins"
   - Returns the saved checkIn object

2. `getAllCheckIns()`
   - Retrieves all check-ins
   - Returns array sorted by timestamp (newest first)
   - Returns empty array if none exist

3. `getWeeklyCheckIns()`
   - Returns check-ins from past 7 days
   - Filters by timestamp

4. `deleteCheckIn(id)`
   - Removes specific check-in by id

Please include:
- Error handling (try/catch)
- TypeScript types
- Comments explaining each function
- Example usage in a React component
```

---

### Issue #7: Build Stress Evaluation Logic

**For:** Claude, ChatGPT

```
I need a function that evaluates stress levels and determines what action to take.

Rules:
- Stress 1-2 = "low" (green) → Show encouraging message, stay on home
- Stress 3 = "moderate" (yellow) → Show mindfulness tip, stay on home
- Stress 4-5 = "high" (red) → Navigate to break recommendation screen

Can you create:

1. A utility function `evaluateStress(level)` that returns:
```javascript
{
  severity: "low" | "moderate" | "high",
  color: "#7A9E7E" | "#D4A055" | "#D4715A",
  action: "stay" | "recommend_break",
  message: string
}
```

2. A React component that:
   - Takes stress level as prop
   - Shows visual indicator (colored badge)
   - Displays appropriate message
   - Automatically navigates if severity is "high" (after 2 second delay)

3. Messages for each level:
   - Low: "You're doing great. Keep it up!"
   - Moderate: "Take a breath. You've got this."
   - High: "Let's take a quick break to reset."

Use React Navigation for navigation to BreakScreen.
```

---

### Issue #8: Build Break Recommendation Screen

**For:** Claude, ChatGPT, Cursor

```
I need to build a "Break Recommendation" screen in React Native that appears when stress is high.

Design requirements:
- Large icon or illustration (calming visual - maybe a coffee cup ☕)
- Headline: "Let's take a quick break to reset"
- Subtext: "A short pause can make a big difference"
- Duration recommendation: "10-15 minutes"
- Large primary button: "Start Break" (use coral #D4715A)
- Secondary button: "Not Now" (gray)
- Optional: Show mock available time "Next opening: 2:30 PM"

Can you create:
1. Complete BreakScreen.js component
2. Use React Native Paper or styled components
3. Add subtle entrance animation (fade in)
4. "Start Break" navigates to ReflectionScreen
5. "Not Now" goes back to HomeScreen
6. Color scheme: sage #7A9E7E, coral #D4715A, cream #F8F5EF

Please make it feel calm and inviting, not urgent or stressful.
```

---

### Issue #9: Build Let Them Theory Reflection Screen

**For:** Claude, ChatGPT

```
I need to build a reflection screen based on the "Let Them Theory" framework by Mel Robbins.

Concept: Help users distinguish between controllable vs. uncontrollable stressors.

Screen design:
- Main question (centered, large text): "Was this stressor something within your control?"
- Two large buttons:
  - "Yes, I can act" (green #7A9E7E)
  - "No, let them" (teal #3D8B8B)
- After selection, show follow-up message:
  - If "Yes": "Great. Let me decide what to do about this." + action prompt
  - If "No": "That's not mine to carry. Let them." + letting-go affirmation
- "Done" button to return home

Can you create:
1. ReflectionScreen.js component
2. State management for user selection
3. Conditional rendering for follow-up messages
4. Save reflection data:
```javascript
{
  id: UUID,
  checkInId: UUID, // Link to original check-in
  timestamp: ISO,
  promptShown: string,
  userResponse: "controllable" | "uncontrollable"
}
```
5. Smooth transitions between states
6. Calming color palette

The tone should be supportive and empowering, not judgmental.
```

---

### Issue #10: Save Reflection Responses

**For:** Claude, ChatGPT

```
I need to add data storage for reflection responses in my React Native app.

Add to utils/storage.js:

```javascript
interface Reflection {
  id: string;
  checkInId: string;      // Foreign key to CheckIn
  timestamp: string;
  promptShown: string;    // The question that was shown
  userResponse: "controllable" | "uncontrollable";
}
```

Functions needed:

1. `saveReflection(checkInId, promptShown, userResponse)`
   - Generates UUID and timestamp
   - Links to original check-in
   - Saves to AsyncStorage under key "reflections"
   - Returns saved reflection

2. `getReflectionsByCheckIn(checkInId)`
   - Returns all reflections for a specific check-in
   - Returns empty array if none

3. `getReflectionStats()`
   - Returns:
```javascript
{
  total: number,
  controllable: number,
  uncontrollable: number,
  ratio: number // controllable / total
}
```

4. Integration example: How to call these from ReflectionScreen component

Please include error handling and TypeScript types.
```

---

## 📋 PRIORITY 2 — Days 6-7

---

### Issue #12: Build History Dashboard

**For:** Claude, ChatGPT, Cursor

```
I need to build a stress history dashboard that shows past check-ins.

Features:
- Tab navigation item: "History"
- Last 7 days of check-ins displayed as list
- Each item shows: emoji, stress level label, timestamp, optional notes
- Format: "😰 Very Stressed - Today, 2:30 PM"
- Empty state: "No check-ins yet. Log your first one!"
- Optional: Simple bar or line chart showing daily average stress

Can you create:
1. HistoryScreen.js component
2. Use FlatList for performance with many items
3. Group by date (Today, Yesterday, April 4, etc.)
4. Pull data from AsyncStorage using getWeeklyCheckIns()
5. Simple stats card at top:
   - "This week: 12 check-ins"
   - "Average stress: Moderate"
   - "High stress moments: 3"

Color scheme: sage #7A9E7E, teal #3D8B8B, cream #F8F5EF

If adding a chart, use Victory Native or React Native Chart Kit.
```

---

### Issue #13: Calculate Controllable vs Uncontrollable Ratio

**For:** Claude, ChatGPT

```
I need to display insights about controllable vs uncontrollable stressors in my app.

Using the reflection data, create:

1. A component: `<StressorInsights />` that shows:
   - Total reflections this week
   - Ratio visualization (simple progress bar or pie chart)
   - Example: "This week: 2 out of 5 stressors were within your control (40%)"
   - Encouraging message based on ratio:
     - High controllable (>60%): "You're focusing on what you can change. Great work!"
     - Balanced (40-60%): "You're learning to recognize what's in your control."
     - High uncontrollable (>60%): "Remember: not everything is yours to carry."

2. Data structure:
```javascript
{
  week: {
    start: ISO date,
    end: ISO date
  },
  total: number,
  controllable: number,
  uncontrollable: number,
  ratio: number,
  insight: string
}
```

3. Add this component to HistoryScreen

Use the getReflectionStats() function from storage.js.
Colors: green #7A9E7E for controllable, teal #3D8B8B for uncontrollable
```

---

## 🎨 PRIORITY 3 — Polish

---

### Issue #14: Add Animations & Transitions

**For:** Claude, ChatGPT

```
I want to add subtle animations to make my React Native app feel polished.

Can you help me add:

1. Screen transitions (use React Navigation animations):
   - Fade in when opening new screens
   - Slide from bottom for modals

2. Emoji tap feedback:
   - Scale up slightly on press (1.0 → 1.1)
   - Haptic feedback on selection
   - Use React Native's Animated API or Reanimated

3. List item animations (History screen):
   - Stagger animation when items appear
   - Subtle slide-in from right

4. Button press states:
   - Scale down slightly when pressed (1.0 → 0.95)
   - Color change on press

Please provide:
- Example code for each animation
- Performance considerations (use native driver where possible)
- Keep animations subtle (under 300ms duration)

Goal: Make it feel responsive and delightful, not distracting.
```

---

## 🔧 UTILITY PROMPTS

---

### Generate Sample Data

**For:** Claude, ChatGPT

```
I need sample data for testing my stress tracking app.

Generate:
1. 20 realistic check-ins spread over past 7 days
2. Mix of stress levels (more moderate/low than high)
3. Realistic timestamps (workday hours, 9am-6pm)
4. Some with notes, some without
5. Corresponding reflections for high-stress check-ins

Output as:
- JSON file I can import
- Function to seed AsyncStorage with this data
- Include variety: morning stress, afternoon lulls, end-of-day fatigue

Data should tell a story of a realistic work week.
```

---

### Debug AsyncStorage Issues

**For:** Claude, ChatGPT

```
I'm having issues with AsyncStorage in React Native. The data isn't persisting.

Here's my code:
[paste your code]

Can you:
1. Review for common AsyncStorage mistakes
2. Check if I'm awaiting promises correctly
3. Verify JSON.stringify/parse usage
4. Add better error handling
5. Suggest debugging steps

Also explain: How can I view AsyncStorage data in Expo/React Native debugger?
```

---

### Create TypeScript Types

**For:** Claude, ChatGPT

```
Convert my JavaScript React Native app to TypeScript.

I have these data models:
- CheckIn: { id, timestamp, stressLevel, notes }
- Reflection: { id, checkInId, timestamp, promptShown, userResponse }

Can you:
1. Create comprehensive TypeScript interfaces
2. Add types to navigation (React Navigation typed navigation)
3. Type the storage utility functions
4. Type React components (props, state)
5. Configure tsconfig.json for React Native

Please provide migration steps and common type errors to watch for.
```

---

## 💡 TIPS FOR USING AI ASSISTANTS

### Getting Better Results

1. **Be specific about constraints**
   ```
   ✅ "Build this with React Native Paper, no custom styling"
   ❌ "Make it look good"
   ```

2. **Provide context**
   ```
   ✅ "This is for Gen Z professionals who are stressed at work"
   ❌ "Build a form"
   ```

3. **Request multiple options**
   ```
   ✅ "Give me 3 different ways to visualize this data"
   ❌ "Show the data"
   ```

4. **Iterate in small steps**
   ```
   ✅ First: "Build the UI", Then: "Add data fetching", Finally: "Add error handling"
   ❌ "Build the entire feature"
   ```

5. **Ask for explanations**
   ```
   ✅ "Explain why you chose this pattern"
   ❌ Just accept the code
   ```

---

## 🚨 IMPORTANT REMINDERS

**Always:**
- Review AI-generated code before committing
- Test functionality manually
- Check for security issues (especially with data storage)
- Verify AsyncStorage best practices
- Test on actual device, not just simulator

**Never:**
- Blindly copy-paste without understanding
- Skip error handling
- Ignore TypeScript warnings
- Commit untested code
- Assume AI knows your specific app state

---

## 📚 SUGGESTED WORKFLOW

### For Each Issue:

1. **Read the issue requirements** in GITHUB_ISSUES.md
2. **Copy the relevant prompt** from this file
3. **Customize with your specific needs**
4. **Paste into Claude/ChatGPT**
5. **Review the generated code**
6. **Ask follow-up questions** if unclear
7. **Test the code** in your app
8. **Iterate** until it meets acceptance criteria
9. **Commit** and close the issue

### Example Session:

```
You: [paste Issue #5 prompt]

AI: [generates CheckInScreen.js code]

You: "Can you make the emojis bigger? At least 60pt"

AI: [updates code]

You: "Add haptic feedback when emoji is tapped"

AI: [adds Haptic.impactAsync()]

You: "Perfect! Now explain how the data flows from this screen to storage"

AI: [explains the flow]

You: [test, commit, close issue]
```

---

**Pro tip:** Use Claude for complex logic and architecture questions. Use ChatGPT for quick code generation and debugging. Use Cursor for inline code suggestions while typing.
