import PDFDocument from "pdfkit";
import fs from "node:fs";
const links = JSON.parse(fs.readFileSync("docs/submission-links.json", "utf8"));
fs.mkdirSync("output/pdf", { recursive: true });
const doc = new PDFDocument({
  size: "A4",
  margin: 44,
  autoFirstPage: false,
  info: {
    Title: "Fomi - Continuity | Part B submission",
    Author: "Fomi Continuity assessment",
  },
});
doc.pipe(fs.createWriteStream("output/pdf/Fomi-Continuity-Submission.pdf"));
const W = 595.28,
  H = 841.89,
  ink = "#253024",
  muted = "#68705e",
  accent = "#d4e2a2";
let page = 0;
function newPage(label) {
  doc.addPage();
  doc.page.margins.bottom = 0;
  page++;
  doc.rect(0, 0, W, H).fill("#f3f1e8");
  doc.rect(0, 0, W, 8).fill(ink);
  doc
    .fillColor(muted)
    .font("Helvetica")
    .fontSize(8)
    .text("FOMI / CONTINUITY", 44, 29, { characterSpacing: 1.5 });
  doc.text(label, 340, 29, { width: 210, align: "right", characterSpacing: 1 });
  doc.moveTo(44, 787).lineTo(551, 787).strokeColor("#d0d2c1").stroke();
  doc
    .fillColor(muted)
    .fontSize(8)
    .text("PART B  /  VIDEO GENERATION WORKSPACE", 44, 801, {
      lineBreak: false,
    });
  doc.text(String(page).padStart(2, "0"), 520, 801, {
    width: 30,
    align: "right",
    lineBreak: false,
  });
  doc.page.margins.bottom = 44;
  doc.x = 44;
  doc.y = 74;
}
function heading(text) {
  doc
    .fillColor(ink)
    .font("Times-Roman")
    .fontSize(34)
    .text(text, { width: 507 });
  doc.moveDown(0.35);
}
function label(text) {
  doc
    .fillColor(muted)
    .font("Helvetica-Bold")
    .fontSize(8)
    .text(text, { characterSpacing: 1.2 });
  doc.moveDown(0.7);
}
function para(text, size = 11) {
  doc
    .fillColor(ink)
    .font("Helvetica")
    .fontSize(size)
    .text(text, { width: 507, lineGap: 4 });
  doc.moveDown(0.8);
}
function section(title, text) {
  doc.fillColor(ink).font("Helvetica-Bold").fontSize(12).text(title);
  doc.moveDown(0.4);
  para(text, 10);
}
newPage("SUBMISSION DRAFT");
label("A CREATIVE THREAD, FROM BRIEF TO SEQUENCE");
heading("Fomi - Continuity");
para(
  "A daily workspace for the creative director returning to a film in progress.",
  16,
);
const screenshot = "docs/screenshots/desktop.png";
if (fs.existsSync(screenshot)) {
  doc.image(screenshot, 44, doc.y, { fit: [507, 374], align: "center" });
  doc.y += 387;
}
section(
  "The concept",
  "Individual clips are easy to collect. Coherent direction and remembered decisions are harder. Continuity connects a campaign brief, shared Creative DNA, shot alternatives and a considered sequence.",
);
label("SUBMISSION LINKS");
para(`Vercel demo: ${links.vercel}\nGitHub repository: ${links.github}`, 10);
para("Local preview: http://localhost:3100 | No API keys required.", 9);
newPage("PRODUCT THINKING");
heading("Keep the intention visible.");
section(
  "Problem / user",
  "A professional creative director needs to resume an existing multi-shot campaign, compare alternatives, and recover why a version was chosen. The seeded AFTER HOURS fragrance project makes those decisions concrete.",
);
section(
  "01 / Shared direction, explicit exceptions",
  "Five Creative DNA rules flow into every shot. Per-shot overrides are explicit and the effective request is readable. Each take preserves its submitted snapshot; an Earlier DNA label signals a changed project direction, not an AI analysis.",
);
section(
  "02 / Look first. Choose deliberately.",
  "Preview and sequence selection are separate. New alternatives never replace the chosen version. Side-by-side comparison exposes prompt and settings; a short shot-level decision note keeps the editorial reason nearby.",
);
section(
  "03 / Keep the sequence close",
  "The storyboard and sequence share one order, including accessible move controls. The stage dominates. Advanced overrides are disclosed on demand; mobile stacks the work with a collapsible storyboard strip.",
);
section(
  "One differentiating workflow",
  "Brief > shared Creative DNA > inherited or overridden shot request > frozen take provenance > selection with a reason > sequential review > portable JSON package.",
);
section(
  "Inspiration and trade-offs",
  "Premiere Pro and DaVinci Resolve inspired the distinction between source review and sequence commitment. Figma shared styles inspired defaults with exceptions. Continuity makes creative rationale explicit without adopting a full timeline or copying those interfaces.",
);
section(
  "What was left out",
  "Real AI, authentication, cloud collaboration, rendering, trimming and audio would distract from assessing the central workflow. Four original reusable motion fixtures keep the demo small and self-contained. No research or production validation is claimed.",
);
section(
  "With another month",
  "Observe directors resuming real work, test the DNA vocabulary, and add take-specific history, import/migration, undo and more robust storage. Validate accessibility on real assistive technologies and touch devices before adding configuration complexity.",
);
newPage("IMPLEMENTATION & REVIEW");
heading("A working frontend.");
para(
  "Next.js App Router / JavaScript / CSS / local route handler / browser-local persistence",
  11,
);
const mobile = "docs/screenshots/width-390.png";
if (fs.existsSync(mobile)) {
  doc.image(mobile, 391, 156, { fit: [160, 450], align: "right" });
}
function narrow(title, text) {
  doc
    .fillColor(ink)
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(title, 44, doc.y, { width: 320 });
  doc.moveDown(0.5);
  doc.font("Helvetica").fontSize(10).text(text, { width: 320, lineGap: 4 });
  doc.moveDown(1.2);
}
narrow(
  "The complete path",
  "Resume the seeded project, edit direction, generate two fixture alternatives, follow stages, compare and choose, add a note, review clips consecutively, and download the current project JSON.",
);
narrow(
  "Honest simulation",
  "The POST route validates input and selects deterministic local assets. Queued, generating, completed, cancelled and failed states are visible. Metadata is saved; fixture pixels do not change with the request.",
);
narrow(
  "Verification evidence",
  "Six state tests, the complete Chrome workflow and additional persistence/project checks pass against the production server. The production build passes. Responsive checks cover 360 through 1920 pixels with no page overflow. No uncaught page or unexpected console errors occurred in the final workflow run.",
);
narrow(
  "Known boundaries",
  "All clips are original stylized motion studies, approximately five seconds. Entered timing and aspect ratio are planned request metadata. Sequence review is not frame-accurate. Export is JSON, not a rendered MP4.",
);
doc.y = Math.max(doc.y, 650);
section(
  "Publishing action remaining",
  "Create and push to the intended GitHub repository, import it into the intended Vercel account, verify the deployed URL, then update docs/submission-links.json and regenerate this PDF. No live link has been invented.",
);
doc.end();
console.log("Created output/pdf/Fomi-Continuity-Submission.pdf");
