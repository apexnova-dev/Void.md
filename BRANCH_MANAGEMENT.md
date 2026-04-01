# Branch Management Guide

**For AI Assistants:** Read this file when working with branch merges, versioning, or deployment workflows.

---

## 🎯 What is Void.md?

Void.md is a local-first Kanban task manager that works with local Markdown files. It has no cloud dependency and runs entirely in the browser using the File System Access API.

---

## 🏗️ Three-Branch Architecture

Void.md uses a **three-branch strategy** to manage development, testing, and releases:

```
┌─────────────────────────────────────────────────────────────────────┐
│                        BRANCH HIERARCHY                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   experimental ──────────────► core ──────────────► production      │
│                                                                     │
│   ↑                              ↑                              ↑    │
│   │                              │                              │    │
│   │                              │                              │    │
│   │    • New features            │   • Bug fixes               │    │
│   │    • Testing ideas           │   • Development             │    │
│   │    • Breaking changes        │   • Daily work              │    │
│   │    • Experimental            │                              │    │
│   │                              │                              │    │
│   │                              │                              │    │
│   │   Version: 1.3.1-exp        │   Version: 1.3.1-core       │    │
│   │                              │                              │    │
│   │                              │                              │    │
│   │   "Testing new ideas"        │   "Working on features"      │    │
│   │                              │                              │    │
│   │                              │                              │    │
│   │                              │                              │    │
│   │                              │                              │    │
│   └──────────────────────────────┴──────────────────────────────┘    │
│                                                                     │
│                              production                              │
│                                                                     │
│                              Version: 1.3.1                          │
│                                                                     │
│                         "Stable & Ready"                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Branch Definitions

| Branch | Purpose | Who Uses It | Version | When to Merge |
|--------|---------|--------------|---------|---------------|
| `experimental` | **Testing ground** for new ideas, features that might fail, breaking changes | Developers testing concepts | `-exp` | When ready to share testing |
| `core` | **Primary development** for bug fixes and approved features | All developers | `-core` | When work is stable |
| `production` | **Stable releases** for end users | End users | *(none)* | When ready to ship |

---

## 🔄 How the Branches Work Together

### The Flow

```
    ┌─────────────┐
    │  IDEA       │  ← Someone has an idea
    └──────┬──────┘
           │
           ▼
    ┌─────────────┐
    │ EXPERIMENTAL │  ← Build it, test it, break it
    └──────┬──────┘
           │  When stable & approved
           ▼
    ┌─────────────┐
    │    CORE      │  ← Bug fixes & development
    └──────┬──────┘
           │  When ready to ship
           ▼
    ┌─────────────┐
    │ PRODUCTION  │  ← Live for users
    └─────────────┘
```

### Decision Rules

| Question | Answer | Action |
|----------|--------|--------|
| Is it a new experimental feature? | → | Build in `experimental` |
| Is it a bug fix? | → | Fix in `core` |
| Is it stable and ready for users? | → | Merge to `production` |
| Want to test something risky? | → | Use `experimental` |
| Is it a hotfix for production? | → | Fix in `core`, then sync |

### Version Suffix Rules

| Branch | Suffix | Example | Meaning |
|--------|--------|---------|---------|
| `production` | *(none)* | `v1.3.1` | Clean, official release |
| `core` | `-core` | `v1.3.1-core` | Development build |
| `experimental` | `-exp` | `v1.3.1-exp` | Experimental build |

---

## 🔄 Standard Merge Flow

```
experimental → core → production
```

**Never merge in reverse (production → core → experimental) except for critical hotfixes.**

### Step-by-Step Merge Checklist

#### 1. Merging TO core (from experimental or hotfixes)

```bash
git checkout core
git merge experimental  # or feature branch
# Fix any conflicts
git push origin core
```

**AI Checklist:**
- [ ] Resolve merge conflicts if any
- [ ] Run tests (if applicable)
- [ ] Verify BRANCH_SUFFIX is `-core`
- [ ] Commit and push

#### 2. Merging TO production (from core)

```bash
git checkout production
git merge core
# Fix any conflicts
```

**⚠️ IMPORTANT - Required Changes BEFORE pushing:**

1. **Update BRANCH_SUFFIX** in both files:
   - `void.html` line ~2520
   - `core-package/void.html` line ~2520

   ```javascript
   // CHANGE FROM:
   const BRANCH_SUFFIX = '-core';
   
   // TO:
   const BRANCH_SUFFIX = '';
   ```

2. **Commit the suffix change:**
   ```bash
   git add -A
   git commit -m "chore: set BRANCH_SUFFIX='' for production release"
   git push origin production
   ```

**AI Checklist:**
- [ ] Resolve merge conflicts
- [ ] **Update BRANCH_SUFFIX = '' in void.html**
- [ ] **Update BRANCH_SUFFIX = '' in core-package/void.html**
- [ ] Commit suffix change
- [ ] Push production

#### 3. Merging TO experimental (from core)

```bash
git checkout experimental
git merge core
```

**⚠️ IMPORTANT - Required Changes BEFORE pushing:**

1. **Update BRANCH_SUFFIX** in both files:
   - `void.html` line ~2520
   - `core-package/void.html` line ~2520

   ```javascript
   // CHANGE FROM:
   const BRANCH_SUFFIX = '-core';
   
   // TO:
   const BRANCH_SUFFIX = '-exp';
   ```

2. **Commit the suffix change:**
   ```bash
   git add -A
   git commit -m "chore: set BRANCH_SUFFIX='-exp' for experimental"
   git push origin experimental
   ```

---

## 📋 Bug Fix Sync Checklist

When fixing bugs, ALL THREE branches should receive the fix:

### Quick Sync (All Branches)

```bash
# 1. Fix on core (primary branch)
git checkout core
# Make your fix
git commit -m "fix: description"
git push origin core

# 2. Merge to production
git checkout production
git merge core
# Update BRANCH_SUFFIX = '' (see above)
git push origin production

# 3. Merge to experimental
git checkout experimental
git merge core
# Update BRANCH_SUFFIX = '-exp' (see above)
git push origin experimental

# 4. Return to core
git checkout core
```

### Files That Need Branch-Specific Updates

| File | What to Change | When |
|------|---------------|------|
| `void.html` | `BRANCH_SUFFIX` | Every merge |
| `core-package/void.html` | `BRANCH_SUFFIX` | Every merge |

### AI Prompt Template for Bug Fix Sync

```
"When syncing bug fixes across branches, I need you to:
1. Fix the bug on core branch
2. Merge to production (update BRANCH_SUFFIX to '')
3. Merge to experimental (update BRANCH_SUFFIX to '-exp')
4. Return to core branch"
```

---

## 🚀 Version Management

### Current Version
```
1.3.1
```

### Version Bump Workflow

When incrementing the version number (e.g., 1.3.1 → 1.3.2):

1. **Update `currentVersion`** in BOTH files:
   - `void.html` line ~2522
   - `core-package/void.html` line ~2522

   ```javascript
   let currentVersion = '1.3.2';
   ```

2. **Commit the version bump:**
   ```bash
   git commit -m "chore: bump version to 1.3.2"
   ```

3. **Sync to all branches** following the merge flow above.

### Version Display Format

| Branch | Display |
|--------|---------|
| production | `Void.md v. 1.3.1` |
| core | `Void.md v. 1.3.1-core` |
| experimental | `Void.md v. 1.3.1-exp` |

---

## 🔧 Quick Reference Commands

### Switch Branches
```bash
git checkout core      # Development
git checkout production # Stable release
git checkout experimental # Bleeding edge
```

### Check Current Branch
```bash
git branch --show-current
```

### View Branch Differences
```bash
git diff production..core  # What's in core but not production
```

### Force Sync All Branches
```bash
# Core is source of truth
git checkout core
git push --all origin
```

---

## ⚠️ Common Mistakes to Avoid

1. **Forgetting to update BRANCH_SUFFIX** before pushing
   - Production will show wrong version
   - Users may see "-core" or "-exp" in production

2. **Pushing without testing**
   - Always verify changes work before merging

3. **Merging in wrong order**
   - Standard: experimental → core → production
   - Never merge production → core (except for critical hotfixes)

4. **Leaving core with wrong suffix after merging**
   - After merging to production, set core back to `-core`
   - After merging to experimental, set core back to `-core`

---

## 🤖 AI Assistant Instructions

When asked to merge branches or deploy, always:

1. **Read this file first**
2. **Identify source and target branches**
3. **Follow the checklist for the target branch**
4. **Update BRANCH_SUFFIX in BOTH void.html files**
5. **Commit the suffix change separately**
6. **Verify the correct suffix after push**

### Example AI Task

**User:** "Merge the bug fix to production"

**AI Response:**
```
I'll sync the bug fix to production following the workflow:

1. ✅ Merge core to production
2. ⚠️ Update BRANCH_SUFFIX = '' in void.html and core-package/void.html
3. ✅ Commit suffix change
4. ✅ Push production
5. ✅ Return to core

Would you like me to proceed?
```

---

*Last updated: April 2026*
*Version: 1.3.1*
