import React from 'react';
import { Link } from 'react-router-dom';

// کارت محصول
export const ProductCard = ({ product }) => (
  <Link to={`/product/${product.id}`} className="block bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
    <div className="relative">
      <img src={product.image} alt={product.name} className="w-full h-64 object-cover group-hover:scale-105 transition" />
      {product.discount && (
        <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
          {product.discount} تخفیف
        </span>
      )}
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-lg line-clamp-2 h-14">{product.name}</h3>
      <div className="flex items-center gap-1 my-2">
        <span className="text-yellow-500">{'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}</span>
        <span className="text-xs text-gray-500">({product.reviews})</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-red-600">{product.price.toLocaleString()} تومان</span>
        {product.oldPrice && (
          <span className="text-sm text-gray-500 line-through">{product.oldPrice.toLocaleString()}</span>
        )}
      </div>
    </div>
  </Link>
);

// کامنت
export const Comment = ({ comment }) => (
  <div className="bg-gray-50 p-4 rounded-lg mb-3">
    <div className="flex justify-between items-start">
      <div>
        <p className="font-medium">{comment.user}</p>
        <p className="text-sm text-gray-600">{comment.date}</p>
      </div>
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < comment.rating ? "text-yellow-500" : "text-gray-300"}>★</span>
        ))}
      </div>
    </div>
    <p className="mt-2 text-gray-700">{comment.text}</p>
  </div>
);

// دکمه
export const Button = ({ children, onClick, type = "button", variant = "red", className = "" }) => {
  const variants = {
    red: "bg-red-600 hover:bg-red-700 text-white",
    outline: "border border-red-600 text-red-600 hover:bg-red-50"
  };
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-6 py-3 rounded-lg font-medium transition ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};