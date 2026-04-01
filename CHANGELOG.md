# Changelog — System logs

All notable changes to the Void.md project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.3.0] - 2026-03-31

### Added

- **Void.md** product identity: root `logo.svg` (neon VOID.MD mark), `GEMINI.md`, `AGENT.md`, and `.cursor/rules/void-protocol.mdc` (read `AI_WORKFLOW.md` before editing `kanban.md`)
- `AI_WORKFLOW.md`: master protocol framing (Kanban H1/H2/H3 shape, metadata keys, archive rules, data sovereignty)

### Changed

- Renamed **`task-manager.html` → `void.html`** (repository root and `core-package/`); updated tests, docs, and scripts
- **Neon City** default: first visit uses dark theme; `<head>` script + `initTheme()`; dark accent tuned to cyan/magenta palette
- `README.md`: manifesto (*Visual Kanban. Plaintext Soul. No Cloud.*), centered logo, Pseudo-IT sovereignty section
- Global documentation rename from legacy “Markdown Task Manager” strings to **Void.md** where applicable

---

## [1.3.1] - 2026-04-01

### Fixed

- **Theme:** Inline `<head>` script sets `data-theme` before paint from `preferredTheme`; `initTheme()` syncs without calling `setTheme()` on load (avoids duplicate changelog noise; respects saved light/dark)
- **Notes editor status:** Plain-text status line when rich text is unavailable no longer implies Markdown-as-fallback when `#featureRichTextSwitch` is missing; branches on rich-text flag and toggle presence

---

## [Unreleased]

### Added

- Body scroll lock when any modal is open (`body.modal-open` / `setBodyModalOpen`) so the page behind does not scroll
- Close modal by clicking the backdrop (outside the modal content) for all modals
- Inline `onclick` fallbacks on modal trigger buttons (New Task, Settings) so modals open even if DOMContentLoaded listeners fail
- Modal backdrop close init deferred to `DOMContentLoaded` so listeners attach after DOM is ready

### Changed

- Documentation: GitHub clone and repository links use [https://github.com/glyons-smemsc/Void.md](https://github.com/glyons-smemsc/Void.md)
- **Modals – sizing and layout**
  - **New Task modal:** Width 95% / max 880px, height 90vh; form body scrolls inside; larger textareas and 2×2 date grid
  - **Task detail modal:** Width 95% / max 680px, height 90vh; body scrolls inside
  - **Settings modal:** Width 95% / max 560px, height 90vh; settings body scrolls inside
- **Header (from docs/UI_UX_RECOMMENDATIONS.md):**
  - Explicit `</header>`; right side grouped into `.header-actions`, `.header-project-group`, `.header-buttons`
  - Visible "Project" label and `.header-project-select` styling (min-height 40px, border-radius 8px)
  - Responsive header: flex-wrap, smaller title on narrow viewports
- **Filter bar:** Aligned with header (max-width 1400px, padding 0 2rem via `.filter-bar-inner`); filter labels use muted style
- **Accessibility:** `aria-label` on icon-only header buttons (Settings, Folder, New task, Rename, Delete, Clear search); `aria-label="Switch project"` on project select

### Fixed

- Defensive null checks in DOMContentLoaded so missing elements (projectSelector, selectFolderBtn, archiveSearch, newTaskForm) do not throw and break init
- Project group show/hide: single `#headerProjectGroup` toggled in `updateProjectSelector` and when removing last project

---

## [1.1.2] - 2026-01-20

### Added

- Welcome screen project selector for quick project switching
- Recent projects list with last used dates on welcome screen
- "Add new project..." option in project selector
- Board management section in Settings modal (Columns, Archives)
- Helper functions for navigation between modals:
  - `openColumnsModalFromSettings()`
  - `openArchiveModalFromSettings()`
- 7-level dark mode color hierarchy for rich, dimensional appearance
- Multi-level shadow system (`shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-hover`)
- Enhanced form focus states with accent-colored rings
- Custom dropdown arrows using SVG data URIs

### Changed

- **Complete UI/UX overhaul**: Transformed interface with professional-grade design
- **Header cleanup**: Simplified header from 10 buttons to 6 essential ones
  - Before: `[Language] [🌙] [⚙️] [Project] [✏️] [🗑️] [📁] [➕] [📦] [⚙️ Columns]`
  - After: `[⚙️ Settings] [Project] [✏️] [🗑️] [📁 Folder] [➕ Task]`
- **Dark mode complete redesign**: Rich 7-level color hierarchy:
  - `#0a0a0a` Background (darkest)
  - `#141414` Header
  - `#1a1a1a` Filter bar
  - `#1e1e1e` Kanban columns
  - `#252525` Task cards
  - `#2a2a2a` Modals
  - `#e5e5e5` Text (brightest)
- **Form styling**: All inputs now use global CSS variables for theme consistency
- **Kanban columns**: Lighter gray with visible borders and enhanced shadows
- **Task cards**: Hover lift effect with accent-colored border
- **Modals**: Darker backdrop (85% opacity) with backdrop blur
- **Buttons**: Visible borders with hover lift effects

### Fixed

- **Task creation**: Added missing `generateTaskId()` function
- **Modal closing**: Changed `closeModal()` to `closeTaskModal()` for correct task form closure
- **Null reference errors**: Added 8+ null checks across codebase
- **High-risk DOM assignments**: Fixed 5 `.textContent =` and 3 `.innerHTML =` assignments
- **Syntax errors**: Removed duplicate settings modal code and fixed bracket structure
- **Bright white inputs**: Removed 20+ hardcoded white backgrounds breaking dark mode
- **Form labels**: Removed hardcoded `#333` color from labels
- **Theme consistency**: All form elements now properly support dark/light modes

### Security

- No external CDN dependencies - all code contained in single HTML file
- Local storage only - no data transmitted externally
- Explicit file permissions via File System Access API

---

## [1.1.1] - 2025-01-15

### Added

- **Change Log Manager**: Structured logging system with:
  - Semantic categorization (`feature`, `fix`, `enhancement`, `docs`, `perf`, `refactor`)
  - Component tracking (`core`, `i18n`, `theme`, `system`)
  - Impact assessment (`breaking`, `non-breaking`, `enhancement`, `bugfix`)
  - Automatic persistence to localStorage with fallback handling
  - Rich metadata (timestamp, version, author, description, impact)
- **Version Management System**:
  - Semantic versioning support (`major.minor.patch`)
  - Automatic version reference updates
  - Robust version parsing and validation
  - Complete audit trail of modifications
- **Developer Documentation Console** (`TaskManagerDocumentation`):
  - `version()` - Display current version
  - `changes()` - View complete change history
  - `releaseNotes(fromVersion)` - Generate professional release notes
  - `systemInfo()` - Show complete system information
  - `help()` - Display all available commands
- **Release Notes Generation**: Automatic markdown-formatted release notes with visual indicators and impact badges

### Changed

- Dark mode system foundation established
- UI enhancements now tracked with proper change logging
- All modifications now attributed to components with impact assessment

### Fixed

- Initial dark mode implementation stability
- Version parsing edge cases

### Security

- Change log persists locally with no network requests
- Version data stored in browser localStorage only

---

## [1.1.0] - Prior to 2025-01-15

### Added

- **Core Kanban Functionality**:
  - Interactive Kanban board with drag & drop support
  - Customizable columns (create, rename, delete)
  - Adaptive layout centered on full screen width
  - Task counters per column
  - Default columns: 📝 To Do, 🚀 In Progress, 👀 Review, ✅ Done

- **Complete Task Management**:
  - Task creation with auto-generated IDs (TASK-XXX)
  - Rich metadata fields:
    - Title (unique identifier and short description)
    - Priority (Critical, High, Medium, Low with color coding)
    - Category (customizable: Frontend, Backend, etc.)
    - Assignment (multiple users: @user1, @user2)
    - Tags (multiple: #bug, #feature, etc.)
    - Dates (creation, start, due, end)
    - Description with Markdown support
  - Subtasks system with progress bar and visual counters
  - Complete task editing modal with instant preview
  - Auto-save on all modifications

- **Advanced Filters System**:
  - Priority filter (🔴🟡🟢 color-coded badges)
  - Tags filter (🔵 blue bubbles)
  - Categories filter (🟣 purple bubbles)
  - Users filter (🟢 green bubbles)
  - Cumulative filtering (AND logic)
  - Individual filter removal (✕ on bubble)
  - Clear all filters at once
  - Smart autocomplete with historical values

- **Archive System**:
  - Manual archiving of completed tasks
  - Organization by sections (by month, by sprint)
  - Dedicated archive view via Settings
  - Search functionality in archives
  - Task restoration to original column
  - Metadata preservation on restore
  - Persistent autocomplete history

- **Global Search**:
  - Real-time filtering across all active tasks
  - Search through archived tasks
  - Search in titles, descriptions, and metadata
  - Filter results by column

- **Interface Translation**:
  - English and French language support
  - Complete UI translation
  - Seamless language switching

- **Multi-Project Support**:
  - Last 10 projects memorized
  - Quick project selector in header
  - Custom names per project
  - IndexedDB storage for directory handles
  - Auto-restore last project on launch

- **Auto-Save System**:
  - Immediate file writes on each modification
  - No manual save button required
  - Compatible with external file editing

- **AI Assistants Integration**:
  - Complete guidelines via `AI_WORKFLOW.md`
  - Configuration templates for:
    - Claude (`CLAUDE.md`)
    - GitHub Copilot (`.github/copilot-instructions.md`)
    - ChatGPT (`CHATGPT.md`)
    - Gemini (`.gemini/instructions.md`)
    - Qwen (`QWEN.md`)
    - Codeium/Windsurf (`.windsurf/instructions.md`)
    - OpenAI CLI (`OPENAI_CLI.md`)
  - Claude Code skill for automated task management
  - Strict format for AI-generated tasks
  - Task reference in Git commits (`TASK-XXX`)

### Changed

- Initial stable release structure
- Optimized for 1000+ tasks performance
- Single HTML file architecture (no dependencies)

### Deprecated

- None in this version

### Removed

- None in this version

### Fixed

- Core file system access functionality
- Markdown parsing for task display
- Drag and drop stability
- Cross-browser compatibility (Chrome 86+, Edge 86+, Opera 72+)

### Security

- 100% local data - nothing sent to internet
- No tracking or telemetry
- No account authentication required
- Explicit user-controlled file access permissions
- All JavaScript code readable and auditable
- No external CDN resources

---

## Version History

| Version | Date | Status |
|---------|------|--------|
| [1.1.2] | 2026-01-20 | Current |
| [1.1.1] | 2025-01-15 | Stable |
| [1.1.0] | Prior | Stable |

---

## Related Documentation

- [Release Notes v1.1.2](./RELEASE_NOTES_v1.1.2.md)
- [Release Notes v1.1.1](./RELEASE_NOTES_v1.1.1.md)
- [README.md](./README.md) - Main documentation
- [AI_WORKFLOW.md](./AI_WORKFLOW.md) - AI integration guidelines

## Links

- [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
- [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
- [Project Repository](https://github.com/glyons-smemsc/Void.md)

---

*Changelog generated automatically from release notes and code changes.*
