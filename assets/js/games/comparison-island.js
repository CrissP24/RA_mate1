let score = 0;
let level = 1;
let correctAnswer = '';

function generateComparison() {
  let a, b, correct;
  if (level <= 3) {
    a = Math.floor(Math.random() * 20) + 1;
    b = Math.floor(Math.random() * 20) + 1;
    correct = a > b ? '>' : a < b ? '<' : '=';
  } else {
    a = `${Math.floor(Math.random() * 3) + 1}/${Math.floor(Math.random() * 4) + 2}`;
    b = `${Math.floor(Math.random() * 3) + 1}/${Math.floor(Math.random() * 4) + 2}`;
    const [numA, denA] = a.split('/').map(Number);
    const [numB, denB] = b.split('/').map(Number);
    correct = (numA / denA) > (numB / denB) ? '>' : (numA / denA) < (numB / denB) ? '<' : '=';
  }
  correctAnswer = correct;
  const answers = ['>', '<', '='];
  shuffle(answers);
  document.getElementById('task').textContent = `Compara: ${a} ? ${b}`;
  document.getElementById('comp1').setAttribute('data-value', answers[0]);
  document.getElementById('text1').setAttribute('value', answers[0]);
  document.getElementById('comp2').setAttribute('data-value', answers[1]);
  document.getElementById('text2').setAttribute('value', answers[1]);
  document.getElementById('comp3').setAttribute('data-value', answers[2]);
  document.getElementById('text3').setAttribute('value', answers[2]);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function checkComparison(value) {
  if (value === correctAnswer) {
    score += 10 * level;
    document.getElementById('score').textContent = `Puntuación: ${score}`;
    document.getElementById('task').textContent = '¡Correcto! Siguiente comparación...';
    level++;
    document.getElementById('level').textContent = `Nivel: ${level}`;
    saveProgress('comparison-island', score, level);
    setTimeout(generateComparison, 2000);
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

document.addEventListener('DOMContentLoaded', generateComparison);
document.getElementById('comp1').addEventListener('click', () => checkComparison(document.getElementById('comp1').getAttribute('data-value')));
document.getElementById('comp2').addEventListener('click', () => checkComparison(document.getElementById('comp2').getAttribute('data-value')));
document.getElementById('comp3').addEventListener('click', () => checkComparison(document.getElementById('comp3').getAttribute('data-value')));