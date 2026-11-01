import PDFDocument from "pdfkit";
import fs from "node:fs";
const links = JSON.parse(fs.readFileSync("docs/submission-links.json", "utf8"));
for (const key of Object.keys(links))
  links[key] = links[key].replace(/[\u2013\u2014]/g, "-");
fs.mkdirSync("output/pdf", { recursive: true });
const doc = new PDFDocument({
  size: "A4",
  margin: 44,
  autoFirstPage: false,
  info: {
    Title: "Fomi - WAR | Part B submission",
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
    .text("FOMI / WAR", 44, 29, { characterSpacing: 1.5 });
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
heading("Fomi - WAR");
para(
  "A daily workspace for the creative director returning to a film in progress.",
  16,
);
const screenshot = "docs/screenshots/studio-desktop.png";
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
para(`Local preview: ${process.env.BASE_URL || "http://localhost:3101"} | No API keys required.`, 9);
newPage("PRODUCT THINKING");
heading("Keep the intention visible.");
section(
  "Problem / user",
  "A professional creative director needs to resume an existing multi-shot campaign, compare alternatives, and recover why a version was chosen. The seeded AFTER HOURS fragrance project makes those decisions concrete.",
);
section(
  "01 / Shared direction, explicit exceptions",
  "Visual DNA and named references flow into each shot. Overrides are explicit. Every take preserves its submitted snapshot; Previous/Current differences explain changed direction without claiming footage analysis.",
);
section(
  "02 / Look first. Choose deliberately.",
  "Preview and sequence selection are separate. New alternatives never replace the chosen version. Comparison has shared playback controls, request differences and take-specific decision notes. History retains the editorial context.",
);
section(
  "03 / Keep the sequence close",
  "One storyboard, a cinematic stage, a contextual inspector and a docked sequence keep the film close. Mobile uses Preview / Direction / Sequence modes and a shot-picker sheet. Project tools keeps every action accessible.",
);
section(
  "One differentiating workflow",
  "Brief > shared Creative DNA > inherited or overridden shot request > frozen take provenance > selection with a reason > sequential review > portable JSON package.",
);
section(
  "Inspiration and trade-offs",
  "Flow references, Krea comparison, Runway reference persistence and Meta Edits mobile interaction informed the research. CapCut export restrictions informed early clarity. Continuity preserves creative rationale in its own stage-first layout. No user research is claimed.",
);
section(
  "What was left out",
  "Real inference, authentication, collaboration servers, trimming, audio mixing and MP4 rendering are outside the assessment. Eight prepared camera studies and two supplied sample films keep the demonstration local and self-contained.",
);
section(
  "With another month",
  "Observe directors resuming real projects and test task completion before claiming UX improvement. Validate screen readers and real touch devices. Add IndexedDB quota/conflict handling, more durable revisions and richer fixture media.",
);
newPage("IMPLEMENTATION & REVIEW");
heading("A working frontend.");
para(
  "Next.js App Router / JavaScript / CSS / local route handler / browser-local persistence",
  11,
);
const mobile = "docs/screenshots/studio-mobile.png";
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
  "Resume a campaign, edit DNA and references, direct a shot, generate prepared alternatives, compare and choose with a note, review continuity and play the sequence. Export/import a validated project package.",
);
narrow(
  "Honest simulation",
  "The POST route validates input and selects deterministic local assets. Queued, generating, completed, cancelled and failed states are visible. Metadata is saved; fixture pixels do not change with the request.",
);
narrow(
  "Verification evidence",
  "Fourteen state tests and the production build pass. Chrome checks cover supplied MP4 playback, generation, comparison, references, history, undo/redo, package import/export and recovery. Responsive checks span 360 through 1920 pixels.",
);
narrow(
  "Known boundaries",
  "Two supplied portrait films join the prepared camera studies. Neither is generated by this app. Supplied footage rights remain with its owners. Planned timing and ratio do not edit source media. Export is JSON, not a rendered MP4; storage is browser-local.",
);
doc.y = Math.max(doc.y, 650);
section(
  "Live deployment verified",
  "Published in the WAR Vercel team. Live Chrome checks verified navigation, supplied video playback, persistent selections, sequence advancement and mobile overflow. GitHub automatic deployment integration still requires repository access; the live app was deployed directly through the CLI.",
);
newPage("THE EDITORIAL DECISION");
heading("Every choice has a reason.");
para(
  "Compare the alternatives. See what changed. Keep the thinking with the take.",
  13,
);
if (fs.existsSync("docs/screenshots/studio-comparison.png")) {
  doc.image("docs/screenshots/studio-comparison.png", 44, doc.y, {
    fit: [507, 345],
    align: "center",
  });
  doc.y += 358;
}
section(
  "A focused, testable differentiator",
  "The workspace connects a brief and visual references to exact generation requests, then preserves the relationship between those requests and a deliberate editorial choice. Continuity review checks metadata and decisions; it never invents an AI consistency score.",
);
section(
  "Reliable enough to resume",
  "Browser-local autosave is explicit. Undo restores editorial changes while retaining completed generations. Validated import creates a separate project. Unfinished simulations are marked interrupted after reload.",
);
section(
  "Prepared for review",
  "Source, README, product-thinking answers, competitor evidence and verification scripts are included. Verified Vercel demo and GitHub repository links are provided on the first page. Supplied footage retains its owners' rights.",
);
doc.end();
console.log("Created output/pdf/Fomi-Continuity-Submission.pdf");
