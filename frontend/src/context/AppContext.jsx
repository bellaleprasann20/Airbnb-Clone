import React, { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = "http://localhost:5000";

  // --- CURRENCY STATE ---
  const [currency, setCurrency] = useState(() => {
    const saved = localStorage.getItem('currency');
    return saved ? JSON.parse(saved) : { code: 'INR', symbol: '₹', rate: 1 };
  });

  // --- LANGUAGE STATE ---
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'English');

  // --- TRANSLATIONS ---
  const translations = {
    English: {
      welcome: "Welcome",
      search: "Search",
      anywhere: "Anywhere",
      anyWeek: "Any week",
      addGuests: "Add guests",
      trips: "Trips",
      wishlist: "Wishlist",
      login: "Log in",
      signup: "Sign up",
      logout: "Log out",
      airbnbYourHome: "Airbnb your home",
      helpCenter: "Help Center",
      accountSettings: "Account Settings",
      manageListings: "Manage Listings",
      perNight: "per night",
      total: "Total",
      guests: "guests",
      bedrooms: "bedrooms",
      beds: "beds",
      bathrooms: "bathrooms"
    },
    हिन्दी: {
      welcome: "स्वागत है",
      search: "खोजें",
      anywhere: "कहीं भी",
      anyWeek: "कोई भी सप्ताह",
      addGuests: "अतिथि जोड़ें",
      trips: "यात्राएं",
      wishlist: "पसंदीदा",
      login: "लॉग इन करें",
      signup: "साइन अप करें",
      logout: "लॉग आउट",
      airbnbYourHome: "अपना घर Airbnb करें",
      helpCenter: "सहायता केंद्र",
      accountSettings: "खाता सेटिंग्स",
      manageListings: "लिस्टिंग प्रबंधित करें",
      perNight: "प्रति रात",
      total: "कुल",
      guests: "अतिथि",
      bedrooms: "बेडरूम",
      beds: "बिस्तर",
      bathrooms: "बाथरूम"
    },
    Español: {
      welcome: "Bienvenido",
      search: "Buscar",
      anywhere: "Cualquier lugar",
      anyWeek: "Cualquier semana",
      addGuests: "Añadir huéspedes",
      trips: "Viajes",
      wishlist: "Lista de deseos",
      login: "Iniciar sesión",
      signup: "Registrarse",
      logout: "Cerrar sesión",
      airbnbYourHome: "Pon tu casa en Airbnb",
      helpCenter: "Centro de ayuda",
      accountSettings: "Configuración de la cuenta",
      manageListings: "Gestionar anuncios",
      perNight: "por noche",
      total: "Total",
      guests: "huéspedes",
      bedrooms: "habitaciones",
      beds: "camas",
      bathrooms: "baños"
    },
    Français: {
      welcome: "Bienvenue",
      search: "Rechercher",
      anywhere: "N'importe où",
      anyWeek: "N'importe quelle semaine",
      addGuests: "Ajouter des voyageurs",
      trips: "Voyages",
      wishlist: "Liste de souhaits",
      login: "Se connecter",
      signup: "S'inscrire",
      logout: "Se déconnecter",
      airbnbYourHome: "Mettez votre logement sur Airbnb",
      helpCenter: "Centre d'aide",
      accountSettings: "Paramètres du compte",
      manageListings: "Gérer les annonces",
      perNight: "par nuit",
      total: "Total",
      guests: "voyageurs",
      bedrooms: "chambres",
      beds: "lits",
      bathrooms: "salles de bain"
    },
    中文: {
      welcome: "欢迎",
      search: "搜索",
      anywhere: "任何地方",
      anyWeek: "任何一周",
      addGuests: "添加房客",
      trips: "旅行",
      wishlist: "心愿单",
      login: "登录",
      signup: "注册",
      logout: "退出登录",
      airbnbYourHome: "出租您的房源",
      helpCenter: "帮助中心",
      accountSettings: "账户设置",
      manageListings: "管理房源",
      perNight: "每晚",
      total: "总计",
      guests: "房客",
      bedrooms: "卧室",
      beds: "床",
      bathrooms: "浴室"
    },
    日本語: {
      welcome: "ようこそ",
      search: "検索",
      anywhere: "どこでも",
      anyWeek: "いつでも",
      addGuests: "ゲストを追加",
      trips: "旅行",
      wishlist: "ウィッシュリスト",
      login: "ログイン",
      signup: "新規登録",
      logout: "ログアウト",
      airbnbYourHome: "お部屋を貸し出す",
      helpCenter: "ヘルプセンター",
      accountSettings: "アカウント設定",
      manageListings: "リスティングを管理",
      perNight: "泊",
      total: "合計",
      guests: "ゲスト",
      bedrooms: "寝室",
      beds: "ベッド",
      bathrooms: "バスルーム"
    }
  };

  // --- AUTO-LOGIN LOGIC ---
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success) {
          setUser(data.user); 
        } else {
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (err) {
        console.error("Auto-login failed:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // --- CURRENCY CONVERSION FUNCTION ---
  const convertPrice = (priceInINR) => {
    return (priceInINR * currency.rate).toFixed(2);
  };

  // --- FORMAT PRICE WITH SYMBOL ---
  const formatPrice = (priceInINR) => {
    const convertedPrice = convertPrice(priceInINR);
    return `${currency.symbol}${convertedPrice}`;
  };

  // --- CHANGE CURRENCY ---
  const changeCurrency = (code) => {
    const rates = { INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.009 };
    const symbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
    const newCurrency = { code, symbol: symbols[code], rate: rates[code] };
    setCurrency(newCurrency);
    localStorage.setItem('currency', JSON.stringify(newCurrency));
  };

  // --- GET TRANSLATION ---
  const t = (key) => {
    return translations[language]?.[key] || translations['English'][key] || key;
  };

  // --- CHANGE LANGUAGE ---
  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  // --- LOGOUT ---
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AppContext.Provider value={{ 
      user, 
      setUser, 
      loading, 
      API_BASE_URL,
      currency, 
      changeCurrency,
      convertPrice,
      formatPrice,
      language, 
      changeLanguage,
      t,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
export default AppContext;