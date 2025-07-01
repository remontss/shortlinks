import { getDB } from '../utils/db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ✅ FIXED: Manual body parser
  let body = '';
  await new Promise((resolve, reject) => {
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', resolve);
    req.on('error', reject);
  });

  let data;
  try {
    data = JSON.parse(body);
  } catch (err) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const { url } = data;
  if (!url || !url.startsWith('http')) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    const db = await getDB();
    await db.run(`CREATE TABLE IF NOT EXISTS links (
      code TEXT PRIMARY KEY,
      url TEXT NOT NULL
    )`);

    const code = Math.random().toString(36).substring(2, 8);
    await db.run('INSERT INTO links (code, url) VALUES (?, ?)', [code, url]);

    const baseUrl = `https://${req.headers.host}`;
    return res.status(200).json({
      success: true,
      code,
      short: `${baseUrl}/${code}`,
      original: url
    });
  } catch (err) {
    return res.status(500).json({ error: 'Database error', detail: err.message });
  }
}
