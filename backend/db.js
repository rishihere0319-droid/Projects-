const mysql = require('mysql2');

// DATABASE CONNECTION
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'rishi_health_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// DATABASE INITIALIZATION & TABLES
const initDatabase = () => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Database connection failed:', err.message);
      return;
    }
    console.log('Connected to MySQL Database: rishi_health_db');

    // USERS TABLE
    connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // APPOINTMENTS TABLE
    connection.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        patient_email VARCHAR(255) NOT NULL,
        doctor_name VARCHAR(255) NOT NULL,
        specialty VARCHAR(255) NOT NULL,
        appointment_date VARCHAR(50) NOT NULL,
        appointment_time VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // PRESCRIPTIONS TABLE
    connection.query(`
      CREATE TABLE IF NOT EXISTS prescriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        patient_email VARCHAR(255) NOT NULL,
        doctor_name VARCHAR(255) NOT NULL,
        specialty VARCHAR(255) NOT NULL,
        medications TEXT NOT NULL,
        prescribed_date VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // FEEDBACK TABLE
    connection.query(`
      CREATE TABLE IF NOT EXISTS feedbacks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        patient_email VARCHAR(255) NOT NULL,
        rating VARCHAR(100) NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    connection.release();
  });
};

initDatabase();

module.exports = pool.promise();