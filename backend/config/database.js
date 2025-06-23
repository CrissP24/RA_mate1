const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:'); // Para pruebas, usa memoria; en producción, usa un archivo

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      game TEXT,
      score INTEGER,
      level INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
});

module.exports = db;