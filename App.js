import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthPages } from './pages/AuthPages';
import { HomePage, ProductDetailPage } from './pages/ShopPages';
import { ProfilePage, PaymentPage, OrderConfirmationPage } from './pages/UserPages';

const Header = () => (
  <header className="bg-red-600 text-white shadow-lg">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">دیجی‌کالا کلون</Link>
      <nav className="flex gap-6 items-center">
        <Link to="/" className="hover:underline">خانه</Link>
        <Link to="/signup" className="hover:underline">ثبت‌نام</Link>
        <Link to="/profile" className="hover:underline">پروفایل</Link>
      </nav>
    </div>
  </header>
);

const Footer = () => (
  <footer className="bg-gray-900 text-white py-8 mt-16">
    <div className="container mx-auto px-4 text-center">
      <p>© ۱۴۰۴ دیجی‌کالا کلون - ساخته شده با عشق توسط Grok</p>
    </div>
  </footer>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<AuthPages />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/payment/:productId" element={<PaymentPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;