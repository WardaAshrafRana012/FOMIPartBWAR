// Browser canvas motion studies from original AI-created stills. No app model inference.
import fs from "node:fs/promises";
import { chromium } from "@playwright/test";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage();
const source = ["invitation", "material", "ritual", "signature"],
  files = ["amber", "veil", "ritual", "signature"];
for (let variant = 0; variant < 8; variant++) {
  const i = variant % 4;
  const encoded = (await fs.readFile(`public/demo/${source[i]}.webp`)).toString(
    "base64",
  );
  await page.setContent('<canvas width="960" height="540"></canvas>');
  const bytes = await page.evaluate(
    async ({ encoded, i, variant }) => {
      const c = document.querySelector("canvas"),
        ctx = c.getContext("2d"),
        img = new Image();
      img.src = "data:image/webp;base64," + encoded;
      await img.decode();
      const draw = (t) => {
        const z =
            variant >= 4
              ? 1.08 - t * 0.045
              : 1.025 + t * (i === 1 ? 0.055 : 0.035),
          w = 960 * z,
          h = 540 * z;
        ctx.drawImage(
          img,
          (960 - w) / 2 + (i === 2 ? t * 8 : 0),
          (540 - h) / 2,
          w,
          h,
        );
      };
      draw(0);
      const stream = c.captureStream(24),
        rec = new MediaRecorder(stream, {
          mimeType: "video/webm;codecs=vp9",
          videoBitsPerSecond: 1300000,
        }),
        chunks = [];
      rec.ondataavailable = (e) => chunks.push(e.data);
      const done = new Promise(
        (resolve) =>
          (rec.onstop = async () =>
            resolve(
              Array.from(new Uint8Array(await new Blob(chunks).arrayBuffer())),
            )),
      );
      rec.start();
      const start = performance.now();
      await new Promise((resolve) => {
        function tick(now) {
          const t = Math.min((now - start) / 5100, 1);
          draw(t);
          if (t < 1) requestAnimationFrame(tick);
          else resolve();
        }
        requestAnimationFrame(tick);
      });
      rec.stop();
      stream.getTracks().forEach((t) => t.stop());
      return done;
    },
    { encoded, i, variant },
  );
  await fs.writeFile(
    `public/demo/${files[i]}${variant >= 4 ? "-alt" : ""}.webm`,
    Buffer.from(bytes),
  );
  console.log(`Created ${files[i]}-alt from ${source[i]}`);
}
await browser.close();
