import React, { useState, useRef, useEffect } from 'react';
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate, 
  useNavigate 
} from 'react-router-dom';
import { 
  Calendar, 
  Activity, 
  Video, 
  CreditCard, 
  Star, 
  X, 
  Trash2, 
  Printer, 
  Search, 
  UserCog, 
  Stethoscope, 
  Clock, 
  Send, 
  Users, 
  PhoneCall 
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

interface Appointment {
  id?: number;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  patient_email?: string;
}

interface PrescriptionItem {
  id?: number;
  doctor: string;
  specialty: string;
  meds: string;
  date: string;
  patient_email?: string;
}

// ==========================================
// 1. AUTHENTICATION & LOGIN PAGE
// ==========================================
function LoginPage({ onLogin }: { onLogin: (email: string, role: 'patient' | 'doctor') => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMsg('');

    if (role === 'doctor') {
      const isDoctor = email.toLowerCase().startsWith('dr.') || email.toLowerCase().includes('@rishihealth.org');
      if (!isDoctor) {
        setErrorMsg('Access Denied: Doctor Console is restricted to verified clinicians (e.g. dr.rishi@rishihealth.org).');
        setIsProcessing(false);
        return;
      }
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onLogin(data.email, role);
        navigate('/dashboard');
      } else {
        setErrorMsg(data.error || 'Authentication failed');
      }
    } catch {
      setErrorMsg('Cannot reach backend server. Make sure port 5000 is running.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: role === 'doctor' ? '#0f172a' : '#e0f2fe',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      transition: 'background-color 0.3s ease'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
        border: role === 'doctor' ? '2px solid #059669' : '1px solid #bae6fd',
        padding: '36px',
        width: '100%',
        maxWidth: '420px',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            backgroundColor: role === 'doctor' ? '#059669' : '#0284c7',
            color: '#ffffff',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {role === 'doctor' ? <Stethoscope size={24} /> : <Activity size={24} />}
          </div>
          <div style={{ textAlign: 'left' }}>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
              RISHI HEALTH
            </h1>
            <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: role === 'doctor' ? '#059669' : '#0284c7', textTransform: 'uppercase' }}>
              {role === 'doctor' ? 'Clinical Gateway' : 'Patient Gateway'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '8px', padding: '4px', marginBottom: '20px' }}>
          <button
            type="button"
            onClick={() => setRole('patient')}
            style={{
              flex: 1,
              padding: '8px 0',
              fontSize: '12px',
              fontWeight: 700,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: role === 'patient' ? '#ffffff' : 'transparent',
              color: role === 'patient' ? '#0284c7' : '#64748b'
            }}
          >
            Patient Portal
          </button>
          <button
            type="button"
            onClick={() => setRole('doctor')}
            style={{
              flex: 1,
              padding: '8px 0',
              fontSize: '12px',
              fontWeight: 700,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: role === 'doctor' ? '#059669' : 'transparent',
              color: role === 'doctor' ? '#ffffff' : '#64748b'
            }}
          >
            Doctor Console
          </button>
        </div>

        {errorMsg && (
          <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', marginBottom: '14px', textAlign: 'left' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#475569', marginBottom: '6px' }}>
              {role === 'doctor' ? 'Clinician Email / ID' : 'Patient Email'}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={role === 'doctor' ? 'dr.rishi@rishihealth.org' : 'patient@gmail.com'}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#475569', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            style={{
              width: '100%',
              backgroundColor: role === 'doctor' ? '#059669' : '#0284c7',
              color: '#ffffff',
              fontWeight: 600,
              padding: '11px 0',
              borderRadius: '8px',
              fontSize: '13px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {isProcessing ? 'Authenticating...' : `Enter as ${role === 'doctor' ? 'Doctor' : 'Patient'}`}
          </button>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 2. MAIN DASHBOARD ROUTER & CONTROLLER
// ==========================================
function DashboardPage({ 
  userEmail, 
  userRole, 
  onLogout 
}: { 
  userEmail: string; 
  userRole: 'patient' | 'doctor'; 
  onLogout: () => void 
}) {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([]);
  const [printableRx, setPrintableRx] = useState<PrescriptionItem | null>(null);

  // Booking states
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('Dr. Rishi Pal (Cardiology)');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('10:00 AM');

  // Doctor custom prescription issue states
  const [prescTargetEmail, setPrescTargetEmail] = useState('');
  const [prescMeds, setPrescMeds] = useState('');

  // Doctor search
  const [searchQuery, setSearchQuery] = useState('');
  const [doctorsList] = useState([
    { id: 1, name: 'Dr. Rishi Pal', specialty: 'Cardiology Specialist', keywords: 'heart chest pain bp attack', status: 'Available', available: true, img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80' },
    { id: 2, name: 'Dr. Suresh Verma', specialty: 'General Physician', keywords: 'fever cough cold general head flu', status: 'Available', available: true, img: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80' },
    { id: 3, name: 'Dr. Priya Patel', specialty: 'Dermatologist', keywords: 'skin rash allergy acne itch', status: 'In Consultation', available: false, img: 'https://images.unsplash.com/photo-1594824813588-4467d5320c18?w=150&auto=format&fit=crop&q=80' },
    { id: 4, name: 'Dr. Ananya Sen', specialty: 'Pediatric Care', keywords: 'child baby pediatric stomach', status: 'Available', available: true, img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80' }
  ]);

  const filteredDoctors = doctorsList.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.keywords.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [activeConsultDoctor, setActiveConsultDoctor] = useState(doctorsList[0]);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Billing and feedback states
  const [amount, setAmount] = useState('499');
  const [showQRModal, setShowQRModal] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState('5 Stars - Excellent Clinical Care');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Sync appointments and prescriptions from MySQL
  useEffect(() => {
    const loadData = async () => {
      try {
        const aptRes = await fetch(`${API_BASE_URL}/appointments?email=${encodeURIComponent(userEmail)}&role=${userRole}`);
        if (aptRes.ok) {
          const data = await aptRes.json();
          setAppointments(data.map((item: any) => ({
            id: item.id,
            doctor: item.doctor_name,
            specialty: item.specialty,
            date: item.appointment_date,
            time: item.appointment_time,
            patient_email: item.patient_email
          })));
        }

        const rxRes = await fetch(`${API_BASE_URL}/prescriptions?email=${encodeURIComponent(userEmail)}&role=${userRole}`);
        if (rxRes.ok) {
          const data = await rxRes.json();
          setPrescriptions(data.map((item: any) => ({
            id: item.id,
            doctor: item.doctor_name,
            specialty: item.specialty,
            meds: item.medications,
            date: item.prescribed_date,
            patient_email: item.patient_email
          })));
        }
      } catch (err) {
        console.error('Database sync error:', err);
      }
    };

    loadData();
  }, [userEmail, userRole]);

  // Video media stream cleanup
  useEffect(() => {
    if (showVideoModal) {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
        .then(stream => {
          streamRef.current = stream;
          if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        })
        .catch(err => console.log('Camera error:', err));
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    }
  }, [showVideoModal]);

  // Book appointment
  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDate) return;
    const docName = selectedDoctor.split(' (')[0];
    const specialty = selectedDoctor.includes('(') ? selectedDoctor.split('(')[1].replace(')', '') : 'Specialist';

    try {
      const res = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientEmail: userEmail,
          doctor: docName,
          specialty,
          date: bookingDate,
          time: bookingTime
        })
      });

      if (res.ok) {
        const result = await res.json();
        setAppointments(prev => [{ id: result.id, doctor: docName, specialty, date: bookingDate, time: bookingTime, patient_email: userEmail }, ...prev]);
        setShowBookingModal(false);
        setBookingDate('');
      }
    } catch {
      alert('Failed to save appointment in database.');
    }
  };

  // Delete appointment
  const handleCancelAppointment = async (id?: number) => {
    if (!id) return;
    if (!window.confirm('Delete appointment from database?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/appointments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAppointments(prev => prev.filter(a => a.id !== id));
      }
    } catch {
      alert('Could not cancel appointment.');
    }
  };

  // Terminate call and auto-generate prescription
  const endConsultation = async () => {
    setShowVideoModal(false);

    const medsText = 'Tab. Paracetamol 650mg (1-0-1 Post Meals) | Tab. Azithromycin 500mg (OD x 3 Days) | Adequate Rest for 2 Days';
    const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const doctorName = userRole === 'doctor' ? 'Dr. Rishi Pal' : activeConsultDoctor.name;
    const specialtyName = userRole === 'doctor' ? 'Cardiology Specialist' : activeConsultDoctor.specialty;
    const targetPatient = userRole === 'doctor' ? (prescTargetEmail || 'patient@gmail.com') : userEmail;

    try {
      const res = await fetch(`${API_BASE_URL}/prescriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientEmail: targetPatient,
          doctor: doctorName,
          specialty: specialtyName,
          meds: medsText,
          date: dateStr
        })
      });

      if (res.ok) {
        const result = await res.json();
        const newRx: PrescriptionItem = {
          id: result.id,
          doctor: doctorName,
          specialty: specialtyName,
          meds: medsText,
          date: dateStr,
          patient_email: targetPatient
        };
        setPrescriptions(prev => [newRx, ...prev]);
        setPrintableRx(newRx);
      } else {
        alert('Call ended, but prescription failed to record in MySQL.');
      }
    } catch (err) {
      console.error('Prescription generation error:', err);
    }
  };

  // Doctor manual Rx issue
  const handleDoctorIssuePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prescTargetEmail || !prescMeds) return;
    const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    try {
      const res = await fetch(`${API_BASE_URL}/prescriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientEmail: prescTargetEmail,
          doctor: 'Dr. Rishi Pal',
          specialty: 'Cardiology Specialist',
          meds: prescMeds,
          date: dateStr
        })
      });

      if (res.ok) {
        const result = await res.json();
        const newRx = {
          id: result.id,
          doctor: 'Dr. Rishi Pal',
          specialty: 'Cardiology Specialist',
          meds: prescMeds,
          date: dateStr,
          patient_email: prescTargetEmail
        };
        setPrescriptions(prev => [newRx, ...prev]);
        setPrescMeds('');
        setPrescTargetEmail('');
        alert('Digital prescription saved to MySQL database.');
      }
    } catch {
      alert('Failed to issue prescription.');
    }
  };

  const isDoctor = userRole === 'doctor';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: isDoctor ? '#0b1329' : '#f0f9ff',
      color: isDoctor ? '#f8fafc' : '#1e293b',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      paddingBottom: '48px'
    }}>
      {/* Top Header */}
      <header style={{
        backgroundColor: isDoctor ? '#1e293b' : '#ffffff',
        borderBottom: isDoctor ? '1px solid #334155' : '1px solid #e0f2fe',
        padding: '14px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            backgroundColor: isDoctor ? '#059669' : '#0284c7',
            color: '#ffffff',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {isDoctor ? <Stethoscope size={20} /> : <Activity size={20} />}
          </div>
          <div>
            <span style={{ fontWeight: 900, fontSize: '15px', letterSpacing: '0.5px' }}>RISHI HEALTH</span>
            <span style={{ fontSize: '11px', color: isDoctor ? '#94a3b8' : '#64748b', marginLeft: '8px' }}>
              {isDoctor ? '• Clinician Workstation' : '• Patient Portal'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px' }}>
          <span style={{
            backgroundColor: isDoctor ? 'rgba(5, 150, 105, 0.2)' : '#e0f2fe',
            color: isDoctor ? '#34d399' : '#0369a1',
            border: isDoctor ? '1px solid #059669' : 'none',
            padding: '4px 12px',
            borderRadius: '20px',
            fontWeight: 800,
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            {isDoctor ? <UserCog size={13} /> : <Users size={13} />}
            {isDoctor ? 'DOCTOR VIEW (ACTIVE)' : 'PATIENT VIEW'}
          </span>

          <span style={{ color: isDoctor ? '#94a3b8' : '#64748b' }}>
            ID: <strong style={{ color: isDoctor ? '#ffffff' : '#0f172a' }}>{userEmail}</strong>
          </span>

          <button 
            onClick={() => { onLogout(); navigate('/login'); }}
            style={{
              border: isDoctor ? '1px solid #475569' : '1px solid #cbd5e1',
              backgroundColor: isDoctor ? '#334155' : '#ffffff',
              color: isDoctor ? '#f8fafc' : '#475569',
              padding: '5px 12px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px 0' }}>

        {/* VIEW A: DOCTOR WORKSTATION VIEW */}
        {isDoctor ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
            
            {/* Column 1: Live Patient Queue */}
            <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '12px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={18} color="#34d399" />
                  <span style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Assigned Patient Queue
                  </span>
                </div>
                <span style={{ fontSize: '11px', backgroundColor: '#0f172a', padding: '3px 8px', borderRadius: '8px', color: '#34d399', fontWeight: 700 }}>
                  {appointments.length} Awaiting
                </span>
              </div>

              {appointments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b', fontSize: '13px' }}>
                  No incoming patient appointments assigned to you currently.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {appointments.map(apt => (
                    <div key={apt.id} style={{ border: '1px solid #334155', borderRadius: '8px', padding: '12px', backgroundColor: '#0f172a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>
                          Patient: {apt.patient_email}
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '3px' }}>
                          <Clock size={11} style={{ display: 'inline', marginRight: '4px' }} />
                          {apt.date} • Slot: {apt.time}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => {
                            setPrescTargetEmail(apt.patient_email || '');
                            setShowVideoModal(true);
                          }}
                          style={{
                            backgroundColor: '#059669',
                            color: '#ffffff',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Start Call
                        </button>
                        <button
                          onClick={() => handleCancelAppointment(apt.id)}
                          style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.15)',
                            color: '#f87171',
                            border: '1px solid #ef4444',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            cursor: 'pointer'
                          }}
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Column 2: Clinical Tooling */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Issue New Prescription */}
              <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #334155', paddingBottom: '10px', marginBottom: '14px' }}>
                  <Send size={16} color="#34d399" />
                  <span style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase' }}>
                    Issue Digital Prescription (Rx)
                  </span>
                </div>

                <form onSubmit={handleDoctorIssuePrescription} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', marginBottom: '4px' }}>
                      Patient Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="patient@gmail.com"
                      value={prescTargetEmail}
                      onChange={e => setPrescTargetEmail(e.target.value)}
                      style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc', fontSize: '12px', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', marginBottom: '4px' }}>
                      Medications, Dosage & Advice
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="e.g. Tab. Atorvastatin 20mg (OD at bedtime x 30 days)..."
                      value={prescMeds}
                      onChange={e => setPrescMeds(e.target.value)}
                      style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc', fontSize: '12px', outline: 'none' }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{ backgroundColor: '#059669', color: '#ffffff', border: 'none', padding: '9px 0', borderRadius: '6px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
                  >
                    Commit Rx to Database
                  </button>
                </form>
              </div>

              {/* Prescriptions Issued List */}
              <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '10px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8' }}>
                    Prescriptions Given by You
                  </span>
                  <span style={{ fontSize: '11px', color: '#34d399', fontWeight: 700 }}>{prescriptions.length} Total</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                  {prescriptions.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px 0', color: '#64748b', fontSize: '11px' }}>
                      No prescriptions written yet.
                    </div>
                  ) : (
                    prescriptions.map((p, idx) => (
                      <div key={idx} style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '8px 10px', fontSize: '11px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 700, color: '#f8fafc' }}>To: {p.patient_email}</span>
                          <span style={{ color: '#64748b' }}>{p.date}</span>
                        </div>
                        <div style={{ color: '#94a3b8', marginTop: '4px', fontFamily: 'monospace' }}>{p.meds}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>
        ) : (

        /* VIEW B: PATIENT PORTAL VIEW */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '20px'
          }}>

            {/* PATIENT BOX 1: MY BOOKED CONSULTATIONS */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '270px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={16} color="#0284c7" />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155', textTransform: 'uppercase' }}>
                      1. My Booked Appointments
                    </span>
                  </div>
                  <span style={{ fontSize: '10px', backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>{appointments.length} Booked</span>
                </div>

                {appointments.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', fontSize: '12px', color: '#94a3b8' }}>
                    No upcoming consultations registered
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                    {appointments.map((apt) => (
                      <div key={apt.id} style={{ border: '1px solid #f1f5f9', borderRadius: '8px', padding: '10px', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>
                            {apt.doctor}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>
                            {apt.specialty} • {apt.date} ({apt.time})
                          </div>
                        </div>
                        <button 
                          onClick={() => handleCancelAppointment(apt.id)}
                          style={{
                            border: '1px solid #fecaca',
                            backgroundColor: '#fee2e2',
                            color: '#dc2626',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Trash2 size={12} /> Cancel
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowBookingModal(true)}
                style={{ width: '100%', backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '9px 0', borderRadius: '7px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', marginTop: '12px' }}
              >
                + Book Consultation
              </button>
            </div>

            {/* PATIENT BOX 2: DIGITAL PRESCRIPTIONS */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '270px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={16} color="#0284c7" />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155', textTransform: 'uppercase' }}>
                      2. My Prescriptions
                    </span>
                  </div>
                  <span style={{ fontSize: '10px', color: '#0284c7', fontWeight: 700 }}>Official Rx</span>
                </div>

                {prescriptions.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', fontSize: '12px', color: '#94a3b8' }}>
                    Prescriptions issued by doctors will show here
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '180px', overflowY: 'auto' }}>
                    {prescriptions.map((p, idx) => (
                      <div key={idx} style={{ borderLeft: '3px solid #0284c7', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '0 8px 8px 0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                          <span style={{ fontWeight: 700, color: '#0f172a' }}>{p.doctor}</span>
                          <button
                            onClick={() => setPrintableRx(p)}
                            style={{ border: 'none', background: 'transparent', color: '#0284c7', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                          >
                            <Printer size={12} /> Print Slip
                          </button>
                        </div>
                        <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '6px' }}>{p.specialty} • {p.date}</div>
                        <div style={{ fontSize: '11px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '6px 8px', borderRadius: '6px', fontFamily: 'monospace', color: '#334155' }}>
                          {p.meds}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center', paddingTop: '10px', borderTop: '1px solid #f8fafc' }}>
                Synchronized with MySQL database
              </div>
            </div>

            {/* PATIENT BOX 3: DOCTORS & SYMPTOMS SEARCH */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '270px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Video size={16} color="#0284c7" />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155', textTransform: 'uppercase' }}>3. Doctors & Symptoms</span>
                  </div>
                  <span style={{ fontSize: '10px', color: '#16a34a', fontWeight: 700 }}>● Live</span>
                </div>

                <div style={{ position: 'relative', marginBottom: '10px' }}>
                  <Search size={13} style={{ position: 'absolute', left: '10px', top: '9px', color: '#94a3b8' }} />
                  <input
                    type="text"
                    placeholder="Search symptom (fever, heart, skin)..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '7px 10px 7px 28px', fontSize: '11px', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
                  {filteredDoctors.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => doc.available && setActiveConsultDoctor(doc)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 8px',
                        borderRadius: '8px',
                        border: activeConsultDoctor.id === doc.id ? '1px solid #0284c7' : '1px solid #f1f5f9',
                        backgroundColor: activeConsultDoctor.id === doc.id ? '#f0f9ff' : '#ffffff',
                        cursor: doc.available ? 'pointer' : 'not-allowed',
                        opacity: doc.available ? 1 : 0.5
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img src={doc.img} alt={doc.name} style={{ width: '26px', height: '26px', borderRadius: '6px', objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a' }}>{doc.name}</div>
                          <div style={{ fontSize: '9px', color: '#64748b' }}>{doc.specialty}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', backgroundColor: doc.available ? '#dcfce7' : '#f1f5f9', color: doc.available ? '#15803d' : '#64748b', fontWeight: 700 }}>
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowVideoModal(true)}
                style={{ width: '100%', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', padding: '9px 0', borderRadius: '7px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', marginTop: '10px' }}
              >
                Start Teleconsultation
              </button>
            </div>

            {/* PATIENT BOX 4: UPI BILLING */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '270px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CreditCard size={16} color="#0284c7" />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155', textTransform: 'uppercase' }}>4. Billing & Fees</span>
                  </div>
                  <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>INR</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '4px' }}>Tariff (₹)</label>
                    <input
                      type="text"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 10px', fontSize: '12px', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '4px' }}>Gateway</label>
                    <select style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 10px', fontSize: '12px', outline: 'none', backgroundColor: '#ffffff' }}>
                      <option>Dynamic UPI QR (Instant Transfer)</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowQRModal(true)}
                style={{ width: '100%', border: '1px solid #0284c7', backgroundColor: '#ffffff', color: '#0284c7', padding: '9px 0', borderRadius: '7px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', marginTop: '12px' }}
              >
                Pay via UPI QR
              </button>
            </div>

            {/* PATIENT BOX 5: FEEDBACK */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '270px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Star size={16} color="#0284c7" />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155', textTransform: 'uppercase' }}>5. Clinical Feedback</span>
                  </div>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>Audit</span>
                </div>

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  await fetch(`${API_BASE_URL}/feedback`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ patientEmail: userEmail, rating: feedbackRating, notes: feedbackText })
                  });
                  setFeedbackSubmitted(true);
                  setFeedbackText('');
                }} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '4px' }}>Rating</label>
                    <select 
                      value={feedbackRating} 
                      onChange={e => setFeedbackRating(e.target.value)} 
                      style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '7px 8px', fontSize: '11px', backgroundColor: '#ffffff' }}
                    >
                      <option>5 Stars - Excellent Clinical Care</option>
                      <option>4 Stars - Good Consultation</option>
                      <option>3 Stars - Satisfactory</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '4px' }}>Review Notes</label>
                    <textarea
                      required
                      rows={2}
                      value={feedbackText}
                      onChange={e => setFeedbackText(e.target.value)}
                      placeholder="Doctor consultation review..."
                      style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 8px', fontSize: '11px', outline: 'none' }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{ width: '100%', backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '8px 0', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Submit Feedback
                  </button>
                  {feedbackSubmitted && (
                    <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#16a34a', textAlign: 'center', fontWeight: 600 }}>Review documented in database.</p>
                  )}
                </form>
              </div>
            </div>

            {/* PATIENT BOX 6: 24/7 EMERGENCY & AMBULANCE ASSISTANCE */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #fee2e2', borderRadius: '12px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '270px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #fef2f2', paddingBottom: '10px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={16} color="#dc2626" />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#991b1b', textTransform: 'uppercase' }}>
                      6. Emergency & Critical Care
                    </span>
                  </div>
                  <span style={{ fontSize: '10px', backgroundColor: '#fee2e2', color: '#b91c1c', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>24/7 Active</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff5f5', padding: '10px 12px', borderRadius: '8px', border: '1px solid #fed7d7' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#991b1b' }}>National Ambulance Helpline</div>
                      <div style={{ fontSize: '10px', color: '#7f1d1d' }}>Toll-Free Emergency Medical Response</div>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#dc2626' }}>102</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>Rishi Health Trauma Center</div>
                      <div style={{ fontSize: '10px', color: '#64748b' }}>Emergency Triage Direct Desk</div>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#0284c7', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <PhoneCall size={12} /> 1800-RISHI-CARE
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => alert('Emergency alert dispatched to trauma care team! An ambulance is en route.')}
                style={{ width: '100%', backgroundColor: '#dc2626', color: '#ffffff', border: 'none', padding: '9px 0', borderRadius: '7px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', marginTop: '12px' }}
              >
                🚨 Request Immediate Ambulance
              </button>
            </div>

          </div>
        )}

      </div>

      {/* MODAL: PRINTABLE PRESCRIPTION SLIP */}
      {printableRx && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: '16px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '28px', width: '100%', maxWidth: '520px', color: '#0f172a' }}>
            <div style={{ borderBottom: '2px solid #0284c7', paddingBottom: '12px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#0284c7' }}>RISHI HEALTH TELEMEDICINE</h2>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Digital Medical Prescription • Official Consultation Slip</div>
              </div>
              <button onClick={() => setPrintableRx(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px', marginBottom: '16px', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
              <div><strong>Practitioner:</strong> {printableRx.doctor}</div>
              <div><strong>Specialty:</strong> {printableRx.specialty}</div>
              <div><strong>Patient:</strong> {printableRx.patient_email || userEmail}</div>
              <div><strong>Date:</strong> {printableRx.date}</div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>Rx MEDICATIONS & DOSAGE:</div>
              <div style={{ fontSize: '12px', padding: '12px', border: '1px dashed #cbd5e1', borderRadius: '8px', backgroundColor: '#fafafa', fontFamily: 'monospace' }}>
                {printableRx.meds}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                Digitally verified • Preserved in MySQL
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => window.print()}
                  style={{ backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Printer size={14} /> Print / Save PDF
                </button>
                <button
                  onClick={() => setPrintableRx(null)}
                  style={{ border: '1px solid #cbd5e1', background: '#ffffff', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: BOOK APPOINTMENT */}
      {showBookingModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '380px', color: '#0f172a' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' }}>Schedule Session</h3>
              <button onClick={() => setShowBookingModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><X size={16} /></button>
            </div>

            <form onSubmit={handleBookAppointment} style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Practitioner</label>
                <select value={selectedDoctor} onChange={e => setSelectedDoctor(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
                  <option>Dr. Rishi Pal (Cardiology)</option>
                  <option>Dr. Suresh Verma (General Physician)</option>
                  <option>Dr. Ananya Sen (Pediatric Care)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Date</label>
                <input type="date" required value={bookingDate} onChange={e => setBookingDate(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Window / Slot</label>
                <select value={bookingTime} onChange={e => setBookingTime(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
                  <option>10:00 AM (Morning)</option>
                  <option>12:30 PM (Midday)</option>
                  <option>04:00 PM (Evening)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 1, backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '9px 0', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Confirm</button>
                <button type="button" onClick={() => setShowBookingModal(false)} style={{ padding: '9px 16px', border: '1px solid #cbd5e1', background: '#ffffff', borderRadius: '6px', cursor: 'pointer' }}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LIVE VIDEO TELEMETRY */}
      {showVideoModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
          <div style={{ backgroundColor: '#0f172a', borderRadius: '12px', overflow: 'hidden', width: '100%', maxWidth: '500px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #1e293b' }}>
              <span style={{ fontSize: '11px', color: '#22c55e', fontWeight: 700, letterSpacing: '1px' }}>● LIVE CLINICAL TELEMETRY</span>
              <button onClick={() => setShowVideoModal(false)} style={{ border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}><X size={16} /></button>
            </div>

            <div style={{ position: 'relative', height: '260px', backgroundColor: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={activeConsultDoctor.img} alt="Doctor" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
              <div style={{ position: 'absolute', bottom: '12px', left: '12px', backgroundColor: 'rgba(15, 23, 42, 0.8)', padding: '6px 10px', borderRadius: '6px', color: '#ffffff', fontSize: '11px' }}>
                <div style={{ fontWeight: 600 }}>{isDoctor ? 'Dr. Rishi Pal' : activeConsultDoctor.name}</div>
                <div style={{ fontSize: '9px', color: '#94a3b8' }}>{isDoctor ? 'Cardiology Specialist' : activeConsultDoctor.specialty}</div>
              </div>
              <div style={{ position: 'absolute', top: '12px', right: '12px', width: '90px', height: '90px', backgroundColor: '#1e293b', borderRadius: '6px', overflow: 'hidden', border: '1px solid #ffffff' }}>
                <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>

            <div style={{ padding: '14px', textAlign: 'center' }}>
              <button 
                onClick={endConsultation} 
                style={{ width: '100%', backgroundColor: '#e11d48', color: '#ffffff', border: 'none', padding: '10px 0', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
              >
                Terminate Session & Generate Digital Prescription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: UPI CLEARANCE */}
      {showQRModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '300px', textAlign: 'center', color: '#0f172a' }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' }}>UPI Clearance</h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 14px 0' }}>Total Fee: <strong style={{ color: '#0f172a' }}>₹{amount}.00</strong></p>

            <div style={{ border: '1px solid #e2e8f0', padding: '12px', borderRadius: '8px', display: 'inline-block', backgroundColor: '#ffffff' }}>
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=rishihealth@icici&pn=RishiHealth&am=${amount}&cu=INR`} 
                alt="Payment QR" 
                style={{ width: '140px', height: '140px', display: 'block' }}
              />
            </div>

            <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => { setShowQRModal(false); alert('Payment acknowledged.'); }}
                style={{ width: '100%', backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '9px 0', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
              >
                Confirm Transaction
              </button>
              <button
                onClick={() => setShowQRModal(false)}
                style={{ width: '100%', border: '1px solid #cbd5e1', background: '#ffffff', color: '#64748b', padding: '7px 0', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// ==========================================
// 3. APPLICATION ROUTER
// ==========================================
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<'patient' | 'doctor'>('patient');

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={
            <LoginPage onLogin={(email, role) => {
              setIsAuthenticated(true);
              setUserEmail(email);
              setUserRole(role);
            }} />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? (
              <DashboardPage 
                userEmail={userEmail} 
                userRole={userRole} 
                onLogout={() => setIsAuthenticated(false)} 
              />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}