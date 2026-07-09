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

## iOS app (Capacitor)

The repo contains a Capacitor iOS project in `ios/` that wraps the built web app in a WKWebView. The web UI is mobile-first, so it transfers as-is.

### Prerequisites (Mac only)

- Xcode (App Store) with command line tools
- An [Apple Developer account](https://developer.apple.com) for device testing / TestFlight / App Store

### Point the app at a hosted API

The native app serves its UI from `capacitor://localhost`, so it cannot use the same-origin `/api` routes — the Express server must be hosted somewhere (Railway, Render, Fly, etc. — deploy this repo and run `npm start` with `OPENAI_API_KEY` set). Then build the frontend with that URL:

```bash
echo 'VITE_API_BASE=https://your-api.example.com' > .env.local
```

The server already sends permissive CORS headers for this.

### Build and run

```bash
npm run ios:sync   # builds the web app and copies it into the iOS project
npm run ios:open   # opens ios/App in Xcode
```

In Xcode: select your team under Signing & Capabilities, pick a simulator or your phone, and hit Run. For your phone over TestFlight: Product → Archive → Distribute App.

App icons and splash screens are generated from `assets/` into the Xcode asset catalogs via `npm run ios:assets`.

### Native details

- State is mirrored to Capacitor Preferences (NSUserDefaults) on iOS, so boards survive WKWebView storage eviction.
- App id: `com.intentnet.explorer`, name: IntentNet Explorer (see `capacitor.config.ts`).
