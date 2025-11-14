import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/UI';

export const AuthPages = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('user', JSON.stringify({ email, password }));
    navigate('/profile');
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">
        {isLogin ? 'ورود به حساب' : 'ثبت‌نام'}
      </h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="ایمیل"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-red-600"
          required
        />
        <input
          type="password"
          placeholder="رمز عبور"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-3 border rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-red-600"
          required
        />
        <Button type="submit" className="w-full">
          {isLogin ? 'ورود' : 'ثبت‌نام'}
        </Button>
      </form>
      <p className="text-center mt-4 text-sm">
        {isLogin ? 'حساب ندارید؟ ' : 'حساب دارید؟ '}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-red-600 font-medium hover:underline"
        >
          {isLogin ? 'ثبت‌نام کنید' : 'وارد شوید'}
        </button>
      </p>
    </div>
  );
};