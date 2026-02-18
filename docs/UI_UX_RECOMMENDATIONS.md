# UI/UX Recommendations – Markdown Task Manager

**Focus:** Header/top bar, layout clarity, and general UI polish.  
**File:** [task-manager.html](../task-manager.html) (header and modal CSS in `<style>`).

---

## Implementation status (February 2026)

**Implemented:**
- **1.1** Visible “Project” label, `.header-project-select` styling, `aria-label="Switch project"`
- **1.2** Grouped header: `.header-actions` → `.header-project-group` (label + select + ✏️/🗑️) and `.header-buttons` (Settings, Folder, ➕ Task); gap 1.5rem between groups
- **1.3** Explicit `</header>` and correct structure
- **2** Header CSS: project block, `.header-actions` / `.header-buttons`, responsive media queries (900px, 480px)
- **3.1** Filter bar: `.filter-bar-inner` max-width 1400px, padding 0 2rem; muted filter labels
- **3.2** `aria-label` on icon-only header buttons (Rename, Delete, Settings, Folder, New task, Clear search)

**Modals (beyond original doc):** New Task, Task detail, and Settings modals now use fixed height (90vh), body-only scroll, backdrop click to close, and body scroll lock when open.

**Not implemented (lower priority):**
- **3.3** Focus trap and initial focus in modals
- **3.4** Stronger column separation (optional)

---

## 1. Top bar / header

### 1.1 Project selector does not read as a dropdown

**Current:** The project switcher is a plain `<select id="projectSelector">` with no label. It uses the same global `select` styling (chevron on the right). When visible it sits between “⚙️ Settings” and the ✏️/🗑️ buttons, so it’s easy to miss or not recognize as “switch project.”

**Recommendations:**

- **Add a visible label** so it’s clear what the control is:
  - Option A: A `<label>` before the select, e.g. “Project:” (can be visually de-emphasized).
  - Option B: A wrapper with a small label above the select, e.g. “Current project” (stacked).
  - Option C: Use a **combined control**: e.g. “📁 Project” as a left-aligned label or icon + the select, in a single bordered container so it reads as one “project switcher” block.
- **Make the select look like a primary header control**, not a form field:
  - Give `#projectSelector` (or a wrapper) a dedicated class, e.g. `.header-project-select`.
  - Slightly larger tap target (e.g. `min-height: 40px`), padding to match header buttons, and a clear border/background so it reads as “this is the current project and you can change it.”
- **Optional:** Add `aria-label="Switch project"` and, if you add a visible label, associate it with the select (e.g. `label for="projectSelector"`).

### 1.2 Buttons feel “smushed” to the right

**Current:** `.header-content` uses `display: flex; justify-content: space-between;`. So you get:

- Left: title (📋 Task Manager + version).
- Right: one flex group with `gap: 0.75rem` containing Settings, project select, rename, delete, Folder, ➕ Task.

Everything on the right is in a single row with no grouping, so it reads as one dense block and can feel cramped, especially with many projects (long select) or on smaller screens.

**Recommendations:**

- **Group controls logically** so the bar has a clear structure instead of “title | pile of controls”:
  - **Group 1 – App identity:** Title + optional version (unchanged).
  - **Group 2 – Project:** Project label + `#projectSelector` + optional ✏️/🗑️ (clearly “current project”).
  - **Group 3 – Actions:** Settings, Folder, ➕ Task (and any other primary actions).
- **Layout options:**
  - **A. Two zones:** “Title” (left) and “Project + Actions” (right), with **internal spacing** inside the right zone: e.g. more space (or a subtle divider) between “project” and “actions” so it’s “project stuff | action buttons.”
  - **B. Three zones:** “Title” | “Project (label + select + ✏️/🗑️)” | “Settings, Folder, ➕ Task,” with consistent gaps between zones (e.g. `gap: 1.5rem` or `2rem` between groups).
- **Spacing:** Increase gap between the **groups** (e.g. between project block and action buttons) more than the gap between items inside a group (e.g. between ✏️ and 🗑️). That reduces the “smushed” feeling without changing behavior.

### 1.3 Header HTML structure

**Current:** The header has a flex div that closes correctly, but there is **no closing `</header>`** (only `</div></div>`). The next element is the filter bar. Relying on the parser to close `<header>` is fragile and can affect accessibility and styling.

**Recommendation:** Add an explicit `</header>` after the inner `</div>` so the structure is:

```html
<header class="header">
  <div class="header-content">...</div>
</header>
```

---

## 2. Header-specific CSS changes (concrete)

- **Project select / project block**
  - Add a class for the project area, e.g. `.header-project` or `.header-project-select`.
  - Set a comfortable **min-height** (e.g. 40px) and **padding** so it matches button height and is easy to tap.
  - Use the same border-radius as `.btn` (e.g. 8px) so it feels part of the header family.
  - Ensure the dropdown chevron is clearly visible (existing `select` rules apply; if needed, increase padding-right so the icon doesn’t touch the text).
- **Right-side layout**
  - Replace the single inline `style="display: flex; gap: 0.75rem; ..."` with a **class** (e.g. `.header-actions`) so you can:
    - Use a slightly larger gap between **groups** (e.g. `1.25rem` or `1.5rem`) via wrapper divs or `column-gap`/extra margin.
    - Add `flex-wrap: wrap` and a `min-height` so on narrow viewports the header doesn’t clip or overflow awkwardly.
- **Responsive**
  - Add a **media query for the header** (e.g. `max-width: 768px` or `900px`):
    - Allow the right-side flex to wrap so project + buttons can move to a second row if needed.
    - Optionally reduce title font size or shorten “Task Manager” to “Tasks” on very small screens.
    - Ensure the project select remains usable (min-width or full width when wrapped).

---

## 3. Other UI/UX areas

### 3.1 Filter bar

- Filter bar uses a different `max-width` (1200px) than the header (1400px). Aligning them (e.g. same `max-width` and horizontal padding as `.header-content`) will make the layout feel consistent.
- Labels (“Tags:”, “Category:”, etc.) could use a consistent, slightly muted style (e.g. `color: var(--text-secondary)` and `font-size: 0.9rem`) so they don’t compete with the selects.

### 3.2 Buttons and icon-only actions

- ✏️ and 🗑️ in the header are icon-only. They already have `title` attributes; ensure they have **`aria-label`** (e.g. “Rename project”, “Remove project from list”) for screen readers.
- Consider giving them a **consistent size** (e.g. same min-width/height as “⚙️ Settings”) so the header doesn’t look uneven.

### 3.3 Modals and forms

- Modal headers and form sections are generally clear. One improvement: ensure **focus is moved into the modal** when it opens (e.g. first focusable element or the modal container with `tabindex="-1"`) and **trapped** while open (keyboard nav). You already have Escape to close; focus management would complete the pattern.

### 3.4 Kanban and task cards

- Column and card styling are in good shape. If users report “everything looks the same,” consider a **slightly stronger visual separation** between columns (e.g. border or background contrast) or a thin divider between the header actions and the main content.

---

## 4. Priority summary

| Priority | Item | Effort |
|----------|------|--------|
| High | Add a visible “Project” label or combined project control so the dropdown is recognizable | Low |
| High | Fix missing `</header>` and give the right-side block a class + grouped layout (project vs actions) with better spacing | Low |
| High | Make project select match header height and style (min-height, padding, border-radius) | Low |
| Medium | Responsive header: flex-wrap, optional smaller title, so controls don’t feel smushed on small screens | Low–Medium |
| Medium | Align filter bar width/padding with header; add aria-labels for icon-only header buttons | Low |
| Lower | Focus trap and initial focus in modals; stronger column separation if needed | Medium |

---

## 5. Suggested header structure (sketch)

```text
<header class="header">
  <div class="header-content">
    <h1 id="headerTitle">...</h1>
    <div class="header-actions">
      <div class="header-project-group">
        <label for="projectSelector" class="header-project-label">Project</label>
        <select id="projectSelector" class="header-project-select" aria-label="Switch project">...</select>
        <button id="renameProjectBtn" ...>✏️</button>
        <button id="deleteProjectBtn" ...>🗑️</button>
      </div>
      <div class="header-buttons">
        <button id="settingsBtn" ...>⚙️ Settings</button>
        <button id="selectFolderBtn" ...>📁 Folder</button>
        <button id="newTaskBtn" ...>➕ Task</button>
      </div>
    </div>
  </div>
</header>
```

- `.header-actions`: flex, `align-items: center`, `gap: 1.5rem` (or margin between the two inner divs) so “project” and “buttons” are clearly separated.
- `.header-project-group`: flex, small gap, optional wrap; label can be `visually-hidden` or a short “Project” text.
- `.header-buttons`: flex, `gap: 0.75rem`, same as today.

This keeps the same behavior while making the project dropdown obvious and reducing the “smushed” feel of the top bar.
