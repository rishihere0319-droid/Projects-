const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Auto-create vitals table
(async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS patient_vitals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        patient_email VARCHAR(255) NOT NULL,
        bp VARCHAR(20),
        pulse VARCHAR(20),
        spo2 VARCHAR(20),
        weight VARCHAR(20),
        recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (err) {
    console.error('Table init error:', err.message);
  }
})();

// 1. AUTH / LOGIN API
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length === 0) {
      await db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, password]);
    }
    res.json({ success: true, email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. APPOINTMENTS API
app.get('/api/appointments', async (req, res) => {
  const { email, role } = req.query;
  try {
    let query = 'SELECT * FROM appointments ORDER BY id DESC';
    let params = [];
    if (role !== 'doctor' && email) {
      query = 'SELECT * FROM appointments WHERE patient_email = ? ORDER BY id DESC';
      params = [email];
    }
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/appointments', async (req, res) => {
  const { patientEmail, doctor, specialty, date, time } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO appointments (patient_email, doctor_name, specialty, appointment_date, appointment_time) VALUES (?, ?, ?, ?, ?)',
      [patientEmail, doctor, specialty, date, time]
    );
    res.json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel appointment
app.delete('/api/appointments/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM appointments WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. PRESCRIPTIONS API
app.get('/api/prescriptions', async (req, res) => {
  const { email, role } = req.query;
  try {
    let query = 'SELECT * FROM prescriptions ORDER BY id DESC';
    let params = [];
    if (role !== 'doctor' && email) {
      query = 'SELECT * FROM prescriptions WHERE patient_email = ? ORDER BY id DESC';
      params = [email];
    }
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/prescriptions', async (req, res) => {
  const { patientEmail, doctor, specialty, meds, date } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO prescriptions (patient_email, doctor_name, specialty, medications, prescribed_date) VALUES (?, ?, ?, ?, ?)',
      [patientEmail, doctor, specialty, meds, date]
    );
    res.json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. VITALS API
app.get('/api/vitals', async (req, res) => {
  const { email } = req.query;
  try {
    const [rows] = await db.query('SELECT * FROM patient_vitals WHERE patient_email = ? ORDER BY id DESC LIMIT 1', [email]);
    res.json(rows[0] || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/vitals', async (req, res) => {
  const { patientEmail, bp, pulse, spo2, weight } = req.body;
  try {
    await db.query(
      'INSERT INTO patient_vitals (patient_email, bp, pulse, spo2, weight) VALUES (?, ?, ?, ?, ?)',
      [patientEmail, bp, pulse, spo2, weight]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. FEEDBACK API
app.post('/api/feedback', async (req, res) => {
  const { patientEmail, rating, notes } = req.body;
  try {
    await db.query(
      'INSERT INTO feedbacks (patient_email, rating, notes) VALUES (?, ?, ?)',
      [patientEmail, rating, notes]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});