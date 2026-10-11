// Vygeneruje OG obrázek a PNG ikony z HTML šablon (vyžaduje Playwright + Chromium).
// Použití: node scripts/generate-images.mjs
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);

const og = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await og.goto(`file://${root}/scripts/og.html`);
await og.waitForTimeout(400);
await og.screenshot({ path: `${root}/public/og-image.png` });

// Apple touch ikona má vlastní pozadí, proto bez průhlednosti
for (const [size, name, omitBackground] of [
  [32, 'favicon-32.png', true],
  [180, 'apple-touch-icon.png', false],
  [192, 'icon-192.png', true],
  [512, 'icon-512.png', true],
]) {
  const p = await browser.newPage({ viewport: { width: size, height: size } });
  await p.goto(`file://${root}/scripts/icon.html`);
  await p.screenshot({ path: `${root}/public/${name}`, omitBackground });
}
await browser.close();
console.log('Hotovo: og-image.png + ikony v /public');
