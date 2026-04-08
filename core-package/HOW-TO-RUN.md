# How to Run the Core Package – Void.md

> **Void.md** – Local-first Kanban with **Neon City** soul (dark theme, cyan/magenta accents).

This folder is a **standalone package** to run the **core** version of the app: stable Kanban and file-based tasks. **Experimental options** (rich text, comments, slash commands) exist in the app but are **turned off by default**; you get the core experience until you enable them in Settings. Everything runs in your browser; no server or build step.

**Users (humans):** This guide covers everything you need.
**Coding assistants (AI):** See [`AI_GUIDE.md`](./AI_GUIDE.md) for markdown rules, workflow, and what agents can and cannot do.

---

## What’s in this package

| File | Purpose |
|------|--------|
| `void.html` | The app. Open it in a supported browser. |
| `logo.svg` | Welcome screen logo (same asset as the main repository). |
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

- **Double‑click** `void.html`, or  
- **Drag** it into a browser window, or  
- **File → Open** and choose `void.html`.

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

This package tracks the **core** branch: Kanban, task create/edit, filters, archives, multi‑project, dark mode, and language. The same `void.html` build may include a **Settings** area with **feature flags** for rich text, comments, and slash commands; those features are **disabled by default** in a fresh profile so the out‑of‑box experience stays minimal. Users can enable them in Settings (stored in browser storage). The **`experimental`** and **`production`** branches in the repo carry the fuller evolution of those features and documentation; use them when you want the latest non‑core work.

---

## Troubleshooting

| Issue | What to do |
|-------|------------|
| “File System Access API not supported” | Use Chrome, Edge, or Opera (see step 1). |
| App won’t open / blank page | Open the browser console (F12) and check for errors; ensure you’re opening the file via `file://` or a local server. |
| **Kanban looks empty** but `kanban.md` has tasks | In `## ⚙️ Configuration`, the `**Columns**:` line must list each column as `Emoji Name (column-id)` (for example `📝 To Do (todo)`). Names before `(…)` must match your `##` column headings. If IDs are missing, the app cannot map tasks to columns. See [`AI_GUIDE.md`](./AI_GUIDE.md) and the full repo’s `docs/AI_WORKFLOW.md`. |
| Wrong or old version | Replace `void.html` in this folder with the one from the **core** branch of the repo. |
| "Folder permissions denied" or can't save | The browser needs write permission to the folder. Try selecting a different folder, or check that the folder isn't on a read-only filesystem or network drive with restricted access. |
| App behaves oddly after settings change | Clear browser storage: open DevTools (F12) → Application tab → Storage → Clear "IndexedDB" and "Local Storage", then refresh the page. |
| Markdown file appears corrupted / app won't load | Open the `.md` file in a text editor. Look for unexpected characters, truncated lines, or broken markdown syntax. Common fixes: restore from a backup, manually repair broken task blocks (### TASK-XXX | ...), or delete and recreate the file from a fresh template. |

### Detailed: Resetting browser storage

If the app behaves unexpectedly (wrong theme, stale project list, settings not applying), reset the browser storage:

1. Open `void.html` in Chrome/Edge/Opera
2. Press **F12** to open DevTools
3. Go to the **Application** tab
4. Under **Storage**, expand **IndexedDB** and delete any entries (e.g., `taskManager_projects`)
5. Under **Local Storage**, clear entries starting with `taskManager_`
6. Close DevTools and refresh the page (F5)

The app will re-detect your folder and recreate storage with fresh defaults.

### Detailed: Recovering from corrupted markdown

If `kanban.md` or `archive.md` is corrupted (e.g., app fails to load or shows errors):

1. **Check for backup**: If you use a sync service (Dropbox, iCloud, Git), look for a previous version.
2. **Open the file directly**: In a plain text editor (VS Code, Notepad++, etc.). Look for:
   - Truncated lines or incomplete task blocks
   - Unexpected binary characters or encoding issues
   - Missing `###` headers that break the task structure
3. **Manual repair**: Restore the file structure:
   ```markdown
   ## To Do
   
   ### TASK-001 | Task Title
   - [ ] Description here
   ```
4. **Fresh start**: If repair isn't feasible, delete the corrupted file and:
   - Copy a fresh template from the repo's `docs/templates/`
   - Or let the app create a new one (it will prompt if neither `kanban.md` nor `archive.md` exists)

---

## Updating this package

To refresh from the repo:

1. Check out the **core** branch.
2. Copy the latest `void.html` from the **repository root** into this `core-package` folder (overwrite the existing one) so this file stays **byte‑for‑byte** identical to the canonical app on `core`.
3. Optionally refresh `kanban.md` and `archive.md` from `docs/templates/` in the repo if you want the latest template format.

---

*Core package – Void.md. Single-file, local-only, Git-friendly.*

*Version: 1.3.1*

*Licensed under MPL-2.0 - see LICENSE file*
