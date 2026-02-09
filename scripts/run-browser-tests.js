/**
 * Minimal CI test runner: serves the repo, opens task-manager.html in headless
 * Chromium, loads docs/architecture/tests/unit-tests.js and runs runAllTests(),
 * then exits with code 0 if all pass, 1 otherwise.
 * Requires: npm install playwright serve
 * Usage: node scripts/run-browser-tests.js
 * Assumes the app is already served at BASE_URL (e.g. http://127.0.0.1:3000).
 */

const { chromium } = require('playwright');

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:3000';

async function main() {
  let browser;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(`${BASE_URL}/task-manager.html`, { waitUntil: 'networkidle', timeout: 10000 });
    const result = await page.evaluate(async () => {
      const url = `${window.location.origin}/docs/architecture/tests/unit-tests.js`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch tests: ${res.status}`);
      const code = await res.text();
      eval(code);
      if (typeof runAllTests !== 'function') throw new Error('runAllTests not defined');
      return await runAllTests();
    });
    await browser.close();
    if (result.totalFailed > 0) {
      console.error('Tests failed:', result.totalFailed);
      process.exit(1);
    }
    console.log('All tests passed:', result.totalPassed);
    process.exit(0);
  } catch (err) {
    console.error(err);
    if (browser) await browser.close();
    process.exit(1);
  }
}

main();
