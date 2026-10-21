/* Borgo Verde – tile catalogue (rulebook section 4).
 * Names and printed texts live in the language files, keyed by these IDs. */
(function (root) {
  'use strict';
  var BV = root.BV = root.BV || {};

  BV.CATALOG = {
    municipi: {
      castello: { id: 'mun_castello', color: '#a5452f' },  // rosso mattone
      ponte:    { id: 'mun_ponte',    color: '#3a7fb8' },  // azzurro
      mercato:  { id: 'mun_mercato',  color: '#c79a2b' },  // ocra
      stazione: { id: 'mun_stazione', color: '#1f5b3f' }   // verde bottiglia
    },

    // Same values, different pictures: each Municipio draws 4 tiles of
    // emission 1 and 2 of emission 2 (sum 8), so it always starts at 14.
    grey: [
      { id: 'gr_parcheggio',      emission: 1, copies: 2 },
      { id: 'gr_piazzale',        emission: 1, copies: 2 },
      { id: 'gr_cortile',         emission: 1, copies: 2 },
      { id: 'gr_laghetto',        emission: 1, copies: 2 },
      { id: 'gr_bosco',           emission: 1, copies: 2 },
      { id: 'gr_sfasciacarrozze', emission: 1, copies: 2 },
      { id: 'gr_cantiere',        emission: 1, copies: 2 },
      { id: 'gr_argine',          emission: 1, copies: 2 },
      { id: 'gr_distributore',    emission: 2, copies: 2 },
      { id: 'gr_deposito',        emission: 2, copies: 2 },
      { id: 'gr_discarica',       emission: 2, copies: 2 },
      { id: 'gr_fornace',         emission: 2, copies: 2 }
    ],
    greyPerMunicipio: { 1: 4, 2: 2 },   // tiles drawn per emission value

    buildings: [
      { id: 'ed_condominio', copies: 2 },
      { id: 'ed_scuola',     copies: 2 },
      { id: 'ed_uffici',     copies: 2 },
      { id: 'ed_capannone',  copies: 2 }
    ],

    infra: [
      { id: 'inf_parco',        family: 'verde',    copies: 4 },
      { id: 'inf_orto',         family: 'verde',    copies: 4 },
      { id: 'inf_bosco',        family: 'verde',    copies: 4 },
      { id: 'inf_giardino',     family: 'verde',    copies: 3 },
      { id: 'inf_ciclostazione', family: 'mobilita', copies: 3 },
      { id: 'inf_bus',          family: 'mobilita', copies: 3 },
      { id: 'inf_pedonale',     family: 'mobilita', copies: 3 },
      { id: 'inf_condivisa',    family: 'mobilita', copies: 3 },
      { id: 'inf_fotovoltaico', family: 'energia',  copies: 3 },
      { id: 'inf_eolico',       family: 'energia',  copies: 3 },
      { id: 'inf_accumulo',     family: 'energia',  copies: 3 }
    ],

    satellite: { id: 'sat_monitoraggio' },

    slotLabels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
    buildingLabels: ['E1', 'E2']
  };

  BV.CATALOG.greyById = {};
  BV.CATALOG.grey.forEach(function (g) { BV.CATALOG.greyById[g.id] = g; });
  BV.CATALOG.infraById = {};
  BV.CATALOG.infra.forEach(function (t) { BV.CATALOG.infraById[t.id] = t; });
})(typeof globalThis !== 'undefined' ? globalThis : this);
