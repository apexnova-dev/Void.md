# Editor Standards & Quality Criteria

## 1. Performance Standards

### 1.1 Initialization Performance
| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Editor creation time | < 300ms | Time from createEditor() to ready |
| Tiptap library load | < 500ms | Time from script load to ready |
| First content render | < 200ms | Time to display initial content |
| Command palette open | < 50ms | Time from '/' to visible menu |

### 1.2 Runtime Performance
| Metric | Target | Trigger |
|--------|--------|---------|
| Typing latency | < 50ms | Key press to character display |
| Auto-save trigger | < 300ms | Last edit to save initiation |
| Undo/Redo response | < 100ms | Command execution |
| Auto-complete filter | < 100ms | Query input to results |
| Thread rendering | < 100ms per comment | Comment added/updated |

### 1.3 Memory Standards
| Resource | Limit | Management |
|----------|-------|------------|
| Undo stack entries | 50 | FIFO eviction |
| Auto-complete cache | 100 items | LRU eviction |
| Editor instances | 1 per modal | Dispose on close |
| Event listeners | Clean up | Remove on destroy |

## 2. Formatting Standards

### 2.1 Markdown Compatibility
All editor content must serialize to valid Markdown:

**Required Conversions:**
- Bold: `**text**` or `<strong>text</strong>`
- Italic: `*text*` or `<em>text</em>`
- Code blocks: ````language\ncode\n````
- Blockquotes: `> text`
- Lists: `- item` or `1. item`
- Links: `[text](url)`
- Images: `![alt](url)`

**Edge Cases:**
- Nested formatting: `***bold and italic***`
- Code in lists: Proper indentation
- Links in code: No conversion inside code blocks

### 2.2 HTML Output Standards
When HTML output is required:

```html
<!-- Comment structure -->
<article class="comment" data-comment-id="comment-...">
  <header class="comment-header">
    <span class="comment-author">@username</span>
    <time class="comment-time">2026-01-22 10:30</time>
  </header>
  <div class="comment-content">
    <!-- Rich text content -->
  </div>
  <footer class="comment-footer">
    <!-- Reactions, actions -->
  </footer>
</article>
```

### 2.3 Tiptap JSON Schema
Editor state serialization format:

```typescript
interface TiptapContent {
  type: 'doc';
  content: Array<{
    type: string;  // 'paragraph', 'heading', 'codeBlock', etc.
    attrs?: Record<string, unknown>;
    content?: TiptapContent[];
    marks?: Array<{
      type: string;  // 'bold', 'italic', etc.
      attrs?: Record<string, unknown>;
    }>;
  }>;
}
```

## 3. Accessibility Standards

### 3.1 Keyboard Navigation
All editor features must be keyboard accessible:

| Feature | Required Keys |
|---------|--------------|
| Navigate editor | Arrow keys, Tab |
| Bold text | Ctrl/Cmd + B |
| Italic text | Ctrl/Cmd + I |
| Open command palette | / |
| Undo | Ctrl/Cmd + Z |
| Redo | Ctrl/Cmd + Shift + Z |
| Save | Ctrl/Cmd + S |
| Escape | Close modals/menus |

### 3.2 ARIA Attributes
Editor components must include ARIA attributes:

```html
<!-- Command palette -->
<div role="listbox" aria-label="Slash commands" aria-expanded="true">
  <div role="option" aria-selected="true" id="cmd-bold">Bold</div>
</div>

<!-- Editor toolbar -->
<div role="toolbar" aria-label="Formatting options">
  <button role="button" aria-pressed="false" aria-label="Bold">B</button>
</div>

<!-- Comment -->
<article role="comment" aria-label="Comment by @user" tabindex="0">
  ...
</article>
```

### 3.3 Screen Reader Support
- Announce formatting changes
- Read auto-complete suggestions
- Provide comment thread navigation
- Announce save status changes

## 4. Internationalization Standards

### 4.1 Text Direction
Support for RTL languages:

```css
/* RTL support */
[dir="rtl"] .editor {
  direction: rtl;
  text-align: right;
}

[dir="rtl"] .command-palette {
  right: auto;
  left: 0;
}
```

### 4.2 Character Handling
- Normalize Unicode (NFC form)
- Support combining characters
- Handle emoji correctly
- Preserve special characters

### 4.3 Localization Keys
All UI text must use translation system:

```javascript
// Translation keys pattern
'editor.bold': 'Bold',
'editor.italic': 'Italic',
'editor.heading1': 'Heading 1',
'editor.command.placeholder': 'Type / for commands',
'editor.comment.placeholder': 'Write a comment...',
'editor.saved': 'Saved',
'editor.saving': 'Saving...',
'editor.saveFailed': 'Failed to save'
```

## 5. Security Standards

### 5.1 Input Sanitization
All user input must be sanitized:

```javascript
// XSS prevention
function sanitizeContent(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'u', 's', 'em', 'strong', 'code', 'a'],
    ALLOWED_ATTR: ['href', 'title', 'class'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'object'],
    FORBID_ATTR: ['onerror', 'onclick', 'onload']
  });
}
```

### 5.2 Content Security Policy
Editor must work within CSP constraints:

```http
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' filesystem:;
```

### 5.3 File Handling
Safe file operations:

```javascript
// Validate file access
async function safeWriteFile(path: string, content: string): Promise<void> {
  // Verify path is within project directory
  const projectRoot = await getProjectRoot();
  const fullPath = resolve(path);
  
  if (!fullPath.startsWith(projectRoot)) {
    throw new Error('Path outside project directory');
  }
  
  // Verify file exists or create new
  await fileSystem.writeFile(fullPath, content);
}
```

## 6. Quality Metrics

### 6.1 Code Quality
- JSHint/ESLint passing with no warnings
- Maximum function complexity: 10
- Maximum file length: 500 lines
- 80% test coverage for editor module

### 6.2 User Experience Metrics
| Metric | Target |
|--------|--------|
| Task completion time | < 30s to add formatted comment |
| Error rate | < 1% of save operations |
| User satisfaction | > 4/5 on usability surveys |

### 6.3 Test Coverage Requirements
| Module | Coverage Target |
|--------|----------------|
| Editor core | 90% |
| Command registry | 85% |
| Auto-complete | 80% |
| State management | 85% |
| File integration | 90% |

## 7. Browser Compatibility

### 7.1 Supported Browsers
| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 86+ | Full support |
| Edge | 86+ | Full support |
| Firefox | 88+ | Partial (no File System API) |
| Safari | 15+ | Partial (no File System API) |
| Opera | 72+ | Full support |

### 7.2 Feature Detection
Use feature detection for browser capabilities:

```javascript
function detectEditorCapabilities() {
  return {
    fileSystemAccess: 'showOpenFilePicker' in window,
    clipboardAPI: 'clipboard' in navigator,
    contenteditable: 'contentEditable' in document.createElement('div'),
    proxy: typeof Proxy !== 'undefined',
    unicodeNormalization: typeof 'test'.normalize === 'function'
  };
}
```

### 7.3 Fallback Strategies
| Feature | Fallback |
|---------|----------|
| File System API | localStorage |
| Tiptap Editor | Plain textarea with Markdown |
| Auto-complete | Standard datalist |
| Dark mode | CSS media query only |

## 8. Error Handling Standards

### 8.1 Error Types
| Error Type | Handling | User Message |
|------------|----------|--------------|
| Save failure | Retry 3x, then alert | "Failed to save. Retrying..." |
| Parse error | Show raw text | "Content could not be parsed" |
| Invalid input | Reject with feedback | "Invalid content format" |
| Network offline | Queue changes | "Offline - changes saved locally" |

### 8.2 Error Boundaries
Wrap editor in error boundary:

```javascript
class EditorErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    logError(error, info);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback message="Editor failed to load" />;
    }
    return this.props.children;
  }
}
```

### 8.3 Recovery Procedures
| Scenario | Recovery Action |
|----------|----------------|
| Editor crash | Reload from last saved state |
| Auto-save failure | LocalStorage fallback, retry |
| Undo stack overflow | Merge oldest entries |
| Memory warning | Clear caches, disable features |
