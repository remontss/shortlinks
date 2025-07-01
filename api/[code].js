const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

export default async function handler(req, res) {
  const code = req.url.replace(/^\/+/, '').split('?')[0];

  if (!code) {
    return res.status(400).send('Code is missing');
  }

  const getResponse = await fetch(`${KV_URL}/get/${code}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`
    }
  });

  if (!getResponse.ok) {
    return res.status(404).send('Shortlink not found');
  }

  const data = await getResponse.json();

  const rawUrl = data.result;
  const url = typeof rawUrl === 'string' ? rawUrl.replace(/^"|"$/g, '') : '';

  if (!url || !url.startsWith('http')) {
    return res.status(404).send('Shortlink not found');
  }

  res.writeHead(302, { Location: url });
  res.end();
}
