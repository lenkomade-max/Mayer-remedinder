import kv from "../lib/kv.js";

const emptyState = () => ({
  schema: "schedulebot.v1",
  timezone: "+04:00",
  updatedAt: new Date().toISOString(),
  tasks: [],
  deleted: []
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const userId = (req.query?.userId) || "default";
    const key = `tasks:${userId}`;

    const body = req.body || {};
    const incomingOps = Array.isArray(body.ops) ? body.ops : [];

    let state = (await kv.get(key)) || emptyState();
    let applied = 0;

    for (const op of incomingOps) {
      if (!op || !op.op) continue;

      if (op.op === "add" && op.task?.id) {
        const t = op.task;
        const idx = state.tasks.findIndex(x => x.id === t.id);
        if (idx >= 0) state.tasks[idx] = t; else state.tasks.push(t);
        applied++;
      } else if (op.op === "update" && op.id) {
        const idx = state.tasks.findIndex(x => x.id === op.id);
        if (idx >= 0) {
          state.tasks[idx] = { ...state.tasks[idx], ...op.task };
          applied++;
        }
      } else if (op.op === "remove" && op.id) {
        const before = state.tasks.length;
        state.tasks = state.tasks.filter(x => x.id !== op.id);
        if (!state.deleted.includes(op.id)) state.deleted.push(op.id);
        if (state.tasks.length !== before) applied++;
      }
    }

    state.updatedAt = new Date().toISOString();
    await kv.set(key, state);
    res.status(200).json({ ok: true, applied });
  } catch (e) {
    res.status(500).json({ error: e?.message || "patch_failed" });
  }
}
