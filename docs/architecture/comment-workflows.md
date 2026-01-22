# Comment System Workflows & Procedures

## 1. Thread Lifecycle Procedures

### 1.1 Creating a New Thread

```javascript
async function createThread(taskId: string, initialContent: EditorState): Promise<Thread> {
  // 1. Generate thread ID
  const threadId = `thread-${Date.now()}-${generateRandomId(6)}`;
  
  // 2. Create initial comment
  const comment = {
    id: `comment-${Date.now()}-${generateRandomId(6)}`,
    threadId,
    author: currentUser,
    content: initialContent,
    timestamp: new Date().toISOString(),
    reactions: {},
    replies: []
  };
  
  // 3. Create thread object
  const thread = {
    id: threadId,
    taskId,
    status: 'active',
    pinned: false,
    created: comment.timestamp,
    updated: comment.timestamp,
    commentCount: 1,
    comments: [comment]
  };
  
  // 4. Add to task's comment section in kanban.md
  await appendThreadToKanban(taskId, thread);
  
  // 5. Update UI
  renderThread(thread);
  
  return thread;
}
```

**Error Cases:**
- File system not available → Fallback to localStorage
- Permission denied → Show error notification
- Invalid taskId → Throw validation error

### 1.2 Adding a Comment to Thread

```javascript
async function addComment(threadId: string, content: EditorState): Promise<Comment> {
  // 1. Find thread
  const thread = await getThread(threadId);
  if (!thread) throw new Error('Thread not found');
  
  // 2. Check thread status
  if (thread.status === 'resolved') {
    throw new Error('Cannot add comment to resolved thread');
  }
  
  // 3. Create comment
  const comment = {
    id: `comment-${Date.now()}-${generateRandomId(6)}`,
    threadId,
    author: currentUser,
    content,
    timestamp: new Date().toISOString(),
    reactions: {},
    replies: []
  };
  
  // 4. Add to thread
  thread.comments.push(comment);
  thread.updated = comment.timestamp;
  thread.commentCount++;
  
  // 5. Save changes
  await saveThread(thread);
  
  // 6. Update UI
  renderComment(comment, thread);
  
  return comment;
}
```

### 1.3 Replying to a Comment

```javascript
async function replyToComment(
  parentCommentId: string, 
  content: EditorState
): Promise<Comment> {
  // 1. Find parent comment
  const parentComment = await getComment(parentCommentId);
  if (!parentComment) throw new Error('Parent comment not found');
  
  // 2. Check nesting depth
  if (getNestingDepth(parentComment) >= 5) {
    throw new Error('Maximum nesting depth exceeded');
  }
  
  // 3. Create reply
  const reply = {
    id: `comment-${Date.now()}-${generateRandomId(6)}`,
    threadId: parentComment.threadId,
    author: currentUser,
    content,
    timestamp: new Date().toISOString(),
    reactions: {},
    parentId: parentCommentId
  };
  
  // 4. Add to parent's replies
  parentComment.replies.push(reply);
  
  // 5. Update thread timestamp
  await updateThreadTimestamp(parentComment.threadId);
  
  // 6. Save and render
  await saveCommentReply(parentComment, reply);
  
  return reply;
}
```

### 1.4 Resolving a Thread

```javascript
async function resolveThread(threadId: string): Promise<void> {
  const thread = await getThread(threadId);
  if (!thread) throw new Error('Thread not found');
  
  // 1. Update thread status
  thread.status = 'resolved';
  thread.updated = new Date().toISOString();
  
  // 2. Add system message
  const systemMessage = {
    id: `system-${Date.now()}`,
    type: 'system',
    content: {
      type: 'resolved',
      user: currentUser,
      timestamp: thread.updated
    }
  };
  thread.comments.push(systemMessage);
  
  // 3. Save changes
  await saveThread(thread);
  
  // 4. Update UI
  renderThreadStatus(thread);
  showNotification('Thread resolved');
}
```

### 1.5 Pinning a Thread

```javascript
async function pinThread(threadId: string): Promise<void> {
  const thread = await getThread(threadId);
  if (!thread) throw new Error('Thread not found');
  
  // 1. Toggle pin status
  thread.pinned = !thread.pinned;
  thread.updated = new Date().toISOString();
  
  // 2. If pinning, unpin other threads
  if (thread.pinned) {
    await unpinAllThreads(thread.taskId);
  }
  
  // 3. Save and update UI
  await saveThread(thread);
  renderThreadPinStatus(thread);
}
```

## 2. Editor Workflows

### 2.1 Initializing the Editor

```javascript
function createEditor(container: HTMLElement, options?: EditorOptions): Editor {
  // 1. Check if Tiptap is loaded
  if (typeof window.Tiptap === 'undefined') {
    throw new Error('Tiptap library not loaded');
  }
  
  // 2. Create editor instance
  const editor = new Tiptap.Editor({
    element: container,
    extensions: [
      StarterKit,
      MentionExtension.configure({
        HTMLAttributes: { class: 'mention' }
      }),
      TagExtension,
      TaskLinkExtension,
      PlaceholderExtension.configure({
        placeholder: 'Write a comment...'
      })
    ],
    content: options?.initialContent || '',
    editable: options?.editable !== false,
    autofocus: options?.autofocus || false,
    onUpdate: handleContentChange,
    onSelectionUpdate: handleSelectionChange
  });
  
  // 3. Bind keyboard shortcuts
  bindKeyboardShortcuts(editor);
  
  // 4. Initialize command palette
  initCommandPalette(editor);
  
  return editor;
}
```

### 2.2 Handling Content Changes

```javascript
function handleContentChange({ editor }: { editor: Editor }): void {
  // 1. Check if content actually changed
  const content = editor.getJSON();
  if (isEqual(content, lastSavedContent)) return;
  
  // 2. Update local state
  updateLocalContent(content);
  
  // 3. Trigger debounced auto-save
  debouncedAutoSave(300);
  
  // 4. Update UI indicators
  updateUnsavedIndicator();
}
```

### 2.3 Slash Command Execution

```javascript
async function executeSlashCommand(
  commandId: string, 
  editor: Editor
): Promise<void> {
  // 1. Get command from registry
  const command = commandRegistry.get(commandId);
  if (!command) throw new Error(`Command ${commandId} not found`);
  
  // 2. Check context is valid
  if (!command.enabledIn.includes(currentContext)) {
    throw new Error('Command not available in current context');
  }
  
  // 3. Execute command
  command.execute(editor);
  
  // 4. Close command palette
  commandPalette.hide();
  
  // 5. Push to undo stack
  editor.commands.undoable(() => {
    // Command execution is already done
  });
  
  // 6. Trigger save
  autoSave();
}
```

## 3. Auto-complete Workflows

### 3.1 @mention Auto-complete

```javascript
async function getMentionSuggestions(query: string): Promise<User[]> {
  // 1. Get all users from project
  const users = await projectData.getUsers();
  
  // 2. Filter by query (case-insensitive)
  if (!query) return users.slice(0, 10);
  
  return users.filter(user => 
    user.name.toLowerCase().includes(query.toLowerCase()) ||
    user.username.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 10);
}
```

### 3.2 #tag Auto-complete

```javascript
async function getTagSuggestions(query: string): Promise<string[]> {
  // 1. Get all tags from project
  const tags = await projectData.getTags();
  
  // 2. Filter by query
  if (!query) return tags.slice(0, 10);
  
  return tags.filter(tag => 
    tag.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 10);
}
```

### 3.3 [[task]] Auto-complete

```javascript
async function getTaskSuggestions(query: string): Promise<Task[]> {
  // 1. Get all tasks from current project
  const tasks = await projectData.getTasks();
  
  // 2. Filter by query
  if (!query) return tasks.slice(0, 10);
  
  return tasks.filter(task => 
    task.title.toLowerCase().includes(query.toLowerCase()) ||
    task.id.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 10);
}
```

## 4. State Management Workflows

### 4.1 Undo Operation

```javascript
function undo(): void {
  // 1. Check undo stack
  if (undoStack.length === 0) {
    showNotification('Nothing to undo');
    return;
  }
  
  // 2. Pop last entry
  const entry = undoStack.pop();
  
  // 3. Restore editor state
  if (entry.type === 'comment') {
    restoreCommentState(entry.beforeState);
  } else {
    editor.commands.setContent(entry.beforeState);
  }
  
  // 4. Push to redo stack
  redoStack.push(entry);
  
  // 5. Update UI
  updateUndoRedoButtons();
}
```

### 4.2 Redo Operation

```javascript
function redo(): void {
  // 1. Check redo stack
  if (redoStack.length === 0) {
    showNotification('Nothing to redo');
    return;
  }
  
  // 2. Pop last entry
  const entry = redoStack.pop();
  
  // 3. Restore editor state
  if (entry.type === 'comment') {
    restoreCommentState(entry.afterState);
  } else {
    editor.commands.setContent(entry.afterState);
  }
  
  // 4. Push to undo stack
  undoStack.push(entry);
  
  // 5. Update UI
  updateUndoRedoButtons();
}
```

### 4.3 Auto-save Process

```javascript
const debouncedAutoSave = debounce(async (): Promise<void> => {
  try {
    // 1. Serialize editor content
    const content = editor.getJSON();
    
    // 2. Check for changes
    if (isEqual(content, lastSavedContent)) return;
    
    // 3. Write to file system
    await saveToFileSystem(content);
    
    // 4. Update last saved state
    lastSavedContent = content;
    
    // 5. Update UI
    hideUnsavedIndicator();
    showSaveIndicator('Saved');
    
  } catch (error) {
    console.error('Auto-save failed:', error);
    showNotification('Failed to save', 'error');
    
    // 6. Retry logic
    await retrySave(3);
  }
}, 300);
```

## 5. Reaction Workflows

### 5.1 Adding a Reaction

```javascript
async function addReaction(commentId: string, emoji: string): Promise<void> {
  const comment = await getComment(commentId);
  if (!comment) throw new Error('Comment not found');
  
  // 1. Check if user already reacted
  const userHasReacted = comment.reactions[emoji]?.users?.includes(currentUser);
  
  if (userHasReacted) {
    // Already reacted, remove instead
    await removeReaction(commentId, emoji);
    return;
  }
  
  // 2. Add reaction
  if (!comment.reactions[emoji]) {
    comment.reactions[emoji] = { count: 0, users: [] };
  }
  
  comment.reactions[emoji].count++;
  comment.reactions[emoji].users.push(currentUser);
  
  // 3. Save and update UI
  await saveComment(comment);
  updateReactionDisplay(commentId);
}
```

### 5.2 Removing a Reaction

```javascript
async function removeReaction(commentId: string, emoji: string): Promise<void> {
  const comment = await getComment(commentId);
  if (!comment) throw new Error('Comment not found');
  
  // 1. Check if user has reacted
  if (!comment.reactions[emoji]?.users?.includes(currentUser)) {
    return; // Nothing to remove
  }
  
  // 2. Remove reaction
  comment.reactions[emoji].count--;
  comment.reactions[emoji].users = comment.reactions[emoji].users.filter(
    user => user !== currentUser
  );
  
  // 3. Clean up empty reaction
  if (comment.reactions[emoji].count === 0) {
    delete comment.reactions[emoji];
  }
  
  // 4. Save and update UI
  await saveComment(comment);
  updateReactionDisplay(commentId);
}
```

## 6. File System Integration Workflows

### 6. from kan1 Reading Commentsban.md

```javascript
async function loadComments(taskId: string): Promise<Thread[]> {
  // 1. Read kanban.md file
  const content = await fileSystem.readFile('kanban.md');
  
  // 2. Parse Markdown
  const parsed = parseMarkdown(content);
  
  // 3. Extract comment section
  const commentSection = parsed.comments[taskId];
  if (!commentSection) return [];
  
  // 4. Parse Tiptap JSON in comments
  return commentSection.threads.map(thread => ({
    ...thread,
    comments: thread.comments.map(comment => ({
      ...comment,
      content: typeof comment.content === 'string' 
        ? parseMarkdownToTiptap(comment.content)
        : comment.content
    }))
  }));
}
```

### 6.2 Writing Comments to kanban.md

```javascript
async function saveComments(taskId: string, threads: Thread[]): Promise<void> {
  // 1. Read current file
  const content = await fileSystem.readFile('kanban.md');
  
  // 2. Parse Markdown
  const parsed = parseMarkdown(content);
  
  // 3. Update comment section
  parsed.comments[taskId] = {
    threads: threads.map(thread => ({
      ...thread,
      comments: thread.comments.map(comment => ({
        ...comment,
        content: typeof comment.content === 'object'
          ? serializeTiptapToMarkdown(comment.content)
          : comment.content
      }))
    }))
  };
  
  // 4. Reconstruct Markdown
  const updated = reconstructMarkdown(parsed);
  
  // 5. Write to file
  await fileSystem.writeFile('kanban.md', updated);
}
```
