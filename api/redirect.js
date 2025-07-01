import { getDB } from '../utils/db.js';

export default async function handler(req, res) {
  // Ambil path code secara aman
  const code = req.query.code || req.url.replace('/', '').split('?')[0];

  if (!code) {
    res.statusCode = 400;
    res.end('Code missing');
    return;
  }

  const db = await getDB();
  const row = await db.get('SELECT url FROM links WHERE code = ?', [code]);

  if (row) {
    res.writeHead(302, { Location: row.url });
    res.end();
  } else {
    res.statusCode = 404;
    res.end('Shortlink not found');
  }
}
