'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || 'كلمة المرور غير صحيحة، حاول مرة أخرى.'
        );
      }

      setStatus({
        type: 'success',
        message: data?.message || 'تم تسجيل الدخول بنجاح',
      });
      setPassword('');

      setTimeout(() => {
        router.replace('/admin');
      }, 600);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error?.message || 'كلمة المرور غير صحيحة',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-[70vh] flex items-center justify-center bg-brand-soft">
      <div className="w-full max-w-md bg-brand-white border border-brand-gold/40 rounded-3xl shadow-card p-8">
        <h1 className="text-3xl font-semibold text-brand-brown mb-3">
          تسجيل دخول الأدمن
        </h1>
        <p className="text-slate-600 text-sm mb-8">
          أدخل كلمة المرور للوصول إلى لوحة التحكم.
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-600" htmlFor="admin-password">
              كلمة المرور
            </label>
            <input
              id="admin-password"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-2xl border border-brand-gold/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 bg-brand-soft text-brand-brown"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-brand-gold text-brand-black font-semibold py-3 hover:bg-[#c1952d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>
        {status.message && (
          <p
            className={`mt-4 text-sm ${
              status.type === 'success' ? 'text-emerald-600' : 'text-rose-500'
            }`}
          >
            {status.message}
          </p>
        )}
      </div>
    </section>
  );
}

