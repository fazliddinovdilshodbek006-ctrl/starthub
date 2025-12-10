const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());

// --- Ma'lumotlar bazasi ulanish sozlamalari (Parolsiz) ---
const pool = new Pool({
  user: 'postgres', // Standart PostgreSQL foydalanuvchi nomi
  host: 'localhost',
  database: 'startup_db', // Siz yaratgan ma'lumotlar bazasi nomi
  // password: 'sizning_parolingiz', // Parol talab qilinmaydi deb hisoblaymiz
  port: 5432,
});

// Test ulanish
pool.connect((err) => {
  if (err) {
    console.error('Database connection error', err.stack);
  } else {
    console.log('Connected to the database');
  }
});

// --- API Route: Barcha loyihalarni olish ---
app.get('/api/projects', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY views_count DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server xatosi');
  }
});

app.listen(port, () => {
  console.log(`Backend server http://localhost:${port} manzilida ishga tushdi`);
});
