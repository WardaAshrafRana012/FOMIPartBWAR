import { validateRequest } from "../../../lib/project.js";
import { storyboardMedia } from "../../../lib/storyboard-media.js";
export async function POST(request) {
  let body;
  try {
    const raw = await request.text();
    if (raw.length > 4000000)
      return Response.json(
        { error: "Request is too large. Use fewer reference images." },
        { status: 413 },
      );
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const error = validateRequest(body);
  if (error) return Response.json({ error }, { status: 422 });
  const hash = [...body.prompt].reduce((n, c) => n + c.charCodeAt(0), 0);
  const index = [0, 1, 2, 3].includes(body.fixtureIndex)
    ? body.fixtureIndex
    : hash % 4;
  return Response.json({
    id: crypto.randomUUID(),
    stages: ["queued", "generating", "completed"],
    takes: [0, 1].map((n) => ({
      id: crypto.randomUUID(),
      ...storyboardMedia[index],
      request: body,
      createdAt: new Date().toISOString(),
      dnaSignature: body.dnaSignature,
      fixture: true,
    })),
    simulation: true,
  });
}
