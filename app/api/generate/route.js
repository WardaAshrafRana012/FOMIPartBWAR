import { validateRequest } from "../../../lib/project.js";
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const error = validateRequest(body);
  if (error) return Response.json({ error }, { status: 422 });
  const fixtures = ["amber", "veil", "ritual", "signature"];
  const hash = [...body.prompt].reduce((n, c) => n + c.charCodeAt(0), 0);
  return Response.json({
    id: crypto.randomUUID(),
    stages: ["queued", "generating", "completed"],
    takes: [0, 1].map((n) => ({
      id: crypto.randomUUID(),
      src: `/demo/${fixtures[(hash + n) % 4]}.webm`,
      poster: `/demo/${fixtures[(hash + n) % 4]}.svg`,
      request: body,
      createdAt: new Date().toISOString(),
      dnaSignature: body.dnaSignature,
      fixture: true,
    })),
    simulation: true,
  });
}
