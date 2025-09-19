import kv from "../lib/kv.js";

const emptyState = () => ({
  schema: "schedulebot.v1",
  timezone: "+04:00",
  updatedAt: new Date().toISOString(),
  tasks: [],
  deleted: []
});

export default async function handler(req, res) {
  try {
    const userId = (req.query?.userId) || "default";
    const key = `tasks:${userId}`;
    const state = (await kv.get(key)) || emptyState();
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json(state);
  } catch (e) {
    res.status(500).json({ error: e?.message || "sync_failed" });
  }
}
