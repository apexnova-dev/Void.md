# Architecture Overview - Void.md v1.3.1

**Version**: 1.3.1  
**Last Updated**: April 2026  
**Status**: Current Implementation

---

## 1. Implementation Status Summary

This document provides an authoritative overview of what is implemented in Void.md v1.3.1 vs. what remains planned/specified.

### 1.1 Implemented Features

| Feature | Status | Notes |
|---------|--------|-------|
| **Rich Text Editor (Tiptap)** | ✅ Implemented | Tiptap editor for task Notes with basic formatting (bold, italic, code, lists) |
| **RichContentStorage** | ✅ Implemented | IndexedDB-based storage for rich HTML content per task |
| **Feature Flag System** | ✅ Implemented | `FEATURE_FLAGS` with toggle UI in Settings |
| **Multi-Project Support** | ✅ Implemented | Project switching, creation, deletion |
| **Theme System** | ✅ Implemented | Light/dark mode with smooth transitions |
| **Filter Bar** | ✅ Implemented | Tag, category, priority filters |
| **Archives** | ✅ Implemented | Archive modal with search |
| **Localization** | ✅ Implemented | Language selector |

### 1.2 Planned/Specified (Not Implemented)

| Feature | Status | Reference |
|---------|--------|-----------|
| **Threaded Comments** | 🔶 Specified | `ARCHITECTURE_SPECIFICATION_v1.2.0.md` |
| **Slash Commands** | 🔶 Specified | `command-registry.md` |
| **@mentions, #tags** | 🔶 Specified | `core-concepts.md` |
| **Auto-complete** | 🔶 Specified | `data-models.md` |
| **Reactions** | 🔶 Specified | `core-concepts.md` |

---

## 2. Current Architecture

### 2.1 Single-File Application

```
void.html (6844 lines)
├── CSS (embedded in <style>)
├── JavaScript (embedded in <script>)
└── HTML Structure
```

- **No external dependencies** (intentional)
- **CDN fallbacks** for Tiptap (loaded on-demand)
- **localStorage** for settings and drafts
- **IndexedDB** (via RichContentStorage) for rich text content
- **File System Access API** for kanban.md persistence

### 2.2 Core Components

```
Window-scoped objects:
├── FEATURE_FLAGS           // Feature toggle configuration
├── TiptapEditor            // Rich text editor (Tiptap wrapper)
├── RichContentStorage      // IndexedDB storage for rich content
├── TaskManager             // Main task management
├── ProjectManager          // Project switching/management
├── ThemeManager            // Theme switching
└── LocalizationManager     // i18n support
```

### 2.3 Feature Flag System

```javascript
const FEATURE_FLAGS = {
    ENABLE_RICH_TEXT_EDITOR: { enabled: false, label: 'Rich Text Editor', ... },
    ENABLE_COMMENTS: { enabled: false, label: 'Comments System', ... },
    ENABLE_SLASH_COMMANDS: { enabled: false, label: 'Slash Commands', ... },
    ENABLE_PERFORMANCE_LOGGING: { enabled: false, label: 'Performance Logging', ... }
};
```

**Current v1.3.1 behavior**: `ENABLE_RICH_TEXT_EDITOR` defaults to `false`, but can be enabled in Settings → Experimental Features.

---

## 3. Rich Text Editor Implementation

### 3.1 Tiptap Integration

The Tiptap editor is loaded via CDN when the feature is enabled:

1. **Enable via Settings** → Toggle "Rich Text Editor"
2. **Select mode** → Choose "Rich Text (Tiptap)" from dropdown
3. **Task form** shows toolbar with formatting buttons

### 3.2 Available Formatting

| Button | Action | Shortcut |
|--------|--------|----------|
| **B** | Bold | Ctrl/Cmd + B |
| *I* | Italic | Ctrl/Cmd + I |
| </> | Code | - |
| • | Bullet List | - |
| 1. | Ordered List | - |
| Clear | Remove Formatting | - |

### 3.3 Storage

Rich content is stored in IndexedDB via `RichContentStorage`:

```javascript
// Methods
RichContentStorage.saveRichNotes(taskId, htmlContent);
RichContentStorage.loadRichNotes(taskId);
RichContentStorage.deleteRichNotes(taskId);
RichContentStorage.hasRichNotes(taskId);
RichContentStorage.getAllTaskIds();
RichContentStorage.getStats();
```

---

## 4. Data Storage

### 4.1 Primary Storage (File System)

- **kanban.md** - Tasks and project data
- **archive.md** - Archived tasks

### 4.2 Secondary Storage

| Storage | Purpose |
|---------|---------|
| **localStorage** | Settings, feature flags, editor mode preference |
| **IndexedDB** (RichContentStorage) | Rich HTML content for tasks |

### 4.3 Rich Content Storage Format

```javascript
// localStorage format (legacy)
key: `tm_rich_${taskId}`
value: JSON.stringify({ content: "...", taskId: "...", updatedAt: "..." })

// IndexedDB format (current)
objectStore: 'richNotes'
keyPath: 'taskId'
indexes: ['updatedAt']
```

---

## 5. UI/UX Implementation

### 5.1 Header Structure (v1.3.1)

```html
<header class="header">
  <div class="header-content">
    <h1>Void.md <span>v. 1.3.1</span></h1>
    <div class="header-actions">
      <div class="header-project-group">
        <label>Project</label>
        <select id="projectSelector">...</select>
        <button>✏️</button>
        <button>🗑️</button>
      </div>
      <div class="header-buttons">
        <button>⚙️ Settings</button>
        <button>📁 Folder</button>
        <button>➕ Task</button>
      </div>
    </div>
  </div>
</header>
```

### 5.2 Modal Behavior (v1.3.1 Standard)

- **New Task Modal**: Fixed height (90vh), body-only scroll
- **Task Detail Modal**: Fixed height (90vh), body-only scroll
- **Settings Modal**: Fixed height (90vh), body-only scroll
- **Backdrop**: Click to close
- **Keyboard**: Escape to close
- **Body scroll**: Locked when modal open (`body.modal-open`)

### 5.3 Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| > 900px | Full layout |
| 480px - 900px | Wrapped header, smaller title |
| < 480px | Stacked layout |

---

## 6. Branch Strategy

The project uses a three-branch strategy documented in `docs/BRANCHING_AND_BUGFIX_WORKFLOW.md`:

| Branch | Purpose | Base |
|--------|---------|------|
| **production** | Stable, user-facing | main |
| **core** | Minimal, no experimental UI | production |
| **experimental** | Feature work | production |

**Key workflow**: Shared bugfixes → commit to `production` → cherry-pick to `core` and `experimental`.

---

## 7. Testing

### 7.1 Automated Tests

Run in browser console (see `AGENTS.md`):

```javascript
// All tests
fetch('docs/architecture/tests/unit-tests.js')
  .then(r => r.text())
  .then(code => eval(code))
  .then(() => runAllTests())

// Phase 2 tests (Tiptap)
fetch('docs/architecture/tests/phase2-tests.js')
  .then(r => r.text())
  .then(code => eval(code))
  .then(() => runPhase2Tests())
```

### 7.2 Test Suites

| Suite | File | Coverage |
|-------|------|----------|
| Feature Flags | `unit-tests.js` | FEATURE_FLAGS, toggle, storage |
| Fallback | `unit-tests.js` | Editor mode, Tiptap availability |
| Storage | `unit-tests.js` | RichContentStorage CRUD |
| TiptapEditor | `phase2-tests.js` | Editor class methods |
| Integration | `phase2-tests.js` | Form elements, mode switching |

---

## 8. Documentation Map

### 8.1 Architecture Docs

| Doc | Status |
|-----|--------|
| `ARCHITECTURE_SPECIFICATION_v1.2.0.md` | ⚠️ Spec only - comments system |
| `COMPONENT_ARCHITECTURE_v1.2.0.md` | ⚠️ Spec only - comments system |
| `core-concepts.md` | ⚠️ Spec only - mentions planned features |
| `data-models.md` | ⚠️ Spec + implemented RichContentStorage |
| `editor-standards.md` | ✅ Partial - Tiptap implemented |
| `command-registry.md` | ⚠️ Spec only - 60 slash commands |
| `PHASE1_SUMMARY.md` | ⚠️ Outdated - v1.1.2 focus |
| `PHASE2_IMPLEMENTATION_SUMMARY.md` | ✅ Tiptap implemented |

### 8.2 User-Facing Docs

| Doc | Description |
|-----|-------------|
| `README.md` | Main documentation |
| `CHANGELOG.md` | Version history |
| `AGENTS.md` | Developer commands & code style |
| `AI_WORKFLOW.md` | Task format for AI assistants |

### 8.3 Session Docs

| Doc | Focus |
|-----|-------|
| `SESSION_DOCUMENTATION_2026-03-17.md` | Branch strategy, task ID fix |
| `RELEASE_NOTES_v1.1.2.md` | Dark mode overhaul |

---

## 9. Known Issues & Limitations

### 9.1 Browser Compatibility

- **File System Access API**: Chrome, Edge, Opera only
- **Fallback**: localStorage for Firefox/Safari

### 9.2 Feature Limitations

- No real-time collaboration
- No cloud sync
- Single-user operation
- Comments system not implemented

---

## 10. Version History

| Version | Date | Focus |
|---------|------|-------|
| 1.1.0 | - | Initial release |
| 1.1.1 | Jan 2026 | Dark mode foundation |
| 1.1.2 | Jan 2026 | UI/UX overhaul |
| 1.3.1 | Apr 2026 | Rich text editor, feature flags |

---

*Last updated: April 2026*
*This document supersedes older architecture docs for v1.3.1*