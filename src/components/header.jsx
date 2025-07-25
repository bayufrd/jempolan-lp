import React from "react";
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

export const Header = (props) => {
  // Safely extract data or use default empty arrays
  const socialLinks = props.data?.socialLinks || [];
  const serviceLinks = props.data?.serviceLinks || [];
  return (
    <header id="header">
      <div className="intro">
        <div className="overlay">
          <div className="container">
            <div className="row">
              <div className="col-md-8 col-md-offset-2 intro-text">
                <h1>
                  {props.data ? props.data.title : "Loading"}
                  <span></span>
                </h1>
                <p>{props.data ? props.data.paragraph : "Loading"}</p>
                {/* Social Links Section */}
                <div className="social-links mt-3">
                  {socialLinks.map((link, index) => {
                    // Get the icon component dynamically
                    const IconComponent = iconMap[link.icon];
                    return (
                      <a
                        key={index}
                        href={link.url}
                        className="btn-social"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {IconComponent && <IconComponent />}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};