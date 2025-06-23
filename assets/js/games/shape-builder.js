let score = 0;
let level = 1;
let placedShapes = 0;
let targetShape = 'square';

function generateLevel() {
  const shapes = level <= 3 ? ['square', 'square'] : level <= 6 ? ['triangle', 'triangle'] : ['circle', 'circle'];
  targetShape = shapes[0];

  document.getElementById('task').textContent = `Arrastra las figuras para formar un ${targetShape === 'square' ? 'cuadrado' : targetShape === 'triangle' ? 'triángulo' : 'círculo'} grande`;

  const shape1 = document.getElementById('shape1');
  const shape2 = document.getElementById('shape2');

  // Posiciones iniciales visibles
  shape1.setAttribute('position', '-1 1 -3');
  shape2.setAttribute('position', '1 1 -3');

  if (shapes[0] === 'square') {
    shape1.setAttribute('geometry', 'primitive: box; width: 1; height: 1; depth: 0.1');
    shape2.setAttribute('geometry', 'primitive: box; width: 1; height: 1; depth: 0.1');
  } else if (shapes[0] === 'triangle') {
    shape1.setAttribute('geometry', 'primitive: cone; radiusBottom: 0.5; radiusTop: 0; height: 1');
    shape2.setAttribute('geometry', 'primitive: cone; radiusBottom: 0.5; radiusTop: 0; height: 1');
  } else {
    shape1.setAttribute('geometry', 'primitive: circle; radius: 0.5');
    shape2.setAttribute('geometry', 'primitive: circle; radius: 0.5');
  }

  shape1.setAttribute('material', 'color: #FF6347');
  shape2.setAttribute('material', 'color: #4682B4');

  // Asegurarse de que tienen los componentes para agarrar
  shape1.setAttribute('grabbable', '');
  shape2.setAttribute('grabbable', '');

  // Añadir dynamic-body para física y que funcionen los agarres
  shape1.setAttribute('dynamic-body', '');
  shape2.setAttribute('dynamic-body', '');

  placedShapes = 0;

  document.getElementById('score').textContent = `Puntuación: ${score}`;
  document.getElementById('level').textContent = `Nivel: ${level}`;
}

// Función para colocar la figura en el objetivo (llamar desde evento)
function placeShape(element) {
  const target = document.getElementById('target');
  const targetPos = target.getAttribute('position');

  element.setAttribute('position', {
    x: targetPos.x - 0.5 + (placedShapes % 2),
    y: targetPos.y + 0.2 + Math.floor(placedShapes / 2),
    z: targetPos.z + 0.1
  });

  // Detener movimiento para que no se caigan al soltar
  element.removeAttribute('dynamic-body');

  placedShapes++;

  if (placedShapes === 2) {
    score += 20 * level;
    document.getElementById('score').textContent = `Puntuación: ${score}`;
    document.getElementById('task').textContent = '¡Bien hecho! Siguiente desafío...';
    level++;
    document.getElementById('level').textContent = `Nivel: ${level}`;

    saveProgress('shape-builder', score, level);

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
    console.error('Error al guardar progreso', err);
  }
}

document.addEventListener('DOMContentLoaded', generateLevel);
// Detectar cuando se suelta una figura para colocarla
document.querySelectorAll('#shape1, #shape2').forEach(shape => {
    shape.addEventListener('drag-drop', (evt) => {
      const droppedEntity = evt.detail.dropped;
      if (!droppedEntity) return;
      const dropTarget = evt.detail.target;
  
      if (dropTarget && dropTarget.id === 'target') {
        placeShape(shape);
      }
    });
  });
  
