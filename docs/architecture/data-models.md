# Data Models & Schemas

**Status (April 2026):** This document describes data models for a planned comments system. The current implementation (v1.3.1) includes:
- **Implemented:** `RichContentStorage` for storing Tiptap HTML content per task (IndexedDB-based)
- **Planned:** Full threaded comments system with threads, comments, reactions, slash commands

## 1. Comment System Data Models

### 1.1 Thread Model

```typescript
interface Thread {
  // Identifiers
  id: string;              // Format: thread-{timestamp}-{random}
  taskId: string;          // Reference to parent task
  
  // Metadata
  status: ThreadStatus;    // 'active' | 'resolved' | 'hidden'
  pinned: boolean;         // Pinned threads appear first
  created: string;         // ISO8601 timestamp
  updated: string;         // ISO8601 timestamp
  
  // Content
  commentCount: number;    // Total comments including replies
  comments: Comment[];     // Array of comments (flat structure)
  
  // Optional
  resolvedBy?: string;     // Username who resolved
  resolvedAt?: string;     // ISO8601 timestamp
  hiddenBy?: string;       // Username who hid
}

type ThreadStatus = 'active' | 'resolved' | 'hidden';
```

### 1.2 Comment Model

```typescript
interface Comment {
  // Identifiers
  id: string;              // Format: comment-{timestamp}-{random}
  threadId: string;        // Reference to parent thread
  parentId?: string;       // Reference to parent comment (for replies)
  
  // Author info
  author: string;          // Username (e.g., '@alice')
  authorName?: string;     // Display name
  
  // Content
  content: Content;        // Rich text content
  contentType: 'tiptap-json' | 'markdown';
  
  // Timestamps
  timestamp: string;       // ISO8601 timestamp
  edited: boolean;         // Has been edited
  editedAt?: string;       // ISO8601 timestamp
  
  // Reactions
  reactions: Record<string, Reaction>;
  
  // Replies (for nested structure)
  replies?: Comment[];
  
  // System message indicator
  isSystem?: boolean;      // System-generated message
  systemType?: SystemMessageType;
}

type SystemMessageType = 'resolved' | 'reopened' | 'pinned' | 'hidden' | 'deleted';
```

### 1.3 Reaction Model

```typescript
interface Reaction {
  emoji: string;           // Emoji character
  count: number;           // Total reactions
  users: string[];         // Usernames who reacted
}

interface UserReaction {
  user: string;            // Username
  emoji: string;           // Reacted emoji
  timestamp: string;       // ISO8601 timestamp
}
```

### 1.4 Rich Text Content Model

```typescript
// Tiptap JSON format
interface Content {
  type: 'doc';
  content: Node[];
}

type Node = 
  | ParagraphNode
  | HeadingNode
  | CodeBlockNode
  | BlockquoteNode
  | BulletListNode
  | OrderedListNode
  | ListItemNode
  | TableNode
  | HorizontalRuleNode
  | CustomNode;

interface ParagraphNode {
  type: 'paragraph';
  content?: MarkedText[];
}

interface HeadingNode {
  type: 'heading';
  attrs: { level: 1 | 2 | 3 | 4 | 5 | 6 };
  content?: MarkedText[];
}

interface CodeBlockNode {
  type: 'codeBlock';
  attrs: { language?: string };
  content?: TextNode[];
}

interface MarkedText {
  type: 'text';
  text: string;
  marks?: Mark[];
}

interface TextNode {
  type: 'text';
  text: string;
}

interface Mark {
  type: 'bold' | 'italic' | 'underline' | 'strike' | 'code' | 'link' | 'mention' | 'tag';
  attrs?: Record<string, string>;
}
```

## 2. Editor Data Models

### 2.1 Editor Configuration

```typescript
interface EditorConfig {
  // Extensions
  extensions: Extension[];
  
  // Options
  editable: boolean;
  autofocus: boolean;
  placeholder?: string;
  
  // Features
  mentionEnabled: boolean;
  tagEnabled: boolean;
  taskLinkEnabled: boolean;
  
  // Callbacks
  onUpdate?: (content: Content) => void;
  onSelectionUpdate?: (selection: Selection) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

interface Extension {
  name: string;
  config?: Record<string, unknown>;
}
```

### 2.2 Selection Model

```typescript
interface Selection {
  from: number;            // Start position
  to: number;              // End position
  empty: boolean;          // Is cursor only (no selection)
}

interface CursorPosition {
  line: number;            // Line number
  column: number;          // Column number
  offset: number;          // Character offset
}
```

### 2.3 Command Palette Model

```typescript
interface CommandPaletteState {
  visible: boolean;
  query: string;
  selectedIndex: number;
  filteredCommands: Command[];
}

interface Command {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: CommandCategory;
  keywords: string[];
  shortcut?: string;
  execute: (editor: Editor) => void;
  filter: (query: string, context: EditorContext) => boolean;
  enabledIn: ContextType[];
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
```

### 2.4 Auto-complete Models

```typescript
interface AutoCompleteState {
  visible: boolean;
  trigger: AutoCompleteTrigger;
  query: string;
  selectedIndex: number;
  suggestions: Suggestion[];
}

type AutoCompleteTrigger = 
  | { type: 'mention'; char: '@' }
  | { type: 'tag'; char: '#' }
  | { type: 'tasklink'; chars: '[[' }
  | null;

interface Suggestion {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  type: SuggestionType;
  match?: string;          // Matched text for highlighting
}

type SuggestionType = 'user' | 'tag' | 'task' | 'command' | 'emoji';
```

## 3. State Management Models

### 3.1 Undo/Redo Models

```typescript
interface UndoStack {
  entries: UndoEntry[];
  position: number;
  maxSize: number;
}

interface UndoEntry {
  id: string;
  type: UndoEntryType;
  timestamp: string;
  description: string;
  groupId?: string;        // For grouping related operations
  
  // State snapshots
  beforeState: Content;
  afterState: Content;
  
  // Metadata
  author: string;
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
  threadId: string;
  commentId?: string;
}
```

### 3.2 Auto-save State

```typescript
interface AutoSaveState {
  status: AutoSaveStatus;
  lastSaved: string | null;
  pendingChanges: boolean;
  retryCount: number;
}

type AutoSaveStatus = 
  | 'idle'
  | 'saving'
  | 'success'
  | 'error'
  | 'offline';
```

### 3.3 Conflict Resolution State

```typescript
interface ConflictState {
  hasConflict: boolean;
  localVersion: number;
  remoteVersion: number;
  conflictType?: ConflictType;
  resolution?: ConflictResolution;
}

type ConflictType = 
  | 'concurrent_edit'
  | 'file_mismatch'
  | 'version_mismatch';

type ConflictResolution = 
  | { action: 'keep_local' }
  | { action: 'keep_remote' }
  | { action: 'merge'; strategy: MergeStrategy }
  | { action: 'ask_user' };

interface MergeStrategy {
  ours: Content[];
  theirs: Content[];
  conflicts: Content[];
}
```

## 4. File System Models

### 4.1 Kanban.md Comment Section

```markdown
**Comments**:
<!-- COMMENT_THREAD_START -->
- **thread-id**: thread-XXXXXXXXXXXX-XXXXXX
  **status**: active | resolved | hidden
  **pinned**: true | false
  **created**: 2026-01-22T10:30:00Z
  **updated**: 2026-01-22T11:45:00Z
  
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
                "text": "Comment text here"
              }
            ]
          }
        ]
      }
    **reactions**: { "👍": 3, "🎉": 1 }
    
    - **comment-id**: comment-XXXXXXXXXXXX-XXXXXX
      **author**: @username2
      ...
<!-- COMMENT_THREAD_END -->
```

### 4.2 Project Configuration

```typescript
interface ProjectConfig {
  // Editor settings
  editor: {
    defaultFont: string;
    defaultFontSize: number;
    lineHeight: number;
    autoSave: boolean;
    autoSaveDelay: number;
  };
  
  // Comment settings
  comments: {
    maxNestingDepth: number;
    maxCommentLength: number;
    maxThreadComments: number;
    showReactions: boolean;
    allowEditingResolved: boolean;
  };
  
  // Auto-complete settings
  autocomplete: {
    enableMentions: boolean;
    enableTags: boolean;
    enableTaskLinks: boolean;
    maxSuggestions: number;
  };
}
```

## 5. UI State Models

### 5.1 Comment Panel State

```typescript
interface CommentPanelState {
  visible: boolean;
  threadId: string | null;
  expandedCommentId: string | null;
  replyToCommentId: string | null;
  filter: CommentFilter;
  sort: CommentSort;
}

interface CommentFilter {
  author?: string;
  status?: ThreadStatus;
  hasMentions?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}

interface CommentSort {
  field: 'created' | 'updated' | 'author';
  direction: 'asc' | 'desc';
}
```

### 5.2 Editor Toolbar State

```typescript
interface ToolbarState {
  visible: boolean;
  position: ToolbarPosition;
  activeFormats: string[];
  disabledFormats: string[];
}

interface ToolbarPosition {
  top: number;
  left: number;
  pinned: boolean;
}
```

## 6. Event Models

### 6.1 Editor Events

```typescript
type EditorEventType = 
  | 'content-change'
  | 'selection-change'
  | 'focus'
  | 'blur'
  | 'destroy';

interface EditorEventMap {
  'content-change': ContentChangeEvent;
  'selection-change': SelectionChangeEvent;
  'focus': FocusEvent;
  'blur': BlurEvent;
  'destroy': DestroyEvent;
}

interface ContentChangeEvent {
  type: 'content-change';
  timestamp: string;
  content: Content;
  delta?: Delta;
}

interface SelectionChangeEvent {
  type: 'selection-change';
  timestamp: string;
  selection: Selection;
}

interface Delta {
  ops: DeltaOp[];
}

interface DeltaOp {
  retain?: number;
  delete?: number;
  insert?: string | object;
}
```

### 6.2 Comment Events

```typescript
type CommentEventType =
  | 'thread-created'
  | 'thread-resolved'
  | 'thread-reopened'
  | 'thread-pinned'
  | 'thread-hidden'
  | 'comment-added'
  | 'comment-edited'
  | 'comment-deleted'
  | 'reaction-added'
  | 'reaction-removed';

interface CommentEvent {
  type: CommentEventType;
  timestamp: string;
  threadId: string;
  commentId?: string;
  user: string;
  data?: Record<string, unknown>;
}
```

## 7. API Response Models

### 7.1 Generic Response

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ResponseMeta;
}

interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

interface ResponseMeta {
  timestamp: string;
  requestId: string;
  version: string;
}
```

### 7.2 File Operations

```typescript
interface FileWriteResult {
  success: boolean;
  path: string;
  bytesWritten: number;
  checksum: string;
  timestamp: string;
}

interface FileReadResult {
  success: boolean;
  content: string;
  bytesRead: number;
  checksum: string;
  version: string;
}
```

## 8. Validation Schemas

### 8.1 Comment Validation

```typescript
const commentSchema = {
  type: 'object',
  required: ['id', 'threadId', 'author', 'content', 'timestamp'],
  properties: {
    id: { type: 'string', pattern: '^comment-\\d{13}-[a-z0-9]{6}$' },
    threadId: { type: 'string' },
    parentId: { type: 'string', nullable: true },
    author: { type: 'string', pattern: '^@[\\w-]+$' },
    content: { type: 'object' },
    timestamp: { type: 'string', format: 'date-time' },
    edited: { type: 'boolean' },
    reactions: { type: 'object' }
  }
};
```

### 8.2 Thread Validation

```typescript
const threadSchema = {
  type: 'object',
  required: ['id', 'taskId', 'status', 'created', 'comments'],
  properties: {
    id: { type: 'string', pattern: '^thread-\\d{13}-[a-z0-9]{6}$' },
    taskId: { type: 'string' },
    status: { type: 'string', enum: ['active', 'resolved', 'hidden'] },
    pinned: { type: 'boolean' },
    created: { type: 'string', format: 'date-time' },
    updated: { type: 'string', format: 'date-time' },
    commentCount: { type: 'integer', minimum: 1 },
    comments: { type: 'array', items: { '$ref': '#/definitions/comment' } }
  }
};
```
