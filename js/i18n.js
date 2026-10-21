/* Borgo Verde – translation helper.
 * t('ui.deck', { n: 3 }) looks the key up in the current language, falls back
 * to Italian, then to the key itself. */
(function (root) {
  'use strict';
  var BV = root.BV = root.BV || {};

  var current = 'it';

  function lookup(lang, path) {
    var node = BV.LANG[lang];
    var parts = path.split('.');
    for (var i = 0; i < parts.length; i++) {
      if (node == null) return undefined;
      node = node[parts[i]];
    }
    return node;
  }

  function t(path, params) {
    var s = lookup(current, path);
    if (s === undefined) s = lookup('it', path);
    if (typeof s !== 'string') return s === undefined ? path : s;
    if (!params) return s;
    return s.replace(/\{(\w+)\}/g, function (m, k) {
      return params[k] !== undefined ? String(params[k]) : m;
    });
  }

  BV.i18n = {
    t: t,
    get lang() { return current; },
    languages: function () { return Object.keys(BV.LANG); },
    setLang: function (code) { if (BV.LANG[code]) current = code; }
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
