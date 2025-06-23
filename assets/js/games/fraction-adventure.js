let score = 0;
let level = 1;
let divisions = 0;
let targetDivisions = 2;
let objectType = 'pizza';

function generateLevel() {
  targetDivisions = level <= 3 ? 2 : level <= 6 ? 3 : 4;
  objectType = level <= 3 ? 'pizza' : level <= 6 ? 'pastel' : 'chocolate';
  document.getElementById('task').textContent = `Divide el ${objectType} en ${targetDivisions} partes iguales`;
  document.getElementById('object-text').setAttribute('value', objectType.charAt(0).toUpperCase() + objectType.slice(1));
  divisions = 0;
  const slices = document.querySelectorAll('a-cone');
  slices.forEach(slice => slice.remove());
}

function divideObject() {
  divisions++;
  const object = document.getElementById('object');
  if (divisions <= targetDivisions) {
    const angle = (360 / targetDivisions) * divisions;
    const slice = document.createElement('a-cone');
    slice.setAttribute('position', '0 1 -5');
    slice.setAttribute('radius-bottom', '1');
    slice.setAttribute('radius-top', '0');
    slice.setAttribute('height', '0.1');
    slice.setAttribute('color', '#FF6347');
    slice.setAttribute('rotation', `0 ${angle} 0`);
    document.querySelector('a-scene').appendChild(slice);
  }
  if (divisions === targetDivisions) {
    score += 15 * level;
    document.getElementById('score').textContent = `Puntuación: ${score}`;
    document.getElementById('task').textContent = '¡Bien hecho! Siguiente desafío...';
    level++;
    document.getElementById('level').textContent = `Nivel: ${level}`;
    saveProgress('fraction-adventure', score, level);
    setTimeout(generateLevel, 2000);
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

document.getElementById('object').addEventListener('click', divideObject);
document.addEventListener('DOMContentLoaded', generateLevel);