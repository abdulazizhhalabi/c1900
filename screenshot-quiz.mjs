import { chromium } from 'playwright';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

const dir = resolve('./temporary-screenshots');
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

function nextName(label = '') {
  const files = existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith('.png')) : [];
  const n = String(files.length + 1).padStart(3, '0');
  return join(dir, label ? `${n}-${label}.png` : `${n}.png`);
}

const browser = await chromium.launch();
const page    = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 900 });

const base = 'http://localhost:4321/topics/ethical-professional-standards';

// 1. Idle state
await page.goto(base, { waitUntil: 'networkidle' });
await page.screenshot({ path: nextName('quiz-idle'), fullPage: false });

// 2. Answering — click Start, then pick option B
await page.click('.quiz-primary-btn');
await page.waitForTimeout(300);
const opts = page.locator('.quiz-option-btn');
await opts.nth(1).click(); // pick B
await page.waitForTimeout(300);
await page.screenshot({ path: nextName('quiz-answering'), fullPage: false });

// 3. Submit last question and see results
await page.click('.quiz-primary-btn'); // next Q2
await page.waitForTimeout(200);
await page.locator('.quiz-option-btn').nth(0).click(); // pick A
await page.waitForTimeout(200);
await page.click('.quiz-primary-btn'); // next Q3
await page.waitForTimeout(200);
await page.locator('.quiz-option-btn').nth(1).click(); // pick B  
await page.waitForTimeout(200);
await page.click('.quiz-primary-btn'); // See Results
await page.waitForTimeout(500);
await page.screenshot({ path: nextName('quiz-results'), fullPage: true });

await browser.close();
console.log('Done');
