'use client';

import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

const placeholderImage =
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80';

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();

  if (!item) return null;

  const itemTotal = Number(item.price) * item.quantity;

  return (
    <div className="flex flex-col sm:flex-row gap-4 border border-brand-gold/20 rounded-3xl p-4 bg-brand-white shadow-card">
      <div className="relative w-full sm:w-40 aspect-[4/3] rounded-2xl overflow-hidden">
        <Image
          src={item.mainImage || placeholderImage}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold text-brand-brown">{item.name}</h3>
            <p className="text-sm text-slate-500">اللون: {item.color}</p>
          </div>
          <button
            className="text-sm text-rose-500"
            onClick={() => removeItem(item.id)}
          >
            إزالة
          </button>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-brand-gold font-semibold text-lg">
            {formatPrice(item.price)}
          </p>
          <div className="flex items-center border border-brand-gold/60 rounded-full">
            <button
              type="button"
              className="px-3 py-1 text-lg"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
            >
              -
            </button>
            <span className="px-4 py-1 text-lg font-semibold">{item.quantity}</span>
            <button
              type="button"
              className="px-3 py-1 text-lg"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              +
            </button>
          </div>
        </div>
        <p className="text-sm text-slate-600">
          الإجمالي: {formatPrice(itemTotal)}
        </p>
      </div>
    </div>
  );
}

