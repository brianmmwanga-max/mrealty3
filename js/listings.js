/* Listings page: URL-driven filters, sorting, grid/list view */

(() => {
  const grid = document.getElementById("property-grid");
  const countEl = document.getElementById("result-count");
  const chipsEl = document.getElementById("active-chips");

  const els = {
    location: document.getElementById("f-location"),
    type: document.getElementById("f-type"),
    status: document.getElementById("f-status"),
    beds: document.getElementById("f-beds"),
    baths: document.getElementById("f-baths"),
    max: document.getElementById("f-max"),
    maxOut: document.getElementById("f-max-out"),
    q: document.getElementById("f-q"),
    sort: document.getElementById("sort")
  };

  /* populate dynamic options */
  const locations = [...new Set(MR.properties.map((p) => p.location))].sort();
  els.location.innerHTML =
    '<option value="">All Locations</option>' + locations.map((l) => `<option>${l}</option>`).join("");

  /* read initial state from query string (hero search hands off here) */
  const params = new URLSearchParams(location.search);
  let view = "grid";

  function setView(v) {
    view = v;
    grid.classList.toggle("is-list", v === "list");
    document.querySelectorAll(".view-toggle button").forEach((b) =>
      b.classList.toggle("is-active", b.dataset.view === v)
    );
  }

  if (params.get("location")) els.location.value = params.get("location");
  if (params.get("type")) els.type.value = params.get("type");
  if (params.get("status")) els.status.value = params.get("status");
  if (params.get("beds")) els.beds.value = params.get("beds");
  if (params.get("baths")) els.baths.value = params.get("baths");
  if (params.get("max")) els.max.value = Math.min(Number(params.get("max")), Number(els.max.max));
  if (params.get("q")) els.q.value = params.get("q");
  if (params.get("sort")) els.sort.value = params.get("sort");
  if (params.get("view") === "list") view = "list";

  function currentFilters() {
    return {
      q: els.q.value.trim().toLowerCase(),
      location: els.location.value,
      type: els.type.value,
      status: els.status.value,
      beds: els.beds.value,
      baths: els.baths.value,
      max: Number(els.max.value),
      sort: els.sort.value
    };
  }

  function apply() {
    const f = currentFilters();
    els.maxOut.textContent = f.max >= Number(els.max.max) ? "No limit" : MR.currency(f.max);

    let list = MR.properties.filter((p) => {
      if (f.q && !(p.title + " " + p.address + " " + p.location + " " + p.type).toLowerCase().includes(f.q)) return false;
      if (f.location && p.location !== f.location) return false;
      if (f.type && p.type !== f.type) return false;
      if (f.status && p.status !== f.status) return false;
      if (f.beds) {
        const b = Number(f.beds);
        if (b === 5 ? p.beds < 5 : p.beds !== b) return false;
      }
      if (f.baths) {
        const t = Number(f.baths);
        if (t === 4 ? p.baths < 4 : p.baths !== t) return false;
      }
      if (p.price > f.max) return false;
      return true;
    });

    switch (f.sort) {
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      default: list.sort((a, b) => new Date(b.listed) - new Date(a.listed));
    }

    countEl.innerHTML = `Showing <strong>${list.length}</strong> of ${MR.properties.length} registered assets`;
    grid.innerHTML = list.length
      ? list.map((p) => MRShared.cardHTML(p, view)).join("")
      : `<div class="no-results">
           <h3 class="display">Nothing matches that brief.</h3>
           <p>Widen the filters — or ask the concierge to search our unlisted book.</p>
         </div>`;

    renderChips(f);
  }

  /* active filter chips */
  function renderChips(f) {
    const labels = [];
    if (f.q) labels.push(["q", `“${f.q}”`]);
    if (f.location) labels.push(["location", f.location]);
    if (f.type) labels.push(["type", f.type]);
    if (f.status) labels.push(["status", f.status]);
    if (f.beds) labels.push(["beds", `${f.beds}${f.beds === "5" ? "+" : ""} bed`]);
    if (f.baths) labels.push(["baths", `${f.baths}${f.baths === "4" ? "+" : ""} bath`]);
    if (f.max < Number(els.max.max)) labels.push(["max", "under " + MR.currency(f.max)]);

    chipsEl.innerHTML = labels
      .map(([k, text]) => `<span class="chip">${text}<button data-clear="${k}" aria-label="Remove ${text}">&times;</button></span>`)
      .join("");
  }

  chipsEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-clear]");
    if (!btn) return;
    const k = btn.dataset.clear;
    if (k === "max") els.max.value = els.max.max;
    else els[k].value = "";
    apply();
  });

  document.getElementById("filter-reset").addEventListener("click", () => {
    ["q", "location", "type", "status", "beds", "baths"].forEach((k) => (els[k].value = ""));
    els.max.value = els.max.max;
    els.sort.value = "newest";
    apply();
  });

  Object.values(els).forEach((el) => {
    if (!el || !el.addEventListener) return;
    el.addEventListener("input", apply);
    el.addEventListener("change", apply);
  });

  document.querySelectorAll(".view-toggle button").forEach((b) =>
    b.addEventListener("click", () => {
      setView(b.dataset.view);
      apply();
    })
  );

  MRShared.bindFavButtons(grid);
  setView(view);
  apply();
})();
