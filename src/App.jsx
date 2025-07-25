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

// Impor halaman tambahan
import CMSPage from "./pages/CMS";
import CRMPage from "./pages/CRM";

const App = () => {
  // State untuk manajemen halaman dan pengaturan
  const [currentPage, setCurrentPage] = useState('home');
  const [landingPageData, setLandingPageData] = useState({});
  const [appSettings, setAppSettings] = useState({
    showFloatButton: false, // Ganti dari showSidebar
    isDeveloperMode: false
  });
  const [isLoading, setIsLoading] = useState(true);

  // Effect untuk inisialisasi aplikasi
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
      case 'contact':
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