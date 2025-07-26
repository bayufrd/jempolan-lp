import React, { useState } from "react";

export const Image = ({ title, largeImage, smallImage }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="portfolio-item"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img 
        src={smallImage} 
        alt={title} 
        className="img-responsive" 
      />
      <div className="image-overlay">
        <h4>{title}</h4>
      </div>
    </div>
  );
};