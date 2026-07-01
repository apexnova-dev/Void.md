# Void.md — Core

<p align="center">
  <img src="./logo.svg" alt="Void.md" width="200" height="200" />
</p>

> **Visual Kanban. Plaintext Soul. No Cloud.**

**Local-first Kanban over Markdown** — your files are the database. No account, no cloud sync: open `void.html`, pick a folder, own your data.

Void.md is **plaintext infrastructure**: `kanban.md` and `archive.md` live where you put them (disk, repo, backup). The browser only reads/writes files you authorize via the File System Access API. There is **no hosted backend** — storage is **local**. Suitable for air-gapped workflows and Git-friendly task history.

---

## Branch model

This is the **`core`** branch — the stable engine. Minimal surface area, no experimental features. The foundation that `production` and `experimental` build on.

| Branch | Purpose |
|--------|---------|
| **`core`** (you are here) | Stable Kanban engine — minimal, reliable |
| `production` | User-facing stable line with full features |
| `experimental` | Fast-moving feature work (themes, rich text, etc.) |

---

## Quick start

### Prerequisites
- **Chrome 86+**, **Edge 86+**, or **Opera 72+** (File System Access API required)
- Firefox and Safari not supported

### Using the core-package

The standalone package is at [`core-package/`](core-package/):

1. Copy the `core-package/` folder to your project.
2. Open `void.html` in a supported browser.
3. Select the folder containing `kanban.md` and `archive.md`.

See [`core-package/HOW-TO-RUN.md`](core-package/HOW-TO-RUN.md) for detailed instructions.

### Using from source

```bash
git clone https://github.com/apexnova-dev/Void.md.git
git checkout core
open void.html   # macOS
xdg-open void.html  # Linux
start void.html  # Windows
```

---

## Features

| Feature | Status |
|---------|--------|
| Interactive Kanban board with drag & drop | ✅ Stable |
| Task CRUD (create, read, update, delete) | ✅ Stable |
| Rich metadata (priority, category, tags, dates, assignment) | ✅ Stable |
| Subtasks with progress bar | ✅ Stable |
| Advanced filters (priority, tags, category, user) | ✅ Stable |
| Global search (active + archived tasks) | ✅ Stable |
| Archive system with search & restore | ✅ Stable |
| Multi-project support (last 10 remembered) | ✅ Stable |
| Auto-save on every change | ✅ Stable |
| Dark mode (Neon City — cyan/magenta accents) | ✅ Stable |
| Light / Dark theme toggle | ✅ Stable |
| Language support (English, French) | ✅ Stable |
| Responsive layout | ✅ Stable |
| Accessibility (ARIA labels, focus management, scroll lock) | ✅ Stable |
| Security (CSP headers, XSS prevention) | ✅ Stable |
| Feature badges with glow effects | ✅ Stable |
| AI integration (structured markdown task format) | ✅ Stable |

Experimental features (rich text editor, comments, slash commands) exist in the code behind feature flags but are **disabled by default** on `core`. Switch to the `experimental` branch to work with them.

---

## Project structure

```
Void.md/
├── void.html              # Single-file application (~144KB)
├── core-package/          # Standalone portable package
│   ├── void.html          # (mirrors root void.html)
│   ├── kanban.md          # Task board template
│   ├── archive.md         # Archive template
│   ├── HOW-TO-RUN.md      # User setup guide
│   ├── AI_GUIDE.md        # AI assistant guide
│   └── README.md          # Package overview
├── docs/
│   ├── README.md          # Documentation index
│   ├── AI_WORKFLOW.md     # Canonical markdown task protocol
│   ├── architecture/      # Tests, design docs, overview
│   └── ...
├── AGENTS.md              # Build/test commands and code style
├── CHANGELOG.md           # Version history
├── scripts/               # Browser test runner
└── .github/               # CI workflows (lint, tests, pages)
```

---

## For AI assistants

- **Read [`docs/AI_WORKFLOW.md`](docs/AI_WORKFLOW.md)** for the canonical markdown task format.
- **Read [`core-package/AI_GUIDE.md`](core-package/AI_GUIDE.md)** for the portable summary.
- **Read [`AGENTS.md`](AGENTS.md)** for build/test commands and code style.

### Key markdown rules

1. **Column IDs required:** `**Columns**: 📝 To Do (todo) | 🚀 In Progress (in-progress) | ✅ Done (done)` — each column must have a parenthesized `(id)`.
2. **No `##` or `###` inside task bodies** — breaks parsing.
3. **Archive only on user request** — never automatically.
4. **Tables are NOT tasks** — only `### TASK-XXX |` creates cards on the board.

### AI configuration templates

Available in [`docs/ai-templates/`](docs/ai-templates/):
- `CLAUDE.md.exemple` — Claude / Claude Code
- `COPILOT.md.exemple` — GitHub Copilot
- `CHATGPT.md.exemple` — ChatGPT
- `GEMINI.md.exemple` — Gemini
- `QWEN.md.exemple` — Qwen
- `CODEIUM.md.exemple` — Windsurf / Codeium
- `OPENAI_CLI.md.exemple` — OpenAI CLI

---

## Kanban board setup

### Minimal `kanban.md`

```markdown
# Kanban Board

## ⚙️ Configuration

**Columns**: 📝 To Do (todo) | 🚀 In Progress (in-progress) | ✅ Done (done)
**Categories**: Frontend, Backend, Design
**Users**: @alice, @bob
**Tags**: #bug, #feature, #docs

## 📝 To Do

## 🚀 In Progress

## ✅ Done
```

### Minimal `archive.md`

```markdown
# Task Archive

> Archived tasks

## ✅ Archives
```

### Customizing columns

```markdown
**Columns**: 📝 Backlog (backlog) | 🔍 Analysis (analysis) | 🚀 Dev (dev) | 👀 Review (review) | ✅ Done (done)
```

Format: `Emoji Name (id) | ...` — each column needs a parenthesized `id`. The name before `(id)` must match the `##` column heading exactly.

---

## Task format reference

```markdown
### TASK-001 | Task title
**Priority**: High | **Category**: Frontend | **Assigned**: @alice
**Created**: 2025-01-20 | **Due**: 2025-02-01
**Tags**: #feature #ui

Description...

**Subtasks**:
- [ ] Subtask 1
- [x] Completed subtask

**Notes**:
Work in progress...

**Result**:
What was accomplished.
```

**5 required fields:**
1. `### TASK-XXX | Title` — task ID + title
2. `**Priority**: X` — priority level
3. `**Category**: X` — category
4. `**Created**: YYYY-MM-DD` — creation date
5. Body content — description or at least an empty line

**3 forbidden patterns:**
- ❌ No `##` or `###` inside task bodies
- ❌ No headings other than the task heading itself
- ❌ Never use `##` level for column sections (always `###` for tasks)

---

## Roadmap

### Completed (v1.1 — v1.3.3)
- Core Kanban, task management, filters, archives, multi-project
- Dark mode with 7-level color hierarchy
- Neon City brand identity
- AI workflow documentation
- Accessibility improvements
- Security hardening (CSP, SRI hashes)

### Planned
- Keyboard shortcuts
- PDF/HTML export
- Visual statistics
- See `experimental` branch for in-progress features

---

## License

Mozilla Public License 2.0 (MPL-2.0)

---

*Void.md — Core branch. Stable Kanban engine. v1.3.3*
