export default function handler(req, res) {
  const userId = (req.query?.userId) || "default";
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({
    schema: "schedulebot.v1",
    timezone: "+04:00",
    updatedAt: new Date().toISOString(),
    tasks: [],
    deleted: []
  });
}
