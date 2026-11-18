# Pelato product blueprint

## Mission

Own the listening experience. Deliver a premium personal music player first, then extend the same media engine into Melato Radio and video. No mandatory account, advertisements, paid API, or cloud storage.

## Experience

Familiar navigation: Home, Search, Your Library, Liked Songs, Playlists, Settings, persistent player, Up Next. Desktop sidebar + responsive mobile navigation. Original design tokens: obsidian #0A0A0A, warm ivory #F5F2EB, stone #D6C9BA, graphite #252525, bronze #A88B68. Quiet typography, strong editorial album art, restrained metallic accents. Spotify is a usability benchmark, not a visual asset source.

## Architecture

- Static HTML/CSS/ES modules, native HTML Audio, Media Session when available; no framework or build tooling required.
- IndexedDB stores the imported audio blobs and metadata separately so large audio payloads are read on demand. Playlists, queue preferences and favorites are local. Service worker caches the app shell, not remote music.
- Storage is per origin/device/browser profile; browser quota, eviction and codec support vary. Keep originals. No claim of cross-device sync or unlimited storage.
- Separate library, playback order, metadata reading and rendering. Native desktop/mobile adapters are an upgrade path for direct filesystem access without copying large libraries, reliable background playback, and richer audio features.
- User-owned DRM-free MP3, AAC/M4A, WAV, FLAC and Ogg can be imported; actual decoding depends on platform. No DRM bypass. No remote media is fetched without deliberate user action.

## Roadmap and gates

| Phase | Objective | Acceptance gate |
| --- | --- | --- |
| 0.1 Local Music | import and play personal tracks, search, favorites, playlists, queue, offline shell | actual audio plays; library survives reload; no network needed after shell cache |
| 0.2 Library | richer tags and lyrics (.lrc, user-supplied), album/artist browsing, playlist export, smart mixes | timestamped lyrics seek correctly; duplicate handling and portable playlist backups |
| 0.3 Native | macOS and Android wrappers, directory indexing, reliable background playback and lock-screen controls | device tests on M1 and Android; no duplicated audio required in direct-folder mode |
| 0.4 Discovery | weekly release digest, locally matched popular playlists, import authorized playlist metadata | missing tracks are reported; no scraping, DRM circumvention, or unauthorized downloads |
| 0.5 Melato Radio | curated programming, schedules and pluggable streams | licensed streams or owned/licensed audio; publishing rights checked separately from personal playback |
| 1.0 Media | video library, subtitles, GIF and image viewing, unified queue where appropriate | codec and performance checks; offline playback remains intact |

## Non-negotiables

No paid infrastructure without owner authorization. No sending personal music to a server by default. No pretending a stream catalog is owned audio. Music purchased for personal use does not automatically grant public radio distribution rights. Later integrations should use authorized metadata APIs or user-provided exports; match against local tracks.
