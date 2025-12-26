MEMORY MATCH CHALLENGE - WEB APPLICATION
========================================

OVERVIEW
--------
Memory Match Challenge is an interactive, browser-based card matching game 
designed to test and improve cognitive recall. Built using a pure Vanilla 
JavaScript, HTML5, and CSS3 stack, the app features dynamic difficulty levels, 
a scoring system, and local leaderboard persistence.

TECHNICAL CONSTRUCTION
----------------------
This application follows a modern "Single Page Application" (SPA) logic 
without the need for external frameworks.

1. ARCHITECTURE (JavaScript Logic):
   - State Management: Tracks game variables (moves, timer, score, hints) in 
     a centralized state.
   - Fisher-Yates Shuffle Algorithm: Implements an unbiased randomization 
     logic to ensure cards are uniquely shuffled every session.
   - Event Delegation: Efficiently manages card interactions and difficulty 
     switching via DOM event listeners.
   - Persistence API: Uses 'localStorage' to store and retrieve top-5 
     leaderboard records locally on the user's device.

2. USER INTERFACE (HTML/CSS):
   - CSS Grid Layout: Dynamically adjusts the board configuration (3x4, 4x4, 
     or 4x5) based on the selected difficulty level.
   - 3D Transforms: Implements 'preserve-3d' and 'backface-visibility' to 
     create smooth, hardware-accelerated 3D card-flip animations.
   - Responsive Design: Uses media queries to ensure playability on mobile 
     devices (scaling from 4 columns down to 2).
   - Glassmorphism: Semi-transparent overlays and linear gradients provide 
     a modern, vibrant "Cyber-soft" aesthetic.

3. GAME MECHANICS:
   - Scoring Algorithm: Calculates points based on a combination of 
     difficulty multipliers, move count, and a time-bonus for fast completion.
   - Hint System: A limited-use helper function that identifies a random 
     unmatched pair and briefly reveals it.

FEATURES
--------
* Difficulty Modes: Easy (12 cards), Medium (16 cards), and Hard (20 cards).
* Real-time Stats: Live tracking of move counts and elapsed time.
* Interactive Leaderboard: Compares current performance against high scores.
* Smart UI: Cards provide visual feedback through "glow" effects when matched.

INSTALLATION & EXECUTION
------------------------
1. Ensure the following assets are present:
   - index.html (containing the logic and structure)
2. No local server is required. Simply open 'index.html' in any modern 
   web browser (Chrome, Firefox, Safari, or Edge).
3. The game is optimized for both desktop mouse clicks and mobile touch 
   events.

LEGAL & CREDITS
---------------
* Created by: Giscard
* Version: 1.0.0 (2025)
* License: MIT License (Open Source)
