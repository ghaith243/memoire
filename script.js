const board = document.getElementById('board');
const movesElement = document.getElementById('moves');
const matchesElement = document.getElementById('matches');
const timerElement = document.getElementById('timer');
const difficultySelect = document.getElementById('difficulty');
const startButton = document.getElementById('start-game');
const rulesModal = document.getElementById('rules-modal');
const openRulesButton = document.getElementById('open-rules');
const closeRulesButtons = document.querySelectorAll('#close-rules, #close-rules-footer');

const tastes = [
  { id: 'coco', label: 'Coco', image: 'images/coco.png' },
  { id: 'choco', label: 'Chocolat', image: 'images/choco.png' },
  { id: 'chocolat', label: 'Chocolat', image: 'images/chocolat.png' },
  { id: 'pista', label: 'Pistache', image: 'images/pista.png' },
  { id: 'fraise', label: 'Fraise', image: 'images/fraise.png' },
  { id: 'noisette', label: 'Noisette', image: 'images/noisette.png' }
];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matches = 0;
let timer = 0;
let timerInterval = null;

function openRules() {
  rulesModal.classList.remove('hidden');
}

function closeRules() {
  rulesModal.classList.add('hidden');
}

function startTimer() {
  clearInterval(timerInterval);
  timer = 0;
  timerElement.textContent = timer;
  timerInterval = setInterval(() => {
    timer += 1;
    timerElement.textContent = timer;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function resetGame() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  moves = 0;
  matches = 0;
  movesElement.textContent = moves;
  matchesElement.textContent = matches;
  board.innerHTML = '';
  stopTimer();
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function createCard(cardData) {
  const card = document.createElement('button');
  card.className = 'card';
  card.type = 'button';
  card.dataset.id = cardData.id;
  card.dataset.name = cardData.label;

  const inner = document.createElement('div');
  inner.className = 'card-inner';

  const backFace = document.createElement('div');
  backFace.className = 'card-face card-back';
  backFace.textContent = 'YO';

  const frontFace = document.createElement('div');
  frontFace.className = 'card-face card-front';
  const img = document.createElement('img');
  img.src = cardData.image;
  img.alt = cardData.label;
  frontFace.appendChild(img);

  inner.appendChild(backFace);
  inner.appendChild(frontFace);
  card.appendChild(inner);

  card.addEventListener('click', () => flipCard(card));
  return card;
}

function flipCard(card) {
  if (lockBoard || card === firstCard || card.classList.contains('matched')) return;
  card.classList.add('flipped');

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;
  moves += 1;
  movesElement.textContent = moves;

  if (firstCard.dataset.id === secondCard.dataset.id) {
    cardMatch();
  } else {
    cardMismatch();
  }
}

function cardMatch() {
  firstCard.classList.add('matched');
  secondCard.classList.add('matched');
  matches += 1;
  matchesElement.textContent = matches;
  resetTurn();
  const totalPairs = parseInt(difficultySelect.value, 10) / 2;
  if (matches === totalPairs) {
    stopTimer();
    setTimeout(() => {
      alert(`Bravo ! Vous avez trouvé toutes les paires en ${moves} coups et ${timer} secondes.`);
    }, 300);
  }
}

function cardMismatch() {
  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    resetTurn();
  }, 900);
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function startGame() {
  resetGame();
  startTimer();
  const count = parseInt(difficultySelect.value, 10);
  const pairCount = count / 2;
  const selectedTastes = shuffle([...tastes]).slice(0, pairCount);
  const deck = shuffle([...selectedTastes, ...selectedTastes]);

  const columns = count <= 12 ? 3 : count <= 20 ? 4 : 6;
  board.style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;

  deck.forEach(cardData => {
    board.appendChild(createCard(cardData));
  });
}

openRulesButton.addEventListener('click', openRules);
closeRulesButtons.forEach(button => button.addEventListener('click', closeRules));
startButton.addEventListener('click', startGame);

startGame();
