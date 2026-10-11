const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory instant stores
const memoryUsers = [];
const memoryAppointments = [];
const memoryVitals = [];
const memoryFeedbacks = [];
const memoryPrescriptions = [];

// 1. AUTH / LOGIN API (Instant 0-delay response)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  let user = memoryUsers.find(u => u.email === email);
  if (!user) {
    user = { email, password };
    memoryUsers.push(user);
  }
  return res.json({ success: true, email: user.email });
});

// 2. APPOINTMENTS API
app.get('/api/appointments', (req, res) => {
  const { email, role } = req.query;
  if (role === 'doctor') {
    return res.json(memoryAppointments.filter(a => a.doctor_name === email));
  } else if (email) {
    return res.json(memoryAppointments.filter(a => a.patient_email === email));
  }
  return res.json(memoryAppointments);
});

app.post('/api/appointments', (req, res) => {
  const { patientEmail, doctorName, specialty, date, time } = req.body;
  memoryAppointments.push({
    id: Date.now(),
    patient_email: patientEmail,
    doctor_name: doctorName,
    specialty,
    appointment_date: date,
    appointment_time: time
  });
  return res.json({ success: true });
});

// 3. VITALS API
app.get('/api/vitals', (req, res) => {
  const { patientEmail } = req.query;
  const filtered = memoryVitals.filter(v => !patientEmail || v.patient_email === patientEmail);
  return res.json(filtered);
});

app.post('/api/vitals', (req, res) => {
  const { patientEmail, bp, pulse, spo2, weight } = req.body;
  memoryVitals.push({
    id: Date.now(),
    patient_email: patientEmail,
    bp,
    pulse,
    spo2,
    weight,
    recorded_at: new Date()
  });
  return res.json({ success: true });
});

// GET FEEDBACK API
app.get('/api/feedback', (req, res) => {
  return res.json(memoryFeedbacks);
});
// 4. FEEDBACK API
app.post('/api/feedback', (req, res) => {
  const { patientEmail, rating, notes } = req.body;
  memoryFeedbacks.push({ id: Date.now(), patient_email: patientEmail, rating, notes });
  return res.json({ success: true });
});

// 5. PRESCRIPTION API
app.get('/api/prescriptions', (req, res) => {
  const { patientEmail } = req.query;
  const filtered = memoryPrescriptions.filter(p => !patientEmail || p.patient_email === patientEmail);
  return res.json(filtered);
});

app.post('/api/prescriptions', (req, res) => {
  const { patientEmail, doctorName, prescription, medicines, notes } = req.body;
  memoryPrescriptions.push({
    id: Date.now(),
    patient_email: patientEmail,
    doctor_name: doctorName,
    prescription: prescription || medicines,
    notes,
    created_at: new Date()
  });
  return res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running instantly on port ${PORT}`);
});