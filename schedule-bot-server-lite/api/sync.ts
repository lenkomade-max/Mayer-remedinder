import kv from "../lib/kv";

export default async function handler(req, res) {
  const userId = (req.query.userId as string) || "default";
  const data = (await kv.get(`tasks:${userId}`)) || {
    schema: "schedulebot.v1",
    timezone: "+04:00",
    updatedAt: new Date().toISOString(),
    tasks: [],
    deleted: []
  };
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json(data);
}
