# 🤖 AGENTS.md - Development Guide for AI Assistants

This file contains build commands, code style guidelines, and development standards for agentic coding agents working on the Markdown Task Manager project.

---

## 🚀 Build/Test Commands

### Running Tests

This is a single-file HTML application with browser-based testing. No npm/build system required.

```bash
# 1. Open the application in a browser
open task-manager.html  # macOS
xdg-open task-manager.html  # Linux
start task-manager.html  # Windows

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
open test-page.html  # Loads task-manager.html in iframe with console capture
```

---

## 📝 Code Style Guidelines

### File Structure

- **Single file architecture**: All code in `task-manager.html`
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
/* Use CSS variables for theming */
:root {
    --bg-primary: #f5f5f5;
    --text-primary: #212121;
    --accent: #2196F3;
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
# 1. Edit task-manager.html directly
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

- `task-manager.html` - Main application file
- `docs/architecture/tests/unit-tests.js` - Core test suite
- `docs/architecture/tests/phase2-tests.js` - Tiptap editor tests
- `docs/architecture/editor-standards.md` - Editor quality criteria
- `AI_WORKFLOW.md` - Task format and workflow guidelines

---

*Last updated: January 23, 2026*  
*Version: 1.1.2*