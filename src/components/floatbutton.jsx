import React, { useState, useEffect } from 'react';
import { 
  FaCog, 
  FaHome, 
  FaDatabase, 
  FaAddressBook 
} from 'react-icons/fa';

const FloatButton = ({ onPageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setIsVisible(window.pageYOffset > 100);
    };

    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (page) => {
    onPageChange(page);
    setIsOpen(false);
  };

  const menuItems = [
    { 
      page: 'home', 
      label: 'Beranda', 
      icon: FaHome,
      color: 'text-green-500'
    },
    { 
      page: 'cms', 
      label: 'Manajemen Konten', 
      icon: FaDatabase,
      color: 'text-blue-500'
    },
    { 
      page: 'contact', 
      label: 'Hubungi Kami', 
      icon: FaAddressBook,
      color: 'text-purple-500'
    }
  ];

  return (
    <div 
      className={`
        fixed bottom-6 right-6 z-[9999] transition-all duration-500 
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
      `}
    >
      <div className="relative">
        <button 
          onClick={toggleMenu}
          className={`
            w-14 h-14 rounded-full bg-gradient-to-br 
            from-primary-500 to-primary-600 
            text-white shadow-float-button 
            flex items-center justify-center
            hover:scale-105 hover:shadow-xl
            transition-all duration-300
            focus:outline-none focus:ring-4 focus:ring-primary-200
            ${isOpen ? 'rotate-180' : ''}
          `}
        >
          <FaCog className="text-2xl" />
        </button>

        {isOpen && (
          <div 
            className="
              absolute bottom-[calc(100%+1rem)] right-0 
              w-72 bg-white 
              rounded-2xl shadow-2xl 
              border border-gray-100
              animate-float-menu
              overflow-hidden
            "
          >
            <div className="p-4 bg-gradient-to-r from-primary-50 to-white">
              <h3 className="text-lg font-semibold text-primary-800">
                Navigasi Cepat
              </h3>
              <p className="text-xs text-gray-500">
                Pilih halaman yang ingin Anda kunjungi
              </p>
            </div>
            
            <div className="space-y-1 p-2">
              {menuItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => handleNavigation(item.page)}
                  className="
                    w-full flex items-center gap-3 
                    px-3 py-2 rounded-lg
                    hover:bg-primary-50 
                    transition-colors duration-200
                  "
                >
                  <item.icon className={`${item.color} text-lg`} />
                  <span className="text-sm text-gray-700">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatButton;