/* Borgo Verde – stringhe in italiano. */
(function (root) {
  'use strict';
  var BV = root.BV = root.BV || {};
  BV.LANG = BV.LANG || {};

  BV.LANG.it = {
    meta: { code: 'it', label: 'Italiano' },

    app: {
      title: 'Borgo Verde',
      tagline: 'Sei anni per trasformare la città'
    },

    ui: {
      newGame: 'Nuova partita',
      resume: 'Riprendi la partita salvata',
      savedInfo: 'Partita salvata: anno {year}, {players} giocatori',
      start: 'Inizia',
      players: 'Giocatori',
      playerName: 'Nome del giocatore {n}',
      defaultPlayer: 'Giocatore {n}',
      seed: 'Seme casuale (facoltativo)',
      seedHint: 'Lo stesso seme riproduce la stessa preparazione.',
      language: 'Lingua',
      confirmNew: 'Abbandonare la partita in corso e iniziarne una nuova?',
      year: 'Anno',
      city: 'Città',
      cityEmissions: 'Emissioni della città',
      threshold: 'Soglia',
      display: 'Esposizione',
      deck: 'Mazzo: {n}',
      discard: 'Scarti: {n}',
      roles: 'Ruoli',
      roleCredits: 'Crediti sulla carta: {n}',
      chosenBy: 'Scelto da {player}',
      satellite: 'Satellite',
      ownedBy: 'Di {player}',
      available: 'Disponibile',
      networks: 'Reti',
      keyHolder: 'Chiave della città',
      credits: 'Crediti',
      emissions: 'Emissioni',
      points: 'Punti',
      income: 'Rendita',
      log: 'Registro',
      logAll: 'Tutti gli anni',
      logYear: 'Anno in corso',
      pass: 'Rinuncia',
      cancel: 'Annulla selezione',
      current: 'Di turno',
      chooseRolePrompt: '{player}, scegli un ruolo.',
      urbanistaPrompt: '{player}: scegli una tessera dell\'esposizione, poi una tua tessera grigia su cui posarla.',
      urbanistaSlotPrompt: '{player}: scegli la tessera grigia su cui posare {tile} (costo {cost}).',
      lavoriPrompt: '{player}: riconverti un edificio, rinnova un tratto di rete o acquista il satellite.',
      reconvertOption: 'Riconverti {tile} · {cost}',
      renewOption: 'Rinnova {network} · {cost}',
      satelliteOption: 'Acquista il satellite · {cost}',
      privilegeNote: 'Hai scelto il ruolo: −1 al costo.',
      roleAction: 'Per tutti',
      rolePrivilege: 'Privilegio',
      cost: 'Costo',
      emission: 'Emissione',
      reduction: 'Riduzione',
      family: 'Famiglia',
      side: 'Lato',
      noAction: 'Nessuna',
      gameOver: 'Fine della partita',
      citySuccess: 'La città ce l\'ha fatta! Emissioni {emissions}, soglia {threshold}.',
      cityFailure: 'La città ha fallito: emissioni {emissions}, soglia {threshold}. I punteggi sono dimezzati.',
      ranking: 'Classifica',
      winner: 'Vince {names}',
      winners: 'Vittoria condivisa: {names}',
      partialWin: 'Una vittoria individuale in una città che ha fallito vale come un risultato parziale.',
      satelliteBonus: 'Satellite',
      subtotal: 'Totale',
      halved: 'Dimezzato',
      final: 'Finale',
      rank: 'Pos.',
      player: 'Giocatore',
      viewBoard: 'Guarda il tabellone',
      showResults: 'Risultati',
      yearEnd: 'Chiusura del {year}',
      yearEndBody: 'Emissioni della città: {emissions} (soglia {threshold}).',
      continue: 'Continua',
      emissionsTrack: 'Emissioni {value} / 14',
      tileInfo: 'Tieni premuto o passa sopra una tessera per i dettagli.',
      reconvertCost: 'Costo di riconversione',
      renewCost: 'Costo di rinnovo',
      countsForSatellite: 'Conta per il bonus del satellite.',
      owner: 'Proprietario',
      crest: 'Stemma',
      effect: 'Effetto'
    },

    family: {
      verde: 'Verde',
      mobilita: 'Mobilità',
      energia: 'Energia'
    },

    municipio: {
      castello: { name: 'Municipio del Castello', short: 'Castello', crest: 'Torre merlata', text: 'Il Municipio più antico, cresciuto intorno alle mura.' },
      ponte:    { name: 'Municipio del Ponte',    short: 'Ponte',    crest: 'Ponte ad arco su un torrente', text: 'Il Municipio che unisce le due sponde del torrente.' },
      mercato:  { name: 'Municipio del Mercato',  short: 'Mercato',  crest: 'Bilancia', text: 'Il Municipio delle botteghe e dei mercati settimanali.' },
      stazione: { name: 'Municipio della Stazione', short: 'Stazione', crest: 'Ruota alata', text: 'Il Municipio nato intorno allo scalo ferroviario.' }
    },

    tile: {
      gr_parcheggio: { name: 'Parcheggio a raso', text: 'Parcheggio asfaltato sempre pieno, che d\'estate accumula calore e con la pioggia si allaga.' },
      gr_piazzale: { name: 'Piazzale asfaltato', text: 'Ampio piazzale senza ombra, usato per il mercato una volta alla settimana e vuoto il resto del tempo.' },
      gr_cortile: { name: 'Cortile cementato', text: 'Cortile interno interamente cementato, dove l\'acqua piovana non viene assorbita e finisce subito in fognatura.' },
      gr_laghetto: { name: 'Laghetto sporco', text: 'Laghetto dimenticato, coperto di schiuma e rifiuti, dove l\'acqua ferma non ospita più alcuna vita.' },
      gr_distributore: { name: 'Distributore di carburante', text: 'Stazione di servizio a benzina e gasolio, con una coda continua di auto in attesa.' },
      gr_deposito: { name: 'Deposito di autobus diesel', text: 'Rimessa di autobus a gasolio che escono all\'alba lasciando dietro di sé una scia di fumo.' },

      ed_condominio: {
        front: { name: 'Condominio anni Sessanta', text: 'Sei piani di pareti non isolate e una caldaia centralizzata a gasolio.' },
        back: { name: 'Condominio riqualificato', text: 'Cappotto termico, pompa di calore e pannelli solari sul tetto.' }
      },
      ed_scuola: {
        front: { name: 'Scuola con caldaia a gasolio', text: 'Scuola elementare riscaldata da una vecchia caldaia, con il cortile interamente asfaltato.' },
        back: { name: 'Scuola sostenibile', text: 'Pompa di calore, tetto verde e cortile trasformato in giardino didattico.' }
      },
      ed_uffici: {
        front: { name: 'Palazzo per uffici', text: 'Facciata interamente vetrata, condizionatori sempre accesi e luci accese anche di notte.' },
        back: { name: 'Uffici ad alta efficienza', text: 'Frangisole, vetri isolanti e impianto fotovoltaico integrato in facciata.' }
      },
      ed_capannone: {
        front: { name: 'Capannone artigianale', text: 'Capannone con tetto in lamiera e riscaldamento a gas, aperto sei giorni su sette.' },
        back: { name: 'Capannone fotovoltaico', text: 'Copertura fotovoltaica che alimenta l\'officina e cede energia al vicinato.' }
      },

      inf_parco: { name: 'Parco urbano', text: 'Prato, alberi e panchine dove prima c\'era cemento.' },
      inf_orto: { name: 'Orto condiviso', text: 'Orti coltivati dagli abitanti del Municipio, con una compostiera comune.' },
      inf_bosco: { name: 'Bosco urbano', text: 'Piccolo bosco di specie autoctone che fa ombra e trattiene l\'acqua nel suolo.' },
      inf_giardino: { name: 'Giardino della pioggia', text: 'Avvallamento piantumato che raccoglie l\'acqua piovana e la restituisce lentamente al suolo.' },
      inf_ciclostazione: { name: 'Ciclostazione', text: 'Deposito custodito per biciclette, con officina e punto di ricarica per le bici elettriche.' },
      inf_bus: { name: 'Fermata del bus elettrico', text: 'Fermata coperta con bus elettrici ogni dieci minuti e tabellone degli arrivi in tempo reale.' },
      inf_pedonale: { name: 'Zona pedonale', text: 'Strada restituita ai pedoni, con alberi, sedute e tavolini all\'aperto.' },
      inf_condivisa: { name: 'Mobilità condivisa', text: 'Auto elettriche e biciclette in condivisione, prenotabili dal telefono.' },
      inf_fotovoltaico: { name: 'Campo fotovoltaico', text: 'Pannelli solari su un\'area recuperata, con prato fiorito fra le file.' },
      inf_eolico: { name: 'Minieolico urbano', text: 'Piccole turbine eoliche ad asse verticale, silenziose e adatte alla città.' },
      inf_accumulo: { name: 'Accumulo di comunità', text: 'Batterie condivise che conservano l\'energia prodotta di giorno per usarla la sera.' },

      sat_monitoraggio: {
        name: 'Monitoraggio satellitare',
        text: 'Il satellite osserva i tetti e il calore del Municipio e certifica gli edifici decarbonizzati.',
        effect: 'A fine partita, 3 punti per ogni edificio decarbonizzato del Municipio proprietario.'
      }
    },

    network: {
      strada: {
        name: 'strada',
        Name: 'Strada',
        front: { name: 'Strada dissestata', text: 'Asfalto crepato, buche e code a ogni ora del giorno.' },
        back: { name: 'Strada rinnovata', text: 'Corsia ciclabile protetta, alberi lungo i lati e bus elettrici.' },
        token: 'Rete completata, strada'
      },
      ferrovia: {
        name: 'ferrovia',
        Name: 'Ferrovia',
        front: { name: 'Ferrovia in abbandono', text: 'Binari arrugginiti, traversine marce e treni diesel sempre in ritardo.' },
        back: { name: 'Ferrovia rinnovata', text: 'Binari nuovi, linea elettrificata e un treno ogni quindici minuti.' },
        token: 'Rete completata, ferrovia'
      },
      completedNote: 'Rete completata: −1 alle emissioni di ogni Municipio.',
      notCompletedNote: 'Si completa quando tutti i tratti sono rinnovati.'
    },

    role: {
      urbanista: { name: 'Urbanista', action: 'Posa un\'infrastruttura su una tessera grigia territoriale.', privilege: '−1 al costo.' },
      lavori: { name: 'Assessore ai lavori pubblici', short: 'Lavori pubblici', action: 'Riconverte un edificio, oppure rinnova un tratto di rete, oppure acquista il satellite.', privilege: '−1 al costo.' },
      bilancio: { name: 'Assessore al bilancio', short: 'Bilancio', action: 'Incassa la rendita delle infrastrutture.', privilege: '+1 credito.' },
      progettista: { name: 'Progettista europeo', short: 'Progettista', action: 'Nessuna.', privilege: '2 crediti.' },
      sindaco: { name: 'Sindaco', action: 'Nessuna.', privilege: '1 credito e Chiave della città.' }
    },

    log: {
      setup: 'Preparazione: {players} giocatori, soglia della città {threshold}, seme {seed}.',
      yearStart: 'Inizia l\'anno. Chiave della città: {player}.',
      reshuffle: 'Mazzo esaurito: gli scarti sono rimescolati.',
      chooseRole: '{player} sceglie {role} e prende {credits} crediti dalla carta.',
      income: '{player} incassa {income} di rendita +{bonus}.',
      progettista: '{player} incassa {credits} crediti.',
      sindaco: '{player} incassa {credits} credito e prende la Chiave della città.',
      placeInfra: '{player} posa {tile} su {grey} ({slot}) pagando {cost}: emissioni −{reduction}.',
      reconvert: '{player} riconverte {tile} pagando {cost}.',
      renew: '{player} rinnova il tratto di {network} pagando {cost}.',
      buySatellite: '{player} acquista il Monitoraggio satellitare pagando {cost}.',
      pass: '{player} rinuncia.',
      autoPass: '{player} non ha azioni possibili e rinuncia.',
      networkCompleted: 'Rete completata: {network}! −1 alle emissioni di ogni Municipio.',
      yearPoints: '{player}: emissioni {emissions}, +{points} punti (totale {total}).',
      cityEmissions: 'Emissioni della città: {emissions} (soglia {threshold}).',
      keyPasses: 'Nessuno ha scelto il Sindaco: la Chiave passa a {player}.',
      citySuccess: 'La città è sotto la soglia: successo collettivo!',
      cityFailure: 'Fine del 2030 sopra la soglia: la città ha fallito, punteggi dimezzati.'
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
