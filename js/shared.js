/* ============================================================
   M REALTY — Shared chrome: header, footer, concierge, saved
   ============================================================ */

const MRShared = (() => {
  const SAVED_KEY = "mr_saved";
  const LEAD_KEY = "mr_lead";
  const CFG = window.MRCONFIG || {};

  /* ---------- icons ---------- */
  const ICONS = {
    whatsapp: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.4 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1a12 12 0 0 1-5.7-4.9c-.6-.9-1-2-1-2.7 0-.8.4-1.5.9-1.9.2-.2.4-.3.6-.3h.5c.2 0 .4 0 .5.4l.8 1.8c.1.2 0 .4-.1.5l-.4.5c-.1.2-.2.3 0 .5.5.9 1.6 2 2.6 2.5.2.1.4 0 .5-.1l.6-.7c.2-.2.3-.2.5-.1l1.7.8c.2.1.4.2.4.3 0 .2 0 .8-.2 1.3z"/></svg>',
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
          <img class="logo__img" src="assets/img/logo.png" alt="M Realty" width="150" height="48" />
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
              <img class="logo__img logo__img--footer" src="assets/img/logo-light.png" alt="M Realty" width="120" height="40" />
            </div>
            <p>A Nairobi advisory for exceptional residential assets — development
            sales, prime resale, off-plan and investment counsel. Founded and led by
            Realtor Brian Mwangi.</p>
          </div>
          <div class="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="listings.html">All Listings</a></li>
              <li><a href="offplan.html">Off-Plan Guide</a></li>
              <li><a href="project.html">The Gemini Project</a></li>
              <li><a href="investment.html">Yield Calculator</a></li>
              <li><a href="about.html">Our Advisers</a></li>
              <li><a href="saved.html">Saved Properties</a></li>
              <li><a href="contact.html">Book a Viewing</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Legal</h4>
            <ul>
              <li><a href="legal.html#privacy">Privacy Policy</a></li>
              <li><a href="legal.html#terms">Terms of Service</a></li>
              <li><a href="legal.html#data">Data Protection</a></li>
              <li><a href="legal.html#ethics">Ethical Sales Policy</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Contact</h4>
            <ul>
              <li>Park Lane Chambers, 4th Floor<br/>Westlands, Nairobi</li>
              <li><a href="tel:+254183255543">+254 183 255543</a></li>
              <li><a href="mailto:contacts.mrealtyke@gmail.com">contacts.mrealtyke@gmail.com</a></li>
              <li><a href="${CFG.whatsappLink}" target="_blank" rel="noopener">Chat on WhatsApp</a></li>
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
          <small>M Realty · Realtor Brian Mwangi</small>
          <strong>Private Concierge</strong>
        </div>
        <button class="concierge__close" data-concierge-close aria-label="Close">&times;</button>
      </div>
      <div class="concierge__log" data-concierge-log></div>
      <div class="concierge__choices" data-concierge-choices hidden></div>
      <form class="concierge__form" data-concierge-form hidden>
        <input type="text" name="field" required placeholder="Your answer" aria-label="Your answer" autocomplete="on" />
        <button type="submit" aria-label="Send">&#8594;</button>
      </form>
    </section>`;

  /* ---------- concierge logic (lead capture + guided flow + FAQ) ---------- */
  function initConcierge() {
    const panel = document.querySelector("[data-concierge]");
    if (!panel) return;
    const log = panel.querySelector("[data-concierge-log]");
    const choicesBox = panel.querySelector("[data-concierge-choices]");
    const form = panel.querySelector("[data-concierge-form]");
    const input = form.querySelector("input");

    const lead = Object.assign({ name: "", email: "", phone: "" },
      JSON.parse(localStorage.getItem(LEAD_KEY) || "{}"));
    let answers = {}; // guided Q&A collected this session

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

    const setChoices = (items, handler) => {
      choicesBox.innerHTML = "";
      items.forEach((label) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = label;
        b.addEventListener("click", () => handler(label));
        choicesBox.appendChild(b);
      });
      choicesBox.hidden = false;
    };

    const askField = async (placeholder, type, cb) => {
      input.placeholder = placeholder;
      input.type = type;
      form.hidden = false;
      form.onsubmit = async (e) => {
        e.preventDefault();
        const v = input.value.trim();
        if (!v) return;
        if (type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) {
          await say("bot", "Please enter a valid email address.", 200);
          return;
        }
        if (type === "tel" && v.replace(/\D/g, "").length < 7) {
          await say("bot", "That phone number looks incomplete — mind checking it?", 200);
          return;
        }
        form.hidden = true;
        input.value = "";
        await say("user", v);
        cb(v);
      };
    };

    /* ---- finalise: send enquiry through MRNotify (email + WhatsApp) ---- */
    async function finish(extra = {}) {
      const payload = {
        Name: lead.name || "—",
        Email: lead.email || "—",
        Phone: lead.phone || "—",
        Intent: answers.intent || "General",
        Budget: answers.budget || "—",
        Area: answers.area || "—",
        Type: answers.type || "—",
        Preference: answers.pref || "—",
        ...extra
      };
      const res = await MRNotify.send("Concierge Enquiry", payload);
      await say("bot", `Thank you${lead.name ? ", " + lead.name.split(" ")[0] : ""}. Your enquiry has been sent to Brian's desk — expect a reply the same working day.`, 600);
      choicesBox.innerHTML = "";
      const wa = document.createElement("a");
      wa.className = "msg msg--cta";
      wa.href = res.waLink;
      wa.target = "_blank";
      wa.rel = "noopener";
      wa.textContent = "Continue on WhatsApp →";
      choicesBox.appendChild(wa);
      const again = document.createElement("button");
      again.type = "button";
      again.textContent = "Start over";
      again.addEventListener("click", () => { choicesBox.hidden = true; log.innerHTML = ""; answers = {}; intro(); });
      choicesBox.appendChild(again);
      choicesBox.hidden = false;
    }

    /* ---- guided branches ---- */
    async function branch(intent) {
      answers.intent = intent;
      choicesBox.hidden = true;

      if (intent === "Speak to Brian") {
        await say("bot", "Brian personally handles prime resale and development mandates. I'll pass your details across now — he usually calls back within the hour on working days.", 500);
        return finish({ Note: "Requested a direct call from Brian Mwangi." });
      }
      if (intent === "Book Viewing") {
        await say("bot", "Happy to arrange one. Which area should we look at?", 500);
        return setChoices(["Westlands", "Kilimani", "Lavington", "Karen / Runda", "Anywhere"], async (area) => {
          choicesBox.hidden = true;
          await say("user", area);
          answers.area = area;
          await say("bot", "Noted. What day suits you — weekday mornings, weekday evenings, or Saturday?", 400);
          return setChoices(["Weekday AM", "Weekday PM", "Saturday"], async (slot) => {
            choicesBox.hidden = true;
            await say("user", slot);
            answers.pref = slot;
            finish({ Note: "Viewing request" });
          });
        });
      }
      if (intent === "FAQ") {
        await say("bot", "Ask me anything below, or pick a common question.", 300);
        return setChoices(
          ["How do I schedule a viewing?", "Do you handle off-plan investments?", "What are your fees?", "Can I get a mortgage valuation?"],
          async (q) => {
            choicesBox.hidden = true;
            await say("user", q);
            const a = {
              "How do I schedule a viewing?": "Pick “Book Viewing” from the main menu, or WhatsApp Brian directly — viewings run Mon–Sat, usually within 48 hours of request.",
              "Do you handle off-plan investments?": "Yes. We represent select developments including The Gemini Project in Westlands. Our off-plan guide covers payment plans, escrow protection, and projected yields.",
              "What are your fees?": "For buyers we are typically commission-based from the seller/developer — your advisory is without cost unless a separate mandate is agreed. Nothing is ever hidden.",
              "Can I get a mortgage valuation?": "We work with valuers registered with the Board of Valuers and can introduce you to bank relationship managers for KES-denominated mortgages."
            }[q];
            await say("bot", a, 400);
            setChoices(["Back to menu"], (l) => { choicesBox.hidden = true; say("bot", l === "Back to menu" ? "Of course." : l, 200).then(mainMenu); });
          }
        );
      }

      /* Buy / Sell / Invest */
      if (intent === "Buy") {
        await say("bot", "Understood. What budget band are you working with?", 500);
        return setChoices(["KES 10–25M", "KES 25–60M", "KES 60M+", "Not sure yet"], async (budget) => {
          choicesBox.hidden = true;
          await say("user", budget);
          answers.budget = budget;
          await say("bot", "And the preferred sub-market?", 400);
          return setChoices(["Westlands", "Kilimani", "Lavington", "Karen / Runda", "Open to ideas"], async (area) => {
            choicesBox.hidden = true;
            await say("user", area);
            answers.area = area;
            await askField("Property type? (e.g. 3-bed apartment)", "text", (t) => {
              answers.type = t;
              finish();
            });
          });
        });
      }
      if (intent === "Sell") {
        await say("bot", "We value conservatively and market quietly. What is the property type?", 500);
        return setChoices(["Apartment", "Villa / Bungalow", "Townhouse", "Land"], async (type) => {
          choicesBox.hidden = true;
          await say("user", type);
          answers.type = type;
          await askField("Which area is it located in?", "text", (area) => {
            answers.area = area;
            finish({ Note: "CMA / listing request" });
          });
        });
      }
      if (intent === "Invest") {
        await say("bot", "Our investment desk models net yield, not headline yield. Off-plan at Gemini currently projects 6.4% net on handover. What ticket size are you considering?", 500);
        return setChoices(["Under KES 15M", "KES 15–40M", "KES 40M+", "Portfolio level"], async (budget) => {
          choicesBox.hidden = true;
          await say("user", budget);
          answers.budget = budget;
          await say("bot", "Should we send the yield report by email, or would you prefer a call?", 400);
          return setChoices(["Email the report", "Prefer a call"], async (pref) => {
            choicesBox.hidden = true;
            await say("user", pref);
            answers.pref = pref;
            finish({ Note: "Investment desk enquiry" });
          });
        });
      }
    }

    function mainMenu() {
      const items = ["Buy", "Sell", "Invest", "Book Viewing", "Speak to Brian", "Common Questions"];
      say("bot", "How can we help today?", 300).then(() =>
        setChoices(items, (label) => {
          const intent = label === "Common Questions" ? "FAQ" : label;
          choicesBox.hidden = true;
          say("user", label, 100).then(() => branch(intent));
        })
      );
    }

    /* ---- intro: capture name → email → phone (remembered after) ---- */
    async function intro() {
      await say("bot", "Good day — I'm the M Realty private concierge, representing Realtor Brian Mwangi.", 200);
      if (lead.email) {
        await say("bot", `Welcome back, ${lead.name || "there"}.`, 400);
        return mainMenu();
      }
      await say("bot", "So an adviser can follow up properly — may I take your full name first?", 400);
      askField("Full name", "text", (name) => {
        lead.name = name;
        localStorage.setItem(LEAD_KEY, JSON.stringify({ ...lead, ts: Date.now(), source: "concierge" }));
        say("bot", `Thank you, ${name.split(" ")[0]}. Which email should we use for your enquiry?`, 400)
          .then(() => askField("Email address", "email", (email) => {
            lead.email = email;
            localStorage.setItem(LEAD_KEY, JSON.stringify({ ...lead, ts: Date.now(), source: "concierge" }));
            say("bot", "And a contact number, if you'd prefer a call?", 400)
              .then(() => askField("Phone — or type 'skip'", "tel", (phone) => {
                if (phone.toLowerCase() !== "skip") lead.phone = phone;
                localStorage.setItem(LEAD_KEY, JSON.stringify({ ...lead, ts: Date.now(), source: "concierge" }));
                mainMenu();
              }));
          }));
      });
    }

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

  /* ---------- generic form wiring (any form[data-notify="Type"]) ---------- */
  function successHTML(res) {
    return `
      <div class="form-success">
        <p><strong>Thank you — your enquiry has been received.</strong></p>
        <p>A member of Brian's desk will reply to the email provided, typically the same working day.</p>
        <div class="form-success__actions">
          <a class="btn btn--wa" href="${res.waLink}" target="_blank" rel="noopener">Continue on WhatsApp</a>
          <a class="btn btn--outline-gold" href="${res.mailto}">Send by Email instead</a>
        </div>
      </div>`;
  }

  async function wireForm(f, type) {
    const btn = f.querySelector("button[type=submit]");
    if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = "Sending…"; }
    const data = {};
    new FormData(f).forEach((v, k) => { data[k] = typeof v === "string" ? v.trim() : v; });
    /* remember lead for concierge personalisation */
    if (data.email) {
      localStorage.setItem(LEAD_KEY, JSON.stringify({
        name: data.name || "", email: data.email, phone: data.phone || "", ts: Date.now(), source: type
      }));
    }
    const res = await MRNotify.send(type, data);
    f.innerHTML = successHTML(res);
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

    // newsletter — routes through MRNotify (email + WhatsApp queue)
    document.querySelectorAll("[data-newsletter]").forEach((f) =>
      f.addEventListener("submit", async (e) => {
        e.preventDefault();
        const input = f.querySelector("input");
        localStorage.setItem(LEAD_KEY, JSON.stringify({ email: input.value, ts: Date.now(), source: "newsletter" }));
        const res = await MRNotify.send("Off-Market Access request", { Email: input.value });
        f.innerHTML = `<p class="news-ok">Request received — our register opens weekly.</p>
          <a class="news-wa" href="${res.waLink}" target="_blank" rel="noopener">Confirm on WhatsApp →</a>`;
      })
    );

    // floating WhatsApp launcher (all pages)
    if (!document.querySelector(".wa-float")) {
      document.body.insertAdjacentHTML("beforeend", `
        <a class="wa-float" href="${CFG.whatsappLink}" target="_blank" rel="noopener"
           aria-label="Chat with M Realty on WhatsApp" title="Chat on WhatsApp">${ICONS.whatsapp}</a>`);
    }

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
