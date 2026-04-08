# AI assistant guide – Void.md (core package)

> **Local-first Kanban** with Neon City soul (dark theme, cyan/magenta accents).

This document is for **coding agents** (Cursor, Claude, Copilot, etc.) when working with this **standalone folder**: a single HTML app plus `kanban.md` and `archive.md`. It summarizes the **markdown contract** and **workflow** so tasks stay compatible with `void.html`.

> **Note:** This portable version covers the essentials. The full repository also includes `docs/AI_WORKFLOW.md` with comprehensive documentation (session tracking, Git integration, AI configuration templates, and more).

If you have the **full repository** checked out, also read `AGENTS.md` (build, tests, conventions) and `.claude/skills/markdown-task-manager/SKILL.md` (full task skill). This file is the **portable** copy for zips and minimal deployments.

---

## 1. What this package is


| Item            | Role                                                                                                                                                                 |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `void.html`     | The app: open in **Chrome, Edge, or Opera** (Chromium-based). Uses the **File System Access API**; Firefox and Safari are not supported for folder pick / live save. |
| `kanban.md`     | Active board: configuration, columns, and tasks.                                                                                                                     |
| `archive.md`    | Long-term storage for tasks moved to archive (by user action in the app or by explicit edit).                                                                        |
| `HOW-TO-RUN.md` | Human-oriented run instructions.                                                                                                                                     |
| `AI_GUIDE.md`   | This file: concise guide for AI assistants.                                                                                                                          |


- **Data stays local.** Task content lives in the Markdown files. The browser may store preferences (theme, language, last folder handle) in **localStorage / IndexedDB**; nothing is sent to the internet by this app.
- **No build step.** Open the HTML file directly (`file://`) or via a static local server.
- **Core vs Full App:** This package represents the **core** experience (Kanban, task CRUD, filters, archives, multi-project, themes, language). The same `void.html` may contain experimental features (rich text editor, comments, slash commands) that are **disabled by default**. Users enable them in Settings. See `HOW-TO-RUN.md` for more on core vs. experimental.

---

## 2. What the AI cannot do vs what it can do

**The human must:**

- Install and open a supported browser.
- Open `void.html` and **grant a directory** when prompted (File System Access API permission).
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
- `**Subtasks`** or `**Notes**` **without** a trailing colon on that same label line (the format expects `**Subtasks**:` and `**Notes**:`).

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

The `## ⚙️ Configuration` section defines columns, categories, users, and tags. **Column IDs are required:** on the `**Columns**:` line, each column must be written as `Emoji Name (column-id)` separated by `|`. The text before `(…)` must match the corresponding `##` heading **exactly**.

If you omit the `(id)` segments (for example only `📝 To Do | 🚀 In Progress`), Void.md cannot parse custom columns. It falls back to built‑in default titles, your `##` headings no longer match the internal column IDs, and **tasks may not appear on the board** even though `kanban.md` loads. Fixing it means restoring IDs on the `**Columns**:` line and keeping `##` titles aligned (see default template in `void.html` / `createDefaultKanbanContent()`).

Example configuration (note the parenthesized ids):

```markdown
## ⚙️ Configuration

**Columns**: 📝 To Do (todo) | 🚀 In Progress (in-progress) | 👀 Review (in-review) | ✅ Done (done)
**Categories**: Frontend, Backend, DevOps
**Users**: @alice, @bob
**Tags**: #bug, #feature, #docs

---
```

Column sections (headings must match the names before the parentheses):

```markdown
## 📝 To Do

### TASK-001 | First task
[...]

## 🚀 In Progress

## 👀 Review

## ✅ Done
```

Do not rename column sections casually without updating the `**Columns**:` line to match (including IDs). For the full protocol, see `docs/AI_WORKFLOW.md` in the complete repository.

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

This folder is built from the repository’s `**core` branch** intent: **stable Kanban**, task CRUD, filters, archives, multi-project, theme/language—**without relying on experimental features**.

The shipped `void.html` may still contain **feature flags** in code (e.g. rich text, comments, slash commands). In the core package they are `**enabled: false` by default**; users can turn some on via **Settings** and `localStorage`. Treat the **default** experience as “core”; optional flags are **off** unless the user enables them.

---

## 6. Verification

**With only this package:**

- Rely on the **human** for smoke tests: open app, pick folder, create/move a task, confirm Markdown updates on disk.

**With the full repo** (optional):

- Follow `AGENTS.md`: load `docs/architecture/tests/unit-tests.js` in the browser console against `void.html`, or use the test page workflow described there.

---

## 7. Quick checklist before saving `kanban.md`

- No `##` / `###` inside any task body
- `<!-- Config: Last Task ID: N -->` is numeric and matches the highest `TASK-XXX`
- `**Columns**:` lists every column as `Emoji Name (id)` so the app can match tasks to swimlanes
- Each `##` column heading matches the name before the `(id)` on the `**Columns**:` line
- New tasks use the next ID and live under the correct `##` column section
- `**Notes**:` / `**Subtasks**:` labels use colons
- Archive only when the user requested it

> **Need more details?** See `docs/AI_WORKFLOW.md` in the full repository for session tracking, Git integration, and AI configuration examples.

---

*Core package – Void.md. For full-repo agent conventions, see `AGENTS.md` and `.claude/skills/markdown-task-manager/SKILL.md`.*