let score = 0;
let level = 1;
let correctTime = '';

function generateTimeChallenge() {
  let hours, minutes;
  if (level <= 3) {
    hours = Math.floor(Math.random() * 12) + 1;
    minutes = 0;
  } else if (level <= 6) {
    hours = Math.floor(Math.random() * 12) + 1;
    minutes = [15, 30, 45][Math.floor(Math.random() * 3)];
  } else {
    hours = Math.floor(Math.random() * 12) + 1;
    minutes = Math.floor(Math.random() * 60);
  }
  correctTime = `${hours}:${minutes.toString().padStart(2, '0')}`;
  const times = [
    correctTime,
    `${(hours % 12 + 1)}:${(minutes + 15) % 60}`.padStart(2, '0'),
    `${(hours % 12 + 2)}:${(minutes + 30) % 60}`.padStart(2, '0')
  ];
  shuffle(times);
  document.getElementById('task').textContent = `Ajusta el reloj a las ${correctTime}`;
  document.getElementById('time1').setAttribute('data-value', times[0]);
  document.getElementById('text1').setAttribute('value', times[0]);
  document.getElementById('time2').setAttribute('data-value', times[1]);
  document.getElementById('text2').setAttribute('value', times[1]);
  document.getElementById('time3').setAttribute('data-value', times[2]);
  document.getElementById('text3').setAttribute('value', times[2]);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function checkTime(value) {
  if (value === correctTime) {
    score += 10 * level;
    document.getElementById('score').textContent = `Puntuación: ${score}`;
    document.getElementById('task').textContent = '¡Correcto! Siguiente hora...';
    level++;
    document.getElementById('level').textContent = `Nivel: ${level}`;
    saveProgress('time-challenge', score, level);
    setTimeout(generateTimeChallenge, 2000);
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

document.addEventListener('DOMContentLoaded', generateTimeChallenge);
document.getElementById('time1').addEventListener('click', () => checkTime(document.getElementById('time1').getAttribute('data-value')));
document.getElementById('time2').addEventListener('click', () => checkTime(document.getElementById('time2').getAttribute('data-value')));
document.getElementById('time3').addEventListener('click', () => checkTime(document.getElementById('time3').getAttribute('data-value')));