const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const tasks = [
  { id: 1, title: 'Set up project', done: true },
  { id: 2, title: 'Create API routes', done: false },
  { id: 3, title: 'Write documentation', done: false },
];

app.get('/', (req, res) => {
  res.status(200).json({ name: 'Task API', version: '1.0', endpoints: ['/tasks'] });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

app.get('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }
  res.status(200).json(task);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
