# Guestbook

Neon Nights Guestbook is a lightweight Node.js + Express server with a static Bootstrap frontend for collecting messages from party guests. Axios powers a fun fact endpoint, and plain browser JavaScript handles client-side validation and table rendering.

## Technology
- Node.js (CommonJS) + Express 5 for the HTTP server and API routes
- Axios for fetching remote fun facts
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

## What I Learned
Building this small app helped reinforce how quickly you can prototype a cohesive experience by leaning on Express for simple APIs, Bootstrap for visual polish, and a touch of client-side JavaScript for dynamic behavior. Structuring the pages as static assets while keeping API endpoints ready for future wiring made it easy to iterate without over-engineering.***
