// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const database = require('./database');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Buat koneksi database
const db = database.createDatabaseConnection();

// Endpoint untuk menyimpan review
app.post('/api/reviews', async (req, res) => {
  try {
    // Validasi data
    const validationResult = database.validateReviewData(req.body);
    
    if (!validationResult.isValid) {
      return res.status(400).json({
        errors: validationResult.errors
      });
    }

    // Simpan review
    const result = await database.saveReview(db, req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ 
      message: 'Gagal menyimpan review',
      error: error.message 
    });
  }
});

// Endpoint untuk mengambil review terbaru
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await database.getRecentReviews(db);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ 
      message: 'Gagal mengambil review',
      error: error.message 
    });
  }
});

// Endpoint untuk statistik review
app.get('/api/review-stats', async (req, res) => {
  try {
    const stats = await database.getReviewStatistics(db);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ 
      message: 'Gagal mengambil statistik review',
      error: error.message 
    });
  }
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

// Tangani penutupan aplikasi
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database connection:', err);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});