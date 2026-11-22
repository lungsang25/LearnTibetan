# Tiblingo landing page

Static site (no build step): `index.html`, `styles.css`, `script.js`, `assets/`.

Preview locally: `python3 -m http.server 8000` then open http://localhost:8000.

Deploy: drop the folder on GitHub Pages, Netlify, Vercel or any static host.

## When the app is published
In `index.html`, find the two `.store` links in the `#download` section. Set their `href` to the real App Store / Google Play URLs, then remove `aria-disabled="true"`, the `<em>Soon</em>` tags, the "Coming soon" pill and the note below the badges.
