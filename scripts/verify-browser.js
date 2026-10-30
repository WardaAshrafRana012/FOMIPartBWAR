import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1050 },
  reducedMotion: "reduce",
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("response", (r) => {
  if (r.status() === 404) console.log("MISSING", r.url());
});
page.on("console", (m) => {
  if (m.type() === "error" && !m.text().includes("422")) errors.push(m.text());
});
const check = async (name, fn) => {
  await fn();
  console.log(`PASS ${name}`);
};
const waitSave = () => page.waitForTimeout(650);
const state = () =>
  page.evaluate(() => JSON.parse(localStorage.getItem("fomi-continuity-v1")));
await page.goto("http://localhost:3100");
await page
  .getByRole("heading", { name: "The invitation", exact: true })
  .waitFor();
await waitSave();
await check("seed and playable local media", async () => {
  assert.equal((await state()).projects[0].shots.length, 4);
  await page.locator("video").evaluate((v) => v.play());
  await page.waitForTimeout(1800);
  assert.ok(await page.locator("video").evaluate((v) => v.currentTime > 0));
  await page.locator("video").evaluate((v) => v.pause());
});
await fs.mkdir("docs/screenshots", { recursive: true });
await page.screenshot({ path: "docs/screenshots/desktop.png", fullPage: true });
await check("prompt and DNA persist across reload", async () => {
  await page
    .locator("#prompt")
    .fill("Slowly reveal the amber bottle in a pool of evening light.");
  await page
    .getByRole("button", { name: "Creative DNA The thread", exact: false })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("textbox")
    .nth(2)
    .fill("A warm window at blue hour.");
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await waitSave();
  await page.reload();
  await page.locator("#prompt").waitFor();
  assert.match(await page.locator("#prompt").inputValue(), /Slowly reveal/);
  assert.equal(
    (await state()).projects[0].dna.lighting,
    "A warm window at blue hour.",
  );
  await page.getByText("Earlier DNA", { exact: true }).first().waitFor();
});
await check("add, duplicate, reorder and delete", async () => {
  await page.getByRole("button", { name: "Add a shot", exact: true }).click();
  await page.getByLabel("SHOT NAME", { exact: true }).fill("Test insert");
  await page.getByLabel("Duplicate shot", { exact: true }).click();
  await page
    .getByRole("button", { name: "Move Test insert — copy up", exact: true })
    .click();
  await page.getByLabel("Delete shot", { exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Delete shot", exact: true })
    .click();
  await waitSave();
  const shots = (await state()).projects[0].shots;
  assert.equal(shots.length, 5);
  assert.equal(shots.at(-1).name, "Test insert");
});
await page
  .locator(".storyboard")
  .getByRole("button", { name: "01 The invitation", exact: false })
  .click();
await check("validation and generation preserves choice", async () => {
  await page.locator("#prompt").fill("");
  await page.getByRole("button", { name: "Generate 2 alternatives" }).click();
  await page.getByText("Direction must contain 8–3000 characters.").waitFor();
  await page
    .locator("#prompt")
    .fill("Slowly reveal the amber bottle in a pool of evening light.");
  await page.getByRole("button", { name: "Retry · 2 alternatives" }).click();
  await page.getByText("Request queued…").waitFor();
  await page.getByText("Developing alternatives…").waitFor();
  await page
    .getByText("Two alternatives ready. Your chosen take is unchanged.")
    .waitFor();
  await waitSave();
  const s = (await state()).projects[0].shots[0];
  assert.equal(s.takes.length, 4);
  assert.equal(s.chosen, "take-0-1");
});
await check("cancel, explicit failure, retry", async () => {
  await page.getByRole("button", { name: "Generate 2 alternatives" }).click();
  await page.getByRole("button", { name: "Cancel generation" }).click();
  await page.getByText("Cancelled. Your selected take is unchanged.").waitFor();
  await page
    .getByRole("button", { name: "Shot overrides & reference" })
    .click();
  await page.getByLabel("Demonstrate generation failure").check();
  await page.getByRole("button", { name: "Retry · 2 alternatives" }).click();
  await page
    .getByText("Demonstration failure. No takes were added. Retry when ready.")
    .waitFor();
  await page.getByLabel("Demonstrate generation failure").uncheck();
  await page.getByRole("button", { name: "Retry · 2 alternatives" }).click();
  await page
    .getByText("Two alternatives ready. Your chosen take is unchanged.")
    .waitFor();
  await page
    .getByRole("button", { name: "Shot overrides & reference" })
    .click();
});
await check("compare, choose, decision note", async () => {
  await page.getByRole("button", { name: "Compare takes" }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Choose for sequence" })
    .first()
    .click();
  await page.getByRole("dialog").getByText("✓ In sequence").waitFor();
  await page.keyboard.press("Escape");
  await page.getByLabel("Decision note").fill("Selected for a quiet entrance.");
  await waitSave();
  const s = (await state()).projects[0].shots[0];
  assert.notEqual(s.chosen, "take-0-1");
  assert.equal(s.note, "Selected for a quiet entrance.");
});
await check("dialog focus trap and Escape return", async () => {
  const button = page.getByRole("button", {
    name: "Review sequence",
    exact: false,
  });
  await button.click();
  assert.ok(await page.getByRole("dialog").isVisible());
  await page.keyboard.press("Shift+Tab");
  assert.ok(
    await page.evaluate(() =>
      document.querySelector("dialog").contains(document.activeElement),
    ),
  );
  await page.keyboard.press("Escape");
  assert.ok(await button.evaluate((el) => el === document.activeElement));
});
await check("sequence advances consecutively", async () => {
  await page
    .getByRole("button", { name: "Review sequence", exact: false })
    .click();
  await page
    .getByRole("button", { name: "Play sequence", exact: true })
    .click();
  await page
    .getByText("2 / 4 · Light through amber")
    .waitFor({ timeout: 10000 });
  await page.keyboard.press("Escape");
});
await check("export current project JSON with missing selections", async () => {
  await page.getByRole("button", { name: "Export package" }).click();
  await page.getByText("Missing selections:", { exact: false }).waitFor();
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download project JSON" }).click();
  const d = await pending;
  const pkg = JSON.parse(await fs.readFile(await d.path(), "utf8"));
  assert.equal(pkg.shots.length, 5);
  assert.equal(pkg.shots[0].note, "Selected for a quiet entrance.");
  assert.equal(pkg.dna.lighting, "A warm window at blue hour.");
  await page.keyboard.press("Escape");
});
await check("responsive layouts without horizontal page overflow", async () => {
  for (const width of [360, 390, 430, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `Overflow at ${width}`,
    );
    await page.screenshot({
      path: `docs/screenshots/width-${width}.png`,
      fullPage: true,
    });
  }
});
await check("malformed data recovers safely", async () => {
  await page.addInitScript(() =>
    localStorage.setItem("fomi-continuity-v1", "{broken"),
  );
  await page.reload();
  await page
    .getByText("Unreadable local data was replaced with the demo.")
    .waitFor();
  await page
    .getByRole("heading", { name: "The invitation", exact: true })
    .waitFor();
});
await check("API rejects malformed JSON and invalid fields", async () => {
  let r = await context.request.post("http://localhost:3100/api/generate", {
    data: { prompt: "bad" },
  });
  assert.equal(r.status(), 422);
  r = await context.request.post("http://localhost:3100/api/generate", {
    data: Buffer.from("{bad"),
    headers: { "Content-Type": "application/json" },
  });
  assert.equal(r.status(), 400);
});
assert.deepEqual(errors, []);
console.log("PASS no uncaught page or console errors");
await browser.close();
