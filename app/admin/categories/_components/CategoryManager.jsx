'use client';

import { useState } from 'react';

const initialForm = {
  nameAr: '',
  slug: '',
  description: '',
  imageUrl: '',
};

export default function CategoryManager({ initialCategories }) {
  const [categories, setCategories] = useState(initialCategories);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      if (!form.nameAr.trim() || !form.slug.trim()) {
        throw new Error('اسم الفئة والاسم المختصر مطلوبان.');
      }

      const isEditMode = Boolean(editingId);
      const endpoint = isEditMode
        ? `/api/admin/categories/${editingId}`
        : '/api/admin/categories';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nameAr: form.nameAr.trim(),
          slug: form.slug.trim(),
          description: form.description.trim(),
          imageUrl: form.imageUrl || null,
          isActive: true,
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.message || 'تعذر حفظ الفئة');
      }

      const savedCategory = data?.category || data;
      if (isEditMode) {
        setCategories((prev) =>
          prev.map((item) => (item.id === editingId ? savedCategory : item))
        );
      } else {
        setCategories((prev) => [savedCategory, ...prev]);
      }

      setStatus({
        type: 'success',
        message: data?.message || 'تم حفظ الفئة بنجاح',
      });
      resetForm();
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/upload/category', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('تعذر رفع الصورة');
      }
      const data = await response.json();
      setForm((prev) => ({ ...prev, imageUrl: data.imageUrl }));
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setUploading(false);
    }
  };

  const startEdit = (category) => {
    setEditingId(category.id);
    setForm({
      nameAr: category.nameAr || '',
      slug: category.slug || '',
      description: category.description || '',
      imageUrl: category.imageUrl || '',
    });
    setStatus({ type: '', message: '' });
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الفئة؟')) return;
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.message || 'تعذر حذف الفئة');
      }

      setCategories((prev) => prev.filter((item) => item.id !== id));
      setStatus({
        type: 'success',
        message: data?.message || 'تم حذف الفئة بنجاح',
      });

      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="bg-brand-white border border-brand-gold/30 rounded-3xl p-6 shadow-card space-y-4"
      >
        <h2 className="text-2xl font-semibold text-brand-brown">
          {editingId ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-600">اسم الفئة</label>
            <input
              name="nameAr"
              value={form.nameAr}
              onChange={handleChange}
              required
              className="rounded-2xl border border-brand-gold/40 px-4 py-3 bg-brand-soft"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-600">الاسم المختصر</label>
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              required
              className="rounded-2xl border border-brand-gold/40 px-4 py-3 bg-brand-soft"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-slate-600">الوصف</label>
          <textarea
            name="description"
            rows="3"
            value={form.description}
            onChange={handleChange}
            className="rounded-2xl border border-brand-gold/40 px-4 py-3 bg-brand-soft"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-brand-brown">صورة الفئة</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleCategoryImageChange}
            className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-brand-gold/90 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-black hover:file:bg-brand-gold"
          />
          {uploading && <p className="text-xs text-slate-500">جاري رفع الصورة...</p>}
          {form.imageUrl && (
            <div className="mt-2">
              <img
                src={form.imageUrl}
                alt="صورة الفئة"
                className="h-24 w-24 rounded-xl object-cover border border-brand-gold/40"
              />
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading || uploading}
            className="bg-brand-gold text-brand-black rounded-full px-6 py-3 font-semibold hover:bg-[#c1952d] disabled:opacity-60"
          >
            {loading ? 'جاري الحفظ...' : 'حفظ'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm text-slate-600"
            >
              إلغاء التعديل
            </button>
          )}
        </div>
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

      <div className="bg-brand-white border border-brand-gold/30 rounded-3xl p-6 shadow-card">
        <h2 className="text-2xl font-semibold text-brand-brown mb-4">الفئات النشطة</h2>
        <div className="space-y-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-brand-gold/20 rounded-2xl px-4 py-3"
            >
              <div className="flex items-center gap-3">
                {category.imageUrl ? (
                  <img
                    src={category.imageUrl}
                    alt={category.nameAr}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                ) : null}
                <div>
                  <p className="font-semibold text-brand-brown">{category.nameAr}</p>
                  <p className="text-xs text-slate-500">{category.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 sm:mt-0">
                <button
                  className="text-sm text-brand-gold"
                  onClick={() => startEdit(category)}
                >
                  تعديل
                </button>
                <button
                  className="text-sm text-rose-500"
                  onClick={() => deleteCategory(category.id)}
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
          {!categories.length && (
            <p className="text-center text-slate-500">لا توجد فئات نشطة حالياً.</p>
          )}
        </div>
      </div>
    </div>
  );
}
