/* ==========================================================================
   LRF Stories index — page behaviour.

   Layout concept is read from <html data-layout>, and can be overridden for
   review with ?layout=columns|bento:
     columns — the three-column grid with the column-drift parallax (default)
     bento   — the packed four-column grid
   ========================================================================== */
import { THEMES, NAV, STORIES } from "./data.js";
import { pack, promoteForBento } from "./bento.js";

const root = document.documentElement;
const layoutParam = new URLSearchParams(location.search).get("layout");
if (layoutParam === "columns" || layoutParam === "bento") root.dataset.layout = layoutParam;
const LAYOUT = root.dataset.layout === "bento" ? "bento" : "columns";

const byKey = Object.fromEntries(THEMES.map((t) => [t.key, t]));
const selected = new Set();

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const icon = (id, size = "") =>
  `<span class="lrf-icon"><svg aria-hidden="true" focusable="false" class="lrf-svg${size}"><use href="#${id}"></use></svg></span>`;

/* --------------------------------------------------------------------------
   Primary navigation (desktop)
   -------------------------------------------------------------------------- */
const nav = $("#primary-nav");
const searchToggle = $("#search-toggle");
const searchPanel = $("#search-panel");

nav.innerHTML = NAV.map((section, i) => `
  <div class="lrf-nav__section">
    <button type="button" class="lrf-navbtn lrf-navitem" aria-haspopup="true" aria-expanded="false" aria-controls="nav-panel-${i}">
      <span class="lrf-navroll">${section.title}</span>
      <span class="lrf-icon lrf-navbtn__chevron"><svg aria-hidden="true" focusable="false" class="lrf-svg"><use href="#icon-keyline-chevron-small-right"></use></svg></span>
    </button>
    <ul class="lrf-dropdown" id="nav-panel-${i}" hidden>
      <li class="lrf-dropdown__overview">
        <a class="lrf-dropdown__lead lrf-navitem" href="#">
          <span class="lrf-navroll">${section.title}</span>
          ${icon("icon-keyline-arrow-right", " lrf-svg--md")}
        </a>
      </li>
      ${section.children.map((child) => `
        <li><a class="lrf-dropdown__link lrf-navitem" href="#"><span class="lrf-navroll">${child}</span></a></li>
      `).join("")}
    </ul>
  </div>
`).join("");

function closeNav() {
  $$(".lrf-navbtn", nav).forEach((btn) => {
    btn.setAttribute("aria-expanded", "false");
    document.getElementById(btn.getAttribute("aria-controls")).hidden = true;
  });
}

function openNavSection(btn) {
  const wasOpen = btn.getAttribute("aria-expanded") === "true";
  closeNav();
  closeSearch();
  if (wasOpen) return;
  btn.setAttribute("aria-expanded", "true");
  document.getElementById(btn.getAttribute("aria-controls")).hidden = false;
}

nav.addEventListener("click", (e) => {
  const btn = e.target.closest(".lrf-navbtn");
  if (btn) openNavSection(btn);
});

/* --------------------------------------------------------------------------
   Site search
   -------------------------------------------------------------------------- */
function closeSearch() {
  searchToggle.setAttribute("aria-expanded", "false");
  $(".lrf-navroll", searchToggle).textContent = "Search";
  searchPanel.hidden = true;
}

searchToggle.addEventListener("click", () => {
  const open = searchToggle.getAttribute("aria-expanded") === "true";
  closeNav();
  if (open) { closeSearch(); return; }
  searchToggle.setAttribute("aria-expanded", "true");
  $(".lrf-navroll", searchToggle).textContent = "Close";
  searchPanel.hidden = false;
  $("#global-search").focus();
});

$("#search-form").addEventListener("submit", (e) => e.preventDefault());

/* --------------------------------------------------------------------------
   Mobile menu sheet
   -------------------------------------------------------------------------- */
const sheet = $("#menu-sheet");
const sheetRoot = $("#menu-root");
const sheetDrill = $("#menu-drill");
const menuToggle = $("#menu-toggle");
let lastFocus = null;

sheetRoot.innerHTML = NAV.map((section, i) => `
  <li>
    <button type="button" class="lrf-sheet__row lrf-navitem" data-drill="${i}">
      <span class="lrf-navroll">${section.title}</span>
      ${icon("icon-keyline-chevron-small-right")}
    </button>
  </li>
`).join("");

function showRoot() {
  sheetDrill.hidden = true;
  sheetRoot.hidden = false;
}

function showDrill(i) {
  const section = NAV[i];
  sheetDrill.innerHTML = `
    <div class="lrf-sheet__rule">
      <button type="button" class="lrf-sheet__back lrf-navitem" data-back>
        ${icon("icon-keyline-chevron-small-left")}
        <span class="lrf-navroll">Go back</span>
      </button>
    </div>
    <div class="lrf-sheet__rule">
      <a class="lrf-sheet__overview lrf-navitem" href="#">
        <span class="lrf-navroll">${section.title}</span>
        ${icon("icon-keyline-arrow-right", " lrf-svg--md")}
      </a>
    </div>
    <ul class="lrf-sheet__list">
      ${section.children.map((child) => `
        <li><a class="lrf-sheet__link lrf-navitem" href="#"><span class="lrf-navroll">${child}</span></a></li>
      `).join("")}
    </ul>`;
  sheetRoot.hidden = true;
  sheetDrill.hidden = false;
  $("[data-back]", sheetDrill).focus();
}

function openMenu() {
  lastFocus = document.activeElement;
  showRoot();
  sheet.hidden = false;
  menuToggle.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
  $(".lrf-sheet__close", sheet).focus();
}

function closeMenu() {
  sheet.hidden = true;
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
  if (lastFocus) lastFocus.focus();
}

menuToggle.addEventListener("click", openMenu);
sheet.addEventListener("click", (e) => {
  if (e.target === sheet || e.target.closest("[data-close]")) { closeMenu(); return; }
  const drill = e.target.closest("[data-drill]");
  if (drill) { showDrill(Number(drill.dataset.drill)); return; }
  if (e.target.closest("[data-back]")) showRoot();
});

/* --------------------------------------------------------------------------
   Dismissal: Escape anywhere, click outside an open nav/select
   -------------------------------------------------------------------------- */
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (!sheet.hidden) { closeMenu(); return; }
  closeNav();
  closeSearch();
  closeSelect();
});

document.addEventListener("click", (e) => {
  if (!nav.contains(e.target)) closeNav();
  if (!selectAnchor.contains(e.target)) closeSelect();
});

/* --------------------------------------------------------------------------
   Theme filter
   -------------------------------------------------------------------------- */
const selectAnchor = $("#theme-select");
const selectTrigger = $("#theme-trigger");
const selectList = $("#theme-list");
const chipBar = $("#filter-chips");
const countLabel = $("#result-count");

selectList.innerHTML = THEMES.map((theme) => `
  <li data-key="${theme.key}">
    <label class="lrf-select__option">
      <input type="checkbox" value="${theme.key}" />
      ${theme.label}
    </label>
  </li>
`).join("");

function closeSelect() {
  selectTrigger.setAttribute("aria-expanded", "false");
  selectList.hidden = true;
}

selectTrigger.addEventListener("click", () => {
  const open = selectTrigger.getAttribute("aria-expanded") === "true";
  closeNav();
  selectTrigger.setAttribute("aria-expanded", String(!open));
  selectList.hidden = open;
});

selectList.addEventListener("change", (e) => {
  const box = e.target.closest("input[type=checkbox]");
  if (!box) return;
  toggleTheme(box.value);
});

function toggleTheme(key) {
  if (selected.has(key)) selected.delete(key); else selected.add(key);
  syncFilterUi();
  render();
}

function clearAll() {
  selected.clear();
  syncFilterUi();
  render();
}

function syncFilterUi() {
  $$("li", selectList).forEach((li) => {
    $("input", li).checked = selected.has(li.dataset.key);
  });

  const keys = [...selected];
  chipBar.hidden = keys.length === 0;
  chipBar.innerHTML = keys.length === 0 ? "" : `
    ${keys.map((key) => `
      <button type="button" class="lrf-chip" data-remove="${key}">
        ${byKey[key].label}
        <svg aria-hidden="true" focusable="false" class="lrf-svg lrf-svg--xs"><use href="#icon-keyline-cross"></use></svg>
        <span class="lrf-vh">Remove filter</span>
      </button>
    `).join("")}
    <button type="button" class="lrf-clear lrf-navitem" data-clear>
      <span class="lrf-navroll">Clear all filters</span>
    </button>`;
}

chipBar.addEventListener("click", (e) => {
  const remove = e.target.closest("[data-remove]");
  if (remove) { toggleTheme(remove.dataset.remove); return; }
  if (e.target.closest("[data-clear]")) clearAll();
});

/* --------------------------------------------------------------------------
   Results
   -------------------------------------------------------------------------- */
const grid = $("#stories-grid");
const stage = $("#stories-stage");
const empty = $("#stories-empty");

grid.className = LAYOUT === "bento" ? "lrf-grid" : "lrf-grid lrf-cols3";
stage.className = LAYOUT === "bento" ? "lrf-stage" : "lrf-stage lrf-stage-clip";

function cardMarkup(cell) {
  const { story, cls, filler } = cell;
  const tags = story.themes
    .map((k) => `<span class="lrf-tag">${byKey[k].label}</span>`)
    .join("");
  return `
    <li class="${cls}"${filler ? ' aria-hidden="true"' : ""}>
      <a class="lrf-card" href="#"${filler ? ' tabindex="-1"' : ""}>
        <img class="lrf-thumb" src="${story.img}" alt="${filler ? "" : story.alt}"
             width="1000" height="563" loading="lazy" />
        <span class="lrf-card__body">
          <h3 class="lrf-card__title"><span class="lrf-hl">${story.name}'s story</span></h3>
          <span class="lrf-card__tags">${tags}</span>
        </span>
      </a>
    </li>`;
}

function render() {
  const none = selected.size === 0;
  const matched = STORIES.filter((s) => none || s.themes.some((t) => selected.has(t)));

  // Concept 2 is the bento; concept 1 is the plain three-column grid — source
  // order, every cell the same size. Concept 1 overscans: the tail of the list
  // is repeated below the real grid so the faster-drifting columns always have
  // content to reveal. The stage clips to the natural grid height, so both
  // ends stay flush.
  const cells = LAYOUT === "bento"
    ? pack(promoteForBento(matched))
    : matched.map((story) => ({ story, cls: "" }))
        .concat(matched.slice(0, 6).map((story) => ({ story, cls: "lrf-filler", filler: true })));

  grid.innerHTML = cells.map(cardMarkup).join("");
  grid.hidden = matched.length === 0;
  empty.hidden = matched.length !== 0;
  countLabel.textContent = `Showing ${matched.length} of ${STORIES.length} stories`;

  parallax.sync();
}

$("[data-clear]", empty).addEventListener("click", clearAll);

/* --------------------------------------------------------------------------
   Concept 1 parallax.

   The three columns travel at different rates as the grid passes through the
   viewport, so rows break apart and re-form rather than scrolling as one
   block. Every cell in a column shares its column's offset, so each column
   stays continuous; the stage clips, which keeps the effect inside the grid.
   One rAF-throttled loop writes the transforms. Off for concept 2, for
   prefers-reduced-motion, and below 768px.
   -------------------------------------------------------------------------- */
const parallax = (() => {
  const TRAVEL = [80, 560, 300];
  const EASE = 0.028;
  let running = false;
  let raf = null;
  let offsets = null;
  let settled = false;
  let onScroll = null;

  // The stage is clipped to where the real grid ends — the top of the first
  // repeated (filler) cell — so the overscan rows never show at rest.
  function sizeStage() {
    if (!grid.querySelector(".lrf-filler")) { stage.style.height = ""; return; }
    // The bottom of the last REAL cell — not the first repeated one, which at
    // two columns can sit alongside a real cell and would clip it away.
    let end = 0;
    for (const li of grid.children) {
      if (li.classList.contains("lrf-filler")) continue;
      end = Math.max(end, li.offsetTop + li.offsetHeight);
    }
    stage.style.height = Math.round(end) + "px";
  }

  function draw(smooth) {
    sizeStage();
    const box = grid.getBoundingClientRect();
    if (!box.height) return;
    // 0 while the grid's top edge is still below the viewport top — so the
    // grid sits flush against the filter strip at rest — then 1 by the time
    // its bottom edge reaches the viewport top.
    const p = Math.max(0, Math.min(1, -box.top / box.height));
    const cells = [...grid.children];
    const lefts = cells.map((li) => Math.round(li.offsetLeft));
    const tracks = [...new Set(lefts)].sort((x, y) => x - y);
    const targets = tracks.map((_, k) => p * TRAVEL[k % TRAVEL.length]);

    // Damped follow rather than pinning straight to the scroll position: each
    // column eases toward its target a fraction at a time, so it keeps moving
    // (and settles) after the scroll stops. That trailing settle is what makes
    // the motion feel eased rather than mechanically locked to the wheel.
    if (!offsets || offsets.length !== targets.length) offsets = targets.slice();
    let moving = false;
    offsets = offsets.map((v, k) => {
      const next = smooth ? v + (targets[k] - v) * EASE : targets[k];
      if (Math.abs(targets[k] - next) > 0.08) moving = true;
      return next;
    });
    if (!moving && settled && smooth) return;
    settled = !moving;

    cells.forEach((li, i) => {
      li.style.transform = `translate3d(0,${offsets[tracks.indexOf(lefts[i])].toFixed(2)}px,0)`;
    });
  }

  function stop() {
    running = false;
    if (onScroll) {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      onScroll = null;
    }
    if (raf) { cancelAnimationFrame(raf); raf = null; }
    offsets = null;
    settled = false;
    stage.style.height = "";
    $$("li", grid).forEach((li) => { li.style.transform = ""; });
  }

  function sync() {
    const wanted = LAYOUT === "columns" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      document.documentElement.clientWidth >= 768;
    if (!wanted) { stop(); return; }
    if (running) { draw(false); return; }
    running = true;
    onScroll = () => draw(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const tick = () => {
      if (!running) return;
      draw(true);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    draw(false);
  }

  return { sync, stop };
})();

window.addEventListener("resize", () => parallax.sync());

syncFilterUi();
render();
