const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));
  page.on("console", (m) => m.type() === "error" && errors.push("CONSOLE: " + m.text()));

  await page.setViewport({ width: 390, height: 844 });
  await page.goto("http://localhost:8099/index.html", { waitUntil: "networkidle2" });
  await page.click(".nav-toggle");
  await new Promise((r) => setTimeout(r, 500));
  const navBox = await page.$eval(".main-nav", (el) => {
    const b = el.getBoundingClientRect();
    return { top: b.top, h: b.height, visible: b.top >= 70 && b.top < 200 };
  });
  console.log("Mobile nav after toggle:", JSON.stringify(navBox));
  await page.screenshot({ path: "shots/mobile-nav.png" });

  // hero search handoff test on mobile
  await page.goto("http://localhost:8099/index.html", { waitUntil: "networkidle2" });
  await page.select("#hs-type", "Apartment");
  await page.evaluate(() => {
    const s = document.getElementById("hs-price");
    s.value = 15000000;
    s.dispatchEvent(new Event("input"));
  });
  await page.click("#hero-search button[type=submit]");
  await page.waitForFunction(() => location.pathname.includes("listings"), { timeout: 15000 });
  await new Promise((r) => setTimeout(r, 800));
  const chips = await page.$$eval(".chip", (cs) => cs.map((c) => c.textContent.replace("\u00d7", "").trim()));
  console.log("Handoff chips:", chips.join(" | "));
  await page.screenshot({ path: "shots/mobile-filtered.png" });

  // desktop list view screenshot
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:8099/listings.html?view=list&location=Westlands", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: "shots/list-view-desktop.png" });

  console.log(errors.length ? "ERRORS:\n" + errors.join("\n") : "NO JS ERRORS");
  await browser.close();
})().catch((e) => { console.error("FATAL", e); process.exit(1); });
