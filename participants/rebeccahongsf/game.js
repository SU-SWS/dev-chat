const TIMER_DURATION  = 60_000;
const AVATAR_COLORS   = ['#009AB4','#734675','#2D716F','#00548f','#59B3A9','#42081B','#67AFD2','#8AB8A7'];
const CONFETTI_COLORS = ['#FFE781','#009AB4','#734675','#8AB8A7','#67AFD2','#59B3A9','#2D716F','#42081B','#00548f'];

let teamMembers    = [];
let levels         = [];
let levelIndex     = 0;
let score          = 0;
let correctAnswer  = '';
let answerPoolSize = 3;   // grows by +2 each time the player wins
let gameActive     = false;

let timerStart  = null;
let timerRAF    = null;
let isFlipping  = false;
let flipAngle   = 0;

// ── INIT ────────────────────────────────────────────────────────────────

async function init() {
  try {
    const res = await fetch('fun-facts.json');
    if (!res.ok) throw new Error();
    teamMembers = await res.json();
  } catch {
    document.body.innerHTML =
      '<p style="color:#fff;text-align:center;padding:3rem;font-size:1.1rem">' +
      'Could not load fun-facts.json.<br>Open via a local server ' +
      '(VS Code Live Server or <code>python3 -m http.server</code>).</p>';
    return;
  }

  if (teamMembers.length < 3) {
    alert('Add at least 3 team members to fun-facts.json to play!');
    return;
  }

  showCoinFlip();

  document.getElementById('ready-btn').addEventListener('click', startGame);
  document.getElementById('play-again-btn').addEventListener('click', renderIntro);
  document.getElementById('try-again-btn').addEventListener('click', startGame);
  document.getElementById('harder-btn').addEventListener('click', () => {
    answerPoolSize = Math.min(answerPoolSize + 2, teamMembers.length);
    startGame();
  });
}

// ── COIN FLIP ───────────────────────────────────────────────────────────

function showCoinFlip() {
  isFlipping = false;
  flipAngle  = 0;
  const coin = document.getElementById('coin');
  coin.style.transition = 'none';
  coin.style.transform  = 'rotateY(0deg)';
  document.getElementById('coin-result-text').innerHTML = '&nbsp;';
  const flipBtn = document.getElementById('flip-btn');
  flipBtn.textContent = 'FLIP THE COIN!';
  flipBtn.className   = 'btn btn-cta';
  flipBtn.disabled    = false;
  flipBtn.onclick     = doFlip;
  showScreen('coin-screen');
}

function doFlip() {
  if (isFlipping) return;
  isFlipping = true;

  const flipBtn = document.getElementById('flip-btn');
  flipBtn.disabled = true;
  document.getElementById('coin-result-text').innerHTML = '&nbsp;';

  const result   = Math.random() < 0.5 ? 'win' : 'lose';
  const spins    = 5 + Math.floor(Math.random() * 4);
  flipAngle      = flipAngle + spins * 360 + (result === 'lose' ? 180 : 0);

  const coin = document.getElementById('coin');
  coin.style.transition = 'transform 1.8s cubic-bezier(0.33, 1, 0.68, 1)';
  coin.style.transform  = `rotateY(${flipAngle}deg)`;

  setTimeout(() => {
    isFlipping = false;
    const resultText = document.getElementById('coin-result-text');
    if (result === 'win') {
      resultText.textContent  = "🎉 Heads! You're in — study up!";
      flipBtn.textContent     = "SEE THE FACTS! 📋";
      flipBtn.className       = 'btn btn-cta';
      flipBtn.disabled        = false;
      flipBtn.onclick         = renderIntro;
    } else {
      resultText.textContent  = '😬 Tails! Not today...';
      flipBtn.textContent     = 'FLIP AGAIN 🔄';
      flipBtn.className       = 'btn btn-cta';
      flipBtn.disabled        = false;
      flipBtn.onclick         = doFlip;
    }
  }, 1900);
}

// ── INTRO ───────────────────────────────────────────────────────────────

function initials(name) {
  return name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function renderIntro() {
  stopTimer();
  gameActive = false;
  document.getElementById('fact-list').innerHTML = teamMembers.map((m, i) => `
    <div class="fact-card" style="animation-delay:${i * 0.06}s">
      <div class="avatar" style="background:${AVATAR_COLORS[i % AVATAR_COLORS.length]}">${initials(m.name)}</div>
      <div class="fact-info">
        <span class="fact-name">${m.name}</span>
        <span class="fact-text">${m.funFact}</span>
      </div>
    </div>
  `).join('');
  showScreen('intro-screen');
}

// ── GAME ────────────────────────────────────────────────────────────────

function startGame() {
  levelIndex = 0;
  score      = 0;
  gameActive = true;
  levels     = buildLevels(5);

  document.getElementById('score-total').textContent = levels.length;
  showScreen('game-screen');
  startTimer();
  renderLevel();
}

function buildLevels(count) {
  if (teamMembers.length >= count) {
    return shuffle(teamMembers).slice(0, count);
  }
  // Allow repeats when dataset is smaller than level count
  const result = [];
  while (result.length < count) {
    shuffle(teamMembers).forEach(m => { if (result.length < count) result.push(m); });
  }
  return result;
}

function renderLevel() {
  const member       = levels[levelIndex];
  const nameAsPrompt = Math.random() < 0.5;
  const others       = teamMembers.filter(m => m.name !== member.name);
  const wrongCount   = Math.min(answerPoolSize - 1, others.length);

  document.getElementById('level-num').textContent = levelIndex + 1;
  document.getElementById('score-num').textContent = score;
  document.getElementById('progress-fill').style.width =
    `${(levelIndex / levels.length) * 100}%`;

  let promptLabel, promptText, answers;

  if (nameAsPrompt) {
    promptLabel   = 'Which fun fact belongs to...';
    promptText    = member.name;
    correctAnswer = member.funFact;
    answers = shuffle([
      correctAnswer,
      ...shuffle(others).slice(0, wrongCount).map(m => m.funFact)
    ]);
  } else {
    promptLabel   = 'Who does this fun fact belong to?';
    promptText    = '"' + member.funFact + '"';
    correctAnswer = member.name;
    answers = shuffle([
      correctAnswer,
      ...shuffle(others).slice(0, wrongCount).map(m => m.name)
    ]);
  }

  document.getElementById('prompt-label').textContent = promptLabel;
  document.getElementById('prompt-text').textContent  = promptText;
  animateIn(document.getElementById('prompt-card'));

  document.getElementById('answers').innerHTML =
    answers.map(a => `<button class="btn btn-answer" style="opacity:0">${a}</button>`).join('');

  document.querySelectorAll('.btn-answer').forEach((btn, i) => {
    btn.onclick = () => handleAnswer(btn);
    animateIn(btn, 0.05 + i * 0.07);
  });
}

function handleAnswer(clicked) {
  if (!gameActive) return;

  const btns      = document.querySelectorAll('.btn-answer');
  const isCorrect = clicked.textContent === correctAnswer;

  btns.forEach(b => b.disabled = true);

  if (isCorrect) {
    clicked.classList.add('correct');
    score++;
    document.getElementById('score-num').textContent = score;
  } else {
    clicked.classList.add('wrong');
    btns.forEach(b => { if (b.textContent === correctAnswer) b.classList.add('correct'); });
  }

  setTimeout(() => {
    if (!gameActive) return;
    levelIndex++;
    if (levelIndex >= levels.length) {
      showResult('normal');
    } else {
      renderLevel();
    }
  }, 1300);
}

// ── RESULT ──────────────────────────────────────────────────────────────

function showResult(reason) {
  gameActive = false;
  stopTimer();
  clearConfetti();
  showScreen('result-screen');

  const isWin = reason !== 'timeout' && score === levels.length;

  document.getElementById('win-view').classList.toggle('hidden', !isWin);
  document.getElementById('lose-view').classList.toggle('hidden', isWin);

  if (isWin) {
    launchConfetti();

    const nextPool    = answerPoolSize + 2;
    const canGoHarder = nextPool <= teamMembers.length;

    document.getElementById('win-difficulty-msg').textContent =
      `You aced ${answerPoolSize}-choice difficulty!`;

    const harderBtn  = document.getElementById('harder-btn');
    const masteredEl = document.getElementById('mastered-msg');

    if (canGoHarder) {
      harderBtn.textContent = `🔥 PLAY HARDER (${nextPool} choices)`;
      harderBtn.classList.remove('hidden');
      masteredEl.classList.add('hidden');
    } else {
      harderBtn.classList.add('hidden');
      masteredEl.textContent = '🎓 You\'ve conquered every difficulty level!';
      masteredEl.classList.remove('hidden');
    }
  } else {
    const msg = reason === 'timeout'
      ? `⏰ Time's up! You scored ${score} out of ${levels.length}.`
      : `You scored ${score} out of ${levels.length}. Study up and try again!`;
    document.getElementById('final-score-text').textContent = msg;
  }
}

// ── TIMER ───────────────────────────────────────────────────────────────

function startTimer() {
  stopTimer();
  timerStart = performance.now();
  timerRAF   = requestAnimationFrame(tickTimer);
}

function stopTimer() {
  if (timerRAF) {
    cancelAnimationFrame(timerRAF);
    timerRAF = null;
  }
}

function tickTimer() {
  const elapsed  = performance.now() - timerStart;
  const pct      = Math.max(0, 1 - elapsed / TIMER_DURATION);
  const secsLeft = Math.ceil(pct * 60);

  const fill      = document.getElementById('timer-fill');
  const timerText = document.getElementById('timer-text');

  fill.style.width  = `${pct * 100}%`;
  timerText.textContent = `${Math.floor(secsLeft / 60)}:${String(secsLeft % 60).padStart(2, '0')}`;

  if (pct > 0.33) {
    fill.style.background = '#59B3A9';
    timerText.className   = 'timer-text';
  } else if (pct > 0.15) {
    fill.style.background = '#009AB4';
    timerText.className   = 'timer-text';
  } else {
    fill.style.background = '#FFE781';
    timerText.className   = 'timer-text urgent';
  }

  if (elapsed >= TIMER_DURATION) {
    fill.style.width = '0%';
    timeUp();
    return;
  }

  timerRAF = requestAnimationFrame(tickTimer);
}

function timeUp() {
  document.querySelectorAll('.btn-answer').forEach(b => b.disabled = true);
  showResult('timeout');
}

// ── CONFETTI ─────────────────────────────────────────────────────────────

function launchConfetti() {
  const container = document.getElementById('confetti-container');
  for (let i = 0; i < 70; i++) {
    const el   = document.createElement('div');
    const size = 6 + Math.random() * 8;
    el.className = 'confetti-piece';
    el.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${Math.random() > 0.5 ? size : size * 0.5}px;
      height: ${Math.random() > 0.5 ? size * 0.5 : size}px;
      background: ${CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]};
      animation-delay: ${Math.random() * 0.8}s;
      animation-duration: ${1.8 + Math.random() * 1.5}s;
      --drift: ${(Math.random() - 0.5) * 220}px;
      --spin: ${Math.random() * 720 - 360}deg;
    `;
    container.appendChild(el);
  }
  setTimeout(clearConfetti, 4500);
}

function clearConfetti() {
  document.getElementById('confetti-container').innerHTML = '';
}

// ── HELPERS ───────────────────────────────────────────────────────────────

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function animateIn(el, delaySec = 0) {
  el.style.animation = 'none';
  el.style.opacity   = '0';
  void el.offsetWidth;
  el.style.animation = `slide-up 0.3s ease ${delaySec}s forwards`;
}

init();
