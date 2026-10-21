# Borgo Verde / Greenburg

Prototipo digitale del gioco da tavolo *Borgo Verde* (nome provvisorio): 3 o 4
giocatori sullo stesso dispositivo, a turno, per sei anni di gioco (2025-2030).
Il regolamento di riferimento è in [`docs/regolamento.md`](docs/regolamento.md),
il piano di lavoro in [`docs/PLAN.md`](docs/PLAN.md).

## Come si gioca

Apri `index.html` con un doppio clic: non servono né un server né una
compilazione, e nessun dato viene inviato in rete. La partita si salva da sola
nel browser e si riprende dalla schermata iniziale.

- Le mosse possibili lampeggiano in giallo: si giocano cliccando sul tabellone
  o usando i pulsanti del pannello a destra.
- Passa il puntatore su una tessera, oppure tienila premuta su uno schermo
  tattile, per vederne nome, testo stampato e valori.
- Chi non ha mosse possibili rinuncia in automatico, e il registro lo annota.
- Il seme casuale, facoltativo, riproduce la stessa preparazione.

## Struttura

| Percorso | Contenuto |
| --- | --- |
| `js/config.js` | Tutte le costanti di gioco (sezione 11.2), da tarare con le prove |
| `js/catalog.js` | Catalogo delle tessere: ID, famiglie, emissioni, copie |
| `js/engine.js` | Motore di gioco puro, senza DOM: lo stato è JSON, `applyAction` non modifica l'input |
| `js/rng.js` | Generatore casuale riproducibile, con lo stato salvato nella partita |
| `js/i18n/it.js`, `js/i18n/en.js` | Tutte le stringhe, una lingua per file |
| `js/ui.js`, `js/app.js` | Tabellone, pannelli, scheda tessera, schermate iniziale e finale, salvataggio |
| `assets/tiles/` | Immagini delle tessere, una per ID |
| `tools/gen-placeholders.js` | Rigenera i segnaposto SVG |
| `tests/` | Test del motore e delle lingue |

## Test

```
npm test
```

Non servono dipendenze, basta Node 18 o successivo. I test riproducono gli
esempi del capitolo 10, come chiede la sezione 11.7:

- le tabelle di fine 2025 e 2026 (crediti, emissioni, punti, città, Chiave,
  crediti accumulati sui ruoli);
- il completamento della rete ferroviaria del 2028, anche nella variante in
  cui Bruno non rinnova;
- il calcolo finale del 10.5 e la sua variante con fallimento.

L'esempio 10.5 non è giocabile con le regole attuali (Carla farebbe tre azioni
dei Lavori pubblici nello stesso anno), quindi si verifica solo il calcolo dei
punteggi a partire dai punti annui. Oltre agli esempi, 300 partite casuali
complete controllano gli invarianti, e altri test verificano che le due lingue
abbiano le stesse chiavi e che ogni immagine del catalogo esista.

## Grafica

Ogni tessera è il file `assets/tiles/<ID>.svg`. Le tessere a due facce usano
`_front` per il lato iniziale (grigio o dissestato) e `_back` per il lato
trasformato (decarbonizzato o rinnovato), ad esempio `ed_scuola_front.svg` e
`rete_strada_back.svg`. Per mettere le illustrazioni definitive basta
sostituire i file tenendo lo stesso nome; vanno bene anche altri formati, se
si aggiorna l'estensione in `js/ui.js`.

I segnaposto non contengono parole, solo il disegno, le icone e i numeri: i
nomi li scrive l'app nella lingua scelta. Se le illustrazioni definitive avranno
già il cartiglio stampato, imposta `CONFIG.ui.tileOverlay = false` per non
sovrapporre il nome.

Sullo schermo i lati dell'anello sono più lunghi delle tessere rete, per fare
posto al centro: la tessera resta in proporzione 3:1 e il resto del lato è un
raccordo di strada o binario.
