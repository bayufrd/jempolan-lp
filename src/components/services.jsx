import React, { useState, useEffect } from "react";
import { 
  FaInstagram, FaTiktok, FaFacebook, 
  FaUtensils, FaMotorcycle, FaMap, 
  FaStore, FaCalendarAlt, FaLink 
} from 'react-icons/fa';

// Mapping icon names to actual icon components
const iconMap = {
  FaInstagram: FaInstagram,
  FaTiktok: FaTiktok,
  FaFacebook: FaFacebook,
  FaUtensils: FaUtensils,
  FaMotorcycle: FaMotorcycle,
  FaMap: FaMap,
  FaStore: FaStore,
  FaCalendarAlt: FaCalendarAlt,
  FaLink: FaLink
};
export const Services = ({ data }) => {
  const [serviceLinks, setServiceLinks] = useState([]);

  useEffect(() => {
    if (data && data.serviceLinks) {
      setServiceLinks(data.serviceLinks);
    }
  }, [data]);
  return (
    <div id="services" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2>Our Services</h2>
          <p>Berbagai Layanan, Satu Tujuan</p>
        </div>
        <div className="services-flex-container">
          {serviceLinks.map((link, index) => {
            const IconComponent = iconMap[link.icon];
            
            return (
              <div key={index} className="service-flex-item">
                <a
                  href={link.url}
                  className="btn btn-custom btn-sm service-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {IconComponent && <IconComponent className="service-icon" />}
                  <span className="link-label">{link.label.trim()}</span>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};