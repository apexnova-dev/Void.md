# Experimental Features (v1.2.0) – Assessment

**Date**: February 2026  
**Purpose**: Clarify what exists, what works, and what to do with the four experimental toggles in Settings.

---

## Summary

| Feature | In app | Actually works? | Recommendation |
|--------|--------|------------------|----------------|
| **Rich Text Editor** | Toggle + status text + CDN load | **No** – editor never attached to Notes | Simplify or complete (see below) |
| **Comments System** | Toggle only | **No** – no UI or logic | Remove from UI or hide |
| **Slash Commands** | Toggle only | **No** – no "/" handler | Remove from UI or hide |
| **Performance Logging** | Toggle + a few `console.log`s | **Yes** (minimal) | Keep as-is or remove |

---

## 1. Rich Text Editor (Tiptap)

### What’s there

- **Feature flag** `ENABLE_RICH_TEXT_EDITOR` and Settings toggle.
- **CDN loading**: `loadTiptapLibrary()` loads `@tiptap/core` from unpkg/jsDelivr when the feature is enabled.
- **Status UI**: “✓ Editor loaded and ready” / “⏳ Loading…” / “⚠️ Failed to load” under the toggle; “Editor mode” dropdown (Plain / Rich); badge and status line next to the Notes field (“✓ Rich text editor active. Use "/" for commands”).
- **Storage layer**: `RichContentStorage` (IndexedDB/localStorage-style API) with `saveRichNotes`, `loadRichNotes`, `hasRichNotes`, etc.

### What’s missing

- **No Tiptap editor in the form.** The Notes field is always the plain `<textarea id="taskNotes">`. Nothing ever:
  - Creates a Tiptap editor instance.
  - Replaces or overlays the textarea with an editor when the task modal opens.
  - Writes Tiptap content into `task.notes` or into `RichContentStorage` on save.
- **No `TiptapEditor` class** in `void.html`. The Phase 2 docs and `phase2-tests.js` describe a `TiptapEditor` with `create(containerId)`, `destroy()`, `setContent`, `getContent`, etc., and a `#tiptapContainer` in the form. **None of that exists in the current file.**
- So: the app can load Tiptap and show “rich text active”, but the user still edits plain text in the textarea. The “Use / for commands” message is misleading (slash commands are not implemented).

### Minor bug

- `showNotification('Loading rich text editor...', 'info', 0)` is called with a third argument; `showNotification` only takes `(message, type)`. The extra `0` is ignored. Not critical.

### Recommendation

**Option A – Simplify (recommended for “not working well”)**

- Stop promising a rich editor until it’s real:
  - When the Rich Text toggle is on and Tiptap has loaded, **don’t** show “Rich text editor active. Use "/" for commands.” Show something like: “Rich text editor (coming soon). Notes use plain text for now.”
  - Or hide the “Editor mode” dropdown until the editor is actually implemented (so users don’t think “Rich Text (Tiptap)” does something).
- Keep the toggle and CDN load if you plan to implement later; otherwise you can remove the toggle and the load and rely on the existing Markdown in the textarea.

**Option B – Complete the feature (if you want it)**

- Re-add or implement from the Phase 2 plan:
  - A **TiptapEditor** wrapper (create/destroy/setContent/getContent/getText, etc.).
  - A **`#tiptapContainer`** in the task form (and hide the textarea when in rich mode).
  - On **open task modal**: if rich mode and task has rich notes, load from `RichContentStorage` and set editor content; else set from `task.notes` (plain/Markdown).
  - On **save**: get content from editor, write to `task.notes` (e.g. as HTML or Markdown) and/or to `RichContentStorage` for that task.
- Then the existing `RichContentStorage` and CDN loading would be used end-to-end.

**What’s worth keeping**

- **Feature flag and toggle** – useful if you later complete the editor.
- **`loadTiptapLibrary()`** – needed if you implement the editor.
- **`RichContentStorage`** – already used by unit tests and is the right place for rich content if you add the editor.

---

## 2. Comments System

### What’s there

- Feature flag `ENABLE_COMMENTS` and Settings toggle: “Threaded comments with @mentions and reactions”.
- No other UI, no data model, no event handlers. The flag is only read in a couple of places (e.g. `getSystemInfo()`).

### What’s missing

- Any comments UI (thread list, reply form, @mentions, reactions).
- Any storage or in-memory model for threads/comments.
- Any link from a task to “its comments”.

The domain analysis (`DOMAIN_ANALYSIS_v1.2.0_COMMENTS.md`) describes a full design; none of it is implemented in `void.html`.

### Recommendation

- **Remove or hide the Comments toggle** so users don’t expect a feature that isn’t there. You can keep the flag in code and re-add the toggle when you start implementation.
- If you prefer to keep the section for “future” only, add a short line: “Comments (planned for a future release).”

---

## 3. Slash Commands

### What’s there

- Feature flag `ENABLE_SLASH_COMMANDS` and Settings toggle: “Notion-style '/' commands for quick formatting”.
- Declared dependency: Rich Text Editor. No code that handles “/” in any input or editor.

### What’s missing

- Any handler for “/” (e.g. in the Notes field or in a future Tiptap editor).
- Any command palette or list of commands.
- The Rich Text Editor itself isn’t wired to the form, so there’s no editor to attach slash commands to.

### Recommendation

- **Remove or hide the Slash Commands toggle** until the Rich Text Editor is actually in use and you’re ready to add a “/” handler.
- Optionally add a note in Settings: “Slash commands will be available when the Rich Text Editor is enabled and active.”

---

## 4. Performance Logging

### What’s there

- Feature flag `ENABLE_PERFORMANCE_LOGGING` and Settings toggle.
- When enabled, a few extra `console.log` calls run, e.g.:
  - Tiptap load time.
  - “Tiptap integration ready.”
  - “Rich content saved for &lt;taskId&gt;” / “Rich content loaded for &lt;taskId&gt;.”

### What’s missing

- No real metrics (e.g. no export, no UI). It’s “logging” only.

### Recommendation

- **Keep as-is** if you find the console messages useful for debugging.
- **Remove the toggle** and always log (or never log) if you want to simplify Settings and don’t care about the flag.

---

## Suggested next steps (in order)

1. **Stop over-promising**
   - Tone down or remove the “Rich text editor active. Use "/" for commands” text when the editor isn’t actually used.
   - Optionally hide “Editor mode” when the editor isn’t implemented.

2. **Simplify Experimental section**
   - **Comments**: Remove toggle or label as “Planned” so it’s clear it’s not implemented.
   - **Slash Commands**: Remove toggle or label as “Requires Rich Text Editor” and disable until Rich Text is real.

3. **Fix the small bug**
   - Change `showNotification('Loading rich text editor...', 'info', 0)` to `showNotification('Loading rich text editor...', 'info')` (drop the third argument).

4. **Decide on Rich Text**
   - If you’re not planning to finish it soon: keep toggle + load + storage, but make the status/badge text honest (“coming soon” or similar).
   - If you are: use the Phase 2 plan and tests to (re-)implement the TiptapEditor, container, and form integration; then slash commands can be a follow-up.

5. **Tests**
   - `docs/architecture/tests/phase2-tests.js` assumes `TiptapEditor` and `#tiptapContainer` exist. Until that code is in `void.html`, those tests will fail. Either add a note in the test file that Phase 2 is optional/incomplete, or skip/remove the TiptapEditor tests until the implementation is present.

---

## References

- `void.html`: feature flags (~2965–2986), `loadTiptapLibrary` (~3295), `RichContentStorage` (~3155), form always uses `taskNotes` value (~4306, 1684).
- `docs/architecture/PHASE2_IMPLEMENTATION_PLAN.md` – planned TiptapEditor and form integration.
- `docs/architecture/PHASE2_IMPLEMENTATION_SUMMARY.md` – describes implementation that is not in the current HTML.
- `docs/architecture/DOMAIN_ANALYSIS_v1.2.0_COMMENTS.md` – comments/threads design (not implemented).
- `docs/architecture/tests/phase2-tests.js` – expects `TiptapEditor` and `tiptapContainer`.
