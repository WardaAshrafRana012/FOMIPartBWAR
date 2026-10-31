import { chromium } from "@playwright/test";
import { seed } from "../data/seed.js";
import { packageProject } from "../lib/project.js";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
const browser = await chromium.launch({ channel: "chrome" }),
  context = await browser.newContext(),
  page = await context.newPage();
const original = packageProject(seed().projects[0]);
original.exportedAt = "2000-01-01T00:00:00.000Z";
await page.goto(process.env.BASE_URL || "http://localhost:3101");
await page.locator("#prompt").waitFor();
await page.getByLabel("Import project package", { exact: true }).click();
await page
  .getByLabel("Choose project package", { exact: true })
  .setInputFiles({
    name: "roundtrip.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(original)),
  });
await page.getByRole("button", { name: "Import as a new project" }).click();
await page.getByRole("button", { name: "Export package", exact: true }).click();
const pending = page.waitForEvent("download");
await page.getByRole("button", { name: "Download project JSON" }).click();
const download = await pending,
  pkg = JSON.parse(await fs.readFile(await download.path(), "utf8"));
assert.notEqual(pkg.exportedAt, original.exportedAt);
assert.equal(pkg.shots.length, 4);
assert.notEqual(pkg.shots[0].id, original.shots[0].id);
console.log(
  "PASS imported package re-export has fresh timestamp and independent identities",
);
await browser.close();
