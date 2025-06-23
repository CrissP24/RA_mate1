let score = 0;
let level = 1;
let correctAnswer = 0;

function generateSubtraction() {
  let a, b;
  if (level <= 3) {
    a = Math.floor(Math.random() * 20) + 1;
    b = Math.floor(Math.random() * a) + 1;
  } else if (level <= 6) {
    a = Math.floor(Math.random() * 50) + 10;
    b = Math.floor(Math.random() * a) + 1;
  } else {
    a = Math.floor(Math.random() * 100) + 10;
    b = Math.floor(Math.random() * a) + 1;
  }
  correctAnswer = a - b;
  const answers = [correctAnswer, correctAnswer + 5, correctAnswer - 5];
  shuffle(answers);
  document.getElementById('task').textContent = `Resuelve: ${a} - ${b} = ?`;
  document.getElementById('sub1').setAttribute('data-value', answers[0]);
  document.getElementById('text1').setAttribute('value', answers[0]);
  document.getElementById('sub2').setAttribute('data-value', answers[1]);
  document.getElementById('text2').setAttribute('value', answers[1]);
  document.getElementById('sub3').setAttribute('data-value', answers[2]);
  document.getElementById('text3').setAttribute('value', answers[2]);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function checkSubtraction(value) {
  if (value === correctAnswer) {
    score += 10 * level;
    document.getElementById('score').textContent = `Puntuación: ${score}`;
    document.getElementById('task').textContent = '¡Correcto! Siguiente resta...';
    level++;
    document.getElementById('level').textContent = `Nivel: ${level}`;
    saveProgress('subtraction-hunt', score, level);
    setTimeout(generateSubtraction, 2000);
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

document.addEventListener('DOMContentLoaded', generateSubtraction);
document.getElementById('sub1').addEventListener('click', () => checkSubtraction(Number(document.getElementById('sub1').getAttribute('data-value'))));
document.getElementById('sub2').addEventListener('click', () => checkSubtraction(Number(document.getElementById('sub2').getAttribute('data-value'))));
document.getElementById('sub3').addEventListener('click', () => checkSubtraction(Number(document.getElementById('sub3').getAttribute('data-value'))));