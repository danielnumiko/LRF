/* ==========================================================================
   Bento packer (layout concept 2).

   Walks the CURRENT result set placing cells into a 4-column grid: every third
   story wants a large cell (alternating 1x2 tall and 2x1 wide), which caps any
   run of standard cells at two — a row of four identical tiles can never
   occur. A large cell is demoted to standard when it will not fit the row
   remainder, and the trailing cells of the final row are widened so the grid
   always ends flush with no hole. Below 64rem the span classes are inert
   (2 then 1 column), where every cell is 1x1 and the grid fills anyway.
   ========================================================================== */

const COLS = 4;

// Place a given list of span specs the way CSS grid-auto-flow: dense does —
// each cell lands in the earliest slot it fits. Returns the cells plus how
// many empty slots the layout leaves behind.
function run(specs) {
  const grid = [];
  const row = (r) => {
    while (grid.length <= r) grid.push(new Array(COLS).fill(false));
    return grid[r];
  };
  const fits = (r, c, cs, rs) => {
    if (c + cs > COLS) return false;
    for (let i = 0; i < rs; i++) {
      const g = row(r + i);
      for (let j = 0; j < cs; j++) if (g[c + j]) return false;
    }
    return true;
  };
  const cells = specs.map((spec) => {
    for (let r = 0; ; r++) {
      row(r);
      for (let c = 0; c < COLS; c++) {
        if (!fits(r, c, spec.cs, spec.rs)) continue;
        for (let i = 0; i < spec.rs; i++) {
          const g = row(r + i);
          for (let j = 0; j < spec.cs; j++) g[c + j] = true;
        }
        return { spec, r, c };
      }
    }
  });
  const holes = grid.reduce((n, g) => n + g.filter((taken) => !taken).length, 0);
  return { cells, grid, holes, rows: grid.length };
}

export function pack(stories) {
  // Every third story wants a large cell, alternating 1x2 tall and 2x1 wide.
  const specs = stories.map((story, i) => ({
    story,
    cs: i % 3 === 0 && i % 6 !== 0 ? 2 : 1,
    rs: i % 6 === 0 ? 2 : 1
  }));

  // The pattern will not always tile four columns exactly. Close the grid by
  // widening the trailing cells first — that keeps the rhythm — and only demote
  // a large cell when widening cannot reach the hole (a trailing tall cell can
  // open a row no remaining story sits on).
  let laid = run(specs);
  for (let guard = 0; laid.holes > 0 && guard < 40; guard++) {
    const last = laid.rows - 1;
    const onRow = laid.cells
      .filter((x) => x.spec.rs === 1 && x.r === last)
      .sort((a, b) => b.c - a.c);
    let holes = laid.grid[last].filter((taken) => !taken).length;
    let widened = false;
    for (const cell of onRow) {
      if (holes <= 0) break;
      const grow = Math.min(holes, COLS - cell.spec.cs);
      if (grow <= 0) continue;
      cell.spec.cs += grow;
      holes -= grow;
      widened = true;
    }
    if (!widened) {
      let k = -1;
      for (let i = specs.length - 1; i >= 0; i--) {
        if (specs[i].cs > 1 || specs[i].rs > 1) { k = i; break; }
      }
      if (k < 0) break;
      specs[k].cs = 1;
      specs[k].rs = 1;
    }
    laid = run(specs);
  }

  return laid.cells.map((x) => ({
    story: x.spec.story,
    cls: x.spec.rs === 2
      ? (x.spec.cs === 2 ? "lrf-tall-w2" : "lrf-tall")
      : x.spec.cs === 4 ? "lrf-w4"
      : x.spec.cs === 3 ? "lrf-w3"
      : x.spec.cs === 2 ? "lrf-w2"
      : ""
  }));
}

// Stories carrying more than one theme tag claim the large cells first (they
// have the most to show), then single-tag stories top up whatever large slots
// are left. Everything else keeps source order.
export function promoteForBento(matched) {
  const slots = [];
  for (let i = 0; i < matched.length; i += 3) slots.push(i);
  const promoted = matched
    .filter((s) => s.themes.length > 1)
    .concat(matched.filter((s) => s.themes.length === 1))
    .slice(0, slots.length);
  const ordered = new Array(matched.length);
  slots.forEach((pos, k) => { ordered[pos] = promoted[k]; });
  const queue = matched.filter((s) => !promoted.includes(s));
  let q = 0;
  for (let i = 0; i < ordered.length; i++) if (!ordered[i]) ordered[i] = queue[q++];
  return ordered;
}
