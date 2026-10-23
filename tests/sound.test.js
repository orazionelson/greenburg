/* Sound effects: safe to call where there is no Web Audio (Node, old browsers). */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');

require('../js/sound.js');
const sound = globalThis.BV.sound;

test('the game sounds exist', () => {
  for (const name of ['turn', 'take', 'place', 'flip']) assert.ok(sound.names.includes(name), name);
});

test('play() does nothing without Web Audio, and the switch works', () => {
  assert.equal(sound.enabled, true);
  assert.doesNotThrow(() => sound.names.forEach(n => sound.play(n, 0.2)));
  sound.setEnabled(false);
  assert.equal(sound.enabled, false);
  assert.doesNotThrow(() => sound.play('turn'));
  sound.setEnabled(true);
});
