import React, { useState, useEffect } from "react";
import { Navigation } from "./components/navigation";
import { Header } from "./components/header";
import { Services } from "./components/services";
import { Gallery } from "./components/gallery";
import { CustomerReview } from "./components/customers_reviews";
import { Footer } from "./components/footer";
import FloatButton from "./components/floatbutton";
import { fetchSettings } from "./services/apiService";
import JsonData from "./data/data.json";
import "./App.css";

// Import halaman tambahan
import CMSPage from "./pages/CMS";
import CRMPage from "./pages/CRM";

const App = () => {
  // State untuk manajemen halaman dan pengaturan
  const [currentPage, setCurrentPage] = useState('home');
  const [landingPageData, setLandingPageData] = useState({});
  const [appSettings, setAppSettings] = useState({
    showFloatButton: false,
    isDeveloperMode: false
  });
  const [isLoading, setIsLoading] = useState(true);

  // Effect untuk inisialisasi aplikasi dan update metadata dinamis
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const settings = await fetchSettings();

        // Gunakan nilai dari API atau fallback ke 0
        setAppSettings({
          showFloatButton: settings.developer === 1,
          isDeveloperMode: settings.developer === 1
        });

        setLandingPageData(JsonData);
        setIsLoading(false);

        // Update metadata berdasarkan halaman
        updatePageMetadata(currentPage);
      } catch (error) {
        console.error("Error initializing app:", error);

        // Fallback ke inisialisasi awal dengan developer mode 0
        setAppSettings({
          showFloatButton: false,
          isDeveloperMode: false
        });
        setLandingPageData(JsonData);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Fungsi untuk update metadata berdasarkan halaman
  const updatePageMetadata = (page) => {
    // Ambil data SEO dari JsonData untuk konsistensi
    const seoData = JsonData.SEO || {};
  
    const metadataMap = {
      'home': {
        title: seoData.title_SEO || "Jempolan Coffee & Eatery - Coffee Shop Jogja",
        description: seoData.description_SEO || "Selamat datang di Jempolan Coffee & Eatery, tempat nongkrong asyik di Jogja",
        keywords: seoData.keywords_SEO ? seoData.keywords_SEO.join(', ') : "coffee shop home, jempolan coffee beranda"
      },
      'cms': {
        title: "CMS - Jempolan Coffee & Eatery",
        description: "Halaman Manajemen Konten Jempolan Coffee & Eatery",
        keywords: "cms, manajemen konten"
      },
      'crm': {
        title: "CRM - Jempolan Coffee & Eatery",
        description: "Halaman Customer Relationship Management Konten Jempolan Coffee & Eatery",
        keywords: "crm, customer relationship management"
      }
    };
  
    const pageMetadata = metadataMap[page] || metadataMap['home'];
    
    // Update meta tags
    document.title = pageMetadata.title;
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = pageMetadata.description;
    
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) metaKeywords.content = pageMetadata.keywords;
  };

  // Effect untuk update metadata saat halaman berubah
  useEffect(() => {
    updatePageMetadata(currentPage);
  }, [currentPage]);

  // Render halaman berdasarkan state currentPage
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Header data={landingPageData.Header} />
            <Services data={landingPageData.Header} />
            <Gallery data={landingPageData.Gallery} />
            <CustomerReview />
          </>
        );
      case 'cms':
        return <CMSPage />;
      case 'crm':
        return <CRMPage />;
      default:
        return null;
    }
  };

  // Tampilan loading
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '20px'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      {renderPage()}
      {appSettings.showFloatButton && (
        <FloatButton onPageChange={setCurrentPage} />
      )}
      <Footer />
    </div>
  );
};

export default App;