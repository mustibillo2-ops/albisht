'use client';

import { useState } from 'react';

const orderStatuses = ['new', 'processing', 'shipped', 'completed', 'cancelled'];
const paymentStatuses = ['pending', 'paid', 'failed'];

export default function OrderStatusForm({ orderId, status, paymentStatus }) {
  const [formState, setFormState] = useState({ status, paymentStatus });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });
      if (!response.ok) throw new Error('فشل تحديث الطلب');
      setMessage('تم تحديث الحالة بنجاح');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-brand-white border border-brand-gold/30 rounded-3xl p-6 shadow-card space-y-4"
    >
      <h3 className="text-xl font-semibold text-brand-brown">تحديث الحالة</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-slate-600">حالة الطلب</label>
          <select
            name="status"
            value={formState.status}
            onChange={handleChange}
            className="rounded-2xl border border-brand-gold/40 px-4 py-3 bg-brand-soft"
          >
            {orderStatuses.map((statusOption) => (
              <option key={statusOption} value={statusOption}>
                {statusOption}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-slate-600">حالة الدفع</label>
          <select
            name="paymentStatus"
            value={formState.paymentStatus}
            onChange={handleChange}
            className="rounded-2xl border border-brand-gold/40 px-4 py-3 bg-brand-soft"
          >
            {paymentStatuses.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-brand-gold text-brand-black rounded-full px-6 py-3 font-semibold hover:bg-[#c1952d] disabled:opacity-60"
      >
        {loading ? 'جاري التحديث...' : 'حفظ التغييرات'}
      </button>
      {message && <p className="text-sm text-brand-brown">{message}</p>}
    </form>
  );
}

