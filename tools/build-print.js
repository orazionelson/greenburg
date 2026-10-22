#!/usr/bin/env node
/* Renders print.html to ready-made A4 PDFs, one per language, in
 * print-and-play/. Needs Playwright with Chromium, which is not a dependency
 * of the game: install it with `npm install --no-save playwright`, or point
 * NODE_PATH at an existing installation. */
'use strict';
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

let chromium;
try {
  ({ chromium } = require('playwright'));
} catch (e) {
  console.error('Playwright not found: run `npm install --no-save playwright` or set NODE_PATH.');
  process.exit(1);
}

const root = path.join(__dirname, '..');
const out = path.join(root, 'print-and-play');
const FILES = { it: 'borgo-verde-stampa-e-gioca.pdf', en: 'greenburg-print-and-play.pdf' };

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const [lang, file] of Object.entries(FILES)) {
    const url = pathToFileURL(path.join(root, 'print.html'));
    url.searchParams.set('lang', lang);
    await page.goto(url.href, { waitUntil: 'load' });
    await page.waitForFunction(() => [...document.images].every(i => i.complete));
    await page.pdf({ path: path.join(out, file), preferCSSPageSize: true, printBackground: true });
    console.log('Written', path.relative(root, path.join(out, file)));
  }
  await browser.close();
})();
