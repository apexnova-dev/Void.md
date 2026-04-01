# Session Documentation: Void.md

**Date:** March 17, 2026  
**Focus:** Three-branch strategy, bugfix propagation, inline styles cleanup, workflow documentation

---

## Executive Summary

This session established a three-branch layout (core, production, experimental), fixed a core bug (task ID always TASK-001), propagated that fix via cherry-pick to all branches, removed static inline CSS in favor of the embedded stylesheet to satisfy the no-inline-styles hint, and added documentation for branching and bugfix workflow.

**Key outcomes:**

- Branches `core`, `production`, and `experimental` exist; `main` unchanged. `production` is the default PR target.
- Task ID increment bug fixed and applied on core, production, and experimental.
- Static inline styles in `void.html` moved into the existing `<style>` block (single-file preserved).
- New doc: `docs/BRANCHING_AND_BUGFIX_WORKFLOW.md` for future cross-branch fixes and common pitfalls.

---

## 1. Branch Strategy Implemented

### 1.1 Decisions (from earlier in session)

- **Current state** = experimental (scaffolding and feature flags in place).
- **Production** = same codebase with misleading experimental UX removed or toned down.
- **Core** = minimal, stable Markdown Kanban (experimental section removed from Settings).
- **Option A:** `main` stays as-is; no renaming. New branches added alongside.

### 1.2 Branches created and pushed

| Branch         | Created from | Purpose |
|----------------|--------------|--------|
| `experimental` | `main`       | Feature work: comments, rich text, slash commands. Keeps all toggles and scaffolding. |
| `production`   | `main`       | Stable, user-facing line; default PR target. Honest Settings copy. |
| `core`         | `production` | Minimal app: Kanban, tasks, filters, archives, multi-project, theme, language. No experimental UI. |

- All three branches were pushed to `origin`.
- Recommendation recorded: set GitHub default branch to `production` (manual step in repo settings).

### 1.3 Production and core cleanups (earlier in session)

- **Production:** Comments and Slash Commands toggles already marked as “Planned” / disabled; Rich Text status copy aligned with actual behavior where applicable.
- **Core:** Entire “Experimental Features (v1.2.0)” section removed from Settings in `void.html`.

---

## 2. Task ID Bug (TASK-001 repeating)

### 2.1 Problem

New tasks always got ID `TASK-001`. The app writes the last used ID into the markdown config comment `<!-- Config: Last Task ID: N -->` and parses it back on load. The code was storing the full string `TASK-001` in `config.lastTaskId`, so the saved comment became `<!-- Config: Last Task ID: TASK-001 -->`. The parser expects digits only (`(\d+)`), so it failed and fell back to `0`, causing `generateTaskId(0)` → `TASK-001` every time.

### 2.2 Fix

After creating a new task, store a numeric value in `config.lastTaskId` so the comment stays digits-only:

```javascript
tasks.push(task);
const idMatch = newId.match(/TASK-(\d+)/);
config.lastTaskId = idMatch ? parseInt(idMatch[1], 10) : newId;
```

### 2.3 Propagation (Option B: cherry-pick)

1. Fix committed on `core`: `fix: correctly increment last task id` (hash `cc04c11`).
2. `git checkout production && git cherry-pick cc04c11` → applied as new commit on production.
3. `git checkout experimental && git cherry-pick cc04c11` → applied as new commit on experimental.
4. Returned to `core`.

All three long-lived branches now have the same task ID behavior.

---

## 3. Branching and Bugfix Workflow Documentation

**File:** `docs/BRANCHING_AND_BUGFIX_WORKFLOW.md`

Contents cover:

- **Branch roles:** core (minimal), production (stable/PR target), experimental (feature work).
- **Recommended workflow:** Do shared bugfixes on `production`, then cherry-pick or merge into `core` and `experimental`.
- **Step-by-step:** How the task ID fix was committed on core and cherry-picked to the other branches (with commands).
- **When to cherry-pick vs merge:** Cherry-pick for single-commit fixes; merge for periodic sync.
- **Common pitfalls:** Fix only in one branch; diverging implementations; long-lived branches never synced; editing the same file differently; forgetting which branch you’re on. Each with short mitigation.
- **Personal checklist:** Before starting (confirm branch, decide if shared fix); after committing (propagate to core and experimental).

---

## 4. Inline Styles Cleanup (no-inline-styles)

### 4.1 Context

Microsoft Edge Tools (webhint) reported “no-inline-styles” on many lines of `void.html`. The project is intentionally single-file; the requirement was to satisfy the hint without introducing an external CSS file.

### 4.2 Approach

- Move all **static** inline `style="..."` from the reported HTML into the existing `<style>` block in the same file.
- Use IDs and new utility/layout classes so behavior and layout stay the same.
- Leave JS that sets `element.style.display` (or similar) at runtime unchanged; only the initial state is in the stylesheet.

### 4.3 Changes

- **New CSS block** added before `</style>` with comment: `/* Layout and UI (moved from inline styles for no-inline-styles compliance) */`.
- **IDs used for:** `#versionBadge`, `#headerProjectGroup`, `#newTaskBtn`, `#filterBar`, `#globalSearchInput`, `#clearGlobalSearch`, `#activeFilters`, `#welcomeScreen`, `#welcomeProjectSelector`, `#welcomeProjectSelect`, `#welcomeGetStarted`, `#kanbanView`, `#settingsLanguageSelector`, `#formSubtasksList`, `#editorModeBadge`, `#taskNotes`, `#notesRichEditorWrap`, `#editorStatus`, `#addColumnBtn`, `#archiveList`, plus modal content/body classes.
- **New classes:** `.filter-global-search-row`, `.filter-global-search-wrap`, `.filter-rows`, `.filter-group`, `.filter-label`, `.filter-select`, `.filter-btn-sm`, `.filter-clear-btn`, `.form-hint`, `.form-subtask-add`, `.pad-sm`, `.btn-danger`, `.btn-archive`, `.modal-content--task-form`, `.modal-content--columns`, `.modal-content--archive`, `.modal-body-scroll--pad`, `.archive-search-wrap`.
- **Static inline styles removed** from header, filter bar, welcome screen, settings modal, task detail modal, new task form, columns modal, and archive modal in the **static** HTML only. Inline styles inside **JavaScript** template literals (e.g. `innerHTML` in `renderKanban()`, form subtasks, archive list) were left as-is; the linter was satisfied by the static HTML changes.

### 4.4 Result

- Single-file architecture preserved.
- No linter errors reported for `void.html` after the change.
- Visual and behavioral defaults unchanged.

---

## 5. Files Touched This Session

| File | Change |
|------|--------|
| `void.html` | Task ID fix (core/production/experimental); removal of Experimental section on core; move of static inline styles into `<style>` (on branch where edits were made). |
| `docs/BRANCHING_AND_BUGFIX_WORKFLOW.md` | **New.** Branch roles, cherry-pick steps, when to merge vs cherry-pick, pitfalls, checklist. |
| `docs/changelog/SESSION_DOCUMENTATION_2026-03-17.md` | **New.** This session summary. |

---

## 6. Git State (end of session)

- **Branches:** `main`, `core`, `production`, `experimental` (and any existing feature branches). `main` unchanged.
- **Production:** Default PR target (set in GitHub repo settings if desired).
- **Core:** One commit ahead of initial production: task ID fix. Core also has Experimental section removed and (on the branch where the style work was done) inline-styles cleanup.
- **Experimental:** Same task ID fix as production; retains full experimental UI.

If the inline-styles cleanup was done only on one branch (e.g. core or production), the same approach can be applied on the others when needed, or the change can be cherry-picked/merged per `docs/BRANCHING_AND_BUGFIX_WORKFLOW.md`.

---

## 7. References

- Branching plan: `.cursor/plans/branching-core-production-experimental_b5c1a894.plan.md` (or equivalent).
- Workflow doc: `docs/BRANCHING_AND_BUGFIX_WORKFLOW.md`
- Project review (earlier): project review plan and narrative on current state, phases, and future directions.
- AGENTS.md: single-file architecture, no external dependencies.

---

*Session documentation generated March 17, 2026.*
