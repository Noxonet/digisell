import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data';
import { ProductCard, Comment } from '../components/UI';

// صفحه خانه
export const HomePage = () => (
  <div>
    <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-8 rounded-2xl mb-8 text-center">
      <h1 className="text-4xl font-bold mb-2">به دیجی‌کالا کلون خوش آمدید!</h1>
      <p className="text-lg">بهترین محصولات با بهترین قیمت</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  </div>
);

// صفحه محصول
export const ProductDetailPage = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === parseInt(id));

  if (!product) return <div className="text-center py-20">محصول یافت نشد</div>;

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <img src={product.image} alt={product.name} className="w-full rounded-xl shadow-lg" />
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-3">{product.name}</h1>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < Math.floor(product.rating) ? "text-yellow-500" : "text-gray-300"}>★</span>
            ))}
          </div>
          <span className="text-sm text-gray-600">({product.reviews} نظر)</span>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <ul className="space-y-2 text-sm">
            {product.specs.map((spec, i) => (
              <li key={i} className="flex justify-between">
                <span className="text-gray-600">• {spec.split(':')[0]}</span>
                <span className="font-medium">{spec.split(':')[1]}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-gray-700 mb-6">{product.description}</p>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl font-bold text-red-600">{product.price.toLocaleString()} تومان</span>
          {product.oldPrice && (
            <span className="text-lg text-gray-500 line-through">{product.oldPrice.toLocaleString()}</span>
          )}
        </div>
        <Link to={`/payment/${product.id}`}>
          <button className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold text-lg transition">
            خرید محصول
          </button>
        </Link>

        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">نظرات کاربران</h2>
          {product.comments.map((c, i) => (
            <Comment key={i} comment={c} />
          ))}
        </div>
      </div>
    </div>
  );
};