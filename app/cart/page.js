'use client';

import Link from 'next/link';
import CartItem from '@/components/CartItem';
import { useRouter } from 'next/navigation';
import OrderSummary from '@/components/OrderSummary';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    if (!items.length) return;
    router.push('/checkout');
  };

  return (
    <section className="grid gap-8 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-brand-brown">سلة المشتريات</h1>
          <Link href="/categories" className="text-sm text-brand-gold">
            متابعة التسوق
          </Link>
        </div>
        {items.length ? (
          <div className="space-y-4">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="bg-brand-white border border-brand-gold/20 rounded-3xl p-6 text-center text-slate-500">
            السلة فارغة حالياً.
          </div>
        )}
      </div>
      <OrderSummary onCheckout={handleCheckout} isSubmitting={false} />
    </section>
  );
}

