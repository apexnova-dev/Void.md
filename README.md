# Void.md — Experimental

<p align="center">
  <img src="./logo.svg" alt="Void.md" width="200" height="200" />
</p>

> **Visual Kanban. Plaintext Soul. No Cloud.**

**Local-first Kanban over Markdown** — your files are the database. No account, no cloud sync: open `void.html`, pick a folder, own your data.

This is the **`experimental`** branch — bleeding edge features under active development. Some features are unfinished or behind feature flags. Switch to `production` or `core` for a stable experience.

---

## Branch model

| Branch | Purpose |
|--------|---------|
| `core` | Stable Kanban engine (foundation) |
| `production` | Stable user-facing release line |
| **`experimental`** (you are here) | Fast-moving feature work — may be unstable |

Features flow: `experimental` → `production` → `core` (when promoted).

---

## Quick start

```bash
git clone https://github.com/apexnova-dev/Void.md.git
git checkout experimental
open void.html  # or xdg-open / start
```

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
| Rich Text Editor (Tiptap) | `ENABLE_RICH_TEXT_EDITOR` | ⚠️ Partial | CDN loading issues |
| Comment system | `ENABLE_COMMENTS` | 🔧 Scaffold | No UI or data model |
| Slash commands | `ENABLE_SLASH_COMMANDS` | 🔧 Scaffold | Requires rich text |
| Performance logging | `ENABLE_PERFORMANCE_LOGGING` | ✅ Working | Console timing output |

---

## Project structure

```
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
```

---

## For AI assistants

- **Read `docs/AI_WORKFLOW.md`** for the canonical markdown task protocol.
- **Read `AGENTS.md`** for build commands, code style, and multi-agent coordination rules.
- **Read `core-package/AI_GUIDE.md`** for the portable summary.

---

## Known issues

| Issue | Status |
|-------|--------|
| Tiptap CDN extension loading fails intermittently | ⚠️ Needs bundling fix (P0) |
| Feature toggle click handlers on dynamic switches unresponsive | ⚠️ Known (#4) |
| Rich text editor never attached to Notes field in form | 🔧 In progress |
| Phase 2 tests expect `TiptapEditor` class that doesn't exist | 🔧 Test/implementation mismatch |

---

## Testing

- **Unit tests**: Load `docs/architecture/tests/unit-tests.js` in browser console
- **Phase 2 tests**: `docs/architecture/tests/phase2-tests.js`
- **Debug mode**: `localStorage.setItem('debugMode', 'true'); location.reload();`
- **Test plans**: See `docs/testing/` for detailed test matrices

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
