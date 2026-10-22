/* Cache busting: every local script and stylesheet carries the package version. */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const { version } = require('../package.json');

for (const [page, min] of [['index.html', 10], ['print.html', 6]]) {
  test(`${page} references local files with ?v=<package version>`, () => {
    const html = fs.readFileSync(path.join(root, page), 'utf8');
    const refs = [...html.matchAll(/(?:src|href)="((?:js|css)\/[^"]+)"/g)].map(m => m[1]);
    assert.ok(refs.length >= min);
    refs.forEach(r => {
      assert.ok(r.endsWith('?v=' + version), r);
      assert.ok(fs.existsSync(path.join(root, r.split('?')[0])), r);
    });
  });
}

test('config.js carries the package version for image URLs', () => {
  require('../js/config.js');
  assert.equal(globalThis.BV.CONFIG.version, version);
});
