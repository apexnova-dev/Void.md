# Phase 2: Tiptap Editor Implementation Plan

**Phase**: Phase 2 - Editor Integration
**Status**: Ready for Implementation
**Date**: January 22, 2026

---

## Overview

Phase 2 implements the Tiptap rich text editor to enhance task notes with formatting capabilities. Building on the Phase 1 infrastructure (feature flags, CDN loading, RichContentStorage), this phase adds:

1. TiptapEditor wrapper class
2. Formatting toolbar
3. Task form integration
4. Save/load rich content
5. Editor cleanup and state management

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     TASK FORM (HTML)                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              FORMAT TOOLBAR (NEW)                        │  │
│  │  [Bold] [Italic] [Code] [List] [Link] [Clear]           │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              TIPTAP EDITOR INSTANCE (NEW)               │  │
│  │                                                          │  │
│  │           Rich text editing area                         │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              HIDDEN TEXTAREA (FALLBACK)                 │  │
│  │        (For plain text mode or when editor unavailable)  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   TiptapEditor CLASS                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ + create()      - Initialize editor in container       │   │
│  │ + destroy()     - Clean up editor instance             │   │
│  │ + setContent()  - Set HTML content                     │   │
│  │ + getContent()  - Get HTML content                     │   │
│  │ + getText()     - Get plain text content               │   │
│  │ + isActive()    - Check if editor is active            │   │
│  │ + toggleBold()  - Apply bold formatting                │   │
│  │ + toggleItalic()- Apply italic formatting              │   │
│  │ + toggleCode()  - Apply code formatting                │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   RichContentStorage                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ + saveRichNotes(taskId, content)    → localStorage      │   │
│  │ + loadRichNotes(taskId)             ← localStorage      │   │
│  │ + deleteRichNotes(taskId)           → localStorage      │   │
│  │ + hasRichNotes(taskId)              → boolean           │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Implementation Checklist

### Step 1: Create TiptapEditor Class
- [ ] Define TiptapEditor class structure
- [ ] Implement create() method with container parameter
- [ ] Implement destroy() method for cleanup
- [ ] Implement setContent() and getContent() methods
- [ ] Implement formatting methods (toggleBold, toggleItalic, toggleCode)
- [ ] Add isActive() state tracking

**Location**: After `loadTiptapLibrary()` function (around line 3330)

### Step 2: Add Formatting Toolbar UI
- [ ] Add toolbar HTML above the notes textarea
- [ ] Add buttons: Bold, Italic, Code, List (bullet), List (ordered), Link, Clear
- [ ] Add CSS styling for toolbar
- [ ] Connect toolbar buttons to TiptapEditor methods
- [ ] Add badge showing "Rich Text" when active

**Location**: Lines 1341-1353 (in task form)

### Step 3: Integrate Editor with Task Form
- [ ] Modify openTaskModal() to initialize Tiptap when in rich mode
- [ ] Load existing rich content via RichContentStorage.loadRichNotes()
- [ ] Handle case where no rich content exists (show placeholder)
- [ ] Sync Tiptap content to textarea for form submission (fallback)

**Location**: Line 1571 (openTaskModal function)

### Step 4: Save Rich Content on Form Submit
- [ ] Modify form submission handler to check editor mode
- [ ] Get rich content from TiptapEditor.getContent()
- [ ] Save to RichContentStorage using task ID
- [ ] Handle errors gracefully with fallback to plain text

**Location**: Line 4213 (form submission handler)

### Step 5: Cleanup Editor on Modal Close
- [ ] Modify closeTaskModal() to destroy Tiptap editor
- [ ] Save any unsaved content before destroying
- [ ] Reset editor state for next use
- [ ] Handle edge cases (modal closed without saving)

**Location**: Find closeTaskModal function

### Step 6: Update Feature Flag Behavior
- [ ] Ensure feature flag toggle enables/disables rich mode
- [ ] Add toast notification when switching modes
- [ ] Handle CDN loading failures gracefully
- [ ] Add "Loading editor..." status indicator

**Location**: Settings UI (lines 1175-1189)

---

## Detailed Implementation

### Step 1: TiptapEditor Class

```javascript
// Location: After loadTiptapLibrary() function (~line 3330)

class TiptapEditor {
    constructor() {
        this.editor = null;
        this.container = null;
        this.isActive = false;
    }

    // Initialize editor in a container element
    create(containerId) {
        if (typeof window.Tiptap === 'undefined') {
            console.warn('Tiptap library not loaded');
            return false;
        }

        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return false;
        }

        this.container = container;

        // Clear any existing content
        container.innerHTML = '';

        // Create editor instance
        this.editor = window.Tiptap.Editor.create({
            element: container,
            extensions: [
                window.Tiptap.StarterKit,
                window.Tiptap.Link
            ],
            content: '',
            onUpdate: ({ editor }) => {
                // Optional: Auto-save or update status
            }
        });

        this.isActive = true;
        console.log('✅ Tiptap editor initialized');
        return true;
    }

    // Destroy editor and cleanup
    destroy() {
        if (this.editor) {
            this.editor.destroy();
            this.editor = null;
            this.isActive = false;
            console.log('🔄 Tiptap editor destroyed');
        }
    }

    // Set HTML content
    setContent(html) {
        if (this.editor) {
            this.editor.commands.setContent(html);
        }
    }

    // Get HTML content
    getContent() {
        if (this.editor) {
            return this.editor.getHTML();
        }
        return '';
    }

    // Get plain text content
    getText() {
        if (this.editor) {
            return this.editor.getText();
        }
        return '';
    }

    // Check if editor is active
    isActive() {
        return this.isActive && this.editor !== null;
    }

    // Formatting methods
    toggleBold() {
        if (this.editor) {
            this.editor.chain().focus().toggleBold().run();
        }
    }

    toggleItalic() {
        if (this.editor) {
            this.editor.chain().focus().toggleItalic().run();
        }
    }

    toggleCode() {
        if (this.editor) {
            this.editor.chain().focus().toggleCode().run();
        }
    }

    toggleBulletList() {
        if (this.editor) {
            this.editor.chain().focus().toggleBulletList().run();
        }
    }

    toggleOrderedList() {
        if (this.editor) {
            this.editor.chain().focus().toggleOrderedList().run();
        }
    }

    clearFormatting() {
        if (this.editor) {
            this.editor.chain().focus().clearNodes().unsetAllMarks().run();
        }
    }
}

// Global instance
window.TiptapEditor = new TiptapEditor();
```

### Step 2: Formatting Toolbar UI

```html
<!-- Location: Lines 1341-1353, replace existing notes section -->

<div style="margin-bottom: 1.5rem;">
    <label for="taskNotes">Notes
        <span id="editorModeBadge" style="display: none; margin-left: 0.5rem; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: normal; background: var(--accent-color); color: white;">
            Rich Text
        </span>
    </label>

    <!-- Formatting Toolbar (shown when rich mode is active) -->
    <div id="editorToolbar" class="tiptap-toolbar" style="display: none; margin-bottom: 0.5rem; padding: 0.5rem; background: var(--bg-secondary); border-radius: 6px 6px 0 0; border: 1px solid var(--border-color); border-bottom: none;">
        <button type="button" class="toolbar-btn" onclick="TiptapEditor.toggleBold()" title="Bold (Ctrl+B)"><strong>B</strong></button>
        <button type="button" class="toolbar-btn" onclick="TiptapEditor.toggleItalic()" title="Italic (Ctrl+I)"><em>I</em></button>
        <button type="button" class="toolbar-btn" onclick="TiptapEditor.toggleCode()" title="Code"><code>&lt;/&gt;</code></button>
        <button type="button" class="toolbar-btn" onclick="TiptapEditor.toggleBulletList()" title="Bullet List">• List</button>
        <button type="button" class="toolbar-btn" onclick="TiptapEditor.toggleOrderedList()" title="Ordered List">1. List</button>
        <button type="button" class="toolbar-btn" onclick="TiptapEditor.clearFormatting()" title="Clear Formatting">Clear</button>
        <span style="margin-left: auto; font-size: 0.8rem; color: var(--text-secondary);">Rich Text Editor</span>
    </div>

    <!-- Tiptap Editor Container -->
    <div id="tiptapContainer" style="display: none; min-height: 150px; border: 1px solid var(--border-color); border-radius: 0 0 6px 6px; background: var(--bg-primary);">
        <!-- Tiptap will initialize here -->
    </div>

    <!-- Fallback Textarea (always present) -->
    <textarea id="taskNotes" rows="6" placeholder="Technical notes, results, decisions, etc.

You can use Markdown:
**Bold**, *Italic*, `code`, lists, links..." style="display: block; width: 100%;"></textarea>

    <small style="color: var(--text-secondary); font-size: 0.85rem;">Markdown supported: **bold**, *italic*, `code`, lists, links, **subsections**:</small>
    <div id="editorStatus" style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--text-secondary);"></div>
</div>
```

### Step 3: Editor Integration in openTaskModal

```javascript
// Add to openTaskModal function, after form fields are populated

// Initialize Tiptap editor if rich mode is active
if (getEditorMode() === 'rich' && isRichTextAvailable()) {
    const editId = document.getElementById('taskEditId').value;

    // Show toolbar and Tiptap container
    document.getElementById('editorToolbar').style.display = 'flex';
    document.getElementById('tiptapContainer').style.display = 'block';
    document.getElementById('taskNotes').style.display = 'none';
    document.getElementById('editorModeBadge').style.display = 'inline-block';

    // Initialize editor
    window.TiptapEditor.create('tiptapContainer');

    // Load existing rich content or fall back to plain text
    if (editId) {
        const richContent = RichContentStorage.loadRichNotes(editId);
        if (richContent) {
            window.TiptapEditor.setContent(richContent);
        } else {
            // No rich content, load plain text from task
            window.TiptapEditor.setContent(task.notes || '');
        }
    } else {
        // New task, start empty
        window.TiptapEditor.setContent('');
    }

    updateEditorStatus('Rich text editor ready');
} else {
    // Hide Tiptap elements, show plain textarea
    document.getElementById('editorToolbar').style.display = 'none';
    document.getElementById('tiptapContainer').style.display = 'none';
    document.getElementById('taskNotes').style.display = 'block';
    document.getElementById('editorModeBadge').style.display = 'none';
}
```

### Step 4: Save Rich Content on Submit

```javascript
// Modify form submission handler (around line 4230)

// Get notes based on editor mode
let notes = '';
let richContent = null;

if (getEditorMode() === 'rich' && window.TiptapEditor.isActive()) {
    // Get plain text for the task notes field
    notes = window.TiptapEditor.getText().trim();
    // Get rich HTML content for storage
    richContent = window.TiptapEditor.getContent();
} else {
    notes = document.getElementById('taskNotes').value.trim();
}

// ... rest of form processing ...

// After task is saved/updated, save rich content
if (richContent && taskId) {
    const saveResult = await RichContentStorage.saveRichNotes(taskId, richContent);
    if (!saveResult.success) {
        console.error('Failed to save rich content:', saveResult.error);
    }
}
```

### Step 5: Cleanup on Modal Close

```javascript
// Modify closeTaskModal function

function closeTaskModal() {
    // Save any unsaved rich content
    if (getEditorMode() === 'rich' && window.TiptapEditor.isActive()) {
        const editId = document.getElementById('taskEditId').value;
        if (editId) {
            const richContent = window.TiptapEditor.getContent();
            if (richContent) {
                RichContentStorage.saveRichNotes(editId, richContent);
            }
        }
        // Destroy editor
        window.TiptapEditor.destroy();
    }

    // Reset form display
    document.getElementById('editorToolbar').style.display = 'none';
    document.getElementById('tiptapContainer').style.display = 'none';
    document.getElementById('taskNotes').style.display = 'block';
    document.getElementById('editorModeBadge').style.display = 'none';

    // ... existing close modal code ...
}
```

---

## CSS Styling

```css
/* Add to style section */

.tiptap-toolbar {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    flex-wrap: wrap;
}

.tiptap-toolbar .toolbar-btn {
    padding: 0.4rem 0.6rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.2s ease;
}

.tiptap-toolbar .toolbar-btn:hover {
    background: var(--accent-color);
    color: white;
    border-color: var(--accent-color);
}

#tiptapContainer {
    min-height: 150px;
    padding: 1rem;
    font-family: inherit;
    font-size: 0.95rem;
    line-height: 1.6;
}

#tiptapContainer:focus {
    outline: none;
    border-color: var(--accent-color);
}

/* Tiptap editor internal styles */
#tiptapContainer p {
    margin: 0 0 0.5rem 0;
}

#tiptapContainer ul,
#tiptapContainer ol {
    margin: 0 0 0.5rem 1.5rem;
}

#tiptapContainer code {
    background: var(--bg-secondary);
    padding: 0.1rem 0.3rem;
    border-radius: 3px;
    font-family: monospace;
}

#tiptapContainer pre {
    background: var(--bg-secondary);
    padding: 0.75rem;
    border-radius: 6px;
    overflow-x: auto;
}

#tiptapContainer blockquote {
    border-left: 3px solid var(--accent-color);
    margin: 0.5rem 0;
    padding-left: 1rem;
    color: var(--text-secondary);
}
```

---

## Testing Plan

### Unit Tests

1. **TiptapEditor Class**
   - [ ] create() initializes editor successfully
   - [ ] destroy() cleans up properly
   - [ ] setContent() and getContent() work correctly
   - [ ] getText() returns plain text
   - [ ] Formatting methods toggle formatting correctly

2. **RichContentStorage Integration**
   - [ ] saveRichNotes() stores content
   - [ ] loadRichNotes() retrieves content
   - [ ] deleteRichNotes() removes content
   - [ ] hasRichNotes() returns correct boolean

3. **Form Integration**
   - [ ] Editor loads when opening existing task with rich content
   - [ ] Editor shows placeholder for new task
   - [ ] Editor destroys properly on modal close
   - [ ] Rich content saves on form submit

### Integration Tests

1. **Full Workflow**
   - [ ] Enable rich text editor in settings
   - [ ] Create new task with formatted notes
   - [ ] Save task and verify rich content stored
   - [ ] Edit task and verify rich content loads
   - [ ] Verify plain text fallback works

2. **Edge Cases**
   - [ ] Disable feature flag, verify plain text mode
   - [ ] CDN load failure, verify graceful fallback
   - [ ] Close modal without saving, verify content saved
   - [ ] Switch between plain and rich mode

---

## Files Modified

| File | Changes | Priority |
|------|---------|----------|
| `void.html` | Add TiptapEditor class | High |
| `void.html` | Add formatting toolbar UI | High |
| `void.html` | Integrate editor in openTaskModal | High |
| `void.html` | Modify form submission for rich content | High |
| `void.html` | Add cleanup in closeTaskModal | High |
| `void.html` | Add CSS styling | Medium |
| `docs/architecture/tests/unit-tests.js` | Add TiptapEditor tests | Medium |

---

## Estimated Effort

| Task | Effort |
|------|--------|
| TiptapEditor class | 2-3 hours |
| Formatting toolbar UI | 1-2 hours |
| Form integration | 2-3 hours |
| CSS styling | 1 hour |
| Testing | 2-3 hours |
| **Total** | **8-12 hours** |

---

## Dependencies

1. **External**
   - Tiptap library (loaded from CDN)
   - Tiptap StarterKit extension

2. **Internal (Phase 1)**
   - Feature flag system (ENABLE_RICH_TEXT_EDITOR)
   - RichContentStorage
   - loadTiptapLibrary()
   - getEditorMode(), isRichTextAvailable()

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| CDN load failure | High | Already handled by loadTiptapLibrary() with fallback |
| Browser compatibility | Medium | Tiptap supports modern browsers; fallback to plain text |
| Performance issues | Low | Editor only loaded when rich mode active |
| Data loss on close | Medium | Auto-save rich content before destroying editor |

---

## Success Criteria

1. ✅ Tiptap editor initializes successfully when rich mode enabled
2. ✅ Formatting toolbar appears above notes field
3. ✅ Rich content saves to RichContentStorage
4. ✅ Rich content loads when editing task
5. ✅ Editor cleans up properly on modal close
6. ✅ Falls back to plain text if CDN fails
7. ✅ All existing tests still pass
8. ✅ New tests for TiptapEditor pass

---

## Next Steps

1. Start with TiptapEditor class implementation
2. Add CSS styling for toolbar
3. Test editor in isolation
4. Integrate with task form
5. Add comprehensive tests
6. Verify all success criteria

---

**Implementation Ready** ✅

Phase 2 is ready to begin. All infrastructure from Phase 1 is in place and functional. The implementation plan provides a clear roadmap for adding rich text editing capabilities.
