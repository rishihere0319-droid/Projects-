const express = require('express');
const cors = require('cors');
let db = null;
try {
  db = require('./db');
} catch (e) {
  console.log('MySQL driver not loaded, running in mock fallback mode');
}

const app = express();
app.use(cors());
app.use(express.json());

// In-memory fallback stores
const memoryUsers = [];
const memoryAppointments = [];
const memoryVitals = [];
const memoryFeedbacks = [];

// 1. AUTH / LOGIN API
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  if (db && db.query) {
    try {
      const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      if (existing.length === 0) {
        await db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, password]);
      }
      return res.json({ success: true, email });
    } catch (err) {
      console.warn('DB query failed, using in-memory store:', err.message);
    }
  }

  // Fallback
  let user = memoryUsers.find(u => u.email === email);
  if (!user) {
    user = { email, password };
    memoryUsers.push(user);
  }
  return res.json({ success: true, email: user.email });
});

// 2. APPOINTMENTS API
app.get('/api/appointments', async (req, res) => {
  const { email, role } = req.query;
  if (db && db.query) {
    try {
      let query = 'SELECT * FROM appointments';
      let params = [];
      if (role === 'doctor') {
        query += ' WHERE doctor_name = ?';
        params.push(email);
      } else if (email) {
        query += ' WHERE patient_email = ?';
        params.push(email);
      }
      const [rows] = await db.query(query, params);
      return res.json(rows);
    } catch (err) {
      console.warn('DB query failed, using in-memory appointments:', err.message);
    }
  }
  return res.json(memoryAppointments);
});

app.post('/api/appointments', async (req, res) => {
  const { patientEmail, doctorName, specialty, date, time } = req.body;
  if (db && db.query) {
    try {
      await db.query(
        'INSERT INTO appointments (patient_email, doctor_name, specialty, appointment_date, appointment_time) VALUES (?, ?, ?, ?, ?)',
        [patientEmail, doctorName, specialty, date, time]
      );
      return res.json({ success: true });
    } catch (err) {
      console.warn('DB query failed, storing in memory:', err.message);
    }
  }
  memoryAppointments.push({ id: Date.now(), patient_email: patientEmail, doctor_name: doctorName, specialty, appointment_date: date, appointment_time: time });
  return res.json({ success: true });
});

// 3. VITALS API
app.get('/api/vitals', async (req, res) => {
  const { patientEmail } = req.query;
  if (db && db.query) {
    try {
      const [rows] = await db.query('SELECT * FROM patient_vitals WHERE patient_email = ? ORDER BY recorded_at DESC', [patientEmail]);
      return res.json(rows);
    } catch (err) {
      console.warn('DB query failed, using in-memory vitals:', err.message);
    }
  }
  const filtered = memoryVitals.filter(v => !patientEmail || v.patient_email === patientEmail);
  return res.json(filtered);
});

app.post('/api/vitals', async (req, res) => {
  const { patientEmail, bp, pulse, spo2, weight } = req.body;
  if (db && db.query) {
    try {
      await db.query(
        'INSERT INTO patient_vitals (patient_email, bp, pulse, spo2, weight) VALUES (?, ?, ?, ?, ?)',
        [patientEmail, bp, pulse, spo2, weight]
      );
      return res.json({ success: true });
    } catch (err) {
      console.warn('DB query failed, storing in memory:', err.message);
    }
  }
  memoryVitals.push({ id: Date.now(), patient_email: patientEmail, bp, pulse, spo2, weight, recorded_at: new Date() });
  return res.json({ success: true });
});

// 4. FEEDBACK API
app.post('/api/feedback', async (req, res) => {
  const { patientEmail, rating, notes } = req.body;
  if (db && db.query) {
    try {
      await db.query(
        'INSERT INTO feedbacks (patient_email, rating, notes) VALUES (?, ?, ?)',
        [patientEmail, rating, notes]
      );
      return res.json({ success: true });
    } catch (err) {
      console.warn('DB query failed, storing in memory:', err.message);
    }
  }
  memoryFeedbacks.push({ id: Date.now(), patient_email: patientEmail, rating, notes });
  return res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});