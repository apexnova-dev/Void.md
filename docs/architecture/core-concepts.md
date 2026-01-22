# Core Domain Concepts - Enhanced Comments System

## 1. Comment Thread Concepts

### 1.1 Thread Entity
A **Thread** is the top-level container for a conversation on a task.

**Properties:**
- `id`: Unique identifier (format: `thread-{timestamp}-{random}`)
- `taskId`: Reference to parent task
- `status`: `active` | `resolved` | `hidden`
- `pinned`: boolean
- `created`: ISO8601 timestamp
- `updated`: ISO8601 timestamp
- `commentCount`: number
- `comments`: Array of Comment entities

**Lifecycle:**
1. Created when first comment added to task
2. Status changes: `active` → `resolved` → `active`
3. Deleted when all comments removed

### 1.2 Comment Entity
A **Comment** is an individual message within a thread.

**Properties:**
- `id`: Unique identifier (format: `comment-{timestamp}-{random}`)
- `threadId`: Reference to parent thread
- `author`: Username (e.g., `@alice`)
- `content`: Tiptap JSON or Markdown string
- `timestamp`: ISO8601 timestamp
- `edited`: boolean
- `editedAt`: ISO8601 timestamp (nullable)
- `reactions`: Object mapping emoji to count
- `replies`: Array of Comment entities (nested replies)

**Constraints:**
- Maximum 10,000 characters per comment
- Maximum 5 levels of nested replies
- Reactions must be idempotent per user

### 1.3 Reaction Entity
A **Reaction** is an emoji-based quick response to a comment.

**Supported Reactions:**
- `👍` (thumbs up)
- `👎` (thumbs down)
- `🎉` (celebration)
- `❤️` (heart)
- `🤔` (thinking)
- `👀` (eyes)
- `🚀` (rocket)
- `👎` (downvote)

**Rules:**
- Each user can react once per emoji per comment
- Removing reaction decrements count
- Maximum 20 unique reaction types per comment

## 2. Editor Concepts

### 2.1 Editor Instance
The **Editor** is the Tiptap editor instance managing rich text editing.

**State:**
- `content`: Current editor content (Tiptap JSON)
- `selection`: Current cursor/selection position
- `empty`: Boolean indicating if editor is empty
- `focused`: Boolean indicating if editor has focus

**Configuration:**
- `extensions`: Array of Tiptap extensions
- `editable`: Boolean for read-only mode
- `autofocus`: Boolean for auto-focus on init

### 2.2 Custom Node Extensions

#### MentionNode
Handles @user references.

**Attributes:**
- `id`: User identifier
- `label`: Display name

**Trigger:** `@` character
**Pattern:** `@[\w-]+`

#### TagNode
Handles #tag references.

**Attributes:**
- `tag`: Tag string without #

**Trigger:** `#` character
**Pattern:** `#[a-zA-Z][\w-]*`

#### TaskLinkNode
Handles [[task]] references.

**Attributes:**
- `taskId`: Referenced task ID
- `taskTitle`: Display title

**Trigger:** `[[` characters
**Pattern:** `\[\[([A-Z]+-\d+)\]\]`

### 2.3 Slash Commands
Quick formatting commands triggered by `/`.

**Structure:**
```javascript
{
  id: 'command-id',
  name: 'Command Name',
  description: 'What it does',
  icon: 'emoji',
  category: 'formatting' | 'layout' | 'media' | 'task' | 'advanced' | 'system',
  execute: (editor) => void,
  filter: (query, context) => boolean,
  enabledIn: ['task', 'comment', 'description'] // context types
}
```

## 3. Command System Concepts

### 3.1 Command Registry
Central registry managing all available slash commands.

**Methods:**
- `register(command)`: Add new command
- `unregister(id)`: Remove command
- `getCommands(context)`: Get filtered commands
- `execute(id, editor)`: Run command

### 3.2 Command Execution Flow
1. User types `/`
2. CommandPaletteManager detects trigger
3. Filter commands by current context
4. Display filtered list
5. User selects command
6. Execute command handler
7. Insert content at cursor
8. Push to undo stack
9. Trigger auto-save

## 4. State Management Concepts

### 4.1 State Layers

#### UI State (Ephemeral)
- Editor focus state
- Selection ranges
- Command palette visibility
- Modal states
- Undo/redo pointer position

#### Local State (Session-Scoped)
- Draft comments
- Unsaved editor content
- Undo/redo history stack
- Auto-complete cache
- Collapsed thread states

#### Persistent State (File-Backed)
- Saved comments
- Thread metadata
- Reaction counts
- Timestamps

### 4.2 Undo/Redo Stack

**UndoEntry Structure:**
```javascript
{
  type: 'comment' | 'edit' | 'format' | 'command',
  timestamp: ISO8601,
  beforeState: JSON, // Tiptap editor state
  afterState: JSON,  // Tiptap editor state
  description: string,
  groupId: string    // For grouped operations
}
```

**Grouping Rules:**
- Same-type operations within 500ms: grouped
- Multi-step commands: single undo entry
- Manual grouping available for complex operations

### 4.3 Auto-save System

**Flow:**
1. Editor content changes
2. Debounce timer starts (300ms)
3. If no further changes, serialize content
4. Write to File System Access API
5. Confirm save with visual indicator

**Error Handling:**
- Show notification on save failure
- Retry up to 3 times
- Fallback to localStorage on API failure

## 5. Integration Concepts

### 5.1 Task Integration
Comments are anchored to tasks via `taskId` in thread metadata.

**UI Integration:**
- Comment panel in task modal
- Comment count badge on task card
- "Add Comment" button in task detail view

### 5.2 File System Integration
Comments stored in kanban.md file.

**Section Structure:**
```
**Comments**:
<!-- COMMENT_THREAD_START -->
- **thread-id**: thread-...
  **status**: active
  **pinned**: false
  **created**: ISO8601
  **updated**: ISO8601
  
  - **comment-id**: comment-...
    **author**: @username
    **timestamp**: ISO8601
    **content**: {Tiptap JSON}
    **reactions**: {}
<!-- COMMENT_THREAD_END -->
```

### 5.3 Theme Integration
All new components must support dark mode via CSS variables.

**Required CSS Variables:**
- `--comment-bg`: Comment background color
- `--comment-border`: Comment border color
- `--comment-text`: Comment text color
- `--editor-bg`: Editor background color
- `--editor-border`: Editor border color
- `--toolbar-bg`: Toolbar background color
- `--toolbar-icon`: Toolbar icon color

## 6. Performance Concepts

### 6.1 Virtual Scrolling
For threads with many comments, implement virtual scrolling.

**Thresholds:**
- 20+ comments: Enable virtual scrolling
- 50+ comments: Lazy load nested replies
- 100+ comments: Paginate thread

### 6.2 Debouncing
Optimize performance with debounced operations.

| Operation | Debounce Time |
|-----------|---------------|
| Auto-save | 300ms |
| Auto-complete filter | 100ms |
| Search filter | 200ms |
| UI updates | 16ms (next frame) |

### 6.3 Memory Management
Prevent memory leaks in long sessions.

**Strategies:**
- Compress undo history (max 50 entries)
- Clean up auto-complete cache (max 100 items)
- Dispose editor instances on modal close
- Revoke object URLs after file operations
