const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./app.db', (err) => {
  if (err) console.error('Error opening database:', err.message);
  else console.log('Connected to SQLite database.');
});

// Create Users Table & Seed Default User
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);

  // Insert test user: username = "admin", password = "password123"
  const defaultUser = 'admin';
  const defaultPass = 'password123';

  db.get(`SELECT * FROM users WHERE username = ?`, [defaultUser], (err, row) => {
    if (!row) {
      const hashedPassword = bcrypt.hashSync(defaultPass, 10);
      db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [defaultUser, hashedPassword]);
      console.log('Seeded default user -> Username: admin | Password: password123');
    }
  });
});

module.exports = db;