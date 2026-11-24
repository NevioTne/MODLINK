# MODLINK Website

Official project website for MODLINK (standalone device + Windows PC software). Plain HTML, CSS and JavaScript: no build step, no backend, no tracking. All paths are relative, so it works under `https://<user>.github.io/<repo>/`.

## Run locally
Open `index.html` in a browser, or run `python -m http.server` in this folder.

## Publish on GitHub Pages
1. Create a repository and upload the **contents** of this folder (`index.html` must be in the repo root).
2. Repository **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then **Save**.
4. After a minute the site is live at `https://<user>.github.io/<repo>/`.

## What you still need to fill in
- `js/config.js`: `repoUrl`, `releasesUrl`, `downloadUrl`, `docsUrl`, per-topic `docs` URLs (only for docs that exist), `copyright`, `version` if it changes.
- Images: put files in `assets/images/` and enter their paths in `config.js` (`heroImage`, `gallery.*`). Use only your own or properly licensed images.
- `index.html`: add an `og:image` meta tag once you have a device image.
- `LICENSE`: the MIT text is only a proposal. Choose the license you want.
- Docs content in `docs/`: add real pages, then link them in `config.js`.
- Optional: privacy/legal notice if your jurisdiction requires one (e.g. an Impressum in Germany).

Buttons with an empty URL are shown disabled with a hint; nothing links to invented addresses.

## Languages
Texts live in `js/translations.js` (`en`, `de`); the communication section lives in `js/translations.comm.js`, its logic in `js/comm.js`. The browser language is detected (non-German falls back to English); the choice is saved in `localStorage`.

## Updating for new versions
- Firmware version: `version` in `js/config.js` (shown on the site and inside the simulator).
- MODLINK Studio version: `studioVersion` in `js/config.js` (empty = hidden).
- Function status badges (Available / In Development / Planned / Coming Soon): `status` in `js/config.js`. Change a value when a function ships.
- Texts: `js/translations*.js` (German and English). Studio showcase: `js/translations.studio.js` and `js/studio.js`. Device simulator: `js/sim.js`.
- The Studio mockups are redrawn examples, not real screenshots. Real screenshots may show confidential details (controller model, port names, raw data), so check them before publishing.
