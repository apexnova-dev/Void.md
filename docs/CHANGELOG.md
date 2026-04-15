# Changelog — System logs

All notable changes to the Void.md project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.4.0] - 2026-04-15

### Added

- **Three-Theme System**: Complete Light/Dark/Neon City theme implementation
  - CSS variable-based theming with smooth transitions
  - Theme persistence across sessions
  - Auto-detection of system preferences
  - Dedicated theme toggle in Settings modal
- **Rich Text Editor**: Full Tiptap-based WYSIWYG editor for task notes
  - Complete formatting toolbar (bold, italic, underline, code)
  - Heading levels (H1-H6) support
  - Bullet and numbered lists
  - Blockquotes and code blocks
  - Link insertion and management
  - Markdown import/export compatibility
  - Loading feedback with spinner and status messages
  - Auto-initialization on first use
  - Fallback to plain text when unavailable
- **Keyboard Shortcuts**: Productivity-focused hotkey system
  - `Ctrl+N` / `Cmd+N` - Create new task
  - `Ctrl+K` / `Cmd+K` - Open command palette
  - `Ctrl+S` / `Cmd+S` - Save current task
  - `Escape` - Close modals
  - Arrow key navigation between columns
- **Form Auto-Save**: Draft recovery system
  - Automatic draft saving every 30 seconds
  - Draft persistence across page reloads
  - "Restore draft?" prompt when returning to forms
  - Configurable auto-save interval in Settings
- **Comprehensive Test Suite**: 48 integration tests across 6 workflows
  - Task creation workflow tests (8 tests)
  - Task editing workflow tests (8 tests)
  - Archive workflow tests (8 tests)
  - Search functionality tests (8 tests)
  - Import/export workflow tests (8 tests)
  - Theme switching tests (8 tests)
- **Drag & Drop Tests**: Automated testing for Kanban interactions
  - Column-to-column drag tests
  - Reordering within column tests
  - Touch device drag simulation
  - Accessibility keyboard drag tests
- **Markdown Parsing Tests**: XSS prevention validation
  - Script tag injection tests
  - Event handler injection tests
  - HTML entity encoding tests
  - Fenced code block security tests

### Changed

- **Neon City Kanban Board**: Multi-color column system
  - Each column gets unique accent color (cyan, magenta, lime, amber)
  - Gradient column headers with neon glow effects
  - Improved column separation with distinct borders
  - Enhanced task card hover states per column theme
- **Neon-Styled Modals**: Complete modal redesign
  - Gradient modal headers with neon accent
  - Glow effects on interactive elements
  - Improved contrast ratios for accessibility
  - Consistent modal sizing (90vh height, responsive width)
- **System-Style Headers**: New header naming convention
  - Headers prefixed with "//" for system-style aesthetic
  - Improved visual hierarchy in modal headers
  - Consistent typography across all modals
- **Button Styling Overhaul**: Enhanced interactive elements
  - Gradient buttons with hover lift effects
  - Improved focus states for keyboard navigation
  - Consistent sizing across all button variants
  - Better disabled state visibility
- **CSS Architecture**: Extracted class system
  - Centralized utility classes in CSS variables
  - Reduced inline styles for maintainability
  - Component-specific CSS organization
  - Better theme override support

### Fixed

- **Priority Save Bug**: Regex pattern fix in priority field
  - Fixed `[^a-zA-Z0-9\s-_]` pattern to properly escape hyphen
  - Changed to `[^a-zA-Z0-9\s\-_]` for correct regex behavior
  - Priority now saves correctly across all task operations
  - Prevents data loss on priority field validation
- **Feature Toggle Switches**: Click handler restoration
  - Fixed event delegation for dynamically created toggles
  - Proper state synchronization with `localStorage`
  - Visual feedback on toggle interaction
  - Settings modal now properly displays feature states
- **Task Card Button Styling**: Visual alignment fixes
  - Consistent button sizing on task cards
  - Improved spacing between action buttons
  - Better hover states for card buttons
  - Fixed z-index issues with overlapping elements
- **Neon City Text Contrast**: Fixed readability on bright neon backgrounds
  - All primary buttons (`.btn-primary`) now use dark text (#000) on cyan-purple gradients
  - Header buttons (Folder, Settings, Report) now have proper dark text in Neon City mode
  - Filter "+" buttons (`.filter-btn-sm`) now use dark text on gradients
  - Tiptap toolbar active buttons use dark text (#000) on neon gradients
  - Column count badges have darker background (rgba(0,0,0,0.6)) for better contrast
  - Secondary buttons (Clear Filters, Settings) remain cyan outline style for visual hierarchy

### Security

- **XSS Vulnerability Fix**: Sanitization in `markdownToHtml()`
  - Added HTML entity encoding for all user input
  - Removed dangerous HTML tags (`<script>`, `<iframe>`, `<object>`)
  - Stripped event handlers (`onclick`, `onerror`, etc.)
  - Implemented CSP-compatible sanitization approach
  - Added comprehensive XSS test suite
- **CSP Enhancement**: Strict Content Security Policy implementation
  - `default-src 'self'` - Only allow same-origin resources
  - `script-src 'self' 'unsafe-inline'` - Controlled inline scripts
  - `style-src 'self' 'unsafe-inline'` - Controlled inline styles
  - `img-src 'self' data: blob:` - Allow data URIs for icons
  - `connect-src 'self'` - Restrict external connections
  - `frame-ancestors 'none'` - Prevent clickjacking
- **Additional Security Headers**:
  - `X-Frame-Options: DENY` - Frame protection
  - `X-Content-Type-Options: nosniff` - MIME type protection
  - `Referrer-Policy: strict-origin-when-cross-origin` - Privacy protection
  - `Permissions-Policy` - Restrict browser features

### Known Issues

- **Tiptap Extension Loading**: Extensions (StarterKit, Link, Placeholder) may fail to load on first attempt
  - Extensions require `window.Tiptap` to be available when their UMD bundles execute
  - Current workaround: Error handling falls back to plain text with user notification
  - Future fix: Bundle Tiptap directly or use ES modules instead of CDN UMD bundles

---

## [1.3.3] - 2026-04-10

### Added

- **Feature flag system:** Branch-based feature visibility with `branchLevel` property ('experimental' or 'production')
- **Settings modal:** New "Experimental Features" section dynamically populated based on branch:
  - `experimental` branch: "🔬 Experimental Features" - all feature toggles visible
  - `production` branch: "✨ Featured Upgrades" - only promoted features visible
  - `core` branch: No section (basic engine only)
- **Report button:** "🐛 Report" button in header opens GitHub Issues with pre-filled template including browser info and version
- **Feature promotion workflow:** Features can be promoted from 'experimental' to 'production' by changing `branchLevel` property

### Changed

- **Header layout:** +Task button moved before Project selector with glow effect styling
- **Logo positioning:** Logo restored to far left, +Task button placed before Project dropdown

### Fixed

- **Task card clicks:** Fixed `initEventDelegation()` to be called on page load, not just on task creation
- **CI/CD:** Removed environment restriction from GitHub Pages workflow; simplified test workflow (security audit only)
- **Security headers:** Added CSP, X-Frame-Options, and SRI integrity hashes for CDN resources

### Known Issues

- **Feature toggles in Settings:** Click handlers on dynamically created toggle switches are not responding (see [#4](https://github.com/glyons-smemsc/Void.md/issues/4))

---

*For earlier versions, see the git history.*
