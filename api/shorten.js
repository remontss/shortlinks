import { getDB } from '../utils/db.js';

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.headers["content-type"]?.includes("application/json")
    ? await new Promise((resolve, reject) => {
        let data = "";
        req.on("data", chunk => (data += chunk));
        req.on("end", () => resolve(JSON.parse(data || "{}")));
        req.on("error", reject);
      })
    : {};

  const { url } = body;

  if (!url || !url.startsWith("http")) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  const db = await getDB();
  await db.run(`CREATE TABLE IF NOT EXISTS links (
    code TEXT PRIMARY KEY,
    url TEXT NOT NULL
  )`);

  const code = Math.random().toString(36).substring(2, 8);

  await db.run("INSERT INTO links (code, url) VALUES (?, ?)", [code, url]);

  const baseUrl = req.headers.host?.includes("vercel.app")
    ? `https://${req.headers.host}`
    : "https://shortlinks-pi.vercel.app";

  return res.status(200).json({
    success: true,
    code,
    short: `${baseUrl}/${code}`,
    original: url
  });
}
