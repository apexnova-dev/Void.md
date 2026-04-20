# Branch Management Guide

**For AI Assistants:** Read this file when working with branch merges, versioning, or deployment workflows.

---

## 🎯 What is Void.md?

Void.md is a local-first Kanban task manager that works with local Markdown files. It has no cloud dependency and runs entirely in the browser using the File System Access API.

---

## 🏗️ Three-Branch Architecture

Void.md uses a **three-branch strategy** representing engine + two skin releases:

```
┌─────────────────────────────────────────────────────────────────────┐
│                        BRANCH HIERARCHY                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌──────────────────┐        ┌──────────────────┐                   │
│   │  EXPERIMENTAL    │        │   PRODUCTION    │                    │
│   │                  │        │                  │                   │
│   │  • New features  │        │  • Stable       │                   │
│   │  • Testing      │        │    release      │                   │
│   │  • New ideas   │        │  • Production   │                   │
│   │    (may break) │        │    skin         │                   │
│   │                  │        │                  │                   │
│   │  Version: -exp  │        │  Version: (none) │                   │
│   │                  │        │                  │                   │
│   │  "Testing"     │        │  "Production"  │                   │
│   └────────┬───────┘        └────────┬───────┘                   │
│            │                          │                             │
│            │   (most changes)       │   (most changes)           │
│            ▼                          ▼                             │
│   ┌──────────────────────────────────────────────────┐               │
│   │                      CORE                         │               │
│   │                                                  │               │
│   │  • Engine / core kanban functionality           │               │
│   │  • Base kanban (no branding, no skin)           │               │
│   │  • Bug fixes for the engine                     │               │
│   │  • Changes rarely (mostly complete)            │               │
│   │                                                  │               │
│   │  Version: -core                                  │               │
│   │                                                  │               │
│   │  "Engine / Lite"                                │               │
│   │                                                  │               │
│   └──────────────────────────────────────────────────┘               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Branch Definitions

| Branch | Purpose | Role | Version Suffix | When to Use |
|--------|---------|------|----------------|-------------|
| `core` | **Engine** — core kanban functionality | Base engine + "lite" release | `-core` | Bug fixes or engine modifications (rare) |
| `production` | **Stable release** | Core + production skin | *(none)* | End users |
| `experimental` | **Testing ground** | Core + experimental skin | `-exp` | Testing new features |

### Three Ways to Think About Core

1. **Engine** — The core kanban functionality that makes the app work
2. **Lite** — A minimal release for users who want just the basics
3. **Reference** — Mostly static, only touched when engine needs fixing

---

## 🔄 Branch Relationships

### Relationship Diagram

```
                    ┌─────────────────┐
                    │     IDEA        │  ← New feature or idea
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  EXPERIMENTAL    │
                    │                 │
                    │  Build & test   │
                    │  new feature    │
                    └────────┬────────┘
                             │
                             │  Feature ready?
                             ▼
                    ┌─────────────────┐
                    │   PRODUCTION    │  ← Direct merge (no core touch)
                    │                 │
                    │  Release to     │
                    │  users         │
                    └─────────────────┘
```

### Engine Bug/Modification Flow

```
                    ┌─────────────────┐
                    │     ISSUE       │  ← Bug in engine or core modification
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  EXPERIMENTAL    │
                    │                 │
                    │  Test fix first  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │      CORE       │  ← Only for engine changes
                    │                 │
                    │  Update engine  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   PRODUCTION    │
                    │                 │
                    │  Get engine fix │
                    └─────────────────┘
```

---

## 📋 Decision Rules

| Question | Answer | Action |
|----------|--------|--------|
| Is it a **new feature**? | → | direct: `experimental → production` |
| Is it an **engine bug fix**? | → | `experimental → core → production` |
| Is it a **core modification**? | → | `experimental → core → production` |
| Want to test something **risky**? | → | `experimental` only |
| Is core already stable? | → | Skip core, go direct |

### Quick Reference

| Change Type | Flow |
|-------------|------|
| New feature | experimental → production (direct) |
| Bug fix (engine) | experimental → core → production |
| Core modification | experimental → core → production |

---

## 🔄 Merge Flows

### Flow 1: Features (Direct)

**Most common.** Features go experimental → production without touching core.

```
experimental → production (direct)
```

```bash
# 1. Stay on experimental or merge feature branch to experimental
git checkout experimental
git merge feature/my-new-feature
# Test thoroughly

# 2. Merge to production (direct)
git checkout production
git merge experimental

# 3. Update BRANCH_SUFFIX
# Update void.html and core-package/void.html:
# Change BRANCH_SUFFIX from '-core' to ''

# 4. Commit and push
git add -A
git commit -m "chore: set BRANCH_SUFFIX='' for production release"
git push origin production

# 5. Return to experimental
git checkout experimental
```

### Flow 2: Engine Changes (Via Core)

**Rare.** Only when core/engine needs fixing or modification.

```
experimental → core → production
```

```bash
# 1. Fix in experimental first
git checkout experimental
# Make your fix
git commit -m "fix: engine issue description"

# 2. Merge to core
git checkout core
git merge experimental
git commit -m "fix: engine issue description"
git push origin core

# 3. Merge to production
git checkout production
git merge core
# Update BRANCH_SUFFIX to ''

# 4. Push
git push origin production

# 5. Sync experimental back to core
git checkout experimental
git merge core
# Update BRANCH_SUFFIX back to '-exp'
git push origin experimental
```

---

## ⚠️ Important: BRANCH_SUFFIX

Every merge **TO production** requires updating BRANCH_SUFFIX in BOTH files:

| File | Line ~ | Change |
|------|--------|--------|
| `void.html` | 2520 | `BRANCH_SUFFIX` = '' for production |
| `core-package/void.html` | 2520 | `BRANCH_SUFFIX` = '' for production |

### BRANCH_SUFFIX Values

| Branch | Value | Example Display |
|--------|-------|-----------------|
| production | `''` (empty) | `Void.md v. 1.3.1` |
| core | `'-core'` | `Void.md v. 1.3.1-core` |
| experimental | `'-exp'` | `Void.md v. 1.3.1-exp` |

---

## 🔧 Quick Reference Commands

### Switch Branches
```bash
git checkout core          # Engine work (rare)
git checkout production   # Release
git checkout experimental # Development/testing
```

### Check Current Branch
```bash
git branch --show-current
```

### View Differences
```bash
git diff production..experimental   # What's different
git log --oneline -5               # Recent history
```

---

## 🚀 Version Management

### Current Version
```
1.3.1
```

### Version Bump Workflow

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

3. **Push to appropriate branch:**
   - Feature: experimental → production
   - Engine fix: experimental → core → production

---

## ⚠️ Common Mistakes to Avoid

1. **Touching core for features**
   - Features: experimental → production (direct)
   - Only use core for engine bugs/modifications

2. **Forgetting BRANCH_SUFFIX**
   - Always update before pushing to production
   - Check both void.html files

3. **Merging in reverse**
   - Don't merge production → core or production → experimental
   - Except for critical hotfixes

4. **Skipping testing**
   - Always verify in experimental before production

---

## 🤖 AI Assistant Instructions

When asked to merge or deploy:

1. **Read this file first**
2. **Determine the change type** (feature vs engine fix)
3. **Choose the correct flow** (direct vs via core)
4. **Update BRANCH_SUFFIX** in BOTH files if merging to production
5. **Verify after push**

### Example: New Feature

**User:** "Ship the new filter feature to production"

**AI Response:**
```
I'll merge the feature to production (direct flow):

1. ✅ Merge to production (experimental → production)
2. ⚠️ Update BRANCH_SUFFIX = '' in void.html and core-package/void.html
3. ✅ Commit suffix change
4. ✅ Push production
5. ✅ Return to experimental

Is this correct?
```

### Example: Engine Bug Fix

**User:** "Fix the drag-drop bug and ship it"

**AI Response:**
```
I'll fix the engine bug (via core flow):

1. ✅ Fix in experimental first
2. ✅ Merge to core (experimental → core)
3. ✅ Merge to production (core → production)
4. ⚠️ Update BRANCH_SUFFIX = '' in both files
5. ✅ Commit and push
6. ✅ Sync experimental back to core
7. ✅ Return to experimental

Is this correct?
```

---

## 📝 Summary

| When | Flow |
|------|------|
| New feature | experimental → production (direct) |
| Engine bug fix | experimental → core → production |
| Core modification | experimental → core → production |
| Risky test | experimental only |

**Core is mostly static. Most changes go direct.**

---

*Last updated: April 2026*
*Version: 1.3.1*