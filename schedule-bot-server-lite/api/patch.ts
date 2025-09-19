import kv from "../lib/kv";

type Task = {
  id: string; title: string; note?: string; due?: string;
  list?: string; notify?: boolean; status?: "open"|"done"|"canceled";
  updatedAt: string; tags?: string[];
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const userId = (req.query.userId as string) || "default";
  const { ops, timezone = "+04:00" } = req.body || {};

  let state = await kv.get(`tasks:${userId}`) as any;
  if (!state) state = { schema: "schedulebot.v1", timezone, updatedAt: new Date().toISOString(), tasks: [], deleted: [] };

  const byId = new Map<string, Task>(state.tasks.map((t: Task) => [t.id, t]));
  const deleted = new Set<string>(state.deleted || []);

  for (const op of (ops || [])) {
    if (op.op === "add" && op.task) {
      byId.set(op.task.id, op.task);
      deleted.delete(op.task.id);
    } else if (op.op === "update" && op.task?.id) {
      const prev = byId.get(op.task.id) || { id: op.task.id, updatedAt: op.task.updatedAt };
      byId.set(op.task.id, { ...prev, ...op.task });
    } else if (op.op === "remove" && op.id) {
      byId.delete(op.id);
      deleted.add(op.id);
    }
  }

  const tasks = Array.from(byId.values());
  const newState = {
    schema: "schedulebot.v1",
    timezone: state.timezone || timezone,
    updatedAt: new Date().toISOString(),
    tasks,
    deleted: Array.from(deleted)
  };

  await kv.set(`tasks:${userId}`, newState);
  res.status(200).json({ ok: true, tasks: tasks.length });
}
