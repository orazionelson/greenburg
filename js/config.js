/* Borgo Verde – game constants (rulebook section 11.2).
 * Kept in a single object because they will be tuned by playtesting. */
(function (root) {
  'use strict';
  var BV = root.BV = root.BV || {};

  BV.CONFIG = {
    playerCounts: [3, 4],
    firstYear: 2025,
    lastYear: 2030,
    startingCredits: 3,
    baseEmissions: 14,               // per Municipio; yearly points = base - emissions
    threshold: { 3: 10, 4: 13 },     // city threshold
    displayExtra: 1,                 // tiles revealed per year = players + this

    families: {
      verde:    { cost: 1, income: 0 },
      mobilita: { cost: 2, income: 1 },
      energia:  { cost: 3, income: 2 }
    },

    buildingEmission: 2,
    networkEmission: 1,
    reconvertCost: 4,
    renewCost: 2,
    satelliteCost: 5,
    satellitePointsPerBuilding: 3,

    privilegeDiscount: 1,            // Urbanista, Lavori pubblici (minimum cost 0)
    bilancioBonus: 1,
    progettistaCredits: 2,
    sindacoCredits: 1,
    roleAccumulation: 1,             // per unchosen role per year
    networkBonus: 1,                 // -1 emission per Municipio per completed network
    failureFactor: 0.5,              // rounded down

    municipi: ['castello', 'ponte', 'mercato', 'stazione'],
    roles: ['urbanista', 'lavori', 'bilancio', 'progettista', 'sindaco'],
    networks: ['strada', 'ferrovia'],

    ui: {
      tileOverlay: true,             // HTML name band over tile images
      autoPass: true,                // skip players with no legal action
      longPressMs: 450,
      storageKey: 'borgoVerde.save',
      langKey: 'borgoVerde.lang'
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
