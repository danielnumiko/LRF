/* ==========================================================================
   Review scaffolding — the prototype desk, frame and toolbars.

   Rebuilds the two toolbars the original design-code prototype carried:
   concept (1 — Three columns / 2 — Bento grid) and frame size (1280 / 375).
   Opens on concept 1 at 1280, as the prototype did. Both are reflected in the
   URL so a reviewer can link to one combination.

   Off with ?review=0 — the page then fills the window and behaves as shipped.

   NOT part of the page. To ship: delete this file, assets/review.css and the
   three tagged lines in index.html.
   ========================================================================== */
import { setLayout, getLayout, refresh } from "./app.js";

const params = new URLSearchParams(location.search);

if (params.get("review") !== "0") {
  const FRAMES = {
    desktop: { w: "1280px", h: "836px", label: "1280" },
    mobile:  { w: "375px",  h: "812px", label: "375"  }
  };
  let frameKey = params.get("frame") === "mobile" ? "mobile" : "desktop";

  const page = document.getElementById("lrf-page");

  // Desk + frame wrapper around the page.
  document.body.classList.add("lrf-framed");
  const proto = document.createElement("div");
  proto.className = "lrf-proto";
  page.replaceWith(proto);

  const bar = document.createElement("div");
  bar.className = "lrf-review";
  bar.innerHTML = `
    <span class="lrf-review__label">Prototype version</span>
    <span class="lrf-review__group" role="group" aria-label="Prototype version">
      <button type="button" class="lrf-review__btn" data-concept="columns">1 — Three columns</button>
      <button type="button" class="lrf-review__btn" data-concept="bento">2 — Bento grid</button>
    </span>
    <span class="lrf-review__group lrf-review__group--right" role="group" aria-label="Frame size">
      <button type="button" class="lrf-review__btn" data-frame="desktop">1280</button>
      <button type="button" class="lrf-review__btn" data-frame="mobile">375</button>
    </span>`;

  const scaler = document.createElement("div");
  scaler.className = "lrf-scaler";
  scaler.append(page);
  proto.append(bar, scaler);

  function applyFrame() {
    const f = FRAMES[frameKey];
    page.style.setProperty("--frame-w", f.w);
    page.style.setProperty("--frame-h", f.h);
    fit();
  }

  // Scale the frame down when the desk is narrower than the frame's true
  // width, and size the wrapper to the scaled result so the page still flows.
  function fit() {
    const f = FRAMES[frameKey];
    const w = parseFloat(f.w);
    const h = parseFloat(f.h);
    const avail = proto.clientWidth;
    const k = Math.min(1, avail / w);
    page.style.setProperty("--frame-scale", k);
    scaler.style.width = Math.round(w * k) + "px";
    scaler.style.height = Math.round(h * k) + "px";
  }

  addEventListener("resize", () => { fit(); refresh(); });

  function sync() {
    bar.querySelectorAll("[data-concept]").forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.concept === getLayout())));
    bar.querySelectorAll("[data-frame]").forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.frame === frameKey)));
  }

  function remember(key, value) {
    const url = new URL(location.href);
    url.searchParams.set(key, value);
    history.replaceState(null, "", url);
  }

  bar.addEventListener("click", (e) => {
    const concept = e.target.closest("[data-concept]");
    if (concept) {
      setLayout(concept.dataset.concept);
      remember("layout", concept.dataset.concept);
      sync();
      return;
    }
    const size = e.target.closest("[data-frame]");
    if (!size || size.dataset.frame === frameKey) return;
    frameKey = size.dataset.frame;
    applyFrame();
    remember("frame", frameKey);
    sync();
    // The frame is the container the page's own queries respond to, so the
    // parallax has to re-measure once the new width has laid out.
    requestAnimationFrame(refresh);
  });

  applyFrame();
  sync();
  refresh();
}
