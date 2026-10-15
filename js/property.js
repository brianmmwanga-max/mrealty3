/* Property detail: gallery lightbox, floor plans, video, inquiry, mortgage calc */

(() => {
  const id = new URLSearchParams(location.search).get("id") || MR.properties[0].id;
  const p = MR.byId(id) || MR.byId(MR.properties[0].id);
  if (!p) return;

  document.title = `${p.title} — ${p.location} | M Realty`;

  /* ---------- sticky stats bar ---------- */
  document.getElementById("pd-price").textContent = MR.currency(p.price);
  document.getElementById("pd-beds").textContent = p.beds;
  document.getElementById("pd-baths").textContent = p.baths;
  document.getElementById("pd-sqft").textContent = p.sqft.toLocaleString();
  document.getElementById("pd-title").textContent = p.title;
  document.getElementById("pd-address").textContent = p.address;
  document.getElementById("pd-type").textContent = p.type;
  document.getElementById("pd-status").textContent = p.status;
  document.getElementById("pd-year").textContent = p.year;
  document.getElementById("pd-ref").textContent = "Ref. " + p.id.toUpperCase();

  /* ---------- gallery mosaic ---------- */
  const gal = document.getElementById("gallery");
  const imgs = p.images;
  let html = `
    <figure class="gallery__main">
      <img src="${imgs[0]}" alt="${p.title} — main view" loading="eager" data-index="0"/>
    </figure>`;
  imgs.slice(1, 3).forEach((src, i) => {
    html += `<figure><img src="${src}" alt="${p.title} — view ${i + 2}" loading="lazy" data-index="${i + 1}"/></figure>`;
  });
  if (imgs.length > 3) {
    html += `<figure class="gallery__more" data-count="+${imgs.length - 3}" data-index="3">
               <img src="${imgs[3]}" alt="${p.title} — additional view" loading="lazy"/>
             </figure>`;
  }
  gal.innerHTML = html;

  /* ---------- lightbox ---------- */
  const lb = document.getElementById("lightbox");
  const lbImg = lb.querySelector("img");
  const lbCount = lb.querySelector(".lightbox__count");
  let cur = 0;

  function openLb(i) {
    cur = (i + imgs.length) % imgs.length;
    lbImg.src = imgs[cur];
    lbImg.alt = `${p.title} photo ${cur + 1}`;
    lbCount.textContent = `${cur + 1} / ${imgs.length}`;
    lb.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  function closeLb() {
    lb.classList.remove("is-open");
    document.body.style.overflow = "";
  }
  gal.addEventListener("click", (e) => {
    const fig = e.target.closest("[data-index]");
    if (fig) openLb(Number(fig.dataset.index));
  });
  lb.querySelector("[data-lb-prev]").addEventListener("click", () => openLb(cur - 1));
  lb.querySelector("[data-lb-next]").addEventListener("click", () => openLb(cur + 1));
  lb.querySelector("[data-lb-close]").addEventListener("click", closeLb);
  lb.addEventListener("click", (e) => e.target === lb && closeLb());
  addEventListener("keydown", (e) => {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") openLb(cur - 1);
    if (e.key === "ArrowRight") openLb(cur + 1);
  });

  /* ---------- description & amenities ---------- */
  document.getElementById("pd-blurb").textContent = p.blurb;
  document.getElementById("pd-desc").innerHTML = p.description
    .split("\n\n")
    .map((para) => `<p>${para}</p>`)
    .join("");
  document.getElementById("pd-amenities").innerHTML = p.amenities
    .map((a) => `<li>${MRShared.ICONS.check}<span>${a}</span></li>`)
    .join("");

  /* ---------- floor plan tabs ---------- */
  const planStage = document.getElementById("floorplan-img");
  const planTabs = document.getElementById("plan-tabs");
  const plans = [
    ["Layout", p.floorPlan],
    ["Location Plan", "assets/img/nb-" + p.location.toLowerCase().replace(/\s+/g, "") + ".jpg"]
  ];
  planTabs.innerHTML = plans
    .map(([label], i) => `<button data-plan="${i}" class="${i === 0 ? "is-active" : ""}">${label}</button>`)
    .join("");
  planTabs.addEventListener("click", (e) => {
    const b = e.target.closest("[data-plan]");
    if (!b) return;
    planTabs.querySelectorAll("button").forEach((x) => x.classList.remove("is-active"));
    b.classList.add("is-active");
    planStage.src = plans[Number(b.dataset.plan)][1];
    planStage.alt = plans[Number(b.dataset.plan)][0] + " — " + p.title;
  });
  planStage.src = plans[0][1];

  /* ---------- video tour (placeholder embed) ---------- */
  const frame = document.getElementById("video-frame");
  const mountVideo = () => {
    frame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${p.videoId}"
      title="Video tour — ${p.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
      allowfullscreen loading="lazy"></iframe>`;
  };
  frame.innerHTML = `
    <img src="${p.images[Math.min(1, p.images.length - 1)]}" alt="Video tour still" loading="lazy"/>
    <button class="video-play" type="button" aria-label="Play video tour">
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="31" stroke="#c5a059" stroke-width="1.5" fill="rgba(10,28,58,.72)"/>
        <path d="M26 21l17 11-17 11V21z" fill="#fff"/>
      </svg>
    </button>`;
  frame.querySelector(".video-play").addEventListener("click", mountVideo);

  /* ---------- agent card ---------- */
  const agent = MR.byAgent(p.agent);
  document.getElementById("side-agent").innerHTML = `
    <div class="agent-mini">
      <img src="${agent.photo}" alt="${agent.name}" loading="lazy" width="120" height="120"/>
      <div>
        <div class="agent-mini__name">${agent.name}</div>
        <div class="agent-mini__role">${agent.role}</div>
      </div>
    </div>
    <div class="agent-card__contact" style="margin-top:16px">
      <a href="tel:${agent.phone.replace(/\s/g, "")}">${MRShared.ICONS.phone}${agent.phone}</a>
      <a href="mailto:${agent.email}">${MRShared.ICONS.mail}${agent.email}</a>
    </div>`;

  /* ---------- save button on detail page ---------- */
  const saveBtn = document.getElementById("pd-save");
  const paintSave = () => {
    saveBtn.classList.toggle("is-saved", MRShared.isSaved(p.id));
    saveBtn.querySelector("span").textContent = MRShared.isSaved(p.id) ? "Saved" : "Save";
  };
  saveBtn.addEventListener("click", () => { MRShared.toggleSaved(p.id); paintSave(); });
  paintSave();

  /* ---------- inquiry form ---------- */
  const inq = document.getElementById("inquiry-form");
  inq.querySelector("input[name=property]").value = `${p.title} (${p.id.toUpperCase()})`;
  const lead = JSON.parse(localStorage.getItem("mr_lead") || "null");
  if (lead && lead.email) inq.querySelector("input[type=email]").value = lead.email;
  inq.addEventListener("submit", (e) => {
    e.preventDefault();
    inq.outerHTML = `<div class="form-ok">Enquiry received. ${agent.name.split(" ")[0]} will contact you
      within one working day regarding ${p.title}.</div>`;
  });

  /* ---------- mortgage calculator ---------- */
  const priceInput = document.getElementById("mc-price");
  const deposit = document.getElementById("mc-deposit");
  const depOut = document.getElementById("mc-deposit-out");
  const rate = document.getElementById("mc-rate");
  const rateOut = document.getElementById("mc-rate-out");
  const term = document.getElementById("mc-term");
  const termOut = document.getElementById("mc-term-out");
  const monthly = document.getElementById("mc-monthly");
  const totalInt = document.getElementById("mc-total-interest");
  const borrowOut = document.getElementById("mc-borrow");

  priceInput.value = String(p.price);

  function calc() {
    const principal = Math.max(0, Number(priceInput.value.replace(/[^\d]/g, "")) * (1 - Number(deposit.value) / 100));
    const r = Number(rate.value) / 100 / 12;
    const n = Number(term.value) * 12;
    const m = r === 0 ? principal / n : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    depOut.textContent = deposit.value + "% · " + MR.currency(Number(priceInput.value.replace(/[^\d]/g, "")) * Number(deposit.value) / 100);
    rateOut.textContent = rate.value + "% p.a.";
    termOut.textContent = term.value + " years";
    borrowOut.textContent = MR.currency(Math.round(principal));
    monthly.textContent = MR.currency(Math.round(m)) + " / mo";
    totalInt.textContent = MR.currency(Math.round(m * n - principal));
  }
  [priceInput, deposit, rate, term].forEach((el) => {
    el.addEventListener("input", calc);
    el.addEventListener("change", calc);
  });
  calc();

  /* ---------- similar properties ---------- */
  const simWrap = document.getElementById("similar-grid");
  const similar = MR.properties
    .filter((x) => x.id !== p.id && (x.location === p.location || x.type === p.type))
    .slice(0, 3);
  simWrap.innerHTML = similar.map((x) => MRShared.cardHTML(x)).join("");
  MRShared.bindFavButtons(simWrap);
})();
