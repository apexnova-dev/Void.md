# Experimental Features (v1.4.0) – Assessment

**Date**: April 2026  
**Purpose**: Document the current state of experimental features and recent completions.

---

## Summary

| Feature | In app | Actually works? | Recommendation |
|--------|--------|------------------|----------------|
| **Rich Text Editor** | Toggle + full integration | **✅ YES** – Fully functional Tiptap editor with toolbar | Production-ready |
| **Comments System** | Hidden from UI | **No** – not implemented | Keep hidden until v2.0 |
| **Slash Commands** | Hidden from UI | **No** – not implemented | Keep hidden until implemented |
| **Performance Logging** | Toggle + console logs | **Yes** (minimal) | Keep for debugging |
| **Three-Theme System** | Two toggles (Base + Neon) | **✅ YES** – Light/Dark/Neon City | Production-ready |

---

## 1. Rich Text Editor (Tiptap) — ✅ COMPLETE

### What's Implemented

- **Feature flag** `ENABLE_RICH_TEXT_EDITOR` and Settings toggle.
- **CDN loading**: `loadTiptapLibrary()` loads `@tiptap/core`, `@tiptap/starter-kit`, `@tiptap/extension-link`, and `@tiptap/extension-placeholder` from unpkg/jsDelivr.
- **Full Editor Integration**:
  - Complete Tiptap wrapper with create/destroy/setContent/getContent/getText
  - Toolbar with formatting: Bold, Italic, Code, Bullet lists, Numbered lists, Blockquotes, Headings (H1-H3), Links
  - Undo/Redo functionality
  - Placeholder text support
  - Keyboard shortcuts (Ctrl+B, Ctrl+I, Ctrl+K for links)
- **Mode Toggle**: Plain/Rich dropdown in task form
- **Storage layer**: `RichContentStorage` for rich content persistence
- **Status UI**: Accurate status messages showing actual capability level

### How It Works

1. User enables Rich Text Editor in Settings
2. Library lazy-loads from CDN on first use
3. In task form, user can switch between Plain and Rich modes
4. Rich mode shows Tiptap editor with full formatting toolbar
5. Content saved as Markdown (converted from Tiptap HTML)
6. Graceful fallback to plain text if CDN unavailable

### Production Status

**READY FOR PRODUCTION** – The Rich Text Editor is no longer experimental. It provides a complete word-processing experience within the Kanban workflow.

---

## 2. Comments System — 🔮 PLANNED

### Current State

- Feature flag exists but toggle is **hidden from UI**
- No UI, data model, or logic implemented
- Domain analysis (`DOMAIN_ANALYSIS_v1.2.0_COMMENTS.md`) documents full design

### Recommendation

Keep hidden until v2.0 development begins. This is a major feature requiring:
- Thread data model
- UI for viewing/adding comments
- @mentions system
- Reactions support

---

## 3. Slash Commands — 🔮 PLANNED

### Current State

- Feature flag exists but toggle is **hidden from UI**
- No handler for "/" commands
- Depends on Rich Text Editor (now complete)

### Recommendation

Keep hidden until implemented. When ready:
- Type "/" in editor to show command palette
- Quick formatting, task creation, etc.

---

## 4. Performance Logging — ✅ STABLE

### Current State

- Toggle available in Settings > Debugging
- Logs performance metrics to console
- Minimal overhead

### Recommendation

Keep as-is. Useful for development and troubleshooting.

---

## 5. Three-Theme System — ✅ NEW FEATURE

### What's Implemented

**Two-Part Theme System:**

1. **Base Theme Toggle** (Light/Dark)
   - Switches between Light and Dark modes
   - Stored in `localStorage.baseTheme`

2. **Neon City Mode Toggle** (On/Off)
   - Activates cyberpunk aesthetic
   - Works on top of either base theme
   - Stored in `localStorage.neonMode`

### Theme Combinations

| Base | Neon | Result |
|------|------|--------|
| Light | OFF | ☀️ Clean Light mode |
| Light | ON | 🌃 Neon with light undertones |
| Dark | OFF | 🌙 Standard Dark mode |
| Dark | ON | 🌆 Full Neon City cyberpunk |

### Neon City Features

- Animated gradient borders on columns
- Neon glow effects (cyan/magenta/purple)
- Gradient headers in modals
- JetBrains Mono font for headers
- System-style "//" prefix on modal titles
- Multi-color Kanban columns (position-based)

### Production Status

**READY FOR PRODUCTION** – Provides three distinct visual experiences suitable for different moods and environments.

---

## Changelog

### April 2026 Update

**Completed:**
- ✅ Rich Text Editor fully implemented
- ✅ Three-theme system (Light/Dark/Neon City)
- ✅ Keyboard shortcuts
- ✅ Form auto-save
- ✅ Hidden Comments and Slash Commands from UI (not ready)

**Next Steps:**
- Focus on v1.4 stability
- Begin v2.0 planning (Comments, Slash Commands, Sync)

---

*Last updated: April 14, 2026*
