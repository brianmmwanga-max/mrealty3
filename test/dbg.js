const pw = require("playwright-core");
(async () => {
  const browser = await pw.chromium.launch({ executablePath: "/root/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome", args: ["--no-sandbox"] });
  const page = await browser.newPage();
  page.on("pageerror", e => console.log("PAGEERR:", e.message));
  page.on("console", m => console.log("CONSOLE:", m.type(), m.text()));
  await page.goto("http://localhost:8123/index.html", { waitUntil: "networkidle" });
  await page.click("[data-concierge-open]");
  await page.waitForTimeout(1500);
  console.log(await page.evaluate(() => document.querySelector("[data-concierge-log]").innerText));
  await page.fill("[data-concierge-form] input", "Wanjiku Test");
  await page.press("[data-concierge-form] input", "Enter");
  await page.waitForTimeout(2500);
  console.log("---after name---");
  console.log(await page.evaluate(() => document.querySelector("[data-concierge-log]").innerText));
  console.log("form hidden:", await page.getAttribute("[data-concierge-form]", "hidden"));
  console.log("placeholder:", await page.getAttribute("[data-concierge-form] input", "placeholder"));
  await browser.close();
})();
