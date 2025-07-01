const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

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
  const setResponse = await fetch(`${KV_URL}/set/${code}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(url)
  });

  if (!setResponse.ok) {
    return res.status(500).json({ error: 'Failed to save shortlink' });
  }

  const baseUrl = req.headers.host?.includes('vercel.app')
    ? `https://${req.headers.host}`
    : 'https://shortlinks-pi.vercel.app';

  return res.status(200).json({
    success: true,
    code,
    short: `${baseUrl}/${code}`,
    original: url
  });
}
