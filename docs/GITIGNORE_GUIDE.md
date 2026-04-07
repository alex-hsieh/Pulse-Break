# What is .gitignore? (For Beginners)

## In Simple Terms

**.gitignore** tells Git which files to **NOT upload** to GitHub.

Think of it like this: You're packing for a trip. You don't pack dirty laundry, trash, or personal stuff you don't want others to see. .gitignore is your "don't pack this" list.

---

## Why Do We Need This?

**Without .gitignore:**
- Your repo would be HUGE (node_modules alone is 100+ MB)
- You'd upload passwords and API keys (security risk!)
- Team members' personal settings would conflict
- Build files would clutter the repo

**With .gitignore:**
- Repo stays small and fast
- No secrets leaked
- Everyone's personal setup stays personal
- Only real code gets uploaded

---

## What We're Ignoring (Explained)

### 🚫 node_modules/
**Why:** This folder has 1000s of files (100+ MB). Everyone downloads their own copy when they run `npm install`.
**Don't worry:** Your code still works! npm recreates this folder automatically.

### 🚫 .env files
**Why:** These contain API keys and secrets. NEVER upload these to GitHub!
**Instead:** Each person creates their own `.env` file locally.

### 🚫 .DS_Store, Thumbs.db
**Why:** These are Mac/Windows system files that have nothing to do with your code.
**Nobody needs these:** They just clutter the repo.

### 🚫 Build files (ios/build/, android/app/build/)
**Why:** These are generated files. They're recreated every time you build the app.
**Save space:** No need to store 100MB+ of build artifacts.

### 🚫 .vscode/, .idea/
**Why:** These are your personal editor settings.
**Everyone's different:** Let each person set up their IDE how they like.

### 🚫 *.log files
**Why:** Debug logs are temporary and personal.
**Clean repo:** Nobody needs to see your error logs from yesterday.

---

## How to Use It

### Step 1: Create the File

```bash
# In your project root folder
touch .gitignore

# Or just create it in your code editor
# File → New → Name it ".gitignore"
```

**Important:** The filename starts with a dot (`.gitignore`), not `gitignore.txt`.

### Step 2: Copy Our Template

Copy the contents from our `.gitignore` file (in this repo) and paste it into your `.gitignore` file.

### Step 3: Commit It

```bash
git add .gitignore
git commit -m "Add .gitignore"
git push
```

**That's it!** Git will now ignore all the files listed.

---

## Common Questions

### "What if I already committed node_modules by accident?"

**Fix it:**
```bash
# Remove from Git but keep locally
git rm -r --cached node_modules/

# Commit the removal
git commit -m "Remove node_modules from repo"
git push

# Now it's ignored
```

### "Can I see what's being ignored?"

**Yes:**
```bash
# See all ignored files
git status --ignored
```

### "What if I WANT to commit an ignored file?"

**Force it:**
```bash
# Add a specific file even if it's ignored
git add -f path/to/file.txt

# Or edit .gitignore and remove that rule
```

### "What's that # symbol?"

Those are **comments** — just explanations for humans. Git ignores lines starting with `#`.

### "What if I want to ignore my personal TODO.md?"

**Add it to .gitignore:**
```bash
# Personal notes
TODO.md
NOTES.md
```

Now Git ignores those files.

---

## Testing Your .gitignore

### Before Committing, Check:

```bash
# See what files Git is tracking
git status

# You should NOT see:
# - node_modules/
# - .env
# - .DS_Store
# - build folders
# - .log files
```

### If You See Ignored Files:

1. Make sure `.gitignore` is in your **root folder** (not in a subfolder)
2. Make sure the filename is exactly `.gitignore` (with the dot!)
3. Try: `git rm -r --cached .` then `git add .` to refresh Git's cache

---

## Our .gitignore Sections (Quick Reference)

| Section | What It Ignores | Why |
|---------|----------------|-----|
| **Node.js** | node_modules/, package-lock.json | Huge, auto-generated |
| **Expo** | .expo/, dist/, web-build/ | Build artifacts |
| **iOS/Android** | build folders, .apk, .ipa | Generated files |
| **Secrets** | .env, *.key, secrets.json | Security! Never upload these |
| **IDEs** | .vscode/, .idea/, .cursor/ | Personal settings |
| **OS** | .DS_Store, Thumbs.db | System junk |
| **Logs** | *.log, npm-debug.log | Temporary debug files |

---

## Golden Rules

✅ **DO commit:**
- Source code (.js, .jsx, .ts, .tsx)
- Configuration files (package.json, app.json)
- Documentation (.md files)
- Assets (images, fonts - unless too large)
- .gitignore itself!

❌ **DON'T commit:**
- Dependencies (node_modules/)
- Secrets (.env, API keys)
- Build outputs (dist/, build/)
- Personal settings (.vscode/, .idea/)
- System files (.DS_Store)
- Logs (*.log)

---

## When Something Goes Wrong

### "I committed .env by accident!"

**URGENT FIX:**
```bash
# Remove from Git history (DANGEROUS - only if caught immediately)
git rm --cached .env
git commit -m "Remove .env from tracking"
git push

# If it's been pushed, you need to:
# 1. Change all passwords/API keys in that .env
# 2. Consider the secrets compromised
```

### "My .gitignore isn't working!"

**Debug:**
```bash
# 1. Check if file is already tracked
git ls-files | grep "filename"

# 2. If it shows up, remove it:
git rm --cached filename

# 3. Commit the removal
git commit -m "Remove tracked file"
```

### "I can't see .gitignore in my folder!"

**Mac/Linux:**
```bash
# Show hidden files (files starting with .)
ls -la
```

**Windows:**
- View → Show → Hidden Items (checkbox)

**VSCode:**
- It should show automatically in file explorer

---

## Pro Tips

### 1. Use Global .gitignore for Personal Stuff

```bash
# Create a global ignore file
git config --global core.excludesfile ~/.gitignore_global

# Add your personal preferences to ~/.gitignore_global
# Now ALL your Git repos ignore those files
```

**Good for:**
- Your editor's temp files
- macOS .DS_Store
- Your personal scratch notes

### 2. Add .env.example

**Instead of:**
```
# .gitignore
.env
```

**Do this:**
```
# .gitignore
.env

# But commit this:
.env.example
```

**.env.example:**
```
# Example environment variables
API_KEY=your_api_key_here
DATABASE_URL=your_database_url_here
```

Now teammates know what environment variables they need!

### 3. Check Before You Commit

```bash
# See what you're about to commit
git status

# See the actual changes
git diff

# Only commit when it looks right
git add .
git commit -m "Add feature"
```

---

## TL;DR

1. **.gitignore** = "Don't upload these files" list
2. **Copy our template** into your project root
3. **Commit it** so everyone uses the same rules
4. **Never commit secrets** (.env, API keys)
5. **If you mess up**, you can remove files from Git with `git rm --cached`

**Questions?** Ask in Slack or Google "git ignore <filename>"

---

**Remember:** When in doubt, don't commit it. You can always add files later, but removing them from Git history is a pain! 🛡️
