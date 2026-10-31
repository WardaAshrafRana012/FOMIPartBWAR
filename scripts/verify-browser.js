import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const base = process.env.BASE_URL || "http://localhost:3101";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  }),
  page = await context.newPage(),
  errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error" && !m.text().includes("422")) errors.push(m.text());
});
const state = () =>
    page.evaluate(() => JSON.parse(localStorage.getItem("fomi-continuity-v1"))),
  save = () => page.waitForTimeout(650),
  check = async (name, fn) => {
    await fn();
    console.log("PASS " + name);
  };
await page.goto(base);
await page.locator("#prompt").waitFor();
await save();
await fs.mkdir("docs/screenshots", { recursive: true });
await check("cinematic seed, playback and viewport composition", async () => {
  assert.equal((await state()).projects[0].shots.length, 4);
  assert.equal((await state()).projects[0].references.length, 3);
  await page.locator("video").evaluate((v) => v.play());
  await page.waitForTimeout(900);
  assert.ok(await page.locator("video").evaluate((v) => v.currentTime > 0));
  await page.locator("video").evaluate((v) => v.pause());
  await page.screenshot({
    path: "docs/screenshots/studio-desktop.png",
    fullPage: true,
  });
  assert.ok(
    await page
      .locator(".sequence-tray")
      .evaluate((el) => el.getBoundingClientRect().bottom <= innerHeight),
  );
});
await check(
  "DNA, prompt, overrides and explicit references persist",
  async () => {
    await page
      .locator("#prompt")
      .fill("A deliberate slow reveal of amber glass at blue hour.");
    await page
      .locator(".storyboard")
      .getByRole("button", { name: "Creative DNA", exact: false })
      .click();
    await page
      .getByRole("dialog")
      .getByRole("textbox", { name: "Lighting", exact: true })
      .fill("Warm light through a blue-hour window.");
    await page.getByRole("button", { name: "Done", exact: true }).click();
    await page
      .getByRole("button", { name: "Shot overrides & reference" })
      .click();
    await page
      .locator(".advanced")
      .getByRole("textbox")
      .last()
      .fill("Locked tripod; no camera orbit.");
    await page.getByRole("tab", { name: "References" }).click();
    await page
      .getByRole("button", {
        name: "Remove After Hours · product for this shot",
      })
      .click();
    await save();
    await page.reload();
    await page.locator("#prompt").waitFor();
    const p = (await state()).projects[0];
    assert.equal(p.dna.lighting, "Warm light through a blue-hour window.");
    assert.equal(
      p.shots[0].overrides.camera,
      "Locked tripod; no camera orbit.",
    );
    assert.equal(p.shots[0].referenceIds.length, 2);
    await page
      .getByRole("button", { name: "Earlier DNA · see changes" })
      .click();
    await page.getByText("1 creative rule has changed").waitFor();
    await page.screenshot({
      path: "docs/screenshots/studio-direction-diff.png",
    });
    await page.keyboard.press("Escape");
  },
);
await check("shot add duplicate reorder delete and undo redo", async () => {
  await page.getByRole("button", { name: "Add a shot", exact: true }).click();
  await page.getByText("Edit shot details", { exact: true }).click();
  await page.getByLabel("SHOT NAME", { exact: true }).fill("A quiet detail");
  await page.getByLabel("Duplicate shot", { exact: true }).click();
  await page
    .getByRole("button", { name: "Move A quiet detail — copy up", exact: true })
    .click();
  await page.getByLabel("Delete shot", { exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Delete shot", exact: true })
    .click();
  await page.getByLabel("Undo", { exact: true }).click();
  await save();
  assert.equal((await state()).projects[0].shots.length, 6);
  await page.getByLabel("Redo", { exact: true }).click();
  await save();
  assert.equal((await state()).projects[0].shots.length, 5);
});
await page.locator(".storyboard .shot-select").first().click();
await check(
  "route validates and generation snapshots references without replacing choices",
  async () => {
    await page.locator("#prompt").fill("");
    await page.getByRole("button", { name: "Generate 2 alternatives" }).click();
    await page.getByText("Direction must contain 8–3000 characters.").waitFor();
    await page
      .locator("#prompt")
      .fill("A deliberate slow reveal of amber glass at blue hour.");
    const req = page.waitForRequest(
      (r) => r.url().endsWith("/api/generate") && r.method() === "POST",
    );
    await page.getByRole("button", { name: "Retry · 2 alternatives" }).click();
    const payload = (await req).postDataJSON();
    assert.equal(payload.references.length, 2);
    assert.equal(payload.direction.camera, "Locked tripod; no camera orbit.");
    await page.getByText("Request queued…").waitFor();
    await page.getByText("Developing alternatives…").waitFor();
    await page.locator(".storyboard .shot-select").nth(1).click();
    await page.waitForTimeout(3500);
    await page.locator(".storyboard .shot-select").first().click();
    await page
      .getByText("Two alternatives ready. Your chosen take is unchanged.")
      .waitFor();
    await save();
    const s = (await state()).projects[0].shots[0];
    assert.equal(s.takes.length, 4);
    assert.equal(s.chosen, "take-0-1");
    assert.equal(s.takes.at(-1).request.references.length, 2);
  },
);
await check("cancel, deliberate failure and successful retry", async () => {
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
});
await check(
  "take comparison, shared playback, individual notes and selection",
  async () => {
    await page
      .getByRole("button", { name: "Compare takes", exact: true })
      .click();
    await page.getByRole("button", { name: "Play both", exact: true }).click();
    await page.waitForTimeout(700);
    assert.ok(
      await page
        .getByRole("dialog")
        .locator("video")
        .evaluateAll((vs) => vs.every((v) => v.currentTime > 0 && !v.paused)),
    );
    await page.getByRole("button", { name: "Pause both", exact: true }).click();
    await page
      .getByLabel("Decision note for comparison 1")
      .fill("Selected for the calmer camera movement.");
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Choose for sequence" })
      .first()
      .click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "In sequence", exact: true })
      .waitFor();
    await page.screenshot({ path: "docs/screenshots/studio-comparison.png" });
    await page.keyboard.press("Escape");
    await save();
    const s = (await state()).projects[0].shots[0];
    assert.notEqual(s.chosen, "take-0-1");
    assert.equal(s.note, "Selected for the calmer camera movement.");
  },
);
await check("frame capture and reference upload persist locally", async () => {
  await page.locator("video").evaluate(async (v) => {
    await v.play();
  });
  await page.waitForTimeout(250);
  await page
    .getByRole("button", { name: "Save current frame as reference" })
    .click();
  await page.getByRole("tab", { name: "References" }).click();
  await page
    .getByLabel("Upload reference image")
    .setInputFiles({
      name: "campaign-reference.webp",
      mimeType: "image/webp",
      buffer: await fs.readFile("public/demo/material.webp"),
    });
  await save();
  const refs = (await state()).projects[0].references;
  assert.equal(refs.length, 5);
  assert.ok(refs.at(-1).src.startsWith("data:image/webp"));
  await page.screenshot({ path: "docs/screenshots/studio-references.png" });
});
await check(
  "dialog keyboard trap, focus return and sequence advancement",
  async () => {
    const opener = page.getByRole("button", {
      name: "Review sequence",
      exact: false,
    });
    await opener.click();
    await page.keyboard.press("Shift+Tab");
    assert.ok(
      await page
        .getByRole("dialog")
        .evaluate((d) => d.contains(document.activeElement)),
    );
    await page.keyboard.press("Escape");
    assert.ok(await opener.evaluate((b) => b === document.activeElement));
    await opener.click();
    await page
      .getByRole("button", { name: "Play sequence", exact: true })
      .click();
    await page
      .getByText("2 / 4 · Light through amber")
      .waitFor({ timeout: 12000 });
    await page.keyboard.press("Escape");
  },
);
let packageBuffer;
await check(
  "continuity navigation and accurate downloadable package",
  async () => {
    await page
      .getByRole("button", { name: "Continuity", exact: false })
      .first()
      .click();
    await page.getByRole("heading", { name: "Continuity review" }).waitFor();
    await page
      .getByRole("button", {
        name: "Choose a take for “A quiet detail”",
        exact: false,
      })
      .click();
    await page
      .getByRole("heading", { name: "A quiet detail", exact: true })
      .waitFor();
    await page
      .getByRole("button", { name: "Export package", exact: true })
      .click();
    await page.getByText("Missing selections:", { exact: false }).waitFor();
    const pending = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download project JSON" }).click();
    const d = await pending;
    packageBuffer = await fs.readFile(await d.path());
    const pkg = JSON.parse(packageBuffer);
    assert.equal(pkg.shots.length, 5);
    assert.equal(pkg.references.length, 5);
    assert.equal(pkg.shots[0].note, "Selected for the calmer camera movement.");
    await page.keyboard.press("Escape");
  },
);
await check(
  "validated import creates independent project; invalid input is safe",
  async () => {
    await page.getByLabel("Import project package", { exact: true }).click();
    await page
      .getByLabel("Choose project package", { exact: true })
      .setInputFiles({
        name: "invalid.json",
        mimeType: "application/json",
        buffer: Buffer.from("{bad"),
      });
    await page.getByText("This file is not valid JSON.").waitFor();
    await page
      .getByLabel("Choose project package", { exact: true })
      .setInputFiles({
        name: "campaign.json",
        mimeType: "application/json",
        buffer: packageBuffer,
      });
    await page.getByRole("button", { name: "Import as a new project" }).click();
    await save();
    const s = await state();
    assert.equal(s.projects.length, 2);
    assert.notEqual(s.projects[0].id, s.projects[1].id);
    assert.notEqual(
      s.projects[0].shots[0].chosen,
      s.projects[1].shots[0].chosen,
    );
  },
);
await check("API malformed JSON and invalid settings", async () => {
  let r = await context.request.post(base + "/api/generate", {
    data: { prompt: "bad" },
  });
  assert.equal(r.status(), 422);
  r = await context.request.post(base + "/api/generate", {
    data: Buffer.from("{bad"),
    headers: { "Content-Type": "application/json" },
  });
  assert.equal(r.status(), 400);
});
assert.deepEqual(errors, []);
console.log("PASS no uncaught page or unexpected console errors");
await browser.close();
