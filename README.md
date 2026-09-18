# LRF — Stories index

Implementation of `Stories index.dc.html` from the *Design system reconstruction
notes* Claude Design project. No build step, no framework, no runtime
dependency: open `index.html` off a static server.

```bash
python3 -m http.server 4173
```

## Files

| File | What's in it |
| --- | --- |
| `index.html` | The page. Static shell + icon sprite; nav, filters and cards are rendered by `app.js`. |
| `assets/tokens.css` | LRF theme custom properties, lifted verbatim from the live Drupal theme. |
| `assets/base.css` | Reset, helpers, primary button, nav underline sweep, responsive switches. |
| `assets/header.css` | Ancillary bar, logo, primary nav + dropdowns, search panel, mobile sheet, breadcrumb. |
| `assets/stories.css` | Hero, filter strip, results grid, cards, newsletter band, footer. |
| `assets/data.js` | Themes, navigation and the 21 stories. The shape a Drupal view would hand the template. |
| `assets/bento.js` | The four-column bento packer and the multi-tag promotion rule. |
| `assets/app.js` | Page behaviour: nav, search, mobile sheet, filtering, rendering, parallax. |

## Layout concepts

The prototype offered two, and both are here. Which one runs is set on the
`<html>` element and can be overridden for review with a query string:

- `data-layout="columns"` (default) — three equal columns in source order, with
  the column-drift parallax. The tail of the list is repeated below the grid so
  the faster columns always have something to reveal; the stage clips to the
  natural grid height so both ends stay flush.
- `data-layout="bento"` — the packed four-column grid. Stories carrying more
  than one theme claim the large cells first.

```
http://localhost:4173/?layout=bento
```

Both collapse to the same responsive grid below 1024px, where the span classes
are inert.

## What changed from the prototype

**Prototype scaffolding removed.** The grey artboard, the framed 1280/375
viewport, and the two toolbars that switched concept and frame size were
review-harness furniture. The page is now a real page: the frame's container
queries became viewport media queries at the same 64rem breakpoint, and the
mobile sheet is `position: fixed` rather than being parked at the frame's
scroll offset by JS.

**Inline styles became classes.** Every `style="…"` attribute in the prototype
has an equivalent rule in the stylesheets, with the same values.

**The theme filter is a checkbox group, not an ARIA listbox.** The prototype
marked it up as `role="listbox"` with checkboxes inside each `role="option"`,
which is invalid — an option may not contain interactive children. Same visual
design, `role="group"` with a label, and the checkboxes carry the state.

**Dismissal behaviour added.** Escape closes the open dropdown, search panel,
theme picker or mobile sheet; clicking outside closes the nav and the picker;
the sheet takes focus on open and returns it on close. The prototype only
closed things by clicking their own trigger again.

## Before this goes live

- **Imagery is placeholder.** Every card points at a real LRF media derivative
  lifted from `/news/publications`, with that image's own alt text. Story
  photography and per-story alt text need to replace it.
- **Stories are invented.** Twenty-one names and summaries written to exercise
  the layout. `summary` is carried in the data but the card design doesn't show
  it — keep or drop it depending on what the real teaser needs.
- **Rendering is client-side.** For a Drupal build the card loop belongs in a
  Twig template with the filter as a facet on the view; `app.js` then keeps only
  the nav, search, sheet and parallax. As it stands the grid needs JavaScript.
- **Links are placeholders.** Nav, footer and card hrefs point at `#` or at
  guessed paths.
