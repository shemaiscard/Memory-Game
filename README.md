# Memory Match Challenge

**Play it:** [zememory.netlify.app](https://zememory.netlify.app)

A card-matching memory game with 3D flips, three difficulty levels and a local leaderboard. Plain JavaScript, HTML and CSS, no framework.

## Features

- **Difficulty:** Easy (6 pairs), Medium (8 pairs), Hard (10 pairs). Harder levels also shorten the hint reveal.
- **3D card flips:** CSS `preserve-3d` and `backface-visibility`.
- **Scoring:** a difficulty multiplier, your move count and a time bonus.
- **Hints:** two per game. A hint briefly shows one unmatched pair.
- **Leaderboard:** the top 5 scores stay in `localStorage` on your device. Nothing is uploaded.
- **Responsive board:** a CSS Grid that goes from 4 columns on desktop to 2 on phones.
- **Installable:** works offline as a PWA.

The deck is shuffled with Fisher-Yates, and card clicks go through one delegated event listener.

## Tech stack

| Part | Technology |
| --- | --- |
| Language | Vanilla JavaScript |
| Layout and effects | HTML5, CSS3 Grid, CSS 3D transforms |
| Storage | Local Storage |
| App | PWA (manifest and service worker) |
| Hosting | Netlify |

## Also in this repo: app heartbeat

`.github/workflows/wake_apps.yml` is a separate GitHub Actions job. Every 3 hours it opens my Streamlit apps with Playwright, because Streamlit Community Cloud puts an app to sleep after 12 hours without visitors. It is not part of the game.

## Run locally

Open `index.html` in a modern browser. No install needed.

## License

MIT License
