# Borgo Verde – piano di implementazione

Riferimento: `docs/regolamento.md` (versione rapida, 20 ottobre 2026). In caso di
contrasto prevalgono le sezioni 5-8 del regolamento.

## Decisioni prese

| Tema | Decisione |
| --- | --- |
| Avvio | `index.html` si apre con un doppio clic (`file://`): niente moduli ES, niente `fetch`, niente build. Tutti i file JS sono script classici che si registrano su `window.BV`. |
| Grafica | Un file SVG per ogni ID in `assets/tiles/`, generati da `tools/gen-placeholders.js`. Le illustrazioni definitive sostituiscono i file con lo stesso nome. |
| Facce | `_front` = stato iniziale (lato grigio / dissestato), `_back` = stato trasformato (decarbonizzato / rinnovato). |
| Testi sulle tessere | Gli SVG non contengono parole (solo disegno, icone e numeri). Nome e testo stampato sono in un cartiglio HTML tradotto, disattivabile con `CONFIG.ui.tileOverlay` quando le illustrazioni definitive avranno il cartiglio incorporato. |
| Lingue | `js/i18n/it.js` e `js/i18n/en.js`, un unico file per lingua con tutte le stringhe. Nome: "Borgo Verde" / "Greenburg". |
| Test | `node --test` sul motore, che non dipende dal DOM. |
| Extra | Salvataggio automatico nel browser e ripresa; passo automatico quando un giocatore non ha mosse legali (registrato nel log). Niente "annulla". |
| Dispositivo | Tablet orizzontale come riferimento, usabile anche da desktop e, in colonna, da schermi stretti. |
| Esempio 10.5 | Usato solo come test del calcolo finale (satellite, dimezzamento, spareggio) a partire dai punti annui, non come partita giocata. |

## Struttura

```
index.html
css/style.css
js/config.js          costanti della sezione 11.2
js/catalog.js         catalogo delle tessere (ID, famiglie, emissioni, copie)
js/rng.js             generatore casuale riproducibile (mulberry32)
js/i18n.js            funzione t() e cambio lingua
js/i18n/it.js, en.js  stringhe
js/engine.js          motore di gioco puro: stato, azioni, controlli, fine anno, punteggio
js/ui.js              resa del tabellone, pannelli, registro, interazione
js/app.js             avvio, schermata iniziale, salvataggio
assets/tiles/*.svg    segnaposto
tools/gen-placeholders.js
tests/engine.test.js
```

## Fasi

1. **Fondamenta** – configurazione, catalogo, RNG con stato serializzabile.
2. **Motore** – `createGame` (con disposizione e mazzo forzabili), `legalActions`,
   `applyAction` (immutabile, lo stato è JSON puro), passo automatico, chiusura
   dell'anno, `computeEmissions`, `computeOutcome` (satellite, dimezzamento,
   spareggi, vittoria condivisa), registro come elenco di chiavi + parametri.
3. **Test** – 10.2 e 10.3 giocati con il motore (tabelle di fine anno: crediti,
   emissioni, punti, città, Chiave, crediti sui ruoli, esposizione); 10.4 da uno
   stato costruito, con la variante senza il rinnovo di Bruno; 10.5 e variante con
   fallimento tramite `computeOutcome`; partite casuali complete per verificare
   gli invarianti (crediti ≥ 0, emissioni 0-14, fine entro il 2030).
4. **Segnaposto SVG** – Municipi, tessere grigie, edifici e reti a due facce,
   infrastrutture, satellite, carte ruolo, segnalini.
5. **Interfaccia** – anello a 4 (quadrato) o 3 (triangolo) Municipi con strada
   all'esterno e ferrovia all'interno; centro con tracciato annuale, tracciato
   della città con soglia, esposizione, carte ruolo con crediti, satellite,
   segnalini rete; pannelli giocatore; mosse ammesse evidenziate; scheda al
   passaggio del puntatore o con tocco prolungato; animazioni di posa e di
   rovesciamento; registro dell'anno; schermata finale.
6. **Rifinitura** – cambio lingua, accessibilità (icone e numeri sempre visibili),
   salvataggio, verifica in browser, commit e push.
