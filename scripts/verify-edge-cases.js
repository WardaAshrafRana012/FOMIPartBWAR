import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const browser = await chromium.launch({ channel: "chrome" });
const context = await browser.newContext({
  viewport: { width: 390, height: 900 },
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const read = () =>
  page.evaluate(() => JSON.parse(localStorage.getItem("fomi-continuity-v1")));
await page.goto("http://localhost:3100");
await page.locator("#prompt").waitFor();
await page.getByRole("button", { name: "Creative brief", exact: true }).click();
await page
  .getByRole("dialog")
  .getByRole("textbox")
  .fill("A revised evening ritual.");
await page.keyboard.press("Escape");
await page.locator(".storyboard .shot-select").nth(1).focus();
await page.keyboard.press("Enter");
await page
  .getByRole("heading", { name: "Light through amber", exact: true })
  .waitFor();
await page.waitForTimeout(650);
await page.reload();
await page
  .getByRole("heading", { name: "Light through amber", exact: true })
  .waitFor();
console.log("PASS mobile brief access and keyboard shot selection persist");
await page.getByRole("button", { name: "Shot overrides & reference" }).click();
await page
  .locator(".advanced")
  .getByRole("textbox")
  .last()
  .fill("Locked camera; no orbit.");
await page.getByRole("button", { name: "Generate 2 alternatives" }).click();
await page.locator(".storyboard .shot-select").nth(2).click();
await page
  .getByRole("heading", { name: "The evening ritual", exact: true })
  .waitFor();
await page.waitForTimeout(4700);
let p = (await read()).projects[0];
assert.equal(p.shots[1].takes.length, 4);
assert.equal(
  p.shots[1].takes.at(-1).request.overrides.camera,
  "Locked camera; no orbit.",
);
assert.equal(
  p.shots[1].takes.at(-1).request.direction.camera,
  "Locked camera; no orbit.",
);
assert.equal(p.shots[2].takes.length, 2);
console.log(
  "PASS generation stays attached to submitted shot and override while reviewing another shot",
);
await page.getByRole("button", { name: "Generate 2 alternatives" }).dblclick();
await page.waitForTimeout(1000);
await page.reload();
await page.locator("#prompt").waitFor();
await page.waitForTimeout(4500);
assert.equal((await read()).projects[0].shots[2].takes.length, 2);
console.log("PASS reload cancels running job without adding takes");
await page.getByRole("button", { name: "Project", exact: true }).click();
await page.getByRole("dialog").getByRole("textbox").fill("A second campaign");
await page.getByRole("button", { name: "Create project", exact: true }).click();
await page
  .getByRole("heading", { name: "Every story starts with a shot." })
  .waitFor();
await page
  .getByRole("button", { name: "Rename project" })
  .isVisible()
  .catch(() => false); // Rename is available at wider viewports.
await page.getByLabel("Switch project").selectOption("after-hours");
await page
  .getByRole("heading", { name: "The evening ritual", exact: true })
  .waitFor();
await page.waitForTimeout(650);
assert.equal((await read()).projects.length, 2);
console.log("PASS project creation and switching preserve original project");
await page.setViewportSize({ width: 1280, height: 900 });
await page.getByLabel("Rename project").click();
await page
  .getByRole("dialog")
  .getByRole("textbox")
  .fill("AFTER HOURS - review");
await page.getByRole("button", { name: "Save name", exact: true }).click();
await page.waitForTimeout(650);
assert.equal((await read()).projects[0].name, "AFTER HOURS - review");
await page.getByRole("button", { name: "Reset demo", exact: true }).click();
await page.getByRole("button", { name: "Keep my work" }).click();
assert.equal((await read()).projects.length, 2);
console.log("PASS rename and reset confirmation cancellation");
const denied = await browser.newContext();
await denied.addInitScript(() => {
  Storage.prototype.setItem = function () {
    throw new DOMException("Blocked in test", "QuotaExceededError");
  };
});
const deniedPage = await denied.newPage();
await deniedPage.goto("http://localhost:3100");
await deniedPage
  .getByRole("status")
  .filter({ hasText: "Save failed" })
  .waitFor();
console.log("PASS storage failure gives accurate save feedback");
assert.deepEqual(errors, []);
await browser.close();
