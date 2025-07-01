import { getDB } from '../utils/db.js';

export default async function handler(req, res) {
  const code = req.url.split('/').pop();

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
