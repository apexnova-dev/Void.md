# Security Policy

## Reporting Security Vulnerabilities

The Void.md project takes security seriously. If you discover a security vulnerability, please report it responsibly.

### How to Report

1. **Do NOT** create a public GitHub issue for security vulnerabilities
2. Email the maintainer directly with details of the vulnerability
3. Include the following information:
   - Description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact assessment
   - Any suggested fixes (if available)

### Response Timeline

- Acknowledgment: Within 48 hours
- Initial assessment: Within 7 days
- Resolution timeline: Dependent on severity and complexity

---

## Supported Versions

The following versions of Void.md receive security updates:

| Version | Supported          | Notes                                    |
| ------- | ------------------ | ---------------------------------------- |
| 1.3.x   | :white_check_mark: | Current stable release                  |
| 1.2.x   | :warning:         | Security updates only                   |
| 1.1.x   | :x:               | No longer supported                      |
| < 1.1   | :x:               | No longer supported                     |

---

## Known Limitations

### Browser Requirements

Void.md requires the **File System Access API** for full functionality (reading/writing Markdown files directly to your local filesystem).

**Supported Browsers:**
- Google Chrome 86+
- Microsoft Edge 86+
- Opera 72+

**Unsupported Browsers:**
- Firefox — Does not support the File System Access API
- Safari — Limited or no support for the File System Access API

When using an unsupported browser, Void.md falls back to localStorage, which limits functionality and data persistence.

### File System Access API

The File System Access API requires:
- User gesture to trigger folder selection
- Explicit permission grant from the user for each directory
- Permission may be revoked by the browser at any time

---

## Data Handling

### Local-Only Architecture

Void.md is designed as a **local-first** application with **no cloud dependencies**:

- **No cloud sync**: All data remains on your local filesystem
- **No telemetry**: Optional, disabled by default
- **No external API calls**: All operations run locally in your browser
- **No authentication required**: No user accounts or login systems

### Data Storage

Data is stored in:
1. **Your Markdown files** (`kanban.md`, `archive.md`) — user-selected directory
2. **Browser localStorage** — for preferences and fallback data
3. **Browser IndexedDB** — for project metadata

### Data Sovereignty

- Your task data lives wherever you store your Markdown files
- You have full control over data location and backup
- Air-gapped workflows are fully supported
- Git-friendly task history through plaintext files

---

## Browser Security Considerations

### Same-Origin Policy

Void.md operates under the browser's same-origin policy:
- No cross-origin requests are made
- All file operations use the File System Access API within your authorized directory
- No content is loaded from external domains

### Content Security Policy

As a standalone HTML file, Void.md:
- Contains no external script dependencies
- Has no inline script blocking concerns (all scripts are embedded)
- Uses no external fonts or stylesheets

### User Permissions

The application requires:
- **File system read/write** access to a user-selected directory (via File System Access API)
- **LocalStorage** access for preferences
- **IndexedDB** access for project management

---

## Security Best Practices for Users

### Operating Environment

1. **Use a modern, updated browser** — Chrome, Edge, or Opera with automatic updates
2. **Review folder permissions** — Only grant access to directories containing your task files
3. **Regular backups** — Since data is local, maintain regular backups of your Markdown files

### Code Execution

- Void.md is a single HTML file with embedded JavaScript
- No plugins or extensions required
- No eval() or dynamic code execution
- All code is visible and auditable in the source

### Data Hygiene

- Do not store sensitive credentials in task titles or descriptions
- Be mindful of what you write in task notes if sharing your screen
- Clear browser data if using shared or public computers

---

## Third-Party Dependencies

Void.md does NOT include:
- No npm dependencies
- No external CDN links
- No bundled libraries (except optional Tiptap for rich text editing, loaded via CDN with user consent)

### Tiptap Editor (Optional)

When the rich text editor feature is enabled, Tiptap is loaded from jsDelivr CDN:
- CDN: `https://cdn.jsdelivr.net/npm/@tiptap/...`
- Only loaded if user enables the feature in Settings
- Can be disabled to achieve complete offline operation

---

## Vulnerability Disclosure History

| Date       | Issue                                  | Status    |
|------------|----------------------------------------|-----------|
| None yet   | No vulnerabilities reported to date  | —         |

---

## Contact

For security concerns not appropriate for public disclosure, please contact the project maintainer directly through the repository.

---

*Last updated: April 2026*  
*Version: 1.3.2*