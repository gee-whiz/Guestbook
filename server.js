const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');

app.use(express.static(publicDir));

// Serve the few HTML pages we have; everything else falls back to express.static.
const pages = [
  { route: '/', file: 'index.html' },
  { route: '/guestbook', file: 'guestbook/index.html' },
  { route: '/new-message', file: 'new-message/index.html' },
];

pages.forEach(({ route, file }) => {
  app.get(route, (_req, res) => res.sendFile(path.join(publicDir, file)));
});

app.listen(PORT, () => {
  console.log(`Guestbook server listening on http://localhost:${PORT}`);
});
