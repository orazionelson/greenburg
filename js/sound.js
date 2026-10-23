/* Borgo Verde – sound effects.
 * Synthesised with the Web Audio API, so the game needs no audio files and
 * still works offline and from file://. Browsers only allow sound after a click
 * or a key press, and every sound here follows one. Without Web Audio (or in
 * Node, for the tests) play() does nothing. */
(function (root) {
  'use strict';
  var BV = root.BV = root.BV || {};

  var ctx = null, out = null, enabled = true;
  var VOLUME = 0.9;

  function audio() {
    if (!ctx) {
      var AC = root.AudioContext || root.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      out = ctx.createGain();
      out.gain.value = VOLUME;
      out.connect(ctx.destination);
    }
    if (ctx.state === 'suspended' && ctx.resume) ctx.resume().catch(function () {});
    return ctx;
  }

  // A note with a quick attack and an exponential decay; `to` bends the pitch.
  function tone(a, t0, freq, dur, gain, type, to) {
    var o = a.createOscillator(), g = a.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t0);
    if (to) o.frequency.exponentialRampToValueAtTime(to, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g);
    g.connect(out);
    o.start(t0);
    o.stop(t0 + dur + 0.02);
  }

  // Band-passed noise sweeping from `from` to `to` Hz: card and paper sounds.
  function swish(a, t0, dur, from, to, gain) {
    var len = Math.ceil(a.sampleRate * dur);
    var buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    var src = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    src.buffer = buf;
    f.type = 'bandpass';
    f.Q.value = 1.4;
    f.frequency.setValueAtTime(from, t0);
    f.frequency.exponentialRampToValueAtTime(to, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + dur * 0.3);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(f);
    f.connect(g);
    g.connect(out);
    src.start(t0);
    src.stop(t0 + dur);
  }

  var SOUNDS = {
    // A player's turn begins: two-note bell.
    turn: function (a, t0) {
      [[659.3, 0], [987.8, 0.13]].forEach(function (n) {
        tone(a, t0 + n[1], n[0], 0.9, 0.22);
        tone(a, t0 + n[1], n[0] * 2, 0.4, 0.05);
      });
    },
    // A tile or card picked up from the table.
    take: function (a, t0) {
      swish(a, t0, 0.13, 1500, 4200, 0.8);
      tone(a, t0 + 0.1, 1400, 0.05, 0.06, 'triangle');
    },
    // A tile laid on the board: a light knock.
    place: function (a, t0) {
      swish(a, t0, 0.05, 1200, 500, 0.45);
      tone(a, t0, 190, 0.16, 0.4, 'sine', 110);
    },
    // A tile turned over: swish, then the tile lands on its other side.
    flip: function (a, t0) {
      swish(a, t0, 0.16, 700, 3800, 0.45);
      swish(a, t0 + 0.15, 0.05, 1100, 500, 0.4);
      tone(a, t0 + 0.15, 240, 0.14, 0.35, 'sine', 140);
    }
  };

  BV.sound = {
    names: Object.keys(SOUNDS),
    get enabled() { return enabled; },
    setEnabled: function (on) { enabled = !!on; },
    // `delay` in seconds, to let one sound follow another.
    play: function (name, delay) {
      if (!enabled || !SOUNDS[name]) return;
      try {
        var a = audio();
        if (a) SOUNDS[name](a, a.currentTime + 0.01 + (delay || 0));
      } catch (e) { /* no sound is better than a broken game */ }
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
