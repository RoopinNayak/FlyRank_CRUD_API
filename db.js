require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      done BOOLEAN NOT NULL DEFAULT FALSE
    );
  `);

  const res = await pool.query('SELECT COUNT(*) FROM tasks;');
  const count = parseInt(res.rows[0].count, 10);

  if (count === 0) {
    await pool.query(`
      INSERT INTO tasks (title, done) VALUES
        ('Set up project', true),
        ('Create API routes', false),
        ('Write documentation', false);
    `);
    console.log('Seeded 3 example tasks into PostgreSQL.');
  }
}

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  initDb,
};
