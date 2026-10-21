/* Greenburg – English strings. */
(function (root) {
  'use strict';
  var BV = root.BV = root.BV || {};
  BV.LANG = BV.LANG || {};

  BV.LANG.en = {
    meta: { code: 'en', label: 'English' },

    app: {
      title: 'Greenburg',
      tagline: 'Six years to transform the city'
    },

    ui: {
      newGame: 'New game',
      resume: 'Resume saved game',
      savedInfo: 'Saved game: year {year}, {players} players',
      start: 'Start',
      players: 'Players',
      playerName: 'Player {n} name',
      defaultPlayer: 'Player {n}',
      seed: 'Random seed (optional)',
      seedHint: 'The same seed reproduces the same setup.',
      language: 'Language',
      confirmNew: 'Abandon the current game and start a new one?',
      year: 'Year',
      city: 'City',
      cityEmissions: 'City emissions',
      threshold: 'Threshold',
      display: 'Display',
      deck: 'Deck: {n}',
      discard: 'Discard: {n}',
      roles: 'Roles',
      roleCredits: 'Credits on the card: {n}',
      chosenBy: 'Chosen by {player}',
      satellite: 'Satellite',
      ownedBy: 'Owned by {player}',
      available: 'Available',
      networks: 'Networks',
      keyHolder: 'Key to the City',
      credits: 'Credits',
      emissions: 'Emissions',
      points: 'Points',
      income: 'Income',
      log: 'Log',
      logAll: 'All years',
      logYear: 'This year',
      pass: 'Pass',
      cancel: 'Clear selection',
      current: 'Current',
      chooseRolePrompt: '{player}, choose a role.',
      urbanistaPrompt: '{player}: pick a tile from the display, then one of your grey tiles to build on.',
      urbanistaSlotPrompt: '{player}: pick the grey tile to build {tile} on (cost {cost}).',
      lavoriPrompt: '{player}: retrofit a building, renew a network section or buy the satellite.',
      reconvertOption: 'Retrofit {tile} · {cost}',
      renewOption: 'Renew {network} · {cost}',
      satelliteOption: 'Buy the satellite · {cost}',
      privilegeNote: 'You chose this role: −1 to the cost.',
      roleAction: 'Everyone',
      rolePrivilege: 'Privilege',
      cost: 'Cost',
      emission: 'Emission',
      reduction: 'Reduction',
      family: 'Family',
      side: 'Side',
      noAction: 'None',
      gameOver: 'Game over',
      citySuccess: 'The city made it! Emissions {emissions}, threshold {threshold}.',
      cityFailure: 'The city failed: emissions {emissions}, threshold {threshold}. All scores are halved.',
      ranking: 'Ranking',
      winner: '{names} wins',
      winners: 'Shared victory: {names}',
      partialWin: 'An individual victory in a city that failed is only a partial result.',
      satelliteBonus: 'Satellite',
      subtotal: 'Total',
      halved: 'Halved',
      final: 'Final',
      rank: 'Rank',
      player: 'Player',
      viewBoard: 'View the board',
      showResults: 'Results',
      yearEnd: 'End of {year}',
      yearEndBody: 'City emissions: {emissions} (threshold {threshold}).',
      continue: 'Continue',
      emissionsTrack: 'Emissions {value} / 14',
      tileInfo: 'Hover over or long-press a tile for details.',
      reconvertCost: 'Retrofit cost',
      renewCost: 'Renewal cost',
      countsForSatellite: 'Counts for the satellite bonus.',
      owner: 'Owner',
      crest: 'Crest',
      effect: 'Effect'
    },

    family: {
      verde: 'Green',
      mobilita: 'Mobility',
      energia: 'Energy'
    },

    municipio: {
      castello: { name: 'Castle District', short: 'Castle', crest: 'Crenellated tower', text: 'The oldest district, grown up around the walls.' },
      ponte:    { name: 'Bridge District',  short: 'Bridge', crest: 'Arched bridge over a stream', text: 'The district that joins the two banks of the stream.' },
      mercato:  { name: 'Market District',  short: 'Market', crest: 'Scales', text: 'The district of workshops and weekly markets.' },
      stazione: { name: 'Station District', short: 'Station', crest: 'Winged wheel', text: 'The district that grew up around the railway yard.' }
    },

    tile: {
      gr_parcheggio: { name: 'Surface car park', text: 'An always-full tarmac car park that soaks up heat in summer and floods when it rains.' },
      gr_piazzale: { name: 'Tarmac square', text: 'A wide square with no shade, used for the market once a week and empty the rest of the time.' },
      gr_cortile: { name: 'Concrete courtyard', text: 'A fully concreted inner courtyard where rainwater is not absorbed and runs straight into the sewer.' },
      gr_terreno: { name: 'Derelict land', text: 'An abandoned plot of rubbish and compacted soil where nothing grows any more.' },
      gr_distributore: { name: 'Petrol station', text: 'A petrol and diesel station with an endless queue of waiting cars.' },
      gr_deposito: { name: 'Diesel bus depot', text: 'A depot of diesel buses that leave at dawn trailing a plume of smoke.' },

      ed_condominio: {
        front: { name: '1960s apartment block', text: 'Six storeys of uninsulated walls and a central diesel boiler.' },
        back: { name: 'Retrofitted apartment block', text: 'External insulation, a heat pump and solar panels on the roof.' }
      },
      ed_scuola: {
        front: { name: 'School with oil boiler', text: 'A primary school heated by an old boiler, with a fully tarmacked playground.' },
        back: { name: 'Sustainable school', text: 'A heat pump, a green roof and a playground turned into a teaching garden.' }
      },
      ed_uffici: {
        front: { name: 'Office block', text: 'A fully glazed façade, air conditioning always on and lights on even at night.' },
        back: { name: 'High-efficiency offices', text: 'Sunshades, insulating glass and solar panels built into the façade.' }
      },
      ed_capannone: {
        front: { name: 'Craft workshop', text: 'A workshop with a sheet-metal roof and gas heating, open six days a week.' },
        back: { name: 'Solar workshop', text: 'A solar roof that powers the workshop and supplies energy to the neighbours.' }
      },

      inf_parco: { name: 'Urban park', text: 'Grass, trees and benches where there used to be concrete.' },
      inf_orto: { name: 'Community garden', text: 'Vegetable plots tended by the district\'s residents, with a shared compost bin.' },
      inf_bosco: { name: 'Urban woodland', text: 'A small wood of native species that gives shade and keeps water in the soil.' },
      inf_giardino: { name: 'Rain garden', text: 'A planted hollow that collects rainwater and slowly returns it to the ground.' },
      inf_ciclostazione: { name: 'Bike station', text: 'Secure bicycle parking with a repair shop and charging points for e-bikes.' },
      inf_bus: { name: 'Electric bus stop', text: 'A covered stop with electric buses every ten minutes and a live arrivals board.' },
      inf_pedonale: { name: 'Pedestrian zone', text: 'A street given back to pedestrians, with trees, seating and outdoor tables.' },
      inf_condivisa: { name: 'Shared mobility', text: 'Shared electric cars and bicycles, booked from your phone.' },
      inf_fotovoltaico: { name: 'Solar farm', text: 'Solar panels on reclaimed land, with a wildflower meadow between the rows.' },
      inf_eolico: { name: 'Urban micro-wind', text: 'Small vertical-axis wind turbines, quiet and suited to the city.' },
      inf_accumulo: { name: 'Community storage', text: 'Shared batteries that store the energy produced by day for use in the evening.' },

      sat_monitoraggio: {
        name: 'Satellite monitoring',
        text: 'The satellite watches the district\'s roofs and heat and certifies its decarbonised buildings.',
        effect: 'At the end of the game, 3 points for each decarbonised building in the owner\'s district.'
      }
    },

    network: {
      strada: {
        name: 'road',
        Name: 'Road',
        front: { name: 'Run-down road', text: 'Cracked tarmac, potholes and traffic jams at every hour of the day.' },
        back: { name: 'Renewed road', text: 'A protected cycle lane, trees along both sides and electric buses.' },
        token: 'Network completed: road'
      },
      ferrovia: {
        name: 'railway',
        Name: 'Railway',
        front: { name: 'Neglected railway', text: 'Rusty rails, rotten sleepers and diesel trains that are always late.' },
        back: { name: 'Renewed railway', text: 'New tracks, an electrified line and a train every fifteen minutes.' },
        token: 'Network completed: railway'
      },
      completedNote: 'Network completed: −1 to every district\'s emissions.',
      notCompletedNote: 'Completed when every section has been renewed.'
    },

    role: {
      urbanista: { name: 'Urban Planner', action: 'Build an infrastructure on a grey land tile.', privilege: '−1 to the cost.' },
      lavori: { name: 'Public Works Councillor', short: 'Public Works', action: 'Retrofit a building, or renew a network section, or buy the satellite.', privilege: '−1 to the cost.' },
      bilancio: { name: 'Budget Councillor', short: 'Budget', action: 'Collect infrastructure income.', privilege: '+1 credit.' },
      progettista: { name: 'EU Grant Writer', short: 'Grant Writer', action: 'None.', privilege: '2 credits.' },
      sindaco: { name: 'Mayor', action: 'None.', privilege: '1 credit and the Key to the City.' }
    },

    log: {
      setup: 'Setup: {players} players, city threshold {threshold}, seed {seed}.',
      yearStart: 'The year begins. Key to the City: {player}.',
      reshuffle: 'Deck exhausted: the discard pile is reshuffled.',
      chooseRole: '{player} chooses {role} and takes {credits} credits from the card.',
      income: '{player} collects {income} income +{bonus}.',
      progettista: '{player} collects {credits} credits.',
      sindaco: '{player} collects {credits} credit and takes the Key to the City.',
      placeInfra: '{player} builds {tile} on {grey} ({slot}) for {cost}: emissions −{reduction}.',
      reconvert: '{player} retrofits {tile} for {cost}.',
      renew: '{player} renews their {network} section for {cost}.',
      buySatellite: '{player} buys Satellite monitoring for {cost}.',
      pass: '{player} passes.',
      autoPass: '{player} has no possible action and passes.',
      networkCompleted: 'Network completed: {network}! −1 to every district\'s emissions.',
      yearPoints: '{player}: emissions {emissions}, +{points} points (total {total}).',
      cityEmissions: 'City emissions: {emissions} (threshold {threshold}).',
      keyPasses: 'Nobody chose the Mayor: the Key passes to {player}.',
      citySuccess: 'The city is below the threshold: collective success!',
      cityFailure: 'End of 2030 above the threshold: the city failed, scores halved.'
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
