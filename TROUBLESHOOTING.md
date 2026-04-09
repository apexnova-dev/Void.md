# Void.md Troubleshooting Guide

> **Local-first Kanban over Markdown** — Your data stays on your machine. No cloud, no accounts.

This guide helps you diagnose and resolve common issues with Void.md. Most problems have simple solutions.

---

## Table of Contents

1. [Browser Compatibility](#1-browser-compatibility)
2. [File System Access API Errors](#2-file-system-access-api-errors)
3. [Directory Not Found / Permission Denied](#3-directory-not-found--permission-denied)
4. [Data Recovery](#4-data-recovery)
5. [Theme Issues](#5-theme-issues)
6. [Tiptap Editor Not Loading](#6-tiptap-editor-not-loading)
7. [Modal Problems](#7-modal-problems)
8. [Task Data Not Saving](#8-task-data-not-saving)
9. [Migration from Other Tools](#9-migration-from-other-tools)
10. [FAQ](#10-faq)

---

## 1. Browser Compatibility

### Problem: "Browser not supported" or application doesn't work

Void.md requires the **File System Access API**, which is only available in certain browsers.

### Supported Browsers

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 86+ | ✅ Fully supported |
| Edge | 86+ | ✅ Fully supported |
| Opera | 72+ | ✅ Fully supported |
| Brave | 1.17+ | ✅ Fully supported |
| Firefox | Any | ❌ Not supported |
| Safari | Any | ❌ Not supported |

### Symptoms

- Application doesn't respond when you select a folder
- No error message, but board remains empty
- Folder picker doesn't appear

### Solution

**Use Chrome, Edge, or Opera** — these browsers have full support for the File System Access API.

```bash
# On macOS
open -a "Google Chrome" /path/to/void.html

# On Linux
google-chrome /path/to/void.html

# On Windows
start chrome "C:\path\to\void.html"
```

### Why Firefox/Safari Don't Work

The File System Access API lets web apps read and write files directly on your disk. Mozilla and Apple have not implemented this API due to security concerns. Until they add support, Void.md cannot work in these browsers.

**Workaround**: Consider using Brave browser (Chromium-based, privacy-focused, free).

---

## 2. File System Access API Errors

### Problem: "Permission denied" or "API not available" errors

### Error Messages You Might See

- `DOMException: The request is not allowed`
- `DOMException: Permission denied`
- `TypeError: showDirectoryPicker is not a function`
- `File System Access API is not supported`

### Causes and Solutions

#### Cause 1: Using an unsupported browser

**Solution**: Switch to Chrome, Edge, or Opera (see [Browser Compatibility](#1-browser-compatibility))

#### Cause 2: Blocked by browser security settings

**Solution**: Make sure you're not in incognito/private mode restrictions, and check browser extensions aren't blocking the API.

```javascript
// Check if API is available (in browser console)
console.log('showDirectoryPicker' in window ? 'API Available' : 'API NOT Available')
```

#### Cause 3: Permission revoked by browser

The browser may revoke folder access after some time or if you cleared site data.

**Solution**:
1. Click the "Select Folder" button in Void.md
2. Re-select your project folder
3. The browser will ask for permission again

#### Cause 4: Running from file:// URL

Some browsers restrict the API when opening files directly.

**Solution**: Use a local server instead:

```bash
# Python 3
python -m http.server 8000

# Then open http://localhost:8000/void.html
```

---

## 3. Directory Not Found / Permission Denied

### Problem: "Directory not found" or "Cannot access folder"

### Symptoms

- Error message when opening the app
- Empty board even though `kanban.md` exists
- "Permission denied" when trying to save

### Solutions

#### Solution 1: Project was moved or deleted

If you moved the project folder or renamed it, the app can't find it.

**Fix**: Re-select the folder:
1. Click the **Folder** icon (📁) in the header
2. Navigate to your project folder
3. Select it

The app will update its stored path.

#### Solution 2: IndexedDB data is corrupted

The app stores project handles in IndexedDB. If this data becomes corrupted, it may point to invalid paths.

**Fix**: Clear IndexedDB for Void.md:
1. Open Chrome DevTools (F12)
2. Go to **Application** tab
3. Expand **IndexedDB** in the left sidebar
4. Right-click on `voidmd_projects` and select **Delete**
5. Refresh the page and re-select your folder

#### Solution 3: File permissions issue

Your user account may not have write permission to the folder.

**Fix** (macOS/Linux):
```bash
# Check permissions
ls -la /path/to/your/project/

# Fix permissions if needed
chmod -R u+rw /path/to/your/project/
```

#### Solution 4: File System Access API permission expired

Browsers may expire permissions after periods of inactivity.

**Fix**: Click the folder icon again to re-authenticate access.

---

## 4. Data Recovery

### Problem: Need to recover data from kanban.md or archive.md files

### Good News: Your Data Is Always Safe

Void.md doesn't modify the Markdown structure of your files. Even if the app crashes or won't load, your data is always readable in your text editor.

### Recovery Methods

#### Method 1: Open files directly in any text editor

Since `kanban.md` and `archive.md` are plain Markdown, they're always readable:

```bash
# Open in VS Code
code /path/to/project/kanban.md

# Open in Vim
vim /path/to/project/kanban.md

# Open in any editor (Windows)
notepad C:\path\to\project\kanban.md
```

#### Method 2: Check Git history

If your project is versioned with Git, you can recover previous versions:

```bash
# View recent commits affecting kanban.md
git log --oneline kanban.md

# View a specific previous version
git show HEAD~3:kanban.md > kanban-recovered.md

# Restore a specific version
git checkout abc1234 -- kanban.md
```

#### Method 3: Find backup files

Look for automatic backups:

```bash
# macOS Time Machine
# Right-click folder → "Enter Time Machine"

# Check for .swp/.bak files
find /path/to/project -name "*.bak" -o -name "*.swp"
```

#### Method 4: Extract from browser IndexedDB

If the app was working at some point, data might be in IndexedDB:

1. Open the app
2. Open DevTools (F12) → **Application** tab
3. Expand **IndexedDB** → **voidmd_projects**
4. Right-click → **Export**
5. Review the JSON for your task data

#### Method 5: Re-parse from backup

If you have an older backup of the folder, simply:
1. Copy the old `kanban.md` back to the project
2. Open Void.md and refresh
3. The board will rebuild from the Markdown

### Prevention Tips

- **Use Git**: Version control is your best safety net
- **Regular commits**: Commit kanban.md after significant changes
- **Create backups**: Periodically copy the project folder

---

## 5. Theme Issues

### Problem: Theme not applying / Flash of Unstyled Content (FOUC)

### Symptom 1: Theme flickers on page load

You see light theme briefly before dark theme loads.

### Causes and Solutions

#### Cause: Theme script loaded after page content

**Solution**: The app includes an inline script in `<head>` to prevent this. If you're seeing flicker:

1. Check your browser isn't caching an old version
2. Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (macOS)
3. Clear browser cache for the file

#### Cause: localStorage theme preference conflicts

**Solution**: Reset theme preference:
```javascript
// In browser console
localStorage.removeItem('theme')
localStorage.removeItem('colorTheme')
location.reload()
```

### Symptom 2: Theme doesn't change at all

### Solutions

#### Solution 1: Check Settings

1. Open **Settings** (gear icon)
2. Verify **Theme** is set to your preference (Dark/Light/System)
3. Try toggling it off and back on

#### Solution 2: Force theme via console

```javascript
// Force dark theme
document.body.setAttribute('data-theme', 'dark')
localStorage.setItem('theme', 'dark')

// Force light theme
document.body.setAttribute('data-theme', 'light')
localStorage.setItem('theme', 'light')
```

#### Solution 3: Debug theme script

```javascript
// Check current theme state
console.log('Theme:', localStorage.getItem('theme'))
console.log('Color Theme:', localStorage.getItem('colorTheme'))
console.log('Body data-theme:', document.body.getAttribute('data-theme'))
```

### Symptom 3: Colors look wrong in one theme

### Solution

Check for custom CSS that conflicts with theme variables:

1. Open DevTools → **Elements** tab
2. Inspect problematic element
3. Check computed styles for theme variables (e.g., `--bg-primary`, `--text-primary`)

---

## 6. Tiptap Editor Not Loading

### Problem: Rich text editor (Tiptap) doesn't load for task Notes

### Symptoms

- Task Notes field shows plain text only
- Rich text toolbar (Bold, Italic, etc.) doesn't appear
- Console shows "Tiptap loading failed" or similar

### Causes and Solutions

#### Cause 1: Feature flag is disabled

**Solution**: Enable Tiptap in Settings:
1. Open **Settings** → **Editor**
2. Toggle **Enable Rich Text Editor** to ON
3. Refresh or re-open a task

#### Cause 2: CDN blocked or slow

Tiptap loads from a CDN. If your network blocks CDN access, it falls back to plain text.

**Solution A**: Allow CDN access:
- Check your browser extensions (ad blockers, privacy tools)
- Temporarily disable them for void.html

**Solution B**: Use plain text mode (no network required):
- Tiptap will automatically fall back to plain textarea
- Your Notes will still work, just without rich formatting

#### Cause 3: JavaScript error in Tiptap

**Solution**: Check browser console:
1. Open DevTools (F12) → **Console** tab
2. Look for red error messages mentioning "Tiptap" or "ProseMirror"
3. Note the error and search in GitHub issues

#### Cause 4: Old browser cache

**Solution**: Clear cache:
```javascript
// In console
location.reload()
```

Then do a hard refresh (Ctrl+Shift+R / Cmd+Shift+R).

### What Happens When Tiptap Fails?

The app gracefully falls back to a plain `<textarea>`. Your task Notes will still save correctly — they just won't have rich formatting.

### Manual Test

```javascript
// Test Tiptap loading in console
fetch('https://unpkg.com/@tiptap/core@2.0.0/dist/tiptap-core.umd.js')
  .then(r => console.log('CDN accessible'))
  .catch(e => console.log('CDN blocked:', e))
```

---

## 7. Modal Problems

### Problem: Modal not opening or closing properly

### Symptoms

- Click "New Task" but nothing happens
- Click outside modal but it doesn't close
- Press Escape but modal stays open
- Modal opens but is empty or malformed

### Solutions

#### Problem: Modal doesn't open

**Check 1**: JavaScript errors in console
```javascript
// Open DevTools → Console
// Look for red errors
```

**Check 2**: Modal element exists in DOM
```javascript
document.getElementById('new-task-modal')
// If null, the modal HTML may be missing
```

**Check 3**: Click handler issue
The app uses event delegation. Try clicking the button again or refresh the page.

#### Problem: Modal doesn't close

**Solution**: Close via keyboard or backdrop click:
1. Press **Escape** key
2. Click outside the modal (on the dark backdrop)
3. If neither works, check console for JavaScript errors

#### Problem: Modal closes but page scrolls

**Solution**: The app should lock body scroll. Check via console:
```javascript
document.body.classList.contains('modal-open')
// Should be true when modal is open
```

If it's not working, try:
```javascript
document.body.style.overflow = 'hidden'
// To manually lock scroll
```

#### Problem: Modal content is empty or wrong

**Solution**: Clear IndexedDB and refresh:
1. DevTools → Application → IndexedDB
2. Delete `voidmd_projects`
3. Refresh the page

### Debugging Modal State

```javascript
// Check all modal states
console.log('New Task Modal:', !!document.getElementById('new-task-modal'))
console.log('Task Detail Modal:', !!document.getElementById('task-detail-modal'))
console.log('Settings Modal:', !!document.getElementById('settings-modal'))
console.log('Body has modal-open:', document.body.classList.contains('modal-open'))
```

---

## 8. Task Data Not Saving

### Problem: Changes to tasks don't persist

### Symptoms

- Create a task but it disappears after refresh
- Edit a task but changes don't save
- Drag a task to another column but it returns to original

### Solutions

#### Solution 1: File permission issue

The app can't write to the folder.

**Check**:
```bash
# Verify write permissions
ls -la /path/to/project/kanban.md
# Should show your user has write (w) permission
```

**Fix**: 
```bash
chmod u+w /path/to/project/kanban.md /path/to/project/archive.md
```

#### Solution 2: File System Access permission revoked

**Fix**: Re-select the folder:
1. Click folder icon (📁) in header
2. Re-authorize access to your project folder
3. Try saving again

#### Solution 3: Browser storage full

IndexedDB or localStorage may be full.

**Check** (in DevTools → Application):
- **IndexedDB**: Check storage usage
- **localStorage**: Check available space

**Fix**:
```javascript
// Clear old project data (keeps recent projects)
const req = indexedDB.deleteDatabase('voidmd_projects')
req.onsuccess = () => console.log('IndexedDB cleared')
```

#### Solution 4: JavaScript error preventing save

**Check** console for errors when saving:
1. Open DevTools → Console
2. Create/edit a task
3. Look for red error messages about "save" or "write"

#### Solution 5: File locked by another process

Another application may have the file open (e.g., another editor, sync tool).

**Fix**: Close other apps that might be using the file, then try again.

### Verify Save is Working

```javascript
// After making changes, check file was written
// In DevTools → Network, filter by the kanban.md file
// Or check the file modification time in your file system
```

The app auto-saves immediately on every change. You should see file updates in your file explorer.

---

## 9. Migration from Other Tools

### How to migrate from Trello, Jira, Linear, GitHub Issues, or Notion

### From Trello

1. **Export from Trello**:
   - Go to Trello → Board → Menu → Share → Export as JSON
   - Or use a third-party exporter

2. **Convert to Markdown**:
   Write a simple script or manually map:
   - Board = Column headers
   - Cards = Task items
   - Labels = Tags
   - Due dates = Due date field

3. **Import into Void.md**:
   ```markdown
   ### TASK-001 | Migration from Trello
   **Priority**: 🟡 Medium | **Created**: 2025-01-20
   **Tags**: #feature
   
   Original Trello card description here...
   
   **Notes**:
   Migrated from Trello board "Project Board"
   ```

### From Jira

1. **Export Issues**:
   - Jira → Issues → Export to CSV
   - Or use Jira REST API

2. **Manual Conversion**:
   - Issue Key → TASK-ID
   - Summary → Title
   - Description → Notes
   - Labels → Tags
   - Status → Column

### From GitHub Issues

```bash
# Use GitHub CLI to export
gh issue list --state all --json number,title,body,labels,createdAt > issues.json
```

Then convert JSON to Markdown format for Void.md.

### From Notion / Obsidian

1. **Export**:
   - Notion: Export to Markdown
   - Obsidian: Simply use the vault

2. **Reformat**:
   Copy content into Void.md task format. The Markdown structure is compatible.

### From Linear

1. **Export**: Linear → Settings → Export → JSON
2. **Convert**: Map states to your Void.md columns

### Migration Tips

- **Start fresh**: Create new kanban.md with your preferred column setup
- **Batch migrate**: Don't migrate everything at once — do it in phases
- **Preserve history**: Add "**Notes**: Migrated from [tool name]" to each migrated task
- **Test**: After migration, verify all tasks display correctly in Void.md

---

## 10. FAQ

### General Questions

#### Q: Is my data safe?
**A**: Yes. Your data lives in `kanban.md` and `archive.md` on your disk. The app only reads and writes those files. Nothing is sent to any server.

#### Q: Can I use this offline?
**A**: Yes. Once loaded, Void.md works completely offline. No internet required.

#### Q: Does this work on mobile?
**A**: Limited support. File System Access API doesn't work on iOS Safari or Android browsers. Use a desktop browser (Chrome/Edge/Opera) for best experience.

#### Q: Can multiple people use this?
**A**: Yes, via Git! Each person can work locally and sync via Git. Just be careful about merge conflicts.

#### Q: Can I have multiple projects?
**A**: Yes. The app supports multiple projects and remembers the last 10 folders you used. Use the dropdown in the header to switch.

### Technical Questions

#### Q: Why can't I use Firefox or Safari?
**A**: These browsers haven't implemented the File System Access API that Void.md needs to read/write files on your disk. Mozilla and Apple have security concerns about the API.

#### Q: Is my data compatible between browsers?
**A**: Yes, the data is in Markdown files, which are browser-independent. The IndexedDB storage is browser-specific, so you'll re-select folders when switching browsers.

#### Q: What happens if the browser crashes?
**A**: Your data is always saved to the Markdown files immediately. Browser crashes won't lose any data.

#### Q: Can I customize the columns?
**A**: Yes! In Settings → Columns, you can add, remove, or reorder columns. Or edit directly in kanban.md:

```markdown
**Columns**: 📝 Backlog (backlog) | 🚀 In Progress (in-progress) | ✅ Done (done)
```

#### Q: How do I enable the rich text editor?
**A**: Go to Settings → Editor → Enable Rich Text Editor. Requires internet to load Tiptap initially.

#### Q: Does the app support dark mode?
**A**: Yes! Theme is in Settings → Theme. Choose Dark, Light, or System.

### Troubleshooting Quick Fixes

When in doubt, try these in order:

1. **Refresh the page** (F5 or Ctrl+R)
2. **Hard refresh** (Ctrl+Shift+R / Cmd+Shift+R)
3. **Re-select folder** (click 📁 icon and choose your project folder)
4. **Clear browser data** (DevTools → Application → Clear storage)
5. **Open in a different browser** (Chrome, Edge, or Opera)
6. **Check the Markdown files** (open kanban.md in a text editor)

---

## Still Need Help?

If your issue isn't covered here:

1. **Check GitHub Issues**: Search for similar problems
2. **Create an Issue**: Include browser, OS, steps to reproduce
3. **Check CHANGELOG.md**: See if it's a known issue being worked on

---

*Last updated: April 2026*  
*Void.md v1.3.2 — Local-first Kanban over Markdown*