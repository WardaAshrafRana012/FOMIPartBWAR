import test from "node:test";
import assert from "node:assert/strict";
import { seed } from "../data/seed.js";
import { requestFor, packageProject, recover } from "../lib/project.js";
import {
  enrich,
  directionChanges,
  continuityIssues,
  restoreEditorial,
  parsePackage,
} from "../lib/editor.js";
test("reference inheritance, explicit none and snapshots stay independent", () => {
  const p = enrich(seed().projects[0]),
    s = p.shots[0];
  const old = requestFor(p, s);
  assert.equal(old.references.length, 3);
  s.referenceIds = [];
  assert.equal(requestFor(p, s).references.length, 0);
  s.referenceIds = ["ref-product"];
  assert.equal(requestFor(p, s).references[0].role, "Product");
  p.references[0].name = "Edited name";
  assert.notEqual(old.references[0].name, p.references[0].name);
});
test("direction comparison explains historical changes without rewriting takes", () => {
  const p = seed().projects[0],
    t = p.shots[0].takes[0],
    before = t.request.inherited.lighting;
  p.dna.lighting = "Cool window";
  assert.deepEqual(directionChanges(p, t), [
    { key: "lighting", before, after: "Cool window" },
  ]);
  assert.equal(t.request.inherited.lighting, before);
});
test("continuity checks classify selections, formats, direction and decisions", () => {
  const p = seed().projects[0];
  p.shots[0].chosen = null;
  p.shots[1].aspect = "9:16";
  p.dna.camera = "Tripod";
  const issues = continuityIssues(p);
  for (const kind of ["selection", "format", "direction", "decision"])
    assert.ok(issues.some((i) => i.kind === kind));
});
test("undo preserves newly completed takes while restoring editorial decisions", () => {
  const before = enrich(seed().projects[0]),
    current = structuredClone(before);
  current.shots[0].chosen = current.shots[0].takes[1].id;
  current.shots[0].takes.push({
    ...current.shots[0].takes[0],
    id: "finished-after-edit",
  });
  current.activity = [
    { id: "event", message: "Completed", at: new Date().toISOString() },
  ];
  const restored = restoreEditorial(before, current);
  assert.equal(restored.shots[0].chosen, before.shots[0].chosen);
  assert.equal(restored.shots[0].takes.length, 3);
  assert.equal(restored.activity.length, 1);
});
test("import isolates all editorial identities and rejects unsafe media", () => {
  const p = enrich(seed().projects[0]),
    raw = JSON.stringify(packageProject(p)),
    copy = parsePackage(raw);
  assert.notEqual(copy.id, p.id);
  assert.notEqual(copy.shots[0].id, p.shots[0].id);
  assert.notEqual(copy.shots[0].chosen, p.shots[0].chosen);
  assert.ok(copy.shots[0].takes.some((t) => t.id === copy.shots[0].chosen));
  assert.equal(copy.references[0].src, p.references[0].src);
  copy.exportedAt = "2000-01-01T00:00:00.000Z";
  assert.notEqual(packageProject(copy).exportedAt, copy.exportedAt);
  assert.throws(() => parsePackage("{broken"), /JSON/);
  const invalid = JSON.parse(raw);
  invalid.references[0].src = "https://evil.test/x.png";
  assert.throws(() => parsePackage(JSON.stringify(invalid)), /invalid/);
});
test("malformed imported reference selections and notes recover safely", () => {
  const s = seed();
  s.projects[0].shots[0].referenceIds = { bad: true };
  assert.equal(recover(JSON.stringify(s), seed).recovered, true);
  s.projects[0].shots[0].referenceIds = [];
  s.projects[0].shots[0].takes[0].note = { bad: true };
  assert.equal(recover(JSON.stringify(s), seed).recovered, true);
});
test("reopening marks unfinished simulations interrupted exactly once", () => {
  const p = seed().projects[0];
  p.activity = [
    {
      id: "queued",
      shotId: p.shots[0].id,
      message: "Generation queued with a saved direction snapshot.",
      at: new Date().toISOString(),
    },
  ];
  const reopened = enrich(p);
  assert.equal(reopened.activity.length, 2);
  assert.match(reopened.activity[1].message, /interrupted/);
  assert.equal(enrich(reopened).activity.length, 2);
});
