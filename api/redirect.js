import { getDB } from '../utils/db.js';

export default async function handler(req, res) {
  const code = req.query.code || req.url.replace('/', '').split('?')[0];

  if (!code) {
    res.statusCode = 400;
    res.end('Code missing');
    return;
  }

const db = await getDB();
const row = db.prepare('SELECT url FROM links WHERE code = ?').get(code);

  if (row) {
    res.writeHead(302, { Location: row.url });
    res.end();
  } else {
    res.statusCode = 404;
    res.end('Shortlink not found');
  }
}
