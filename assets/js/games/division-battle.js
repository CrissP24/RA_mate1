let score = 0;
let level = 1;
let correctAnswer = 0;

function generateDivision() {
  let a, b;
  if (level <= 3) {
    b = Math.floor(Math.random() * 5) + 1;
    a = b * (Math.floor(Math.random() * 5) + 1);
  } else if (level <= 6) {
    b = Math.floor(Math.random() * 10) + 1;
    a = b * (Math.floor(Math.random() * 5) + 1);
  } else {
    b = Math.floor(Math.random() * 10) + 1;
    a = b * (Math.floor(Math.random() * 10) + 1);
  }
  correctAnswer = a / b;
  const answers = [correctAnswer, correctAnswer + 1, correctAnswer + 2];
  shuffle(answers);
  document.getElementById('task').textContent = `Resuelve: ${a} ÷ ${b} = ?`;
  document.getElementById('division1').setAttribute('data-value', answers[0]);
  document.getElementById('text1').setAttribute('value', answers[0]);
  document.getElementById('division2').setAttribute('data-value', answers[1]);
  document.getElementById('text2').setAttribute('value', answers[1]);
  document.getElementById('division3').setAttribute('data-value', answers[2]);
  document.getElementById('text3').setAttribute('value', answers[2]);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function checkDivision(value) {
  if (value === correctAnswer) {
    score += 10 * level;
    document.getElementById('score').textContent = `Puntuación: ${score}`;
    document.getElementById('task').textContent = '¡Correcto! Siguiente división...';
    level++;
    document.getElementById('level').textContent = `Nivel: ${level}`;
    saveProgress('division-battle', score, level);
    setTimeout(generateDivision, 2000);
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

document.addEventListener('DOMContentLoaded', generateDivision);
document.getElementById('division1').addEventListener('click', () => checkDivision(Number(document.getElementById('division1').getAttribute('data-value'))));
document.getElementById('division2').addEventListener('click', () => checkDivision(Number(document.getElementById('division2').getAttribute('data-value'))));
document.getElementById('division3').addEventListener('click', () => checkDivision(Number(document.getElementById('division3').getAttribute('data-value'))));