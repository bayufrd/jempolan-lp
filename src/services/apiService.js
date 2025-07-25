import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Fungsi untuk mendapatkan pengaturan
export const fetchSettings = async () => {
  try {
    const response = await axios.get(`${API_URL}/settings`);
    
    // Log raw response untuk debugging
    console.log('Raw settings response:', response.data);

    // Pastikan mengembalikan objek dengan struktur yang benar
    return {
      developer: response.data?.developer || 0,
      content: response.data?.content || 1
    };
  } catch (error) {
    console.error('Error fetching settings:', error);
    
    // Kembalikan default settings jika error
    return {
      developer: 0,
      content: 0
    };
  }
};

// Fungsi untuk verifikasi password
export const verifyPassword = async (password) => {
  try {
    console.log('Attempting to verify password:', password);
    
    const response = await axios.post(`${API_URL}/verify-password`, { 
      password 
    });
    
    console.log('Verification Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Full Error Verifying Password:', error);
    
    // Log detailed error information
    if (error.response) {
      console.error('Error Response Data:', error.response.data);
      console.error('Error Response Status:', error.response.status);
      console.error('Error Response Headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error Request:', error.request);
    } else {
      console.error('Error Message:', error.message);
    }
    
    throw error;
  }
};

// Fungsi untuk menyimpan/memperbarui pengaturan
export const updateSettings = async (updateData) => {
  try {
    const response = await axios.put(`${API_URL}/settings`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error.response?.data || error;
  }
};

// Fungsi reset password (untuk debugging)
export const resetPassword = async () => {
  try {
    const response = await axios.post(`${API_URL}/reset-password`);
    return response.data;
  } catch (error) {
    console.error('Reset Password Error:', error);
    throw error;
  }
};

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