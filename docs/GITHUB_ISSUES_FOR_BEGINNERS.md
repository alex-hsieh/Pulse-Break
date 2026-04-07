# GitHub Issues for Beginners — Pulse Break

**For:** Vince, Javin, and anyone new to GitHub

This is a **simple guide** to help you use GitHub Issues to track our work. No previous experience needed!

---

## What Are GitHub Issues? (In Plain English)

Think of GitHub Issues like a **to-do list** for our project.

- Each **Issue** = one task (like "Build the home screen")
- We can **assign** tasks to people (so everyone knows who does what)
- We can **check them off** when done
- We can **comment** on them to ask questions or share updates

**That's it.** It's just a fancy to-do list.

---

## Why Are We Using This?

Because we have **7-8 days** to build an MVP and **3 people** working together.

GitHub Issues help us:
- ✅ Know what needs to be done
- ✅ Know who's doing what
- ✅ Track our progress
- ✅ Stay accountable (we can see what everyone finished)

---

## Step 1: How to See Our Issues

1. **Go to our GitHub repository** (the link Alex will share)
2. **Click the "Issues" tab** at the top (between "Code" and "Pull Requests")
3. **You'll see a list** of all our tasks

That's it! You're now looking at our to-do list.

---

## Step 2: Understanding an Issue

Each issue has:

### **Title** (what the task is)
Example: `[Feature] Build Stress Check-In Screen`

### **Labels** (tags to organize tasks)
- `priority-1` = Must finish (red label)
- `priority-2` = Nice to have (yellow label)  
- `day-1`, `day-2`, etc. = When to do it
- `feature`, `design`, `testing` = What type of task

### **Assignee** (who's responsible)
Example: "Assigned to @alex"

### **Description** (what needs to be done)
Example: "Build the home screen where users select an emoji"

### **Checklist** (smaller steps)
Example:
```
- [ ] Create screen component
- [ ] Add emoji buttons
- [ ] Test on phone
```

---

## Step 3: How to Work on an Issue

### When you're ready to work on a task:

1. **Find your issue** (look for ones assigned to you)
2. **Read the description** (understand what needs to be done)
3. **Start working** (build the feature, design the screen, etc.)
4. **Check off items** as you complete them:
   - Click "Edit" on the issue
   - Add an `x` inside the brackets: `- [x] Create screen component`
   - Click "Update comment"
5. **Add comments** if you have questions or updates:
   - Scroll to bottom of issue
   - Type in the comment box: "Hey team, I finished the design!"
   - Click "Comment"

---

## Step 4: How to Close an Issue (Mark as Done)

When you finish ALL the tasks in an issue:

1. **Scroll to the bottom** of the issue
2. **Click the green "Close issue" button**
3. **That's it!** The issue moves to "Closed" and we know it's done

---

## Step 5: How to Create a New Issue (If Needed)

Sometimes you might need to add a task that's not on our list:

1. **Go to Issues tab**
2. **Click green "New issue" button** (top right)
3. **Fill in:**
   - **Title:** Short description (e.g., "Fix bug with emoji not saving")
   - **Description:** What needs to be done
   - **Assignees:** Click the gear icon → select your name
   - **Labels:** Click gear icon → select appropriate labels
4. **Click "Submit new issue"**

---

## Quick Reference: Our Labels Explained

| Label | What It Means | Priority |
|-------|---------------|----------|
| `priority-1` 🔴 | Must finish by Day 5 | HIGH |
| `priority-2` 📋 | Nice to have if time | MEDIUM |
| `priority-3` 🎨 | Polish/extras | LOW |
| `day-1` | Do this on Day 1 | — |
| `day-2` | Do this on Day 2 | — |
| `feature` | Building something new | — |
| `design` | Visual/UX work | — |
| `testing` | QA and bug checking | — |
| `setup` | Initial project setup | — |

---

## Our Project Board (Optional but Helpful)

We can also use a **Project Board** to visualize our work:

### What it looks like:
```
┌─────────┬─────────┬─────────┬──────┐
│ Backlog │ Day 1   │ Day 2-3 │ Done │
├─────────┼─────────┼─────────┼──────┤
│ Issue 1 │ Issue 2 │ Issue 5 │ ✓    │
│ Issue 3 │ Issue 4 │         │ ✓    │
└─────────┴─────────┴─────────┴──────┘
```

### How to set it up (Alex will do this):
1. Go to **Projects** tab
2. Create new project: "Pulse Break MVP"
3. Add columns: Backlog, Day 1, Day 2-3, Day 4-5, Day 6-7, Day 8, Done
4. Drag issues into columns as we work

### How to use it:
- **Move issues** from left to right as you progress
- **See at a glance** what everyone's working on
- **Daily standup:** Look at the board together

---

## Daily Workflow (Keep It Simple)

### Every Morning (10 min standup):
1. **Look at GitHub Issues** assigned to you
2. **Update the team:**
   - "Yesterday I finished Issue #5"
   - "Today I'm working on Issue #8"
   - "I'm stuck on the emoji button styling"
3. **Check off** completed tasks from yesterday
4. **Start working** on today's issue

### During the Day:
- **Comment on issues** if you have updates or questions
- **Tag teammates** if you need help: "@alex can you review this?"
- **Check off tasks** as you finish them

### End of Day (5 min):
- **Update issue checklists** with your progress
- **Close issues** that are 100% done
- **Comment** if something is almost done: "90% complete, just need to test"

---

## Common Questions

### "What if I don't know how to do my assigned issue?"
**Ask for help!** 
- Comment on the issue: "@alex I'm not sure how to start this"
- Or use AI_PROMPTS.md — it has ready-to-use prompts for Claude/ChatGPT
- Or ask in our team Slack/Discord

### "What if my issue is taking longer than expected?"
**That's okay!** Just update the team:
- Comment on the issue: "This is taking longer than expected, might need until tomorrow"
- We can reassign or simplify if needed

### "What if I finish early?"
**Great!**
- Look for other `priority-1` issues that need help
- Ask: "What can I help with?"
- Or start a `priority-2` issue

### "Can I work on issues not assigned to me?"
**Yes!** Just:
- Comment first: "Can I take this one?"
- Wait for Alex to confirm
- Then assign yourself and start

### "What if I find a bug?"
**Create a new issue:**
- Title: `[Bug] Emoji button doesn't save data`
- Description: What's wrong, how to reproduce it
- Label: `bug`, `priority-1` (if critical)
- Assign to whoever can fix it (or yourself)

---

## Example: Walking Through Issue #5

Let's walk through one issue together:

### **Issue #5: Build Stress Check-In Screen**

**What you see:**
```
Title: [Feature] Build Stress Check-In Screen
Labels: feature, priority-1, day-2
Assigned to: @alex
Due: End of Day 2

Description:
Build the home screen where users log their stress level with emoji scale.

Tasks:
- [ ] Create Home screen component
- [ ] Add "How are you feeling?" header
- [ ] Implement 5-level emoji scale (😊 🙂 😐 😟 😰)
- [ ] Make emojis tappable
- [ ] Add optional text input
- [ ] Show confirmation message
- [ ] Style per design

Acceptance Criteria:
- [ ] User can tap any emoji
- [ ] Confirmation appears
- [ ] UI matches design
```

### **How Alex would work on this:**

**Day 2 morning:**
1. Open Issue #5
2. Read the description
3. Look at AI_PROMPTS.md for the ready-to-use prompt
4. Copy prompt → paste into Claude
5. Get the code
6. Start building

**During the day:**
- Finishes creating the component → checks off: `[x] Create Home screen component`
- Adds emojis → checks off: `[x] Implement 5-level emoji scale`
- Comments: "Making good progress, should finish by EOD"

**End of day:**
- All tasks are checked off
- Takes screenshot, adds to issue comments
- Closes the issue with comment: "✅ Done! Ready for testing"
- Team sees it's complete

---

## Tips for Success

### ✅ **DO:**
- Check GitHub Issues every morning
- Update your issues daily (check off tasks, add comments)
- Ask for help when stuck
- Close issues when done
- Celebrate wins! (add 🎉 emoji when you finish something)

### ❌ **DON'T:**
- Leave issues unupdated for days
- Work on things without creating/claiming an issue
- Be afraid to ask questions in comments
- Skip the daily standup

---

## Still Confused?

**That's totally okay!** Here's what to do:

1. **Ask Alex** to walk you through it (5 minute screen share)
2. **Watch a YouTube video:** Search "GitHub Issues tutorial for beginners"
3. **Start simple:** Just read issues, check off tasks, add comments
4. **Learn by doing:** You'll get it after Day 1

---

## TL;DR (Too Long, Didn't Read)

**GitHub Issues = Fancy To-Do List**

**Your daily routine:**
1. Morning: Check issues assigned to you
2. Work: Build stuff, check off tasks as you go
3. Evening: Update what you finished
4. Done? Close the issue

**That's it!** 

Now go to our GitHub repo, click "Issues" tab, and see our to-do list. You got this! 🚀

---

**Questions?** Ask Alex or drop a comment on any issue.
