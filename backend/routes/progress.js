const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const router = express.Router();

const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No autorizado' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
};

router.post('/save', authenticate, (req, res) => {
  const { game, score, level } = req.body;
  db.run(
    'INSERT INTO progress (user_id, game, score, level) VALUES (?, ?, ?, ?)',
    [req.user.id, game, score, level],
    (err) => {
      if (err) return res.status(500).json({ error: 'Error al guardar progreso' });
      res.json({ message: 'Progreso guardado' });
    }
  );
});

router.get('/get', authenticate, (req, res) => {
  db.all('SELECT * FROM progress WHERE user_id = ?', [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al obtener progreso' });
    res.json(rows);
  });
});

module.exports = router;