import { chromium } from "@playwright/test";
const browser = await chromium.launch({ channel: "chrome" }),
  context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  }),
  page = await context.newPage();
await page.goto(process.env.BASE_URL || "http://localhost:3101");
await page.locator("#prompt").waitFor();
await page.waitForTimeout(650);
await page.screenshot({ path: "docs/screenshots/studio-desktop.png" });
await page.getByRole("button", { name: "Compare takes", exact: true }).click();
await page.screenshot({ path: "docs/screenshots/studio-comparison.png" });
await page.keyboard.press("Escape");
await page.setViewportSize({ width: 390, height: 844 });
await page.screenshot({ path: "docs/screenshots/studio-mobile.png" });
await page.getByRole("button", { name: "Direction", exact: true }).click();
await page.getByRole("tab", { name: "References" }).click();
await page.screenshot({ path: "docs/screenshots/studio-mobile-direction.png" });
await page.getByRole("button", { name: "Sequence", exact: true }).click();
await page.screenshot({ path: "docs/screenshots/studio-mobile-sequence.png" });
await browser.close();
