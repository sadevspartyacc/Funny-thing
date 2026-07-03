const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const db = new Database(path.join(__dirname, 'data.db'));

// create table if not exists
db.prepare(`
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// prepared statements
const insertPost = db.prepare('INSERT INTO posts (username, text) VALUES (?, ?)');
const getById = db.prepare('SELECT id, username, text, created_at FROM posts WHERE id = ?');
const recentStmt = db.prepare('SELECT id, username, text, created_at FROM posts ORDER BY created_at DESC LIMIT ?');
const searchStmt = db.prepare('SELECT id, username, text, created_at FROM posts WHERE username LIKE ? OR text LIKE ? ORDER BY created_at DESC LIMIT ?');

// create post
app.post('/api/posts', (req, res) => {
  const { username, text } = req.body;
  if (!username || !text) return res.status(400).json({ error: 'username and text are required' });
  const info = insertPost.run(username.trim(), text.trim());
  const post = getById.get(info.lastInsertRowid);
  res.json(post);
});

// search posts: /api/posts?q=term&limit=50
app.get('/api/posts', (req, res) => {
  const q = String(req.query.q || '').trim();
  const limit = Math.min(parseInt(req.query.limit, 10) || 100, 1000);
  const like = `%${q}%`;
  const rows = searchStmt.all(like, like, limit);
  res.json(rows);
});

// recent posts: /api/recent?limit=50
app.get('/api/recent', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 50, 1000);
  const rows = recentStmt.all(limit);
  res.json(rows);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`textcloud listening on http://localhost:${PORT}`));
