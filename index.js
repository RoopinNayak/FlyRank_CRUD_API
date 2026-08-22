const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');
const db = require('./db');

const app = express();
const PORT = 3000;

// Initialize PostgreSQL table and seed data on startup
db.initDb().catch((err) => console.error('Database initialization error:', err));

// --- Middleware ---
app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- Routes ---
app.get('/', (req, res) => {
  res.status(200).json({ name: 'Task API', version: '1.0', endpoints: ['/tasks'] });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// --- Read endpoints (PostgreSQL-backed) ---
app.get('/tasks', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM tasks ORDER BY id ASC;');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/tasks/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(404).json({ error: 'Task not found' });
    }
    const result = await db.query('SELECT * FROM tasks WHERE id = $1;', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching task by ID:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Create endpoint (SQLite-backed) ---
app.post('/tasks', (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Title is required and cannot be empty' });
  }
  const result = db.prepare('INSERT INTO tasks (title, done) VALUES (?, 0)').run(title.trim());
  // Fetch the newly inserted row using the auto-generated id
  const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(formatTask(row));
});

// --- Update endpoint (SQLite-backed) ---
app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!row) {
    return res.status(404).json({ error: 'Task not found' });
  }
  const { title, done } = req.body;
  if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
    return res.status(400).json({ error: 'Title cannot be empty' });
  }
  if (done !== undefined && typeof done !== 'boolean') {
    return res.status(400).json({ error: 'Done must be a boolean' });
  }
  const updatedTitle = title !== undefined ? title.trim() : row.title;
  const updatedDone = done !== undefined ? (done ? 1 : 0) : row.done;
  // Run parameterized UPDATE query
  db.prepare('UPDATE tasks SET title = ?, done = ? WHERE id = ?').run(updatedTitle, updatedDone, id);
  // Re-fetch the updated row to return the confirmed state
  const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  res.status(200).json(formatTask(updated));
});

// --- Delete endpoint (SQLite-backed) ---
app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!row) {
    return res.status(404).json({ error: 'Task not found' });
  }
  // Run parameterized DELETE query
  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
