# Branching and Bugfix Workflow

This document explains how to manage fixes across the three long-lived branches in this repo: `core`, `production`, and `experimental`. It also captures common pitfalls when working with multiple branches so you can refresh yourself later.

---

## 1. Branch roles

- **`core`**
  - Minimal, stable Markdown Kanban engine.
  - Contains only the core features: Kanban board, task create/edit, filters, archives, multi-project, dark mode, language switching, AI workflow compatibility.
  - No user-facing experimental switches; minimal surface area.

- **`production`**
  - Stable, user-facing line.
  - Should match what the README promises.
  - Can include some feature flags/toggles, but they must be honest: no promising features that don’t exist.
  - Target branch for PRs that should go to “real users”.

- **`experimental`**
  - Fast-moving feature work: rich text, comments, slash commands, advanced UX.
  - Can contain scaffolding, WIP experiments, and extra debug tooling.
  - Not guaranteed to be fully polished, but should still compile and run.

Rule of thumb:

- **Core bugfixes and shared improvements start on `production`.**
- Then they are pulled into:
  - `core` (so core stays correct).
  - `experimental` (so experiments don’t reintroduce old bugs).

---

## 2. Example: bugfix across all branches (task ID increment)

This is the exact pattern you just used for the `TASK-001` issue.

### 2.1. The bug

- Issue: New tasks kept getting ID `TASK-001`.
- Root cause:
  - The app stores the last used ID in the markdown config comment:
    - `<!-- Config: Last Task ID: 0 -->`, `1`, `2`, ...
  - The code was writing the **full string ID** (`TASK-001`) back into `config.lastTaskId`.
  - On save, this produced `<!-- Config: Last Task ID: TASK-001 -->`.
  - On next load, the parser expected **digits only** (`(\d+)`), so it failed and fell back to `0` → `TASK-001` every time.

### 2.2. The fix (on `core`)

On `core`, the new task creation code was changed from:

```javascript
tasks.push(task);
config.lastTaskId = newId;
```

to:

```javascript
tasks.push(task);
// Store a numeric Last Task ID so the markdown config
// comment stays in the expected "digits only" format.
const idMatch = newId.match(/TASK-(\d+)/);
config.lastTaskId = idMatch ? parseInt(idMatch[1], 10) : newId;
```

This ensures:

- The markdown config uses `<!-- Config: Last Task ID: 1 -->`, `2`, `3`, … (plain digits).
- `generateTaskId(config.lastTaskId)` can reliably produce `TASK-002`, `TASK-003`, etc.

### 2.3. Propagating the fix with `git cherry-pick` (Option B)

General idea: **fix once in one branch**, then **cherry-pick that commit into other branches** instead of redoing the change by hand.

Steps you followed (and can repeat):

1. **On the branch where you made the fix (`core`):**

   ```bash
   git status -sb            # confirm only intended files are changed
   git add void.html
   git commit -m "fix: correctly increment last task id"
   git log -1 --oneline      # note the hash, e.g. cc04c11
   ```

2. **Cherry-pick into `production`:**

   ```bash
   git checkout production
   git cherry-pick cc04c11
   ```

   - If it applies cleanly, you now have the same fix in `production` with a new commit (same message, different hash).

3. **Cherry-pick into `experimental`:**

   ```bash
   git checkout experimental
   git cherry-pick cc04c11
   ```

4. **Return to your working branch:**

   ```bash
   git checkout core   # or production/experimental depending on what you're doing next
   ```

If conflicts appear during `cherry-pick`, Git will stop and let you resolve them. After resolving, run:

```bash
git add <files>
git cherry-pick --continue
```

or abort with:

```bash
git cherry-pick --abort
```

---

## 3. Recommended workflow for future core fixes

Over time, to keep things simple:

1. **Make shared bugfixes on `production` first**

   - Reason: `production` is your “truth” branch for shipped behavior.
   - Process:
     - `git checkout production`
     - Make and test your change.
     - `git add ... && git commit -m "fix: ..."`

2. **Pull the fix into `core`**

   - If `core` is always a subset of `production`, you can either:
     - `git checkout core && git cherry-pick <hash-from-production>`, or
     - occasionally `git merge production` into `core` and resolve any conflicts once.

3. **Pull the fix into `experimental`**

   - Similar options:
     - `git checkout experimental && git cherry-pick <hash-from-production>`, or
     - `git merge production` into `experimental` on a regular cadence.

4. **Feature work always starts from the right branch**

   - Small, stable enhancements → branch off `production`.
   - Experimental features → branch off `experimental`.
   - Very low-level refactors that only affect core behavior → can start from `core`, but usually you can start from `production` and then flow down to `core`.

---

## 4. When to cherry-pick vs merge

**Cherry-pick** is best when:

- You have **one or a few specific commits** you want to apply to another branch.
- You want to keep that branch otherwise independent (no full history merge).
- Example: a small bugfix or docs correction that should apply everywhere.

**Merge** is better when:

- You want to regularly bring a branch up to date with another branch’s history.
- You don’t mind extra merge commits and a more complex history.
- Example: keeping `experimental` roughly up to date with `production` over time.

Practical rules:

- Use **cherry-pick** for **individual, targeted fixes**.
- Use **merge** for **periodic branch synchronization** (e.g., `git checkout experimental && git merge production` every so often).

---

## 5. Common pitfalls with multiple branches (and how to avoid them)

### 5.1. “Fix only in one branch” problem

**Pitfall:** You fix a bug in one branch, but forget to propagate it. A month later, you hit the same bug in another branch and waste time rediscovering it.

**Avoid it:**

- After any important bugfix, ask: **“Which branches should also have this?”**
- Make it a habit:
  - Fix on `production`.
  - Immediately cherry-pick or merge into `core` and `experimental`.
- Keep a short checklist in your commit template or PR description: “Applied to: [ ] production [ ] core [ ] experimental”.

### 5.2. Diverging feature implementations

**Pitfall:** The same feature is implemented differently in `experimental` and `production`. Later merges are painful.

**Avoid it:**

- Decide **one “source” branch** for each feature:
  - For stable features: `production`.
  - For experimental features: `experimental`, then promote to `production` when mature.
- When promoting from `experimental` to `production`, prefer:
  - Merging `experimental` into `production` for that feature, or
  - Cherry-picking the relevant feature commits, rather than re-implementing.

### 5.3. Long-lived branches with no sync

**Pitfall:** `experimental` drifts far from `production` over time; merges become huge and risky.

**Avoid it:**

- Periodically sync:

  ```bash
  git checkout experimental
  git merge production
  # or rebase if you prefer a linear history, with more care
  ```

- Do this especially before starting large new work on `experimental`.

### 5.4. Editing the same file differently across branches

**Pitfall:** You make unrelated changes to `void.html` in multiple branches, leading to repeated merge conflicts.

**Avoid it:**

- For **global refactors or structural changes**, do them in one branch (usually `production`), merge that into others, and only then continue new work.
- Keep “branch-only” behavior limited, especially in shared files:
  - If core and experimental really need different behavior, consider **feature flags** or **configuration** instead of completely separate implementations.

### 5.5. Forgetting which branch you’re on

**Pitfall:** You think you’re fixing `production` but you’re actually on `experimental` (or vice versa).

**Avoid it:**

- Always run:

  ```bash
  git status -sb
  ```

  before starting work to confirm the current branch.

- Consider setting your prompt to show the current branch name.

---

## 6. Suggested personal checklist for fixes

Before you start:

1. `git status -sb` – confirm branch and cleanliness.
2. Decide: **Is this a shared bugfix?** If yes, work on `production`.

After committing a shared fix on `production`:

1. Cherry-pick or merge into `core`.
2. Cherry-pick or merge into `experimental`.
3. Optionally run quick smoke tests on each branch.

When you come back in a month and need to repeat:

1. Read this file (`docs/BRANCHING_AND_BUGFIX_WORKFLOW.md`).
2. Follow the “Recommended workflow for future core fixes” section.
3. Use the task-ID bug example as a template for cherry-picking into other branches.
