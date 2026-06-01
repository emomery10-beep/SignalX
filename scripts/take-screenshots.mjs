// Take screenshots of AskBiz public pages using Playwright
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '../public/images/training');

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 820 } });
const page = await ctx.newPage();

const shots = [
  { url: 'https://askbiz.co/pricing',    name: 'pricing-page.png',     wait: 2000 },
  { url: 'https://askbiz.co/free-tools', name: 'free-tools-page.png',  wait: 2000 },
  { url: 'https://askbiz.co/free-tools/landed-cost-calculator', name: 'landed-cost-calculator.png', wait: 2000 },
];

for (const { url, name, wait } of shots) {
  console.log(`Screenshotting ${url}…`);
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(wait);
  await page.screenshot({ path: `${OUT}/${name}`, fullPage: false });
  console.log(`  ✓ saved ${name}`);
}

await browser.close();
console.log('Done.');
