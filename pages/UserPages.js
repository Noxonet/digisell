import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { products } from '../data';
import { Button } from '../components/UI';

// پروفایل
export const ProfilePage = () => {
  const [form, setForm] = useState({
    name: '', family: '', address: '', postalCode: '', phone: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('profile', JSON.stringify(form));
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6">اطلاعات ارسال</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-4">
          <input name="name" onChange={handleChange} placeholder="نام" className="p-3 border rounded-lg" required />
          <input name="family" onChange={handleChange} placeholder="نام خانوادگی" className="p-3 border rounded-lg" required />
          <input name="phone" onChange={handleChange} placeholder="شماره تلفن" className="p-3 border rounded-lg" required />
          <input name="postalCode" onChange={handleChange} placeholder="کد پستی" className="p-3 border rounded-lg" required />
          <input name="address" onChange={handleChange} placeholder="آدرس کامل" className="p-3 border rounded-lg md:col-span-2" required />
        </div>
        <Button type="submit" className="w-full mt-6">ذخیره و ادامه</Button>
      </form>
    </div>
  );
};

// پرداخت
export const PaymentPage = () => {
  const { productId } = useParams();
  const product = products.find(p => p.id === parseInt(productId));
  const [receipt, setReceipt] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/order-confirmation');
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">جزئیات سفارش</h2>
        <img src={product.image} alt="" className="w-full h-48 object-cover rounded-lg mb-4" />
        <p className="font-medium">{product.name}</p>
        <p className="text-2xl font-bold text-red-600 mt-2">{product.price.toLocaleString()} تومان</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">اطلاعات پرداخت (واریز به کارت)</h2>
        <div className="bg-yellow-50 p-4 rounded-lg mb-6 text-sm">
          <p><strong>شماره کارت:</strong> 6037-9911-2233-4455</p>
          <p><strong>به نام:</strong> فروشگاه دیجی‌کالا کلون</p>
          <p><strong>بانک:</strong> ملت</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="شماره کارت (اختیاری)" className="w-full p-3 border rounded-lg mb-4" />
          <input type="text" placeholder="نام صاحب کارت (اختیاری)" className="w-full p-3 border rounded-lg mb-4" />
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">آپلود فیش واریز</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setReceipt(e.target.files[0])}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>
          <Button type="submit" className="w-full">ثبت سفارش</Button>
        </form>
      </div>
    </div>
  );
};

// تأیید سفارش
export const OrderConfirmationPage = () => (
  <div className="text-center py-20 bg-white rounded-2xl shadow-lg max-w-lg mx-auto">
    <div className="text-green-600 text-6xl mb-4">✓</div>
    <h1 className="text-3xl font-bold mb-4">سفارش شما با موفقیت ثبت شد!</h1>
    <p className="text-lg text-gray-600 mb-6">تا ۳ روز کاری آینده به دستتان می‌رسد.</p>
    <Link to="/">
      <Button>بازگشت به فروشگاه</Button>
    </Link>
  </div>
);