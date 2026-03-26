# AI assistant guide – Markdown Task Manager (core package)

This document is for **coding agents** (Cursor, Claude, Copilot, etc.) when working with this **standalone folder**: a single HTML app plus `kanban.md` and `archive.md`. It summarizes the **markdown contract** and **workflow** so tasks stay compatible with `task-manager.html`.

If you have the **full repository** checked out, also read `AGENTS.md` (build, tests, conventions) and `.claude/skills/markdown-task-manager/SKILL.md` (full task skill). This file is the **portable** copy for zips and minimal deployments.

---

## 1. What this package is

| Item                | Role                                                                                                                                                           |
|---------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `task-manager.html` | The app: open in **Chrome, Edge, or Opera** (Chromium). Uses the **File System Access API**; Firefox and Safari are not supported for folder pick / live save. |
| `kanban.md`         | Active board: configuration, columns, and tasks.                                                                                                               |
| `archive.md`        | Long-term storage for tasks moved to archive (by user action in the app or by explicit edit).                                                                  |
| `HOW-TO-RUN.md`     | Human-oriented run instructions.                                                                                                                               |

- **Data stays local.** Task content lives in the Markdown files. The browser may store preferences (theme, language, last folder handle) in **localStorage / IndexedDB**; nothing is sent to the internet by this app.
- **No build step.** Open the HTML file directly (`file://`) or via a static local server.

---

## 2. What the AI cannot do vs what it can do

**The human must:**

- Install and open a supported browser.
- Open `task-manager.html` and **grant a directory** when prompted (File System Access API permission).
- Reload or use the app UI to see changes the AI made to files on disk.

**The AI can:**

- **Read and edit** `kanban.md` and `archive.md` in the project folder (or workspace) using normal editor tools.
- **Create tasks**, move them between column sections, update metadata, and keep the **config comment** valid.
- **Follow the strict format** below so the app’s parser does not break.

**The AI cannot:**

- Click “Select folder” or approve OS permission dialogs for the user.
- Assume the app is running or that a save has been flushed—after edits, the user refreshes or relies on the app’s file sync behavior as designed.

---

## 3. Strict task markdown contract

The web app parses tasks as **Markdown sections**. Headings **inside** a task body break parsing. Follow this template.

### 3.1 Mandatory task shape

```markdown
### TASK-XXX | Task title

**Priority**: [Critical|High|Medium|Low] | **Category**: [Value] | **Assigned**: @user1, @user2
**Created**: YYYY-MM-DD | **Started**: YYYY-MM-DD | **Due**: YYYY-MM-DD | **Finished**: YYYY-MM-DD
**Author**: [Name or AI identity] | **Session**: [optional session id] | **AI Version**: [optional model id]
**Tags**: #tag1 #tag2

Description paragraph(s). **Do not use `##` or `###` headings inside a task.**

**Subtasks**:
- [ ] Open item
- [x] Done item

**Notes**:
Use subsections like `**Result**:` only after `**Notes**:` with a colon.

**Result**:
Summary of outcome when closing work.

**Modified files**:
- path/to/file.ext (lines A–B)
```

**Required fields** (for compatibility): the line `### TASK-XXX |`, and lines starting with `**Priority**:`, `**Category**:`, `**Created**:`, `**Author**:`.

**Forbidden inside the task body:**

- `## Anything` or `### Anything` (any ATX heading).
- `**Subtasks**` or `**Notes**` **without** a trailing colon on that same label line (the format expects `**Subtasks**:` and `**Notes**:`).

**Why:** The HTML parser treats headings as structure; inner `##` / `###` are not supported for task bodies.

### 3.2 Task IDs and config comment

At the top of `kanban.md`, a HTML comment stores the last used numeric ID:

```markdown
<!-- Config: Last Task ID: 42 -->
```

Rules:

- Use **digits only** after `Last Task ID:` (e.g. `42`, not `TASK-042`). The app increments IDs and expects a numeric value here for `TASK-043`, etc.
- When **adding a new task**, assign the next `TASK-XXX` (zero-padded to three digits if that is your project convention), then **update** `Last Task ID` to that number.

### 3.3 Columns and configuration block

The `## ⚙️ Configuration` section defines columns, categories, users, and tags. **Column section headers** in the file (e.g. `## 📝 To Do`) must stay consistent with the **Columns** line so tasks appear in the right swimlanes when the app loads.

Do not rename column sections casually without updating the configuration line to match.

---

## 4. Workflow expectations

1. **Read `kanban.md` first** to see current tasks, last ID, and column layout.
2. **New work:** add a task under **To Do** (or the appropriate column), then bump `Last Task ID`.
3. **In progress:** move the whole task block to **In Progress** (or your project’s equivalent) and set `**Started**:`.
4. **Done:** move to **Done**, add a `**Finished**:` date line, and under `**Notes**:` document honest **Result**, **Modified files**, and **Tests performed** when applicable.
5. **Integrity:** never invent **Result**, **Modified files**, or test claims. Only document what actually happened.
6. **Archiving:** **Do not** move tasks to `archive.md` unless the **user explicitly asks**. Completed work stays in **Done** until then.
7. When archiving (on user request): copy the full task from `kanban.md` into `archive.md` under `## ✅ Archives`, use separators between entries if your team uses them, and remove the task from the board file.

---

## 5. Branch and “core” package meaning

This folder is built from the repository’s **`core` branch** intent: **stable Kanban**, task CRUD, filters, archives, multi-project, theme/language—**without relying on experimental features**.

The shipped `task-manager.html` may still contain **feature flags** in code (e.g. rich text, comments, slash commands). In the core package they are **`enabled: false` by default**; users can turn some on via **Settings** and `localStorage`. Treat the **default** experience as “core”; optional flags are **off** unless the user enables them.

---

## 6. Verification

**With only this package:**

- Rely on the **human** for smoke tests: open app, pick folder, create/move a task, confirm Markdown updates on disk.

**With the full repo** (optional):

- Follow `AGENTS.md`: load `docs/architecture/tests/unit-tests.js` in the browser console against `task-manager.html`, or use the test page workflow described there.

---

## 7. Quick checklist before saving `kanban.md`

- [ ] No `##` / `###` inside any task body  
- [ ] `<!-- Config: Last Task ID: N -->` is numeric and matches the highest `TASK-XXX`  
- [ ] New tasks use the next ID and live under the correct `##` column section  
- [ ] `**Notes**:` / `**Subtasks**:` labels use colons  
- [ ] Archive only when the user requested it  

---

*Core package – Markdown Task Manager. For full-repo agent conventions, see `AGENTS.md` and `.claude/skills/markdown-task-manager/SKILL.md`.*
