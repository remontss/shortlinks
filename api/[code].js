import fs from 'fs/promises';
import path from 'path';

const filePath = path.resolve('data/links.json');

export default async function handler(req, res) {
  const code = req.query.code;

  const json = JSON.parse(await fs.readFile(filePath, 'utf8'));
  const url = json[code];

  if (url) {
    res.writeHead(302, { Location: url });
    res.end();
  } else {
    res.statusCode = 404;
    res.end('Shortlink not found');
  }
}
