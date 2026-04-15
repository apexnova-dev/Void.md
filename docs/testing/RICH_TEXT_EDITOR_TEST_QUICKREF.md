# Rich Text Editor Test Plan - Quick Reference

**For**: Void.md v1.3.1 Rich Text Editor (Tiptap)
**Use this**: During test execution for quick reference

---

## Quick Start Checklist

### Pre-Test Setup
- [ ] Open void.html in target browser
- [ ] Open DevTools (F12) → Console
- [ ] Clear localStorage (optional): `localStorage.clear(); location.reload()`
- [ ] Verify network connectivity

### Automated Tests First
```javascript
// Copy & paste into console
runAllTests();
// Or run Phase 2 specifically
runPhase2Tests();
```

---

## Test Matrix Summary

| ID | Category | Test | Priority | Status |
|----|----------|------|----------|--------|
| RTE-FT-001 | Toggle | ON → Dropdown appears | P0 | ⬜ |
| RTE-FT-002 | Toggle | OFF → Dropdown hidden | P0 | ⬜ |
| RTE-FT-003 | Toggle | State persists after reload | P0 | ⬜ |
| RTE-FT-004 | Toggle | OFF persists after reload | P1 | ⬜ |
| RTE-FT-005 | Toggle | Default is OFF | P1 | ⬜ |
| RTE-CDN-001 | CDN | Core loads from unpkg | P0 | ⬜ |
| RTE-CDN-002 | CDN | Extensions load in order | P0 | ⬜ |
| RTE-CDN-003 | CDN | Fallback to jsdelivr | P0 | ⬜ |
| RTE-CDN-004 | CDN | Graceful failure | P0 | ⬜ |
| RTE-CDN-005 | CDN | Timeout handling | P1 | ⬜ |
| RTE-CDN-006 | CDN | Cached reuse | P1 | ⬜ |
| RTE-MODE-001 | Mode | Plain shows textarea | P0 | ⬜ |
| RTE-MODE-002 | Mode | Rich shows editor + toolbar | P0 | ⬜ |
| RTE-MODE-003 | Mode | Mode persists in localStorage | P0 | ⬜ |
| RTE-MODE-004 | Mode | Switch updates UI immediately | P0 | ⬜ |
| RTE-MODE-005 | Mode | Switch in open modal | P1 | ⬜ |
| RTE-MODE-006 | Mode | Invalid mode handling | P2 | ⬜ |
| RTE-MODAL-001 | Modal | New task - plain mode | P0 | ⬜ |
| RTE-MODAL-002 | Modal | New task - rich mode | P0 | ⬜ |
| RTE-MODAL-003 | Modal | Edit task - plain mode | P0 | ⬜ |
| RTE-MODAL-004 | Modal | Edit task - rich mode | P0 | ⬜ |
| RTE-MODAL-005 | Modal | Save content - plain | P0 | ⬜ |
| RTE-MODAL-006 | Modal | Save content - rich | P0 | ⬜ |
| RTE-MODAL-007 | Modal | Mode switch preserves content | P0 | ⬜ |
| RTE-MODAL-008 | Modal | Close cleanup | P1 | ⬜ |
| RTE-MODAL-009 | Modal | Empty notes handling | P1 | ⬜ |
| RTE-MODAL-010 | Modal | Concurrent operations | P2 | ⬜ |
| RTE-FEED-001 | Feedback | Loading state shown | P0 | ⬜ |
| RTE-FEED-002 | Feedback | Success message | P0 | ⬜ |
| RTE-FEED-003 | Feedback | Error message on fail | P0 | ⬜ |
| RTE-FEED-004 | Feedback | Current mode indication | P0 | ⬜ |
| RTE-FEED-005 | Feedback | Badge visibility | P1 | ⬜ |
| RTE-FEED-006 | Feedback | Toolbar button feedback | P1 | ⬜ |
| RTE-FEED-007 | Feedback | Real-time status updates | P1 | ⬜ |
| RTE-XB-001 | Browser | Chrome compatibility | P0 | ⬜ |
| RTE-XB-002 | Browser | Edge compatibility | P0 | ⬜ |
| RTE-XB-003 | Browser | Firefox compatibility | P1 | ⬜ |
| RTE-EDGE-001 | Edge | Storage quota exceeded | P1 | ⬜ |
| RTE-EDGE-002 | Edge | Corrupted storage data | P2 | ⬜ |
| RTE-EDGE-003 | Edge | Very large content | P2 | ⬜ |
| RTE-REG-001 | Regression | Plain text unaffected | P0 | ⬜ |
| RTE-REG-002 | Regression | Feature disabled - no impact | P0 | ⬜ |

**Total: 46 tests** | **P0: 24** | **P1: 15** | **P2: 7**

---

## Critical Test Path (P0 Only)

### Path 1: Basic Enable & Use
```
1. Open Settings
2. Toggle Rich Text Editor ON
3. Select "Rich Text (Tiptap)" mode
4. Close Settings
5. Click New Task
6. Verify: Toolbar appears, Badge visible
7. Type with formatting (bold, italic)
8. Create task
9. Click task to edit
10. Verify: Content preserved with formatting
11. Disable feature
12. Verify: Plain textarea shown
```

### Path 2: CDN Fallback
```
1. Block unpkg.com in DevTools
2. Enable rich text feature
3. Open New Task
4. Verify: Falls back to jsdelivr
5. If both blocked: Graceful error + plain text fallback
```

### Path 3: Persistence
```
1. Enable rich text, select rich mode
2. Create task with formatted content
3. Press F5 to reload
4. Verify: Toggle still ON, mode still Rich
5. Edit task: Content preserved
```

---

## Console Commands for Testing

### Check Status
```javascript
// All-in-one status check
console.table({
  'Tiptap Loaded': typeof window.Tiptap !== 'undefined',
  'TiptapEditor': typeof window.TiptapEditor !== 'undefined',
  'Has Instance': window.TiptapEditor?.hasInstance?.(),
  'Editor Mode': window.getEditorMode?.(),
  'Rich Available': window.isRichTextAvailable?.(),
  'Feature Enabled': window.isFeatureEnabled?.('ENABLE_RICH_TEXT_EDITOR'),
  'LocalStorage Keys': Object.keys(localStorage).filter(k => k.includes('rich') || k.includes('editor') || k.includes('ENABLE'))
});
```

### Quick Toggle
```javascript
// Toggle feature
window.toggleFeature('ENABLE_RICH_TEXT_EDITOR');

// Set mode
window.changeEditorMode('rich'); // or 'plain'

// Check storage
console.log('Rich tasks:', RichContentStorage?.getAllTaskIds?.());
```

### Force Reset
```javascript
// Clear all rich text data
Object.keys(localStorage)
  .filter(k => k.startsWith('tm_rich_') || k.includes('Tiptap') || k.includes('editor') || k.includes('ENABLE_RICH'))
  .forEach(k => localStorage.removeItem(k));
location.reload();
```

---

## Common Issues & Quick Fixes

| Issue | Quick Check | Fix |
|-------|-------------|-----|
| Editor not appearing | `isFeatureEnabled('ENABLE_RICH_TEXT_EDITOR')` | Enable in Settings |
| Editor not loading | `typeof window.Tiptap` | Check network, clear cache |
| Content not saving | Check task ID exists | Ensure task created before editing |
| Mode not persisting | Check localStorage "editorMode" | Manually set: `localStorage.setItem('editorMode', 'rich')` |
| Toolbar buttons not working | Check `TiptapEditor.hasInstance()` | Reopen modal, check console errors |

---

## Expected Console Output

### Successful Load
```
🧪 PHASE 2 TEST SUITE - Tiptap Editor Integration
============================================================
✅ TiptapEditor Tests: 9/9 passed
✅ RichContentStorage Tests: 7/7 passed  
✅ Form Integration Tests: 7/7 passed
TOTAL: 23/23 passed
============================================================
✅ ALL PHASE 2 TESTS PASSED!

[Tiptap] Loading from CDN...
✅ Tiptap library loaded successfully
📊 Tiptap loaded in 245ms
```

### Error State
```
❌ Failed to load Tiptap from all CDNs: Network error
Failed to load rich text editor. Using plain text mode.
```

---

## Sign-Off Requirements

### Before Sign-Off, Verify:
- [ ] All 24 P0 tests passed
- [ ] Automated suite: 23/23 passed
- [ ] Chrome: All P0 passed
- [ ] Edge: All P0 passed  
- [ ] No console errors in normal usage
- [ ] Feature disabled = zero impact
- [ ] Performance: < 500ms load time

### Known Acceptable Limitations
- First load requires network (CDN)
- Mobile not extensively tested
- Very large content (>50KB) may have performance impact

---

**Quick Reference Version**: 1.0
**For Full Details**: See RICH_TEXT_EDITOR_TEST_PLAN.md