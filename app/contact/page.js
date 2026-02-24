'use client';

import { useState } from 'react';
import {
  BsWhatsapp,
  BsInstagram,
  BsFacebook,
  BsTiktok,
  BsEnvelope,
} from 'react-icons/bs';

const socials = [
  { icon: BsWhatsapp, label: 'واتساب', href: 'https://wa.me/966500000000' },
  { icon: BsInstagram, label: 'إنستغرام', href: 'https://instagram.com' },
  { icon: BsFacebook, label: 'فيسبوك', href: 'https://facebook.com' },
  { icon: BsTiktok, label: 'تيك توك', href: 'https://tiktok.com' },
  { icon: BsEnvelope, label: 'البريد الإلكتروني', href: 'mailto:info@albisht.store' },
];

const initialState = { name: '', email: '', message: '' };

export default function ContactPage() {
  const [formData, setFormData] = useState(initialState);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('تعذر إرسال الرسالة، حاول لاحقاً.');
      setFormData(initialState);
      setStatus({ type: 'success', message: 'تم استلام رسالتك بنجاح.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <form
        onSubmit={handleSubmit}
        className="bg-brand-white border border-brand-gold/30 rounded-3xl p-8 shadow-card space-y-6"
      >
        <div>
          <span className="inline-flex items-center gap-2 text-sm text-brand-gold">
            <span className="w-12 h-px bg-brand-gold" />
            تواصل معنا
          </span>
          <h1 className="text-3xl font-semibold text-brand-brown mt-2">
            يسعدنا سماعك
          </h1>
          <p className="text-slate-600 text-sm mt-2">
            أرسل رسالتك أو استفسارك وسنرد في أقرب وقت ممكن.
          </p>
        </div>
        <div className="grid gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-600">الاسم</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="rounded-2xl border border-brand-gold/40 px-4 py-3 bg-brand-soft"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-600">البريد الإلكتروني</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="rounded-2xl border border-brand-gold/40 px-4 py-3 bg-brand-soft"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-600">الرسالة</label>
            <textarea
              name="message"
              rows="4"
              required
              value={formData.message}
              onChange={handleChange}
              className="rounded-2xl border border-brand-gold/40 px-4 py-3 bg-brand-soft"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-gold text-brand-black rounded-full py-3 font-semibold hover:bg-[#c1952d] transition-colors disabled:opacity-60"
        >
          {loading ? 'جاري الإرسال...' : 'إرسال الرسالة'}
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
      <div className="bg-brand-white border border-brand-gold/30 rounded-3xl p-8 shadow-card space-y-6">
        <h2 className="text-2xl font-semibold text-brand-brown">
          قنوات التواصل
        </h2>
        <ul className="space-y-4 text-brand-brown">
          {socials.map(({ icon: Icon, label, href }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 text-lg hover:text-brand-gold transition-colors"
              >
                <span className="w-10 h-10 rounded-full border border-brand-gold/40 flex items-center justify-center">
                  <Icon />
                </span>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

