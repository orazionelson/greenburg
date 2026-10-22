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

    // Investment cards: bought with Public works, one copy each, scored at the
    // end of the game. `per`/`max`/`base` are the scoring numbers (engine:
    // investmentPoints), kept here so they can be tuned by playtesting.
    investments: [
      { id: 'sat_monitoraggio',   cost: 5, per: 4, max: 8 },   // per decarbonised building
      { id: 'inv_partecipazione', cost: 5, per: 2, max: 8 },   // per Green infrastructure
      { id: 'inv_sanita',         cost: 5, base: 7 },          // base - own emissions
      { id: 'inv_circolare',      cost: 5, per: 3, max: 6 },   // per emission-2 area turned into Mobility/Energy
      { id: 'inv_patto',          cost: 4, base: 4, per: 2, max: 8 }, // if the city succeeds, + per year ahead of 2030
      { id: 'inv_digitale',       cost: 5, per: 2, max: 10 }   // per kind of intervention done
    ],

    slotLabels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
    buildingLabels: ['E1', 'E2']
  };

  BV.CATALOG.greyById = {};
  BV.CATALOG.grey.forEach(function (g) { BV.CATALOG.greyById[g.id] = g; });
  BV.CATALOG.investmentById = {};
  BV.CATALOG.investments.forEach(function (c) { BV.CATALOG.investmentById[c.id] = c; });
  BV.CATALOG.infraById = {};
  BV.CATALOG.infra.forEach(function (t) { BV.CATALOG.infraById[t.id] = t; });
})(typeof globalThis !== 'undefined' ? globalThis : this);
