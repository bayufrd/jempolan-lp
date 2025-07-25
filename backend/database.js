// backend/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Tentukan path database
const dbPath = path.resolve(__dirname, 'customers_reviews.db');

// Fungsi untuk membuat koneksi database
function createDatabaseConnection() {
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error connecting to database:', err.message);
    } else {
      console.log('Connected to the SQLite database.');
      initializeDatabase(db);
    }
  });
  return db;
}

// Fungsi untuk inisialisasi tabel
function initializeDatabase(db) {
  db.run(`CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    age INTEGER,
    phone TEXT,
    rating INTEGER NOT NULL,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('Error creating reviews table:', err.message);
    } else {
      console.log('Reviews table ensured.');
    }
  });
}

// Fungsi untuk menyimpan review
function saveReview(db, reviewData) {
  return new Promise((resolve, reject) => {
    const { name, email, age, phone, rating, comment } = reviewData;
    
    const query = `
      INSERT INTO reviews 
      (name, email, age, phone, rating, comment) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    db.run(query, [name, email, age, phone, rating, comment], function(err) {
      if (err) {
        console.error('Error saving review:', err);
        reject(err);
      } else {
        resolve({
          id: this.lastID,
          message: 'Review berhasil disimpan'
        });
      }
    });
  });
}

// Fungsi untuk mengambil review terbaru
function getRecentReviews(db, limit = 5) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM reviews 
      ORDER BY created_at DESC 
      LIMIT ?
    `;
    
    db.all(query, [limit], (err, rows) => {
      if (err) {
        console.error('Error fetching reviews:', err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Fungsi untuk validasi data
// backend/database.js
function validateReviewData(data) {
    const errors = [];
  
    if (!data.name || data.name.trim() === '') {
      errors.push('Nama harus diisi');
    }
  
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
      errors.push('Email tidak valid');
    }
  
    // Validasi rating sebagai integer
    const rating = parseInt(data.rating, 10);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      errors.push('Rating harus bilangan bulat antara 1-5');
    }
  
    return {
      isValid: errors.length === 0,
      errors,
      // Konversi rating ke integer
      processedData: {
        ...data,
        rating: rating
      }
    };
  }

// Fungsi untuk mendapatkan statistik review
function getReviewStatistics(db) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        COUNT(*) as total_reviews,
        AVG(rating) as average_rating,
        COUNT(CASE WHEN rating >= 4 THEN 1 END) as high_ratings
      FROM reviews
    `;
    
    db.get(query, (err, row) => {
      if (err) {
        console.error('Error getting review statistics:', err);
        reject(err);
      } else {
        resolve({
          totalReviews: row.total_reviews,
          averageRating: Number(row.average_rating).toFixed(2),
          highRatingsPercentage: Math.round((row.high_ratings / row.total_reviews) * 100)
        });
      }
    });
  });
}

module.exports = {
  createDatabaseConnection,
  initializeDatabase,
  saveReview,
  getRecentReviews,
  validateReviewData,
  getReviewStatistics
};