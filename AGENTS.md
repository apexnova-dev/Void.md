# 🤖 AGENTS.md - Development Guide for AI Assistants

> **Quick Reference:** For task management protocol, see [`docs/AI_WORKFLOW.md`](docs/AI_WORKFLOW.md) — master protocol for task shape, TASK-XXX IDs, and markdown integrity. Root `AI_WORKFLOW.md` is a compatibility pointer to the same content.

---

## 🎯 Quick Reference for AI Agents

### Key Rules for Task Management

- Preserve **H1** project title, **H2** column sections, and **H3** task headings (`### TASK-XXX | …`)
- **No `##` or `###` inside task bodies**
- Archive only on user request, never automatically
- Document only real work in **Result**, **Modified files**, **Tests performed**

### Product Overview

Void.md — local-first Kanban over Markdown (`kanban.md`, `archive.md`). **No cloud:** data stays on disk you choose.

---

## 🚀 Build/Test Commands

### Running Tests

This is a single-file HTML application with browser-based testing. No npm/build system required.

```bash
# 1. Open the application in a browser
open void.html  # macOS
xdg-open void.html  # Linux
start void.html  # Windows

# 2. Open Developer Console (F12) and run tests:

# Run all unit tests
fetch('docs/architecture/tests/unit-tests.js')
  .then(r => r.text())
  .then(code => eval(code))
  .then(() => runAllTests())

# Run specific test suites
runFeatureFlagTests()      # Feature flag system
runFallbackTests()         # Fallback mechanisms  
runStorageTests()          # Storage functionality

# Run Phase 2 tests (Tiptap editor)
fetch('docs/architecture/tests/phase2-tests.js')
  .then(r => r.text())
  .then(code => eval(code))
  .then(() => runPhase2Tests())

# Run individual Phase 2 tests
runTiptapEditorTests()           # Editor class tests
runRichContentIntegrationTests()  # Rich content storage
runFormIntegrationTests()         # Form integration
```

### Debug Mode

Enable debug mode via Settings or in console:
```javascript
localStorage.setItem('debugMode', 'true');
location.reload();
```

### Manual Testing

Use test page for isolated testing:
```bash
open test-page.html  # Loads void.html in iframe with console capture
```

---

## 📝 Code Style Guidelines

### File Structure

- **Single file architecture**: All code in `void.html`
- **No external dependencies**: All CSS/JS embedded
- **Component organization**: Use comments to separate major sections
- **Version header**: Always include version comment at top

### HTML Structure

```html
<!-- Use semantic HTML5 tags -->
<header class="header">...</header>
<main class="main-content">...</main>
<aside class="sidebar">...</aside>
<footer>...</footer>

<!-- Accessibility: ARIA labels and roles -->
<button aria-label="Close modal" onclick="closeModal()">×</button>
<div role="dialog" aria-modal="true">...</div>
```

### CSS Conventions

```css
/* Use CSS variables for theming - Neon City brand colors */
:root {
    --bg-primary: #f5f5f5;
    --text-primary: #212121;
    --accent: #00d4e8;  /* Neon City cyan */
    --accent-secondary: #ff00ea;  /* Neon City magenta */
}

/* BEM-style naming */
.kanban-column { }
.kanban-column--dragging { }
.task-card__title { }
.task-card__priority { }

/* Responsive design */
@media (max-width: 768px) {
    .kanban-board {
        grid-template-columns: 1fr;
    }
}

/* Smooth transitions for theme switching */
body, .header, .kanban-column, .task-card, .modal-content {
    transition: background-color 0.3s ease, color 0.3s ease;
}
```

### JavaScript Standards

#### Naming Conventions

```javascript
// Use camelCase for variables and functions
let currentTask = null;
function createTaskModal(task) { }

// Use PascalCase for classes
class TaskManager { }
class TiptapEditor { }

// Use UPPER_SNAKE_CASE for constants
const FEATURE_FLAGS = { RICH_TEXT_EDITOR: true };
const STORAGE_KEYS = { PROJECTS: 'taskManager_projects' };

// Use kebab-case for CSS classes and IDs
document.getElementById('task-modal');
element.classList.add('kanban-column');
```

#### Import/Module Pattern

```javascript
// Since we're in a single HTML file, use IIFE patterns
(function() {
    'use strict';
    
    // Module scope
    const TaskManager = {
        init() { /* ... */ },
        createTask() { /* ... */ }
    };
    
    // Expose to global
    window.TaskManager = TaskManager;
})();

// Feature flag pattern
const FEATURE_FLAGS = {
    RICH_TEXT_EDITOR: true,
    EXPERIMENTAL_COMMENTS: false
};
```

#### Error Handling

```javascript
// Always handle async errors with try-catch
async function loadFile(fileHandle) {
    try {
        const file = await fileHandle.getFile();
        const content = await file.text();
        return content;
    } catch (error) {
        console.error('Failed to load file:', error);
        showNotification('Error loading file', 'error');
        return null;
    }
}

// Defensive programming
function sanitizeTaskId(id) {
    if (!id || typeof id !== 'string') {
        throw new Error('Invalid task ID');
    }
    return id.trim();
}

// Null checks before DOM operations
const modal = document.getElementById('task-modal');
if (modal) {
    modal.classList.add('show');
}
```

#### Console Logging

```javascript
// Use debug mode for verbose logging
if (debugMode) {
    console.log('🔄 Updating modals...');
    console.log('✅ Modal updates complete');
}

// Use structured logging for debugging
console.log('Task creation failed:', {
    title: taskTitle,
    error: errorMessage,
    timestamp: new Date().toISOString()
});
```

### Type Patterns (JSDoc)

```javascript
/**
 * Creates a new task with the given properties
 * @param {Object} taskData - Task configuration
 * @param {string} taskData.title - Task title (required)
 * @param {string} [taskData.description] - Task description
 * @param {string} [taskData.priority='Medium'] - Task priority
 * @param {string[]} [taskData.tags=[]] - Task tags
 * @returns {Task|null} Created task object or null if failed
 */
function createTask(taskData) {
    // Implementation
}

// Use JSDoc for complex objects
/**
 * @typedef {Object} Task
 * @property {string} id - Unique task identifier
 * @property {string} title - Task title
 * @property {string} priority - Task priority level
 * @property {string[]} tags - Array of task tags
 * @property {Date} created - Creation date
 */
```

---

## 🎯 Development Workflow

### 1. Making Changes

```bash
# 1. Edit void.html directly
# 2. Test in browser immediately (no build step)
# 3. Use debug mode to verify changes
# 4. Run relevant test suites
```

### 2. Testing Changes

```javascript
// Quick validation in console
TaskManager.createTask({
    title: 'Test Task',
    priority: 'High'
});

// Verify DOM updates
document.querySelectorAll('.task-card').length;

// Check theme switching
document.body.setAttribute('data-theme', 'dark');
```

### 3. Performance Considerations

```javascript
// Debounce frequent operations
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Use requestAnimationFrame for DOM updates
function updateTaskCard(taskId) {
    requestAnimationFrame(() => {
        const card = document.getElementById(`task-${taskId}`);
        if (card) {
            // Update card content
        }
    });
}
```

---

## 🔍 Debugging Guidelines

### Console Commands

```javascript
// Check application state
TaskManager.getCurrentProject();
TaskManager.getAllTasks();
TaskManager.getFeatureFlags();

// Test specific functionality
TaskManager.enableTiptap();
TaskManager.testTiptap();

// Storage debugging
localStorage.getItem('taskManager_projects');
indexedDB.databases();
```

### Common Issues

1. **File System Access API not available**: Use Chrome/Edge/Opera
2. **Tiptap not loading**: Check `FEATURE_FLAGS.RICH_TEXT_EDITOR`
3. **Modal not showing**: Check for duplicate IDs or CSS conflicts
4. **Theme not applying**: Verify CSS variables and data-theme attribute

---

## 📋 Quality Checklist

Before committing changes:

- [ ] Test in Chrome, Edge, and Opera
- [ ] Verify both light and dark themes
- [ ] Check responsive design on mobile
- [ ] Run relevant test suites
- [ ] Ensure no console errors in debug mode
- [ ] Validate HTML structure with semantic elements
- [ ] Check ARIA labels for accessibility
- [ ] Verify smooth theme transitions
- [ ] Test feature flag behavior
- [ ] Confirm proper error handling

---

## 🛠️ Development Tools

### Browser Extensions
- **Chrome DevTools**: Built-in debugging
- **Accessibility Developer Tools**: Check ARIA compliance
- **Lighthouse**: Performance and accessibility audits

### Helpful Console Functions

```javascript
// These are built into the application
TaskManagerDocumentation.testTiptap()           - Test Tiptap loading
TaskManagerDocumentation.enableTiptap()          - Enable rich text editor
TaskManagerDocumentation.getSystemInfo()         - Get system information
TaskManagerDocumentation.testAllFeatures()       - Test all features
```

---

## 📚 Key Files Reference

- `void.html` - Main application file
- `docs/architecture/tests/unit-tests.js` - Core test suite
- `docs/architecture/tests/phase2-tests.js` - Tiptap editor tests
- `docs/architecture/editor-standards.md` - Editor quality criteria
- `docs/UI_UX_RECOMMENDATIONS.md` - UI/UX spec (header, modals, filter bar; most items implemented)
- `docs/AI_WORKFLOW.md` - Task format and workflow guidelines (root `AI_WORKFLOW.md` links here for compatibility)

### Modal and header behavior (current)

- **Modals:** New Task, Task detail, Settings use fixed height (90vh) and body-only scroll; backdrop click and Escape close; body scroll locked when open (`body.modal-open`).
- **Header:** Grouped layout (project group + action buttons), visible “Project” label, responsive; modal triggers have inline `onclick` fallbacks and defensive null checks in DOMContentLoaded.

---

## 🔄 Multi-Agent Coordination Rules

> **Critical:** These rules prevent race conditions and data loss when multiple agents work on shared files.

### ❌ NEVER Do This
- Run multiple agents **in parallel** on the **same file**
- Launch agents simultaneously and let them all write to kanban.md
- Skip coordination when agents share resources

### ✅ ALWAYS Do This

#### 1. Sequential Execution for Shared Files
When agents need to modify the same file (like kanban.md):
```
Agent A completes → Agent B starts → Agent C starts → ...
```
Never: `Agent A, B, C all start at once`

#### 2. Coordinator Must Aggregate
For multi-agent work on shared files:
1. **Coordinator reads current state** first
2. **Each agent does their work** (in separate scope)
3. **Coordinator merges ALL results** into single update
4. **Coordinator writes once** - not agents writing independently

#### 3. Use Task ID Ranges to Prevent Conflicts
Assign non-overlapping task ID ranges:
```
Agent A: TASK-001 to TASK-010
Agent B: TASK-011 to TASK-020  
Agent C: TASK-021 to TASK-030
```

#### 4. Always Re-read Before Writing
If an agent needs to update a shared file:
```javascript
// 1. ALWAYS re-read current state first
const currentKanban = await readFile(kanbanPath);

// 2. Parse and find where to insert
const task = findTask(currentKanban, taskId);

// 3. Update the specific task only
const updated = updateTask(currentKanban, taskId, changes);

// 4. Write back - but coordinator should do this
await writeFile(kanbanPath, updated);
```

#### 5. Lock Files During Coordination
When coordinating multiple agents:
- Use a lock file or flag to indicate "in progress"
- Release lock only after aggregated write completes

### Example: Correct Multi-Agent Workflow

```javascript
// WRONG - Race condition:
launchAgent(task1)   // reads kanban (v1)
launchAgent(task2)   // reads kanban (v1) - same version!
launchAgent(task3)   // reads kanban (v1) - same version!
// ... agents write over each other ...

// CORRECT - Sequential with coordination:
const kanban = await readKanban();  // Coordinator reads

// Agent A works on TASK-001
const resultA = await agentA.do(task1);

// Agent B works on TASK-002 (only after A is done)
const resultB = await agentB.do(task2);

// Coordinator merges:
const merged = mergeResults(kanban, resultA, resultB);

// Single write:
await writeKanban(merged);
```

### 📋 Coordination Checklist

Before launching multiple agents:
- [ ] Are they working on the same file?
- [ ] If yes, have you assigned non-overlapping task IDs?
- [ ] If no task IDs, will you run sequentially?
- [ ] Who is the coordinator that will merge results?
- [ ] Has the current file state been read before agent starts?

---

*Last updated: April 2026*  
*Version: 1.3.1*