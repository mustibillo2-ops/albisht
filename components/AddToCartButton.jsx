'use client';

import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function AddToCartButton({ product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState('');

  const handleAdd = () => {
    if (!product) return;
    addItem(
      {
        id: product.id,
        name: product.nameAr,
        slug: product.slug,
        price: Number(product.price),
        mainImage: product.mainImage,
        color: product.color,
      },
      quantity
    );
    setStatus('تمت الإضافة إلى السلة');
    setTimeout(() => setStatus(''), 2500);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <label className="text-sm text-slate-600">الكمية</label>
        <div className="flex items-center border border-brand-gold/60 rounded-full">
          <button
            type="button"
            className="px-4 py-2 text-lg"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            -
          </button>
          <span className="px-4 py-2 text-lg font-semibold">{quantity}</span>
          <button
            type="button"
            className="px-4 py-2 text-lg"
            onClick={() => setQuantity((q) => q + 1)}
          >
            +
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={handleAdd}
        className="bg-brand-gold text-brand-black rounded-full py-3 font-semibold hover:bg-[#c1952d] transition-colors"
      >
        إضافة إلى السلة
      </button>
      {status && <p className="text-sm text-emerald-600">{status}</p>}
    </div>
  );
}

