# Dither Portfolio Builder

A live, build-it-yourself mock-up of the portfolio, drawn with the elements from the
[Dither Cabinet](https://github.com/AntonIlin17/dither-cabinet). Published copy:
the "Dither Portfolio Builder" artifact on claude.ai.

Every part of the page carries a label (for example `HER-2 Landing: Monolith`). The
parts bin on the right lists every variant of every part. Move over a variant to preview
it on the page, click to use it, tap the heart to keep it, or remove a section. Ten
complete versions are provided as starting points, and Shuffle changes every part that is
not locked. The "My build" tab gives a build sheet of label codes to hand back.

## Run it locally

Images are loaded into WebGL, which browsers refuse from `file://`, so serve the folder:

```bash
python3 -m http.server 8765 --directory design/builder
```

Then open http://127.0.0.1:8765/index.html

## Files

| File | What it holds |
|------|---------------|
| `engine.js` | The dither renderer: one shared WebGL2 context, eight surfaces, inks, lens, lamp, pull, disperse, wind, drift. A compact port of the cabinet's second pass, with a Canvas fallback |
| `content.js` | The catalogue: copy, projects, inks, type pairings, every slot and variant with its code, and the ten versions |
| `parts.js` | Markup for each variant of each page part |
| `app.js` | State, rendering, the parts bin, hover previews, labels, flow and saving |
| `builder.css` | Styles for every variant and for the bin |
| `builder.html` | The page body as published; `index.html` is the same wrapped for local use |
| `assets/` | The 58 element renders and thumbnails from the cabinet |

## Slots

Parts: navigation (5), landing (7), work (5), project view (3), about (3), stack (3),
contact (3), footer (2), flow (2).
Look: specimen (58), surface (8), ink (11), grain, pointer (5), motion (3), backdrop (3),
type (6), cursor (3), transition (4), opening (3), and four small cabinet details.
