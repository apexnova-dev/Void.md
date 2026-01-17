# Project Organization Proposal

## Current State (Messy)

```
MarkdownTaskManager-1.2/
├── task-manager.html          ← THE APP (190KB)
├── AI_WORKFLOW.md
├── CHATGPT.md.exemple
├── CLAUDE.md.exemple
├── CODEIUM.md.exemple
├── COPILOT.md.exemple
├── GEMINI.md.exemple
├── OPENAI_CLI.md.exemple
├── QWEN.md.exemple
├── Documentation for OpenTechnicalWriter.md  ← What is this?
├── session-ses_43f9.md                       ← Session logs
├── README.md
├── readmeFR.md
├── RELEASE_NOTES_v1.1.1.md
├── IMPLEMENTATION_RATIONALE_v1.1.1.md
├── SYSTEM_STATE_v1.1.0.md
├── SESSION_DOCUMENTATION_2026-01-16.md
├── kanban.md                                  ← Example/task file
├── archive.md                                 ← Example task file
├── LICENSE
├── .claude/
│   └── skills/
│       └── markdown-task-manager/
├── docs/
│   └── images/
└── examples/
    ├── kanban.md
    ├── archive.md
    └── README.md
```

---

## Proposed Structure (Clean)

```
MarkdownTaskManager-1.2/
├── task-manager.html          ← THE APP (only file at root!)
│
├── 📁 docs/                   ← User documentation
│   ├── README.md              ← Main user guide
│   ├── readmeFR.md            ← French version
│   ├── AI_WORKFLOW.md         ← AI integration guide
│   ├── kanban.md              ← Template/example
│   ├── archive.md             ← Template/example
│   └── images/                ← Screenshots
│       ├── app-overview.jpg
│       ├── kanban-board.jpg
│       ├── task-modal.jpg
│       ├── filters.jpg
│       └── archives.jpg
│
├── 📁 docs/ai-templates/      ← AI configuration templates
│   ├── CLAUDE.md.exemple
│   ├── CHATGPT.md.exemple
│   ├── COPILOT.md.exemple
│   ├── GEMINI.md.exemple
│   ├── CODEIUM.md.exemple
│   ├── OPENAI_CLI.md.exemple
│   └── QWEN.md.exemple
│
├── 📁 docs/examples/          ← Format examples
│   ├── kanban.md
│   ├── archive.md
│   └── FORMAT.md              ← Detailed format docs (from examples/README.md)
│
├── 📁 docs/changelog/         ← Version history
│   ├── RELEASE_NOTES_v1.1.1.md
│   ├── v1.1.0/
│   │   └── SYSTEM_STATE_v1.1.0.md
│   └── v1.1.1/
│       ├── IMPLEMENTATION_RATIONALE_v1.1.1.md
│       └── SESSION_DOCUMENTATION_2026-01-16.md
│
├── 📁 internal/               ← Development notes (optional, gitignore)
│   ├── session-ses_43f9.md
│   └── Documentation for OpenTechnicalWriter.md
│
└── 📁 .claude/                ← Claude Code skill
    └── skills/
        └── markdown-task-manager/
            ├── SKILL.md
            ├── Continuity_output.md
            └── Debug.md
```

---

## Quick Wins (Easy Changes)

### 1. Group AI Templates
```
mkdir -p docs/ai-templates
mv CHATGPT.md.exemple COPILOT.md.exemple GEMINI.md.exemple \
   CODEIUM.md.exemple OPENAI_CLI.md.exemple QWEN.md.exemple \
   docs/ai-templates/
```

### 2. Group Session/Internal Docs
```
mkdir -p internal
mv "Documentation for OpenTechnicalWriter.md" session-ses_43f9.md internal/
```

### 3. Group Version Docs
```
mkdir -p docs/changelog/v1.1.0
mkdir -p docs/changelog/v1.1.1
mv SYSTEM_STATE_v1.1.0.md docs/changelog/v1.1.0/
mv IMPLEMENTATION_RATIONALE_v1.1.1.md docs/changelog/v1.1.1/
mv SESSION_DOCUMENTATION_2026-01-16.md docs/changelog/v1.1.1/
```

### 4. Move AI_WORKFLOW.md to docs/
```
mv AI_WORKFLOW.md docs/
```

### 5. Move templates to examples/
```
mv examples/kanban.md examples/archive.md docs/examples/
mv examples/README.md docs/examples/FORMAT.md
```

---

## Final Structure After Quick Wins

```
MarkdownTaskManager-1.2/
├── task-manager.html          ← ✅ Only app at root!
│
├── 📁 docs/
│   ├── README.md
│   ├── readmeFR.md
│   ├── AI_WORKFLOW.md
│   ├── kanban.md
│   ├── archive.md
│   ├── images/
│   │   └── (screenshots)
│   ├── ai-templates/
│   │   └── (7 .exemple files)
│   ├── examples/
│   │   ├── kanban.md
│   │   ├── archive.md
│   │   └── FORMAT.md
│   └── changelog/
│       ├── RELEASE_NOTES_v1.1.1.md
│       ├── v1.1.0/
│       │   └── SYSTEM_STATE_v1.1.0.md
│       └── v1.1.1/
│           ├── IMPLEMENTATION_RATIONALE_v1.1.1.md
│           └── SESSION_DOCUMENTATION_2026-01-16.md
│
├── 📁 internal/               ← Optional - gitignore this?
│   ├── Documentation for OpenTechnicalWriter.md
│   └── session-ses_43f9.md
│
├── 📁 .claude/
│   └── skills/
│       └── markdown-task-manager/
│           ├── SKILL.md
│           ├── Continuity_output.md
│           └── Debug.md
│
├── LICENSE
└── kanban.md                  ← Keep for Claude Code skill to find
```

---

## Should You GitIgnore `internal/`?

**Yes**, if it contains sensitive session data:
```bash
# .gitignore
internal/
```

**No**, if you want version history of development notes:
- Keep it at root level or in `docs/development/`

---

## Want Me to Implement These Changes?

I can:
1. ✅ Create the folder structure
2. ✅ Move all files to proper locations
3. ✅ Update any internal paths/references
4. ✅ Create a `.gitignore` if needed

**Approve and I'll reorganize the project for you!**

---

## Why This Structure Works

| Principle | Application |
|-----------|-------------|
| **Single purpose** | `task-manager.html` alone at root |
| **Group by function** | docs/, internal/, .claude/ |
| **User-facing first** | docs/ is first after app |
| **Version isolation** | changelog/ organized by version |
| **Templates together** | ai-templates/ grouped |
| **Examples separated** | examples/ for format docs |
| **Internal isolated** | internal/ for dev notes |
