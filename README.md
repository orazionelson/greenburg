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
- Every decision has a time limit, chosen at the start of the game (2 minutes by
  default, 0 to play without a limit). Past the limit you lose 1 impact point
  every 10 seconds; the timer stops while a window is open.

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
| `assets/tiles/` | Tile images, one per ID |
| `tools/gen-placeholders.js` | Regenerates the SVG placeholders |
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
(`js/app.js?v=0.5.0`). Bump the version before each release:

```
npm version minor     # or patch; updates index.html and js/config.js
```

The command runs `tools/set-version.js`, which copies the version from
`package.json` into the references in `index.html` and into `js/config.js`. A
test checks that the three versions match.

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
