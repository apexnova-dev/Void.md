# Architecture Specification: Enhanced Notes/Comments System v1.2.0

**Document Version**: 1.0.0  
**Date**: January 22, 2026  
**Project**: Markdown Task Manager  
**Module**: Enhanced Notes/Comments System  
**Complexity Score**: 9/10  
**Status**: Draft - Pending Review

---

## Document Overview

| Section | Description |
|---------|-------------|
| 1. Executive Summary | Feature overview, goals, scope, and key decisions |
| 2. System Architecture | High-level architecture, components, data flow |
| 3. Data Models | TypeScript schemas for comments, threads, revisions |
| 4. API Design | CRUD operations, threading API, Tiptap integration |
| 5. Component Architecture | Editor, thread, command, toolbar components |
| 6. Design Decisions | Technical decisions, trade-offs, alternatives |
| 7. Implementation Roadmap | Phased plan, dependencies, milestones |
| 8. Appendix | Glossary, references, related documentation |

---

## 1. Executive Summary

### 1.1 Feature Overview

The Markdown Task Manager 1.2.0 introduces a comprehensive enhanced notes/comments system that transforms task collaboration capabilities. This system brings modern rich text editing through Tiptap integration, Notion-style slash commands for rapid content formatting, threaded conversations with @mentions and emoji reactions, and intelligent auto-complete functionality for users, tags, and task references.

The architecture builds upon the existing single-file HTML application foundation while introducing sophisticated editor capabilities. All content remains fully Markdown-compatible, ensuring portability and interoperability with external tools. The system maintains the project's File System Access API integration for local file storage, providing full data ownership without cloud dependencies.

### 1.2 Primary Goals

The enhanced comments system pursues four interconnected objectives that define its architectural direction. First, it delivers a rich text editing experience that rivals dedicated writing applications while preserving Markdown as the canonical storage format. Users can apply formatting, create structured content, and embed media without sacrificing the ability to export or share content elsewhere.

Second, the system enables fluid collaboration through threaded conversations where team members can discuss tasks, provide feedback, and track decisions. The threading model supports both flat discussions and nested replies, with visual indicators for conversation depth and unresolved items.

Third, slash commands provide a keyboard-centric workflow that accelerates content creation. By typing `/`, users access a comprehensive command palette that inserts formatted elements, creates tables, adds media, and performs common operations without leaving the keyboard.

Fourth, smart auto-complete reduces friction when referencing project entities. Typing `@` triggers user mention suggestions, `#` reveals available tags, and `[[` exposes task links—all filtered by context and user history.

### 1.3 Scope and Boundaries

The feature scope encompasses the comment and note editing capabilities within task contexts. This includes the comment panel within task modals, the rich text editor instance, slash command processing, auto-complete systems, and all associated state management.

The architecture deliberately excludes certain capabilities to maintain focus. Real-time collaborative editing with simultaneous users falls outside scope, as does any cloud synchronization or server-side processing. The system assumes single-user local operation with file-based storage, consistent with the broader project philosophy.

Integration boundaries define where the comment system connects with existing components. The task modal provides the primary UI container, the File System Access API handles persistence, the theme system manages visual styling, and the existing change logging infrastructure captures audit trails for significant operations.

### 1.4 Key Technical Decisions

The architecture makes several foundational choices that shape implementation:

**Tiptap Editor Selection**: Tiptap was chosen over other rich text editors for its headless architecture, ProseMirror foundation, and TypeScript support. The headless design allows complete UI customization matching the existing application aesthetic. ProseMirror's battle-tested document model provides reliable state management, while TypeScript definitions enable compile-time validation.

**Single-File CDN Strategy**: Given the single-file HTML architecture constraint, Tiptap loads via CDN with inline fallback. This approach balances library availability with offline capability. The architecture detects CDN availability and gracefully degrades to a plain text editor if necessary.

**Comment Thread Flat Storage**: Despite supporting nested replies, comments serialize to a flat structure with parent references. This simplifies parsing and modification while preserving the conversation hierarchy through the parentId field.

**Event-Driven State Updates**: The architecture employs event emission for state changes rather than direct coupling. Components publish events when content changes, and interested listeners subscribe to relevant event types. This pattern supports undo/redo, auto-save, and UI synchronization without tight coupling.

**Debounced Auto-Save**: Auto-save triggers after 300ms of editor inactivity, balancing responsiveness with performance. Rapid typing does not trigger excessive save operations, while changes persist quickly enough to prevent significant data loss.

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        APPLICATION LAYER                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     Task Modal Container                             │    │
│  │  ┌───────────────┐  ┌───────────────────────────────────────────┐  │    │
│  │  │ Task Content  │  │         Comment Panel                      │  │    │
│  │  │   (Read/Edit) │  │  ┌─────────────────────────────────────┐  │  │    │
│  │  │               │  │  │        Thread List                   │  │  │    │
│  │  │               │  │  │  - Thread (pinned/active/resolved)   │  │  │    │
│  │  │               │  │  │  - Thread (hidden)                   │  │  │    │
│  │  │               │  │  └─────────────────────────────────────┘  │  │    │
│  │  │               │  │  ┌─────────────────────────────────────┐  │  │    │
│  │  │               │  │  │      Comment Editor                 │  │  │    │
│  │  │               │  │  │  ┌───────────────────────────────┐  │  │  │    │
│  │  │               │  │  │  │     Tiptap Editor Instance    │  │  │  │    │
│  │  │               │  │  │  │  - Toolbar                    │  │  │  │    │
│  │  │               │  │  │  │  - Command Palette            │  │  │  │    │
│  │  │               │  │  │  │  - Auto-complete Dropdown     │  │  │  │    │
│  │  │               │  │  │  └───────────────────────────────┘  │  │  │    │
│  │  │               │  │  └─────────────────────────────────────┘  │  │    │
│  │  └───────────────┘  └───────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      EDITOR SERVICES LAYER                                   │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐│
│  │  EditorCore   │  │CommandPalette │  │AutoComplete   │  │StateManager   ││
│  │  (Tiptap)     │  │  (Commands)   │  │  (Mentions)   │  │  (Undo/Redo)  ││
│  └───────┬───────┘  └───────┬───────┘  └───────┬───────┘  └───────┬───────┘│
│          │                  │                  │                  │         │
│          └──────────────────┼──────────────────┼──────────────────┘         │
│                             ▼                      ▼                         │
│                  ┌─────────────────────┐  ┌─────────────────────┐          │
│                  │   Event Bus         │  │   Auto-Save Manager │          │
│                  │  (Pub/Sub System)   │  │  (Debounced Save)   │          │
│                  └──────────┬──────────┘  └──────────┬──────────┘          │
│                             │                       │                       │
└─────────────────────────────┼───────────────────────┼───────────────────────┘
                              │                       │
                              ▼                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     STORAGE LAYER                                            │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                    File System Access API                              │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │                    kanban.md                                     │  │  │
│  │  │  ┌───────────────────────────────────────────────────────────┐  │  │  │
│  │  │  │ **Comments**:                                               │  │  │  │
│  │  │  │ <!-- COMMENT_THREAD_START -->                              │  │  │  │
│  │  │  │ - **thread-id**: thread-XXXXXXXXXXXX-XXXXXX                │  │  │  │
│  │  │  │   **status**: active|resolved|hidden                       │  │  │  │
│  │  │  │   **created**: ISO8601                                     │  │  │  │
│  │  │  │   ...                                                      │  │  │  │
│  │  │  │   - **comment-id**: comment-XXXXXXXXXXXX-XXXXXX            │  │  │  │
│  │  │  │     **author**: @username                                  │  │  │  │
│  │  │  │     **content**: {Tiptap JSON}                             │  │  │  │
│  │  │  │     **reactions**: {emoji: count}                          │  │  │  │
│  │  │  │   ...                                                      │  │  │  │
│  │  │  └───────────────────────────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                    LocalStorage (Fallback)                             │  │
│  │  - Unsaved drafts                                                     │  │
│  │  - Editor preferences                                                 │  │
│  │  - Session state                                                      │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Component Hierarchy

```
CommentSystem (Root Module)
│
├── EditorManager
│   ├── TiptapInstance
│   │   ├── Extensions
│   │   │   ├── StarterKit (Paragraph, Heading, etc.)
│   │   │   ├── MentionExtension (@users)
│   │   │   ├── TagExtension (#tags)
│   │   │   ├── TaskLinkExtension ([[tasks]])
│   │   │   ├── PlaceholderExtension
│   │   │   └── CustomMarks (Bold, Italic, etc.)
│   │   ├── InputRules (Markdown shortcuts)
│   │   └── KeyboardShortcuts
│   │
│   ├── Toolbar
│   │   ├── FormatButtons (Bold, Italic, etc.)
│   │   ├── HeadingButtons (H1-H6)
│   │   ├── ListButtons (Bullet, Numbered)
│   │   └── InsertButtons (Link, Image, Table)
│   │
│   └── EditorContainer
│       ├── ContentArea
│       ├── PlaceholderText
│       └── SelectionHighlighter
│
├── CommandPalette
│   ├── CommandRegistry
│   │   ├── FormattingCommands (/bold, /italic, etc.)
│   │   ├── HeadingCommands (/h1-/h6)
│   │   ├── ListCommands (/bullet, /numbered, etc.)
│   │   ├── BlockCommands (/quote, /callout, /table)
│   │   ├── MediaCommands (/image, /link, /emoji)
│   │   ├── TaskCommands (/assign, /due, /tag)
│   │   └── SystemCommands (/undo, /redo, /help)
│   │
│   ├── PaletteRenderer
│   │   ├── CategorySections
│   │   ├── CommandItems (with icons, descriptions)
│   │   └── SearchFilter
│   │
│   └── KeyboardNavigation
│       ├── ArrowKeyNavigation
│       ├── EnterToExecute
│       └── EscapeToClose
│
├── AutoCompleteManager
│   ├── MentionProvider (@users)
│   ├── TagProvider (#tags)
│   ├── TaskProvider ([[tasks]])
│   └── SuggestionRenderer
│       ├── DropdownPositioner
│       ├── ItemRenderer
│       └── KeyboardSelection
│
├── ThreadManager
│   ├── ThreadStore
│   │   ├── ThreadCollection
│   │   ├── CommentCollection
│   │   └── ReactionCollection
│   │
│   ├── ThreadRenderer
│   │   ├── ThreadList
│   │   ├── ThreadItem (pinned, active, resolved, hidden)
│   │   ├── CommentTree (nested replies)
│   │   └── ReactionDisplay
│   │
│   └── ThreadActions
│       ├── createThread()
│       ├── replyToThread()
│       ├── resolveThread()
│       ├── pinThread()
│       ├── hideThread()
│       └── deleteThread()
│
├── StateManager
│   ├── UndoRedoStack
│   │   ├── UndoStack
│   │   ├── RedoStack
│   │   └── GroupManager
│   │
│   ├── AutoSaveController
│   │   ├── DebounceTimer
│   │   ├── ContentComparator
│   │   └── SaveExecutor
│   │
│   └── ConflictResolver
│       ├── VersionTracker
│       ├── MergeStrategy
│       └── UserPrompt
│
└── StorageAdapter
    ├── FileSystemStorage (primary)
    │   ├── readComments(taskId)
    │   ├── writeComments(taskId, threads)
    │   └── watchForChanges()
    │
    └── LocalStorageFallback (secondary)
        ├── saveDraft()
        ├── loadDraft()
        └── clearDraft()
```

### 2.3 Data Flow Architecture

#### 2.3.1 Comment Creation Flow

```
User Action                    Data Flow
────────────────────────────────────────────────────────────────────────────

User clicks "Add Comment"
        │
        ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ 1. ThreadManager.createThread(taskId)                                    │
│    - Generate thread-id: thread-{timestamp}-{random}                     │
│    - Create thread object with status: 'active'                          │
│    - Initialize comments array                                           │
└──────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ 2. UI renders empty comment editor with placeholder                      │
│    - EditorManager initializes Tiptap instance                           │
│    - Bind keyboard shortcuts                                             │
│    - Show placeholder text                                               │
└──────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ 3. User types content with formatting                                    │
│    - Tiptap captures input events                                        │
│    - Custom extensions process @mentions, #tags                          │
│    - CommandPalette detects "/" trigger                                  │
│    - AutoCompleteManager shows suggestions                               │
└──────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ 4. Editor emits 'content-change' event                                   │
│    - EventBus.publish('content-change', { content, selection })          │
│    - StateManager captures state for undo/redo                           │
│    - AutoSaveController starts debounce timer (300ms)                    │
└──────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ 5. User clicks "Save" or debounce triggers                               │
│    - AutoSaveController.execute()                                        │
│    - Serialize Tiptap JSON to Markdown                                   │
│    - Create comment object with content                                  │
│    - Generate comment-id: comment-{timestamp}-{random}                   │
│    - Add comment to thread.comments array                                │
│    - Update thread.updated timestamp                                     │
└──────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ 6. StorageAdapter.writeComments(taskId, threads)                         │
│    - Read current kanban.md file                                         │
│    - Parse existing content                                              │
│    - Replace comment section with new data                               │
│    - Write updated kanban.md via File System Access API                  │
└──────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ 7. Confirm save to user                                                  │
│    - UI shows "Saved" indicator                                          │
│    - ThreadRenderer updates with new comment                             │
│    - EventBus.publish('thread-updated', { threadId })                    │
└──────────────────────────────────────────────────────────────────────────┘
```

#### 2.3.2 Slash Command Execution Flow

```
User Types "/"              Data Flow
────────────────────────────────────────────────────────────────────────────

User types "/" in editor
        │
        ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ 1. Editor detects input rule trigger                                     │
│    - InputRules check for "/" character                                  │
│    - Prevent default "/" insertion                                       │
│    - Emit 'command-trigger' event                                        │
└──────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ 2. CommandPalette.show(context)                                          │
│    - Get current editor context (task/comment/description)               │
│    - CommandRegistry.getForContext(context)                              │
│    - Filter commands by category                                         │
│    - Position palette at cursor                                          │
└──────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ 3. User types to filter (optional)                                       │
│    - AutoCompleteManager filters visible commands                        │
│    - Update filtered command list                                        │
│    - Highlight matching items                                            │
└──────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ 4. User selects command (Arrow keys + Enter)                             │
│    - CommandPalette.execute(selectedCommandId)                           │
│    - Get command from CommandRegistry                                    │
│    - Validate context permissions                                        │
│    - Close palette                                                       │
└──────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ 5. Command execution                                                     │
│    - editor.commands.undoable(() => {                                    │
│        command.execute(editor)                                           │
│      }, { description: command.name })                                   │
│    - Insert formatted content at cursor                                  │
│    - Delete "/" trigger                                                  │
│    - Push to undo stack                                                  │
└──────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ 6. Post-execution actions                                                │
│    - AutoSaveController.trigger()                                        │
│    - Update toolbar state (active formats)                               │
│    - Emit 'format-applied' event                                         │
└──────────────────────────────────────────────────────────────────────────┘
```

### 2.4 Integration Points

The comment system integrates with existing application components through well-defined interfaces:

| Component | Integration Type | Interface | Data Flow |
|-----------|-----------------|-----------|-----------|
| **Task Modal** | UI Container | Modal Events | Opens comment panel, passes taskId |
| **File System API** | Storage | readFile/writeFile | Persists comments to kanban.md |
| **Theme System** | Styling | CSS Variables | Dark mode support for editor |
| **i18n System** | Localization | Translation Keys | All UI text strings |
| **Change Log** | Audit Trail | logChange() | Records significant operations |
| **Version Manager** | Version | bumpVersion() | Increments on feature complete |

---

## 3. Data Models

### 3.1 Comment and Thread Models

```typescript
// ============================================
// CORE DOMAIN MODELS
// ============================================

/**
 * Represents a conversation thread attached to a task.
 * Threads contain comments and manage conversation state.
 */
interface Thread {
  // Identification
  id: ThreadId;
  taskId: string;
  
  // Status and metadata
  status: ThreadStatus;
  pinned: boolean;
  created: ISO8601Timestamp;
  updated: ISO8601Timestamp;
  
  // Content
  commentCount: number;
  comments: Comment[];
  
  // Resolution tracking
  resolvedBy?: string;
  resolvedAt?: ISO8601Timestamp;
  hiddenBy?: string;
  
  // System messages
  systemMessages: SystemMessage[];
}

type ThreadStatus = 'active' | 'resolved' | 'hidden';

type ThreadId = string & { readonly brand: unique symbol };
function createThreadId(): ThreadId {
  return `thread-${Date.now()}-${generateRandomId(6)}` as ThreadId;
}

/**
 * Represents an individual comment within a thread.
 * Comments support rich text content and reactions.
 */
interface Comment {
  // Identification
  id: CommentId;
  threadId: ThreadId;
  parentId?: CommentId;  // For nested replies
  
  // Author information
  author: Username;
  authorName?: string;
  
  // Content
  content: RichContent;
  contentType: 'tiptap-json' | 'markdown';
  
  // Timestamps
  timestamp: ISO8601Timestamp;
  edited: boolean;
  editedAt?: ISO8601Timestamp;
  
  // Reactions (emoji -> reaction data)
  reactions: Record<Emoji, Reaction>;
  
  // Nested replies (if this is a parent comment)
  replies?: Comment[];
  
  // System comment indicator
  isSystem?: boolean;
  systemType?: SystemMessageType;
}

type CommentId = string & { readonly brand: unique symbol };
function createCommentId(): CommentId {
  return `comment-${Date.now()}-${generateRandomId(6)}` as CommentId;
}

type Username = string & { readonly brand: unique symbol };
function validateUsername(value: string): Username {
  if (!/^@[\w-]+$/.test(value)) {
    throw new Error(`Invalid username: ${value}`);
  }
  return value as Username;
}

/**
 * Represents an emoji reaction to a comment.
 */
interface Reaction {
  emoji: Emoji;
  count: number;
  users: Username[];  // Users who reacted
}

type Emoji = string;  // Any valid Unicode emoji
```

### 3.2 Rich Content Model

```typescript
/**
 * Rich text content stored in Tiptap JSON format.
 * This is the canonical format for editor content.
 */
interface RichContent {
  type: 'doc';
  content: TopLevelNode[];
}

/**
 * Nodes that can appear at the top level of a document.
 */
type TopLevelNode = 
  | ParagraphNode
  | HeadingNode
  | BlockquoteNode
  | CodeBlockNode
  | BulletListNode
  | OrderedListNode
  | TaskListNode
  | TableNode
  | HorizontalRuleNode
  | CalloutNode
  | CustomBlockNode;

/**
 * Inline content that can contain text with marks.
 */
type InlineContent = 
  | TextNode
  | HardBreakNode
  | MentionNode
  | TagNode
  | TaskLinkNode
  | LinkNode;

/**
 * Paragraph node - basic text block.
 */
interface ParagraphNode {
  type: 'paragraph';
  attrs?: Record<string, unknown>;
  content?: InlineContent[];
}

/**
 * Heading node with level 1-6.
 */
interface HeadingNode {
  type: 'heading';
  attrs: { level: 1 | 2 | 3 | 4 | 5 | 6 };
  content?: InlineContent[];
}

/**
 * Code block with optional language.
 */
interface CodeBlockNode {
  type: 'codeBlock';
  attrs: { language?: string };
  content: TextNode[];
}

/**
 * Table node with rows and cells.
 */
interface TableNode {
  type: 'table';
  attrs: { rows?: number; cols?: number };
  content: TableRow[];
}

interface TableRow {
  type: 'tableRow';
  content: TableCell[];
}

interface TableCell {
  type: 'tableCell';
  content?: TopLevelNode[];
}

/**
 * Notion-style callout block.
 */
interface CalloutNode {
  type: 'callout';
  attrs: {
    icon?: Emoji;
    title?: string;
  };
  content: ParagraphNode[];
}

/**
 * Text node with optional formatting marks.
 */
interface TextNode {
  type: 'text';
  text: string;
  marks?: Mark[];
}

/**
 * Formatting mark (bold, italic, etc.).
 */
interface Mark {
  type: MarkType;
  attrs?: Record<string, string>;
}

type MarkType = 
  | 'bold' 
  | 'italic' 
  | 'underline' 
  | 'strike' 
  | 'code' 
  | 'link' 
  | 'highlight'
  | 'subscript'
  | 'superscript';

/**
 * @mention node for user references.
 */
interface MentionNode {
  type: 'mention';
  attrs: {
    id: Username;
    label: string;
  };
}

/**
 * #tag node for tag references.
 */
interface TagNode {
  type: 'tag';
  attrs: {
    tag: string;
  };
}

/**
 * [[task]] node for task references.
 */
interface TaskLinkNode {
  type: 'taskLink';
  attrs: {
    taskId: string;
    taskTitle: string;
  };
}

/**
 * Hyperlink node.
 */
interface LinkNode {
  type: 'link';
  attrs: {
    href: string;
    title?: string;
  };
}
```

### 3.3 Revision History Model

```typescript
/**
 * Represents a single entry in the undo/redo stack.
 */
interface UndoEntry {
  // Identification
  id: string;
  groupId?: string;  // For grouping related operations
  
  // Operation metadata
  type: UndoEntryType;
  timestamp: ISO8601Timestamp;
  description: string;
  
  // State snapshots
  beforeState: RichContent;
  afterState: RichContent;
  
  // Context
  author: Username;
  context: UndoContext;
}

type UndoEntryType = 
  | 'comment_create'
  | 'comment_edit'
  | 'comment_delete'
  | 'comment_reply'
  | 'reaction_add'
  | 'reaction_remove'
  | 'format_apply'
  | 'command_execute';

interface UndoContext {
  threadId: ThreadId;
  commentId?: CommentId;
}

/**
 * Undo/redo stack configuration.
 */
interface UndoStackConfig {
  maxEntries: number;      // Maximum entries (default: 50)
  groupTimeout: number;    // ms for auto-grouping (default: 500)
  compressEnabled: boolean; // Enable compression (default: true)
}

/**
 * Revision history entry for audit trail.
 */
interface RevisionEntry {
  id: string;
  timestamp: ISO8601Timestamp;
  operation: RevisionOperation;
  entityType: 'thread' | 'comment';
  entityId: string;
  author: Username;
  beforeSnapshot?: unknown;
  afterSnapshot?: unknown;
}

type RevisionOperation = 
  | 'create'
  | 'update'
  | 'delete'
  | 'resolve'
  | 'unresolve'
  | 'pin'
  | 'unpin'
  | 'hide'
  | 'unhide';
```

### 3.4 Schema Migration Strategy

```typescript
/**
 * Versioned schema for comment data.
 * Enables backward compatibility and migrations.
 */
interface SchemaVersion {
  current: 1;
  minimumCompatible: 1;
}

const CURRENT_SCHEMA_VERSION: SchemaVersion = {
  current: 1,
  minimumCompatible: 1
};

/**
 * Migration function type.
 */
type MigrationFunction = (
  data: unknown,
  fromVersion: number
) => unknown;

/**
 * Registry of migrations for each version bump.
 */
const MIGRATIONS: Record<number, MigrationFunction> = {
  // v1: Initial schema (no migration needed)
  1: (data) => data,
};

/**
 * Apply migrations to bring data up to current version.
 */
function migrateData(
  data: unknown,
  fromVersion: number = CURRENT_SCHEMA_VERSION.minimumCompatible
): unknown {
  let currentData = data;
  
  for (let version = fromVersion; version < CURRENT_SCHEMA_VERSION.current; version++) {
    const migration = MIGRATIONS[version + 1];
    if (migration) {
      currentData = migration(currentData, version);
    }
  }
  
  return currentData;
}

/**
 * Validate data against schema.
 */
function validateSchema(data: unknown): ValidationResult {
  const schema = {
    type: 'object',
    required: ['id', 'threadId', 'author', 'content', 'timestamp'],
    properties: {
      id: { type: 'string', pattern: '^comment-\\d{13}-[a-z0-9]{6}$' },
      threadId: { type: 'string', pattern: '^thread-\\d{13}-[a-z0-9]{6}$' },
      parentId: { type: 'string', nullable: true },
      author: { type: 'string', pattern: '^@[\\w-]+$' },
      content: { type: 'object' },
      timestamp: { type: 'string', format: 'date-time' },
      edited: { type: 'boolean' },
      reactions: { type: 'object' }
    }
  };
  
  return ajv.validate(schema, data);
}
```

### 3.5 Storage Format (kanban.md)

```markdown
**Comments**:
<!-- COMMENT_THREAD_START -->
- **thread-id**: thread-XXXXXXXXXXXX-XXXXXX
  **status**: active | resolved | hidden
  **pinned**: true | false
  **created**: 2026-01-22T10:30:00Z
  **updated**: 2026-01-22T11:45:00Z
  **comment-count**: 3
  
  - **comment-id**: comment-XXXXXXXXXXXX-XXXXXX
    **author**: @username
    **timestamp**: 2026-01-22T10:30:00Z
    **edited**: true
    **edited-at**: 2026-01-22T11:00:00Z
    **content**: |
      {
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "Comment text here",
                "marks": [{"type": "bold"}]
              }
            ]
          }
        ]
      }
    **reactions**: { "👍": 3, "🎉": 1 }
    
    - **comment-id**: comment-XXXXXXXXXXXX-XXXXXX
      **author**: @username2
      **timestamp**: 2026-01-22T11:00:00Z
      **content**: |
        { Tiptap JSON }
      **reactions**: {}
      
  - **comment-id**: comment-XXXXXXXXXXXX-XXXXXX
    **author**: @username3
    **timestamp**: 2026-01-22T12:00:00Z
    **content**: |
      { Tiptap JSON }
    **reactions**: { "❤️": 1 }
    
  - **system**: resolved
    **by**: @username
    **at**: 2026-01-22T12:30:00Z
<!-- COMMENT_THREAD_END -->
```

---

## 4. API Design

### 4.1 Comment System API

```typescript
/**
 * Main API interface for the enhanced comments system.
 * Provides all operations for managing comments, threads, and reactions.
 */
interface CommentSystemAPI {
  // ========================================
  // Initialization
  // ========================================
  
  /**
   * Initialize the comment system.
   * Must be called before any other operations.
   */
  init(options: InitOptions): Promise<void>;
  
  /**
   * Destroy the comment system and clean up resources.
   */
  destroy(): void;
  
  /**
   * Load comments for a specific task.
   */
  loadComments(taskId: string): Promise<Thread[]>;
  
  // ========================================
  // Thread Operations
  // ========================================
  
  /**
   * Create a new thread on a task.
   */
  createThread(taskId: string, initialContent?: RichContent): Promise<Thread>;
  
  /**
   * Delete a thread and all its comments.
   */
  deleteThread(threadId: ThreadId): Promise<void>;
  
  /**
   * Resolve a thread.
   */
  resolveThread(threadId: ThreadId): Promise<void>;
  
  /**
   * Unresolve a thread.
   */
  unresolveThread(threadId: ThreadId): Promise<void>;
  
  /**
   * Pin a thread (only one pinned per task).
   */
  pinThread(threadId: ThreadId): Promise<void>;
  
  /**
   * Unpin a thread.
   */
  unpinThread(threadId: ThreadId): Promise<void>;
  
  /**
   * Hide a thread from the main view.
   */
  hideThread(threadId: ThreadId): Promise<void>;
  
  /**
   * Unhide a thread.
   */
  unhideThread(threadId: ThreadId): Promise<void>;
  
  // ========================================
  // Comment Operations
  // ========================================
  
  /**
   * Add a comment to a thread.
   */
  addComment(threadId: ThreadId, content: RichContent): Promise<Comment>;
  
  /**
   * Edit an existing comment.
   */
  editComment(commentId: CommentId, newContent: RichContent): Promise<Comment>;
  
  /**
   * Delete a comment.
   */
  deleteComment(commentId: CommentId): Promise<void>;
  
  /**
   * Reply to a comment (creates nested reply).
   */
  replyToComment(parentCommentId: CommentId, content: RichContent): Promise<Comment>;
  
  // ========================================
  // Reaction Operations
  // ========================================
  
  /**
   * Add a reaction to a comment.
   */
  addReaction(commentId: CommentId, emoji: Emoji): Promise<void>;
  
  /**
   * Remove a reaction from a comment.
   */
  removeReaction(commentId: CommentId, emoji: Emoji): Promise<void>;
  
  /**
   * Toggle a reaction (add if not present, remove if present).
   */
  toggleReaction(commentId: CommentId, emoji: Emoji): Promise<void>;
  
  // ========================================
  // Editor Operations
  // ========================================
  
  /**
   * Create an editor instance in a container.
   */
  createEditor(
    container: HTMLElement,
    options?: EditorOptions
  ): EditorInstance;
  
  /**
   * Get the current editor instance.
   */
  getActiveEditor(): EditorInstance | null;
  
  /**
   * Serialize editor content to Markdown.
   */
  serializeToMarkdown(content: RichContent): string;
  
  /**
   * Parse Markdown to Tiptap JSON.
   */
  parseMarkdown(markdown: string): RichContent;
  
  // ========================================
  // Auto-complete Operations
  // ========================================
  
  /**
   * Get user suggestions for @mention.
   */
  getUserSuggestions(query: string): Promise<UserSuggestion[]>;
  
  /**
   * Get tag suggestions for #tag.
   */
  getTagSuggestions(query: string): Promise<string[]>;
  
  /**
   * Get task suggestions for [[task]].
   */
  getTaskSuggestions(query: string): Promise<TaskSuggestion[]>;
  
  // ========================================
  // Slash Commands
  // ========================================
  
  /**
   * Register a custom slash command.
   */
  registerCommand(command: SlashCommand): void;
  
  /**
   * Unregister a slash command.
   */
  unregisterCommand(commandId: string): void;
  
  /**
   * Get all available commands.
   */
  getCommands(): SlashCommand[];
  
  // ========================================
  // State Management
  // ========================================
  
  /**
   * Undo the last action.
   */
  undo(): boolean;
  
  /**
   * Redo the last undone action.
   */
  redo(): boolean;
  
  /**
   * Check if undo is available.
   */
  canUndo(): boolean;
  
  /**
   * Check if redo is available.
   */
  canRedo(): boolean;
  
  /**
   * Manually trigger a save.
   */
  save(): Promise<void>;
  
  // ========================================
  // Event Subscription
  // ========================================
  
  /**
   * Subscribe to events.
   */
  on<K extends keyof CommentEventMap>(
    event: K,
    handler: (event: CommentEventMap[K]) => void
  ): UnsubscribeFn;
  
  /**
   * Subscribe to events (once).
   */
  once<K extends keyof CommentEventMap>(
    event: K,
    handler: (event: CommentEventMap[K]) => void
  ): UnsubscribeFn;
  
  /**
   * Publish an event.
   */
  emit<K extends keyof CommentEventMap>(
    event: K,
    data: CommentEventMap[K]
  ): void;
}

/**
 * Initialization options.
 */
interface InitOptions {
  currentUser: Username;
  theme: 'light' | 'dark' | 'auto';
  locale: string;
  autoSaveEnabled?: boolean;
  autoSaveDelay?: number;
  onError?: (error: Error) => void;
}

/**
 * Editor creation options.
 */
interface EditorOptions {
  initialContent?: RichContent;
  placeholder?: string;
  autofocus?: boolean;
  editable?: boolean;
  onContentChange?: (content: RichContent) => void;
  onSelectionChange?: (selection: Selection) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

/**
 * Event map for type-safe event handling.
 */
interface CommentEventMap {
  'thread-created': ThreadCreatedEvent;
  'thread-updated': ThreadUpdatedEvent;
  'thread-deleted': ThreadDeletedEvent;
  'thread-resolved': ThreadResolvedEvent;
  'thread-reopened': ThreadReopenedEvent;
  'comment-added': CommentAddedEvent;
  'comment-edited': CommentEditedEvent;
  'comment-deleted': CommentDeletedEvent;
  'reaction-added': ReactionAddedEvent;
  'reaction-removed': ReactionRemovedEvent;
  'content-change': ContentChangeEvent;
  'save-complete': SaveCompleteEvent;
  'save-failed': SaveFailedEvent;
  'undo-stack-change': UndoStackChangeEvent;
}
```

### 4.2 Threading API

```typescript
/**
 * API for managing comment threads.
 */
interface ThreadAPI {
  /**
   * Get all threads for a task.
   */
  getThreadsByTask(taskId: string): Promise<Thread[]>;
  
  /**
   * Get a specific thread by ID.
   */
  getThread(threadId: ThreadId): Promise<Thread | null>;
  
  /**
   * Get threads filtered by status.
   */
  getThreadsByStatus(
    taskId: string,
    status: ThreadStatus
  ): Promise<Thread[]>;
  
  /**
   * Get the pinned thread for a task (if any).
   */
  getPinnedThread(taskId: string): Promise<Thread | null>;
  
  /**
   * Get thread statistics.
   */
  getThreadStats(taskId: string): Promise<ThreadStats>;
  
  /**
   * Sort threads according to display rules.
   */
  sortThreads(threads: Thread[]): Thread[];
}

interface ThreadStats {
  total: number;
  active: number;
  resolved: number;
  hidden: number;
  totalComments: number;
}
```

### 4.3 Editor API

```typescript
/**
 * Tiptap editor instance interface.
 */
interface EditorInstance {
  // Properties
  readonly isActive: boolean;
  readonly isEmpty: boolean;
  readonly isFocused: boolean;
  readonly content: RichContent;
  readonly selection: Selection;
  
  // Methods
  setContent(content: RichContent): void;
  getContent(): RichContent;
  getText(): string;
  getHTML(): string;
  getMarkdown(): string;
  
  // Selection
  setSelection(from: number, to: number): void;
  getSelection(): Selection;
  selectAll(): void;
  clearSelection(): void;
  
  // Focus
  focus(): void;
  blur(): void;
  
  // Formatting
  toggleBold(): void;
  toggleItalic(): void;
  toggleUnderline(): void;
  toggleStrike(): void;
  toggleCode(): void;
  toggleHeading(level: 1 | 2 | 3 | 4 | 5 | 6): void;
  toggleBulletList(): void;
  toggleOrderedList(): void;
  toggleBlockquote(): void;
  toggleCodeBlock(): void;
  
  // Insertion
  insertText(text: string): void;
  insertContent(content: RichContent | string): void;
  insertNode(node: Node, position?: number): void;
  deleteSelection(): void;
  
  // History
  undo(): void;
  redo(): void;
  
  // Cleanup
  destroy(): void;
}

/**
 * Selection information.
 */
interface Selection {
  from: number;
  to: number;
  empty: boolean;
}
```

### 4.4 Slash Command API

```typescript
/**
 * Slash command definition.
 */
interface SlashCommand {
  // Identification
  id: string;
  name: string;
  description: string;
  
  // UI
  icon: string;  // Emoji or SVG
  category: CommandCategory;
  
  // Search
  keywords: string[];
  examples?: string[];
  
  // Context
  enabledIn: ContextType[];
  hidden?: boolean;
  
  // Execution
  execute: (editor: EditorInstance) => void;
  filter?: (query: string, context: EditorContext) => boolean;
  
  // Keyboard shortcut
  shortcut?: string;
}

type CommandCategory = 
  | 'formatting'
  | 'headings'
  | 'lists'
  | 'blocks'
  | 'media'
  | 'tasks'
  | 'comments'
  | 'advanced'
  | 'system';

type ContextType = 'task' | 'comment' | 'description' | 'notes';

interface EditorContext {
  type: ContextType;
  threadId?: ThreadId;
  commentId?: CommentId;
}

/**
 * Command registry interface.
 */
interface CommandRegistry {
  /**
   * Register a command.
   */
  register(command: SlashCommand): void;
  
  /**
   * Unregister a command.
   */
  unregister(commandId: string): void;
  
  /**
   * Get a command by ID.
   */
  get(commandId: string): SlashCommand | undefined;
  
  /**
   * Get all commands for a context.
   */
  getForContext(context: EditorContext): SlashCommand[];
  
  /**
   * Search commands by query.
   */
  search(query: string, context: EditorContext): SlashCommand[];
  
  /**
   * Get commands grouped by category.
   */
  getGroupedByCategory(context: EditorContext): Map<CommandCategory, SlashCommand[]>;
  
  /**
   * Execute a command.
   */
  execute(commandId: string, editor: EditorInstance): void;
}
```

### 4.5 State Management API

```typescript
/**
 * State management interface.
 */
interface StateManagerAPI {
  /**
   * Get current undo stack.
   */
  getUndoStack(): UndoEntry[];
  
  /**
   * Get current redo stack.
   */
  getRedoStack(): UndoEntry[];
  
  /**
   * Push a new entry to the undo stack.
   */
  push(entry: Omit<UndoEntry, 'id' | 'timestamp'>): UndoEntry;
  
  /**
   * Undo the last action.
   */
  undo(): boolean;
  
  /**
   * Redo the last undone action.
   */
  redo(): boolean;
  
  /**
   * Clear all history.
   */
  clear(): void;
  
  /**
   * Start a group for related operations.
   */
  startGroup(description: string): void;
  
  /**
   * End the current group.
   */
  endGroup(): void;
  
  /**
   * Check if currently in a group.
   */
  isInGroup(): boolean;
  
  /**
   * Set the maximum stack size.
   */
  setMaxSize(size: number): void;
}

/**
 * Auto-save configuration and state.
 */
interface AutoSaveConfig {
  enabled: boolean;
  delay: number;  // ms
  onSave: (content: RichContent) => Promise<void>;
  onError: (error: Error) => void;
  onComplete: () => void;
}

interface AutoSaveState {
  status: 'idle' | 'saving' | 'success' | 'error';
  lastSaved: ISO8601Timestamp | null;
  pendingChanges: boolean;
  retryCount: number;
}
```

---

## 5. Component Architecture

### 5.1 Editor Component Design

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Editor Component                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        Toolbar Container                             │    │
│  │  ┌───────────────────────────────────────────────────────────────┐  │    │
│  │  │  B  I  U  S  ::code:  [H1▼]  [List▼]  [Insert▼]   |  /command  │  │    │
│  │  └───────────────────────────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      Editor Content Area                             │    │
│  │  ┌───────────────────────────────────────────────────────────────┐  │    │
│  │  │                                                               │  │    │
│  │  │                     (Tiptap Editor)                            │  │    │
│  │  │                                                               │  │    │
│  │  │            Placeholder: "Write a comment..."                   │  │    │
│  │  │                                                               │  │    │
│  │  │                                                               │  │    │
│  │  └───────────────────────────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      Floating Elements                               │    │
│  │  ┌───────────────────────────────────────────────────────────────┐  │    │
│  │  │  /command   [Bold] [Italic] [Code] [Link] [Heading] ...       │  │    │
│  │  │              (Command Palette - shows on /)                   │  │    │
│  │  └───────────────────────────────────────────────────────────────┘  │    │
│  │  ┌───────────────────────────────────────────────────────────────┐  │    │
│  │  │  @  [Alice]  [Alex]  [Allen]  [Amanda]                        │  │    │
│  │  │      (Auto-complete Dropdown - shows on @)                    │  │    │
│  │  └───────────────────────────────────────────────────────────────┘  │    │
│  │  ┌───────────────────────────────────────────────────────────────┐  │    │
│  │  │  #  [bug]  [feature]  [urgent]  [docs]  [tech-debt]           │  │    │
│  │  │      (Tag Dropdown - shows on #)                              │  │    │
│  │  └───────────────────────────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      Status Bar                                      │    │
│  │  [Word count: 42]  |  [Last saved: 10:30 AM]  |  [Undo/Redo]       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Comment Thread Component

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Comment Thread List                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  📌 PINNED THREAD                                                    │    │
│  │  ┌───────────────────────────────────────────────────────────────┐  │    │
│  │  │  Thread: Feature discussion                                    │  │    │
│  │  │  Started by @alice • 2 comments • Last activity 5m ago        │  │    │
│  │  │  [Resolve] [Hide] [Unpin]                                      │  │    │
│  │  └───────────────────────────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  💬 ACTIVE THREADS (3)                                               │    │
│  │  ┌───────────────────────────────────────────────────────────────┐  │    │
│  │  │  RE: UI Update                                                 │  │    │
│  │  │  ┌─────────────────────────────────────────────────────────┐  │  │    │
│  │  │  │ 👤 @bob • 10:30 AM                                        │  │  │    │
│  │  │  │                                                           │  │  │    │
│  │  │  │   I think we should use a darker shade for the header.    │  │  │    │
│  │  │  │                                                           │  │  │    │
│  │  │  │   [👍 2] [🎉 1] [Reply] [Edit] [More ▼]                   │  │  │    │
│  │  │  └─────────────────────────────────────────────────────────┘  │  │    │
│  │  │    ↳ 💬 @alice • 10:35 AM                                     │  │    │
│  │  │      ┌─────────────────────────────────────────────────────┐  │  │    │
│  │  │      │ Agreed! Let me check the color palette.             │  │  │    │
│  │  │      │ [👍] [Reply] [Edit] [More ▼]                         │  │  │    │
│  │  │      └─────────────────────────────────────────────────────┘  │  │    │
│  │  │        ↳ 💬 @charlie • 10:40 AM                              │  │    │
│  │  │          ┌─────────────────────────────────────────────────┐  │  │    │
│  │  │          │ +1 for darker headers                            │  │  │    │
│  │  │          │ [👍] [Reply] [Edit] [More ▼]                     │  │  │    │
│  │  │          └─────────────────────────────────────────────────┘  │  │    │
│  │  │  [Resolve] [Hide] [Pin] [Share]                             │  │    │
│  │  └───────────────────────────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  ✓ RESOLVED THREADS (1)                                              │    │
│  │  ┌───────────────────────────────────────────────────────────────┐  │    │
│  │  │  RE: Date picker issue [RESOLVED]                             │  │    │
│  │  │  ┌─────────────────────────────────────────────────────────┐  │  │    │
│  │  │  │ ✅ Resolved by @diana on Jan 20, 2026                    │  │  │    │
│  │  │  └─────────────────────────────────────────────────────────┘  │  │    │
│  │  │  [Reopen] [Show]                                             │  │    │
│  │  └───────────────────────────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  [+ Add New Thread]                                                 │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.3 Slash Command Component

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Command Palette UI                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  🔍 Search commands...                           [/] [×]            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─ Formatting ─────────────────────────────────────────────────────────┐    │
│  │  ✏️  **Bold**         Make text bold              [Ctrl+B]           │    │
│  │  *I*  *Italic*       Make text italic            [Ctrl+I]           │    │
│  │  U⃒  Underline        Underline text              [Ctrl+U]           │    │
│  │  S̷  ~~Strike~~       Strikethrough text                            │    │
│  │  ` `  `Code`         Inline code format                             │    │
│  │  ```  Code block     Multi-line code block                          │    │
│  │  🖍  Highlight        Highlight text background                     │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─ Headings ───────────────────────────────────────────────────────────┐    │
│  │  H1  Heading 1       Large heading                                 │    │
│  │  H2  Heading 2       Medium heading                                │    │
│  │  H3  Heading 3       Small heading                                 │    │
│  │  H4  Heading 4       Subheading                                    │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─ Lists ──────────────────────────────────────────────────────────────┐    │
│  │  •  Bullet list      Create bullet list                            │    │
│  │  1.  Numbered list   Create numbered list                          │    │
│  │  ☑  Checklist       Create checkbox item                          │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─ Blocks ─────────────────────────────────────────────────────────────┐    │
│  │  ❝  Block quote     Create quote block                            │    │
│  │  💡  Callout         Notion-style callout                          │    │
│  │  ―  Divider         Horizontal rule                               │    │
│  │  ⊞  Table           Insert table                                  │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─ Media ──────────────────────────────────────────────────────────────┐    │
│  │  🖼  Image           Insert image from URL                         │    │
│  │  🔗  Link            Insert hyperlink                              │    │
│  │  😀  Emoji           Quick emoji picker                            │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─ Tasks ──────────────────────────────────────────────────────────────┐    │
│  │  ✓  Subtask          Create subtask item                           │    │
│  │  ⏰  Reminder         Set reminder                                  │    │
│  │  📅  Due date         Set due date                                 │    │
│  │  👤  Assign           Assign to user                               │    │
│  │  #   Add tag          Add tag to content                           │    │
│  │  🔗  Task link        Link to another task                         │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─ Advanced ───────────────────────────────────────────────────────────┐    │
│  │  📋  Template         Insert content template                       │    │
│  │  📆  Date             Insert current date                           │    │
│  │  ∑   Math             Insert math equation                         │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─ System ─────────────────────────────────────────────────────────────┐    │
│  │  ↩  Undo              Undo last action                              │    │
│  │  ↪  Redo              Redo action                                   │    │
│  │  ❓  Help              Show command help                            │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  ↑↓ Navigate   ↹ Select   ↵ Execute   ✕ Close                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.4 Component Communication Patterns

```typescript
/**
 * Event Bus for component communication.
 * Implements publish/subscribe pattern for loose coupling.
 */
class EventBus {
  private handlers: Map<string, Set<EventHandler>> = new Map();
  private wildcardHandlers: Set<EventHandler> = new Map();
  
  /**
   * Subscribe to an event type.
   */
  on(event: string, handler: EventHandler): UnsubscribeFn;
  
  /**
   * Subscribe to multiple event types.
   */
  on(events: string[], handler: EventHandler): UnsubscribeFn;
  
  /**
   * Subscribe to all events (wildcard).
   */
  onWildcard(handler: EventHandler): UnsubscribeFn;
  
  /**
   * Subscribe once (auto-unsubscribe after first emission).
   */
  once(event: string, handler: EventHandler): UnsubscribeFn;
  
  /**
   * Publish an event.
   */
  emit(event: string, data?: unknown): void;
  
  /**
   * Publish an event asynchronously.
   */
  emitAsync(event: string, data?: unknown): Promise<void>;
  
  /**
   * Unsubscribe a handler.
   */
  off(event: string, handler: EventHandler): void;
  
  /**
   * Unsubscribe all handlers for an event.
   */
  offAll(event: string): void;
  
  /**
   * Remove all handlers.
   */
  reset(): void;
}

/**
 * Example component communication flow.
 */
class CommentEditorComponent {
  private eventBus: EventBus;
  private editor: EditorInstance;
  
  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.initEditor();
    this.bindEvents();
  }
  
  private initEditor() {
    this.editor = commentSystem.createEditor(this.container, {
      onContentChange: (content) => {
        // Emit content change event
        this.eventBus.emit('content-change', {
          type: 'content-change',
          timestamp: new Date().toISOString(),
          content,
          threadId: this.currentThreadId
        });
      },
      onFocus: () => {
        this.eventBus.emit('editor-focus', {
          type: 'editor-focus',
          threadId: this.currentThreadId
        });
      },
      onBlur: () => {
        this.eventBus.emit('editor-blur', {
          type: 'editor-blur',
          threadId: this.currentThreadId
        });
      }
    });
  }
  
  private bindEvents() {
    // Listen for thread selection changes
    this.eventBus.on('thread-selected', (event) => {
      this.currentThreadId = event.threadId;
      this.loadThreadContent(event.threadId);
    });
    
    // Listen for formatting commands from toolbar
    this.eventBus.on('format-command', (event) => {
      this.applyFormatting(event.format);
    });
    
    // Listen for save completion
    this.eventBus.on('save-complete', () => {
      this.showSavedIndicator();
    });
  }
}

/**
 * State store for centralized state management.
 * Implements a simple state machine pattern.
 */
class CommentStateStore {
  private state: CommentSystemState;
  private listeners: Set<StateListener> = new Set();
  
  /**
   * Get current state.
   */
  getState(): CommentSystemState {
    return { ...this.state };
  }
  
  /**
   * Update state (immer-style immutable updates).
   */
  setState(partial: Partial<CommentSystemState>): void {
    const newState = produce(this.state, (draft) => {
      Object.assign(draft, partial);
    });
    
    this.state = newState;
    this.notifyListeners();
  }
  
  /**
   * Subscribe to state changes.
   */
  subscribe(listener: StateListener): UnsubscribeFn {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  
  private notifyListeners() {
    const state = this.getState();
    this.listeners.forEach(listener => listener(state));
  }
}
```

---

## 6. Design Decisions & Trade-offs

### 6.1 Technical Decisions Log

| Decision ID | Decision | Rationale | Status |
|-------------|----------|-----------|--------|
| TD-001 | Use Tiptap for rich text editing | Headless architecture allows full UI customization; ProseMirror foundation provides reliability; TypeScript support enables type safety | Approved |
| TD-002 | CDN loading with inline fallback | Single-file architecture constraint; CDN provides latest version; inline fallback enables offline use | Approved |
| TD-003 | Flat comment storage with parent references | Simplifies parsing and file operations; preserves hierarchy through parentId; matches kanban.md structure | Approved |
| TD-004 | Event-driven architecture | Loose coupling between components; supports undo/redo and auto-save; enables plugin architecture | Approved |
| TD-005 | 300ms debounce for auto-save | Balances responsiveness with performance; prevents excessive file writes; reasonable window for rapid typing | Approved |
| TD-006 | Client-side only operation | Single-file architecture requirement; no server infrastructure; full data ownership | Approved |
| TD-007 | Custom node extensions for @/#/[[ | Native Tiptap extension support; better integration than regex-based replacement; preserves semantic meaning | Approved |
| TD-008 | Emoji-based reactions only | Cross-platform compatibility; no external emoji picker dependency; sufficient for most use cases | Approved |
| TD-009 | Thread status: active/resolved/hidden | Covers all use cases; matches user mental model; simple state transitions | Approved |
| TD-010 | Maximum 5 levels of nesting | Prevents UI chaos; reasonable depth for conversations; simplifies rendering logic | Approved |

### 6.2 Trade-off Analysis

#### 6.2.1 Tiptap vs. Custom contenteditable

| Factor | Tiptap | Custom contenteditable |
|--------|--------|------------------------|
| Implementation effort | Low (library provides core) | High (all features from scratch) |
| Bundle size | ~30KB gzipped | ~5KB minimal |
| Customization | Full control via headless design | Complete control | 
| Browser compatibility | Excellent (ProseMirror tested) | Requires extensive testing |
| Learning curve | Medium (new API) | Low (standard DOM APIs) |
| Maintainability | Active project, updates | Single developer/maintainer |
| Markdown compatibility | Good (with extensions) | Full control |

**Decision**: Tiptap chosen for balance of effort, quality, and maintainability despite larger bundle size.

#### 6.2.2 CDN vs. Inline Library

| Factor | CDN | Inline |
|--------|-----|--------|
| Offline capability | None (requires network) | Full offline |
| Update mechanism | Automatic | Manual update required |
| Cache behavior | Cached by browser | Embedded in HTML |
| Single-file purity | Compromised (external dependency) | Pure single file |
| Version flexibility | Easy to change versions | Requires rebuild |

**Decision**: CDN primary with inline fallback. Users with network access get latest version; offline users have degraded but functional experience.

#### 6.2.3 Flat vs. Nested Comment Storage

| Factor | Flat (parentId) | Nested (tree) |
|--------|-----------------|---------------|
| File parsing | Simple iteration | Recursive parsing |
| Editing | Straightforward index access | Complex tree traversal |
| Rendering | Must reconstruct tree | Direct recursive render |
| Storage size | Slightly larger (parentId repeated) | More compact |
| Thread replies | Single level only | Deep nesting |

**Decision**: Flat storage chosen for simplicity and reliability. Tree can be reconstructed on read.

#### 6.2.4 Auto-save Strategy

| Factor | Immediate | Debounced (300ms) | Manual |
|--------|-----------|-------------------|--------|
| Data safety | Highest | High | Low |
| File writes | Excessive | Moderate | Minimal |
| UX feedback | Constant saving indicator | Periodic | Only on explicit save |
| Conflict risk | Lowest | Low | High |

**Decision**: Debounced 300ms balances safety with performance. User can still manually save if needed.

### 6.3 Alternative Approaches Considered

#### 6.3.1 ProseMirror Direct Integration

**Alternative**: Use ProseMirror directly without Tiptap abstraction.

**Pros**:
- Smaller bundle (no abstraction layer)
- More control over internals
- No dependency on Tiptap versioning

**Cons**:
- Higher implementation effort
- No TypeScript definitions out of box
- Less community support for direct ProseMirror

**Rejected**: Tiptap's abstraction provides better developer experience and sufficient flexibility.

#### 6.3.2 Markdown-Only Editor (Textarea)

**Alternative**: Use simple textarea with Markdown syntax and live preview.

**Pros**:
- Minimal bundle size
- Maximum compatibility
- Simple implementation

**Cons**:
- Poor user experience
- No WYSIWYG editing
- Steeper learning curve for users

**Rejected**: Modern user expectations require rich text editing capabilities.

#### 6.3.3 Server-Based Storage

**Alternative**: Use backend server for comment storage.

**Pros**:
- Real-time collaboration
- Cross-device sync
- Backup/restore capabilities

**Cons**:
- Infrastructure requirements
- Privacy concerns
- Contradicts single-file philosophy
- Hosting costs

**Rejected**: Project philosophy emphasizes local-first, single-file architecture.

#### 6.3.4 Block-Based Editor (Notion-style)

**Alternative**: Use block-based editor model like Notion.

**Pros**:
- Modern user experience
- Easy content reorganization
- Flexible block types

**Cons**:
- More complex implementation
- Different data model
- Higher learning curve

**Rejected**: Tiptap's document model sufficient; block architecture deferred to future version.

---

## 7. Implementation Roadmap

### 7.1 Phased Implementation Plan

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        IMPLEMENTATION PHASES                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PHASE 1: Foundation (Weeks 1-2)                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Core Infrastructure                                                  │    │
│  │  □ Task 1.1: Set up project structure and TypeScript configs        │    │
│  │  □ Task 1.2: Implement Event Bus and State Store                     │    │
│  │  □ Task 1.3: Create data models and validation schemas               │    │
│  │  □ Task 1.4: Implement storage adapter (File System API)             │    │
│  │  □ Task 1.5: Create basic CSS variables for editor                   │    │
│  │                                                                        │    │
│  │ Dependencies: None                                                    │    │
│  │ Effort: 2.1                                                           │    │
│  │ Output: Core infrastructure ready                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  PHASE 2: Editor Core (Weeks 2-3)                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Tiptap Integration                                                    │    │
│  │  □ Task 2.1: Integrate Tiptap library (CDN + fallback)               │    │
│  │  □ Task 2.2: Configure basic extensions (StarterKit)                 │    │
│  │  □ Task 2.3: Create Editor component with toolbar                    │    │
│  │  □ Task 2.4: Implement keyboard shortcuts (bold, italic, etc.)       │    │
│  │  □ Task 2.5: Add placeholder and basic styling                       │    │
│  │                                                                        │    │
│  │ Dependencies: Phase 1                                                 │    │
│  │ Effort: 2.4                                                           │    │
│  │ Output: Functional rich text editor                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  PHASE 3: Custom Extensions (Weeks 3-4)                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Custom Nodes and Marks                                                │    │
│  │  □ Task 3.1: Implement MentionNode extension (@users)                │    │
│  │  □ Task 3.2: Implement TagNode extension (#tags)                     │    │
│  │  □ Task 3.3: Implement TaskLinkNode extension ([[tasks]])            │    │
│  │  □ Task 3.4: Create input rules for markdown shortcuts               │    │
│  │  □ Task 3.5: Add paste handlers for links and images                 │    │
│  │                                                                        │    │
│  │ Dependencies: Phase 2                                                 │    │
│  │ Effort: 2.8                                                           │    │
│  │ Output: Smart content recognition                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  PHASE 4: Slash Commands (Weeks 4-5)                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Command Palette System                                                │    │
│  │  □ Task 4.1: Create Command Registry infrastructure                  │    │
│  │  □ Task 4.2: Implement Command Palette UI                            │    │
│  │  □ Task 4.3: Add formatting commands (bold, italic, etc.)            │    │
│  │  □ Task 4.4: Add heading and list commands                           │    │
│  │  □ Task 4.5: Add block commands (quote, table, callout)              │    │
│  │  □ Task 4.6: Add keyboard navigation to palette                      │    │
│  │                                                                        │    │
│  │ Dependencies: Phase 2, 3                                              │    │
│  │ Effort: 3.2                                                           │    │
│  │ Output: Notion-style command palette                                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  PHASE 5: Auto-complete (Weeks 5-6)                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Smart Suggestions                                                     │    │
│  │  □ Task 5.1: Create AutoComplete Manager                              │    │
│  │  □ Task 5.2: Implement @mention suggestions                           │    │
│  │  □ Task 5.3: Implement #tag suggestions                               │    │
│  │  □ Task 5.4: Implement [[task]] suggestions                           │    │
│  │  □ Task 5.5: Add keyboard navigation to dropdowns                    │    │
│  │  □ Task 5.6: Implement suggestion filtering and ranking              │    │
│  │                                                                        │    │
│  │ Dependencies: Phase 3                                                 │    │
│  │ Effort: 2.1                                                           │    │
│  │ Output: Intelligent auto-complete system                              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  PHASE 6: Comment Threading (Weeks 6-7)                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Thread Infrastructure                                                 │    │
│  │  □ Task 6.1: Implement Thread data model and storage                 │    │
│  │  □ Task 6.2: Create Thread List UI                                   │    │
│  │  □ Task 6.3: Implement thread creation and deletion                  │    │
│  │  □ Task 6.4: Add reply functionality (nested)                        │    │
│  │  □ Task 6.5: Implement thread status (active/resolved/hidden)        │    │
│  │  □ Task 6.6: Add pin/unpin functionality                             │    │
│  │                                                                        │    │
│  │ Dependencies: Phase 1                                                 │    │
│  │ Effort: 2.9                                                           │    │
│  │ Output: Full threading system                                         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  PHASE 7: Reactions & State (Weeks 7-8)                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Reactions and State Management                                        │    │
│  │  □ Task 7.1: Implement emoji reaction system                         │    │
│  │  □ Task 7.2: Create Undo/Redo stack manager                          │    │
│  │  □ Task 7.3: Implement debounced auto-save                           │    │
│  │  □ Task 7.4: Add conflict resolution (basic)                         │    │
│  │  □ Task 7.5: Implement revision history (optional)                   │    │
│  │                                                                        │    │
│  │ Dependencies: Phase 1, 6                                              │    │
│  │ Effort: 2.3                                                           │    │
│  │ Output: Complete state management                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  PHASE 8: Integration & Polish (Weeks 8-9)                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Final Integration                                                      │    │
│  │  □ Task 8.1: Integrate with Task Modal                               │    │
│  │  □ Task 8.2: Add dark mode support                                   │    │
│  │  □ Task 8.3: Implement i18n strings                                  │    │
│  │  □ Task 8.4: Add accessibility features (ARIA, keyboard)             │    │
│  │  □ Task 8.5: Performance optimization                                │    │
│  │  □ Task 8.6: Comprehensive testing                                   │    │
│  │                                                                        │    │
│  │ Dependencies: All previous phases                                     │    │
│  │ Effort: 2.8                                                           │    │
│  │ Output: Feature-complete v1.2.0                                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  TOTAL ESTIMATED EFFORT: ~20.6 story points                                 │
│  TOTAL DURATION: ~9 weeks                                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Dependency Order

```
Critical Path (must be completed in order):
─────────────────────────────────────────────────
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 8

Non-Critical (can run in parallel after Phase 1):
─────────────────────────────────────────────────
Phase 1 → Phase 6
         Phase 7 (depends on Phase 6)

Full Dependency Graph:
───────────────────────────────

Phase 1 (Foundation)
    │
    ├── Phase 2 (Editor Core)
    │       │
    │       └── Phase 3 (Custom Extensions)
    │               │
    │               └── Phase 4 (Slash Commands)
    │                       │
    │                       └── Phase 5 (Auto-complete)
    │                               │
    └── Phase 6 (Threading)
            │
            └── Phase 7 (Reactions & State)
                    │
    ────────────────┴───────────────
                    │
                    └── Phase 8 (Integration & Polish)
```

### 7.3 Milestone Definitions

| Milestone | Phase | Criteria | Deliverable |
|-----------|-------|----------|-------------|
| M1: Foundation | Phase 1 | EventBus, StateStore, Storage working | Core infrastructure |
| M2: Editor | Phase 2 | Tiptap integration, basic formatting | Functional editor |
| M3: Extensions | Phase 3 | @, #, [[ working | Smart content |
| M4: Commands | Phase 4 | Command palette functional | Notion-style commands |
| M5: Auto-complete | Phase 5 | All suggestion types working | Smart suggestions |
| M6: Threads | Phase 6 | Full threading UI | Comment conversations |
| M7: State | Phase 7 | Undo/redo, auto-save, reactions | Complete state mgmt |
| M8: Feature Complete | Phase 8 | All tests passing, docs complete | v1.2.0 release |

---

## 8. Appendix

### 8.1 Glossary of Terms

| Term | Definition |
|------|------------|
| **Anchor** | Metadata linking a comment to a specific task |
| **Block** | A top-level content element (paragraph, heading, list, etc.) |
| **Command Palette** | Dropdown menu showing available slash commands |
| **Comment** | An individual message within a thread |
| **Content** | The rich text stored in Tiptap JSON format |
| **Custom Node** | A Tiptap extension that defines new content types |
| **Debounce** | Delay before executing a function to batch operations |
| **Event Bus** | Central publish/subscribe system for component communication |
| **Extension** | A Tiptap plugin that adds functionality |
| **Hard Break** | A forced line break within text (Shift+Enter) |
| **Headless Editor** | Editor with no default UI, full control over rendering |
| **Mark** | Inline formatting (bold, italic, link, etc.) |
| **Mention** | @username reference to a user |
| **Node** | Any content element in Tiptap document model |
| **ProseMirror** | Underlying editor framework for Tiptap |
| **Reaction** | Emoji-based quick response to a comment |
| **Rich Content** | Formatted content stored as Tiptap JSON |
| **Selection** | Current cursor position and highlighted text |
| **Slash Command** | Command triggered by typing `/` |
| **Soft Wrap** | Automatic line wrapping at container boundary |
| **System Message** | Auto-generated message (thread resolved, etc.) |
| **Tag** | #tag classification label |
| **Task Link** | [[TASK-ID]] reference to another task |
| **Thread** | Container for related comments on a task |
| **Tiptap** | Headless rich text editor library |
| **Undo/Redo** | State history navigation |
| **Undo Entry** | Single state snapshot in undo history |

### 8.2 References

| Category | Reference | URL |
|----------|-----------|-----|
| **Core Library** | Tiptap Documentation | https://tiptap.dev/ |
| **Editor Framework** | ProseMirror Documentation | https://prosemirror.net/ |
| **File API** | File System Access API | https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API |
| **Inspiration** | Notion Slash Commands | https://www.notion.so/help/slash-commands |
| **Emoji Data** | Unicode Emoji Standards | https://unicode.org/emoji/ |
| **TypeScript** | TypeScript Handbook | https://www.typescriptlang.org/docs/ |
| **Architecture** | Event Sourcing Pattern | https://martinfowler.com/eaaDev/EventSourcing.html |
| **State Management** | Undo/Redo Patterns | https://www.patterns.dev/posts/undo-redo-pattern/ |

### 8.3 Related Documentation

| Document | Purpose | Location |
|----------|---------|----------|
| **Domain Analysis v1.2.0** | Core concepts, business rules, data flows | `docs/architecture/DOMAIN_ANALYSIS_v1.2.0_COMMENTS.md` |
| **Core Concepts** | Detailed concept definitions | `docs/architecture/core-concepts.md` |
| **Data Models** | TypeScript schemas and validation | `docs/architecture/data-models.md` |
| **Command Registry** | Slash command specifications | `docs/architecture/command-registry.md` |
| **Comment Workflows** | Procedural implementations | `docs/architecture/comment-workflows.md` |
| **Editor Standards** | Performance, accessibility, security | `docs/architecture/editor-standards.md` |
| **CHANGELOG** | Version history | `CHANGELOG.md` |
| **README** | Project overview and quick start | `README.md` |
| **Task Manager** | Kanban project management | `internal/Project 1.2.0/kanban.md` |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-22 | Architecture Team | Initial draft |

---

*This architecture specification provides the technical foundation for implementing the Markdown Task Manager 1.2.0 enhanced notes/comments system. All implementation decisions should align with the patterns and principles documented here.*

**Document Owner**: Architecture Team  
**Review Status**: Pending  
**Next Review**: Before Phase 1 completion
