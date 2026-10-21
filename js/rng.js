/* Borgo Verde – reproducible random generator (mulberry32).
 * The generator state is a plain uint32 stored in the game state, so a saved
 * game continues with the same sequence. */
(function (root) {
  'use strict';
  var BV = root.BV = root.BV || {};

  // Returns [value in [0,1), nextState].
  function next(s) {
    s = (s + 0x6D2B79F5) >>> 0;
    var t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return [((t ^ (t >>> 14)) >>> 0) / 4294967296, s];
  }

  // Operates on an object with an `rng` field (the game state).
  function random(holder) {
    var r = next(holder.rng >>> 0);
    holder.rng = r[1];
    return r[0];
  }

  function int(holder, n) {
    return Math.floor(random(holder) * n);
  }

  function shuffle(holder, arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = int(holder, i + 1);
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  BV.rng = { random: random, int: int, shuffle: shuffle };
})(typeof globalThis !== 'undefined' ? globalThis : this);
