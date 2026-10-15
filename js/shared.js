/* ============================================================
   M REALTY — Shared chrome: header, footer, concierge, saved
   ============================================================ */

const MRShared = (() => {
  const SAVED_KEY = "mr_saved";
  const LEAD_KEY = "mr_lead";

  /* ---------- icons ---------- */
  const ICONS = {
    heart: '<svg class="heart" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 20.5s-7.5-4.8-9.5-9C1 8 2.6 4.5 6.2 4.5c2.2 0 3.6 1.2 4.4 2.4h.8c.8-1.2 2.2-2.4 4.4-2.4 3.6 0 5.2 3.5 3.7 7-2 4.2-9.5 9-9.5 9z"/></svg>',
    bed: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 18v-6h18v6M3 12V7M21 12v-2a2 2 0 0 0-2-2H13v6M3 18v2M21 18v2"/></svg>',
    bath: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3zM6 12V6a2 2 0 0 1 4 0M7 19l-1 2M17 19l1 2"/></svg>',
    area: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="4" width="16" height="16"/><path d="M4 9h3M4 4v3M20 15h-3M20 20v-3"/></svg>',
    pin: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12.5l5 5L20 6.5"/></svg>',
    arrow: '<svg width="16" height="10" viewBox="0 0 24 10" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M0 5h21m-5-5 5 5-5 5"/></svg>',
    phone: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 3h4l2 5-2.5 2a13 13 0 0 0 5.5 5.5L16 13l5 2v4a2 2 0 0 1-2.2 2A17 17 0 0 1 3 5.2 2 2 0 0 1 5 3z"/></svg>',
    mail: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14"/><path d="m3 6 9 7 9-7"/></svg>',
    grid: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
    rows: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="18" height="5"/><rect x="3" y="14" width="18" height="5"/></svg>'
  };

  /* ---------- saved (favorites) ---------- */
  const getSaved = () => {
    try { return JSON.parse(localStorage.getItem(SAVED_KEY)) || []; }
    catch { return []; }
  };
  const isSaved = (id) => getSaved().includes(id);
  const toggleSaved = (id) => {
    let s = getSaved();
    s.includes(id) ? (s = s.filter((x) => x !== id)) : s.push(id);
    localStorage.setItem(SAVED_KEY, JSON.stringify(s));
    updateSavedCount();
    document.dispatchEvent(new CustomEvent("mr:saved-changed", { detail: s }));
    return s.includes(id);
  };
  const updateSavedCount = () => {
    document.querySelectorAll("[data-saved-count]").forEach((el) => {
      el.textContent = getSaved().length;
    });
  };

  /* ---------- header / footer templates ---------- */
  const navLinks = [
    ["index.html", "Home", "home"],
    ["listings.html", "Listings", "listings"],
    ["project.html", "Projects", "projects"],
    ["about.html", "About", "about"],
    ["contact.html", "Contact", "contact"]
  ];

  const headerHTML = (active) => `
    <header class="site-header">
      <div class="wrap header-inner">
        <a class="logo" href="index.html" aria-label="M Realty home">
          <span class="logo__mark">M</span>
          <span class="logo__word">M&nbsp;Realty</span>
        </a>
        <nav class="main-nav" aria-label="Primary">
          <ul>
            ${navLinks
              .map(
                ([href, label, key]) =>
                  `<li><a href="${href}" class="${key === active ? "is-active" : ""}">${label}</a></li>`
              )
              .join("")}
          </ul>
        </nav>
        <div class="header-actions">
          <a class="saved-link" href="saved.html" aria-label="Saved properties">
            ${ICONS.heart}<span>Saved</span><span class="count" data-saved-count>0</span>
          </a>
          <a class="btn btn--gold" href="contact.html">Book a Viewing</a>
          <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>`;

  const footerHTML = () => `
    <footer class="site-footer">
      <div class="wrap">
        <div class="footer-news">
          <div>
            <h3 class="display">Off-Market Access</h3>
            <p>Inventory that never reaches the portal. Registered clients receive
            allocation lists and pre-release pricing before public launch.</p>
          </div>
          <form class="news-form" data-newsletter>
            <input type="email" name="email" required placeholder="Your email address" aria-label="Email address" />
            <button type="submit">Request Access</button>
          </form>
        </div>

        <div class="footer-cols">
          <div class="footer-col">
            <div class="footer-brand">
              <span class="logo__mark">M</span>
              <span class="logo__word">M&nbsp;Realty</span>
            </div>
            <p>A Nairobi advisory for exceptional residential assets — development
            sales, prime resale, and institutional counsel since 2013.</p>
          </div>
          <div class="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="listings.html">All Listings</a></li>
              <li><a href="project.html">The Gemini Project</a></li>
              <li><a href="about.html">Our Advisers</a></li>
              <li><a href="saved.html">Saved Properties</a></li>
              <li><a href="contact.html">Book a Viewing</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Data Protection</a></li>
              <li><a href="#">Ethical Sales Policy</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Contact</h4>
            <ul>
              <li>Park Lane Chambers, 4th Floor<br/>Westlands, Nairobi</li>
              <li><a href="tel:+254720100000">+254 720 100 000</a></li>
              <li><a href="mailto:desk@mrealty.co.ke">desk@mrealty.co.ke</a></li>
              <li>Mon – Fri 9:00 – 18:00 · Sat by appointment</li>
            </ul>
          </div>
        </div>

        <div class="footer-base">
          <span>© ${new Date().getFullYear()} M Realty Ltd. All rights reserved.</span>
          <span>Estate Agents Licence No. MR‑NB‑0417</span>
        </div>
      </div>
    </footer>`;

  const conciergeHTML = () => `
    <button class="concierge-launcher" data-concierge-open aria-haspopup="dialog">
      <span class="dot"></span> M Realty Concierge
    </button>
    <section class="concierge" data-concierge role="dialog" aria-label="M Realty Concierge">
      <div class="concierge__head">
        <div>
          <small>M Realty</small>
          <strong>Private Concierge</strong>
        </div>
        <button class="concierge__close" data-concierge-close aria-label="Close">&times;</button>
      </div>
      <div class="concierge__log" data-concierge-log></div>
      <div class="concierge__choices" data-concierge-choices hidden></div>
      <form class="concierge__form" data-concierge-form hidden>
        <input type="email" required placeholder="Email to continue" aria-label="Email address" />
        <button type="submit">Start</button>
      </form>
    </section>`;

  /* ---------- concierge logic ---------- */
  function initConcierge() {
    const panel = document.querySelector("[data-concierge]");
    if (!panel) return;
    const log = panel.querySelector("[data-concierge-log]");
    const choicesBox = panel.querySelector("[data-concierge-choices]");
    const form = panel.querySelector("[data-concierge-form]");
    let stage = "intro";

    const say = (who, text, delay = 0) =>
      new Promise((res) =>
        setTimeout(() => {
          const div = document.createElement("div");
          div.className = `msg msg--${who}`;
          div.textContent = text;
          log.appendChild(div);
          log.scrollTop = log.scrollHeight;
          res();
        }, delay)
      );

    const setChoices = (items) => {
      choicesBox.innerHTML = "";
      items.forEach((label) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = label;
        b.addEventListener("click", () => choose(label));
        choicesBox.appendChild(b);
      });
      choicesBox.hidden = false;
    };

    async function choose(intent) {
      choicesBox.hidden = true;
      await say("user", intent);
      if (intent === "Buy") {
        await say("bot", "Understood. Share your budget band and preferred sub-market and I'll brief an adviser with a shortlist within the hour.", 500);
        setChoices(["KES 10–25M", "KES 25–60M", "KES 60M+", "Not sure yet"]);
      } else if (intent === "Sell") {
        await say("bot", "We value conservatively and market quietly. Tell me the property type and I'll arrange a CMA this week.", 500);
        setChoices(["Apartment", "Villa / Bungalow", "Townhouse", "Land"]);
      } else if (intent === "Invest") {
        await say("bot", "Our investment desk models net yield, not headline yield. Off-plan at Gemini currently projects 6.4% net on handover.", 500);
        setChoices(["Send yield report", "Book a call", "Browse listings"]);
      } else {
        await say("bot", "Logged. An adviser will follow up on the email you provided — usually the same working day.", 400);
        setChoices(["Start over"]);
      }
      if (intent === "Start over") {
        log.innerHTML = "";
        intro();
      }
    }

    async function intro() {
      const lead = JSON.parse(localStorage.getItem(LEAD_KEY) || "null");
      await say("bot", "Good day. I'm the M Realty private concierge.", 200);
      if (lead && lead.email) {
        stage = "intent";
        await say("bot", `Welcome back, ${lead.name || "there"}. Are you looking to Buy, Sell, or Invest?`, 400);
        setChoices(["Buy", "Sell", "Invest"]);
      } else {
        stage = "email";
        await say("bot", "Before we begin — which email should we use for your enquiry?", 400);
        form.hidden = false;
      }
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = form.querySelector("input").value.trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return;
      localStorage.setItem(LEAD_KEY, JSON.stringify({ email, ts: Date.now() }));
      form.hidden = true;
      await say("user", email);
      await say("bot", "Thank you. Are you looking to Buy, Sell, or Invest?", 400);
      setChoices(["Buy", "Sell", "Invest"]);
    });

    document.querySelectorAll("[data-concierge-open]").forEach((b) =>
      b.addEventListener("click", () => {
        panel.classList.toggle("is-open");
        if (panel.classList.contains("is-open") && !log.children.length) intro();
      })
    );
    panel.querySelector("[data-concierge-close]").addEventListener("click", () =>
      panel.classList.remove("is-open")
    );
  }

  /* ---------- mount ---------- */
  function mount(activePage) {
    document.body.insertAdjacentHTML("afterbegin", headerHTML(activePage));
    document.body.insertAdjacentHTML("beforeend", footerHTML());
    document.body.insertAdjacentHTML("beforeend", conciergeHTML());
    initConcierge();
    updateSavedCount();

    // sticky header shadow
    const header = document.querySelector(".site-header");
    const onScroll = () => header.classList.toggle("is-scrolled", scrollY > 8);
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // mobile nav
    const toggle = document.querySelector(".nav-toggle");
    toggle.addEventListener("click", () => {
      const open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    document.querySelectorAll(".main-nav a").forEach((a) =>
      a.addEventListener("click", () => document.body.classList.remove("nav-open"))
    );

    // newsletter demo handler
    document.querySelectorAll("[data-newsletter]").forEach((f) =>
      f.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = f.querySelector("input");
        localStorage.setItem(LEAD_KEY, JSON.stringify({ email: input.value, ts: Date.now(), source: "newsletter" }));
        f.innerHTML = '<p style="color:#c5a059;font-size:14px">Request received — our register opens weekly.</p>';
      })
    );

    // delegate data-notify forms added after mount (injected content)
    document.addEventListener("submit", (e) => {
      const f = e.target;
      if (f.matches && f.matches("form[data-notify]") && !f.dataset.wired) {
        f.dataset.wired = "1";
        wireForm(f, f.dataset.notify);
      }
    }, true);

    // reveal on scroll
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && en.target.classList.add("is-visible")),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  }

  /* ---------- card renderer (shared by listings/home/saved) ---------- */
  function cardHTML(p, view = "grid") {
    const statusClass =
      p.status === "Off-Plan" ? "card__status--offplan" : p.status === "Sold" ? "card__status--sold" : "";
    return `
      <article class="card" data-id="${p.id}">
        <div class="card__media">
          <span class="card__status ${statusClass}">${p.status}</span>
          <button class="card__fav ${isSaved(p.id) ? "is-saved" : ""}" data-fav="${p.id}"
                  aria-label="Save ${p.title}">${ICONS.heart}</button>
          <a href="property.html?id=${p.id}" aria-label="View ${p.title}">
            <img src="${p.images[0]}" alt="${p.title}, ${p.location}" loading="lazy" width="700" height="520" />
          </a>
          <a class="card__cta" href="property.html?id=${p.id}">View Details</a>
        </div>
        <div class="card__body">
          <span class="card__price">${MR.currency(p.price)}</span>
          <h3 class="card__title"><a href="property.html?id=${p.id}">${p.title}</a></h3>
          <span class="card__loc">${ICONS.pin}${p.address}</span>
          <p class="card__blurb">${p.blurb}</p>
          <div class="card__specs">
            <span>${ICONS.bed} ${p.beds} Bed</span>
            <span>${ICONS.bath} ${p.baths} Bath</span>
            <span>${ICONS.area} ${p.sqft.toLocaleString()} sq ft</span>
          </div>
        </div>
      </article>`;
  }

  function bindFavButtons(scope = document) {
    scope.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-fav]");
      if (!btn) return;
      e.preventDefault();
      const nowSaved = toggleSaved(btn.dataset.fav);
      btn.classList.toggle("is-saved", nowSaved);
    });
  }

  return { mount, cardHTML, bindFavButtons, ICONS, getSaved, isSaved, toggleSaved, updateSavedCount };
})();
