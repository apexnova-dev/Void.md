# Slash Command Registry

## Overview

This document defines the slash commands available in the Void.md 1.2.0 enhanced comments system. Commands are organized by category and include implementation details.

## Command Categories

### 1. Formatting Commands
*Commands for text formatting and styling*

| Command | Name | Description | Icon | Example Output |
|---------|------|-------------|------|----------------|
| `/bold` | Bold | Make text bold | **B** | `<strong>text</strong>` |
| `/italic` | Italic | Make text italic | *I* | `<em>text</em>` |
| `/underline` | Underline | Underline text | U⃒ | `<u>text</u>` |
| `/strike` | Strikethrough | Strike through text | S̷ | `<s>text</s>` |
| `/code` | Inline Code | Format as inline code | ` ` | `` `code` `` |
| `/codeblock` | Code Block | Create code block | ``` | ```\ncode\n``` |
| `/highlight` | Highlight | Highlight text background | 🖍 | `<mark>text</mark>` |
| `/subscript` | Subscript | Subscript text | X₂ | `<sub>text</sub>` |
| `/superscript` | Superscript | Superscript text | X² | `<sup>text</sup>` |

### 2. Heading Commands
*Commands for creating headings*

| Command | Name | Description | Icon | Example Output |
|---------|------|-------------|------|----------------|
| `/heading1` | Heading 1 | Large heading | H1 | `# Heading 1` |
| `/heading2` | Heading 2 | Medium heading | H2 | `## Heading 2` |
| `/heading3` | Heading 3 | Small heading | H3 | `### Heading 3` |
| `/heading4` | Heading 4 | Subheading | H4 | `#### Heading 4` |
| `/heading5` | Heading 5 | Sub-subheading | H5 | `##### Heading 5` |
| `/heading6` | Heading 6 | Tiny heading | H6 | `###### Heading 6` |

### 3. List Commands
*Commands for creating lists*

| Command | Name | Description | Icon | Example Output |
|---------|------|-------------|------|----------------|
| `/bulletlist` | Bullet List | Create bullet list | • | `- Item 1` |
| `/numberedlist` | Numbered List | Create numbered list | 1. | `1. Item 1` |
| `/checkbox` | Checklist Item | Create checkbox item | ☑ | `- [ ] Item` |
| `/todolist` | Todo List | Create todo list | ☑ | Multiple `- [ ]` items |
| `/toggle` | Toggle List | Collapsible toggle | ▸ | `<details>` toggle |

### 4. Block Elements
*Commands for block-level elements*

| Command | Name | Description | Icon | Example Output |
|---------|------|-------------|------|----------------|
| `/blockquote` | Block Quote | Create quote block | ❝ | `> Quote text` |
| `/callout` | Callout | Notion-style callout | 💡 | Custom callout block |
| `/divider` | Divider | Horizontal rule | ― | `---` |
| `/table` | Table | Insert table | ⊞ | Markdown table |
| `/columns` | Columns | Multi-column layout | ⊟ | Multi-column div |
| `/code` | Code File | Reference code file | 📄 | Code file link |

### 5. Media Commands
*Commands for media insertion*

| Command | Name | Description | Icon | Example Output |
|---------|------|-------------|------|----------------|
| `/image` | Image | Insert image from URL | 🖼 | `![alt](url)` |
| `/file` | File Link | Link to local file | 📎 | `[filename](url)` |
| `/link` | Link | Insert hyperlink | 🔗 | `[text](url)` |
| `/emoji` | Emoji | Quick emoji picker | 😀 | Insert emoji |
| `/video` | Video Embed | Embed video | 🎬 | Video embed |
| `/audio` | Audio Embed | Embed audio | 🎵 | Audio embed |

### 6. Task Commands
*Commands related to task management*

| Command | Name | Description | Icon | Example Output |
|---------|------|-------------|------|----------------|
| `/subtask` | Subtask | Create subtask item | ✓ | `- [ ] Subtask` |
| `/reminder` | Reminder | Set reminder | ⏰ | Reminder metadata |
| `/duedate` | Due Date | Set due date | 📅 | Due date metadata |
| `/assign` | Assign | Assign to user | 👤 | `@username` |
| `/priority` | Set Priority | Set task priority | 🚩 | Priority badge |
| `/tag` | Add Tag | Add tag to content | # | `#tag` |
| `/tasklink` | Task Link | Link to another task | 🔗 | `[[TASK-ID]]` |
| `/status` | Change Status | Update task status | 📋 | Status badge |

### 7. Comment Commands
*Commands for comment functionality*

| Command | Name | Description | Icon | Example Output |
|---------|------|-------------|------|----------------|
| `/comment` | Add Comment | Insert comment marker | 💬 | `<!-- comment -->` |
| `/mention` | Mention User | @mention a user | @ | `@username` |
| `/resolve` | Resolve | Mark as resolved | ✓ | Resolved badge |
| `/hide` | Hide Content | Hide from view | 👁 | Collapsed section |

### 8. Advanced Commands
*Advanced formatting and features*

| Command | Name | Description | Icon | Example Output |
|---------|------|-------------|------|----------------|
| `/template` | Insert Template | Use content template | 📋 | Template content |
| `/snippet` | Code Snippet | Common code patterns | {} | Code pattern |
| `/date` | Insert Date | Insert current date | 📆 | `YYYY-MM-DD` |
| `/time` | Insert Time | Insert current time | 🕐 | `HH:mm` |
| `/datetime` | Insert DateTime | Insert full timestamp | 📅 | ISO8601 |
| `/math` | Math Formula | Insert math equation | ∑ | MathML/formula |
| `/anchor` | Anchor Link | Create anchor link | ⚓ | Anchor reference |

### 9. System Commands
*Utility and system commands*

| Command | Name | Description | Icon | Example Output |
|---------|------|-------------|------|----------------|
| `/undo` | Undo | Undo last action | ↩ | Trigger undo |
| `/redo` | Redo | Redo action | ↪ | Trigger redo |
| `/copy` | Copy | Copy selected content | 📋 | Copy to clipboard |
| `/cut` | Cut | Cut selected content | ✂️ | Cut to clipboard |
| `/paste` | Paste | Paste from clipboard | 📄 | Paste content |
| `/help` | Help | Show command help | ❓ | Help modal |
| `/shortcuts` | Shortcuts | Show keyboard shortcuts | ⌨ | Shortcuts list |
| `/clear` | Clear | Clear editor content | 🗑 | Empty editor |

## Command Implementation Structure

```javascript
// Example command definition
const commandDefinition = {
  id: 'bold',
  name: 'Bold',
  description: 'Make text bold',
  icon: '**',
  category: 'formatting',
  keywords: ['strong', 'b', 'format'],
  examples: ['**text**'],
  execute: (editor) => {
    const { from, to } = editor.state.selection;
    if (from === to) {
      // No selection, insert formatting and place cursor inside
      editor.commands.insertContent('**<span class="placeholder">text</span>**');
    } else {
      // Apply to selection
      editor.commands.toggleBold();
    }
  },
  filter: (query, context) => {
    return true; // Always show in formatting commands
  },
  enabledIn: ['task', 'comment', 'description', 'notes'],
  shortcut: 'Mod+B'
};
```

## Command Registry API

```javascript
class CommandRegistry {
  // Register a new command
  register(command: CommandDefinition): void;
  
  // Unregister a command
  unregister(commandId: string): void;
  
  // Get command by ID
  get(commandId: string): CommandDefinition | undefined;
  
  // Get all commands in a category
  getByCategory(category: string): CommandDefinition[];
  
  // Get commands filtered by context
  getForContext(context: string): CommandDefinition[];
  
  // Search commands
  search(query: string): CommandDefinition[];
  
  // Execute a command
  execute(commandId: string, editor: Editor): void;
}
```

## Default Command Set

### Formatting (9 commands)
- `/bold`, `/italic`, `/underline`, `/strike`, `/code`, `/codeblock`, `/highlight`, `/subscript`, `/superscript`

### Headings (6 commands)
- `/heading1` through `/heading6`

### Lists (5 commands)
- `/bulletlist`, `/numberedlist`, `/checkbox`, `/todolist`, `/toggle`

### Blocks (6 commands)
- `/blockquote`, `/callout`, `/divider`, `/table`, `/columns`, `/code`

### Media (6 commands)
- `/image`, `/file`, `/link`, `/emoji`, `/video`, `/audio`

### Tasks (8 commands)
- `/subtask`, `/reminder`, `/duedate`, `/assign`, `/priority`, `/tag`, `/tasklink`, `/status`

### Comments (4 commands)
- `/comment`, `/mention`, `/resolve`, `/hide`

### Advanced (8 commands)
- `/template`, `/snippet`, `/date`, `/time`, `/datetime`, `/math`, `/anchor`, `/copy`

### System (8 commands)
- `/undo`, `/redo`, `/copy`, `/cut`, `/paste`, `/help`, `/shortcuts`, `/clear`

**Total: 60 default commands**

## Command Icons

Commands use emoji icons for visual identification:

```javascript
const categoryIcons = {
  formatting: '✏️',
  headings: '📝',
  lists: '📋',
  blocks: '🧱',
  media: '🎨',
  tasks: '✅',
  comments: '💬',
  advanced: '🔧',
  system: '⚙️'
};
```

## Keyboard Shortcuts

Standard keyboard shortcuts for quick formatting:

| Action | Shortcut |
|--------|----------|
| Bold | `Ctrl/Cmd + B` |
| Italic | `Ctrl/Cmd + I` |
| Underline | `Ctrl/Cmd + U` |
| Strikethrough | `Ctrl/Cmd + Shift + X` |
| Code | `Ctrl/Cmd + E` |
| Link | `Ctrl/Cmd + K` |
| Undo | `Ctrl/Cmd + Z` |
| Redo | `Ctrl/Cmd + Shift + Z` |
