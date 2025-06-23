let score = 0;
let level = 1;
let correctAnswer = 0;

function generatePattern() {
  let pattern;
  if (level <= 3) {
    pattern = [1, 2, 3, 4, 5];
    correctAnswer = 6;
  } else if (level <= 6) {
    pattern = [2, 4, 6, 8];
    correctAnswer = 10;
  } else {
    pattern = [1, 3, 6, 10];
    correctAnswer = 15;
  }
  const answers = [correctAnswer, correctAnswer + 2, correctAnswer - 2];
  shuffle(answers);
  document.getElementById('task').textContent = `Completa el patrón: ${pattern.join(', ')}, ?`;
  document.getElementById('pattern1').setAttribute('data-value', answers[0]);
  document.getElementById('text1').setAttribute('value', answers[0]);
  document.getElementById('pattern2').setAttribute('data-value', answers[1]);
  document.getElementById('text2').setAttribute('value', answers[1]);
  document.getElementById('pattern3').setAttribute('data-value', answers[2]);
  document.getElementById('text3').setAttribute('value', answers[2]);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function checkPattern(value) {
  if (value === correctAnswer) {
    score += 10 * level;
    document.getElementById('score').textContent = `Puntuación: ${score}`;
    document.getElementById('task').textContent = '¡Correcto! Siguiente patrón...';
    level++;
    document.getElementById('level').textContent = `Nivel: ${level}`;
    saveProgress('pattern-treasure', score, level);
    setTimeout(generatePattern, 2000);
  } else {
    document.getElementById('task').textContent = '¡Intenta de nuevo!';
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
    console.error('Error al guardar progreso');
  }
}

document.addEventListener('DOMContentLoaded', generatePattern);
document.getElementById('pattern1').addEventListener('click', () => checkPattern(Number(document.getElementById('pattern1').getAttribute('data-value'))));
document.getElementById('pattern2').addEventListener('click', () => checkPattern(Number(document.getElementById('pattern2').getAttribute('data-value'))));
document.getElementById('pattern3').addEventListener('click', () => checkPattern(Number(document.getElementById('pattern3').getAttribute('data-value'))));