// Game state
 let cards = [];
 let flippedCards = [];
 let matchedPairs = 0;
 let moves = 0;
 let score = 0;
 let gameStarted = false;
 let timer = 0;
 let timerInterval;
 let hintsLeft = 2;
 let difficulty = 'easy';
 let difficultyConfig = {
     easy: { pairs: 6, hintDuration: 1000 },
     medium: { pairs: 8, hintDuration: 800 },
     hard: { pairs: 10, hintDuration: 600 }

 };

 // Elements
 const gameBoard = document.getElementById('game-board');
 const movesDisplay = document.getElementById('moves');
 const timerDisplay = document.getElementById('timer');
 const scoreDisplay = document.getElementById('score');
 const restartBtn = document.getElementById('restart-btn');
 const hintBtn = document.getElementById('hint-btn');
 const levelBtns = document.querySelectorAll('.level-btn');
 const winModal = document.getElementById('win-modal');
 const resultMoves = document.getElementById('result-moves');
 const resultTime = document.getElementById('result-time');
 const resultScore = document.getElementById('result-score');
 const playAgainBtn = document.getElementById('play-again-btn');
 const leaderboardList = document.getElementById('leaderboard-list');

 // Card symbols (emojis)
 const cardSymbols = [
     '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻',
     '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸',
     '🐵', '🐔', '🐧', '🐦', '🐤', '🦅', '🦆',
     '🦉', '🦇', '🐺', '🐗', '🐿️', '🐝', '🐴'
 ];

 // Initialize game
 function initGame() {
     resetGameState();
     generateCards();
     renderCards();
     updateUI();

     // Start timer on first card click
     gameBoard.addEventListener('click', startTimerOnFirstClick, { once: true });
 }

 // Reset game state
 function resetGameState() {
     cards = [];
     flippedCards = [];
     matchedPairs = 0;
     moves = 0;
     score = 0;
     gameStarted = false;
     timer = 0;
     hintsLeft = 2;

     clearInterval(timerInterval);
     hintBtn.textContent = `Hint (${hintsLeft})`;
     gameBoard.innerHTML = '';
     updateUI();
 }

 // Generate cards
 function generateCards() {
     const pairs = difficultyConfig[difficulty].pairs;
     const symbols = [...cardSymbols].sort(() => Math.random() - 0.5).slice(0, pairs);

     // Create pairs
     cards = [...symbols, ...symbols].map((symbol, index) => ({
         id: index,
         symbol,
         isFlipped: false,
         isMatched: false
     }));

     // Shuffle cards
     cards.sort(() => Math.random() - 0.5);
 }

 // Render cards
 function renderCards() {
     gameBoard.innerHTML = '';

     // Adjust grid based on difficulty
     if (difficulty === 'easy') {
         gameBoard.style.gridTemplateColumns = 'repeat(3, 1fr)';

     } else if (difficulty === 'medium') {
         gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';

     } else {
         gameBoard.style.gridTemplateColumns = 'repeat(5, 1fr)';
     }

     cards.forEach(card => {
         const cardElement = document.createElement('div');
         cardElement.className = 'card';
         cardElement.dataset.id = card.id;

         cardElement.innerHTML = `
             <div class="card-face card-front">${card.symbol}</div>
             <div class="card-face card-back">?</div>
         `;

         if (card.isFlipped || card.isMatched) {
             cardElement.classList.add('flipped');
         }

         if (card.isMatched) {
             cardElement.classList.add('matched');
         }

         cardElement.addEventListener('click', () => flipCard(card.id));

         gameBoard.appendChild(cardElement);
     });
 }

 // Update UI elements
 function updateUI() {
     movesDisplay.textContent = `Moves: ${moves}`;
     timerDisplay.textContent = `Time: ${timer}s`;
     scoreDisplay.textContent = `Score: ${score}`;
 }

 // Start timer on first card click
 function startTimerOnFirstClick() {
     if (!gameStarted) {
         gameStarted = true;
         timerInterval = setInterval(() => {
             timer++;
             updateUI();
         }, 1000);
     }
 }

 // Flip card
 function flipCard(cardId) {
     // Start timer on first click
     if (!gameStarted) {
         gameStarted = true;
         timerInterval = setInterval(() => {
             timer++;
             updateUI();
         }, 1000);
     }

     const card = cards.find(c => c.id === parseInt(cardId));

     // Ignore if card is already flipped or matched
     if (card.isFlipped || card.isMatched || flippedCards.length >= 2) return;

     // Flip the card
     card.isFlipped = true;
     flippedCards.push(card);

     // Update UI
     const cardElement = document.querySelector(`.card[data-id="${cardId}"]`);
     cardElement.classList.add('flipped');

     // Check for match if two cards are flipped
     if (flippedCards.length === 2) {
         moves++;
         updateUI();

         // Check for match
         if (flippedCards[0].symbol === flippedCards[1].symbol) {
             // Match found
             setTimeout(() => handleMatch(), 500);
         } else {
             // No match
             setTimeout(() => handleNoMatch(), 1000);
         }
     }
 }

 // Handle match
 function handleMatch() {
     // Mark cards as matched
     flippedCards.forEach(card => {
         card.isMatched = true;
         const cardElement = document.querySelector(`.card[data-id="${card.id}"]`);
         cardElement.classList.add('matched');
     });

     // Update matched pairs and score
     matchedPairs++;

     // Calculate score based on moves and time
     const moveBonus = Math.max(10 - Math.floor(moves / difficultyConfig[difficulty].pairs), 1);
     const newPoints = 100 * moveBonus;
     score += newPoints;

     // Show floating score
     flippedCards.forEach(card => {
         const cardElement = document.querySelector(`.card[data-id="${card.id}"]`);
         const scoreFloat = document.createElement('div');
         scoreFloat.textContent = `+${newPoints/2}`;
         scoreFloat.style.position = 'absolute';
         scoreFloat.style.color = '#ff6b6b';
         scoreFloat.style.fontWeight = 'bold';
         scoreFloat.style.fontSize = '1.2rem';
         scoreFloat.style.zIndex = '10';
         scoreFloat.style.animation = 'float-up 1s forwards';

         // Add animation
         const style = document.createElement('style');
         style.textContent = `
             @keyframes float-up {
                 0% { opacity: 1; transform: translateY(0); }
                 100% { opacity: 0; transform: translateY(-50px); }
             }
         `;
         document.head.appendChild(style);

         cardElement.appendChild(scoreFloat);
         setTimeout(() => scoreFloat.remove(), 1000);
     });

     updateUI();
     flippedCards = [];

     // Check if game is complete
     if (matchedPairs === difficultyConfig[difficulty].pairs) {
         setTimeout(() => handleGameComplete(), 500);
     }
 }

 // Handle no match
 function handleNoMatch() {
     // Flip cards back
     flippedCards.forEach(card => {
         card.isFlipped = false;
         const cardElement = document.querySelector(`.card[data-id="${card.id}"]`);
         cardElement.classList.remove('flipped');
     });

     flippedCards = [];
 }

 // Handle game complete
 function handleGameComplete() {
     clearInterval(timerInterval);

     // Calculate final score with time bonus
     const timeBonus = Math.max(100 - timer, 0);
     score += timeBonus;

     // Update leaderboard
     updateLeaderboard({
         difficulty,
         moves,
         time: timer,
         score
     });

     // Show completion modal
     resultMoves.textContent = moves;
     resultTime.textContent = timer;
     resultScore.textContent = score;
     displayLeaderboard();
     winModal.style.display = 'flex';
 }

 // Update leaderboard
 function updateLeaderboard(result) {
     const leaderboardKey = `memory-match-leaderboard-${difficulty}`;
     let leaderboard = JSON.parse(localStorage.getItem(leaderboardKey) || '[]');

     leaderboard.push(result);
     leaderboard.sort((a, b) => b.score - a.score);
     leaderboard = leaderboard.slice(0, 5); // Keep top 5

     localStorage.setItem(leaderboardKey, JSON.stringify(leaderboard));
 }

 // Display leaderboard
 function displayLeaderboard() {
     const leaderboardKey = `memory-match-leaderboard-${difficulty}`;
     const leaderboard = JSON.parse(localStorage.getItem(leaderboardKey) || '[]');

     leaderboardList.innerHTML = '';

     if (leaderboard.length === 0) {
         const item = document.createElement('li');
         item.textContent = 'No records yet';
         leaderboardList.appendChild(item);
         return;
     }

     leaderboard.forEach((entry, index) => {
         const item = document.createElement('li');
         item.className = 'leaderboard-item';
         item.innerHTML = `
             <span>#${index + 1}: ${entry.moves} moves, ${entry.time}s</span>
             <span>${entry.score} pts</span>
         `;
         leaderboardList.appendChild(item);
     });
 }

 // Show hint
 function showHint() {
     if (hintsLeft <= 0 || !gameStarted || matchedPairs === difficultyConfig[difficulty].pairs) return;

     hintsLeft--;
     hintBtn.textContent = `Hint (${hintsLeft})`;

     // Find unmatched cards
     const unmatchedCards = cards.filter(card => !card.isMatched);

     // If no unmatched cards, return
     if (unmatchedCards.length === 0) return;

     // Get a random unmatched symbol
     const randomSymbol = unmatchedCards[Math.floor(Math.random() * unmatchedCards.length)].symbol;

     // Find all cards with this symbol
     const hintCards = unmatchedCards.filter(card => card.symbol === randomSymbol);

     // Show the hint
     hintCards.forEach(card => {
         const cardElement = document.querySelector(`.card[data-id="${card.id}"]`);
         cardElement.classList.add('flipped');

         // Revert after a short time
         setTimeout(() => {
             if (!card.isMatched) {
                 cardElement.classList.remove('flipped');
             }
         }, difficultyConfig[difficulty].hintDuration);
     });
 }

 // Change difficulty
 function changeDifficulty(level) {
     difficulty = level;

     // Update active button
     levelBtns.forEach(btn => {
         if (btn.dataset.level === level) {
             btn.classList.add('active');
         } else {
             btn.classList.remove('active');
         }
     });

     initGame();
 }

 // Event listeners
 restartBtn.addEventListener('click', initGame);
 hintBtn.addEventListener('click', showHint);
 playAgainBtn.addEventListener('click', () => {
     winModal.style.display = 'none';
     initGame();
 });

 levelBtns.forEach(btn => {
     btn.addEventListener('click', () => changeDifficulty(btn.dataset.level));
 });

 // Initialize game on load
 initGame();
