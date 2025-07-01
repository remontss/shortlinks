import fs from 'fs/promises';
import path from 'path';

const filePath = path.resolve('data/links.json');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { url } = req.body;

  if (!url || !url.startsWith('http')) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  const code = Math.random().toString(36).substring(2, 8);

  const json = JSON.parse(await fs.readFile(filePath, 'utf8'));
  json[code] = url;
  await fs.writeFile(filePath, JSON.stringify(json, null, 2));

  const base = req.headers.host.startsWith('localhost') ? `http://${req.headers.host}` : `https://${req.headers.host}`;

  res.status(200).json({
    success: true,
    code,
    short: `${base}/${code}`,
    original: url
  });
}
