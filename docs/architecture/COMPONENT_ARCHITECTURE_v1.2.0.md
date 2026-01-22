# Component Architecture: Enhanced Notes/Comments System v1.2.0

**Document Version**: 1.0.0  
**Date**: January 22, 2026  
**Project**: Markdown Task Manager  
**Module**: Component Architecture & Implementation Workflows  
**Complexity Score**: 9/10  
**Status**: Draft - Ready for Implementation

---

## 1. Component Hierarchy Overview

### 1.1 Complete Component Tree

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      CommentSystem (Root Module)                            │
│  Lifecycle: init() → ready → active → destroy()                             │
│  Responsibilities: Orchestrate all subcomponents, manage global state       │
└─────────────────────────────────────────────────────────────────────────────┘
           │
           ├──────────────────┬───────────────────┬──────────────────────────┐
           │                  │                   │                          │
           ▼                  ▼                   ▼                          ▼
┌─────────────────┐ ┌─────────────────────┐ ┌─────────────────┐ ┌─────────────────────┐
│ EditorManager   │ │   ThreadManager     │ │ StateManager    │ │ StorageAdapter      │
│ (Tiptap Core)   │ │   (Comments)        │ │ (Undo/Redo)     │ │ (File Persistence)  │
└────────┬────────┘ └──────────┬──────────┘ └────────┬────────┘ └──────────┬──────────┘
         │                     │                     │                     │
    ┌────┴────┐          ┌─────┴─────┐         ┌─────┴─────┐         ┌───────┴───────┐
    │         │          │            │         │           │         │               │
    ▼         ▼          ▼            ▼         ▼           ▼         ▼               ▼
┌──────┐ ┌────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ ┌────────┐ ┌───────────────┐
│Toolbar│ │Command │ │ThreadStore│ │ThreadUI │ │UndoRedo│ │AutoSave│ │FileSystem     │
│       │ │Palette │ │          │ │         │ │Stack   │ │Manager │ │LocalStorage   │
└───────┘ └────────┘ └──────────┘ └──────────┘ └────────┘ └────────┘ └───────────────┘
```

### 1.2 Component Responsibilities Summary

| Component | Primary Responsibility | Secondary Responsibilities |
|-----------|------------------------|---------------------------|
| **EditorManager** | Rich text editing with Tiptap | Content serialization, selection management |
| **Toolbar** | Format button rendering | Active state tracking, keyboard shortcuts |
| **CommandPalette** | Slash command display/execution | Search filtering, keyboard navigation |
| **AutoCompleteManager** | @, #, [[ triggers | Suggestion rendering, selection |
| **ThreadManager** | Thread/comment lifecycle | Rendering, filtering, sorting |
| **StateManager** | State persistence | Undo/redo, auto-save, conflict resolution |
| **StorageAdapter** | File persistence | Serialization, fallback handling |

---

## 2. Component Specifications

### 2.1 EditorComponent (Tiptap Integration)

**Inputs:**
- `container: HTMLElement` - Editor mounting point
- `options: EditorOptions` - Configuration (initialContent, placeholder, autofocus, etc.)
- `extensions: Extension[]` - Tiptap extensions

**Outputs:**
- EditorInstance API (content, selection, formatting methods)
- Events: 'content-change', 'selection-change', 'focus', 'blur'

**Key Features:**
- Tiptap headless editor with custom extensions
- Mention extension (@users) with auto-complete
- Tag extension (#tags) with auto-complete
- Task link extension ([[tasks]])
- Keyboard shortcuts for formatting
- Placeholder support

**Performance Targets:**
| Metric | Target |
|--------|--------|
| Editor creation time | < 300ms |
| Typing latency | < 50ms |
| Memory footprint | < 50MB |

### 2.2 CommentThreadComponent (Thread Rendering)

**Inputs:**
- `threads: Thread[]` - Thread data from storage
- `currentUser: Username` - Current user
- `filterOptions: CommentFilter` - Filtering criteria

**Outputs:**
- Thread list rendering
- Comment tree rendering with nested replies (max 5 levels)
- Reaction display
- Events: 'thread-created', 'comment-added', 'reaction-added'

**Thread Data Structure:**
```typescript
interface Thread {
  id: ThreadId;
  taskId: string;
  status: 'active' | 'resolved' | 'hidden';
  pinned: boolean;
  created: ISO8601Timestamp;
  updated: ISO8601Timestamp;
  commentCount: number;
  comments: Comment[];
}
```

### 2.3 CommandPaletteComponent (Slash Commands)

**Inputs:**
- `editor: EditorInstance`
- `triggerChar: '/'`
- `context: EditorContext` - 'task' | 'comment' | 'description' | 'notes'

**60 Default Commands in 9 Categories:**
1. **Formatting** (9): /bold, /italic, /underline, /strike, /code, /codeblock, etc.
2. **Headings** (6): /heading1 through /heading6
3. **Lists** (5): /bulletlist, /numberedlist, /checkbox, /todolist, /toggle
4. **Blocks** (6): /blockquote, /callout, /divider, /table, /columns, /code
5. **Media** (6): /image, /file, /link, /emoji, /video, /audio
6. **Tasks** (8): /subtask, /reminder, /duedate, /assign, /priority, /tag, /tasklink, /status
7. **Comments** (4): /comment, /mention, /resolve, /hide
8. **Advanced** (8): /template, /snippet, /date, /time, /datetime, /math, /anchor
9. **System** (8): /undo, /redo, /copy, /cut, /paste, /help, /shortcuts, /clear

**Performance Targets:**
| Metric | Target |
|--------|--------|
| Palette open | < 50ms |
| Filter results | < 100ms |
| Execute command | < 50ms |

### 2.4 StateManagerComponent (State Store)

**Undo/Redo Stack:**
- Maximum 50 entries
- Group timeout: 500ms (rapid edits within 500ms are grouped)
- Entry types: comment_create, comment_edit, comment_delete, format_apply, command_execute

**Auto-Save Controller:**
- Delay: 300ms debounce
- Retry with exponential backoff (max 3 retries)
- Status: idle, saving, success, error, offline

**Conflict Resolution:**
- Version tracking (local vs remote)
- Merge strategies: keep_local, keep_remote, merge, ask_user

---

## 3. Implementation Workflows

### 3.1 Editor Initialization Workflow

```
PHASE 1: DEPENDENCY CHECK (0-100ms)
├─ Check Tiptap is loaded
├─ Verify browser capabilities
└─ Load configuration from storage

PHASE 2: COMPONENT INITIALIZATION (100-300ms)
├─ Initialize EventBus
├─ Initialize StateManager
├─ Initialize StorageAdapter
├─ Initialize CommandRegistry
└─ Initialize AutoCompleteManager

PHASE 3: UI RENDERING (200-400ms)
├─ Create editor container
├─ Create toolbar
├─ Create command palette
└─ Mount to DOM

PHASE 4: EDITOR CREATION (300-500ms)
├─ Create Tiptap instance with extensions
├─ Register custom extensions (@mention, #tag, [[task]])
├─ Bind keyboard shortcuts
└─ Set up auto-save

PHASE 5: CONTENT LOADING (400-600ms)
├─ Load draft from localStorage (if any)
└─ Load comments from kanban.md
```

**Success Criteria:**
- [ ] Editor is interactive (< 500ms)
- [ ] All extensions loaded
- [ ] Toolbar buttons functional
- [ ] Command palette opens on '/'

### 3.2 Comment Creation Workflow

```
STEP 1: INITIATE COMMENT
├─ User clicks "Add Comment"
├─ Generate thread ID: thread-{timestamp}-{random}
├─ Create thread object
└─ Render empty comment editor

STEP 2: CONTENT EDITING
├─ User types content
├─ Process through Tiptap
├─ Handle special triggers ('/', '@', '#', '[[')
├─ Update local state
├─ Update undo stack (debounced)
└─ Start auto-save timer

STEP 3: SAVE COMMENT
├─ Serialize to Tiptap JSON
├─ Generate comment ID
├─ Create comment object
├─ Add to thread.comments
├─ Write to storage
├─ Render new comment
└─ Clear editor

Error Handling:
├─ Storage error → Retry 3x, then show error
├─ Conflict → Show diff, ask user
└─ Network offline → Queue for later
```

### 3.3 Auto-Save Workflow

```
CONTENT CHANGE DETECTED
├─ Check if auto-save enabled
├─ Cancel pending save timer
├─ Set new timer (300ms delay)
└─ Timer fires

TIMER FIRES
├─ Check if content changed (vs lastSavedContent)
├─ Serialize editor content
├─ Write to File System API
├─ Success?
│  ├─ YES: Update lastSavedContent, emit 'save-success'
│  └─ NO: Increment retry, retry with backoff
│       ├─ Retry < 3: Retry after delay
│       └─ Retry >= 3: Show error, fallback to localStorage
└─ Set status to 'idle' after 2s
```

### 3.4 Undo/Redo Workflow

```
UNDO EXECUTION
├─ Check canUndo()
├─ Pop entry from UndoStack
├─ Restore beforeState to editor
├─ Push entry to RedoStack
├─ Update UI state
└─ Emit 'undo' event

REDO EXECUTION
├─ Check canRedo()
├─ Pop entry from RedoStack
├─ Restore afterState to editor
├─ Push entry to UndoStack
├─ Update UI state
└─ Emit 'redo' event

GROUPING LOGIC
├─ Rapid edits within 500ms are grouped
├─ Reduces undo entries for typing
└─ Merges into single undoable action
```

---

## 4. Event Flow Diagrams

### 4.1 Key Event Flows

```
TYPING EVENT FLOW:
User Types → Tiptap Editor → ContentChange Event → StateManager → AutoSaveController

FORMAT BUTTON CLICK:
User Clicks → ToolbarComponent → Editor.toggleFormat() → Tiptap (Apply Mark) → UI Update

SLASH COMMAND:
User Types '/' → InputRule (detects trigger) → CommandPalette.show() → Filter Commands → Execute

COMMENT SUBMISSION:
User Clicks Save → ThreadManager.addComment() → StorageAdapter.write() → ThreadRenderer → UI Update
```

### 4.2 State Change Events

```
CONTENT CHANGE:
Tiptap Editor
    │
    ▼ emits 'content-change'
EventBus ──► StateManager (capture state) ──► UndoStack (push)
              │
              ├─► AutoSaveController (trigger)
              │
              └─► ThreadUI (update preview)
```

### 4.3 Error Handling Events

```
SAVE FAILURE:
AutoSaveController ──► EventBus.emit('auto-save-error') ──► UI (show error) ──► Fallback to localStorage

FILE CONFLICT:
FileWatcher ──► EventBus.emit('file-conflict') ──► ConflictResolver ──► UI (show diff) ──► User Prompt

STORAGE ERROR:
StorageAdapter ──► EventBus.emit('storage-error') ──► Retry Logic ──► User Notification
```

---

## 5. Integration Workflows

### 5.1 Component Communication Patterns

**Event-Driven (EventBus):**
- Content changes
- Selection changes
- Thread updates
- Save events

**Direct Method Calls:**
- Editor formatting methods
- Thread operations
- Storage read/write

**Callback Functions:**
- Auto-complete suggestions
- Command execution results
- Save completion

### 5.2 Communication Patterns by Scenario

| Scenario | Primary Pattern | Fallback |
|----------|-----------------|----------|
| Editor formatting | Direct call | - |
| Thread operations | Direct call + event | - |
| Content auto-save | Event → debounce | LocalStorage |
| File conflicts | Event → resolver | User prompt |
| Auto-complete | Callback | - |

### 5.3 Error Propagation

```
Component Error
    │
    ▼
EventBus.emit('error', { source, error, recoverable })
    │
    ├─► ErrorHandler
    │    ├─► Recoverable?
    │    │   ├─ YES: Retry logic → Success callback
    │    │   └─ NO: User notification → Graceful degradation
    │    │
    │    └─► Logging (if debug mode)
    │
    └─► UI Layer
         └─► Show error message (non-intrusive)
```

---

## 6. Implementation Phase Plan

### Phase 1: Core Editor Foundation (Week 1-2)

**Tasks:**
- [ ] Set up Tiptap CDN loading with fallback
- [ ] Create EditorComponent base class
- [ ] Implement basic extensions (bold, italic, heading)
- [ ] Set up EventBus
- [ ] Create toolbar UI

**Testing Checkpoints:**
- [ ] Editor loads in < 500ms
- [ ] Basic formatting works
- [ ] EventBus delivers events correctly

### Phase 2: Rich Text Extensions (Week 2-3)

**Tasks:**
- [ ] Implement MentionExtension (@users)
- [ ] Implement TagExtension (#tags)
- [ ] Implement TaskLinkExtension ([[tasks]])
- [ ] Create AutoCompleteManager
- [ ] Build suggestion dropdown UI

**Testing Checkpoints:**
- [ ] Auto-complete shows suggestions
- [ ] Mention/Tag/TaskLink render correctly
- [ ] Keyboard navigation works

### Phase 3: Command Palette (Week 3-4)

**Tasks:**
- [ ] Create CommandRegistry
- [ ] Implement 60 slash commands
- [ ] Build CommandPalette UI
- [ ] Add keyboard navigation
- [ ] Implement search filtering

**Testing Checkpoints:**
- [ ] Command palette opens on '/'
- [ ] All 60 commands execute correctly
- [ ] Search filtering works (< 100ms)
- [ ] Keyboard navigation complete

### Phase 4: Comment System (Week 4-6)

**Tasks:**
- [ ] Create ThreadManager
- [ ] Implement ThreadStore
- [ ] Build ThreadRenderer
- [ ] Add reaction system
- [ ] Implement nested replies (max 5 levels)

**Testing Checkpoints:**
- [ ] Thread CRUD operations work
- [ ] Comments render correctly
- [ ] Reactions update properly
- [ ] Filtering/sorting works

### Phase 5: State Management (Week 6-7)

**Tasks:**
- [ ] Implement Undo/Redo stack
- [ ] Create AutoSaveController
- [ ] Add conflict resolution
- [ ] Implement localStorage fallback

**Testing Checkpoints:**
- [ ] Undo/Redo works (50 levels)
- [ ] Auto-save triggers correctly
- [ ] Conflict resolution works
- [ ] Offline fallback functional

### Phase 6: Storage Integration (Week 7-8)

**Tasks:**
- [ ] Implement StorageAdapter
- [ ] Create File System Access API integration
- [ ] Build Markdown serializer
- [ ] Add file watcher for external changes

**Testing Checkpoints:**
- [ ] File read/write works
- [ ] Comments persist to kanban.md
- [ ] External file changes detected
- [ ] Conflict resolution works

### Phase 7: Polish & Testing (Week 8-9)

**Tasks:**
- [ ] Performance optimization
- [ ] Accessibility testing
- [ ] Cross-browser testing
- [ ] Bug fixes
- [ ] Documentation

**Final Testing Checkpoints:**
- [ ] All metrics meet targets
- [ ] 80%+ test coverage
- [ ] Documentation complete
- [ ] Code review passed

---

## 7. Quick Reference

### API Methods Summary

**EditorComponent:**
- `getContent()` → RichContent
- `setContent(content)` → void
- `toggleBold()`, `toggleItalic()`, etc.
- `insertContent(node)` → void
- `undo()`, `redo()`

**ThreadManager:**
- `createThread(taskId, content)` → Promise<Thread>
- `addComment(threadId, content)` → Promise<Comment>
- `resolveThread(threadId)` → Promise<void>
- `addReaction(commentId, emoji)` → Promise<void>

**StateManager:**
- `undo()` → boolean
- `redo()` → boolean
- `canUndo()` → boolean
- `canRedo()` → boolean

**StorageAdapter:**
- `readComments(taskId)` → Promise<Thread[]>
- `writeComments(taskId, threads)` → Promise<void>
- `addThread(taskId, thread)` → Promise<void>

### Performance Metrics

| Operation | Target | Critical Path |
|-----------|--------|---------------|
| Editor initialization | < 500ms | Tiptap load → extensions → render |
| Command palette open | < 50ms | Trigger → filter → render |
| Auto-save | 300ms + write | Debounce → serialize → write |
| Undo/Redo | < 100ms | Pop → restore → update UI |
| Thread rendering | < 100ms/comment | Parse → render → mount |

### Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 86+ | Full | File System Access API supported |
| Edge 86+ | Full | File System Access API supported |
| Firefox 88+ | Partial | File System Access API fallback to localStorage |
| Safari 15+ | Partial | File System Access API limited |

---

*Document generated for Markdown Task Manager 1.2.0 architecture implementation*
