# Portfolio design notes

The site is drawn with elements from the [Dither Cabinet](https://github.com/AntonIlin17/dither-cabinet):
pictures rendered as fields of dots, in one red ink on a charcoal ground. This file records the
choices behind the build so that new work, the project pages in particular, matches it.

## The build

| Part | Choice |
|------|--------|
| Navigation | Top bar: the 3D "AI" mark on the left, three links on the right |
| Landing | Monolith: one large orchid with the name set across it |
| Work | Filmstrip: frames you scroll, drag, or move with the bar underneath |
| Project view | Full page: write-up on the left, demo and screenshots on the right |
| About | Specimen sheet: a framed element, a sheet of facts, the signature underneath. Then the record: work experience and education |
| Stack | Marquee: one moving line of tools |
| Contact | The email address set large beside a reaching hand |
| Footer | One line |
| Flow | Separate screens, with a dither wipe between them |
| Opening | The mark unfolds into the name and the signature is written over it, once per session |
| Cursor | A ring that grows over anything clickable |
| Surface, grain | Ordered dither, 3 px dots |
| Pointer, motion | Dots scatter from the pointer. Elements drift slowly |
| Backdrop | Horizon: dots gather toward the bottom of the screen |

## Colour

Defined once as custom properties on `.build-app` in `src/components/portfolio/portfolio.css`,
and mirrored in `src/components/portfolio/theme.js` for code that draws on a canvas.
Change both together.

| Token | Value | Used for |
|-------|-------|----------|
| `--bg` | `#262121` | The ground |
| `--heading` | `#fdfcfc` | Headings, links, values in fact lists |
| `--text` | `#adaba4` | Body text, navigation, buttons |
| `--text-muted` | `#837f7c` | Labels and captions |
| `--accent` | `#ba081a` | The dots, rules, underlines, markers, the progress line |
| `--border` | `#f1f0ec2c` | Hairlines |

The accent is too dark to read as small text on this ground. Text never takes it: a link is
`--heading` with an accent underline, and a marker is a small accent square.

## Type

| Role | Face | Class |
|------|------|-------|
| Display | Instrument Serif, tight tracking | `.build-display`, sized per use with `clamp()` |
| Body | Instrument Sans | default |
| Labels | DM Mono, 11px | `.build-small`, `dt` in `.build-facts` |

Labels are sentence case, never capitals.

## Building blocks

All in `src/components/portfolio/`. Class names are prefixed `build-`.

| Piece | What it gives you |
|-------|-------------------|
| `<Artwork specimen="orchid" />` | A dithered element that reacts to the pointer. Any file in `public/build-art` |
| `<Artwork kind="signature" />` | The signature, which writes itself once when scrolled into view |
| `<Lightbox>` | Full-screen gallery for screenshots, with arrow keys |
| `.build-pill`, `.build-round` | Buttons and button-like links |
| `.build-facts` | A `dl` of label and value rows with hairlines |
| `.build-tags` | Small outlined tags |
| `.build-shot` | A framed media box with a caption bar |
| `.build-tabs` | Dashed tabs that go solid when pressed (`aria-pressed`) |
| `.build-inline-links` | A row of underlined links |
| `.build-copy` | A paragraph capped at a readable width |
| `.build-record` | A titled list of dated rows: date, title and place, then detail. Used for work experience and education |

`App.jsx` supplies the frame around every page: backdrop, top bar, page wipe, opening, cursor and
the progress line. A page only renders its own section.

## Project pages

Each project lives at `/projects/<slug>` and is rendered by `src/pages/ProjectPage.jsx` from one
entry in `src/pages/projectData.js`. The top of that file lists every field.

The page is a two-column grid, `.build-project`:

- `.build-project-copy`, left: back link, category line, title, description, the facts
  ("How it was built", "My contribution"), tags, link buttons, then the next project.
- `.build-project-media`, right: the `ProjectMedia` component. It shows one item at a time in a
  `.build-shot` frame. The demo video comes first when the project has a `demo`, then each
  screenshot. `.build-tabs` underneath choose the item, and a screenshot opens in the lightbox.

To add a project, append an entry to `projectData.js`, put its screenshots in
`public/projects/<name>/` and any demo video in `public/demos/`. The filmstrip, the count in the
navigation and the next-project links follow from the data.

To give one project a different media area, such as an embedded live demo, branch inside
`ProjectMedia` on a new field of the entry and keep the `.build-shot` frame around it so it sits
with the others. Below 760px the two columns stack, write-up first.

## Motion

- Honour `prefers-reduced-motion`: the opening, the wipe and the marquee already stop for it.
- Motion that answers the visitor (hover, pressed tabs) is fine. Avoid adding entrance animations
  to sections: the wipe is the one transition between screens.
- The ring cursor is only switched on for a real mouse. Form fields, video controls and dialogs
  keep the system cursor.

## Checks

```bash
npm run test
```

```bash
npm run build
```

The GitHub workflow runs both on every push. Vercel deploys `main` through its own Git connection.
