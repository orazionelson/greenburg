/* Language files: same keys in every language, and every key used in code exists. */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

require('../js/config.js');
require('../js/i18n.js');
require('../js/i18n/it.js');
require('../js/i18n/en.js');
const BV = globalThis.BV;

function keys(obj, prefix = '') {
  return Object.keys(obj).flatMap(k => {
    const v = obj[k];
    const p = prefix ? prefix + '.' + k : k;
    return v && typeof v === 'object' ? keys(v, p) : [p];
  });
}
function has(lang, key) {
  return key.split('.').reduce((n, k) => (n == null ? n : n[k]), BV.LANG[lang]) !== undefined;
}

test('every language has the same keys', () => {
  const it = keys(BV.LANG.it).sort();
  for (const code of Object.keys(BV.LANG)) {
    assert.deepEqual(keys(BV.LANG[code]).sort(), it, 'language ' + code);
  }
});

test('placeholders match between languages', () => {
  const ph = s => (s.match(/\{\w+\}/g) || []).sort().join();
  for (const key of keys(BV.LANG.it)) {
    const ref = key.split('.').reduce((n, k) => n[k], BV.LANG.it);
    for (const code of Object.keys(BV.LANG)) {
      const v = key.split('.').reduce((n, k) => n[k], BV.LANG[code]);
      assert.equal(ph(v), ph(ref), `${code}.${key}`);
    }
  }
});

test('literal keys used in the code exist', () => {
  const root = path.join(__dirname, '..', 'js');
  const src = ['ui.js', 'app.js'].map(f => fs.readFileSync(path.join(root, f), 'utf8')).join('\n');
  const used = [...src.matchAll(/\bt\('([a-z]+\.[\w.]+)'/g)].map(m => m[1]);
  const engine = fs.readFileSync(path.join(root, 'engine.js'), 'utf8');
  const logs = [...engine.matchAll(/'(log\.\w+)'/g)].map(m => m[1]);
  assert.ok(used.length > 40 && logs.length > 10);
  for (const key of [...used, ...logs]) {
    for (const code of Object.keys(BV.LANG)) assert.ok(has(code, key), `${code}: missing ${key}`);
  }
});

test('catalogue ids all have names and texts', () => {
  require('../js/catalog.js');
  const CAT = BV.CATALOG;
  for (const code of Object.keys(BV.LANG)) {
    BV.i18n.setLang(code);
    const t = BV.i18n.t;
    CAT.grey.concat(CAT.infra).forEach(g => {
      assert.notEqual(t(`tile.${g.id}.name`), `tile.${g.id}.name`);
      assert.notEqual(t(`tile.${g.id}.text`), `tile.${g.id}.text`);
    });
    CAT.buildings.forEach(b => ['front', 'back'].forEach(s =>
      assert.notEqual(t(`tile.${b.id}.${s}.text`), `tile.${b.id}.${s}.text`)));
    BV.CONFIG.roles.forEach(r => assert.notEqual(t(`role.${r}.name`), `role.${r}.name`));
    BV.CONFIG.municipi.forEach(m => assert.notEqual(t(`municipio.${m}.name`), `municipio.${m}.name`));
  }
  BV.i18n.setLang('it');
});

test('every tile image referenced by the catalogue exists', () => {
  const dir = path.join(__dirname, '..', 'assets', 'tiles');
  const CAT = BV.CATALOG;
  const files = []
    .concat(CAT.grey.map(g => g.id), CAT.infra.map(i => i.id))
    .concat(CAT.buildings.flatMap(b => [b.id + '_front', b.id + '_back']))
    .concat(BV.CONFIG.networks.flatMap(n => [`rete_${n}_front`, `rete_${n}_back`, `token_rete_${n}`]))
    .concat(BV.CONFIG.roles.map(r => 'ruolo_' + r), BV.CONFIG.municipi.map(m => 'mun_' + m))
    .concat(['sat_monitoraggio', 'token_chiave']);
  files.forEach(f => assert.ok(fs.existsSync(path.join(dir, f + '.svg')), f));
});
