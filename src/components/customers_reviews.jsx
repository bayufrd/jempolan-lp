import React, { useState, useEffect } from 'react';
import StarRatings from 'react-star-ratings';
import { submitReview, fetchReviews } from '../services/apiService';
import { FaPaperPlane, FaUserCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export const CustomerReview = () => {
  // State untuk review dan pagination
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(2);
  const [totalRatingStats, setTotalRatingStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    }
  });

  // State untuk form input
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    phone: '',
    rating: 0,
    comment: ''
  });

  // Fungsi untuk memuat review dan menghitung statistik
  const loadReviews = async () => {
    try {
      const fetchedReviews = await fetchReviews();
      setReviews(fetchedReviews);

      // Hitung statistik rating
      if (fetchedReviews.length > 0) {
        const totalRating = fetchedReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / fetchedReviews.length;

        const ratingDistribution = fetchedReviews.reduce((dist, review) => {
          dist[review.rating]++;
          return dist;
        }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

        setTotalRatingStats({
          averageRating: Number(averageRating.toFixed(1)),
          totalReviews: fetchedReviews.length,
          ratingDistribution
        });
      }
    } catch (error) {
      console.error('Gagal memuat review:', error);
    }
  };

  // Panggil fungsi load reviews saat komponen dimuat
  useEffect(() => {
    loadReviews();
  }, []);

  // Fungsi untuk menghasilkan warna acak (tetap sama)
  const getRandomColor = () => {
    const colors = [
      '#5ca9fb', '#6372ff', '#ff6b6b', '#4ecdc4', 
      '#45b7d1', '#ff8a5b', '#8a4fff', '#2ecc71', 
      '#e74c3c', '#f39c12'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Logika pagination
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  // Fungsi untuk mengubah halaman
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handler input dan submit (tetap sama seperti sebelumnya)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleRatingChange = (newRating) => {
    setFormData(prevState => ({
      ...prevState,
      rating: newRating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.rating === 0) {
      alert('Silakan berikan rating Anda');
      return;
    }

    try {
      await submitReview(formData);
      alert('Terima kasih atas review Anda!');
      
      // Reset form
      setFormData({
        name: '', email: '', age: '', phone: '',
        rating: 0, comment: ''
      });

      // Muat ulang review
      await loadReviews();
    } catch (error) {
      console.error('Gagal mengirim review:', error);
      alert('Gagal mengirim review. Silakan coba lagi.');
    }
  };

  // Komponen Pagination
  const Pagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(reviews.length / reviewsPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination">
        <button 
          onClick={() => paginate(currentPage - 1)} 
          disabled={currentPage === 1}
        >
          <FaChevronLeft />
        </button>
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={currentPage === number ? 'active' : ''}
          >
            {number}
          </button>
        ))}
        <button 
          onClick={() => paginate(currentPage + 1)} 
          disabled={currentPage === pageNumbers.length}
        >
          <FaChevronRight />
        </button>
      </div>
    );
  };

  return (
    <section id="reviews">
      <div className="container">
        <div className="section-title text-center">
          <h2>Kepuasan <span>Pelanggan</span></h2>
          <p>Bagikan pengalaman Anda bersama kami</p>
        </div>

        <div className="reviews-content">
          {/* Form Review */}
          <div className="review-form-container">
            <form onSubmit={handleSubmit} className="review-form">
              {/* Baris Pertama: Nama dan Email */}
              <div className="form-row">
                <input
                  type="text"
                  name="name"
                  placeholder="Nama Lengkap"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Baris Kedua: Umur dan Nomor Telepon */}
              <div className="form-row">
                <input
                  type="number"
                  name="age"
                  placeholder="Umur"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Nomor Telepon"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Kontainer Rating */}
              <div className="rating-container">
                <label>Berikan Penilaian Anda:</label>
                <StarRatings
                  rating={formData.rating}
                  starRatedColor="#FFD700"  // Warna emas
                  changeRating={handleRatingChange}
                  numberOfStars={5}
                  name='rating'
                  starDimension="30px"
                  starSpacing="5px"
                />
                {formData.rating > 0 && (
                  <span className="rating-text">
                    {formData.rating} dari 5 bintang
                  </span>
                )}
              </div>

              {/* Textarea Komentar */}
              <textarea
                name="comment"
                placeholder="Ceritakan pengalaman Anda"
                value={formData.comment}
                onChange={handleChange}
                required
              />

              {/* Tombol Submit */}
              <button type="submit" className="btn-review">
                Kirim Review <FaPaperPlane />
              </button>
            </form>
          </div>

          {/* Daftar Review Terbaru */}
          {/* Kontainer Review Terbaru */}
          <div className="recent-reviews-container">
            <div className="reviews-header">
              <h3>Review Terbaru</h3>
              <div className="rating-stats">
                <div className="average-rating">
                  <StarRatings
                    rating={totalRatingStats.averageRating}
                    starRatedColor="#FFD700"
                    numberOfStars={5}
                    starDimension="20px"
                    starSpacing="2px"
                  />
                  <span className="rating-text">
                    {totalRatingStats.averageRating} dari 5 bintang
                  </span>
                </div>
                <p>Total: {totalRatingStats.totalReviews} Reviews</p>
              </div>
            </div>

            <div className="recent-reviews">
              {currentReviews.map(review => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <FaUserCircle
                      className="review-icon"
                      style={{
                        color: getRandomColor(),
                        fontSize: '40px'
                      }}
                    />
                    <h4>{review.name}</h4>
                  </div>
                  <div className="review-rating">
                    <StarRatings
                      rating={review.rating}
                      starRatedColor="#FFD700"
                      numberOfStars={5}
                      starDimension="20px"
                      starSpacing="2px"
                    />
                    <span className="rating-text">
                      {review.rating} dari 5 bintang
                    </span>
                  </div>
                  <p>{review.comment}</p>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <Pagination />
          </div>
        </div>
      </div>
    </section>
  );
};