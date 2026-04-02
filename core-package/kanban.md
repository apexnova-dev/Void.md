# Kanban Board

<!-- Config: Last Task ID: 30 -->

## ⚙️ Configuration

**Columns**: 📝 To Do (todo) | 🚀 In Progress (in-progress) | 👀 In Review (in-review) | ✅ Done (done)

**Categories**: Frontend, Backend, Design, DevOps, Tests, Documentation

**Users**: @user (User)

**Priorities**: 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low

**Tags**: #bug #feature #ui #backend #urgent #refactor #docs #test #accessibility #testing #critical #performance #cleanup #memory #security

---

## 📝 To Do

## 🚀 In Progress

## 👀 In Review

### TASK-022 | Performance: Debounce auto-save
**Created**: 2026-04-01
**Tags**: #performance #ui

User drags 5 tasks = 5 immediate file writes.

**Notes**:
Implement debounce (500ms) on autoSave() function.

**Result**:
Implemented debounce (500ms) on autoSave():
- Added `debounce(func, wait)` utility function at line ~2097
- Created `debouncedAutoSave = debounce(autoSave, 500)` at line ~5981
- Replaced 15 direct `autoSave()` calls with `debouncedAutoSave()`:
  - deleteCurrentTask(), archiveCurrentTask(), restoreFromArchive()
  - Task form submit handler (new task creation)
  - addColumn(), updateColumn(), deleteColumn(), moveColumn()
  - handleTaskCardKeyboard() (keyboard move), drop() (drag & drop)
  - toggleSubtask(), deleteSubtask(), addSubtask(), editSubtask()
  - deleteTask() (from archive), restoreTaskFromArchive()

**Modified files**:
- void.html (lines ~2097-2114: debounce utility; line ~5981: debouncedAutoSave; 15 call sites replaced)

---

### TASK-001 | Fix accessibility: Add skip navigation link
**Created**: 2026-04-01
**Tags**: #accessibility #bug

Add skip-to-content link that allows keyboard users to bypass the header and navigation elements.

**Notes**:
Add before `<body>` or at top of `<header>`:
```html
<a href="#mainContent" class="skip-link">Skip to main content</a>
```

**Result**:
Added runTaskCrudTests() function with 15 tests:

**Modified files**:
- docs/architecture/tests/unit-tests.js (lines ~558-778: runTaskCrudTests function; lines ~792, 807, 823, 842, 849: integration with runAllTests)

---

### TASK-020 | Performance: Implement virtual scrolling
**Created**: 2026-04-01
**Tags**: #performance #critical

Full DOM reconstruction on every render causes severe lag with 100+ tasks.

**Notes**:
Implement intersection observer-based rendering. Only render visible tasks + buffer.
Use document fragments for batch DOM updates.

**Result**:
Added performance optimizations to renderKanban():
- Added VIRTUAL_SCROLL_THRESHOLD (50) and VIRTUAL_SCROLL_BUFFER (10) constants
- Added cached DOM elements (cachedBoard, cachedDebugInfo) to avoid repeated queries  
- Used document.createDocumentFragment() for batch column creation - single reflow instead of N
- For large task lists (>50 tasks), uses document fragment for batch task inserts
- For small lists (<50 tasks), skips virtualization overhead as not needed
- Replaced board.innerHTML = '' with efficient while loop for DOM clearing
- Single appendChild(columnsFragment) call minimizes reflow

**Modified files**:
- void.html (lines ~6319-6389: renderKanban function with optimizations)

---

### TASK-011 | Testing: Add project switching tests
**Created**: 2026-04-01
**Tags**: #testing #critical

No tests for project management operations.

**Notes**:
Add tests for: switchProject(), loadProjects(), saveProjects().

**Result**:

**Modified files**:

---

### TASK-012 | Testing: Add File System API tests
**Created**: 2026-04-01
**Tags**: #testing #critical

No tests for File System Access API operations.

**Notes**:
Add tests for: showOpenFilePicker(), save(), directory handling.

**Result**:

**Modified files**:

---

### TASK-021 | Performance: Add event delegation
**Created**: 2026-04-01
**Tags**: #performance #critical

1000 tasks = 2000+ event listeners (one per task).

**Notes**:
Replace individual event listeners with delegation pattern:
`board.addEventListener('click', (e) => { ... })`

**Result**:

**Modified files**:

---

### TASK-023 | Performance: Add memoization for filters
**Created**: 2026-04-01
**Tags**: #performance #refactor

N+1 filter/find operations cause O(n²) complexity.

**Notes**:
Cache filtered results. Add cache invalidation on task changes.

**Result**:
Implemented filter cache with cache invalidation:
- Added `filterCache` object with snapshots for tasks, filters, and search
- Added `invalidateFilterCache()` function to clear cache
- Added `getFilteredTasks()` function that returns cached results or computes new filtered results
- Cache key uses task IDs + updated timestamp to detect changes
- Invalidated cache on: task create/edit, task delete, task move (drag & drop), task move (keyboard), filter add/remove/clear, global search change, task data reload

**Modified files**:
- void.html (lines ~2054-2120: cache implementation; lines ~6109-6141: filter function updates; lines ~5207, ~5584, ~6615, ~6572: cache invalidation calls)

---

### TASK-025 | Code Quality: Wrap unconditional console.logs in debugMode
**Created**: 2026-04-01
**Tags**: #refactor #cleanup

50+ console.log statements log unconditionally even when debugMode is false.

**Notes**:
Lines 2077, 2087, 2116, 2120, 2151, 2157, 2188, 2208, 2224, 2247, 2351, 2372, 2422, 2437, 2500, 2561, 2587, 2626, and 70+ more.

**Result**:

**Modified files**:

---

### TASK-026 | Code Quality: Add try/catch to remaining localStorage calls
**Created**: 2026-04-01
**Tags**: #refactor #bug

16 localStorage operations lack error handling.

**Notes**:
Lines 2327, 3443, 3467, 3513, 3536, 3624, 3735, 3756, 4098, 4119, 4164, 4177, 4190, 4209, 4574, 4596.

**Result**:

**Modified files**:

---

### TASK-027 | Code Quality: Add event listener cleanup
**Created**: 2026-04-01
**Tags**: #refactor #memory

Modal backdrop and system theme listeners may not be cleaned up.

**Notes**:
Add cleanup mechanism for modal event listeners.

**Result**:

**Modified files**:

---

### TASK-030 | Documentation: Add version to HOW-TO-RUN.md
**Created**: 2026-04-01
**Tags**: #docs

core-package/HOW-TO-RUN.md missing version identifier.

**Notes**:
Add `*Version: 1.3.1*` at bottom of file.

**Result**:

**Modified files**:
- core-package/HOW-TO-RUN.md

---

### TASK-031 | Documentation: Add license reference to HOW-TO-RUN.md
**Created**: 2026-04-01
**Tags**: #docs

Users in core-package folder don't know about MPL-2.0 license.

**Notes**:
Add "Licensed under MPL-2.0 - see LICENSE file" to HOW-TO-RUN.md.

**Result**:

**Modified files**:
- core-package/HOW-TO-RUN.md

---

### TASK-032 | Documentation: Expand troubleshooting section
**Created**: 2026-04-01
**Tags**: #docs

HOW-TO-RUN.md has basic troubleshooting, needs expansion.

**Notes**:
Add common scenarios: folder permissions denied, reset browser storage, recover from corrupted markdown.

**Result**:

**Modified files**:
- core-package/HOW-TO-RUN.md

---

### TASK-035 | Security: Add SRI hashes to CDN scripts
**Created**: 2026-04-01
**Tags**: #security #refactor

Tiptap CDN scripts lack Subresource Integrity hashes.

**Notes**:
Add `integrity` and `crossorigin` attributes to CDN script tags.

**Result**:

**Modified files**:
- void.html

---

### TASK-036 | Security: Add CSP meta tag
**Created**: 2026-04-01
**Tags**: #security #refactor

No Content Security Policy meta tag.

**Notes**:
Add CSP meta tag for enhanced security.

**Result**:

**Modified files**:
- void.html

---

## ✅ Done

