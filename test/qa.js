const pw = require("playwright-core");
(async () => {
  const browser = await pw.chromium.launch({ executablePath: "/root/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome", args: ["--no-sandbox"] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  // 1. Home: logo image present & sized
  await page.goto("http://localhost:8123/index.html", { waitUntil: "networkidle" });
  const logoBox = await page.locator(".site-header .logo__img").boundingBox();
  console.log("header logo:", logoBox && Math.round(logoBox.height) + "px tall");
  const waFloat = await page.locator(".wa-float").count();
  console.log("whatsapp float:", waFloat);

  // 2. Newsletter submit -> MRNotify queue
  await page.fill("[data-newsletter] input", "test@client.com");
  await page.click("[data-newsletter] button");
  await page.waitForSelector(".news-ok", { timeout: 3000 });
  const q = await page.evaluate(() => JSON.parse(localStorage.getItem("mr_queue") || "[]"));
  console.log("queue after newsletter:", q[q.length - 1].type);

  // 3. Concierge full lead capture flow
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.click("[data-concierge-open]");
  await page.waitForFunction(() => document.querySelector('[data-concierge-form]') && !document.querySelector('[data-concierge-form]').hidden, { timeout: 10000 });
  await page.fill("[data-concierge-form] input", "Wanjiku Test");
  await page.press("[data-concierge-form] input", "Enter");
  await page.waitForFunction(() => document.querySelector('[data-concierge-form] input').placeholder.toLowerCase().includes('email'), { timeout: 10000 });
  await page.fill("[data-concierge-form] input", "wanjiku@test.co.ke");
  await page.press("[data-concierge-form] input", "Enter");
  await page.waitForFunction(() => document.querySelector('[data-concierge-form] input').placeholder.includes('skip'), { timeout: 10000 });
  await page.fill("[data-concierge-form] input", "+254700111222");
  await page.press("[data-concierge-form] input", "Enter");
  await page.waitForSelector("text=How can we help today?", { timeout: 5000 });
  await page.click('[data-concierge-choices] button:has-text("Buy")');
  await page.click('[data-concierge-choices] button:has-text("KES 25–60M")');
  await page.click('[data-concierge-choices] button:has-text("Kilimani")');
  await page.fill("[data-concierge-form] input", "3-bed apartment");
  await page.press("[data-concierge-form] input", "Enter");
  await page.waitForSelector("text=sent to Brian's desk", { timeout: 5000 });
  const q2 = await page.evaluate(() => JSON.parse(localStorage.getItem("mr_queue")).slice(-1)[0]);
  console.log("concierge enquiry:", q2.data.Intent, "|", q2.data.Budget, "|", q2.data.Area, "|", q2.data.Email);
  const waLink = await page.getAttribute(".msg--cta", "href");
  console.log("wa link ok:", waLink.startsWith("https://wa.me/254183255543?text="));

  // 4. Contact form submit -> success state
  await page.goto("http://localhost:8123/contact.html", { waitUntil: "networkidle" });
  await page.fill('#contact-form input[name="name"]', "QA User");
  await page.fill('#contact-form input[name="email"]', "qa@user.com");
  await page.fill('#contact-form input[name="phone"]', "+254700000000");
  await page.fill('#contact-form textarea[name="message"]', "Automated QA submission.");
  await page.click('#contact-form button[type="submit"]');
  await page.waitForSelector(".form-success", { timeout: 4000 });
  console.log("contact success block:", await page.isVisible(".form-success"));

  // 5. Listings tabs + card hover CSS
  await page.goto("http://localhost:8123/listings.html?tab=offplan", { waitUntil: "networkidle" });
  const cards = await page.locator(".card").count();
  console.log("off-plan tab cards:", cards);

  // 6. Property page enquiry prefilled
  await page.goto("http://localhost:8123/property.html?id=gem-a12", { waitUntil: "networkidle" }).catch(()=>{});
  await page.waitForTimeout(600);
  const propVal = await page.locator('#inquiry-form input[name="property"]').inputValue().catch(() => "n/a");
  console.log("property enquiry prefilled:", propVal);

  await page.screenshot({ path: "shots/qa-home.png" });
  console.log("JS ERRORS:", errors.length ? errors : "none");
  await browser.close();
})().catch((e) => { console.error("QA FAIL:", e.message); process.exit(1); });
