# How to Run the Core Branch – Markdown Task Manager

This folder is a **standalone package** to run the **core** version of the app: stable Kanban and file-based tasks. **Experimental options** (rich text, comments, slash commands) exist in the app but are **turned off by default**; you get the core experience until you enable them in Settings. Everything runs in your browser; no server or build step.

**Coding assistants (AI):** see [`AI_GUIDE.md`](./AI_GUIDE.md) for markdown rules, workflow, and what agents can and cannot do with this package.

---

## What’s in this package

| File | Purpose |
|------|--------|
| `task-manager.html` | The app. Open it in a supported browser. |
| `kanban.md` | Template for your active tasks. |
| `archive.md` | Template for archived tasks. |
| `HOW-TO-RUN.md` | This guide (humans). |
| `AI_GUIDE.md` | Guide for AI assistants editing tasks and markdown. |

---

## Quick start (3 steps)

### 1. Use a supported browser

- **Chrome 86+**, **Edge 86+**, or **Opera 72+** (Brave works too).
- Firefox and Safari are not supported (no File System Access API).

### 2. Open the app

- **Double‑click** `task-manager.html`, or  
- **Drag** it into a browser window, or  
- **File → Open** and choose `task-manager.html`.

### 3. Choose your task folder

- When the app asks for a folder, pick the folder that contains (or will contain) your `kanban.md` and `archive.md`.
- **Option A – Use this package folder:**  
  Select the folder where this HOW-TO and the two `.md` files live. The app will use the included `kanban.md` and `archive.md` (or create them if missing).
- **Option B – Use a project folder:**  
  Select any other folder. The app will create `kanban.md` and `archive.md` there if they don’t exist.

After that, the Kanban board loads and you can create, move, and archive tasks.

---

## First time in a new folder

If the folder is empty of task files, the app will offer to create:

- `kanban.md` – active tasks and columns  
- `archive.md` – completed/archived tasks  

You can accept that, or copy the included `kanban.md` and `archive.md` from this package into your folder before selecting it.

---

## Where your data lives

- **Tasks** are stored only in **Markdown files** on your machine (`kanban.md`, `archive.md`).
- The app may use **browser storage** (e.g. IndexedDB) to remember the last project folder and preferences (theme, language). No data is sent to the internet.

---

## Core branch vs rest of the repo

This package tracks the **core** branch: Kanban, task create/edit, filters, archives, multi‑project, dark mode, and language. The same `task-manager.html` build may include a **Settings** area with **feature flags** for rich text, comments, and slash commands; those features are **disabled by default** in a fresh profile so the out‑of‑box experience stays minimal. Users can enable them in Settings (stored in browser storage). The **`experimental`** and **`production`** branches in the repo carry the fuller evolution of those features and documentation; use them when you want the latest non‑core work.

---

## Troubleshooting

| Issue | What to do |
|-------|------------|
| “File System Access API not supported” | Use Chrome, Edge, or Opera (see step 1). |
| App won’t open / blank page | Open the browser console (F12) and check for errors; ensure you’re opening the file via `file://` or a local server. |
| Wrong or old version | Replace `task-manager.html` in this folder with the one from the **core** branch of the repo. |

---

## Updating this package

To refresh from the repo:

1. Check out the **core** branch.
2. Copy the latest `task-manager.html` from the **repository root** into this `core-package` folder (overwrite the existing one) so this file stays **byte‑for‑byte** identical to the canonical app on `core`.
3. Optionally refresh `kanban.md` and `archive.md` from `docs/templates/` in the repo if you want the latest template format.

---

*Core package – Markdown Task Manager. Single-file, local-only, Git-friendly.*
