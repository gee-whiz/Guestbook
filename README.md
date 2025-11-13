# Guestbook

Neon Nights Guestbook is a lightweight Node.js + Express server with a static Bootstrap frontend for collecting and showing messages from party guests. The form now posts directly into a JSON-backed API so every message is immediately visible in the guestbook table.

## Technology
- Node.js (CommonJS) + Express 5 for the HTTP server and API routes
- Bootstrap 5 for layout and styling
- Vanilla JavaScript for DOM updates and form validation

## Run It Locally
```bash
npm install
npm start    # production-style server
# or
npm run dev  # sets NODE_ENV=development and starts the server
```
The server listens on `http://localhost:3000` by default and serves the static pages from `public/`.

## Guestbook API
| Method | Path              | Description                                           |
| ------ | ----------------- | ----------------------------------------------------- |
| GET    | `/api/guestbook`  | Returns the array of guestbook entries as JSON.      |
| POST   | `/api/guestbook`  | Accepts `{ username, country, message }` JSON body and appends a new entry. |

- Entries are persisted to `public/data/guestbook.json`; the server ensures the file exists on first write.
- The `/new-message/` page POSTs to the API and redirects back to `/guestbook/` after a successful save, so you can exercise the flow entirely in the browser.
- You can also seed entries manually via cURL:

```bash
curl -X POST http://localhost:3000/api/guestbook \
  -H 'Content-Type: application/json' \
  -d '{
        "username": "George",
        "country": "Finland",
        "message": "Testing the guestbook pipeline."
      }'
```

## What I Learned
Building this small app helped reinforce how quickly you can prototype a cohesive experience by leaning on Express for simple APIs, Bootstrap for visual polish, and a touch of client-side JavaScript for dynamic behavior. Structuring the pages as static assets while keeping API endpoints ready for future wiring made it easy to iterate without over-engineering.***
