// backend/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const crypto = require('crypto');

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
      initializeSettingsTable(db);
    }
  });
  return db;
}

function initializeSettingsTable(db) {
    db.run(`CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY,
      content INTEGER NOT NULL,
      developer INTEGER NOT NULL DEFAULT 0,
      admin_password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('Error creating settings table:', err.message);
        return;
      }
  
      console.log('Settings table ensured.');
  
      // Gunakan INSERT OR IGNORE untuk mencegah error duplikasi
      db.get('SELECT COUNT(*) as count FROM settings WHERE id = 1', (err, row) => {
        if (err) {
          console.error('Error checking settings:', err.message);
          return;
        }
  
        if (row.count === 0) {
          const defaultPassword = 'Admin123!'; 
          const hashedPassword = hashPassword(defaultPassword);
  
          db.run(`
            INSERT OR IGNORE INTO settings 
            (id, content, developer, admin_password) 
            VALUES (1, 2, 0, ?)
          `, [hashedPassword], (err) => {
            if (err) {
              console.error('Error initializing settings:', err.message);
            } else {
              console.log('Settings initialized with default values');
            }
          });
        }
      });
    });
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
// Fungsi untuk inisialisasi tabel Settings
// Fungsi untuk hash password
function hashPassword(password) {
    // Gunakan SHA-256 untuk hashing
    return crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');
  }
  
  // Fungsi untuk verifikasi password
  function verifyPassword(inputPassword, storedHash) {
    // Hash input password dan bandingkan
    return hashPassword(inputPassword) === storedHash;
  }
  
  // Modifikasi fungsi inisialisasi untuk menggunakan crypto
  function initializeSettingsTable(db) {
    db.run(`CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY,
      content INTEGER NOT NULL,
      developer INTEGER NOT NULL DEFAULT 0,
      admin_password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('Error creating settings table:', err.message);
      } else {
        // Inisiasi awal dengan nilai default
        db.get('SELECT COUNT(*) as count FROM settings', (err, row) => {
          if (err) {
            console.error('Error checking settings:', err.message);
          } else if (row.count === 0) {
            // Gunakan crypto untuk hash password default
            const defaultPassword = 'Admin123!'; 
            const hashedPassword = hashPassword(defaultPassword);
  
            db.run(`
              INSERT INTO settings 
              (id, content, developer, admin_password) 
              VALUES (1, 2, 0, ?)
            `, [hashedPassword], (err) => {
              if (err) {
                console.error('Error initializing settings:', err.message);
              } else {
                console.log('Settings initialized with default values');
              }
            });
          }
        });
        console.log('Settings table ensured.');
      }
    });
  }
  
  // Fungsi untuk mendapatkan pengaturan
  function getSettings(db) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT content, developer FROM settings WHERE id = 1';
      
      db.get(query, (err, row) => {
        if (err) {
          console.error('Error fetching settings:', err);
          reject(err);
        } else if (!row) {
          // Jika tidak ada data, kembalikan default
          resolve({ 
            content: 2,
            developer: 0 
          });
        } else {
          resolve({ 
            content: row.content,
            developer: row.developer
          });
        }
      });
    });
  }
  
  // Fungsi untuk memperbarui pengaturan
  function updateSettings(db, data) {
    return new Promise((resolve, reject) => {
      const { content, developer, currentPassword, newPassword } = data;
      
      // Validasi input
      if (content === undefined || developer === undefined) {
        return reject(new Error('Content dan developer harus disertakan'));
      }
  
      // Validasi tipe data
      if (typeof content !== 'number' || typeof developer !== 'number') {
        return reject(new Error('Content dan developer harus berupa angka'));
      }
  
      // Validasi rentang nilai
      if (![1, 2].includes(content)) {
        return reject(new Error('Content harus bernilai 1 atau 2'));
      }
  
      if (![0, 1].includes(developer)) {
        return reject(new Error('Developer harus bernilai 0 atau 1'));
      }
  
      db.get('SELECT admin_password FROM settings WHERE id = 1', (err, row) => {
        if (err) {
          return reject(err);
        }
  
        // Tangani kasus row tidak ditemukan
        if (!row || !row.admin_password) {
          return reject(new Error('Pengaturan tidak ditemukan'));
        }
  
        // Verifikasi password
        if (!verifyPassword(currentPassword, row.admin_password)) {
          return reject(new Error('Password salah'));
        }
  
        // Proses update
        let query, params;
        if (newPassword) {
          // Validasi password baru
          if (newPassword.length < 8) {
            return reject(new Error('Password baru minimal 8 karakter'));
          }
  
          const hashedNewPassword = hashPassword(newPassword);
          query = `
            UPDATE settings 
            SET content = ?, 
                developer = ?, 
                admin_password = ?, 
                updated_at = CURRENT_TIMESTAMP 
            WHERE id = 1
          `;
          params = [content, developer, hashedNewPassword];
        } else {
          query = `
            UPDATE settings 
            SET content = ?, 
                developer = ?, 
                updated_at = CURRENT_TIMESTAMP 
            WHERE id = 1
          `;
          params = [content, developer];
        }
  
        db.run(query, params, function(err) {
          if (err) {
            return reject(err);
          }
          resolve({
            message: 'Pengaturan berhasil diperbarui',
            content,
            developer
          });
        });
      });
    });
  }
  
  // Fungsi untuk verifikasi password
  // Modifikasi fungsi checkPassword untuk logging
  function checkPassword(db, password) {
    return new Promise((resolve, reject) => {
      db.get('SELECT admin_password FROM settings WHERE id = 1', (err, row) => {
        if (err) {
          console.error('Database Error:', err);
          return reject(err);
        }
  
        // Tambahkan pengecekan eksplisit
        if (!row || !row.admin_password) {
          console.error('No settings row found or password is empty');
          return resolve(false);
        }
  
        try {
          const hashedInputPassword = hashPassword(password);
          const isValid = hashedInputPassword === row.admin_password;
  
          console.log('Password Verification Result:', {
            storedHashExists: !!row.admin_password,
            inputHashLength: hashedInputPassword.length,
            isValid: isValid
          });
  
          resolve(isValid);
        } catch (error) {
          console.error('Password verification error:', error);
          reject(error);
        }
      });
    });
  }
  
  // Tambahkan fungsi untuk reset password (debugging)
  function resetToDefaultPassword(db) {
    return new Promise((resolve, reject) => {
      const defaultPassword = 'Admin123!'; 
      const hashedPassword = hashPassword(defaultPassword);
  
      db.run(`
        UPDATE settings 
        SET admin_password = ?, 
            updated_at = CURRENT_TIMESTAMP 
        WHERE id = 1
      `, [hashedPassword], (err) => {
        if (err) {
          console.error('Error resetting password:', err);
          reject(err);
        } else {
          console.log('Password reset to default successfully');
          resolve(true);
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
  getReviewStatistics,
  initializeSettingsTable,
  getSettings,
  updateSettings,
  checkPassword,
  resetToDefaultPassword
};