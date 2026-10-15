/* Homepage behaviour: hero search + curated sections */

(() => {
  /* ---- populate selects ---- */
  const locations = [...new Set(MR.properties.map((p) => p.location))].sort();
  const fill = (id, items, allLabel) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML =
      `<option value="">${allLabel}</option>` +
      items.map((v) => `<option>${v}</option>`).join("");
  };
  fill("hs-location", locations, "Any Location");
  fill("hs-type", ["Apartment", "Villa", "Townhouse", "Penthouse"], "Any Type");

  /* ---- price slider output ---- */
  const slider = document.getElementById("hs-price");
  const out = document.getElementById("hs-price-out");
  const fmtMax = (v) => (Number(v) >= 100000000 ? "Any Price" : MR.currency(v));
  if (slider) {
    const sync = () => (out.textContent = fmtMax(slider.value));
    slider.addEventListener("input", sync);
    sync();
  }

  /* ---- tabs (Buy / Rent demo toggle — filters status) ---- */
  document.querySelectorAll(".search-panel__tabs button").forEach((tab) =>
    tab.addEventListener("click", () => {
      document.querySelectorAll(".search-panel__tabs button").forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
    })
  );

  /* ---- submit -> listings with query string ---- */
  const form = document.getElementById("hero-search");
  if (form)
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = new URLSearchParams();
      const loc = document.getElementById("hs-location").value;
      const type = document.getElementById("hs-type").value;
      const beds = document.getElementById("hs-beds").value;
      const maxPrice = Number(slider.value);
      if (loc) q.set("location", loc);
      if (type) q.set("type", type);
      if (beds) q.set("beds", beds);
      if (maxPrice < 100000000) q.set("max", maxPrice);
      location.href = "listings.html?" + q.toString();
    });

  /* ---- featured listings strip ---- */
  const featWrap = document.getElementById("featured-grid");
  if (featWrap) {
    const featured = MR.properties
      .filter((p) => p.status !== "Sold")
      .sort((a, b) => new Date(b.listed) - new Date(a.listed))
      .slice(0, 3);
    featWrap.innerHTML = featured.map((p) => MRShared.cardHTML(p)).join("");
    MRShared.bindFavButtons(featWrap);
  }

  /* ---- neighbourhoods ---- */
  const nbWrap = document.getElementById("nb-grid");
  if (nbWrap) {
    nbWrap.innerHTML = MR.neighbourhoods
      .map(
        (n) => `
      <a class="nb-card reveal" href="listings.html?location=${encodeURIComponent(n.name)}">
        <div class="nb-card__media"><img src="${n.image}" alt="${n.name} neighbourhood map" loading="lazy" width="600" height="340"/></div>
        <div class="nb-card__body">
          <span class="nb-card__name">${n.name}</span>
          <div class="nb-card__metrics">
            <span>Median<b>${n.median}</b></span>
            <span>Gross Yield<b>${n.yield}</b></span>
            <span>12‑mo Trend<b>${n.trend}</b></span>
          </div>
          <p class="nb-card__note">${n.note}</p>
        </div>
      </a>`
      )
      .join("");
    const io = new IntersectionObserver(
      (es) => es.forEach((en) => en.isIntersecting && en.target.classList.add("is-visible")),
      { threshold: 0.1 }
    );
    nbWrap.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  }

  /* ---- stats band ---- */
  const statsWrap = document.getElementById("home-stats");
  if (statsWrap) {
    statsWrap.innerHTML = MR.stats
      .map(
        ([label, value, note]) => `
        <div class="stat">
          <div class="stat__label">${label}</div>
          <div class="stat__value">${value}</div>
          <div class="stat__note">${note}</div>
        </div>`
      )
      .join("");
  }
})();


/* ---------- cinematic hero: scroll parallax + pointer 3D tilt ---------- */
(() => {
  const media = document.getElementById("hero-media");
  if (!media) return;
  let raf = null;
  addEventListener("scroll", () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      media.style.setProperty("--py", Math.min(scrollY * 0.25, 160) + "px");
      raf = null;
    });
  }, { passive: true });
  addEventListener("pointermove", (e) => {
    const rx = (e.clientY / innerHeight - 0.5) * -3;
    const ry = (e.clientX / innerWidth - 0.5) * 4;
    media.style.setProperty("--rx", rx.toFixed(2) + "deg");
    media.style.setProperty("--ry", ry.toFixed(2) + "deg");
  });
})();

/* ---------- 3D tilt on featured cards ---------- */
(() => {
  const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  if (!fine) return;
  document.addEventListener("mouseover", (e) => {
    const card = e.target.closest(".card, .proj-card");
    if (!card || card.dataset.tilt === "on") return;
    card.dataset.tilt = "on";
    const move = (ev) => {
      const r = card.getBoundingClientRect();
      const px = (ev.clientX - r.left) / r.width - 0.5;
      const py = (ev.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${px * 5}deg) rotateX(${-py * 5}deg) translateY(-4px)`;
    };
    const leave = () => {
      card.style.transform = "";
      card.removeEventListener("mousemove", move);
      card.removeEventListener("mouseleave", leave);
      card.dataset.tilt = "off";
    };
    card.addEventListener("mousemove", move);
    card.addEventListener("mouseleave", leave);
  });
})();
