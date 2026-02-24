'use client';

import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export default function OrderSummary({ onCheckout, isSubmitting }) {
  const { subtotal, items } = useCart();
  const shipping = items.length ? 45 : 0;
  const total = subtotal + shipping;

  return (
    <div className="bg-brand-white border border-brand-gold/30 rounded-3xl p-6 shadow-card">
      <h3 className="text-xl font-semibold text-brand-brown mb-4">ملخص الطلب</h3>
      <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
        <span>المجموع</span>
        <span suppressHydrationWarning>{formatPrice(subtotal)}</span>
      </div>
      <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
        <span>الشحن داخل الخليج</span>
        <span suppressHydrationWarning>{formatPrice(shipping)}</span>
      </div>
      <div className="border-t border-dashed border-brand-gold/50 my-4" />
      <div className="flex items-center justify-between text-lg font-bold text-brand-brown">
        <span>الإجمالي</span>
        <span suppressHydrationWarning>{formatPrice(total)}</span>
      </div>
      {onCheckout && (
        <button
          type="button"
          disabled={isSubmitting || items.length === 0}
          className="mt-6 w-full bg-brand-gold text-brand-black rounded-full py-3 font-semibold hover:bg-[#c1952d] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={onCheckout}
        >
          {isSubmitting ? 'جاري معالجة الطلب...' : 'تأكيد الطلب'}
        </button>
      )}
    </div>
  );
}

