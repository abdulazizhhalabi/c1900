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

const url  = process.argv[2] || 'http://localhost:4321';
const label = process.argv[3] || '';

const browser = await chromium.launch();
const page    = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 900 });
await page.goto(url, { waitUntil: 'networkidle' });

const path = nextName(label);
await page.screenshot({ path, fullPage: true });
await browser.close();
console.log(path);
