let score = 0;
let level = 1;
let correctAnswer = 0;

function generateMeasurement() {
  let value, unit, question;
  if (level <= 3) {
    value = Math.floor(Math.random() * 10) + 1;
    unit = 'cm';
    question = `¿Cuál objeto mide ${value} ${unit}?`;
    correctAnswer = value;
  } else if (level <= 6) {
    value = Math.floor(Math.random() * 100) + 10;
    unit = 'cm';
    question = `¿Cuál objeto mide ${value} ${unit}?`;
    correctAnswer = value;
  } else {
    value = Math.floor(Math.random() * 10) + 1;
    unit = 'kg';
    question = `¿Cuál objeto pesa ${value} ${unit}?`;
    correctAnswer = value;
  }
  const answers = [correctAnswer, correctAnswer + (unit === 'cm' ? 5 : 1), correctAnswer - (unit === 'cm' ? 5 : 1)];
  shuffle(answers);
  document.getElementById('task').textContent = question;
  document.getElementById('measure1').setAttribute('data-value', answers[0]);
  document.getElementById('text1').setAttribute('value', `${answers[0]} ${unit}`);
  document.getElementById('measure2').setAttribute('data-value', answers[1]);
  document.getElementById('text2').setAttribute('value', `${answers[1]} ${unit}`);
  document.getElementById('measure3').setAttribute('data-value', answers[2]);
  document.getElementById('text3').setAttribute('value', `${answers[2]} ${unit}`);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function checkMeasurement(value) {
  if (value === correctAnswer) {
    score += 10 * level;
    document.getElementById('score').textContent = `Puntuación: ${score}`;
    document.getElementById('task').textContent = '¡Correcto! Siguiente medida...';
    level++;
    document.getElementById('level').textContent = `Nivel: ${level}`;
    saveProgress('measurement-adventure', score, level);
    setTimeout(generateMeasurement, 2000);
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

document.addEventListener('DOMContentLoaded', generateMeasurement);
document.getElementById('measure1').addEventListener('click', () => checkMeasurement(Number(document.getElementById('measure1').getAttribute('data-value'))));
document.getElementById('measure2').addEventListener('click', () => checkMeasurement(Number(document.getElementById('measure2').getAttribute('data-value'))));
document.getElementById('measure3').addEventListener('click', () => checkMeasurement(Number(document.getElementById('measure3').getAttribute('data-value'))));