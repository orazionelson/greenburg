# Greenburg / Borgo Verde

Digital prototype of the board game *Greenburg* (Italian: *Borgo Verde*): 3 or 4
players taking turns on the same device, over six years of play (2025-2030).
The reference rulebook is [`docs/rulebook.md`](docs/rulebook.md) (Italian
original in [`docs/regolamento.md`](docs/regolamento.md)), the work plan is in
[`docs/PLAN.md`](docs/PLAN.md).

## How to play

Double-click `index.html`: no server or build step is needed, and no data is
sent over the network. The game saves itself in the browser and can be resumed
from the start screen.

- Possible moves flash yellow: play them by clicking on the board or with the
  buttons in the right-hand panel.
- Hover over a tile, or long-press it on a touch screen, to see its name,
  printed text and values.
- A player with no possible move passes automatically, and the log records it.
- The optional random seed reproduces the same setup.
- The **Rules** button opens the players' rules, in English and Italian.
- Sounds announce each player's turn and go with tiles being taken, laid and
  turned over. They are synthesised in the browser (`js/sound.js`, no audio
  files); the speaker button in the top bar turns them off, and the choice is
  remembered.
- Every decision has a time limit, chosen at the start of the game (2 minutes by
  default, 0 to play without a limit). Past the limit you lose 1 impact point
  every 10 seconds; the timer stops while a window is open.

## Print and play

To play at the table, print the pieces and cut them out:
[`print-and-play/greenburg-print-and-play.pdf`](print-and-play/greenburg-print-and-play.pdf)
(Italian: [`borgo-verde-stampa-e-gioca.pdf`](print-and-play/borgo-verde-stampa-e-gioca.pdf)).
The same sheets are generated live by `print.html`, also linked from the app's
start screen, and can be printed straight from the browser.

- Ten A4 pages: tiles, cards, tokens, credits and tracks for a 4-player game
  (the 3-player game uses a subset). The first page has the printing
  instructions and the list of contents.
- Pages 2–7 are double-sided: each back follows its front, mirrored for
  long-edge duplex printing. Grey tiles show their emission value on the back,
  as setup requires; infrastructure tiles and Investment cards share a common
  back.
- Print at 100% (actual size). Land tiles are 32 mm, so a district is 96 mm and
  a network tile 96 × 32 mm, as in the rulebook's proportions.

After changing tiles, texts or layout, regenerate the PDFs (needs Playwright
with Chromium, which the game itself does not depend on):

```
npm install --no-save playwright
npm run print-pdf
```

## Structure

| Path | Contents |
| --- | --- |
| `js/config.js` | All the game constants (rulebook section 11.2), to be tuned through playtesting |
| `js/catalog.js` | Tile catalogue: IDs, families, emissions, copies |
| `js/engine.js` | Pure game engine, no DOM: the state is JSON, `applyAction` does not modify its input |
| `js/rng.js` | Reproducible random generator, with its state saved in the game |
| `js/i18n/it.js`, `js/i18n/en.js` | All the strings, one language per file |
| `js/manual/it.js`, `js/manual/en.js` | Players' rules |
| `js/ui.js`, `js/app.js` | Board, panels, tile card, start and final screens, saving |
| `js/sound.js` | Sound effects, synthesised with the Web Audio API |
| `print.html`, `js/print.js`, `css/print.css` | Print-and-play sheets |
| `print-and-play/` | Ready-made print-and-play PDFs, one per language |
| `assets/tiles/` | Tile images, one per ID |
| `tools/gen-placeholders.js` | Regenerates the SVG placeholders |
| `tools/build-print.js` | Regenerates the print-and-play PDFs |
| `tests/` | Engine and language tests |

## Tests

```
npm test
```

No dependencies are needed, just Node 18 or later. The tests reproduce the
examples in chapter 10 of the rulebook, as section 11.7 requires:

- the end-of-year tables for 2025 and 2026 (credits, emissions, points, city,
  Key, credits piled up on the roles);
- the completion of the railway network in 2028, including the variant in
  which Bruno does not renew;
- the final calculation in 10.5 and its failure variant.

Example 10.5 cannot be played with the current rules (Carla would take three
Public Works actions in the same year), so only the score calculation from the
yearly points is checked. Besides the examples, 300 complete random games check
the invariants, and further tests verify that both languages have the same keys
and that every image in the catalogue exists.

## Releasing a new version

GitHub Pages lets browsers cache files for a few minutes. To avoid anyone
getting the new page with the old scripts after an update, every JS, CSS and
image file is requested with the version number in its address
(`js/app.js?v=0.7.0`). Bump the version before each release:

```
npm version minor     # or patch; updates index.html and js/config.js
```

The command runs `tools/set-version.js`, which copies the version from
`package.json` into the references in `index.html` and `print.html` and into
`js/config.js`. A test checks that the versions match.

## Graphics

Each tile is the file `assets/tiles/<ID>.svg`. Double-sided tiles use `_front`
for the initial side (grey or run-down) and `_back` for the transformed side
(decarbonised or renewed), for example `ed_scuola_front.svg` and
`rete_strada_back.svg`. To add the final illustrations, just replace the files
keeping the same names; other formats work too, as long as the extension is
updated in `js/ui.js`.

The placeholders contain no words, only the drawing, icons and numbers: the app
writes the names in the chosen language. If the final illustrations already
have the caption printed on them, set `CONFIG.ui.tileOverlay = false` so the
name is not overlaid.

The display, role cards and tracks sit in a common area next to the board, so
the ring is only as wide as the network tiles (3:1 ratio, as long as the side
of a district). In the 3-player triangle the top sides have a small joint,
because the square districts overlap the slanted sides more.
