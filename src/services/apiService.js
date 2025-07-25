import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const submitReview = async (reviewData) => {
  try {
    const dataToSubmit = {
      ...reviewData,
      rating: Math.round(reviewData.rating)
    };

    console.log('Sending review data:', dataToSubmit);

    const response = await axios.post(`${API_URL}/reviews`, dataToSubmit);
    return response.data;
  } catch (error) {
    console.error('Error submitting review:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const fetchReviews = async () => {
  try {
    const response = await axios.get(`${API_URL}/reviews`);
    console.log('Fetched reviews:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

// Optional: Tambahkan fungsi untuk statistik jika diperlukan
export const fetchReviewStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/review-stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching review stats:', error);
    throw error;
  }
};