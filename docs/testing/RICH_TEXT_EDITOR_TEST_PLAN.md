# Rich Text Editor Test Plan - Void.md

**Version**: 1.3.1
**Date**: April 15, 2026
**Feature**: Rich Text Editor (Tiptap Integration)
**Status**: Draft - Ready for Execution

---

## Executive Summary

This test plan covers comprehensive validation of the Rich Text Editor feature in Void.md, which integrates Tiptap editor for enhanced task note editing. The feature includes:

- Feature toggle system (ENABLE_RICH_TEXT_EDITOR)
- CDN-based library loading with fallback mechanisms
- Editor mode switching (Plain ↔ Rich)
- Task modal integration
- User feedback and status indicators

---

## Test Scope

### In Scope

- Feature flag system and persistence
- CDN loading and fallback mechanisms
- Editor mode switching
- Task modal integration (new/edit tasks)
- Content persistence and conversion
- User feedback mechanisms
- Cross-browser compatibility

### Out of Scope

- Markdown syntax validation (handled by Tiptap)
- Performance benchmarking beyond load times
- Accessibility audit (separate concern)
- Mobile-specific touch interactions

---

## Test Environment Requirements

### Supported Browsers

- Chrome 120+
- Edge 120+
- Firefox 121+
- Opera 106+

### Prerequisites

1. Void.html loaded in browser
2. Console access available
3. LocalStorage and IndexedDB enabled
4. Network connection (for CDN loading)
5. Developer tools available for debugging

### Test Data

- Test project with kanban.md file
- Sample tasks with various content types

---

## Test Matrix

### Legend

- **P0**: Critical - Must pass for release
- **P1**: Important - Should pass for release
- **P2**: Nice to have - Fix if time permits

---

## 1. Feature Toggle Tests

### 1.1 Toggle ON - Dropdown Appears

| Field | Value |
|-------|-------|
| **Test ID** | RTE-FT-001 |
| **Priority** | P0 |
| **Objective** | Verify that enabling the rich text editor feature shows the mode selector dropdown |
| **Preconditions** | Application loaded, Settings modal accessible |

**Steps:**

1. Open void.html in browser
2. Click Settings (⚙️) button
3. Scroll to "Feature Flags" section
4. Toggle "Rich Text Editor" to ON
5. Observe the "Editor Mode" dropdown below

**Expected Result:**

- Toggle switch slides to ON position
- "Editor Mode" dropdown appears below the toggle
- Dropdown shows two options: "Plain Text" and "🎨 Rich Text (Tiptap)"
- No console errors

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

### 1.2 Toggle OFF - Dropdown Hidden

| Field | Value |
|-------|-------|
| **Test ID** | RTE-FT-002 |
| **Priority** | P0 |
| **Objective** | Verify that disabling the rich text editor hides the mode selector |
| **Preconditions** | Feature toggle is currently ON |

**Steps:**

1. With rich text editor enabled, open Settings
2. Toggle "Rich Text Editor" to OFF
3. Observe the area below the toggle

**Expected Result:**

- Toggle switch slides to OFF position
- "Editor Mode" dropdown is hidden
- Settings can still be closed normally
- No console errors

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

### 1.3 Toggle State Persists After Reload

| Field | Value |
|-------|-------|
| **Test ID** | RTE-FT-003 |
| **Priority** | P0 |
| **Objective** | Verify feature toggle state persists across page reloads |
| **Preconditions** | None |

**Steps:**

1. Open Settings
2. Toggle "Rich Text Editor" to ON
3. Close Settings
4. Press F5 to reload the page
5. Re-open Settings
6. Check toggle state

**Expected Result:**

- Toggle remains in ON position after reload
- localStorage contains key "ENABLE_RICH_TEXT_EDITOR" with value "true"
- Dropdown is visible and functional

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

### 1.4 Toggle OFF Persistence

| Field | Value |
|-------|-------|
| **Test ID** | RTE-FT-004 |
| **Priority** | P1 |
| **Objective** | Verify disabled state persists across page reloads |
| **Preconditions** | Feature toggle is currently ON |

**Steps:**

1. Open Settings
2. Toggle "Rich Text Editor" to OFF
3. Close Settings
4. Press F5 to reload the page
5. Re-open Settings
6. Check toggle state

**Expected Result:**

- Toggle remains in OFF position after reload
- localStorage contains key "ENABLE_RICH_TEXT_EDITOR" with value "false"
- Dropdown is not visible

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

### 1.5 Default State (First Visit)

| Field | Value |
|-------|-------|
| **Test ID** | RTE-FT-005 |
| **Priority** | P1 |
| **Objective** | Verify default state is OFF for new users |
| **Preconditions** | Clear browser data / incognito mode |

**Steps:**

1. Open browser in incognito/private mode
2. Navigate to void.html
3. Open Settings
4. Check initial toggle state

**Expected Result:**

- Toggle is in OFF position by default
- No localStorage entry for "ENABLE_RICH_TEXT_EDITOR"
- Plain text mode is implied

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

## 2. CDN Loading Tests

### 2.1 Tiptap Core Loads from Primary CDN

| Field | Value |
|-------|-------|
| **Test ID** | RTE-CDN-001 |
| **Priority** | P0 |
| **Objective** | Verify Tiptap core library loads successfully from primary CDN |
| **Preconditions** | Feature toggle enabled, network available |

**Steps:**

1. Enable "Rich Text Editor" feature in Settings
2. Select "Rich Text (Tiptap)" mode
3. Close Settings
4. Open browser DevTools → Network tab
5. Click "New Task" button
6. Observe network requests

**Expected Result:**

- Network request to unpkg.com for tiptap core
- HTTP 200 status for all Tiptap resources
- Script loads without errors
- Console shows: "📦 Loading Tiptap from: <https://unpkg.com/>..."
- Console shows: "✅ Tiptap library loaded successfully"

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

### 2.2 Extensions Load After Core

| Field | Value |
|-------|-------|
| **Test ID** | RTE-CDN-002 |
| **Priority** | P0 |
| **Objective** | Verify Tiptap extensions load after core library |
| **Preconditions** | Feature enabled, core loading |

**Steps:**

1. Enable rich text feature
2. Open Network tab in DevTools
3. Clear network log
4. Open "New Task" modal
5. Monitor load sequence

**Expected Result:**

- Core library loads first (@tiptap/core)
- StarterKit extension loads second
- Link extension loads third
- Placeholder extension loads fourth
- Dependencies complete in correct order
- No "undefined" errors in console

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

### 2.3 Fallback to Backup CDN (jsdelivr)

| Field | Value |
|-------|-------|
| **Test ID** | RTE-CDN-003 |
| **Priority** | P0 |
| **Objective** | Verify fallback CDN is used when primary fails |
| **Preconditions** | Feature enabled, ability to block unpkg.com |

**Steps:**

1. Enable rich text feature
2. Open DevTools → Network tab
3. Block unpkg.com domain (Network → Request Blocking)
4. Clear cache and reload
5. Attempt to open "New Task" modal
6. Monitor network requests

**Expected Result:**

- Request to unpkg.com fails/blocked
- Application attempts cdn.jsdelivr.net
- Console shows attempt to load from fallback
- Editor eventually loads successfully
- User notification shows loading state

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

### 2.4 Graceful Failure When CDN Unavailable

| Field | Value |
|-------|-------|
| **Test ID** | RTE-CDN-004 |
| **Priority** | P0 |
| **Objective** | Verify graceful degradation when all CDNs fail |
| **Preconditions** | Feature enabled, ability to block all CDNs |

**Steps:**

1. Enable rich text feature
2. Block both unpkg.com and cdn.jsdelivr.net in DevTools
3. Clear cache and reload
4. Attempt to open "New Task" modal
5. Observe behavior

**Expected Result:**

- Console shows loading attempts and failures
- User sees error notification: "Failed to load rich text editor. Using plain text mode."
- Modal opens with plain textarea (fallback)
- No JavaScript errors crash the application
- User can still create/edit tasks

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

### 2.5 CDN Load Timeout Handling

| Field | Value |
|-------|-------|
| **Test ID** | RTE-CDN-005 |
| **Priority** | P1 |
| **Objective** | Verify timeout handling when CDN is slow/unresponsive |
| **Preconditions** | Feature enabled, ability to throttle network |

**Steps:**

1. Enable rich text feature
2. In DevTools → Network, set throttling to "Slow 3G"
3. Attempt to open "New Task" modal
4. Wait for timeout (30 seconds)

**Expected Result:**

- Loading indicator shown during attempt
- After timeout period, error is displayed
- Application gracefully falls back to plain text
- User can continue working

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

### 2.6 Cached Library Reuse

| Field | Value |
|-------|-------|
| **Test ID** | RTE-CDN-006 |
| **Priority** | P1 |
| **Objective** | Verify loaded library is reused without re-fetching |
| **Preconditions** | Feature enabled, library already loaded |

**Steps:**

1. Enable rich text feature
2. Open "New Task" modal (triggers CDN load)
3. Close modal
4. Clear Network tab
5. Open another "New Task" modal
6. Check if new CDN requests are made

**Expected Result:**

- No new CDN requests after initial load
- Console shows: "✅ Tiptap already loaded"
- Editor opens immediately without loading delay

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

## 3. Editor Mode Tests

### 3.1 Plain Mode Shows Textarea

| Field | Value |
|-------|-------|
| **Test ID** | RTE-MODE-001 |
| **Priority** | P0 |
| **Objective** | Verify plain mode displays standard textarea |
| **Preconditions** | Feature enabled, mode set to "Plain Text" |

**Steps:**

1. Enable rich text feature
2. Set mode to "Plain Text" in Settings
3. Close Settings
4. Click "New Task" button
5. Observe Notes field

**Expected Result:**

- Standard HTML textarea is visible
- No formatting toolbar appears
- No "Rich Text" badge shown
- Placeholder text visible if empty

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

### 3.2 Rich Mode Shows Editor with Toolbar

| Field | Value |
|-------|-------|
| **Test ID** | RTE-MODE-002 |
| **Priority** | P0 |
| **Objective** | Verify rich mode displays Tiptap editor with formatting toolbar |
| **Preconditions** | Feature enabled, mode set to "Rich Text", CDN loaded |

**Steps:**

1. Enable rich text feature
2. Set mode to "🎨 Rich Text (Tiptap)"
3. Close Settings
4. Click "New Task" button
5. Wait for CDN load
6. Observe Notes field

**Expected Result:**

- Rich text editor area is visible (not textarea)
- Formatting toolbar appears above editor with buttons:
  - Bold (B)
  - Italic (I)
  - Code (</>)
  - Bullet List
  - Ordered List
  - Clear
- "Rich Text" badge appears
- Editor is focused and ready for input

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

### 3.3 Mode Persists in localStorage

| Field | Value |
|-------|-------|
| **Test ID** | RTE-MODE-003 |
| **Priority** | P0 |
| **Objective** | Verify selected mode persists across page reloads |
| **Preconditions** | Feature enabled |

**Steps:**

1. Set mode to "Rich Text (Tiptap)"
2. Close Settings
3. Press F5 to reload page
4. Open "New Task" modal
5. Check editor type

**Expected Result:**

- Editor opens in rich mode
- localStorage contains key "editorMode" with value "rich"
- Toolbar and badge are visible

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

### 3.4 Switching Modes Updates UI Immediately

| Field | Value |
|-------|-------|
| **Test ID** | RTE-MODE-004 |
| **Priority** | P0 |
| **Objective** | Verify mode switch in Settings applies without page reload |
| **Preconditions** | Feature enabled, task modal closed |

**Steps:**

1. Set mode to "Plain Text"
2. Open "New Task" modal → verify plain textarea
3. Close modal
4. Open Settings
5. Change mode to "Rich Text (Tiptap)"
6. Close Settings (don't reload)
7. Open "New Task" modal again

**Expected Result:**

- Modal now shows rich text editor (not textarea)
- Toolbar is visible
- Badge is visible
- No page reload required

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

### 3.5 Mode Switch in Open Modal

| Field | Value |
|-------|-------|
| **Test ID** | RTE-MODE-005 |
| **Priority** | P1 |
| **Objective** | Verify behavior when switching modes while modal is open |
| **Preconditions** | Feature enabled, modal open with rich editor |

**Steps:**

1. Set mode to "Rich Text"
2. Open "New Task" modal
3. Type some content in rich editor
4. Open Settings (while modal is open)
5. Change mode to "Plain Text"
6. Close Settings
7. Observe the open modal

**Expected Result:**

- Modal content is preserved
- Editor switches to plain textarea
- Content is converted/displayed as markdown
- User can continue editing

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

### 3.6 Invalid Mode Handling

| Field | Value |
|-------|-------|
| **Test ID** | RTE-MODE-006 |
| **Priority** | P2 |
| **Objective** | Verify graceful handling of invalid/corrupted mode values |
| **Preconditions** | Access to localStorage |

**Steps:**

1. Open DevTools → Application → Local Storage
2. Manually set "editorMode" to "invalid_value"
3. Reload the page
4. Open "New Task" modal

**Expected Result:**

- Application defaults to "plain" mode
- No JavaScript errors
- Modal opens with standard textarea
- Console may show warning about invalid mode

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

## 4. Task Modal Integration Tests

### 4.1 New Task Opens with Correct Editor (Plain)

| Field | Value |
|-------|-------|
| **Test ID** | RTE-MODAL-001 |
| **Priority** | P0 |
| **Objective** | Verify new task modal uses correct editor in plain mode |
| **Preconditions** | Feature enabled, mode set to "Plain Text" |

**Steps:**

1. Set mode to "Plain Text"
2. Click "New Task" button
3. Observe the modal

**Expected Result:**

- Modal opens successfully
- Title field is empty and focused
- Notes field shows standard textarea
- No rich text toolbar visible
- Priority defaults to "Medium"
- Create button is enabled

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

### 4.2 New Task Opens with Correct Editor (Rich)

| Field | Value |
|-------|-------|
| **Test ID** | RTE-MODAL-002 |
| **Priority** | P0 |
| **Objective** | Verify new task modal uses correct editor in rich mode |
| **Preconditions** | Feature enabled, mode set to "Rich Text", CDN loaded |

**Steps:**

1. Set mode to "Rich Text (Tiptap)"
2. Click "New Task" button
3. Wait for CDN load if needed
4. Observe the modal

**Expected Result:**

- Modal opens successfully
- Title field is empty and focused
- Notes field shows Tiptap editor (not textarea)
- Formatting toolbar visible above notes
- "Rich Text" badge displayed
- Editor is ready for input

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

### 4.3 Edit Task Opens with Correct Editor (Plain)

| Field | Value |
|-------|-------|
| **Test ID** | RTE-MODAL-003 |
| **Priority** | P0 |
| **Objective** | Verify edit task modal uses correct editor in plain mode |
| **Preconditions** | Feature enabled, mode set to "Plain Text", existing task with notes |

**Steps:**

1. Set mode to "Plain Text"
2. Create a task with notes content
3. Click on the task to edit
4. Observe the modal

**Expected Result:**

- Modal opens with task details
- Title field contains existing title
- Notes field shows textarea with existing notes
- Content is preserved exactly as entered
- No rich text elements visible

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

### 4.4 Edit Task Opens with Correct Editor (Rich)

| Field | Value |
|-------|-------|
| **Test ID** | RTE-MODAL-004 |
| **Priority** | P0 |
| **Objective** | Verify edit task modal uses correct editor in rich mode |
| **Preconditions** | Feature enabled, mode set to "Rich Text", existing task with rich notes |

**Steps:**

1. Set mode to "Rich Text (Tiptap)"
2. Create a task with rich formatted notes
3. Click on the task to edit
4. Wait for CDN load
5. Observe the modal

**Expected Result:**

- Modal opens with task details
- Title field contains existing title
- Rich editor displays with existing content
- Formatting is preserved (bold, italic, etc.)
- Toolbar is visible and functional
- "Rich Text" badge is displayed

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

### 4.5 Content Saves Correctly in Plain Mode

| Field | Value |
|-------|-------|
| **Test ID** | RTE-MODAL-005 |
| **Priority** | P0 |
| **Objective** | Verify task notes save correctly in plain text mode |
| **Preconditions** | Feature enabled, mode set to "Plain Text" |

**Steps:**

1. Set mode to "Plain Text"
2. Click "New Task"
3. Fill in: Title = "Test Plain Save", Notes = "Line 1\nLine 2\nLine 3"
4. Click "Create" button
5. Click on the created task to edit

**Expected Result:**

- Task is created successfully
- Notes content is preserved exactly
- Line breaks maintained
- Re-opening task shows identical content
- No data loss or corruption

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

### 4.6 Content Saves Correctly in Rich Mode

| Field | Value |
|-------|-------|
| **Test ID** | RTE-MODAL-006 |
| **Priority** | P0 |
| **Objective** | Verify task notes save correctly in rich text mode with formatting |
| **Preconditions** | Feature enabled, mode set to "Rich Text", CDN loaded |

**Steps:**

1. Set mode to "Rich Text (Tiptap)"
2. Click "New Task"
3. Fill in Title
4. In Notes editor:
   - Type "Normal text "
   - Select "Bold text", click Bold button
   - Type " "
   - Select "Italic text", click Italic button
5. Click "Create"
6. Click on the task to edit

**Expected Result:**

- Task is created successfully
- Rich content is preserved with formatting
- Bold text appears bold in editor
- Italic text appears italic
- Formatting toolbar buttons show active state for formatted text

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

### 4.7 Switching Modes Preserves Content

| Field | Value |
|-------|-------|
| **Test ID** | RTE-MODAL-007 |
| **Priority** | P0 |
| **Objective** | Verify content is preserved when switching between plain and rich modes |
| **Preconditions** | Feature enabled, task with rich content exists |

**Steps:**

1. Set mode to "Rich Text"
2. Create task with formatted content (bold, italic)
3. Save and close
4. Open Settings, switch to "Plain Text" mode
5. Open the same task to edit
6. Observe content
7. Close without saving
8. Switch back to "Rich Text" mode
9. Open task again

**Expected Result:**

- In plain mode: content shows as markdown (**bold**, _italic_)
- In rich mode: content shows with actual formatting
- No content loss in either direction
- Conversion is reversible

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

### 4.8 Modal Close Cleanup

| Field | Value |
|-------|-------|
| **Test ID** | RTE-MODAL-008 |
| **Priority** | P1 |
| **Objective** | Verify editor instance is properly cleaned up when modal closes |
| **Preconditions** | Feature enabled, mode set to "Rich Text", CDN loaded |

**Steps:**

1. Set mode to "Rich Text"
2. Open "New Task" modal
3. Wait for editor to initialize
4. Check console: `TiptapEditor.hasInstance()` should return true
5. Close modal (Cancel button or X)
6. Check console: `TiptapEditor.hasInstance()` should return false
7. Check for any console errors

**Expected Result:**

- Editor instance is destroyed on modal close
- `TiptapEditor.hasInstance()` returns false
- No memory leaks
- No console errors about destroyed editor
- Modal can be reopened without issues

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

### 4.9 Empty Notes Handling

| Field | Value |
|-------|-------|
| **Test ID** | RTE-MODAL-009 |
| **Priority** | P1 |
| **Objective** | Verify empty notes are handled correctly without creating empty rich content entries |
| **Preconditions** | Feature enabled, mode set to "Rich Text", access to localStorage |

**Steps:**

1. Set mode to "Rich Text"
2. Create new task
3. Fill in Title only, leave Notes empty
4. Click "Create"
5. Check localStorage for keys starting with "tm_rich_"

**Expected Result:**

- Task is created successfully
- No "tm_rich_" entry created for empty notes
- localStorage is not polluted with empty entries
- Editing task shows empty editor

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

### 4.10 Concurrent Modal Operations

| Field | Value |
|-------|-------|
| **Test ID** | RTE-MODAL-010 |
| **Priority** | P2 |
| **Objective** | Verify behavior when quickly opening/closing modals |
| **Preconditions** | Feature enabled, mode set to "Rich Text", CDN loaded |

**Steps:**

1. Set mode to "Rich Text"
2. Rapidly click "New Task" and Cancel 5 times
3. Observe behavior and console
4. Check editor state after sequence

**Expected Result:**

- No JavaScript errors
- Editor initializes correctly on each open
- Editor cleans up correctly on each close
- No duplicate editor instances
- Application remains stable

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

## 5. User Feedback Tests

### 5.1 Loading State Shown During CDN Load

| Field | Value |
|-------|-------|
| **Test ID** | RTE-FEED-001 |
| **Priority** | P0 |
| **Objective** | Verify loading indicator appears while Tiptap is loading from CDN |
| **Preconditions** | Feature enabled but CDN not yet loaded, mode set to "Rich Text" |

**Steps:**

1. Enable rich text feature
2. Select "Rich Text (Tiptap)" mode
3. Clear browser cache (or use incognito)
4. Open "New Task" modal
5. Observe immediately after opening

**Expected Result:**

- Status message appears: "⏳ Loading rich text editor..."
- Loading state is visible in Settings area
- Notification appears: "Loading rich text editor..."
- User knows system is working

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

### 5.2 Success Message When Loaded

| Field | Value |
|-------|-------|
| **Test ID** | RTE-FEED-002 |
| **Priority** | P0 |
| **Objective** | Verify success feedback when Tiptap loads successfully |
| **Preconditions** | Feature enabled, CDN loading in progress |

**Steps:**

1. Enable rich text feature
2. Open "New Task" modal (triggers CDN load)
3. Wait for load to complete
4. Observe notifications and console

**Expected Result:**

- Console shows: "✅ Tiptap library loaded successfully"
- Console shows timing: "📊 Tiptap loaded in XXXms"
- Settings status updates to: "✓ Rich text editor ready!"
- Green checkmark indicator visible
- No error messages

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

### 5.3 Error Message When Load Fails

| Field | Value |
|-------|-------|
| **Test ID** | RTE-FEED-003 |
| **Priority** | P0 |
| **Objective** | Verify clear error feedback when Tiptap fails to load |
| **Preconditions** | Feature enabled, CDN blocked/unavailable |

**Steps:**

1. Block CDN domains in DevTools
2. Enable rich text feature
3. Select "Rich Text (Tiptap)" mode
4. Open "New Task" modal
5. Wait for timeout

**Expected Result:**

- Error notification appears: "Failed to load rich text editor. Using plain text mode."
- Console shows error details
- Settings status shows error message
- Modal still opens with plain textarea fallback
- User understands what happened

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

### 5.4 Clear Indication of Current Mode

| Field | Value |
|-------|-------|
| **Test ID** | RTE-FEED-004 |
| **Priority** | P0 |
| **Objective** | Verify user can clearly see which editor mode is active |
| **Preconditions** | Feature enabled |

**Steps:**

1. Open Settings
2. Check current mode display in "Editor Mode" dropdown
3. Change mode to different option
4. Close and reopen Settings
5. Verify mode display

**Expected Result:**

- Settings shows current mode in dropdown
- When rich mode is active and modal is open:
  - "Rich Text" badge is visible in modal
  - Toolbar is visible
  - Settings reflects "Rich Text (Tiptap)" selection

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

### 5.5 Badge Visibility in Rich Mode

| Field | Value |
|-------|-------|
| **Test ID** | RTE-FEED-005 |
| **Priority** | P1 |
| **Objective** | Verify "Rich Text" badge is visible only in rich mode |
| **Preconditions** | Feature enabled |

**Steps:**

1. Set mode to "Plain Text"
2. Open "New Task" modal
3. Observe Notes field area
4. Close modal
5. Set mode to "Rich Text (Tiptap)"
6. Open "New Task" modal
7. Observe Notes field area

**Expected Result:**

- Plain mode: No "Rich Text" badge visible
- Rich mode: "Rich Text" badge visible near Notes field
- Badge is clearly styled and readable

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

### 5.6 Toolbar Button Feedback

| Field | Value |
|-------|-------|
| **Test ID** | RTE-FEED-006 |
| **Priority** | P1 |
| **Objective** | Verify toolbar buttons provide visual feedback when active |
| **Preconditions** | Feature enabled, mode set to "Rich Text", CDN loaded |

**Steps:**

1. Open "New Task" modal with rich editor
2. Type some text
3. Select text and click Bold button
4. Observe button state
5. Click Italic button
6. Observe button state
7. Click elsewhere to deselect

**Expected Result:**

- Bold button appears pressed/active when selection is bold
- Italic button appears pressed/active when selection is italic
- Visual feedback clearly indicates active formatting
- Multiple buttons can be active simultaneously

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

### 5.7 Settings Status Updates in Real-time

| Field | Value |
|-------|-------|
| **Test ID** | RTE-FEED-007 |
| **Priority** | P1 |
| **Objective** | Verify Settings modal shows current Tiptap status without reopening |
| **Preconditions** | Feature enabled, Settings open |

**Steps:**

1. Open Settings
2. Enable rich text feature
3. Observe status message area
4. Select "Rich Text (Tiptap)" mode
5. Keep Settings open during CDN load
6. Watch status message update

**Expected Result:**

- Status message updates from loading to ready
- No need to close and reopen Settings
- Real-time status reflection
- Visual indication of load completion

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

## 6. Cross-Browser Compatibility Tests

### 6.1 Chrome Compatibility

| Field | Value |
|-------|-------|
| **Test ID** | RTE-XB-001 |
| **Priority** | P0 |
| **Objective** | Verify rich text editor works in Chrome |
| **Preconditions** | Chrome 120+, feature enabled |

**Steps:**

1. Open void.html in Chrome
2. Enable rich text feature
3. Select rich mode
4. Create task with formatted notes
5. Edit task and verify content

**Expected Result:**

- All features work as specified
- No browser-specific errors
- Performance acceptable (< 500ms load)

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

### 6.2 Edge Compatibility

| Field | Value |
|-------|-------|
| **Test ID** | RTE-XB-002 |
| **Priority** | P0 |
| **Objective** | Verify rich text editor works in Edge |
| **Preconditions** | Edge 120+, feature enabled |

**Steps:**
Same as 6.1 in Edge browser

**Expected Result:**

- All features work as specified
- No browser-specific errors

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

### 6.3 Firefox Compatibility

| Field | Value |
|-------|-------|
| **Test ID** | RTE-XB-003 |
| **Priority** | P1 |
| **Objective** | Verify rich text editor works in Firefox |
| **Preconditions** | Firefox 121+, feature enabled |

**Steps:**
Same as 6.1 in Firefox browser

**Expected Result:**

- All features work as specified
- No browser-specific errors

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

## 7. Edge Cases and Error Handling

### 7.1 Storage Quota Exceeded

| Field | Value |
|-------|-------|
| **Test ID** | RTE-EDGE-001 |
| **Priority** | P1 |
| **Objective** | Verify graceful handling when localStorage quota is exceeded |
| **Preconditions** | Feature enabled, localStorage nearly full |

**Steps:**

1. Fill localStorage with dummy data near quota
2. Enable rich text feature
3. Attempt to create task with rich notes

**Expected Result:**

- Error is caught and logged
- User sees notification about storage issue
- Task may save without rich content, or operation fails gracefully
- No application crash

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

### 7.2 Corrupted Storage Data

| Field | Value |
|-------|-------|
| **Test ID** | RTE-EDGE-002 |
| **Priority** | P2 |
| **Objective** | Verify handling of corrupted rich content in localStorage |
| **Preconditions** | Feature enabled, access to DevTools |

**Steps:**

1. Create task with rich notes
2. In DevTools, manually corrupt the tm_rich_ entry (invalid JSON)
3. Attempt to edit the task

**Expected Result:**

- Error is caught
- Editor opens with empty/default content
- Console shows warning about corrupted data
- User can still edit and save
- Corrupted entry may be cleared

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

### 7.3 Very Large Content

| Field | Value |
|-------|-------|
| **Test ID** | RTE-EDGE-003 |
| **Priority** | P2 |
| **Objective** | Verify handling of very large notes content |
| **Preconditions** | Feature enabled, mode set to "Rich Text" |

**Steps:**

1. Create task with 10,000+ characters of formatted text
2. Save and close
3. Reopen task to edit
4. Verify performance and content integrity

**Expected Result:**

- Content saves successfully
- Content loads without significant delay (< 2 seconds)
- Formatting is preserved
- No browser freeze or crash

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

## 8. Regression Tests

### 8.1 Plain Text Mode Unaffected

| Field | Value |
|-------|-------|
| **Test ID** | RTE-REG-001 |
| **Priority** | P0 |
| **Objective** | Verify existing plain text functionality still works |
| **Preconditions** | Feature enabled but set to plain mode |

**Steps:**

1. Keep feature enabled but use plain mode
2. Create multiple tasks with notes
3. Edit tasks
4. Delete tasks
5. Switch between projects

**Expected Result:**

- All existing functionality works
- No regression in plain text mode
- Tasks save and load correctly
- No console errors

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

### 8.2 Feature Disabled - No Impact

| Field | Value |
|-------|-------|
| **Test ID** | RTE-REG-002 |
| **Priority** | P0 |
| **Objective** | Verify application works normally when feature is disabled |
| **Preconditions** | Feature disabled |

**Steps:**

1. Disable rich text feature in Settings
2. Reload page
3. Perform all standard operations:
   - Create tasks
   - Edit tasks
   - Delete tasks
   - Switch projects
   - Search/filter

**Expected Result:**

- Application behaves exactly as before rich text feature
- No console errors
- No references to undefined Tiptap objects
- Smooth performance

**Actual Result:**
_"To be filled during testing"_

**Status:** ⬜ Pass / ⬜ Fail

**Notes:**
_"To be filled during testing"_

---

## Test Execution Summary

### Test Count by Priority

| Priority | Count | Description |
|----------|-------|-------------|
| P0 (Critical) | 24 | Must pass for release |
| P1 (Important) | 15 | Should pass for release |
| P2 (Nice to have) | 7 | Fix if time permits |
| **Total** | **46** | |

### Test Categories

| Category | Count |
|----------|-------|
| Feature Toggle Tests | 5 |
| CDN Loading Tests | 6 |
| Editor Mode Tests | 6 |
| Task Modal Integration Tests | 10 |
| User Feedback Tests | 7 |
| Cross-Browser Tests | 3 |
| Edge Cases | 3 |
| Regression Tests | 2 |

---

## Automated Test Integration

### Existing Automated Tests

The following test suites exist and should be run alongside manual testing:

1. **Feature Flag Tests** (`runFeatureFlagTests()`)
   - Tests feature flag system
   - Tests toggle functionality
   - Tests persistence

2. **Fallback Tests** (`runFallbackTests()`)
   - Tests fallback mechanisms
   - Tests mode switching
   - Tests graceful degradation

3. **Storage Tests** (`runStorageTests()`)
   - Tests RichContentStorage
   - Tests save/load operations
   - Tests data integrity

4. **TiptapEditor Tests** (`runTiptapEditorTests()`)
   - Tests editor class
   - Tests formatting methods
   - Tests content operations

5. **Form Integration Tests** (`runFormIntegrationTests()`)
   - Tests modal integration
   - Tests form elements
   - Tests mode display

### Running Automated Tests

```javascript
// Run all automated tests
runAllTests();

// Run Phase 2 specific tests
runPhase2Tests();

// Run individual suites
runFeatureFlagTests();
runFallbackTests();
runStorageTests();
runTiptapEditorTests();
runFormIntegrationTests();
```

---

## Sign-Off

### Test Completion Checklist

- [ ] All P0 tests executed
- [ ] All P0 tests passed (or documented exceptions)
- [ ] All P1 tests executed
- [ ] Critical bugs fixed and retested
- [ ] Automated test suite passes
- [ ] Cross-browser testing completed
- [ ] Regression testing completed
- [ ] Performance acceptable (< 500ms load time)

### Signatures

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Test Lead | | | |
| Developer | | | |
| Product Owner | | | |

---

## Appendix

### A. Debug Commands

```javascript
// Check Tiptap status
console.log('Tiptap loaded:', typeof window.Tiptap !== 'undefined');
console.log('TiptapEditor active:', window.TiptapEditor?.hasInstance());
console.log('Editor mode:', window.getEditorMode?.());
console.log('Rich text available:', window.isRichTextAvailable?.());

// Check storage
console.log('RichContentStorage:', typeof RichContentStorage);
console.log('All rich tasks:', RichContentStorage?.getAllTaskIds?.());

// Check feature flags
console.log('Feature flags:', window.FEATURE_FLAGS);
console.log('Rich text enabled:', window.isFeatureEnabled?.('ENABLE_RICH_TEXT_EDITOR'));

// Force reload
localStorage.removeItem('TiptapLoaded');
location.reload();
```

### B. CDN URLs

| Resource | Primary URL | Fallback URL |
|----------|-------------|--------------|
| Core | unpkg.com/@tiptap/core | cdn.jsdelivr.net/npm/@tiptap/core |
| StarterKit | unpkg.com/@tiptap/starter-kit | cdn.jsdelivr.net/npm/@tiptap/starter-kit |
| Link | unpkg.com/@tiptap/extension-link | cdn.jsdelivr.net/npm/@tiptap/extension-link |
| Placeholder | unpkg.com/@tiptap/extension-placeholder | cdn.jsdelivr.net/npm/@tiptap/extension-placeholder |

### C. LocalStorage Keys

| Key | Purpose |
|-----|---------|
| ENABLE_RICH_TEXT_EDITOR | Feature toggle state |
| editorMode | Selected editor mode (plain/rich) |
| tm_rich_{taskId} | Rich content for specific task |

### D. Known Limitations

1. **CDN Dependency**: First load requires network access
2. **Browser Support**: Requires modern browsers (Chrome 120+, Edge 120+, Firefox 121+)
3. **Mobile**: Touch interactions not extensively tested
4. **Accessibility**: Full a11y audit pending

---

**Document Version**: 1.0
**Last Updated**: April 15, 2026
**Status**: Ready for Test Execution
