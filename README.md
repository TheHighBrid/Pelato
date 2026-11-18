# PELATO

**Your music. Your rules.**

Pelato is an offline-first, personal media player with Melato's design language. No login, ads, subscription, or cloud upload is required.

## Run

Requires Node.js 22+ (no dependencies or build step).

```sh
npm start
```

Open http://localhost:4173, choose **Import music**, and select audio files. Imported copies and playlists stay in this browser's IndexedDB. Use a dedicated browser profile and keep your originals; clearing site data removes Pelato's local copies. Install from your browser's app menu when supported. HTTPS or localhost is required for offline web-app installation.

On a phone, install from a trusted HTTPS Pelato deployment; the local development server is not intended for public exposure. Playback and background controls depend on the browser/OS and supported codecs. DRM-protected purchases are not playable.

## Included in v0.1

- Music import, library search, liked tracks, custom playlists, queue, shuffle, repeat, seek, volume, media-session controls
- Local-first storage and offline app shell; no external runtime services
- Responsive desktop/mobile interface, original dark Melato-inspired styling
- Common MP3 ID3 tags, embedded artwork, and filename fallback for other audio files

## Development

```sh
npm test
```

See [BLUEPRINT.md](BLUEPRINT.md) for product architecture, privacy boundaries and the roadmap.

## Free web hosting

The static `app/` directory can be served on any HTTPS static host. The `gh-pages` branch contains the same static app at its root, ready for GitHub Pages. If Pages is not enabled yet, open Settings → Pages → Deploy from a branch → `gh-pages` / `(root)` → Save. No audio is hosted or uploaded. Bump the app-shell cache version in `app/sw.js` when changing cached assets.
