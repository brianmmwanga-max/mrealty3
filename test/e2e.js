const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));
  page.on("console", (m) => m.type() === "error" && errors.push("CONSOLE: " + m.text()));

  const shots = [];
  async function visit(url, name, full = true) {
    await page.goto("http://localhost:8099/" + url, { waitUntil: "networkidle2" });
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: `shots/${name}.png`, fullPage: full });
    shots.push(name);
  }

  await page.setViewport({ width: 1440, height: 900 });

  await visit("index.html", "home-hero", false);
  await visit("index.html", "home-full", true);
  await visit("listings.html", "listings", true);

  await visit("listings.html?location=Westlands&sort=price-desc", "listings-filtered", false);
  const count = await page.$eval("#result-count", (el) => el.textContent);
  console.log("Filtered count text:", count.trim());

  await visit("listings.html?view=list", "listings-list-view", false);

  await visit("property.html?id=gem-a1201", "property", true);
  await page.click(".gallery__main img");
  await new Promise((r) => setTimeout(r, 300));
  const lbOpen = await page.$eval("#lightbox", (el) => el.classList.contains("is-open"));
  console.log("Lightbox opens:", lbOpen);
  await page.keyboard.press("Escape");

  // mortgage calc sanity
  const monthly = await page.$eval("#mc-monthly", (el) => el.textContent);
  console.log("Mortgage monthly @ default:", monthly);

  await visit("project.html", "project", true);
  await visit("about.html", "about", true);
  await visit("contact.html", "contact", true);

  // concierge flow on index
  await page.goto("http://localhost:8099/index.html", { waitUntil: "networkidle2" });
  await page.click("[data-concierge-open]");
  await new Promise((r) => setTimeout(r, 700));
  await page.type("[data-concierge-form] input", "test@client.com");
  await page.click("[data-concierge-form] button");
  await new Promise((r) => setTimeout(r, 900));
  const choices = await page.$$eval("[data-concierge-choices] button", (bs) => bs.map((b) => b.textContent));
  console.log("Concierge choices after email:", choices.join(", "));
  await page.screenshot({ path: "shots/concierge.png" });

  // save favorite then check saved page
  await page.goto("http://localhost:8099/listings.html", { waitUntil: "networkidle2" });
  await page.click("[data-fav]");
  await page.goto("http://localhost:8099/saved.html", { waitUntil: "networkidle2" });
  const savedCount = await page.$eval("#saved-count", (el) => el.textContent.trim());
  console.log("Saved page:", savedCount);
  await page.screenshot({ path: "shots/saved.png" });

  // mobile checks
  await page.setViewport({ width: 390, height: 844 });
  await page.goto("http://localhost:8099/index.html", { waitUntil: "networkidle2" });
  await page.screenshot({ path: "shots/mobile-home.png" });
  await page.goto("http://localhost:8099/listings.html", { waitUntil: "networkidle2" });
  await page.screenshot({ path: "shots/mobile-listings.png", fullPage: false });
  await page.click(".nav-toggle");
  await new Promise((r) => setTimeout(r, 400));
  const navT = await page.$eval(".main-nav", (el) => getComputedStyle(el).transform);
  console.log("Mobile nav transform after toggle:", navT);
  await page.screenshot({ path: "shots/mobile-nav.png" });

  console.log("Screenshots:", shots.join(", "));
  console.log(errors.length ? "ERRORS:\n" + errors.join("\n") : "NO JS ERRORS");
  await browser.close();
})().catch((e) => { console.error("FATAL", e); process.exit(1); });
