/* Cache busting: every local script and stylesheet carries the package version. */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const { version } = require('../package.json');

test('index.html references local files with ?v=<package version>', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const refs = [...html.matchAll(/(?:src|href)="((?:js|css)\/[^"]+)"/g)].map(m => m[1]);
  assert.ok(refs.length >= 10);
  refs.forEach(r => {
    assert.ok(r.endsWith('?v=' + version), r);
    assert.ok(fs.existsSync(path.join(root, r.split('?')[0])), r);
  });
});

test('config.js carries the package version for image URLs', () => {
  require('../js/config.js');
  assert.equal(globalThis.BV.CONFIG.version, version);
});
