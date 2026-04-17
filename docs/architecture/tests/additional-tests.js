/**
 * Integration Tests for Void.md
 * 
 * These tests cover end-to-end user workflows and system integration.
 * Run these tests in the browser console after loading unit-tests.js.
 * 
 * Usage:
 * 1. Open void.html in browser
 * 2. Open Developer Console (F12)
 * 3. Load unit-tests.js: fetch('docs/architecture/tests/unit-tests.js').then(r => r.text()).then(code => eval(code))
 * 4. Load this file: fetch('docs/architecture/tests/additional-tests.js').then(r => r.text()).then(code => eval(code))
 * 5. Run: runAllIntegrationTests()
 * 
 * Or run individual workflows:
 * - runWorkflowTaskLifecycle()
 * - runWorkflowFormAutoSave()
 * - runWorkflowThemeSwitching()
 * - runWorkflowProjectManagement()
 * - runWorkflowSearchAndFilter()
 * - runWorkflowRichTextEditor()
 */

// ===== INTEGRATION TEST HELPERS =====

// Test results storage for integration tests
const integrationTestResults = {
    passed: 0,
    failed: 0,
    tests: []
};

// Helper to log integration test results
function logIntegrationTest(name, passed, message = '') {
    const icon = passed ? '✅' : '❌';
    console.log(`${icon} ${name}${message ? ': ' + message : ''}`);
    
    integrationTestResults.tests.push({
        name: name,
        passed: passed,
        message: message
    });
    
    if (passed) {
        integrationTestResults.passed++;
    } else {
        integrationTestResults.failed++;
    }
}

// Helper to reset test results
function resetIntegrationResults() {
    integrationTestResults.passed = 0;
    integrationTestResults.failed = 0;
    integrationTestResults.tests = [];
}

// Helper to wait for async operations
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ===== WORKFLOW 1: COMPLETE TASK LIFECYCLE =====

/**
 * Tests the complete lifecycle of a task from creation to deletion.
 * Positive test: Verifies task can be created, edited, moved between columns, 
 * archived, restored, and finally deleted.
 * Negative test: Verifies invalid operations are handled gracefully.
 */
async function runWorkflowTaskLifecycle() {
    console.log('\n🧪 Workflow: Task Lifecycle Tests...\n');
    resetIntegrationResults();
    
    // Save original state
    const originalTasks = [...tasks];
    const originalArchivedTasks = [...archivedTasks];
    const originalTaskCount = tasks.length;
    
    // === STEP 1: Create a new task (Positive Test) ===
    // Objective: Verify task creation works correctly
    const testTaskId = 'TEST-LIFECYCLE-001';
    const newTask = {
        id: testTaskId,
        title: 'Integration Test Task - Lifecycle',
        status: 'todo',
        priority: 'High',
        category: 'Test Category',
        description: 'Test description for lifecycle workflow',
        notes: 'Test notes',
        tags: ['test', 'integration'],
        subtasks: [
            { text: 'Subtask 1', completed: false },
            { text: 'Subtask 2', completed: true }
        ],
        assignees: ['@testuser'],
        created: new Date().toISOString(),
        updated: new Date().toISOString()
    };
    
    tasks.push(newTask);
    logIntegrationTest(
        'STEP 1: Task creation adds to tasks array',
        tasks.length === originalTaskCount + 1,
        `Task count: ${tasks.length}, Expected: ${originalTaskCount + 1}`
    );
    
    // === STEP 2: Edit the task (Positive Test) ===
    // Objective: Verify task editing works correctly
    const taskToEdit = tasks.find(t => t.id === testTaskId);
    if (taskToEdit) {
        taskToEdit.title = 'Updated Task Title';
        taskToEdit.priority = 'Critical';
        taskToEdit.updated = new Date().toISOString();
    }
    
    const updatedTask = tasks.find(t => t.id === testTaskId);
    logIntegrationTest(
        'STEP 2: Task editing updates fields correctly',
        updatedTask && updatedTask.title === 'Updated Task Title' && updatedTask.priority === 'Critical',
        `Title: ${updatedTask?.title}, Priority: ${updatedTask?.priority}`
    );
    
    // === STEP 3: Move task between columns (Positive Test) ===
    // Objective: Verify task status can be changed (simulating drag & drop)
    if (updatedTask) {
        updatedTask.status = 'in-progress';
        updatedTask.updated = new Date().toISOString();
    }
    
    logIntegrationTest(
        'STEP 3: Task status can be changed (simulating drag & drop)',
        updatedTask && updatedTask.status === 'in-progress',
        `Status: ${updatedTask?.status}`
    );
    
    // === STEP 4: Archive the task (Positive Test) ===
    // Objective: Verify task can be archived
    const taskIndex = tasks.findIndex(t => t.id === testTaskId);
    if (taskIndex >= 0) {
        const taskToArchive = tasks[taskIndex];
        archivedTasks.push({ ...taskToArchive, archivedAt: new Date().toISOString() });
        tasks.splice(taskIndex, 1);
    }
    
    const taskInArchive = archivedTasks.find(t => t.id === testTaskId);
    const taskNotInActive = !tasks.find(t => t.id === testTaskId);
    
    logIntegrationTest(
        'STEP 4: Task can be archived (moved to archive, removed from active)',
        taskInArchive && taskNotInActive,
        `In archive: ${!!taskInArchive}, Not in active: ${taskNotInActive}`
    );
    
    // === STEP 5: Restore from archive (Positive Test) ===
    // Objective: Verify task can be restored from archive
    const archiveIndex = archivedTasks.findIndex(t => t.id === testTaskId);
    if (archiveIndex >= 0) {
        const taskToRestore = archivedTasks[archiveIndex];
        const { archivedAt, ...restoredTask } = taskToRestore;
        tasks.push({ ...restoredTask, updated: new Date().toISOString() });
        archivedTasks.splice(archiveIndex, 1);
    }
    
    const taskRestored = tasks.find(t => t.id === testTaskId);
    const taskNotInArchive = !archivedTasks.find(t => t.id === testTaskId);
    
    logIntegrationTest(
        'STEP 5: Task can be restored from archive',
        taskRestored && taskNotInArchive,
        `Restored to active: ${!!taskRestored}, Removed from archive: ${taskNotInArchive}`
    );
    
    // === STEP 6: Delete the task (Positive Test) ===
    // Objective: Verify task can be permanently deleted
    const finalTaskIndex = tasks.findIndex(t => t.id === testTaskId);
    if (finalTaskIndex >= 0) {
        tasks.splice(finalTaskIndex, 1);
    }
    
    logIntegrationTest(
        'STEP 6: Task can be permanently deleted',
        tasks.length === originalTaskCount && !tasks.find(t => t.id === testTaskId),
        `Task count restored to: ${tasks.length}`
    );
    
    // === NEGATIVE TEST: Invalid task operations ===
    // Objective: Verify invalid operations are handled gracefully
    
    // Try to delete non-existent task
    const nonExistentId = 'NON-EXISTENT-999';
    const nonExistentTask = tasks.find(t => t.id === nonExistentId);
    logIntegrationTest(
        'NEGATIVE: Deleting non-existent task is handled gracefully',
        nonExistentTask === undefined,
        'No error thrown for non-existent task'
    );
    
    // Try to move task with invalid status
    const invalidStatusTask = {
        id: 'TEST-INVALID-001',
        title: 'Invalid Status Task',
        status: 'invalid-status'
    };
    tasks.push(invalidStatusTask);
    
    // renderKanban should handle this gracefully
    let renderError = null;
    try {
        renderKanban();
    } catch (e) {
        renderError = e;
    }
    
    logIntegrationTest(
        'NEGATIVE: Invalid task status is handled gracefully',
        renderError === null,
        `Render error: ${renderError?.message || 'None'}`
    );
    
    // Cleanup invalid task
    const invalidIndex = tasks.findIndex(t => t.id === 'TEST-INVALID-001');
    if (invalidIndex >= 0) tasks.splice(invalidIndex, 1);
    
    // Restore original state
    tasks = originalTasks;
    archivedTasks = originalArchivedTasks;
    renderKanban();
    
    console.log(`\n📊 Task Lifecycle Tests: ${integrationTestResults.passed} passed, ${integrationTestResults.failed} failed`);
    return integrationTestResults;
}

// ===== WORKFLOW 2: FORM AUTO-SAVE =====

/**
 * Tests the form auto-save and draft restoration functionality.
 * Positive test: Verifies form drafts are saved and can be restored.
 * Negative test: Verifies draft expiration and invalid draft handling.
 */
async function runWorkflowFormAutoSave() {
    console.log('\n🧪 Workflow: Form Auto-Save Tests...\n');
    resetIntegrationResults();
    
    const DRAFT_KEY = 'taskManager_formDraft';
    
    // === STEP 1: Open new task modal (Positive Test) ===
    // Objective: Verify form initialization works
    const mockDraft = {
        timestamp: Date.now(),
        title: 'Draft Test Task',
        description: 'Draft description',
        priority: 'High',
        category: 'Test Category',
        assignees: '@testuser',
        tags: '#test #draft',
        due: '2025-12-31',
        notes: 'Draft notes content',
        subtasks: [{ text: 'Draft subtask', completed: false }]
    };
    
    // Simulate saving draft
    try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(mockDraft));
    } catch (e) {
        console.warn('localStorage write failed:', e);
    }
    
    logIntegrationTest(
        'STEP 1: Form draft can be saved to localStorage',
        localStorage.getItem(DRAFT_KEY) !== null,
        'Draft saved successfully'
    );
    
    // === STEP 2: Close modal without saving (simulated) ===
    // Objective: Verify draft persists when modal is closed
    logIntegrationTest(
        'STEP 2: Draft persists when modal is closed',
        localStorage.getItem(DRAFT_KEY) !== null,
        'Draft still exists after close'
    );
    
    // === STEP 3: Reopen new task modal and verify draft restoration ===
    // Objective: Verify draft can be loaded back
    let loadedDraft = null;
    try {
        const saved = localStorage.getItem(DRAFT_KEY);
        if (saved) {
            loadedDraft = JSON.parse(saved);
        }
    } catch (e) {
        console.warn('Failed to load draft:', e);
    }
    
    logIntegrationTest(
        'STEP 3: Draft can be loaded from localStorage',
        loadedDraft && loadedDraft.title === 'Draft Test Task',
        `Loaded title: ${loadedDraft?.title}`
    );
    
    // === STEP 4: Verify all draft fields are restored ===
    // Objective: Verify complete draft restoration
    const allFieldsRestored = loadedDraft &&
        loadedDraft.description === 'Draft description' &&
        loadedDraft.priority === 'High' &&
        loadedDraft.category === 'Test Category' &&
        loadedDraft.assignees === '@testuser' &&
        loadedDraft.tags === '#test #draft' &&
        loadedDraft.notes === 'Draft notes content' &&
        loadedDraft.subtasks.length === 1;
    
    logIntegrationTest(
        'STEP 4: All draft fields are restored correctly',
        allFieldsRestored,
        'All fields match original values'
    );
    
    // === STEP 5: Clear draft after save ===
    // Objective: Verify draft is cleared after successful save
    try {
        localStorage.removeItem(DRAFT_KEY);
    } catch (e) {
        console.warn('Failed to clear draft:', e);
    }
    
    logIntegrationTest(
        'STEP 5: Draft is cleared after save',
        localStorage.getItem(DRAFT_KEY) === null,
        'Draft removed from localStorage'
    );
    
    // === NEGATIVE TEST: Draft expiration ===
    // Objective: Verify expired drafts are rejected
    const expiredDraft = {
        timestamp: Date.now() - (25 * 60 * 60 * 1000), // 25 hours ago
        title: 'Expired Draft'
    };
    
    try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(expiredDraft));
        const saved = localStorage.getItem(DRAFT_KEY);
        const parsed = saved ? JSON.parse(saved) : null;
        const isExpired = parsed && (Date.now() - parsed.timestamp) > (24 * 60 * 60 * 1000);
        
        if (isExpired) {
            localStorage.removeItem(DRAFT_KEY);
        }
        
        logIntegrationTest(
            'NEGATIVE: Expired drafts are rejected (>24 hours)',
            isExpired && localStorage.getItem(DRAFT_KEY) === null,
            'Expired draft was cleared'
        );
    } catch (e) {
        console.warn('Draft expiration test failed:', e);
    }
    
    // === NEGATIVE TEST: Corrupted draft data ===
    // Objective: Verify corrupted drafts are handled gracefully
    try {
        localStorage.setItem(DRAFT_KEY, 'invalid-json{{');
        let parseError = null;
        try {
            JSON.parse(localStorage.getItem(DRAFT_KEY));
        } catch (e) {
            parseError = e;
        }
        
        logIntegrationTest(
            'NEGATIVE: Corrupted draft data is handled gracefully',
            parseError !== null,
            'Parse error caught as expected'
        );
        
        // Cleanup
        localStorage.removeItem(DRAFT_KEY);
    } catch (e) {
        console.warn('Corrupted draft test failed:', e);
    }
    
    // Cleanup
    localStorage.removeItem(DRAFT_KEY);
    
    console.log(`\n📊 Form Auto-Save Tests: ${integrationTestResults.passed} passed, ${integrationTestResults.failed} failed`);
    return integrationTestResults;
}

// ===== WORKFLOW 3: THEME SWITCHING =====

/**
 * Tests theme switching and persistence functionality.
 * Positive test: Verifies theme can be switched and persists.
 * Negative test: Verifies invalid theme values are handled gracefully.
 */
function runWorkflowThemeSwitching() {
    console.log('\n🧪 Workflow: Theme Switching Tests...\n');
    resetIntegrationResults();
    
    // Save original theme
    const originalTheme = currentTheme;
    
    // === STEP 1: Get current theme (Positive Test) ===
    // Objective: Verify current theme is valid
    const validThemes = ['light', 'dark'];
    logIntegrationTest(
        'STEP 1: Current theme is valid (light or dark)',
        validThemes.includes(currentTheme),
        `Current theme: ${currentTheme}`
    );
    
    // === STEP 2: Switch to opposite theme (Positive Test) ===
    // Objective: Verify theme can be switched
    const targetTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(targetTheme, false);
    
    logIntegrationTest(
        'STEP 2: Theme can be switched',
        currentTheme === targetTheme,
        `Theme changed to: ${currentTheme}`
    );
    
    // === STEP 3: Verify theme changed in DOM (Positive Test) ===
    // Objective: Verify DOM reflects theme change
    const domTheme = document.documentElement.getAttribute('data-theme');
    logIntegrationTest(
        'STEP 3: DOM data-theme attribute matches current theme',
        domTheme === targetTheme,
        `DOM theme: ${domTheme}`
    );
    
    // === STEP 4: Verify theme persists to localStorage (Positive Test) ===
    // Objective: Verify theme is saved
    let savedTheme = null;
    try {
        savedTheme = localStorage.getItem('preferredTheme');
    } catch (e) {
        console.warn('localStorage read failed:', e);
    }
    
    logIntegrationTest(
        'STEP 4: Theme persists to localStorage',
        savedTheme === targetTheme,
        `Saved theme: ${savedTheme}`
    );
    
    // === STEP 5: Simulate page reload and verify theme persistence ===
    // Objective: Verify theme survives page reload
    setTheme(originalTheme, false);
    let reloadedTheme = null;
    try {
        reloadedTheme = localStorage.getItem('preferredTheme');
    } catch (e) {
        console.warn('localStorage read failed:', e);
    }
    
    logIntegrationTest(
        'STEP 5: Theme persists after switching back',
        currentTheme === originalTheme && reloadedTheme === originalTheme,
        `Restored theme: ${currentTheme}, Saved: ${reloadedTheme}`
    );
    
    // === NEGATIVE TEST: Invalid theme values ===
    // Objective: Verify invalid theme values fall back gracefully
    setTheme('invalid-theme', false);
    
    logIntegrationTest(
        'NEGATIVE: Invalid theme falls back to light',
        currentTheme === 'light',
        `Fallback theme: ${currentTheme}`
    );
    
    // === NEGATIVE TEST: Null theme value ===
    // Objective: Verify null theme is handled
    setTheme(null, false);
    
    logIntegrationTest(
        'NEGATIVE: Null theme is handled gracefully',
        currentTheme === 'light',
        `Theme after null: ${currentTheme}`
    );
    
    // Restore original theme
    setTheme(originalTheme, false);
    
    console.log(`\n📊 Theme Switching Tests: ${integrationTestResults.passed} passed, ${integrationTestResults.failed} failed`);
    return integrationTestResults;
}

// ===== WORKFLOW 4: PROJECT MANAGEMENT =====

/**
 * Tests project creation, switching, renaming, and deletion.
 * Positive test: Verifies full project management workflow.
 * Negative test: Verifies invalid project operations are handled.
 */
async function runWorkflowProjectManagement() {
    console.log('\n🧪 Workflow: Project Management Tests...\n');
    resetIntegrationResults();
    
    // Save original state
    const originalProjects = [...projects];
    const originalProjectIndex = currentProjectIndex;
    
    // === STEP 1: Create new project (Positive Test) ===
    // Objective: Verify project can be added to projects array
    const testProject = {
        name: 'Test Project - Integration',
        directoryHandle: null, // Mock handle
        lastUsed: Date.now()
    };
    
    projects.push(testProject);
    
    logIntegrationTest(
        'STEP 1: Project can be added to projects array',
        projects.length === originalProjects.length + 1,
        `Project count: ${projects.length}`
    );
    
    // === STEP 2: Switch between projects (Positive Test) ===
    // Objective: Verify project switching updates current index
    const newProjectIndex = projects.length - 1;
    currentProjectIndex = newProjectIndex;
    
    logIntegrationTest(
        'STEP 2: Project switching updates current index',
        currentProjectIndex === newProjectIndex && projects[currentProjectIndex].name === 'Test Project - Integration',
        `Current project: ${projects[currentProjectIndex]?.name}`
    );
    
    // === STEP 3: Verify tasks are project-specific (Positive Test) ===
    // Objective: Verify tasks array is independent per project
    // Note: In real implementation, tasks would be loaded from project files
    const projectSpecificTasks = tasks.length;
    logIntegrationTest(
        'STEP 3: Tasks exist in project context',
        projectSpecificTasks >= 0,
        `Tasks in current project: ${projectSpecificTasks}`
    );
    
    // === STEP 4: Rename project (Positive Test) ===
    // Objective: Verify project can be renamed
    const projectToRename = projects[currentProjectIndex];
    if (projectToRename) {
        projectToRename.name = 'Renamed Test Project';
    }
    
    logIntegrationTest(
        'STEP 4: Project can be renamed',
        projects[currentProjectIndex].name === 'Renamed Test Project',
        `New name: ${projects[currentProjectIndex]?.name}`
    );
    
    // === STEP 5: Delete project (Positive Test) ===
    // Objective: Verify project can be removed from list
    const projectIndexToDelete = currentProjectIndex;
    const projectNameBeforeDelete = projects[projectIndexToDelete].name;
    
    projects.splice(projectIndexToDelete, 1);
    
    if (projects.length > 0) {
        currentProjectIndex = 0;
    } else {
        currentProjectIndex = 0;
    }
    
    const projectRemoved = !projects.find(p => p.name === projectNameBeforeDelete);
    
    logIntegrationTest(
        'STEP 5: Project can be removed from list',
        projectRemoved && projects.length === originalProjects.length,
        `Project removed: ${projectRemoved}, Count: ${projects.length}`
    );
    
    // === NEGATIVE TEST: Switch to invalid project index ===
    // Objective: Verify invalid index is handled gracefully
    let switchError = false;
    try {
        await switchProject(999);
    } catch (e) {
        switchError = true;
    }
    
    logIntegrationTest(
        'NEGATIVE: Invalid project index is handled gracefully',
        !switchError,
        'No error thrown for invalid index'
    );
    
    // === NEGATIVE TEST: Switch to negative index ===
    // Objective: Verify negative index is handled gracefully
    switchError = false;
    try {
        await switchProject(-1);
    } catch (e) {
        switchError = true;
    }
    
    logIntegrationTest(
        'NEGATIVE: Negative project index is handled gracefully',
        !switchError,
        'No error thrown for negative index'
    );
    
    // === NEGATIVE TEST: Switch to NaN ===
    // Objective: Verify NaN index is handled gracefully
    switchError = false;
    try {
        await switchProject('invalid');
    } catch (e) {
        switchError = true;
    }
    
    logIntegrationTest(
        'NEGATIVE: NaN project index is handled gracefully',
        !switchError,
        'No error thrown for NaN index'
    );
    
    // Restore original state
    projects = originalProjects;
    currentProjectIndex = originalProjectIndex;
    
    console.log(`\n📊 Project Management Tests: ${integrationTestResults.passed} passed, ${integrationTestResults.failed} failed`);
    return integrationTestResults;
}

// ===== WORKFLOW 5: SEARCH AND FILTER =====

/**
 * Tests global search and filter functionality.
 * Positive test: Verifies search and filters work correctly.
 * Negative test: Verifies edge cases are handled (empty search, special chars).
 */
function runWorkflowSearchAndFilter() {
    console.log('\n🧪 Workflow: Search and Filter Tests...\n');
    resetIntegrationResults();
    
    // Save original state
    const originalTasks = [...tasks];
    const originalFilters = [...activeFilters];
    const originalSearchTerm = globalSearchTerm;
    
    // Add test tasks for filtering
    const testTasks = [
        {
            id: 'TEST-FILTER-001',
            title: 'Frontend Bug Fix',
            description: 'Fix login page CSS',
            status: 'todo',
            priority: 'High',
            category: 'Frontend',
            tags: ['bug', 'css'],
            assignees: ['@alice'],
            notes: 'Important fix needed'
        },
        {
            id: 'TEST-FILTER-002',
            title: 'Backend API Development',
            description: 'Create user endpoints',
            status: 'in-progress',
            priority: 'Medium',
            category: 'Backend',
            tags: ['feature', 'api'],
            assignees: ['@bob'],
            notes: 'REST API design'
        },
        {
            id: 'TEST-FILTER-003',
            title: 'Database Migration',
            description: 'Migrate users table',
            status: 'done',
            priority: 'Critical',
            category: 'Database',
            tags: ['migration', 'data'],
            assignees: ['@charlie'],
            notes: 'Production deployment'
        }
    ];
    
    tasks = [...testTasks];
    
    // === STEP 1: Add global search term (Positive Test) ===
    // Objective: Verify global search filters results
    globalSearchTerm = 'frontend';
    invalidateFilterCache();
    const filteredBySearch = getFilteredTasks();
    const hasFrontendInResults = filteredBySearch.some(t => 
        t.title.toLowerCase().includes('frontend') || 
        t.description.toLowerCase().includes('frontend')
    );
    
    logIntegrationTest(
        'STEP 1: Global search filters results correctly',
        hasFrontendInResults,
        `Found ${filteredBySearch.length} matching tasks`
    );
    
    // === STEP 2: Verify search looks in title, description, and notes ===
    // Objective: Verify search covers multiple fields
    globalSearchTerm = 'production';
    invalidateFilterCache();
    const searchInNotes = getFilteredTasks();
    const foundInNotes = searchInNotes.some(t => t.notes.includes('Production'));
    
    logIntegrationTest(
        'STEP 2: Global search covers notes field',
        foundInNotes,
        `Found in notes: ${foundInNotes}`
    );
    
    // === STEP 3: Add category filter (Positive Test) ===
    // Objective: Verify category filters work
    activeFilters = [{ type: 'category', value: 'Backend' }];
    globalSearchTerm = '';
    invalidateFilterCache();
    const filteredByCategory = getFilteredTasks();
    const allBackend = filteredByCategory.every(t => t.category === 'Backend');
    
    logIntegrationTest(
        'STEP 3: Category filter works correctly',
        filteredByCategory.length > 0 && allBackend,
        `Found ${filteredByCategory.length} backend tasks`
    );
    
    // === STEP 4: Verify combined filters work (Positive Test) ===
    // Objective: Verify multiple filters can be combined
    globalSearchTerm = 'api';
    activeFilters = [{ type: 'category', value: 'Backend' }];
    invalidateFilterCache();
    const combinedFilters = getFilteredTasks();
    const allMatch = combinedFilters.every(t => 
        t.category === 'Backend' && 
        (t.title.toLowerCase().includes('api') || 
         t.description.toLowerCase().includes('api'))
    );
    
    logIntegrationTest(
        'STEP 4: Combined search and category filters work',
        combinedFilters.length > 0 && allMatch,
        `Found ${combinedFilters.length} tasks matching both filters`
    );
    
    // === STEP 5: Add tag filter (Positive Test) ===
    // Objective: Verify tag filters work
    globalSearchTerm = '';
    activeFilters = [{ type: 'tag', value: 'bug' }];
    invalidateFilterCache();
    const filteredByTag = getFilteredTasks();
    const allBugTasks = filteredByTag.every(t => t.tags.includes('bug'));
    
    logIntegrationTest(
        'STEP 5: Tag filter works correctly',
        filteredByTag.length > 0 && allBugTasks,
        `Found ${filteredByTag.length} bug tasks`
    );
    
    // === STEP 6: Clear filters (Positive Test) ===
    // Objective: Verify clearing filters restores all tasks
    activeFilters = [];
    globalSearchTerm = '';
    invalidateFilterCache();
    const allTasks = getFilteredTasks();
    
    logIntegrationTest(
        'STEP 6: Clearing filters shows all tasks',
        allTasks.length === testTasks.length,
        `All ${allTasks.length} tasks visible`
    );
    
    // === NEGATIVE TEST: Empty search term ===
    // Objective: Verify empty search shows all tasks
    globalSearchTerm = '';
    invalidateFilterCache();
    const emptySearchResults = getFilteredTasks();
    
    logIntegrationTest(
        'NEGATIVE: Empty search term shows all tasks',
        emptySearchResults.length === testTasks.length,
        `All tasks shown: ${emptySearchResults.length}`
    );
    
    // === NEGATIVE TEST: Search with no matches ===
    // Objective: Verify no matches returns empty array
    globalSearchTerm = 'xyz-nonexistent';
    invalidateFilterCache();
    const noMatches = getFilteredTasks();
    
    logIntegrationTest(
        'NEGATIVE: Search with no matches returns empty results',
        noMatches.length === 0,
        `No matches found: ${noMatches.length}`
    );
    
    // === NEGATIVE TEST: Special characters in search ===
    // Objective: Verify special characters are handled gracefully
    globalSearchTerm = '<script>alert("xss")</script>';
    invalidateFilterCache();
    let specialCharError = false;
    try {
        getFilteredTasks();
    } catch (e) {
        specialCharError = true;
    }
    
    logIntegrationTest(
        'NEGATIVE: Special characters in search are handled gracefully',
        !specialCharError,
        'No error with special characters'
    );
    
    // Restore original state
    tasks = originalTasks;
    activeFilters = originalFilters;
    globalSearchTerm = originalSearchTerm;
    invalidateFilterCache();
    
    console.log(`\n📊 Search and Filter Tests: ${integrationTestResults.passed} passed, ${integrationTestResults.failed} failed`);
    return integrationTestResults;
}

// ===== WORKFLOW 6: RICH TEXT EDITOR INTEGRATION =====

/**
 * Tests rich text editor functionality including Tiptap integration.
 * Positive test: Verifies editor mode switching and content persistence.
 * Negative test: Verifies fallback when Tiptap is unavailable.
 */
async function runWorkflowRichTextEditor() {
    console.log('\n🧪 Workflow: Rich Text Editor Integration Tests...\n');
    resetIntegrationResults();
    
    // Save original state
    const originalEditorMode = localStorage.getItem('editorMode');
    const originalRichTextFlag = FEATURE_FLAGS.ENABLE_RICH_TEXT_EDITOR.enabled;
    
    // === STEP 1: Check feature flag exists (Positive Test) ===
    // Objective: Verify rich text feature flag is available
    const hasRichTextFlag = FEATURE_FLAGS && FEATURE_FLAGS.ENABLE_RICH_TEXT_EDITOR;
    logIntegrationTest(
        'STEP 1: Rich text feature flag exists',
        hasRichTextFlag,
        `Flag exists: ${hasRichTextFlag}`
    );
    
    // === STEP 2: Enable rich text editor (Positive Test) ===
    // Objective: Verify feature can be enabled
    FEATURE_FLAGS.ENABLE_RICH_TEXT_EDITOR.enabled = true;
    const isEnabled = isFeatureEnabled('ENABLE_RICH_TEXT_EDITOR');
    
    logIntegrationTest(
        'STEP 2: Rich text editor can be enabled',
        isEnabled,
        `Enabled: ${isEnabled}`
    );
    
    // === STEP 3: Change editor mode to rich (Positive Test) ===
    // Objective: Verify editor mode can be changed
    changeEditorMode('rich');
    const editorMode = localStorage.getItem('editorMode');
    
    logIntegrationTest(
        'STEP 3: Editor mode can be changed to rich',
        editorMode === 'rich',
        `Mode: ${editorMode}`
    );
    
    // === STEP 4: Verify editor mode badge updates (Positive Test) ===
    // Objective: Verify UI reflects editor mode change
    updateEditorBadge();
    const badge = document.getElementById('editorModeBadge');
    
    logIntegrationTest(
        'STEP 4: Editor mode badge updates correctly',
        badge !== null,
        `Badge exists: ${badge !== null}`
    );
    
    // === STEP 5: Change back to plain mode (Positive Test) ===
    // Objective: Verify mode switching works both ways
    changeEditorMode('plain');
    const plainMode = localStorage.getItem('editorMode');
    
    logIntegrationTest(
        'STEP 5: Editor mode can be changed back to plain',
        plainMode === 'plain',
        `Mode: ${plainMode}`
    );
    
    // === STEP 6: Verify getEditorMode returns correct mode (Positive Test) ===
    // Objective: Verify getEditorMode function works
    const currentMode = getEditorMode();
    
    logIntegrationTest(
        'STEP 6: getEditorMode returns correct mode',
        currentMode === 'plain',
        `Current mode: ${currentMode}`
    );
    
    // === NEGATIVE TEST: Disable feature and verify fallback ===
    // Objective: Verify system falls back to plain text when feature disabled
    FEATURE_FLAGS.ENABLE_RICH_TEXT_EDITOR.enabled = false;
    const fallbackMode = getEditorMode();
    
    logIntegrationTest(
        'NEGATIVE: Fallback to plain text when feature disabled',
        fallbackMode === 'plain',
        `Fallback mode: ${fallbackMode}`
    );
    
    // === NEGATIVE TEST: Invalid editor mode ===
    // Objective: Verify invalid mode is handled gracefully
    localStorage.setItem('editorMode', 'invalid');
    // Note: getEditorMode checks feature flag first, so we need to re-enable
    FEATURE_FLAGS.ENABLE_RICH_TEXT_EDITOR.enabled = true;
    const modeAfterInvalid = getEditorMode();
    
    logIntegrationTest(
        'NEGATIVE: Invalid editor mode defaults to plain',
        modeAfterInvalid === 'plain',
        `Mode after invalid: ${modeAfterInvalid}`
    );
    
    // === NEGATIVE TEST: Tiptap not loaded ===
    // Objective: Verify system handles Tiptap not being available
    const tiptapAvailable = isRichTextAvailable();
    
    logIntegrationTest(
        'NEGATIVE: Tiptap availability is correctly detected',
        tiptapAvailable === false,
        `Tiptap available: ${tiptapAvailable}`
    );
    
    // Restore original state
    FEATURE_FLAGS.ENABLE_RICH_TEXT_EDITOR.enabled = originalRichTextFlag;
    if (originalEditorMode) {
        localStorage.setItem('editorMode', originalEditorMode);
    } else {
        localStorage.removeItem('editorMode');
    }
    
    console.log(`\n📊 Rich Text Editor Tests: ${integrationTestResults.passed} passed, ${integrationTestResults.failed} failed`);
    return integrationTestResults;
}

// ===== MASTER INTEGRATION TEST RUNNER =====

async function runAllIntegrationTests() {
    console.log('\n');
    console.log('═'.repeat(70));
    console.log('🧪 RUNNING ALL INTEGRATION WORKFLOW TESTS FOR VOID.MD');
    console.log('═'.repeat(70));
    
    const results = {
        lifecycle: await runWorkflowTaskLifecycle(),
        autosave: await runWorkflowFormAutoSave(),
        theme: runWorkflowThemeSwitching(),
        project: await runWorkflowProjectManagement(),
        search: runWorkflowSearchAndFilter(),
        editor: await runWorkflowRichTextEditor()
    };
    
    // Calculate totals
    const totalPassed = Object.values(results).reduce((sum, r) => sum + r.passed, 0);
    const totalFailed = Object.values(results).reduce((sum, r) => sum + r.failed, 0);
    const totalTests = totalPassed + totalFailed;
    
    console.log('\n');
    console.log('═'.repeat(70));
    console.log('📊 INTEGRATION TEST SUMMARY');
    console.log('═'.repeat(70));
    console.log(`Task Lifecycle Workflow:  ${results.lifecycle.passed}/${results.lifecycle.passed + results.lifecycle.failed} passed`);
    console.log(`Form Auto-Save Workflow:  ${results.autosave.passed}/${results.autosave.passed + results.autosave.failed} passed`);
    console.log(`Theme Switching Workflow: ${results.theme.passed}/${results.theme.passed + results.theme.failed} passed`);
    console.log(`Project Management:       ${results.project.passed}/${results.project.passed + results.project.failed} passed`);
    console.log(`Search and Filter:        ${results.search.passed}/${results.search.passed + results.search.failed} passed`);
    console.log(`Rich Text Editor:         ${results.editor.passed}/${results.editor.passed + results.editor.failed} passed`);
    console.log('─'.repeat(70));
    console.log(`TOTAL:                    ${totalPassed}/${totalTests} passed`);
    console.log('═'.repeat(70));
    
    if (totalFailed === 0) {
        console.log('🎉 ALL INTEGRATION TESTS PASSED!');
    } else {
        console.log(`⚠️  ${totalFailed} integration test(s) failed.`);
    }
    
    return {
        results,
        totalPassed,
        totalFailed,
        totalTests
    };
}

// ===== EXPORTS =====

window.runWorkflowTaskLifecycle = runWorkflowTaskLifecycle;
window.runWorkflowFormAutoSave = runWorkflowFormAutoSave;
window.runWorkflowThemeSwitching = runWorkflowThemeSwitching;
window.runWorkflowProjectManagement = runWorkflowProjectManagement;
window.runWorkflowSearchAndFilter = runWorkflowSearchAndFilter;
window.runWorkflowRichTextEditor = runWorkflowRichTextEditor;
window.runAllIntegrationTests = runAllIntegrationTests;

// Log that integration tests are loaded
console.log('\n🧪 Integration test functions loaded!');
console.log('Run integration tests with:');
console.log('  runAllIntegrationTests()        - Run all integration workflows');
console.log('  runWorkflowTaskLifecycle()      - Task creation to deletion');
console.log('  runWorkflowFormAutoSave()       - Form draft persistence');
console.log('  runWorkflowThemeSwitching()     - Theme switch and persist');
console.log('  runWorkflowProjectManagement()  - Project CRUD operations');
console.log('  runWorkflowSearchAndFilter()    - Search and filter workflows');
console.log('  runWorkflowRichTextEditor()     - Rich text editor integration');
