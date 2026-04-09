# Contributing to Void.md

Thank you for your interest in contributing to Void.md! We welcome contributions from the community and are excited to work with you.

## Welcome

Void.md is a local-first Kanban task manager built on local Markdown files. Your contributions help make task management more accessible, reliable, and feature-rich for users who value privacy and local data storage.

---

## Development Setup

### Prerequisites

- **Modern browser**: Chrome, Edge, or Opera (required for File System Access API)
- **Git**: For version control
- **Code editor**: VS Code recommended (with ESLint extension)

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/your-username/Markdown-Task-Manager.git
cd Markdown-Task-Manager

# 2. Open the application
# Since this is a single-file HTML application, no build is required
open void.html          # macOS
xdg-open void.html      # Linux
start void.html        # Windows
```

### Enabling Development Features

```javascript
// Enable debug mode in the browser console
localStorage.setItem('debugMode', 'true');
location.reload();
```

---

## Code Style Guidelines

We follow consistent coding conventions to maintain code quality and readability. All code resides in `void.html` with embedded CSS and JavaScript.

### Naming Conventions

```javascript
// camelCase: variables and functions
let currentTask = null;
function createTaskModal(task) { }

// PascalCase: classes
class TaskManager { }
class TiptapEditor { }

// UPPER_SNAKE_CASE: constants
const FEATURE_FLAGS = { RICH_TEXT_EDITOR: true };
const STORAGE_KEYS = { PROJECTS: 'taskManager_projects' };

// kebab-case: CSS classes and IDs
document.getElementById('task-modal');
element.classList.add('kanban-column');
```

### Module Pattern

Since this is a single HTML file, we use IIFE patterns:

```javascript
(function() {
    'use strict';
    
    const TaskManager = {
        init() { /* ... */ },
        createTask() { /* ... */ }
    };
    
    window.TaskManager = TaskManager;
})();
```

### Error Handling

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

// Defensive programming - validate inputs
function sanitizeTaskId(id) {
    if (!id || typeof id !== 'string') {
        throw new Error('Invalid task ID');
    }
    return id.trim();
}

// Always check for null before DOM operations
const modal = document.getElementById('task-modal');
if (modal) {
    modal.classList.add('show');
}
```

### CSS Conventions

```css
/* Use CSS variables for theming */
:root {
    --bg-primary: #f5f5f5;
    --text-primary: #212121;
    --accent: #00d4e8;
    --accent-secondary: #ff00ea;
}

/* BEM-style naming */
.kanban-column { }
.kanban-column--dragging { }
.task-card__title { }
.task-card__priority { }

/* Smooth theme transitions */
body, .header, .kanban-column, .task-card, .modal-content {
    transition: background-color 0.3s ease, color 0.3s ease;
}
```

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

### JSDoc Documentation

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
```

---

## Testing Instructions

### Running Tests

This is a browser-based testing application. No npm/build system is required.

```bash
# Open the application in your browser
open void.html  # macOS
xdg-open void.html  # Linux
```

### In Browser Console

Open Developer Tools (F12) and run:

```javascript
// Run all unit tests
fetch('docs/architecture/tests/unit-tests.js')
  .then(r => r.text())
  .then(code => eval(code))
  .then(() => runAllTests())

// Run specific test suites
runFeatureFlagTests()      // Feature flag system
runFallbackTests()         // Fallback mechanisms  
runStorageTests()          // Storage functionality

// Run Phase 2 tests (Tiptap editor)
fetch('docs/architecture/tests/phase2-tests.js')
  .then(r => r.text())
  .then(code => eval(code))
  .then(() => runPhase2Tests())
```

### Quality Checklist

Before submitting changes, verify:

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

## Submitting Changes

### Fork the Repository

1. Click the "Fork" button on GitHub
2. Clone your forked repository:
   ```bash
   git clone https://github.com/your-username/Markdown-Task-Manager.git
   ```

### Create a Branch

Use the following naming convention:

```
feature/description         # New features
bugfix/description          # Bug fixes
docs/description           # Documentation
refactor/description       # Code refactoring
test/description           # Adding tests
```

Examples:
- `feature/add-tiptap-editor`
- `bugfix/fix-modal-scrolling`
- `docs/improve-readme`
- `refactor/storage-abstraction`

### Commit Message Format

Use clear, descriptive commit messages:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, no code change
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance

**Examples:**
```
feat(storage): add IndexedDB fallback for file operations

fix(modal): resolve scroll lock issue on iOS

docs(readme): update installation instructions
```

### Creating a Pull Request

1. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature
   ```

2. Open a Pull Request against `main`

3. Fill in the PR template:

---

## Pull Request Template

```markdown
## Summary
<!-- Brief description of changes -->

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update
- [ ] Refactoring

## Testing
<!-- Describe testing performed -->

- [ ] Tested in Chrome
- [ ] Tested in Edge
- [ ] Tested in Opera
- [ ] Verified light theme
- [ ] Verified dark theme
- [ ] Ran relevant test suites

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated (if needed)
- [ ] No console errors in debug mode

## Screenshots (if applicable)
<!-- Add screenshots of changes -->
```

---

## PR Review Process

1. **Automated checks**: CI runs tests and linting
2. **Code review**: Maintainers review for quality and design
3. **Testing**: Changes are verified in browser
4. **Merge**: Approved PRs are merged to main

### What We Look For

- **Correctness**: Does the code work as intended?
- **Design**: Is the code consistent with project patterns?
- **Tests**: Are tests included and passing?
- **Documentation**: Is documentation updated?
- **Accessibility**: Are ARIA labels and semantic HTML used?

---

## Getting Help

- **Issues**: Open a GitHub issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Documentation**: See `/docs` folder for detailed docs

---

## Code of Conduct

By contributing, you agree to follow our Code of Conduct:

- Be respectful and inclusive
- Welcome newcomers and beginners
- Accept constructive criticism professionally
- Focus on what is best for the community

---

## Recognition

Contributors will be added to the CONTRIBUTORS file in the repository.

---

*Last updated: April 2026*
*Version: 1.3.2*
