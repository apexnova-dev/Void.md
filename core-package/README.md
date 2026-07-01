# Void.md — Core Package

<p align="center">
  <img src="./logo.svg" alt="Void.md" width="150" height="150" />
</p>

> **Visual Kanban. Plaintext Soul. No Cloud.**

A **local-first Kanban board** in a single HTML file. Your tasks live in Markdown files on your disk — no database, no cloud, no account.

---

## What's in this package

| File | Purpose |
|------|---------|
| `void.html` | The application — open in Chrome, Edge, or Opera |
| `kanban.md` | Template for your active tasks and board configuration |
| `archive.md` | Template for archived/completed tasks |
| `HOW-TO-RUN.md` | Detailed instructions for humans (recommended first read) |
| `AI_GUIDE.md` | Task format and workflow guide for AI coding assistants |
| `README.md` | This file — quick overview |
| `logo.svg` | Application logo |

---

## Quick start

1. **Open `void.html`** in Chrome, Edge, or Opera (Firefox and Safari not supported).
2. **Pick a folder** when prompted — the folder where `kanban.md` lives (or any folder you want tasks in).
3. **Start creating tasks** — the Kanban board appears with default columns.

No build step, no server, no sign-up.

---

## Where your data lives

- **Tasks** are stored in `kanban.md` (active) and `archive.md` (archived) — plain Markdown, fully readable in any editor.
- **Preferences** (theme, language, recent projects) are stored in browser localStorage / IndexedDB.
- **Nothing is sent to the internet.** The app is 100% local.

---

## Branch model

This package tracks the **core** branch — the stable engine: Kanban, task CRUD, filters, archives, multi-project, theme, and language support. The same `void.html` may contain optional experimental features (rich text editor, comments, slash commands) that are **disabled by default**. See `HOW-TO-RUN.md` for details.

---

## Next steps

- **👤 For humans:** Read [`HOW-TO-RUN.md`](./HOW-TO-RUN.md) for setup, troubleshooting, and details.
- **🤖 For AI assistants:** Read [`AI_GUIDE.md`](./AI_GUIDE.md) for the markdown task format and workflow rules.

---

*Core package — Void.md v1.3.3*  
*Licensed under MPL-2.0*
