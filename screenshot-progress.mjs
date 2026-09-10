import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

const dir = resolve('./temporary-screenshots');
function nextName(label = '') {
  const files = existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith('.png')) : [];
  const n = String(files.length + 1).padStart(3, '0');
  return join(dir, label ? `${n}-${label}.png` : `${n}.png`);
}

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 900 });

// 1. Home with no progress
await page.goto('http://localhost:4321', { waitUntil: 'networkidle' });
await page.screenshot({ path: nextName('home-no-progress') });

// 2. Complete a quiz (Ethics) to trigger localStorage save
await page.goto('http://localhost:4321/topics/ethical-professional-standards', { waitUntil: 'networkidle' });
// Scroll to quiz and start
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(500);
await page.click('.quiz-primary-btn');
await page.waitForTimeout(300);
// Answer all 3 questions (B, C, B)
for (const ans of [1, 2, 1]) { // B=index1, C=index2, B=index1
  await page.locator('.quiz-option-btn').nth(ans).click();
  await page.waitForTimeout(250);
  await page.click('.quiz-primary-btn');
  await page.waitForTimeout(300);
}
await page.waitForTimeout(600);

// 3. Go back home — should now show progress
await page.goto('http://localhost:4321', { waitUntil: 'networkidle' });
await page.screenshot({ path: nextName('home-with-progress') });

// 4. Idle quiz state now shows "Last: X/3" badge
await page.goto('http://localhost:4321/topics/ethical-professional-standards', { waitUntil: 'networkidle' });
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(400);
await page.screenshot({ path: nextName('quiz-idle-with-score') });

await browser.close();
console.log('Done');
