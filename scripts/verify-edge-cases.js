import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const base = process.env.BASE_URL || "http://localhost:3101",
  browser = await chromium.launch({ channel: "chrome" }),
  context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  }),
  page = await context.newPage(),
  errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const saved = () => page.waitForTimeout(650),
  state = () =>
    page.evaluate(() => JSON.parse(localStorage.getItem("fomi-continuity-v1")));
await page.goto(base);
await page.locator("#prompt").waitFor();
for (const width of [360, 390, 430, 768, 1024, 1280, 1440, 1920]) {
  await page.setViewportSize({ width, height: width <= 430 ? 844 : 1000 });
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
console.log(
  "PASS responsive layouts at 360, 390, 430, 768, 1024, 1280, 1440, 1920",
);
await page.setViewportSize({ width: 390, height: 844 });
await page.getByRole("button", { name: "Shots", exact: false }).first().click();
await page.getByRole("dialog").locator(".shot-select").nth(1).focus();
await page.keyboard.press("Enter");
await page
  .getByRole("heading", { name: "Light through amber", exact: true })
  .waitFor();
await page.getByRole("button", { name: "Direction", exact: true }).click();
await page
  .locator("#prompt")
  .fill("A slow macro study of luminous amber glass.");
await page.getByRole("button", { name: "Shot overrides & reference" }).click();
await page
  .locator(".advanced")
  .getByRole("textbox")
  .last()
  .fill("Static camera, no movement.");
await page.getByRole("button", { name: "Generate 2 alternatives" }).click();
await page.getByText("Developing alternatives…").waitFor();
await page.getByRole("button", { name: "Preview", exact: true }).click();
await page.getByRole("button", { name: "Shots", exact: false }).first().click();
await page.getByRole("dialog").locator(".shot-select").nth(2).click();
await page.waitForTimeout(3600);
await saved();
let p = (await state()).projects[0];
assert.equal(p.shots[1].takes.length, 4);
assert.equal(p.shots[2].takes.length, 2);
assert.equal(
  p.shots[1].takes.at(-1).request.direction.camera,
  "Static camera, no movement.",
);
console.log(
  "PASS mobile generation retains request and destination while reviewing another shot",
);
await page.getByRole("button", { name: "Direction", exact: true }).click();
await page
  .getByRole("button", { name: "Generate 2 alternatives" })
  .evaluate((b) => {
    b.click();
    b.click();
  });
await page.getByText("Developing alternatives…").waitFor();
await page.reload();
await page
  .getByRole("heading", { name: "The evening ritual", exact: true })
  .waitFor();
await page.waitForTimeout(4300);
assert.equal((await state()).projects[0].shots[2].takes.length, 2);
console.log(
  "PASS active shot persists and reload cancels unfinished generation",
);
await page.getByRole("button", { name: "Project tools", exact: true }).click();
await page.getByRole("button", { name: "Creative brief", exact: true }).click();
await page
  .getByRole("dialog")
  .getByRole("textbox")
  .fill("A revised campaign brief.");
await page.keyboard.press("Escape");
await page.getByRole("button", { name: "Project tools", exact: true }).click();
await page.getByRole("button", { name: "Undo last edit" }).click();
await saved();
assert.notEqual((await state()).projects[0].brief, "A revised campaign brief.");
await page.getByRole("button", { name: "Project tools", exact: true }).click();
await page.getByRole("button", { name: "Redo last edit" }).click();
await saved();
assert.equal((await state()).projects[0].brief, "A revised campaign brief.");
console.log("PASS mobile project tools, brief access, undo and redo");
await page.getByRole("button", { name: "Direction", exact: true }).click();
await page.getByRole("tab", { name: "References" }).click();
await page.screenshot({
  path: "docs/screenshots/studio-mobile-direction.png",
  fullPage: true,
});
await page.getByRole("button", { name: "Sequence", exact: true }).click();
await page.screenshot({
  path: "docs/screenshots/studio-mobile-sequence.png",
  fullPage: true,
});
await page.getByRole("button", { name: "Preview", exact: true }).click();
await page.screenshot({
  path: "docs/screenshots/studio-mobile.png",
  fullPage: true,
});
await page.getByRole("button", { name: "Project tools", exact: true }).click();
await page.getByRole("button", { name: "Create project", exact: true }).click();
await page.getByRole("dialog").getByRole("textbox").fill("Second campaign");
await page.getByRole("button", { name: "Create project", exact: true }).click();
await page
  .getByRole("heading", { name: "Every story starts with a shot." })
  .waitFor();
await page.getByRole("button", { name: "Project tools", exact: true }).click();
await page
  .getByRole("dialog")
  .getByRole("button", { name: "Rename project", exact: true })
  .click();
await page
  .getByRole("dialog")
  .getByRole("textbox")
  .fill("Second campaign revised");
await page.getByRole("button", { name: "Save name", exact: true }).click();
await saved();
assert.equal((await state()).projects[1].name, "Second campaign revised");
await page.getByLabel("Switch project").selectOption("after-hours");
await page
  .getByRole("heading", { name: "The evening ritual", exact: true })
  .waitFor();
await page.getByRole("button", { name: "Project tools", exact: true }).click();
await page.getByRole("button", { name: "Reset demo", exact: true }).click();
await page.getByRole("button", { name: "Keep my work" }).click();
await saved();
assert.equal((await state()).projects.length, 2);
console.log("PASS mobile create rename switch and reset cancellation");
await page.setViewportSize({ width: 1440, height: 900 });
await page.getByRole("tab", { name: "Direction", exact: true }).click();
await page
  .getByRole("combobox", { name: "Duration", exact: true })
  .selectOption("8");
await page.getByRole("button", { name: "Generate 2 alternatives" }).click();
await page
  .getByText("Two alternatives ready. Your chosen take is unchanged.")
  .waitFor();
await page.getByLabel("Undo", { exact: true }).click();
await saved();
p = (await state()).projects[0];
assert.equal(p.shots[2].duration, 5);
assert.equal(p.shots[2].takes.length, 4);
console.log(
  "PASS undo restores direction without discarding completed generations",
);
await page.getByRole("button", { name: "Project tools", exact: true }).click();
await page
  .getByRole("dialog")
  .getByRole("button", { name: "Reset demo", exact: true })
  .click();
await page.getByRole("button", { name: "Reset all local projects" }).click();
await saved();
assert.equal((await state()).projects.length, 1);
assert.equal((await state()).projects[0].shots.length, 4);
assert.equal(await page.locator(".job").count(), 0);
console.log(
  "PASS confirmed reset restores clean seed and clears generation state",
);
const badContext = await browser.newContext();
await badContext.addInitScript(() =>
  localStorage.setItem("fomi-continuity-v1", "{broken"),
);
const bad = await badContext.newPage();
await bad.goto(base);
await bad
  .getByText("Unreadable local data was replaced with the demo.")
  .waitFor();
console.log("PASS malformed local data recovers safely");
const denied = await browser.newContext({
  viewport: { width: 390, height: 844 },
});
await denied.addInitScript(() => {
  Storage.prototype.setItem = function () {
    throw new DOMException("Blocked in test", "QuotaExceededError");
  };
});
const deniedPage = await denied.newPage();
await deniedPage.goto(base);
await deniedPage
  .getByRole("alert")
  .filter({ hasText: "Save failed" })
  .waitFor();
console.log("PASS storage failure remains visible on mobile");
assert.deepEqual(errors, []);
console.log("PASS no uncaught errors in edge cases");
await browser.close();
