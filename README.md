# IntentNet Explorer

A retro Internet Explorer clone with a twist: an AI agent reads every search query and decides whether it's a **general search** ("what is the capital of Turkey") or an **actionable intent** ("how do I start a business"). Searches get a nostalgic early-2000s results page; intents get an auto-generated **Kanban board** — the minimum viable path to your goal — opened in a new tab inside the fake browser.

## Stack

- **Frontend:** React + Vite + TypeScript, styled with [98.css](https://jdan.github.io/98.css/) plus custom IE6-era chrome (toolbar, address bar, tab strip, status bar, throbber).
- **Backend:** Express server with two endpoints: `POST /api/classify` and `POST /api/generate-board`, powered by OpenAI.
- **Persistence:** boards and open tabs are saved to `localStorage`.

## Running it

```bash
npm install
npm run dev        # starts the API server (port 3001) and Vite (port 5173) together
```

Then open http://localhost:5173.

### AI configuration

Set `OPENAI_API_KEY` in the server's environment for real classification and board generation:

```bash
OPENAI_API_KEY=sk-... npm run dev
```

Optionally set `OPENAI_MODEL` (defaults to `gpt-4o-mini`).

**Demo mode:** without an API key the server falls back to a heuristic classifier and canned boards, so the whole flow is demoable offline.

## Production

```bash
npm run build      # builds the frontend into dist/
npm start          # serves dist/ and the API from one Express server on port 3001
```

## Install as an app (PWA)

IntentNet Explorer is a Progressive Web App: when served over HTTPS it can be installed to the home screen and launches full-screen like a native app, with the retro icon.

- **iPhone/iPad:** open the site in Safari → Share → **Add to Home Screen**.
- **Android:** Chrome shows an install prompt, or menu → **Add to Home screen**.
- **Desktop:** the install icon appears in Chrome/Edge's address bar.

The app shell (HTML/JS/CSS/fonts) is precached by a service worker, so it opens instantly; the AI endpoints still need a network connection — offline you get the authentic "The page cannot be displayed" experience.

If the frontend is hosted separately from the API, set `VITE_API_BASE=https://your-api.example.com` at build time (the server sends permissive CORS headers).
