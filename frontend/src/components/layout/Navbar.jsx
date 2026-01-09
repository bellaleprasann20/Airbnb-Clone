import React, { useState, useEffect, useRef } from 'react';
import { Search, Globe, Menu, X, Home, Heart, Settings, LogOut, Plane } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Get everything from AppContext including translation function
  const { user, currency, changeCurrency, language, changeLanguage, logout, t } = useApp();
  
  const [selectedCurrency, setSelectedCurrency] = useState(currency.code);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  
  const menuRef = useRef(null);
  const searchRef = useRef(null);

  // Update local state when context changes
  useEffect(() => {
    setSelectedCurrency(currency.code);
  }, [currency]);

  useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const currencies = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' }
  ];

  const languages = ['English', 'हिन्दी', 'Español', 'Français', '中文', '日本語'];

  const handleSavePreferences = () => {
    setIsLangModalOpen(false);
  };

  const handleCurrencyChange = (code) => {
    setSelectedCurrency(code);
    changeCurrency(code);
  };

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    changeLanguage(lang);
  };

  return (
    <>
      <header className={`fixed top-0 z-50 w-full bg-white transition-all duration-300 ${scrolled ? 'shadow-md' : 'border-b border-gray-200'}`}>
        <nav className={`relative ${isSearchExpanded ? 'pb-24' : ''}`}>
          <div className="max-w-[2520px] mx-auto px-4 sm:px-6 lg:px-20 h-20 flex items-center justify-between">
            
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 text-rose-500 min-w-[140px] group">
              <svg viewBox="0 0 32 32" className="h-8 w-8 fill-current transition-transform group-hover:scale-110">
                <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.224 0-4.556-1.258-6.709-3.386l-.257-.26-.172-.179h-.011l-.176.185c-2.044 2.1-4.39 3.641-6.641 3.641-3.629 0-6.44-2.552-6.44-6.478 0-1.32.327-2.618 1.013-4.01l.197-.385c.983-2.3 5.143-11.01 7.1-14.836l.533-1.025C12.537 1.963 13.992 1 16 1zm0 2c-1.239 0-2.053.539-2.987 2.21l-.523 1.008c-1.926 3.776-6.06 12.43-7.031 14.692l-.345.836c-.427 1.071-.573 1.655-.605 2.24l-.009.33v.206c0 2.897 1.921 4.478 4.441 4.478 1.517 0 3.125-1.003 4.633-2.551l.25-.262.325-.344a1 1 0 0 1 1.458.001l.325.344.25.262c1.508 1.548 3.116 2.551 4.633 2.551 2.52 0 4.357-1.785 4.357-4.478 0-.613-.122-1.218-.415-2.086l-.222-.614c-.971-2.262-5.105-10.916-7.03-14.692l-.524-1.008C18.053 3.539 17.24 3 16 3z"></path>
              </svg>
              <span className="hidden lg:block font-bold text-2xl tracking-tight">airbnb</span>
            </a>

            {/* Search Bar - NOW WITH TRANSLATIONS */}
            <div ref={searchRef} className={`absolute left-1/2 -translate-x-1/2 transition-all duration-300 ${isSearchExpanded ? 'top-24 w-[90%] max-w-[850px]' : 'top-4 w-auto'}`}>
              {!isSearchExpanded ? (
                <button
                  onClick={() => setIsSearchExpanded(true)}
                  className="flex items-center border border-gray-300 rounded-full py-2 pl-6 pr-2 shadow-sm hover:shadow-md transition-shadow bg-white"
                >
                  <div className="flex items-center divide-x divide-gray-300 text-sm font-semibold">
                    <span className="pr-4 text-gray-800">{t('anywhere')}</span>
                    <span className="px-4 text-gray-800">{t('anyWeek')}</span>
                    <span className="px-4 text-gray-500 font-normal">{t('addGuests')}</span>
                  </div>
                  <div className="bg-rose-500 p-2 rounded-full text-white ml-2">
                    <Search size={16} strokeWidth={3} />
                  </div>
                </button>
              ) : (
                <div className="bg-gray-50 border border-gray-300 rounded-full flex items-center shadow-2xl overflow-hidden">
                  <div className="flex-1 px-8 py-3 hover:bg-white rounded-full cursor-pointer transition-colors">
                    <p className="text-xs font-bold uppercase text-gray-700">Where</p>
                    <input
                      type="text"
                      placeholder={t('anywhere')}
                      className="bg-transparent text-sm outline-none w-full placeholder:text-gray-400"
                      autoFocus
                    />
                  </div>
                  <div className="flex-1 px-8 py-3 hover:bg-white rounded-full cursor-pointer border-x border-gray-300 transition-colors">
                    <p className="text-xs font-bold uppercase text-gray-700">Check in</p>
                    <input
                      type="date"
                      className="bg-transparent text-sm outline-none w-full"
                    />
                  </div>
                  <div className="flex-1 px-8 py-3 hover:bg-white rounded-full cursor-pointer transition-colors">
                    <p className="text-xs font-bold uppercase text-gray-700">Who</p>
                    <input
                      type="number"
                      placeholder={t('addGuests')}
                      className="bg-transparent text-sm outline-none w-full placeholder:text-gray-400"
                      min="1"
                    />
                  </div>
                  <div className="pr-3">
                    <button className="bg-rose-500 text-white flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm hover:bg-rose-600 transition-colors">
                      <Search size={18} strokeWidth={3} /> {t('search')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side Tools */}
            <div className="flex items-center gap-1 min-w-[140px] justify-end">
              <a
                href="/host"
                className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-gray-100 transition-colors"
              >
                {t('airbnbYourHome')}
              </a>
              
              <button
                onClick={() => setIsLangModalOpen(true)}
                className="p-3 rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <Globe size={18} />
                <span className="hidden sm:inline text-xs font-bold uppercase">{selectedCurrency}</span>
              </button>

              {/* User Menu Dropdown - WITH TRANSLATIONS */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-3 border border-gray-300 rounded-full py-1.5 pl-3 pr-1.5 hover:shadow-md transition-all ml-2 bg-white"
                >
                  <Menu size={18} />
                  <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-xl">
                    {user?.name?.[0]?.toUpperCase() || '👤'}
                  </div>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-3 w-[260px] bg-white border border-gray-200 rounded-2xl shadow-2xl py-2 overflow-hidden">
                    {!user ? (
                      <>
                        <a href="/login" className="block px-4 py-3 text-sm font-bold hover:bg-gray-50 transition-colors">
                          {t('login')}
                        </a>
                        <a href="/signup" className="block px-4 py-3 text-sm hover:bg-gray-50 transition-colors">
                          {t('signup')}
                        </a>
                        <hr className="my-2 border-gray-200" />
                        <a href="/host" className="block px-4 py-3 text-sm hover:bg-gray-50 transition-colors">
                          {t('airbnbYourHome')}
                        </a>
                        <a href="/help" className="block px-4 py-3 text-sm hover:bg-gray-50 transition-colors">
                          {t('helpCenter')}
                        </a>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                          <p className="text-sm font-bold truncate">{t('welcome')}, {user.name?.split(' ')[0]}! 👋</p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                        </div>
                        
                        <a href="/trips" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold hover:bg-gray-50 transition-colors">
                          <Plane size={18} className="text-gray-600" />
                          <span>{t('trips')}</span>
                        </a>
                        
                        <a href="/wishlist" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold hover:bg-gray-50 transition-colors">
                          <Heart size={18} className="text-gray-600" />
                          <span>{t('wishlist')}</span>
                        </a>
                        
                        <hr className="my-2 border-gray-200" />

                        {(user.role === 'host' || user.role === 'admin') && (
                          <a href="/my-listings" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 transition-colors">
                            <Home size={18} />
                            <span>{t('manageListings')}</span>
                          </a>
                        )}
                        
                        <a href="/host" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors">
                          <Home size={18} className="text-gray-600" />
                          <span>{t('airbnbYourHome')}</span>
                        </a>
                        
                        <a href="/profile" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors">
                          <Settings size={18} className="text-gray-600" />
                          <span>{t('accountSettings')}</span>
                        </a>
                        
                        <hr className="my-2 border-gray-200" />
                        
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-600 font-bold hover:bg-rose-50 transition-colors"
                        >
                          <LogOut size={18} />
                          <span>{t('logout')}</span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Language/Currency Modal */}
      {isLangModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-8 relative animate-in fade-in slide-in-from-bottom-4 duration-300">
            <button
              onClick={() => setIsLangModalOpen(false)}
              className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold mt-8 mb-2">Choose a language and currency</h2>
            <p className="text-gray-500 text-sm mb-8">Personalize your experience</p>
            
            {/* Language Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4">Language</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`p-4 border-2 rounded-xl hover:border-gray-900 transition-all text-left font-semibold ${
                      selectedLanguage === lang ? 'border-gray-900 bg-gray-50' : 'border-gray-200'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Currency Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4">Currency</h3>
              <div className="grid grid-cols-2 gap-3">
                {currencies.map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => handleCurrencyChange(curr.code)}
                    className={`p-4 border-2 rounded-xl hover:border-gray-900 transition-all text-left ${
                      selectedCurrency === curr.code ? 'border-gray-900 bg-gray-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{curr.symbol}</span>
                      <span className="font-bold">{curr.code}</span>
                    </div>
                    <p className="text-sm text-gray-600">{curr.name}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSavePreferences}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-4 rounded-xl font-bold text-base hover:from-rose-600 hover:to-pink-600 transition-all shadow-lg"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-20"></div>
    </>
  );
};

export default Navbar;