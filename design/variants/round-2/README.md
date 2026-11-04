# Round 2 · Landing-page variants

Ten landing pages that differ in structure, not just styling. Each file is the full
opening screen plus the first stretch of scroll, built from the real site copy and the
real headshot (`/_blob/...` resolves inside the canvas; swap for `src/assets/headshot.jpg`
when porting).

| File | Structure |
|------|-----------|
| r2-01-kinetic | Full-screen variable-font name that breathes; manifesto, then a dark work panel |
| r2-02-diptych | Sticky photo left, colour-shifting chapters right |
| r2-03-filmstrip | Horizontal scroll-snap panels with a scroll-driven progress bar, index below |
| r2-04-index | Table-of-contents landing with hover previews (component state) |
| r2-05-statements | One sentence per screen, vertical scroll-snap |
| r2-06-android | Detroit: Become Human–inspired showroom: thin caps, cyan hairline holograms, readouts |
| r2-07-desktop | OS desktop with windows, terminal, sticky note, dock nav; plain list below |
| r2-08-palette | ⌘K command palette as the hero, with live filtering and preview pane |
| r2-09-scrollbuilt | Wireframe that fills itself in with scroll-driven animations |
| r2-10-flashlight | Dark room; cursor spotlight reveals a dense wall; lights-on toggle |

Interactive boards (04, 08, 10) use the canvas component runtime (`renderVals`, `setState`);
when porting to React, the same state logic maps one-to-one.
