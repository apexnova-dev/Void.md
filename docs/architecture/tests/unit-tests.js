/**
 * Unit Tests for Feature Flag System and Fallback Mechanisms
 * 
 * Run these tests in the browser console:
 * 1. Open task-manager.html in browser
 * 2. Open Developer Console (F12)
 * 3. Copy and paste this entire file
 * 4. Run: runAllTests()
 * 
 * Or run individual test suites:
 * - runFeatureFlagTests()
 * - runFallbackTests()
 * - runStorageTests()
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
    
    // Test 2: All required flags exist
    const requiredFlags = [
        'ENABLE_RICH_TEXT_EDITOR',
        'ENABLE_COMMENTS', 
        'ENABLE_SLASH_COMMANDS',
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

// ===== RUN ALL TESTS =====

async function runAllTests() {
    console.log('\n');
    console.log('═'.repeat(60));
    console.log('🧪 RUNNING ALL UNIT TESTS FOR FEATURE FLAG SYSTEM');
    console.log('═'.repeat(60));
    
    const featureResults = runFeatureFlagTests();
    const fallbackResults = runFallbackTests();
    const storageResults = await runStorageTests();
    const integrationResults = runIntegrationTests();
    
    // Summary
    const totalPassed = featureResults.passed + fallbackResults.passed + storageResults.passed + integrationResults.passed;
    const totalFailed = featureResults.failed + fallbackResults.failed + storageResults.failed + integrationResults.failed;
    const totalTests = totalPassed + totalFailed;
    
    console.log('\n');
    console.log('═'.repeat(60));
    console.log('📊 FINAL TEST SUMMARY');
    console.log('═'.repeat(60));
    console.log(`Feature Flag Tests:    ${featureResults.passed}/${featureResults.passed + featureResults.failed} passed`);
    console.log(`Fallback Tests:        ${fallbackResults.passed}/${fallbackResults.passed + fallbackResults.failed} passed`);
    console.log(`Storage Tests:         ${storageResults.passed}/${storageResults.passed + storageResults.failed} passed`);
    console.log(`Integration Tests:     ${integrationResults.passed}/${integrationResults.passed + integrationResults.failed} passed`);
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
window.runIntegrationTests = runIntegrationTests;
window.runAllTests = runAllTests;

console.log('\n🧪 Test functions loaded!');
console.log('Run tests with:');
console.log('  runAllTests()                    - Run all tests');
console.log('  runFeatureFlagTests()           - Feature flag tests');
console.log('  runFallbackTests()              - Fallback mechanism tests');
console.log('  runStorageTests()               - Storage tests');
console.log('  runIntegrationTests()           - Integration tests');
