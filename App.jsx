import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, User, Menu, Truck, Shield, Star, Mail, Instagram, Twitter, CheckCircle, Package, CreditCard, MapPin, FileText, Loader2, Filter, Heart, Minus, Plus, Trash2, ChevronLeft, ChevronRight, X, Home, ChevronDown, ChevronUp, LogOut, Settings, Bell, Edit2, Eye, EyeOff } from 'lucide-react';

// === IndexedDB Setup ===
const DB_NAME = 'NadiKalaDB';
const DB_VERSION = 1;
const STORES = { cart: 'cart', user: 'user' };

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      Object.values(STORES).forEach(store => {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store, { keyPath: 'id' });
        }
      });
    };
  });
};

const dbAction = async (storeName, mode, action) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    const request = action(store);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// === داده‌های محصولات (۴ محصول NadiKala) ===
const products = [
  {
    id: 143,
    name: "چراغ قوه اضطراری چندکاره LED 3W",
    price: "145,000",
    oldPrice: "180,000",
    discount: "19%",
    image: "https://nadikala.ir/images/46350904139154713281.jpg",
    images: ["https://nadikala.ir/images/46350904139154713281.jpg", "https://nadikala.ir/images/30058216667998769028.jpg"],
    rating: 4.5,
    reviews: 12,
    seller: "DigiVersel",
    warranty: "تضمین سلامت و اصالت کالا",
    category: "ابزار و تجهیزات",
    specs: ["نوع: چراغ قوه اضطراری چندکاره", "قدرت لامپ: 3 وات LED"],
    description: "چراغ قوه اضطراری چندکاره با نور LED قوی، مناسب برای کمپینگ، سفر و مواقع قطع برق.",
    comments: [{ user: "محمد", text: "نور قوی و باتری خوبی داره.", rating: 5, date: "۱۴۰۴/۰۸/۱۰" }]
  },
  {
    id: 595,
    name: "حشره کش برقی قابل حمل USB با لامپ UV",
    price: "390,000",
    oldPrice: "490,000",
    discount: "20%",
    image: "https://nadikala.ir/images/22865777177746833685.jpg",
    images: ["https://nadikala.ir/images/22865777177746833685.jpg","https://nadikala.ir/images/34870898273444315668.jpg","https://nadikala.ir/images/74550255785419784267.jpg","https://nadikala.ir/images/26285423611690326238.jpg","https://nadikala.ir/images/26749717595454282344.jpg","https://nadikala.ir/images/1676757191494953787.jpg","https://nadikala.ir/images/tpl/22865777177746833685.jpg","https://nadikala.ir/images/tpl/34870898273444315668.jpg","https://nadikala.ir/images/tpl/74550255785419784267.jpg","https://nadikala.ir/images/tpl/26285423611690326238.jpg","https://nadikala.ir/images/tpl/26749717595454282344.jpg","https://nadikala.ir/images/tpl/1676757191494953787.jpg"],
    rating: 4.7,
    reviews: 28,
    seller: "DigiVersel",
    warranty: "تضمین سلامت و اصالت کالا",
    category: "ابزار و تجهیزات",
    specs: ["ابعاد: 3.5 × 9.7 × 17 سانتی‌متر", "اتصال: USB"],
    description: "حشره کش برقی قابل حمل با لامپ UV برای جذب پشه و حشرات.",
    comments: [{ user: "امیر", text: "پشه‌ها رو سریع می‌کشه.", rating: 5, date: "۱۴۰۴/۰۸/۱۲" }]
  },
  {
    id: 126,
    name: "آداپتور مسافرتی همه کاره بین‌المللی",
    price: "145,000",
    oldPrice: "195,000",
    discount: "25%",
    image: "https://nadikala.ir/images/86861577061438282624.jpg",
    images: ["https://nadikala.ir/images/86861577061438282624.jpg","https://nadikala.ir/images/37489676134942018240.jpg","https://nadikala.ir/images/4453714537741986437.jpg","https://nadikala.ir/images/67493448226704240547.jpg","https://nadikala.ir/images/50244632186924993807.jpg","https://nadikala.ir/images/5604323876503296101.jpg","https://nadikala.ir/images/tpl/86861577061438282624.jpg","https://nadikala.ir/images/tpl/37489676134942018240.jpg","https://nadikala.ir/images/tpl/4453714537741986437.jpg","https://nadikala.ir/images/tpl/67493448226704240547.jpg","https://nadikala.ir/images/tpl/50244632186924993807.jpg","https://nadikala.ir/images/tpl/5604323876503296101.jpg"],
    rating: 4.8,
    reviews: 45,
    seller: "DigiVersel",
    warranty: "تضمین سلامت و اصالت کالا",
    category: "ابزار و تجهیزات",
    specs: ["ابعاد: 4 × 5 × 7.5 سانتی‌متر", "ولتاژ: 110-250V"],
    description: "آداپتور مسافرتی همه کاره با محافظ ولتاژ.",
    comments: [{ user: "نیما", text: "همه پریزها رو داره.", rating: 5, date: "۱۴۰۴/۰۸/۰۹" }]
  },
  {
    id: 164,
    name: "لامپ خورشیدی کمپینگ آویز دار SL2029",
    price: "495,000",
    oldPrice: "620,000",
    discount: "20%",
    image: "https://nadikala.ir/images/26889541163443118047.jpg",
    images: ["https://nadikala.ir/images/26889541163443118047.jpg","https://nadikala.ir/images/13042803739771344073.jpg","https://nadikala.ir/images/85438118095937558081.jpg","https://nadikala.ir/images/46566176838461075526.jpg","https://nadikala.ir/images/828519277539022613.jpg","https://nadikala.ir/images/77338523687126066668.jpg","https://nadikala.ir/images/85124133308105639089.jpg","https://nadikala.ir/images/tpl/26889541163443118047.jpg","https://nadikala.ir/images/tpl/13042803739771344073.jpg","https://nadikala.ir/images/tpl/85438118095937558081.jpg","https://nadikala.ir/images/tpl/46566176838461075526.jpg","https://nadikala.ir/images/tpl/828519277539022613.jpg","https://nadikala.ir/images/tpl/77338523687126066668.jpg","https://nadikala.ir/images/tpl/85124133308105639089.jpg"],
    rating: 4.6,
    reviews: 19,
    seller: "DigiVersel",
    warranty: "تضمین سلامت و اصالت کالا",
    category: "ابزار و تجهیزات",
    specs: ["حالت نوردهی: 5 حالت", "شارژ: پنل خورشیدی + کابل USB"],
    description: "لامپ خورشیدی کمپینگ آویز دار با باتری قابل شارژ.",
    comments: [{ user: "پریسا", text: "نور قوی، شارژ خورشیدی عالی.", rating: 5, date: "۱۴۰۴/۰۸/۰۷" }]
  }
];

const banners = [
  { title: "تخفیف ویژه ابزار کمپینگ", subtitle: "تا ۲۵٪ تخفیف", color: "from-purple-600 to-pink-600" },
  { title: "لوازم سفر و طبیعت‌گردی", subtitle: "ارسال رایگان", color: "from-green-600 to-teal-600" },
  { title: "تجهیزات کمپینگ حرفه‌ای", subtitle: "گارانتی اصالت", color: "from-blue-600 to-cyan-600" },
];

const categories = [
  { name: "ابزار و تجهیزات", icon: "https://www.digikala.com/statics/img/svg/category/tools.svg", link: "/category/tools", sub: ["چراغ قوه", "حشره کش"] },
  { name: "سفر و کمپینگ", icon: "https://www.digikala.com/statics/img/svg/category/sports.svg", link: "/category/camping", sub: ["چراغ کمپینگ", "آداپتور مسافرتی"] },
];

// === کامپوننت‌های مشترک ===
const ProductCard = ({ product, onAddToCart }) => (
  <motion.div whileHover={{ y: -4, scale: 1.01 }} className="bg-white rounded-2xl sm:rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
    <Link to={`/product/${product.id}`} className="block">
      <div className="relative overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-40 sm:h-48 md:h-56 object-cover group-hover:scale-110 transition-transform duration-500" />
        {product.discount && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-red-600 to-pink-600 text-white text-xs px-2 py-1 rounded-full shadow-md font-shabnam font-bold">
            {product.discount} تخفیف
          </div>
        )}
      </div>
      <div className="p-3 sm:p-5">
        <h3 className="text-sm sm:text-base md:text-lg line-clamp-2 h-12 sm:h-14 mb-2 sm:mb-3 group-hover:text-red-600 transition-colors font-vazirmatn leading-tight">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          <span className="text-yellow-500 text-sm">{'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}</span>
          <span className="text-xs text-gray-500 font-Rubik">({product.reviews})</span>
        </div>
        <div className="text-xs text-gray-500 font-Rubik mb-2 sm:mb-3 line-clamp-1">
          <span>{product.seller}</span>
          <span className="mx-1">•</span>
          <span>{product.warranty}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-lg sm:text-xl md:text-2xl font-yekan font-bold text-red-600">{product.price}</span>
            <span className="text-xs text-gray-400 mr-1">تومان</span>
          </div>
          {product.oldPrice && <span className="text-xs text-gray-400 line-through font-Rubik hidden sm:block">{product.oldPrice}</span>}
        </div>
      </div>
    </Link>
    <button 
      onClick={() => onAddToCart(product)} 
      className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-2 sm:py-3 font-bold rounded-b-2xl sm:rounded-b-3xl hover:from-red-700 hover:to-pink-700 transition text-xs sm:text-base"
    >
      افزودن به سبد خرید
    </button>
  </motion.div>
);

const Button = ({ children, onClick, type = "button", variant = "red", className = "", loading = false, icon: Icon }) => {
  const variants = {
    red: "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg",
    outline: "border-2 border-red-600 text-red-600 hover:bg-red-50",
    white: "bg-white text-gray-800 hover:bg-gray-50 border"
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`px-4 sm:px-6 py-2 sm:py-3 rounded-2xl text-sm sm:text-base font-bold transition-all flex items-center justify-center gap-2 ${variants[variant]} ${className} ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
    >
      {loading && <Loader2 className="animate-spin" size={18} />}
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

const Drawer = ({ open, onClose, children, direction = "right" }) => {
  const variants = {
    right: { x: 0, opacity: 1 },
    left: { x: 0, opacity: 1 },
    hidden: direction === "right" ? { x: "100%", opacity: 0 } : { x: "-100%", opacity: 0 }
  };
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black bg-opacity-50 z-50" />
          <motion.div
            initial="hidden"
            animate="right"
            exit="hidden"
            variants={variants}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed top-0 ${direction === "right" ? "right-0" : "left-0"} bottom-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto`}
          >
            <div className="p-4 sm:p-6">
              <button onClick={onClose} className="absolute top-4 sm:top-6 left-4 sm:left-6 text-gray-500 hover:text-gray-700"><X size={20} /></button>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// === کامپوننت‌های اضافی ===
const LoadingBar = () => {
  const [width, setWidth] = useState(0);
  const location = useLocation();
  useEffect(() => {
    setWidth(0);
    const timer = setTimeout(() => setWidth(100), 100);
    return () => clearTimeout(timer);
  }, [location]);
  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50">
      <motion.div
        className="h-full bg-gradient-to-r from-red-600 to-pink-600"
        initial={{ width: 0 }}
        animate={{ width: `${width}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
};

const SkeletonLoader = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-white rounded-2xl sm:rounded-3xl p-4 animate-pulse">
        <div className="bg-gray-200 h-40 sm:h-56 rounded-xl sm:rounded-2xl mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    ))}
  </div>
);

const CartDrawer = ({ cart, updateQuantity, removeFromCart, getTotalPrice, onClose }) => {
  const navigate = useNavigate();
  if (cart.length === 0) {
    return (
      <div className="text-center py-10 sm:py-20">
        <ShoppingCart size={50} className="mx-auto text-gray-300 mb-4" />
        <p className="text-base sm:text-lg text-gray-500 font-Rubik">سبد خرید شما خالی است.</p>
        <Button onClick={onClose} className="mt-4">بستن</Button>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg sm:text-xl font-vazirmatn font-bold mb-4">سبد خرید ({cart.length})</h3>
      <div className="space-y-3 max-h-64 sm:max-h-80 overflow-y-auto">
        {cart.map(item => (
          <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
            <img src={item.image} alt="" className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg" />
            <div className="flex-1 min-w-0">
              <p className="font-vazirmatn text-xs sm:text-sm line-clamp-2 leading-tight">{item.name}</p>
              <p className="text-red-600 font-bold text-sm">{(parseInt(item.price.replace(/,/g, '')) * item.quantity).toLocaleString()} تومان</p>
              <div className="flex items-center gap-2 mt-1">
                <button onClick={() => updateQuantity(item.id, -1)} className="p-1 border rounded hover:bg-gray-100">
                  <Minus size={12} />
                </button>
                <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)} className="p-1 border rounded hover:bg-gray-100">
                  <Plus size={12} />
                </button>
                <button onClick={() => removeFromCart(item.id)} className="ml-auto text-red-600 hover:text-red-700">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t pt-4 mt-4">
        <p className="text-lg font-bold text-red-600">جمع: {getTotalPrice()} تومان</p>
        <Button onClick={() => { onClose(); navigate('/checkout/address'); }} className="w-full mt-3">
          تسویه حساب
        </Button>
      </div>
    </div>
  );
};

const MobileMenu = ({ setMenuOpen }) => (
  <div className="space-y-6">
    <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 text-base font-Rubik">
      <User size={20} /> پروفایل
    </Link>
    <Link to="/cart" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 text-base font-Rubik">
      <ShoppingCart size={20} /> سبد خرید
    </Link>
    <div className="border-t pt-6">
      <p className="font-vazirmatn font-bold mb-4">دسته‌بندی‌ها</p>
      {categories.map(cat => (
        <Link key={cat.name} to={cat.link} onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 hover:text-red-600 font-Rubik">
          {cat.name}
        </Link>
      ))}
    </div>
  </div>
);

const ScrollToTop = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return show ? (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-16 sm:bottom-20 right-4 sm:right-6 bg-red-600 text-white p-2 rounded-full shadow-lg z-40 hover:bg-red-700 transition"
    >
      <ChevronUp size={18} />
    </button>
  ) : null;
};

// === هدر و فوتر ===
const Header = ({ cartCount, searchQuery, setSearchQuery, filteredProducts, setCartOpen, setMenuOpen, user, logout }) => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  
  return (
    <header className="bg-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Top Bar - Hidden on mobile */}
        <div className="hidden sm:flex items-center justify-between py-3 text-sm text-gray-600 border-b font-Rubik">
          <div className="flex gap-4 sm:gap-6">
            <span className="flex items-center gap-1"><Truck size={16} />ارسال رایگان بالای ۱ میلیون</span>
            <span className="flex items-center gap-1"><Shield size={16} />گارانتی اصالت کالا</span>
          </div>
          <div className="flex gap-4 items-center">
            {user ? (
              <>
                <Link to="/profile" className="flex items-center gap-2 hover:text-red-600 transition">
                  <User size={16} /> {user.name}
                </Link>
                <button onClick={logout} className="text-red-600 hover:text-red-700 transition">
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-red-600 transition">ورود</Link>
                <span>|</span>
                <Link to="/signup" className="hover:text-red-600 transition">ثبت‌نام</Link>
              </>
            )}
          </div>
        </div>
        
        {/* Main Header */}
        <div className="flex items-center justify-between py-3 gap-3">
          {/* Logo Section */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-2 rounded-xl shadow-lg">
                <ShoppingCart size={18} />
              </div>
              <span className="text-base sm:text-lg md:text-xl font-vazirmatn font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                DigiVersel
              </span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block relative group flex-1 max-w-md mx-4">
            <input
              type="text"
              placeholder="جستجو در DigiVersel..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pr-12 pl-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition font-Rubik text-sm group-hover:border-red-400"
            />
            <Search className="absolute left-4 top-2 text-gray-400 group-hover:text-red-500 transition" size={16} />
            {searchQuery && filteredProducts.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white shadow-2xl rounded-xl mt-1 p-2 max-h-64 overflow-y-auto z-50 border">
                {filteredProducts.slice(0, 5).map(p => (
                  <Link to={`/product/${p.id}`} key={p.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg" onClick={() => setSearchQuery('')}>
                    <img src={p.image} alt="" className="w-8 h-8 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-Rubik truncate">{p.name}</p>
                      <p className="text-xs text-red-600">{p.price} تومان</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Actions Section */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Mobile Search Button */}
            <button 
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="md:hidden text-gray-700 hover:text-red-600 transition"
            >
              <Search size={18} />
            </button>
            
            {/* Cart */}
            <button onClick={() => setCartOpen(true)} className="relative group">
              <ShoppingCart size={18} className="text-gray-700 group-hover:text-red-600 transition" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-600 to-pink-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center shadow-md">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>
            
            {/* User Profile - Hidden on mobile */}
            <Link to="/profile" className="hidden sm:block group">
              <User size={18} className="text-gray-700 group-hover:text-red-600 transition" />
            </Link>
            
            {/* Mobile Menu */}
            <button onClick={() => setMenuOpen(true)} className="lg:hidden">
              <Menu size={18} />
            </button>
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="md:hidden pb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="جستجو در DigiVersel..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition font-Rubik text-sm"
              />
              <Search className="absolute left-4 top-2 text-gray-400" size={14} />
              <button 
                onClick={() => setShowMobileSearch(false)}
                className="absolute right-3 top-2 text-gray-500 hover:text-red-600"
              >
                <X size={14} />
              </button>
            </div>
            {searchQuery && filteredProducts.length > 0 && (
              <div className="absolute left-2 right-2 bg-white shadow-2xl rounded-xl mt-1 p-2 max-h-48 overflow-y-auto z-50 border">
                {filteredProducts.slice(0, 5).map(p => (
                  <Link to={`/product/${p.id}`} key={p.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg" onClick={() => {
                    setSearchQuery('');
                    setShowMobileSearch(false);
                  }}>
                    <img src={p.image} alt="" className="w-8 h-8 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-Rubik truncate">{p.name}</p>
                      <p className="text-xs text-red-600">{p.price} تومان</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

const Footer = () => (
  <footer className="bg-gradient-to-b from-gray-900 to-black text-white mt-10 sm:mt-20">
    <div className="container mx-auto px-4 py-10 sm:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        <div className="md:col-span-2 lg:col-span-1">
          <h3 className="text-lg sm:text-xl font-vazirmatn font-bold mb-3 sm:mb-4 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            DigiVersel
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-Rubik">
            فروشگاه تخصصی تجهیزات کمپینگ، سفر و ابزارهای کاربردی با بهترین کیفیت.
          </p>
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-vazirmatn font-bold mb-3 sm:mb-4">لینک‌های سریع</h3>
          <ul className="space-y-2 text-xs sm:text-sm text-gray-400 font-Rubik">
            <li><Link to="/about" className="hover:text-red-500 transition">درباره ما</Link></li>
            <li><Link to="/contact" className="hover:text-red-500 transition">تماس با ما</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-vazirmatn font-bold mb-3 sm:mb-4">دسته‌بندی‌ها</h3>
          <ul className="space-y-2 text-xs sm:text-sm text-gray-400 font-Rubik">
            <li><Link to="/category/tools" className="hover:text-red-500 transition">ابزار و تجهیزات</Link></li>
            <li><Link to="/category/camping" className="hover:text-red-500 transition">سفر و کمپینگ</Link></li>
          </ul>
        </div>
        <div className="md:col-span-2 lg:col-span-1">
          <h3 className="text-base sm:text-lg font-vazirmatn font-bold mb-3 sm:mb-4">خبرنامه</h3>
          <p className="text-xs sm:text-sm text-gray-400 mb-3 font-Rubik">تخفیف‌ها و محصولات جدید را دریافت کنید</p>
          <div className="flex">
            <input 
              type="email" 
              placeholder="ایمیل شما" 
              className="flex-1 px-3 sm:px-4 py-2 rounded-l-xl text-gray-900 text-xs sm:text-sm font-Rubik focus:outline-none" 
            />
            <button className="bg-gradient-to-r from-red-600 to-pink-600 px-3 sm:px-4 py-2 rounded-r-xl hover:from-red-700 hover:to-pink-700 transition">
              <Mail size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs sm:text-sm text-gray-500 font-Rubik">
        <p>© ۱۴۰۴ دیجی ورسل - تمامی حقوق محفوظ است</p>
      </div>
    </div>
  </footer>
);

// === صفحات ===
const HomePage = ({ products, onAddToCart }) => (
  <div className="px-3 sm:px-4">
    {/* Banner Slider */}
    <div className="relative overflow-hidden rounded-xl mb-6 sm:mb-8 shadow-xl">
      <div className="flex animate-slide">
        {[...banners, ...banners].map((b, i) => (
          <div key={i} className={`min-w-full h-48 sm:h-64 md:h-80 bg-gradient-to-r ${b.color} flex items-center justify-center text-white relative overflow-hidden`}>
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="relative z-10 text-center px-4">
              <motion.h1 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ delay: 0.2 }} 
                className="text-xl sm:text-2xl md:text-4xl font-vazirmatn font-bold mb-2 sm:mb-3"
              >
                {b.title}
              </motion.h1>
              <motion.p 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ delay: 0.4 }} 
                className="text-sm sm:text-base md:text-lg font-Rubik"
              >
                {b.subtitle}
              </motion.p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Categories */}
    <div className="mb-8 sm:mb-12">
      <h2 className="text-lg sm:text-xl md:text-2xl font-vazirmatn font-bold mb-4 sm:mb-6 text-center">
        دسته‌بندی‌های محبوب
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {categories.map((c, i) => (
          <motion.div 
            key={i} 
            whileHover={{ scale: 1.05 }} 
            className="bg-white p-3 sm:p-4 rounded-xl shadow-md text-center cursor-pointer hover:shadow-xl transition-all"
          >
            <img src={c.icon} alt={c.name} className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2" />
            <p className="text-xs sm:text-sm font-shabnam font-bold text-gray-800 leading-tight">
              {c.name}
            </p>
          </motion.div>
        ))}
      </div>
    </div>

    {/* Featured Products */}
    <div>
      <h2 className="text-lg sm:text-xl md:text-2xl font-vazirmatn font-bold mb-4 sm:mb-6 text-center">
        محصولات پرفروش
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {products.map((p, i) => (
          <motion.div 
            key={p.id} 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.1 }}
          >
            <ProductCard product={p} onAddToCart={onAddToCart} />
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

const ProductDetailPage = ({ onAddToCart }) => {
  const { id } = useParams();
  const product = products.find(p => p.id === parseInt(id));
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) return (
    <div className="text-center py-16 sm:py-24 font-vazirmatn text-lg sm:text-xl text-gray-500">
      محصول یافت نشد
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 mt-4 sm:mt-6 px-3 sm:px-4"
    >
      {/* Product Images */}
      <div>
        <motion.div 
          whileHover={{ scale: 1.02 }} 
          className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl mb-4"
        >
          <img 
            src={product.images[selectedImage]} 
            alt={product.name} 
            className="w-full rounded-xl sm:rounded-2xl" 
          />
        </motion.div>
        <div className="grid grid-cols-4 gap-2">
          {product.images.slice(0, 4).map((img, i) => (
            <button 
              key={i} 
              onClick={() => setSelectedImage(i)} 
              className={`rounded-lg overflow-hidden border-2 ${selectedImage === i ? 'border-red-600' : 'border-gray-200'}`}
            >
              <img src={img} alt="" className="w-full h-14 sm:h-16 object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="pb-16 sm:pb-0">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          className="text-xl sm:text-2xl md:text-3xl font-vazirmatn font-bold mb-4 text-gray-800"
        >
          {product.name}
        </motion.h1>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-1 text-base sm:text-lg">
            {[...Array(5)].map((_, i) => (
              <span 
                key={i} 
                className={i < Math.floor(product.rating) ? "text-yellow-500" : "text-gray-300"}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-gray-600 font-Rubik text-sm sm:text-base">
            ({product.reviews} نظر)
          </span>
        </div>

        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 sm:p-6 rounded-xl mb-6 shadow-inner">
          <h3 className="font-vazirmatn font-bold text-lg mb-3 text-gray-800">مشخصات کلیدی:</h3>
          <ul className="space-y-2">
            {product.specs.map((s, i) => (
              <li key={i} className="flex justify-between text-sm sm:text-base font-Rubik">
                <span className="text-gray-600">{s.split(':')[0]}</span>
                <span className="font-yekan font-bold text-red-600">{s.split(':')[1]}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-gray-700 leading-relaxed mb-6 font-Rubik text-sm sm:text-base">
          {product.description}
        </p>

        <div className="flex items-center gap-3 sm:gap-4 mb-6">
          <span className="text-2xl sm:text-3xl font-yekan font-bold text-red-600">{product.price}</span>
          <span className="text-sm text-gray-400">تومان</span>
          {product.oldPrice && (
            <span className="text-base text-gray-400 line-through font-Rubik">
              {product.oldPrice}
            </span>
          )}
        </div>

        {/* Desktop Add to Cart */}
        <div className="hidden sm:block">
          <Button 
            onClick={() => onAddToCart(product)} 
            className="w-full text-base py-3 shadow-lg" 
            icon={ShoppingCart}
          >
            افزودن به سبد خرید
          </Button>
        </div>
      </div>

      {/* Mobile Add to Cart */}
      <div className="sm:hidden fixed bottom-4 left-4 right-4 z-40">
        <Button 
          onClick={() => onAddToCart(product)} 
          className="w-full text-base py-3 shadow-xl" 
          icon={ShoppingCart}
        >
          افزودن به سبد خرید
        </Button>
      </div>
    </motion.div>
  );
};

const LoginPage = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const user = { id: 1, name: email.split('@')[0], email };
    setUser(user);
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto bg-white p-4 sm:p-6 rounded-xl shadow-xl mt-8 sm:mt-16 mx-3 sm:mx-auto">
      <h1 className="text-xl sm:text-2xl font-vazirmatn font-bold mb-6 text-center">ورود به حساب</h1>
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="ایمیل" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          className="w-full p-3 border rounded-xl mb-3 font-Rubik text-sm" 
          required 
        />
        <div className="relative">
          <input 
            type={showPass ? "text" : "password"} 
            placeholder="رمز عبور" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            className="w-full p-3 border rounded-xl mb-4 font-Rubik text-sm pr-12" 
            required 
          />
          <button 
            type="button" 
            onClick={() => setShowPass(!showPass)} 
            className="absolute left-3 top-3 text-gray-500"
          >
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <Button type="submit" className="w-full">ورود</Button>
      </form>
      <p className="text-center mt-4 text-xs sm:text-sm text-gray-600 font-Rubik">
        حساب ندارید؟ <Link to="/signup" className="text-red-600 hover:underline">ثبت‌نام کنید</Link>
      </p>
    </div>
  );
};

const SignUpPage = ({ setUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    const user = { id: Date.now(), name, email };
    setUser(user);
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto bg-white p-4 sm:p-6 rounded-xl shadow-xl mt-8 sm:mt-16 mx-3 sm:mx-auto">
      <h1 className="text-xl sm:text-2xl font-vazirmatn font-bold mb-6 text-center">ثبت‌نام</h1>
      <form onSubmit={handleSignup}>
        <input 
          type="text" 
          placeholder="نام کامل" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          className="w-full p-3 border rounded-xl mb-3 font-Rubik text-sm" 
          required 
        />
        <input 
          type="email" 
          placeholder="ایمیل" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          className="w-full p-3 border rounded-xl mb-3 font-Rubik text-sm" 
          required 
        />
        <div className="relative">
          <input 
            type={showPass ? "text" : "password"} 
            placeholder="رمز عبور" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            className="w-full p-3 border rounded-xl mb-4 font-Rubik text-sm pr-12" 
            required 
          />
          <button 
            type="button" 
            onClick={() => setShowPass(!showPass)} 
            className="absolute left-3 top-3 text-gray-500"
          >
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <Button type="submit" className="w-full">ثبت‌نام</Button>
      </form>
      <p className="text-center mt-4 text-xs sm:text-sm text-gray-600 font-Rubik">
        حساب دارید؟ <Link to="/login" className="text-red-600 hover:underline">وارد شوید</Link>
      </p>
    </div>
  );
};

const ProfilePage = ({ user, setUser }) => {
  const navigate = useNavigate();
  const logout = () => {
    setUser(null);
    navigate('/');
  };

  if (!user) return (
    <div className="text-center py-16 text-gray-500">
      لطفاً وارد شوید.
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-white p-4 sm:p-6 rounded-xl shadow-xl mt-8 sm:mt-16 mx-3 sm:mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-vazirmatn font-bold">پروفایل کاربری</h1>
        <button onClick={logout} className="text-red-600 hover:text-red-700">
          <LogOut size={20} />
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl">
          <p className="text-sm sm:text-base font-Rubik mb-2">
            نام: <span className="font-bold">{user.name}</span>
          </p>
          <p className="text-sm sm:text-base font-Rubik">
            ایمیل: <span className="font-bold">{user.email}</span>
          </p>
        </div>
        <div className="space-y-3">
          <Link to="/orders" className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
            <Package size={16} />
            <span className="text-sm">سفارش‌های من</span>
          </Link>
          <Link to="/addresses" className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
            <MapPin size={16} />
            <span className="text-sm">آدرس‌ها</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

const AddressPage = ({ cart }) => {
  const navigate = useNavigate();
  return (
    <div className="max-w-2xl mx-auto bg-white p-4 sm:p-6 rounded-xl shadow-xl mt-8 sm:mt-16 mx-3 sm:mx-auto">
      <h1 className="text-xl sm:text-2xl font-vazirmatn font-bold mb-6">آدرس تحویل</h1>
      <input 
        type="text" 
        placeholder="نام و نام خانوادگی" 
        className="w-full p-3 border border-red-500 rounded-xl mb-3 font-Rubik text-sm" 
      />
      <input 
        type="text" 
        placeholder="شماره تماس" 
        className="w-full p-3 border border-red-500 rounded-xl mb-3 font-Rubik text-sm" 
      />
      <textarea 
        placeholder="آدرس کامل" 
        className="w-full p-3 border rounded-xl border-red-500 mb-4 font-Rubik text-sm h-32"
      ></textarea>
      <Button onClick={() => navigate('/checkout/payment')} className="w-full">
        ادامه
      </Button>
    </div>
  );
};

const PaymentPage = ({ getTotalPrice }) => {
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    if (!receipt) return;

    setLoading(true);

    const order = {
      id: Date.now(),
      date: new Date().toLocaleDateString('fa-IR'),
      status: 'در انتظار تأیید فیش',
      receipt: receipt.name,
      description
    };

    const orders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    orders.push(order);
    localStorage.setItem('userOrders', JSON.stringify(orders));

    setTimeout(() => {
      setLoading(false);
      navigate('/order-confirmation');
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-4 sm:p-6 rounded-xl shadow-xl mt-8 sm:mt-16 mx-3 sm:mx-auto">
      <h1 className="text-xl sm:text-2xl font-vazirmatn mb-6 text-center text-red-600">
        پرداخت سفارش
      </h1>
      
      <div className="bg-white border-2 border-red-500 p-4 rounded-xl mb-6">
        <h2 className="font-vazirmatn text-base sm:text-lg text-red-600 font-bold mb-3">
          واریز به کارت:
        </h2>
        <p className="font-Rubik text-sm sm:text-base my-2">
          <strong>شماره کارت:</strong> 6037-7012-0673-6826
        </p>
        <p className="font-Rubik text-sm sm:text-base my-2">
          <strong>به نام:</strong> بنیامین فلاح
        </p>
        <p className="font-Rubik text-sm sm:text-base my-2">
          <strong>مبلغ کل:</strong> {getTotalPrice()} تومان
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-vazirmatn mb-2 text-sm sm:text-base">
            آپلود فیش واریز *
          </label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={e => setReceipt(e.target.files[0])} 
            className="w-full p-3 border-2 border-red-500 rounded-xl font-Rubik text-sm" 
            required 
          />
        </div>
        <div>
          <label className="block font-vazirmatn mb-2 text-sm sm:text-base">
            توضیحات (اختیاری)
          </label>
          <textarea 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            placeholder="مثلاً: واریز ساعت ۱۴:۳۰ از کارت ملت" 
            className="w-full p-3 border-2 rounded-xl border-red-500 font-Rubik text-sm h-24 resize-none" 
          />
        </div>
        <Button type="submit" loading={loading} className="w-full">
          {loading ? 'در حال ثبت سفارش...' : 'ثبت سفارش و پرداخت'}
        </Button>
      </form>
    </div>
  );
};

const OrderConfirmationPage = () => (
  <motion.div 
    initial={{ scale: 0.8, opacity: 0 }} 
    animate={{ scale: 1, opacity: 1 }} 
    className="text-center py-12 sm:py-16 bg-white rounded-xl shadow-xl max-w-2xl mx-auto mt-8 sm:mt-16 mx-3 sm:mx-auto"
  >
    <CheckCircle className="mx-auto text-green-600 mb-4" size={50} />
    <h1 className="text-xl sm:text-2xl md:text-3xl font-vazirmatn mb-4">
      سفارش شما با موفقیت ثبت شد!
    </h1>
    <p className="text-sm sm:text-base text-gray-600 mb-6 font-Rubik">
      فیش شما در حال بررسی است. تا ۲۴ ساعت آینده وضعیت سفارش به شما اطلاع داده می‌شود.
    </p>
    <div className="flex justify-center">
      <Link to="/profile">
        <Button className="text-sm sm:text-base px-6 sm:px-8 py-2 sm:py-3">
          مشاهده سفارش در پروفایل
        </Button>
      </Link>
    </div>
  </motion.div>
);

// === اپ اصلی ===
export default function App() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [savedCart, savedUser] = await Promise.all([
          dbAction(STORES.cart, 'readonly', store => store.getAll()),
          dbAction(STORES.user, 'readonly', store => store.get('user'))
        ]);
        setCart(savedCart || []);
        setUser(savedUser || null);
        setLoading(false);
      } catch (err) {
        console.error("خطا در بارگذاری:", err);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!loading) {
      dbAction(STORES.cart, 'readwrite', store => {
        store.clear();
        cart.forEach(item => store.put(item));
      });
      if (user) {
        dbAction(STORES.user, 'readwrite', store => store.put({ ...user, id: 'user' }));
      }
    }
  }, [cart, user, loading]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      return existing
        ? prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + parseInt(item.price.replace(/,/g, '')) * item.quantity, 0).toLocaleString();
  };

  const logout = () => {
    setUser(null);
    dbAction(STORES.user, 'readwrite', store => store.delete('user'));
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
        <LoadingBar />
        <Header
          cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredProducts={filteredProducts}
          setCartOpen={setCartOpen}
          setMenuOpen={setMenuOpen}
          user={user}
          logout={logout}
        />
        <main className="flex-grow container mx-auto py-4 sm:py-6">
          <AnimatePresence mode="wait">
            {loading ? <SkeletonLoader /> : (
              <Routes>
                <Route path="/" element={<HomePage products={filteredProducts} onAddToCart={addToCart} />} />
                <Route path="/product/:id" element={<ProductDetailPage onAddToCart={addToCart} />} />
                <Route path="/login" element={<LoginPage setUser={setUser} />} />
                <Route path="/signup" element={<SignUpPage setUser={setUser} />} />
                <Route path="/profile" element={<ProfilePage user={user} setUser={setUser} />} />
                <Route path="/checkout/address" element={<AddressPage cart={cart} />} />
                <Route path="/checkout/payment" element={<PaymentPage getTotalPrice={getTotalPrice} />} />
                <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              </Routes>
            )}
          </AnimatePresence>
        </main>
        <Footer />
        <Drawer open={cartOpen} onClose={() => setCartOpen(false)}>
          <CartDrawer 
            cart={cart} 
            updateQuantity={updateQuantity} 
            removeFromCart={removeFromCart} 
            getTotalPrice={getTotalPrice} 
            onClose={() => setCartOpen(false)} 
          />
        </Drawer>
        <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} direction="left">
          <MobileMenu setMenuOpen={setMenuOpen} />
        </Drawer>
        <ScrollToTop />
      </div>
    </Router>
  );
}