'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/';
  const { setUser } = useUser();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || 'تعذر إنشاء الحساب، حاول مجدداً');
      }

      if (data?.user) setUser(data.user);
      setStatus({
        type: 'success',
        message: data?.message || 'تم إنشاء الحساب بنجاح',
      });

      setTimeout(() => {
        router.replace(from);
      }, 700);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error?.message || 'تعذر إنشاء الحساب، حاول مجدداً',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-[70vh] flex items-center justify-center bg-brand-soft py-12">
      <div className="w-full max-w-md bg-brand-white border border-brand-gold/40 rounded-3xl shadow-card p-8">
        <h1 className="text-3xl font-semibold text-brand-brown mb-3 text-center">
          إنشاء حساب جديد
        </h1>
        <p className="text-slate-600 text-sm mb-6 text-center">
          أدخل بياناتك لإنشاء حساب ومتابعة الطلبات بسهولة.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-600" htmlFor="signup-name">
              الاسم الكامل
            </label>
            <input
              id="signup-name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="rounded-2xl border border-brand-gold/40 px-4 py-3 bg-brand-soft focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-600" htmlFor="signup-email">
              البريد الإلكتروني
            </label>
            <input
              id="signup-email"
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="rounded-2xl border border-brand-gold/40 px-4 py-3 bg-brand-soft focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-600" htmlFor="signup-phone">
              رقم الجوال
            </label>
            <input
              id="signup-phone"
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="rounded-2xl border border-brand-gold/40 px-4 py-3 bg-brand-soft focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-600" htmlFor="signup-password">
              كلمة المرور
            </label>
            <input
              id="signup-password"
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="rounded-2xl border border-brand-gold/40 px-4 py-3 bg-brand-soft focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-brand-gold text-brand-black font-semibold py-3 hover:bg-[#c1952d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
          </button>
        </form>

        {status.message && (
          <p
            className={`mt-4 text-sm text-center ${
              status.type === 'success' ? 'text-emerald-600' : 'text-rose-500'
            }`}
          >
            {status.message}
          </p>
        )}

        <p className="mt-4 text-sm text-center text-slate-600">
          لديك حساب بالفعل؟{' '}
          <Link
            href={`/login?from=${encodeURIComponent(from)}`}
            className="text-brand-gold font-semibold"
          >
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </section>
  );
}

