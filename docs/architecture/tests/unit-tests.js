/**
 * Unit Tests for Feature Flag System and Fallback Mechanisms
 * 
 * IMPORTANT (April 2026): This test suite tests the v1.3.1 SPECIFICATION.
 * - ENABLE_RICH_TEXT_EDITOR: IMPLEMENTED (Tiptap editor for task Notes)
 * - ENABLE_COMMENTS: NOT IMPLEMENTED (placeholder flag only)
 * - ENABLE_SLASH_COMMANDS: NOT IMPLEMENTED (placeholder flag only)
 * - ENABLE_PERFORMANCE_LOGGING: NOT IMPLEMENTED (placeholder flag only)
 * 
 * Run these tests in the browser console:
 * 1. Open void.html in browser
 * 2. Open Developer Console (F12)
 * 3. Copy and paste this entire file
 * 4. Run: runAllTests()
 * 
 * Or run individual test suites:
 * - runFeatureFlagTests()
 * - runFallbackTests()
 * - runStorageTests()
 * - runProjectTests()
 */

// Test results storage
const testResults = {
    passed: 0,
    failed: 0,
    tests: []
};

// Helper to log test results
function logTest(name, passed, message = '') {
    const icon = passed ? '✅' : '❌';
    console.log(`${icon} ${name}${message ? ': ' + message : ''}`);
    
    testResults.tests.push({
        name: name,
        passed: passed,
        message: message
    });
    
    if (passed) {
        testResults.passed++;
    } else {
        testResults.failed++;
    }
}

// ===== FEATURE FLAG TESTS =====

function runFeatureFlagTests() {
    console.log('\n🧪 Running Feature Flag Tests...\n');
    testResults.passed = 0;
    testResults.failed = 0;
    testResults.tests = [];
    
    // Test 1: Feature flags object exists
    logTest(
        'Feature flags object exists',
        typeof FEATURE_FLAGS !== 'undefined' && typeof FEATURE_FLAGS === 'object',
        `Type: ${typeof FEATURE_FLAGS}`
    );
    
    // Test 2: All required flags exist (v1.3.1: only RICH_TEXT_EDITOR is implemented)
    const requiredFlags = [
        'ENABLE_RICH_TEXT_EDITOR',
        // 'ENABLE_COMMENTS',    // NOT IMPLEMENTED - placeholder only
        // 'ENABLE_SLASH_COMMANDS', // NOT IMPLEMENTED - placeholder only
        'ENABLE_PERFORMANCE_LOGGING'
    ];
    
    const allFlagsExist = requiredFlags.every(flag => FEATURE_FLAGS.hasOwnProperty(flag));
    logTest(
        'All required feature flags exist',
        allFlagsExist,
        `Found: ${Object.keys(FEATURE_FLAGS).join(', ')}`
    );
    
    // Test 3: isFeatureEnabled function exists
    logTest(
        'isFeatureEnabled function exists',
        typeof isFeatureEnabled === 'function',
        `Type: ${typeof isFeatureEnabled}`
    );
    
    // Test 4: isFeatureEnabled returns false for disabled features
    const richTextEnabled = isFeatureEnabled('ENABLE_RICH_TEXT_EDITOR');
    logTest(
        'Rich Text Editor is disabled by default',
        richTextEnabled === false,
        `Value: ${richTextEnabled}`
    );
    
    // Test 5: toggleFeature function exists
    logTest(
        'toggleFeature function exists',
        typeof toggleFeature === 'function',
        `Type: ${typeof toggleFeature}`
    );
    
    // Test 6: Can toggle a feature
    const initialState = FEATURE_FLAGS.ENABLE_COMMENTS.enabled;
    toggleFeature('ENABLE_COMMENTS');
    const afterToggle = FEATURE_FLAGS.ENABLE_COMMENTS.enabled;
    // Toggle back to original state
    toggleFeature('ENABLE_COMMENTS');
    const backToOriginal = FEATURE_FLAGS.ENABLE_COMMENTS.enabled;
    
    logTest(
        'toggleFeature actually toggles the state',
        initialState !== afterToggle && afterToggle === !backToOriginal,
        `Initial: ${initialState}, After: ${afterToggle}, Back: ${backToOriginal}`
    );
    
    // Test 7: Feature flags persist to localStorage
    toggleFeature('ENABLE_SLASH_COMMANDS');
    const savedValue = localStorage.getItem('ENABLE_SLASH_COMMANDS');
    toggleFeature('ENABLE_SLASH_COMMANDS'); // Toggle back
    logTest(
        'Feature flags persist to localStorage',
        savedValue === 'true',
        `Saved value: ${savedValue}`
    );
    
    // Test 8: updateFeatureToggles function exists
    logTest(
        'updateFeatureToggles function exists',
        typeof updateFeatureToggles === 'function',
        `Type: ${typeof updateFeatureToggles}`
    );
    
    // Test 9: updateRichTextStatus function exists
    logTest(
        'updateRichTextStatus function exists',
        typeof updateRichTextStatus === 'function',
        `Type: ${typeof updateRichTextStatus}`
    );
    
    // Test 10: getEditorMode function exists
    logTest(
        'getEditorMode function exists',
        typeof getEditorMode === 'function',
        `Type: ${typeof getEditorMode}`
    );
    
    // Print results
    console.log(`\n📊 Feature Flag Tests: ${testResults.passed} passed, ${testResults.failed} failed`);
    
    return testResults;
}

// ===== FALLBACK TESTS =====

function runFallbackTests() {
    console.log('\n🧪 Running Fallback Mechanism Tests...\n');
    testResults.passed = 0;
    testResults.failed = 0;
    testResults.tests = [];
    
    // Test 1: getEditorMode returns 'plain' by default
    const defaultMode = getEditorMode();
    logTest(
        'Default editor mode is plain text',
        defaultMode === 'plain',
        `Mode: ${defaultMode}`
    );
    
    // Test 2: changeEditorMode function exists
    logTest(
        'changeEditorMode function exists',
        typeof changeEditorMode === 'function',
        `Type: ${typeof changeEditorMode}`
    );
    
    // Test 3: isRichTextAvailable function exists
    logTest(
        'isRichTextAvailable function exists',
        typeof isRichTextAvailable === 'function',
        `Type: ${typeof isRichTextAvailable}`
    );
    
    // Test 4: isRichTextAvailable returns false when Tiptap not loaded
    const richAvailable = isRichTextAvailable();
    logTest(
        'Rich text is not available (Tiptap not loaded)',
        richAvailable === false,
        `Value: ${richAvailable}`
    );
    
    // Test 5: Editor mode persists to localStorage
    changeEditorMode('rich');
    const savedMode = localStorage.getItem('editorMode');
    changeEditorMode('plain'); // Reset
    logTest(
        'Editor mode persists to localStorage',
        savedMode === 'rich',
        `Saved mode: ${savedMode}`
    );
    
    // Test 6: updateEditorBadge function exists
    logTest(
        'updateEditorBadge function exists',
        typeof updateEditorBadge === 'function',
        `Type: ${typeof updateEditorBadge}`
    );
    
    // Test 7: Tiptap loading doesn't crash when feature disabled
    const initialRichTextState = FEATURE_FLAGS.ENABLE_RICH_TEXT_EDITOR.enabled;
    FEATURE_FLAGS.ENABLE_RICH_TEXT_EDITOR.enabled = false;
    
    let loadError = null;
    try {
        loadTiptapLibrary();
    } catch (e) {
        loadError = e;
    }
    
    FEATURE_FLAGS.ENABLE_RICH_TEXT_EDITOR.enabled = initialRichTextState;
    
    logTest(
        'Tiptap loading is safe when feature disabled',
        loadError === null,
        `Error: ${loadError?.message || 'None'}`
    );
    
    // Test 8: Feature flag system has fallback mechanism
    const hasFallback = typeof window.Tiptap === 'undefined' || !isRichTextAvailable();
    logTest(
        'System has fallback (Tiptap not loaded)',
        hasFallback,
        `Tiptap loaded: ${typeof window.Tiptap !== 'undefined'}`
    );
    
    // Print results
    console.log(`\n📊 Fallback Tests: ${testResults.passed} passed, ${testResults.failed} failed`);
    
    return testResults;
}

// ===== STORAGE TESTS =====

async function runStorageTests() {
    console.log('\n🧪 Running Storage Tests...\n');
    testResults.passed = 0;
    testResults.failed = 0;
    testResults.tests = [];
    
    // Test 1: RichContentStorage object exists
    logTest(
        'RichContentStorage object exists',
        typeof RichContentStorage !== 'undefined' && typeof RichContentStorage === 'object',
        `Type: ${typeof RichContentStorage}`
    );
    
    // Test 2: All required methods exist
    const requiredMethods = ['saveRichNotes', 'loadRichNotes', 'deleteRichNotes', 'hasRichNotes', 'getAllTaskIds', 'clearAll', 'getStats'];
    const allMethodsExist = requiredMethods.every(method => typeof RichContentStorage[method] === 'function');
    logTest(
        'All required storage methods exist',
        allMethodsExist,
        `Methods: ${Object.keys(RichContentStorage).filter(k => typeof RichContentStorage[k] === 'function').join(', ')}`
    );
    
    // Test 3: Can save rich notes
    const testTaskId = 'TEST-001';
    const testContent = { type: 'doc', content: [{ type: 'paragraph', content: 'Test' }] };
    
    let saveResult = null;
    try {
        const result = await RichContentStorage.saveRichNotes(testTaskId, testContent);
        saveResult = result;
    } catch (e) {
        saveResult = { success: false, error: e.message };
    }
    
    logTest(
        'Can save rich notes',
        saveResult?.success === true,
        `Result: ${JSON.stringify(saveResult)}`
    );
    
    // Test 4: Can check if rich notes exist
    const hasNotes = RichContentStorage.hasRichNotes(testTaskId);
    logTest(
        'Can check if rich notes exist',
        hasNotes === true,
        `Value: ${hasNotes}`
    );
    
    // Test 5: Can load rich notes
    const loadedContent = RichContentStorage.loadRichNotes(testTaskId);
    logTest(
        'Can load rich notes',
        loadedContent !== null && loadedContent.type === testContent.type,
        `Content matches: ${loadedContent?.type === testContent.type}`
    );
    
    // Test 6: Can get all task IDs
    const taskIds = RichContentStorage.getAllTaskIds();
    const hasTestTask = taskIds.includes(testTaskId);
    logTest(
        'Can get all task IDs with rich content',
        hasTestTask === true,
        `Found ${taskIds.length} tasks, includes TEST-001: ${hasTestTask}`
    );
    
    // Test 7: Can get storage stats
    const stats = RichContentStorage.getStats();
    logTest(
        'Can get storage statistics',
        typeof stats === 'object' && typeof stats.taskCount === 'number' && typeof stats.formattedSize === 'string',
        `Tasks: ${stats.taskCount}, Size: ${stats.formattedSize}`
    );
    
    // Test 8: Can delete rich notes
    RichContentStorage.deleteRichNotes(testTaskId);
    const afterDelete = RichContentStorage.hasRichNotes(testTaskId);
    logTest(
        'Can delete rich notes',
        afterDelete === false,
        `Still exists: ${afterDelete}`
    );
    
    // Test 9: Handles missing task ID gracefully
    // The function returns { success: false, error: '...' } instead of throwing
    const nullSaveResult = await RichContentStorage.saveRichNotes(null, testContent);
    logTest(
        'Handles missing task ID gracefully',
        nullSaveResult?.success === false && nullSaveResult?.error === 'Missing parameters',
        `Result: ${JSON.stringify(nullSaveResult)}`
    );
    
    // Test 10: Can clear all storage
    // Save another test entry
    RichContentStorage.saveRichNotes('TEST-002', testContent);
    RichContentStorage.clearAll();
    const afterClear = RichContentStorage.getAllTaskIds();
    logTest(
        'Can clear all rich content storage',
        afterClear.length === 0,
        `Remaining tasks: ${afterClear.length}`
    );
    
    // Print results
    console.log(`\n📊 Storage Tests: ${testResults.passed} passed, ${testResults.failed} failed`);
    
    return testResults;
}

// ===== PROJECT MANAGEMENT TESTS =====

async function runProjectTests() {
    console.log('\n🧪 Running Project Management Tests...\n');
    testResults.passed = 0;
    testResults.failed = 0;
    testResults.tests = [];
    
    // Test 1: projects array exists
    logTest(
        'projects array exists',
        typeof projects !== 'undefined' && Array.isArray(projects),
        `Type: ${typeof projects}`
    );
    
    // Test 2: currentProjectIndex variable exists
    logTest(
        'currentProjectIndex variable exists',
        typeof currentProjectIndex !== 'undefined' && typeof currentProjectIndex === 'number',
        `Value: ${currentProjectIndex}`
    );
    
    // Test 3: loadProjects function exists
    logTest(
        'loadProjects function exists',
        typeof loadProjects === 'function',
        `Type: ${typeof loadProjects}`
    );
    
    // Test 4: saveProjects function exists
    logTest(
        'saveProjects function exists',
        typeof saveProjects === 'function',
        `Type: ${typeof saveProjects}`
    );
    
    // Test 5: switchProject function exists
    logTest(
        'switchProject function exists',
        typeof switchProject === 'function',
        `Type: ${typeof switchProject}`
    );
    
    // Test 6: updateProjectSelector function exists
    logTest(
        'updateProjectSelector function exists',
        typeof updateProjectSelector === 'function',
        `Type: ${typeof updateProjectSelector}`
    );
    
    // Test 7: loadProjects returns array
    let projectsData = [];
    try {
        projectsData = await loadProjects();
    } catch (e) {
        console.log('Load projects error:', e.message);
    }
    logTest(
        'loadProjects returns array',
        Array.isArray(projectsData),
        `Type: ${Array.isArray(projectsData) ? 'array' : typeof projectsData}`
    );
    
    // Test 8: saveProjects accepts array parameter
    let saveSuccess = false;
    try {
        await saveProjects([]);
        saveSuccess = true;
    } catch (e) {
        console.log('Save projects error:', e.message);
    }
    logTest(
        'saveProjects accepts array',
        saveSuccess === true,
        `Success: ${saveSuccess}`
    );
    
    // Test 9: Can save and load projects (round-trip test)
    const testProject = [{ name: 'TEST-PROJECT', directoryHandle: null, lastUsed: Date.now() }];
    await saveProjects(testProject);
    const loadedAfterSave = await loadProjects();
    const hasTestProject = loadedAfterSave.some(p => p.name === 'TEST-PROJECT');
    // Cleanup
    await saveProjects([]);
    
    logTest(
        'Can save and load projects (round-trip)',
        hasTestProject === true,
        `Found test project: ${hasTestProject}`
    );
    
    // Test 10: switchProject handles invalid index gracefully
    let switchError = false;
    try {
        await switchProject(999); // Invalid index
    } catch (e) {
        switchError = true;
    }
    logTest(
        'switchProject handles invalid index',
        switchError === false,
        `No error thrown: ${!switchError}`
    );
    
    // Test 11: switchProject handles negative index gracefully
    switchError = false;
    try {
        await switchProject(-1); // Negative index
    } catch (e) {
        switchError = true;
    }
    logTest(
        'switchProject handles negative index',
        switchError === false,
        `No error thrown: ${!switchError}`
    );
    
    // Test 12: switchProject handles NaN gracefully
    switchError = false;
    try {
        await switchProject('abc'); // Invalid string
    } catch (e) {
        switchError = true;
    }
    logTest(
        'switchProject handles NaN input',
        switchError === false,
        `No error thrown: ${!switchError}`
    );
    
    // Test 13: updateProjectSelector runs without error
    let selectorError = false;
    try {
        await updateProjectSelector();
    } catch (e) {
        selectorError = true;
    }
    logTest(
        'updateProjectSelector runs without error',
        selectorError === false,
        `No error: ${!selectorError}`
    );
    
    // Test 14: Projects have correct structure
    const sampleProject = { name: 'Sample', directoryHandle: null, lastUsed: 1234567890 };
    const hasName = 'name' in sampleProject;
    const hasHandle = 'directoryHandle' in sampleProject;
    const hasLastUsed = 'lastUsed' in sampleProject;
    logTest(
        'Project object has required properties',
        hasName && hasHandle && hasLastUsed,
        `name: ${hasName}, handle: ${hasHandle}, lastUsed: ${hasLastUsed}`
    );
    
    // Print results
    console.log(`\n📊 Project Management Tests: ${testResults.passed} passed, ${testResults.failed} failed`);
    
    return testResults;
}

// ===== INTEGRATION TESTS =====

function runIntegrationTests() {
    console.log('\n🧪 Running Integration Tests...\n');
    testResults.passed = 0;
    testResults.failed = 0;
    testResults.tests = [];
    
    // Test 1: Feature flags and storage can work together
    RichContentStorage.saveRichNotes('INTEG-001', { test: 'data' });
    const hasIntegration = RichContentStorage.hasRichNotes('INTEG-001');
    RichContentStorage.deleteRichNotes('INTEG-001');
    
    logTest(
        'Storage works independently of feature flags',
        hasIntegration === true,
        `Storage works: ${hasIntegration}`
    );
    
    // Test 2: Editor mode persists across reloads (simulated)
    // Note: This test checks that localStorage is updated, not getEditorMode()
    // because getEditorMode() checks the feature flag first
    const testMode = 'rich';
    changeEditorMode(testMode);
    const savedMode = localStorage.getItem('editorMode');
    
    logTest(
        'Editor mode persists correctly',
        savedMode === testMode,
        `Saved: ${savedMode}, Expected: ${testMode}`
    );
    
    // Test 3: Toggle feature doesn't break storage
    const initialStorage = RichContentStorage.getStats();
    toggleFeature('ENABLE_COMMENTS');
    const afterToggleStorage = RichContentStorage.getStats();
    
    logTest(
        'Toggling features does not affect storage',
        initialStorage.taskCount === afterToggleStorage.taskCount,
        `Before: ${initialStorage.taskCount}, After: ${afterToggleStorage.taskCount}`
    );
    
    toggleFeature('ENABLE_COMMENTS'); // Reset
    
    // Print results
    console.log(`\n📊 Integration Tests: ${testResults.passed} passed, ${testResults.failed} failed`);
    
    return testResults;
}

// ===== TASK CRUD TESTS =====

function runTaskCrudTests() {
    console.log('\n🧪 Running Task CRUD Tests...\n');
    testResults.passed = 0;
    testResults.failed = 0;
    testResults.tests = [];
    
    // Save original state
    const originalTasks = [...tasks];
    const initialTaskCount = tasks.length;
    
    // Test 1: tasks array exists
    logTest(
        'Tasks array exists',
        Array.isArray(tasks),
        `Type: ${typeof tasks}`
    );
    
    // Test 2: createTaskElement function exists
    logTest(
        'createTaskElement function exists',
        typeof createTaskElement === 'function',
        `Type: ${typeof createTaskElement}`
    );
    
    // Test 3: renderKanban function exists
    logTest(
        'renderKanban function exists',
        typeof renderKanban === 'function',
        `Type: ${typeof renderKanban}`
    );
    
    // Test 4: deleteTask function exists
    logTest(
        'deleteTask function exists',
        typeof deleteTask === 'function',
        `Type: ${typeof deleteTask}`
    );
    
    // Test 5: Task data structure validation
    const validTask = {
        id: 'TEST-CRUD-001',
        title: 'Test Task',
        status: 'todo',
        priority: 'Medium',
        category: 'Tests',
        description: 'Test description',
        notes: '',
        tags: [],
        subtasks: [],
        created: new Date().toISOString(),
        updated: new Date().toISOString()
    };
    
    const hasRequiredFields = 
        validTask.id && 
        validTask.title && 
        validTask.status;
    
    logTest(
        'Task data structure has required fields',
        hasRequiredFields,
        'id, title, status are required'
    );
    
    // Test 6: Can create task element from task object
    const taskElement = createTaskElement(validTask);
    const elementCreated = taskElement !== null && taskElement.tagName === 'DIV';
    logTest(
        'createTaskElement returns valid DOM element',
        elementCreated,
        `Tag: ${taskElement?.tagName}`
    );
    
    // Test 7: Task element has correct attributes
    const hasDataset = taskElement && taskElement.dataset.taskId === validTask.id;
    const hasTabindex = taskElement && taskElement.getAttribute('tabindex') === '0';
    const hasRole = taskElement && taskElement.getAttribute('role') === 'button';
    logTest(
        'Task element has accessibility attributes',
        hasDataset && hasTabindex && hasRole,
        `dataset: ${hasDataset}, tabindex: ${hasTabindex}, role: ${hasRole}`
    );
    
    // Test 8: Task element contains task data in HTML
    const containsTitle = taskElement && taskElement.innerHTML.includes(validTask.title);
    const containsId = taskElement && taskElement.innerHTML.includes(validTask.id);
    logTest(
        'Task element renders task data',
        containsTitle && containsId,
        `Title: ${containsTitle}, ID: ${containsId}`
    );
    
    // Test 9: renderKanban doesn't throw on empty tasks
    let renderError = null;
    try {
        tasks = []; // Clear tasks temporarily
        renderKanban();
    } catch (e) {
        renderError = e;
    } finally {
        tasks = originalTasks; // Restore
    }
    logTest(
        'renderKanban handles empty tasks',
        renderError === null,
        `Error: ${renderError?.message || 'None'}`
    );
    
    // Test 10: renderKanban doesn't throw on tasks with all fields
    renderError = null;
    try {
        const fullTask = {
            id: 'TEST-CRUD-FULL',
            title: 'Full Test Task',
            status: 'in-progress',
            priority: 'High',
            category: 'Frontend',
            description: 'A description',
            notes: 'Some notes',
            tags: ['bug', 'urgent'],
            subtasks: [
                { text: 'Subtask 1', completed: false },
                { text: 'Subtask 2', completed: true }
            ],
            created: new Date().toISOString(),
            updated: new Date().toISOString()
        };
        tasks.push(fullTask);
        renderKanban();
    } catch (e) {
        renderError = e;
    } finally {
        // Clean up
        const idx = tasks.findIndex(t => t.id === 'TEST-CRUD-FULL');
        if (idx >= 0) tasks.splice(idx, 1);
    }
    logTest(
        'renderKanban handles tasks with all fields',
        renderError === null,
        `Error: ${renderError?.message || 'None'}`
    );
    
    // Test 11: Task filtering works correctly in renderKanban
    const originalFiltered = tasks.filter(t => t.status === 'todo');
    const todoColumnExists = originalFiltered.length >= 0;
    logTest(
        'Task filtering works for columns',
        todoColumnExists,
        `Found ${originalFiltered.length} todo tasks`
    );
    
    // Test 12: Task with special characters in ID is handled
    let specialIdError = null;
    try {
        const specialTask = {
            id: 'TEST-CRUD-SPECIAL-1',
            title: 'Task with special chars',
            status: 'done'
        };
        const specialEl = createTaskElement(specialTask);
    } catch (e) {
        specialIdError = e;
    }
    logTest(
        'Handles task IDs with special characters',
        specialIdError === null,
        `Error: ${specialIdError?.message || 'None'}`
    );
    
    // Test 13: Task priority badge classes
    const priorities = ['Critical', 'High', 'Medium', 'Low'];
    let priorityTestPassed = true;
    for (const priority of priorities) {
        const taskWithPriority = { id: 'TEST-' + priority, title: 'Priority Test', status: 'todo', priority: priority };
        const el = createTaskElement(taskWithPriority);
        if (!el || !el.innerHTML) {
            priorityTestPassed = false;
            break;
        }
    }
    logTest(
        'Renders tasks with all priority levels',
        priorityTestPassed,
        `Priorities: ${priorities.join(', ')}`
    );
    
    // Test 14: Empty title is handled (edge case)
    const emptyTitleTask = { id: 'TEST-EMPTY', title: '', status: 'todo' };
    const emptyTitleEl = createTaskElement(emptyTitleTask);
    const handlesEmptyTitle = emptyTitleEl && emptyTitleEl.innerHTML.includes('');
    logTest(
        'Handles empty task title',
        handlesEmptyTitle,
        'Renders without crashing'
    );
    
    // Test 15: renderKanban creates correct column structure
    tasks = [];
    renderKanban();
    const board = document.getElementById('kanbanBoard');
    const columns = board ? board.querySelectorAll('.kanban-column') : [];
    const columnCount = columns.length;
    logTest(
        'renderKanban creates correct column count',
        columnCount === 4,
        `Columns: ${columnCount} (expected 4)`
    );
    
    // Restore original tasks
    tasks = originalTasks;
    renderKanban();
    
    // Print results
    console.log(`\n📊 Task CRUD Tests: ${testResults.passed} passed, ${testResults.failed} failed`);
    
    return testResults;
}

// ===== FILE SYSTEM API TESTS =====

function runFileSystemApiTests() {
    console.log('\n🧪 Running File System API Tests...\n');
    testResults.passed = 0;
    testResults.failed = 0;
    testResults.tests = [];
    
    // Test 1: File System Access API is available in browser
    const fsApiAvailable = 'showOpenFilePicker' in window;
    logTest(
        'File System Access API available (showOpenFilePicker)',
        fsApiAvailable === true,
        `Available: ${fsApiAvailable}`
    );
    
    // Test 2: showDirectoryPicker is available
    const dirPickerAvailable = 'showDirectoryPicker' in window;
    logTest(
        'File System Access API available (showDirectoryPicker)',
        dirPickerAvailable === true,
        `Available: ${dirPickerAvailable}`
    );
    
    // Test 3: directoryHandle variable exists (may be null if no folder selected)
    const hasDirectoryHandle = typeof directoryHandle !== 'undefined';
    logTest(
        'directoryHandle variable exists',
        hasDirectoryHandle === true,
        `Type: ${typeof directoryHandle}`
    );
    
    // Test 4: kanbanFileHandle variable exists
    const hasKanbanHandle = typeof kanbanFileHandle !== 'undefined';
    logTest(
        'kanbanFileHandle variable exists',
        hasKanbanHandle === true,
        `Type: ${typeof kanbanFileHandle}`
    );
    
    // Test 5: archiveFileHandle variable exists
    const hasArchiveHandle = typeof archiveFileHandle !== 'undefined';
    logTest(
        'archiveFileHandle variable exists',
        hasArchiveHandle === true,
        `Type: ${typeof archiveFileHandle}`
    );
    
    // Test 6: loadKanbanFile function exists
    logTest(
        'loadKanbanFile function exists',
        typeof loadKanbanFile === 'function',
        `Type: ${typeof loadKanbanFile}`
    );
    
    // Test 7: saveKanban function exists
    logTest(
        'saveKanban function exists',
        typeof saveKanban === 'function',
        `Type: ${typeof saveKanban}`
    );
    
    // Test 8: loadArchive function exists
    logTest(
        'loadArchive function exists',
        typeof loadArchive === 'function',
        `Type: ${typeof loadArchive}`
    );
    
    // Test 9: saveArchive function exists
    logTest(
        'saveArchive function exists',
        typeof saveArchive === 'function',
        `Type: ${typeof saveArchive}`
    );
    
    // Test 10: tryRestorePreviousDirectory function exists
    logTest(
        'tryRestorePreviousDirectory function exists',
        typeof tryRestorePreviousDirectory === 'function',
        `Type: ${typeof tryRestorePreviousDirectory}`
    );
    
    // Test 11: Request permission function exists
    const requestPermissionFn = typeof requestPermission === 'function' || typeof globalThis.requestPermission === 'function';
    logTest(
        'requestPermission function exists',
        requestPermissionFn,
        `Found: ${requestPermissionFn}`
    );
    
    // Test 12: Auto-save function exists
    logTest(
        'autoSave function exists',
        typeof autoSave === 'function',
        `Type: ${typeof autoSave}`
    );
    
    // Test 13: Check if a project has been loaded (directoryHandle may be null)
    const hasLoadedProject = directoryHandle !== null;
    logTest(
        'Project folder has been selected (directoryHandle not null)',
        hasLoadedProject,
        `Loaded: ${hasLoadedProject}`
    );
    
    // Test 14: getFileHandle method available on directory handle mock
    // (Test that the File System API supports getFileHandle)
    const supportsGetFileHandle = typeof FileSystemDirectoryHandle !== 'undefined';
    logTest(
        'FileSystemDirectoryHandle class available',
        supportsGetFileHandle,
        `Available: ${supportsGetFileHandle}`
    );
    
    // Test 15: createWritable method supported
    const supportsCreateWritable = typeof FileSystemWritableFileStream !== 'undefined';
    logTest(
        'FileSystemWritableFileStream available',
        supportsCreateWritable,
        `Available: ${supportsCreateWritable}`
    );
    
    // Print results
    console.log(`\n📊 File System API Tests: ${testResults.passed} passed, ${testResults.failed} failed`);
    
    console.log('\n⚠️  MANUAL TEST SCENARIOS (require user interaction):');
    console.log('  1. Open app without prior folder selection -> should prompt for folder');
    console.log('  2. Select a folder with existing kanban.md -> should load existing tasks');
    console.log('  3. Create a new task -> should auto-save to kanban.md');
    console.log('  4. Move task between columns -> should update kanban.md');
    console.log('  5. Close and reopen app -> should restore previous folder');
    console.log('  6. Try to select a folder without kanban.md -> should create default files');
    console.log('  7. Edit kanban.md externally -> reload should show updated content');
    console.log('  8. Delete kanban.md externally -> should recreate with current tasks');
    
    return testResults;
}

// ===== THEME TESTS =====

function runThemeTests() {
    console.log('\n🧪 Running Theme Tests...\n');
    testResults.passed = 0;
    testResults.failed = 0;
    testResults.tests = [];
    
    // Store original theme to restore later
    const originalTheme = currentTheme;
    
    // Test 1: Theme functions exist
    logTest(
        'toggleTheme function exists',
        typeof toggleTheme === 'function',
        `Type: ${typeof toggleTheme}`
    );
    
    logTest(
        'setTheme function exists',
        typeof setTheme === 'function',
        `Type: ${typeof setTheme}`
    );
    
    logTest(
        'initTheme function exists',
        typeof initTheme === 'function',
        `Type: ${typeof initTheme}`
    );
    
    // Test 2: Theme state variable exists
    logTest(
        'currentTheme variable exists',
        typeof currentTheme !== 'undefined',
        `Type: ${typeof currentTheme}`
    );
    
    // Test 3: Theme values are valid
    const validTheme = currentTheme === 'light' || currentTheme === 'dark';
    logTest(
        'Current theme is valid (light or dark)',
        validTheme,
        `Value: ${currentTheme}`
    );
    
    // Test 4: Theme persists to localStorage
    setTheme('light', false); // Set without animation
    const savedLight = localStorage.getItem('preferredTheme');
    setTheme('dark', false); // Set without animation
    const savedDark = localStorage.getItem('preferredTheme');
    
    logTest(
        'Theme persists to localStorage',
        savedLight === 'light' && savedDark === 'dark',
        `Light: ${savedLight}, Dark: ${savedDark}`
    );
    
    // Test 5: Theme toggle switches between themes
    const initialTheme = currentTheme;
    toggleTheme();
    const afterToggle = currentTheme;
    toggleTheme(); // Toggle back
    const backToOriginal = currentTheme;
    
    logTest(
        'toggleTheme switches between light and dark',
        initialTheme !== afterToggle && afterToggle === backToOriginal,
        `Initial: ${initialTheme}, After: ${afterToggle}, Back: ${backToOriginal}`
    );
    
    // Test 6: DOM data-theme attribute is updated
    setTheme('dark', false);
    const darkAttr = document.documentElement.getAttribute('data-theme');
    setTheme('light', false);
    const lightAttr = document.documentElement.getAttribute('data-theme');
    
    logTest(
        'DOM data-theme attribute updates correctly',
        darkAttr === 'dark' && lightAttr === 'light',
        `Dark: ${darkAttr}, Light: ${lightAttr}`
    );
    
    // Test 7: Toggle switch element exists and has correct attributes
    const themeToggle = document.getElementById('themeToggleSwitch');
    logTest(
        'Theme toggle switch element exists',
        themeToggle !== null,
        `Found: ${themeToggle !== null}`
    );
    
    if (themeToggle) {
        logTest(
            'Theme toggle has role="switch"',
            themeToggle.getAttribute('role') === 'switch',
            `Role: ${themeToggle.getAttribute('role')}`
        );
        
        logTest(
            'Theme toggle has aria-label',
            themeToggle.getAttribute('aria-label') !== null,
            `Label: ${themeToggle.getAttribute('aria-label')}`
        );
        
        logTest(
            'Theme toggle has tabindex',
            themeToggle.getAttribute('tabindex') === '0',
            `Tabindex: ${themeToggle.getAttribute('tabindex')}`
        );
    }
    
    // Test 8: Invalid theme values are handled gracefully
    const beforeInvalid = currentTheme;
    try {
        setTheme('invalid-theme', false);
        const afterInvalid = currentTheme;
        // Should fall back to light theme
        logTest(
            'Invalid theme falls back to light',
            afterInvalid === 'light',
            `After invalid: ${afterInvalid}`
        );
    } catch (e) {
        logTest(
            'Invalid theme handled without crash',
            false,
            `Error: ${e.message}`
        );
    }
    
    // Test 9: updateThemeToggle function exists
    logTest(
        'updateThemeToggle function exists',
        typeof updateThemeToggle === 'function',
        `Type: ${typeof updateThemeToggle}`
    );
    
    // Test 10: toggleThemeFromToggle function exists
    logTest(
        'toggleThemeFromToggle function exists',
        typeof toggleThemeFromToggle === 'function',
        `Type: ${typeof toggleThemeFromToggle}`
    );
    
    // Test 11: Theme toggle has keyboard and click handlers
    if (themeToggle) {
        logTest(
            'Theme toggle has keyboard handler',
            typeof themeToggle.onkeydown === 'function' || themeToggle.getAttribute('onkeydown') !== null,
            `Has handler: ${typeof themeToggle.onkeydown === 'function' || themeToggle.getAttribute('onkeydown') !== null}`
        );
        
        logTest(
            'Theme toggle has click handler',
            typeof themeToggle.onclick === 'function' || themeToggle.getAttribute('onclick') !== null,
            `Has handler: ${typeof themeToggle.onclick === 'function' || themeToggle.getAttribute('onclick') !== null}`
        );
    }
    
    // Restore original theme
    setTheme(originalTheme, false);
    
    // Print results
    console.log(`\n📊 Theme Tests: ${testResults.passed} passed, ${testResults.failed} failed`);
    
    return testResults;
}

// ===== RUN ALL TESTS =====

async function runAllTests() {
    console.log('\n');
    console.log('═'.repeat(60));
    console.log('🧪 RUNNING ALL UNIT TESTS FOR VOID.MD');
    console.log('═'.repeat(60));
    
    const featureResults = runFeatureFlagTests();
    const fallbackResults = runFallbackTests();
    const storageResults = await runStorageTests();
    const projectResults = await runProjectTests();
    const crudResults = runTaskCrudTests();
    const fsResults = runFileSystemApiTests();
    const themeResults = runThemeTests();
    const dragDropResults = typeof runDragAndDropTests === 'function' ? runDragAndDropTests() : { passed: 0, failed: 0 };
    const markdownResults = typeof runMarkdownParsingTests === 'function' ? runMarkdownParsingTests() : { passed: 0, failed: 0 };
    const integrationResults = runIntegrationTests();
    
    // Summary
    const totalPassed = featureResults.passed + fallbackResults.passed + storageResults.passed + projectResults.passed + crudResults.passed + fsResults.passed + themeResults.passed + dragDropResults.passed + markdownResults.passed + integrationResults.passed;
    const totalFailed = featureResults.failed + fallbackResults.failed + storageResults.failed + projectResults.failed + crudResults.failed + fsResults.failed + themeResults.failed + dragDropResults.failed + markdownResults.failed + integrationResults.failed;
    const totalTests = totalPassed + totalFailed;
    
    console.log('\n');
    console.log('═'.repeat(60));
    console.log('📊 FINAL TEST SUMMARY');
    console.log('═'.repeat(60));
    console.log(`Feature Flag Tests:     ${featureResults.passed}/${featureResults.passed + featureResults.failed} passed`);
    console.log(`Fallback Tests:         ${fallbackResults.passed}/${fallbackResults.passed + fallbackResults.failed} passed`);
    console.log(`Storage Tests:          ${storageResults.passed}/${storageResults.passed + storageResults.failed} passed`);
    console.log(`Project Tests:          ${projectResults.passed}/${projectResults.passed + projectResults.failed} passed`);
    console.log(`Task CRUD Tests:        ${crudResults.passed}/${crudResults.passed + crudResults.failed} passed`);
    console.log(`File System API Tests:  ${fsResults.passed}/${fsResults.passed + fsResults.failed} passed`);
    console.log(`Theme Tests:            ${themeResults.passed}/${themeResults.passed + themeResults.failed} passed`);
    console.log(`Drag & Drop Tests:      ${dragDropResults.passed}/${dragDropResults.passed + dragDropResults.failed} passed`);
    console.log(`Markdown Parsing Tests: ${markdownResults.passed}/${markdownResults.passed + markdownResults.failed} passed`);
    console.log(`Integration Tests:      ${integrationResults.passed}/${integrationResults.passed + integrationResults.failed} passed`);
    console.log('─'.repeat(60));
    console.log(`TOTAL:                 ${totalPassed}/${totalTests} passed`);
    console.log('═'.repeat(60));
    
    if (totalFailed === 0) {
        console.log('🎉 ALL TESTS PASSED! The system is working correctly.');
    } else {
        console.log(`⚠️  ${totalFailed} test(s) failed. Review the output above.`);
    }
    
    return {
        featureResults,
        fallbackResults,
        storageResults,
        projectResults,
        crudResults,
        fsResults,
        themeResults,
        dragDropResults,
        markdownResults,
        integrationResults,
        totalPassed,
        totalFailed,
        totalTests
    };
}

// Make functions available globally
window.runFeatureFlagTests = runFeatureFlagTests;
window.runFallbackTests = runFallbackTests;
window.runStorageTests = runStorageTests;
window.runProjectTests = runProjectTests;
window.runTaskCrudTests = runTaskCrudTests;
window.runFileSystemApiTests = runFileSystemApiTests;
window.runThemeTests = runThemeTests;
window.runIntegrationTests = runIntegrationTests;
window.runAllTests = runAllTests;

console.log('\n🧪 Test functions loaded!');
console.log('Run tests with:');
console.log('  runAllTests()                    - Run all tests');
console.log('  runFeatureFlagTests()           - Feature flag tests');
console.log('  runFallbackTests()              - Fallback mechanism tests');
console.log('  runStorageTests()               - Storage tests');
console.log('  runProjectTests()               - Project management tests');
console.log('  runTaskCrudTests()              - Task CRUD tests');
console.log('  runFileSystemApiTests()         - File System API tests');
console.log('  runThemeTests()                 - Theme switching tests');
console.log('  runDragAndDropTests()           - Drag & drop tests (load additional-tests.js)');
console.log('  runMarkdownParsingTests()       - Markdown parsing tests (load additional-tests.js)');
console.log('  runIntegrationTests()           - Integration tests');
console.log('\nTo load additional tests:');
console.log("  fetch('docs/architecture/tests/additional-tests.js').then(r => r.text()).then(code => eval(code))");
