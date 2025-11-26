const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const basePathFromEnv = (process.env.BASE_PATH || '').replace(/\/+$/, '').replace(/^\/+/, '');
const BASE_PATH = basePathFromEnv ? `/${basePathFromEnv}` : '';
const publicDir = path.join(__dirname, 'public');
const guestbookPath = path.join(publicDir, 'data', 'guestbook.json');

app.use(express.json());

app.use((req, res, next) => {
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const requestOrigin = req.headers.origin;
  if (!allowedOrigins.length || (requestOrigin && allowedOrigins.includes(requestOrigin))) {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins.length ? requestOrigin : '*');
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

// Support running the app under a sub-path (e.g., GitHub Pages style).
app.use(BASE_PATH || '/', express.static(publicDir));

// Serve the few HTML pages we have; everything else falls back to express.static.
const pages = [
  { route: '/', file: 'index.html' },
  { route: '/guestbook', file: 'guestbook/index.html' },
  { route: '/new-message', file: 'new-message/index.html' },
];

pages.forEach(({ route, file }) => {
  app.get(`${BASE_PATH}${route}`, (_req, res) => res.sendFile(path.join(publicDir, file)));
});

async function readGuestbook() {
  try {
    const data = await fs.readFile(guestbookPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeGuestbook(entries) {
  await fs.mkdir(path.dirname(guestbookPath), { recursive: true });
  await fs.writeFile(guestbookPath, JSON.stringify(entries, null, 2));
}

app.get(`${BASE_PATH}/api/guestbook`, async (_req, res) => {
  try {
    const entries = await readGuestbook();
    res.json(entries);
  } catch (error) {
    console.error('Failed to read guestbook', error);
    res.status(500).json({ error: 'Unable to load guestbook entries.' });
  }
});

app.post(`${BASE_PATH}/api/guestbook`, async (req, res) => {
  const { username = '', country = '', message = '' } = req.body || {};
  const cleaned = {
    username: username.trim(),
    country: country.trim(),
    message: message.trim(),
  };

  if (!cleaned.username || !cleaned.country || !cleaned.message) {
    return res.status(400).json({ error: 'Username, country, and message are required.' });
  }

  try {
    const entries = await readGuestbook();
    const newEntry = {
      id: crypto.randomUUID(),
      ...cleaned,
      date: new Date().toString(),
    };
    const updatedEntries = [newEntry, ...entries];
    await writeGuestbook(updatedEntries);
    res.status(201).json(newEntry);
  } catch (error) {
    console.error('Failed to append guestbook entry', error);
    res.status(500).json({ error: 'Unable to save your message right now.' });
  }
});

app.listen(PORT, () => {
  const pathInfo = BASE_PATH || '/';
  console.log(`Guestbook server listening on http://localhost:${PORT}${pathInfo}`);
});
