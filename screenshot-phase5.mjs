import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

const dir = resolve('./temporary-screenshots');
function next(label='') {
  const n = String((readdirSync(dir).filter(f=>f.endsWith('.png')).length)+1).padStart(3,'0');
  return join(dir, label ? `${n}-${label}.png` : `${n}.png`);
}

const browser = await chromium.launch();

async function shot(url, label, width=1280, height=900) {
  const page = await browser.newPage();
  await page.setViewportSize({ width, height });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.screenshot({ path: next(label), fullPage: true });
  await page.close();
}

// Desktop
await shot('http://localhost:4321',                                     'home-desktop-r1');
await shot('http://localhost:4321/topics/fixed-income',                 'fixed-income-desktop');
await shot('http://localhost:4321/topics/portfolio-management',         'portfolio-mgmt-desktop');

// Mobile
await shot('http://localhost:4321',                                     'home-mobile-r1',     375, 812);
await shot('http://localhost:4321/topics/ethical-professional-standards','ethics-mobile',      375, 812);

// Tablet
await shot('http://localhost:4321',                                     'home-tablet-r1',     768, 1024);

await browser.close();
console.log('Done');
