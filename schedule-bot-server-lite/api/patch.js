export default function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }
  try {
    const body = req.body || {};
    const ops = Array.isArray(body.ops) ? body.ops : [];
    res.status(200).json({ ok: true, applied: ops.length });
  } catch (e) {
    res.status(400).json({ error: "Bad Request" });
  }
}
