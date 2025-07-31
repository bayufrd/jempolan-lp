import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import JsonData from './data/data.json'; // Import data JSON

// Fungsi untuk mengatur meta tag SEO
const updateSEOMetadata = (page) => {
  // Log untuk debugging
  console.log("Current Page:", page);
  console.log("SEO Data:", JsonData.SEO);
  // Ambil data SEO dari JSON
  const seoData = JsonData.SEO || {};

  // Judul Halaman
  // Judul Halaman - Tambahkan default title yang lebih lengkap
  const defaultTitle = "Jempolan Coffee & Eatery - Destinasi Kopi Terbaik di Jogja";
  document.title = seoData.title_SEO || defaultTitle;

  // Deskripsi Meta
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.name = 'description';
    document.head.appendChild(metaDesc);
  }
  metaDesc.content = seoData.description_SEO || "Jempolan Coffee & Eatery - Destinasi Kuliner Terbaik di Jalan Kaliurang, Yogyakarta.";

  // Keywords Meta
  let metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords) {
    metaKeywords.setAttribute(
      'content', 
      seoData.keywords_SEO ? seoData.keywords_SEO.join(', ') : ""
    );
  }
  // Open Graph Meta Tags
  const setOrCreateMeta = (property, content) => {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  setOrCreateMeta('og:title', seoData.title_SEO || 'Jempolan Coffee & Eatery');
  setOrCreateMeta('og:description', seoData.description_SEO || 'Destinasi kuliner terbaik di Jalan Kaliurang, Yogyakarta');
  setOrCreateMeta('og:type', 'business.business');
};


const localSEOSchema = () => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.innerHTML = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Jempolan Coffee & Eatery",
    "image": "https://www.jempolancoffee.com/logo.jpg",
    "url": "https://www.jempolancoffee.com",
    "telephone": "+62 812-3456-7890",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Jalan Kaliurang KM 7.5",
      "addressLocality": "Condong Catur",
      "addressRegion": "Sleman",
      "postalCode": "55283",
      "addressCountry": "ID"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-7.7456", // Koordinat aktual
      "longitude": "110.4072" // Koordinat aktual
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", 
        "Thursday", "Friday", "Saturday", "Sunday"
      ],
      "opens": "09:00",
      "closes": "23:00"
    },
    "priceRange": "$",
    "servesCuisine": ["Coffee", "Cafe", "Snack"]
  });
  
  document.head.appendChild(script);
};
// Tambahkan fungsi untuk optimasi lebih lanjut
const advancedSEOOptimization = () => {
  // Canonical URL untuk menghindari duplicate content
  const canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = 'https://www.jempolan.gaspollmanagementcenter.com';
    document.head.appendChild(link);
  }

  // Robot meta tag untuk kontrol crawler
  const robotsMeta = document.querySelector('meta[name="robots"]');
  if (!robotsMeta) {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'index, follow';
    document.head.appendChild(meta);
  }
};

// Panggil fungsi update metadata sebelum render
updateSEOMetadata();

// Panggil fungsi setelah updateSEOMetadata
localSEOSchema();

advancedSEOOptimization();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();