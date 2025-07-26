import React, { useState, useEffect } from 'react';
import { FaCopyright } from 'react-icons/fa';
import {
  fetchSettings,
  verifyPassword,
  updateSettings,
  resetPassword
} from '../services/apiService';

export const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStage, setModalStage] = useState('password');
  const [currentSettings, setCurrentSettings] = useState({ content: 2, developer: 0 });

  const [formData, setFormData] = useState({
    password: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    content: 2,
    developer: 0
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetchSettings();
        setCurrentSettings(response);
        setFormData(prev => ({ ...prev, ...response }));
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    loadSettings();
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setModalStage('password');
    setFormData({ password: '', currentPassword: '', newPassword: '', confirmNewPassword: '', content: currentSettings.content, developer: currentSettings.developer });
    setErrors({});
  };

  const handleVerifyPassword = async () => {
    try {
      const response = await verifyPassword(formData.password);
      if (response.isValid) {
        setModalStage('settings');
      } else {
        setErrors({ password: response.message || 'Password salah' });
      }
    } catch (error) {
      setErrors({ password: 'Gagal memverifikasi password' });
    }
  };

  const validateSettingsForm = () => {
    const newErrors = {};
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Password saat ini harus diisi';
    }
    if (formData.newPassword) {
      if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'Password baru minimal 8 karakter';
      }
      if (formData.newPassword !== formData.confirmNewPassword) {
        newErrors.confirmNewPassword = 'Konfirmasi password tidak cocok';
      }
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(formData.newPassword)) {
        newErrors.newPassword = 'Password harus mengandung huruf besar, kecil, angka, dan karakter spesial';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveSettings = async () => {
    if (!validateSettingsForm()) return;
    try {
      const updateData = {
        content: formData.content,
        developer: formData.developer,
        currentPassword: formData.currentPassword,
        ...(formData.newPassword ? { newPassword: formData.newPassword } : {})
      };
      await updateSettings(updateData);
      window.location.reload();
    } catch (error) {
      const errorMessage = error.message || error.response?.data?.message || 'Gagal menyimpan pengaturan';
      setErrors({ submit: errorMessage });
    }
  };

  const renderModal = () => {
    if (modalStage === 'password') {
      return (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Masukkan Password</h2>
              <button className="modal-close-btn" onClick={toggleModal}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Masukkan Password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={handleVerifyPassword}
              >
                Verifikasi
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="modal-overlay">
        <div className="modal-container settings-modal">
          <div className="modal-header">
            <h2>Pengaturan</h2>
            <button className="modal-close-btn" onClick={toggleModal}>&times;</button>
          </div>
          <div className="modal-body">
            {/* Password Saat Ini */}
            <div className="form-group">
              <label className="form-label">Password Saat Ini</label>
              <input
                type="password"
                className="form-control"
                value={formData.currentPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                placeholder="Masukkan password saat ini"
              />
              {errors.currentPassword && <span className="error-text">{errors.currentPassword}</span>}
            </div>

            {/* Ganti Password Toggle */}
            <div className="form-group password-toggle">
              <div className="d-flex align-items-center">
                <input
                  type="checkbox"
                  id="changePasswordCheckbox"
                  className="checkbox-input"
                  checked={!!formData.newPassword}
                  onChange={() => setFormData(prev => ({
                    ...prev,
                    newPassword: prev.newPassword ? '' : ' ',
                    confirmNewPassword: prev.newPassword ? '' : ''
                  }))}
                />
                <label htmlFor="changePasswordCheckbox" className="checkbox-label">
                  Ganti Password
                </label>
              </div>
            </div>

            {/* Form Ganti Password */}
            {formData.newPassword && (
              <div className="password-change-section">
                <div className="form-group">
                  <label className="form-label">Password Baru</label>
                  <input
                    type="password"
                    className="form-control"
                    value={formData.newPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Masukkan password baru"
                  />
                  {errors.newPassword && <span className="error-text">{errors.newPassword}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Konfirmasi Password Baru</label>
                  <input
                    type="password"
                    className="form-control"
                    value={formData.confirmNewPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmNewPassword: e.target.value }))}
                    placeholder="Konfirmasi password baru"
                  />
                  {errors.confirmNewPassword && <span className="error-text">{errors.confirmNewPassword}</span>}
                </div>
              </div>
            )}

            {/* Pilihan Tampilan */}
            <div className="form-group display-options">
              <div className="radio-group">
                <label className="radio-inline">
                  <input
                    type="radio"
                    name="content"
                    value={1}
                    checked={formData.content === 1}
                    onChange={() => setFormData(prev => ({ ...prev, content: 1 }))}
                  />
                  <span>Tampilan Versi 1</span>
                </label>
                <label className="radio-inline">
                  <input
                    type="radio"
                    name="content"
                    value={2}
                    checked={formData.content === 2}
                    onChange={() => setFormData(prev => ({ ...prev, content: 2 }))}
                  />
                  <span>Tampilan Versi 2</span>
                </label>
              </div>
            </div>

            {/* Developer Mode */}
            <div className="form-group developer-mode">
              <div className="d-flex align-items-center justify-content-between">
                <label className="form-label mb-0">Developer Mode</label>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={formData.developer === 1}
                    onChange={() => setFormData(prev => ({
                      ...prev,
                      developer: prev.developer === 1 ? 0 : 1
                    }))}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>

            {/* Global Error */}
            {errors.submit && <div className="global-error">{errors.submit}</div>}
          </div>

          {/* Footer Buttons */}
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={toggleModal}>Batal</button>
            <button className="btn btn-primary" onClick={handleSaveSettings}>Simpan</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <footer id="footer">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <p>
                <FaCopyright /> {new Date().getFullYear()}
                {' '}
                <span
                  onClick={toggleModal}
                  style={{
                    color: '#333',
                    textDecoration: 'none',
                    cursor: 'pointer'
                  }}
                  className="settings-link"
                >
                  Kerja Kelompok
                </span> X Dastrevas.
                All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
      {isModalOpen && renderModal()}
    </>
  );
};

export default Footer;