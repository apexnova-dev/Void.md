# Void.md — Production

<p align="center">
  <img src="./logo.svg" alt="Void.md" width="200" height="200" />
</p>

> **Visual Kanban. Plaintext Soul. No Cloud.**

**Local-first Kanban over Markdown** — your files are the database. No account, no cloud sync: open `void.html`, pick a folder, own your data.

Void.md is a **standalone web application** contained in a single HTML file. It uses the browser's File System Access API to read and write directly to your local Markdown files.

---

## Branch model

This is the **`production`** branch — the stable, user-facing line. Features here have passed through `experimental` and are considered production-ready.

| Branch | Purpose |
|--------|---------|
| `core` | Stable Kanban engine (foundation) |
| **`production`** (you are here) | User-facing stable release line |
| `experimental` | Fast-moving feature work |

---

## Quick start

### Prerequisites
- **Chrome 86+**, **Edge 86+**, or **Opera 72+**
- Firefox and Safari are not supported (no File System Access API)

### Installation
\`\`\`bash
git clone https://github.com/apexnova-dev/Void.md.git
git checkout production
open void.html  # or xdg-open / start
\`\`\`

Select a folder when prompted — the app creates \`kanban.md\` and \`archive.md\` if they don't exist.

### Alternative: standalone package
Copy \`core-package/\` to any project and open \`void.html\` from there. See \`core-package/HOW-TO-RUN.md\` for details.

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
| Accessibility (ARIA labels, focus management) | ✅ Stable |
| Security hardening (CSP, XSS prevention, SRI hashes) | ✅ Stable |
| Branded GitHub Pages landing page | ✅ Stable |
| Feature badges with glow effects | ✅ Stable |
| AI integration (structured task format) | ✅ Stable |

### Feature flags (disabled by default)
- Rich Text Editor (Tiptap) — CDN-loaded, partial implementation
- Comment system — scaffold only
- Slash commands — requires rich text
- Performance logging — console output

---

## Project structure

\`\`\`
Void.md/
├── void.html              # Single-file application (~144KB)
├── core-package/          # Standalone portable package
├── docs/                  # Full documentation suite
│   ├── AI_WORKFLOW.md     # Canonical markdown task protocol
│   ├── architecture/      # Tests, design docs, overview
│   ├── templates/         # Template kanban.md / archive.md
│   └── ...
├── AGENTS.md              # Development guide for AI assistants
├── CHANGELOG.md           # Version history
├── scripts/               # Browser test runner
└── .github/               # CI workflows
\`\`\`

---

## For AI assistants

- **Read \`docs/AI_WORKFLOW.md\`** — canonical task format and workflow protocol.
- **Read \`AGENTS.md\`** — build commands, code style, multi-agent coordination.
- **Read \`core-package/AI_GUIDE.md\`** — portable summary for standalone packages.

### Key markdown rules
1. **Column IDs required:** \`Emoji Name (id)\` format on \`**Columns**:\`
2. **No \`##\` or \`###\` inside task bodies**
3. **Archive only on user request**
4. **Tables are NOT tasks** — only \`### TASK-XXX |\` creates cards

---

## Documentation index

| Document | Audience | Purpose |
|----------|----------|---------|
| \`docs/README.md\` | Everyone | Documentation index |
| \`docs/AI_WORKFLOW.md\` | AI agents | Canonical task format |
| \`AGENTS.md\` | Developers / AI | Build, tests, code style |
| \`CHANGELOG.md\` | Everyone | Version history |
| \`core-package/HOW-TO-RUN.md\` | Users | Setup and troubleshooting |

---

## Roadmap

- Keyboard shortcuts (Ctrl+N, Ctrl+K, Ctrl+S) — planned
- PDF/HTML export — planned
- Visual statistics dashboard — planned
- File attachments — future
- Mentions system (@user) — future
- Offline mode (Service Worker) — future

---

## License

Mozilla Public License 2.0 (MPL-2.0)

---

*Void.md — Production branch. Stable, user-ready.*
```
```markdown
# Void.md — Experimental

<p align="center">
  <img src="./logo.svg" alt="Void.md" width="200" height="200" />
</p>

> **Visual Kanban. Plaintext Soul. No Cloud.**

**Local-first Kanban over Markdown** — your files are the database. No account, no cloud sync: open \`void.html\`, pick a folder, own your data.

This is the **\`experimental\`** branch — bleeding edge features under active development. Some features are unfinished or behind feature flags. Switch to \`production\` or \`core\` for a stable experience.

---

## Branch model

| Branch | Purpose |
|--------|---------|
| \`core\` | Stable Kanban engine (foundation) |
| \`production\` | Stable user-facing release line |
| **\`experimental\`** (you are here) | Fast-moving feature work — may be unstable |

Features flow: \`experimental\` → \`production\` → \`core\` (when promoted).

---

## Quick start

\`\`\`bash
git clone https://github.com/apexnova-dev/Void.md.git
git checkout experimental
open void.html  # or xdg-open / start
\`\`\`

**Supported browsers:** Chrome 86+, Edge 86+, Opera 72+ (Firefox and Safari not supported).

---

## Features

### Stable (production-ready)

| Feature | Notes |
|---------|-------|
| Interactive Kanban board with drag & drop | Fully functional |
| Task CRUD | Fully functional |
| Advanced filters (priority, tags, category, user) | Fully functional |
| Archive system with search & restore | Fully functional |
| Multi-project support | Fully functional |
| Auto-save + form auto-save with draft persistence | ✅ New in v1.4.0 |
| Dark / Light / Neon City themes | ✅ Three-theme system |
| Language support (English, French) | Fully functional |
| Security hardening (CSP, XSS prevention) | Fully functional |
| Feature badges with glow effects | Fully functional |
| AI integration (structured task format) | Fully functional |
| Keyboard shortcuts (Escape, Enter, Ctrl+Arrow) | ✅ New in v1.4.0 |
| Docs button + modal (tabbed documentation viewer) | ✅ New |

### Experimental (feature-flagged — use at your own risk)

| Feature | Flag | Status | Notes |
|---------|------|--------|-------|
| Rich Text Editor (Tiptap) | \`ENABLE_RICH_TEXT_EDITOR\` | ⚠️ Partial | CDN loading issues |
| Comment system | \`ENABLE_COMMENTS\` | 🔧 Scaffold | No UI or data model |
| Slash commands | \`ENABLE_SLASH_COMMANDS\` | 🔧 Scaffold | Requires rich text |
| Performance logging | \`ENABLE_PERFORMANCE_LOGGING\` | ✅ Working | Console timing output |

---

## Project structure

\`\`\`
Void.md/
├── void.html              # Single-file application
├── core-package/          # Synced portable package
├── docs/
│   ├── AI_WORKFLOW.md
│   ├── testing/           # Test plans for experimental features
│   └── architecture/      # Tests and design docs
├── AGENTS.md
├── CHANGELOG.md
├── branding_protocol.md   # Neon City brand guidelines
├── about.html             # Landing page
└── .github/               # CI workflows
\`\`\`

---

## For AI assistants

- **Read \`docs/AI_WORKFLOW.md\`** for the canonical markdown task protocol.
- **Read \`AGENTS.md\`** for build commands, code style, and multi-agent coordination rules.
- **Read \`core-package/AI_GUIDE.md\`** for the portable summary.

---

## Known issues

| Issue | Status |
|-------|--------|
| Tiptap CDN extension loading fails intermittently | ⚠️ Needs bundling fix (P0) |
| Feature toggle click handlers on dynamic switches unresponsive | ⚠️ Known (#4) |
| Rich text editor never attached to Notes field in form | 🔧 In progress |
| Phase 2 tests expect \`TiptapEditor\` class that doesn't exist | 🔧 Test/implementation mismatch |

---

## Testing

- **Unit tests**: Load \`docs/architecture/tests/unit-tests.js\` in browser console
- **Phase 2 tests**: \`docs/architecture/tests/phase2-tests.js\`
- **Debug mode**: \`localStorage.setItem('debugMode', 'true'); location.reload();\`
- **Test plans**: See \`docs/testing/\` for detailed test matrices

---

## Roadmap

### v1.4.0 (current experimental)
- ✅ Three-theme system (light, dark, Neon City)
- ✅ Keyboard shortcuts (basic navigation)
- ✅ Form auto-save with draft persistence
- ✅ Docs button and modal viewer
- ✅ Security hardening
- ⚠️ Rich Text Editor (partial — CDN loading issues)

### v1.4.1 (planned — stabilization)
- Fix Tiptap extension loading (bundle vs CDN)
- Complete rich text integration in task forms
- Bug fixes from testing

### v1.5.0 (planned — data & analytics)
- Visual statistics dashboard
- PDF/HTML export
- Enhanced filtering (date range, saved presets)
- Mentions system (@user)

---

## License

Mozilla Public License 2.0 (MPL-2.0)

---

*Void.md — Experimental branch. Innovation in progress.*
