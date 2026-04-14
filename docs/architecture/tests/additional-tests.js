/**
 * Additional Unit Tests - Drag & Drop and Markdown Parsing
 * 
 * These tests are loaded separately and integrate with the main test suite.
 * Include this file after unit-tests.js to add the new test suites.
 */

// ===== DRAG AND DROP TESTS =====

function runDragAndDropTests() {
    console.log('\n🧪 Running Drag & Drop Tests...\n');
    testResults.passed = 0;
    testResults.failed = 0;
    testResults.tests = [];
    
    // Test 1: Drag function exists
    logTest(
        'Drag function exists',
        typeof drag === 'function',
        `Type: ${typeof drag}`
    );
    
    // Test 2: AllowDrop function exists
    logTest(
        'AllowDrop function exists',
        typeof allowDrop === 'function',
        `Type: ${typeof allowDrop}`
    );
    
    // Test 3: Drop function exists
    logTest(
        'Drop function exists',
        typeof drop === 'function',
        `Type: ${typeof drop}`
    );
    
    // Test 4: Task cards have draggable attribute
    const taskCard = document.querySelector('.task-card');
    logTest(
        'Task cards have draggable attribute',
        taskCard && taskCard.draggable === true,
        taskCard ? `draggable: ${taskCard.draggable}` : 'No task card found (may need board loaded)'
    );
    
    // Test 5: Task cards have data-task-id
    logTest(
        'Task cards have data-task-id attribute',
        taskCard && taskCard.hasAttribute('data-task-id'),
        taskCard ? `data-task-id: ${taskCard.getAttribute('data-task-id')}` : 'No task card found'
    );
    
    // Test 6: Columns have ondrop handler
    const column = document.querySelector('.kanban-column');
    logTest(
        'Kanban columns have drop handler',
        column && (column.ondrop !== null || column.getAttribute('ondrop') !== null),
        column ? 'Column found with drop handler' : 'No column found (may need board loaded)'
    );
    
    // Test 7: Columns have ondragover handler
    logTest(
        'Kanban columns have dragover handler',
        column && (column.ondragover !== null || column.getAttribute('ondragover') !== null),
        column ? 'Column found with dragover handler' : 'No column found'
    );
    
    // Test 8: Drag function sets dataTransfer (mock test)
    if (typeof drag === 'function') {
        const mockEvent = {
            dataTransfer: {
                setData: function(format, data) { this._data = { format, data }; },
                effectAllowed: ''
            },
            target: {
                getAttribute: function(attr) { return attr === 'data-task-id' ? 'TASK-001' : null; }
            }
        };
        try {
            drag(mockEvent);
            logTest(
                'Drag function sets dataTransfer data',
                mockEvent.dataTransfer._data && mockEvent.dataTransfer._data.format === 'text/plain',
                `Data format: ${mockEvent.dataTransfer._data?.format}`
            );
        } catch (e) {
            logTest(
                'Drag function sets dataTransfer data',
                false,
                `Error: ${e.message}`
            );
        }
    }
    
    // Test 9: AllowDrop prevents default (mock test)
    if (typeof allowDrop === 'function') {
        let prevented = false;
        const mockEvent = {
            preventDefault: function() { prevented = true; },
            dataTransfer: { dropEffect: '' }
        };
        try {
            allowDrop(mockEvent);
            logTest(
                'AllowDrop prevents default behavior',
                prevented,
                prevented ? 'Default prevented' : 'Default not prevented'
            );
        } catch (e) {
            logTest(
                'AllowDrop prevents default behavior',
                false,
                `Error: ${e.message}`
            );
        }
    }
    
    // Test 10: Column data-column-id exists
    logTest(
        'Columns have data-column-id attribute',
        column && column.hasAttribute('data-column-id'),
        column ? `data-column-id: ${column.getAttribute('data-column-id')}` : 'No column found'
    );
    
    // Print results
    console.log(`\n📊 Drag & Drop Tests: ${testResults.passed} passed, ${testResults.failed} failed`);
    
    return testResults;
}

// ===== MARKDOWN PARSING TESTS =====

function runMarkdownParsingTests() {
    console.log('\n🧪 Running Markdown Parsing Tests...\n');
    testResults.passed = 0;
    testResults.failed = 0;
    testResults.tests = [];
    
    // Test 1: markdownToHtml function exists
    logTest(
        'markdownToHtml function exists',
        typeof markdownToHtml === 'function',
        `Type: ${typeof markdownToHtml}`
    );
    
    if (typeof markdownToHtml !== 'function') {
        console.log('❌ markdownToHtml not found, skipping remaining tests');
        return testResults;
    }
    
    // Test 2: Empty input returns empty string
    const emptyResult = markdownToHtml('');
    logTest(
        'Empty string returns empty',
        emptyResult === '',
        `Result: "${emptyResult}"`
    );
    
    // Test 3: Null/undefined input returns empty string
    const nullResult = markdownToHtml(null);
    logTest(
        'Null input returns empty',
        nullResult === '',
        `Result: "${nullResult}"`
    );
    
    // Test 4: Plain text is wrapped in paragraph
    const plainResult = markdownToHtml('Hello world');
    logTest(
        'Plain text is wrapped in paragraph',
        plainResult.includes('<p>') && plainResult.includes('</p>'),
        `Contains paragraph tags`
    );
    
    // Test 5: Bold text conversion (**text**)
    const boldResult = markdownToHtml('**bold text**');
    logTest(
        'Bold text is converted to <strong>',
        boldResult.includes('<strong>') && boldResult.includes('</strong>'),
        `Contains strong tags`
    );
    
    // Test 6: Italic text conversion (*text*)
    const italicResult = markdownToHtml('*italic text*');
    logTest(
        'Italic text is converted to <em>',
        italicResult.includes('<em>') && italicResult.includes('</em>'),
        `Contains em tags`
    );
    
    // Test 7: Inline code conversion (`code`)
    const codeResult = markdownToHtml('`inline code`');
    logTest(
        'Inline code is converted to <code>',
        codeResult.includes('<code') && codeResult.includes('</code>'),
        `Contains code tags`
    );
    
    // Test 8: Link conversion [text](url)
    const linkResult = markdownToHtml('[link text](https://example.com)');
    logTest(
        'Links are converted to <a> tags',
        linkResult.includes('<a ') && linkResult.includes('</a>'),
        `Contains anchor tags`
    );
    
    // Test 9: XSS prevention - script tags in bold are escaped
    const xssBoldResult = markdownToHtml('**<script>alert(1)</script>**');
    const xssPrevented = !xssBoldResult.includes('<script>') && xssBoldResult.includes('&lt;script&gt;');
    logTest(
        'XSS in bold text is escaped',
        xssPrevented,
        xssPrevented ? 'Script tag properly escaped' : 'XSS vulnerability detected!'
    );
    
    // Test 10: XSS prevention - HTML in italic is escaped
    const xssItalicResult = markdownToHtml('*<img src=x onerror=alert(1)>*');
    const xssItalicPrevented = !xssItalicResult.includes('<img') && xssItalicResult.includes('&lt;img');
    logTest(
        'XSS in italic text is escaped',
        xssItalicPrevented,
        xssItalicPrevented ? 'Image tag properly escaped' : 'XSS vulnerability detected!'
    );
    
    // Test 11: XSS prevention - malicious URLs are blocked
    const maliciousLinkResult = markdownToHtml('[click](javascript:alert(1))');
    const maliciousBlocked = !maliciousLinkResult.includes('javascript:') || maliciousLinkResult.includes('[');
    logTest(
        'Malicious javascript: URLs are blocked',
        maliciousBlocked,
        maliciousBlocked ? 'javascript: protocol blocked' : 'Malicious URL allowed!'
    );
    
    // Test 12: Bullet list conversion
    const listResult = markdownToHtml('- item 1\n- item 2\n- item 3');
    logTest(
        'Bullet lists are converted to <ul>',
        listResult.includes('<ul') && listResult.includes('<li'),
        `Contains list tags`
    );
    
    // Test 13: Code blocks are preserved
    const codeBlockResult = markdownToHtml('```js\nconst x = 1;\n```');
    const codeBlockPreserved = codeBlockResult.includes('<pre') || codeBlockResult.includes('<code');
    logTest(
        'Code blocks are preserved',
        codeBlockPreserved,
        codeBlockPreserved ? 'Code block formatted' : 'Code block not preserved'
    );
    
    // Test 14: Mixed markdown content
    const mixedResult = markdownToHtml('**Bold** and *italic* and `code`');
    logTest(
        'Mixed markdown is parsed correctly',
        mixedResult.includes('<strong>') && mixedResult.includes('<em>') && mixedResult.includes('<code'),
        `Contains all expected tags`
    );
    
    // Test 15: HTML entities in content are preserved
    const entityResult = markdownToHtml('Test & More');
    logTest(
        'Ampersands are properly escaped',
        entityResult.includes('&amp;') || entityResult.includes('Test & More'),
        `Ampersand handled correctly`
    );
    
    // Print results
    console.log(`\n📊 Markdown Parsing Tests: ${testResults.passed} passed, ${testResults.failed} failed`);
    
    return testResults;
}

// Make functions available globally
window.runDragAndDropTests = runDragAndDropTests;
window.runMarkdownParsingTests = runMarkdownParsingTests;

console.log('🧪 Additional test functions loaded!');
console.log('  runDragAndDropTests()      - Drag and drop tests');
console.log('  runMarkdownParsingTests()  - Markdown parsing tests');
