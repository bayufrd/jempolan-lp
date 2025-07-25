import React from 'react';
import { FaCopyright } from 'react-icons/fa';

export const Footer = () => {
  return (
    <footer id="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center">
            <p>
              <FaCopyright /> 2025 Kerja Kelompok X Dastrevas.Coding. 
              All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};