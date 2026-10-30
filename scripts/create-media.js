// Original vector artwork and canvas motion. No third-party source imagery.
import fs from "node:fs/promises";
import { chromium } from "@playwright/test";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage();
const names = ["amber", "veil", "ritual", "signature"];
for (let i = 0; i < 4; i++) {
  const x = [540, 480, 570, 445][i],
    rotate = [-8, 8, -4, 0][i];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="600" viewBox="0 0 960 600"><defs><radialGradient id="bg"><stop stop-color="#55442b"/><stop offset="1" stop-color="#11140f"/></radialGradient><linearGradient id="glass" x1="0" x2="1"><stop stop-color="#38220c"/><stop offset=".12" stop-color="#ab6e2a"/><stop offset=".22" stop-color="#513317"/><stop offset=".72" stop-color="#5c3b1c"/><stop offset=".9" stop-color="#cc9145"/><stop offset="1" stop-color="#42290f"/></linearGradient><linearGradient id="cap"><stop stop-color="#111510"/><stop offset=".6" stop-color="#33372c"/><stop offset="1" stop-color="#10140d"/></linearGradient><linearGradient id="beam" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#efca85" stop-opacity=".34"/><stop offset="1" stop-color="#bb8d4a" stop-opacity="0"/></linearGradient><filter id="blur"><feGaussianBlur stdDeviation="20"/></filter><filter id="grain"><feTurbulence baseFrequency=".7" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".065"/></feComponentTransfer></filter></defs><rect width="960" height="600" fill="url(#bg)"/><path d="M0 0H460L810 600H550Z" fill="url(#beam)"/><path d="M0 465Q320 390 960 470V600H0Z" fill="#171a12"/><ellipse cx="${x + 45}" cy="490" rx="210" ry="30" fill="#080c06" filter="url(#blur)"/><path d="M80 510Q160 180 305 330T460 600" fill="none" stroke="#ba9a62" stroke-opacity=".13" stroke-width="42" filter="url(#blur)"/><g transform="rotate(${rotate} ${x} 350)"><rect x="${x - 90}" y="244" width="180" height="235" rx="19" fill="url(#glass)" stroke="#d3ac65" stroke-opacity=".45" stroke-width="1.5"/><rect x="${x - 83}" y="254" width="166" height="214" rx="14" fill="none" stroke="#e2b465" stroke-opacity=".2" stroke-width="3"/><path d="M${x - 80} 269V443" stroke="#f4d69b" stroke-opacity=".5" stroke-width="3"/><rect x="${x - 56}" y="187" width="112" height="68" rx="5" fill="url(#cap)" stroke="#626147" stroke-opacity=".5"/><path d="M${x - 47} 196H${x + 44}" stroke="#97947a" stroke-opacity=".25"/><rect x="${x - 62}" y="313" width="124" height="113" rx="1" fill="#dbd1b4"/><rect x="${x - 57}" y="318" width="114" height="103" fill="none" stroke="#ab9f7f" stroke-width=".6"/><text x="${x}" y="346" font-family="Georgia,serif" font-size="11" letter-spacing="4" text-anchor="middle" fill="#303124">A F T E R</text><text x="${x}" y="368" font-family="Georgia,serif" font-size="17" letter-spacing="3" text-anchor="middle" fill="#303124">HOURS</text><path d="M${x - 13} 383H${x + 13}" stroke="#8b8062" stroke-width=".5"/><text x="${x}" y="400" font-family="Arial" font-size="5.5" letter-spacing="2" text-anchor="middle" fill="#5d5946">EAU DE PARFUM</text></g><rect width="960" height="600" filter="url(#grain)" opacity=".7"/></svg>`;
  await fs.writeFile(`public/demo/${names[i]}.svg`, svg);
  await page.setContent('<canvas width="960" height="600"></canvas>');
  const encoded = Buffer.from(svg).toString("base64");
  const bytes = await page.evaluate(
    async ({ encoded, i }) => {
      const c = document.querySelector("canvas"),
        ctx = c.getContext("2d"),
        img = new Image();
      img.src = "data:image/svg+xml;base64," + encoded;
      await img.decode();
      const stream = c.captureStream(24);
      const rec = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp9",
        videoBitsPerSecond: 900000,
      });
      const chunks = [];
      rec.ondataavailable = (e) => chunks.push(e.data);
      const finished = new Promise(
        (resolve) =>
          (rec.onstop = async () =>
            resolve(
              Array.from(new Uint8Array(await new Blob(chunks).arrayBuffer())),
            )),
      );
      rec.start();
      const start = performance.now();
      await new Promise((resolve) => {
        function draw(now) {
          const t = Math.min((now - start) / 5000, 1);
          const z = 1 + t * (i === 1 ? 0.085 : 0.04);
          ctx.save();
          ctx.translate(480, 300);
          ctx.scale(z, z);
          ctx.translate(
            -480 + (i === 2 ? Math.sin(t * Math.PI) * 12 : 0),
            -300,
          );
          ctx.drawImage(img, 0, 0);
          ctx.restore();
          const light = ctx.createLinearGradient(
            t * 1100 - 450,
            0,
            t * 1100,
            600,
          );
          light.addColorStop(0, "rgba(245,196,110,0)");
          light.addColorStop(0.5, "rgba(245,196,110,.045)");
          light.addColorStop(1, "rgba(245,196,110,0)");
          ctx.fillStyle = light;
          ctx.fillRect(0, 0, 960, 600);
          if (t < 1) requestAnimationFrame(draw);
          else resolve();
        }
        requestAnimationFrame(draw);
      });
      rec.stop();
      stream.getTracks().forEach((t) => t.stop());
      return finished;
    },
    { encoded, i },
  );
  await fs.writeFile(`public/demo/${names[i]}.webm`, Buffer.from(bytes));
  console.log(`Created ${names[i]}`);
}
await browser.close();
