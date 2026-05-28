# Memory Match Challenge

**Live Demo:** [zememory.netlify.app](https://zememory.netlify.app)

A cognitive recall browser game with 3D card flips, dynamic difficulty levels, and local leaderboard persistence. Built with pure vanilla JavaScript, HTML5, and CSS3.

## Features

- **Difficulty Modes**: Easy (12 cards), Medium (16 cards), Hard (20 cards)
- **3D Card Flips**: CSS `preserve-3d` and `backface-visibility` for smooth hardware-accelerated animations
- **Scoring**: Points calculated from difficulty multiplier, move count, and time bonus
- **Leaderboard**: Top 5 scores stored in `localStorage` — private to your device, nothing uploaded
- **Hint System**: Limited-use helper that briefly reveals an unmatched pair
- **Responsive**: Scales from 4 columns on desktop down to 2 on mobile

## Technical Highlights

- **Fisher-Yates Shuffle**: Unbiased card randomization each session
- **Event Delegation**: Efficient card interaction management
- **CSS Grid**: Dynamic board layout adjusts per difficulty

## Run Locally

Open `index.html` in any modern browser. No server or installation required.

## License
MIT License — v1.0.0 — Developed by Giscard
