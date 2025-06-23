let score = 0;
let level = 1;
let correctAnswer = 0;
const operations = ['+', '-', '*'];

function generateProblem() {
  const op = operations[Math.floor(Math.random() * (level > 5 ? 3 : 2))];
  let a, b;

  if (level <= 3) {
    a = Math.floor(Math.random() * 10) + 1;
    b = Math.floor(Math.random() * 10) + 1;
  } else if (level <= 6) {
    a = Math.floor(Math.random() * 20) + 10;
    b = Math.floor(Math.random() * 10) + 1;
  } else {
    a = Math.floor(Math.random() * 50) + 10;
    b = Math.floor(Math.random() * 10) + 1;
  }

  if (op === '-') b = Math.min(b, a);

  correctAnswer = op === '+' ? a + b : op === '-' ? a - b : a * b;
  const answers = [
    correctAnswer,
    correctAnswer + Math.floor(Math.random() * 5) + 1,
    correctAnswer - Math.floor(Math.random() * 5) - 1
  ];

  shuffle(answers);

  const problemEl = document.getElementById('problem');
  const scoreEl = document.getElementById('score');
  const levelEl = document.getElementById('level');

  if (problemEl) problemEl.textContent = `Resuelve: ${a} ${op} ${b} = ?`;

  ['1', '2', '3'].forEach((num, i) => {
    const ansEl = document.getElementById(`answer${num}`);
    const txtEl = document.getElementById(`text${num}`);
    if (ansEl) ansEl.setAttribute('data-value', answers[i]);
    if (txtEl) txtEl.setAttribute('value', answers[i]);
  });
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function checkAnswer(value) {
  const scoreEl = document.getElementById('score');
  const levelEl = document.getElementById('level');
  const problemEl = document.getElementById('problem');

  if (value === correctAnswer) {
    score += 10 * level;
    if (scoreEl) scoreEl.textContent = `Puntuación: ${score}`;
    if (problemEl) problemEl.textContent = '¡Correcto! Siguiente problema...';

    if (score >= level * 50) {
      level++;
      if (levelEl) levelEl.textContent = `Nivel: ${level}`;
      saveProgress('number-hunt', score, level);
    }

    setTimeout(generateProblem, 2000);
  } else {
    if (problemEl) problemEl.textContent = '¡Intenta de nuevo!';
  }
}

async function saveProgress(game, score, level) {
  const token = localStorage.getItem('token');
  try {
    await fetch('http://localhost:5000/api/progress/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ game, score, level })
    });
  } catch (err) {
    console.error('Error al guardar progreso:', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  generateProblem();

  // Vincula eventos a las esferas
  ['1', '2', '3'].forEach(num => {
    const sphere = document.getElementById(`answer${num}`);
    if (sphere) {
      sphere.addEventListener('click', () => {
        const value = parseInt(sphere.getAttribute('data-value'));
        checkAnswer(value);
      });
    }
  });
});
