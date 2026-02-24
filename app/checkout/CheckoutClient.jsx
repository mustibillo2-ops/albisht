'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import OrderSummary from '@/components/OrderSummary';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { GCC_COUNTRIES, PAYMENT_METHODS } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';

const defaultCountry = GCC_COUNTRIES[0] || '';
const defaultPaymentMethod = PAYMENT_METHODS[0]?.value || 'COD';

const initialForm = {
  customerName: '',
  phone: '',
  country: defaultCountry,
  city: '',
  address: '',
  notes: '',
  paymentMethod: defaultPaymentMethod,
};

export default function CheckoutClient() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useUser();
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!user) return;
    setFormData((prev) => ({
      ...prev,
      customerName: prev.customerName || user.name || '',
      phone: prev.phone || user.phone || '',
    }));
  }, [user]);

  const displayItems = isClient ? items : [];
  const displaySubtotal = isClient ? subtotal : 0;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event?.preventDefault();

    if (!items.length) {
      setStatus({ type: 'error', message: 'السلة فارغة، أضف منتجات أولاً.' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, cartItems: items }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || 'تعذرت معالجة الطلب، حاول مجدداً.');
      }

      const createdOrder = data?.order;
      clearCart();
      setFormData(initialForm);
      setStatus({ type: 'success', message: 'تم استلام طلبك بنجاح' });

      setTimeout(() => {
        const orderId = createdOrder?.id ? `?orderId=${createdOrder.id}` : '';
        router.replace(`/order-confirmation${orderId}`);
      }, 700);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error?.message || 'تعذرت معالجة الطلب، حاول مجدداً.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="grid gap-8 lg:grid-cols-[2fr_1fr]">
      <form
        className="bg-brand-white border border-brand-gold/20 rounded-3xl p-8 shadow-card space-y-6"
        onSubmit={handleSubmit}
      >
        <div>
          <h1 className="text-3xl font-semibold text-brand-brown mb-2">
            إتمام الطلب
          </h1>
          <p className="text-slate-600 text-sm">
            أدخل بيانات التوصيل وسيتم التواصل معك لتأكيد الطلب.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-600">الاسم الكامل</label>
            <input
              type="text"
              name="customerName"
              required
              value={formData.customerName}
              onChange={handleChange}
              className="rounded-2xl border border-brand-gold/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 bg-brand-soft"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-600">رقم الجوال</label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="rounded-2xl border border-brand-gold/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 bg-brand-soft"
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-600">الدولة</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="rounded-2xl border border-brand-gold/40 px-4 py-3 bg-brand-soft"
            >
              {GCC_COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-600">المدينة</label>
            <input
              type="text"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              className="rounded-2xl border border-brand-gold/40 px-4 py-3 bg-brand-soft"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-slate-600">العنوان الكامل</label>
          <textarea
            name="address"
            required
            rows="3"
            value={formData.address}
            onChange={handleChange}
            className="rounded-2xl border border-brand-gold/40 px-4 py-3 bg-brand-soft"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-slate-600">ملاحظات إضافية</label>
          <textarea
            name="notes"
            rows="3"
            value={formData.notes}
            onChange={handleChange}
            className="rounded-2xl border border-brand-gold/40 px-4 py-3 bg-brand-soft"
            placeholder="أي تفاصيل تفضل إضافتها للطلب"
          />
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-sm text-slate-600">طريقة الدفع</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {PAYMENT_METHODS.map((method) => (
              <label
                key={method.value}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 cursor-pointer ${
                  formData.paymentMethod === method.value
                    ? 'border-brand-gold bg-brand-soft'
                    : 'border-brand-gold/30'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.value}
                  checked={formData.paymentMethod === method.value}
                  onChange={handleChange}
                />
                {method.label}
              </label>
            ))}
          </div>
        </div>
        <div className="bg-brand-soft/70 border border-brand-gold/30 rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">محتويات السلة</p>
              <p className="text-lg font-semibold text-brand-brown">
                {displayItems.length ? `${displayItems.length} منتج` : 'لا توجد منتجات'}
              </p>
            </div>
            <span className="text-sm text-slate-500">
              {displayItems.length ? 'يمكنك تعديل الكميات من صفحة السلة' : ''}
            </span>
          </div>
          {displayItems.length ? (
            <>
              <ul className="space-y-3">
                {displayItems.map((item) => {
                  const itemTotal = Number(item.price || 0) * (item.quantity || 0);
                  return (
                    <li
                      key={item.id}
                      className="flex items-center justify-between border-b border-brand-gold/20 pb-3 last:border-b-0 last:pb-0"
                    >
                      <div>
                        <p className="text-sm font-semibold text-brand-brown">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          الكمية: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-brand-gold">
                          {formatPrice(itemTotal)}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatPrice(item.price)} للوحدة
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="flex items-center justify-between pt-4 border-t border-dashed border-brand-gold/40">
                <span className="text-sm text-slate-600">المجموع الفرعي</span>
                <span className="text-lg font-bold text-brand-brown">
                  {formatPrice(displaySubtotal)}
                </span>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-500">
              السلة فارغة حالياً، أضف منتجات لإتمام الطلب.
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-brand-gold text-brand-black font-semibold py-3 hover:bg-[#c1952d] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'جاري إرسال الطلب...' : 'تأكيد الطلب'}
        </button>
        {status.message && (
          <p
            className={`text-sm ${
              status.type === 'success' ? 'text-emerald-600' : 'text-rose-500'
            }`}
          >
            {status.message}
          </p>
        )}
      </form>

      <OrderSummary />
    </section>
  );
}

