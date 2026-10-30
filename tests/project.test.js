import test from "node:test";
import assert from "node:assert/strict";
import { seed } from "../data/seed.js";
import {
  effective,
  duplicateShot,
  requestFor,
  moveShot,
  recover,
  packageProject,
  validateRequest,
} from "../lib/project.js";
test("duplicating a shot preserves choices with independent identities", () => {
  const original = seed().projects[0].shots[0],
    copy = duplicateShot(original);
  assert.notEqual(copy.id, original.id);
  assert.notEqual(copy.chosen, original.chosen);
  assert.equal(copy.takes[0].request.prompt, original.takes[0].request.prompt);
  assert.ok(copy.takes.some((t) => t.id === copy.chosen));
});
test("overrides replace only explicit rules and old takes keep their snapshot", () => {
  const p = seed().projects[0],
    s = p.shots[0];
  const saved = structuredClone(s.takes[0].request);
  p.dna.lighting = "Cool moonlight";
  s.overrides.camera = "Locked tripod";
  assert.equal(effective(p, s).lighting, "Cool moonlight");
  assert.equal(effective(p, s).camera, "Locked tripod");
  assert.deepEqual(s.takes[0].request, saved);
  assert.equal(requestFor(p, s).overrides.camera, "Locked tripod");
});
test("sequence order follows shot movement with stable chosen takes", () => {
  const p = seed().projects[0],
    id = p.shots[0].chosen;
  p.shots = moveShot(p.shots, p.shots[0].id, 1);
  const pkg = packageProject(p);
  assert.equal(pkg.shotOrder[1], "shot-0");
  assert.equal(pkg.shots[1].chosen, id);
  assert.equal(moveShot(p.shots, "shot-0", 99), p.shots);
});
test("malformed storage recovers; valid data round trips", () => {
  assert.equal(recover("{bad", seed).recovered, true);
  assert.equal(
    recover(JSON.stringify({ version: 99, projects: [] }), seed).recovered,
    true,
  );
  const s = seed();
  s.projects[0].shots[0].note = "Chosen for stillness";
  assert.deepEqual(recover(JSON.stringify(s), seed).state, s);
  s.projects[0].shots[0].takes[0].src = "https://untrusted.test/video";
  assert.equal(recover(JSON.stringify(s), seed).recovered, true);
});
test("generation validates prompt, timing, ratio and effective DNA", () => {
  const p = seed().projects[0],
    r = requestFor(p, p.shots[0]);
  assert.equal(validateRequest(r), null);
  assert.match(validateRequest({ ...r, prompt: "" }), /Direction/);
  assert.match(validateRequest({ ...r, duration: 33 }), /duration/);
  assert.match(validateRequest({ ...r, aspect: "4:3" }), /aspect/);
  assert.match(validateRequest({ ...r, direction: {} }), /DNA/);
});
test("export includes current intent and selection notes", () => {
  const p = seed().projects[0];
  p.brief = "Revised brief";
  p.shots[0].note = "A quieter entrance";
  const pkg = packageProject(p);
  assert.equal(pkg.brief, p.brief);
  assert.equal(pkg.shots[0].note, "A quieter entrance");
  assert.ok(pkg.shots[0].takes[0].request.inherited);
  assert.equal(pkg.format, "fomi-project-package");
});
