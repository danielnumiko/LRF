# LRF — Stories index

Implementation of `Stories index.dc.html` from the *Design system reconstruction
notes* Claude Design project. No build step, no framework, no runtime
dependency: open `index.html` off a static server.

```bash
python3 serve.py
```

`serve.py` is `http.server` with `Cache-Control: no-store`. Plain
`python3 -m http.server` works too, but the browser will reuse a stale
stylesheet after an edit, which looks exactly like the change not working.

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

## Review scaffolding

`assets/review.js` and `assets/review.css` rebuild the prototype desk: the
grey artboard, the framed viewport, and the two toolbars — concept
(1 — Three columns / 2 — Bento grid) and frame size (1280 / 375). It opens on
concept 1 at 1280, as the original prototype did, and both toolbars write to
the URL so you can link to one combination:

```
http://localhost:4173/?layout=bento&frame=mobile
```

`?review=0` turns it all off and the page fills the window as shipped.

The frame keeps its true layout width and scales down to fit a narrow window,
so "1280" always shows the real 1280 layout. This works because the page's
breakpoints are container queries on `.lrf-page` rather than media queries —
that element is the window in the shipped page and the frame under the
scaffolding, and the same rules serve both.

**To ship the page without any of this:** delete `assets/review.js`,
`assets/review.css` and the three tagged lines in `index.html`. Nothing in
the page files depends on them.

## Layout concepts

Both are here. Which one runs is set on the `<html>` element and can be
overridden with a query string:

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

**Header spacing comes from the live theme, not the prototype.** The
design-code prototype approximated several header values; these are now the
theme's own, read out of the site's aggregated CSS:

| | Prototype | Live theme |
| --- | --- | --- |
| Nav item gap | `--fl-lg` (fluid, ~36px) | `lg:gap-12` — a flat `3rem` |
| Search control | auto-margin, sized to content | `lg:w-28` — a fixed `7rem`, right-aligned |
| Nav / search type | `--f-base` (~18px) | inherits `text-fl-sm` (~15.6px) |
| Header bar gap | `--fl-sm` | `gap-fl-sm-lg` |
| Header bar padding | `--fl-lg` | `px-fl-2xs-lg` |
| Desktop breakpoint | 64rem (1024px) | **80rem (1280px)** — `lg` in this theme |

The fluid nav gap and the auto-margin search were what made the spacing read
as uneven: the run of items breathed with the viewport while the gap before
Search was only ever whatever space was left over. A flat 3rem and a fixed
7rem block give the even rhythm the live site has.

**Prototype scaffolding is separable, not baked in.** The artboard, frame and
toolbars still exist, but they live in two files the page does not depend on,
rather than being part of the markup. The page's breakpoints stay container
queries so the same rules work framed or full-window.

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
