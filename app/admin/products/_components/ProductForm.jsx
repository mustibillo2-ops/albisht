'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductForm({ categories = [], product }) {
  const router = useRouter();
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [mainImage, setMainImage] = useState(product?.mainImage || '');
  const [uploadingMainImage, setUploadingMainImage] = useState(false);

  const [formData, setFormData] = useState({
    nameAr: product?.nameAr || '',
    slug: product?.slug || '',
    description: product?.description || '',
    fabric: product?.fabric || '',
    color: product?.color || 'أسود',
    price: product?.price || '',
    stock: product?.stock || '',
    mainImage: product?.mainImage || '',
    galleryImages: Array.isArray(product?.galleryImages)
      ? product.galleryImages.join(', ')
      : '',
    categoryId: product?.categoryId || categories[0]?.id || '',
    isActive: product?.isActive ?? true,
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (name === 'mainImage') {
      setMainImage(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      if (!categories.length) {
        throw new Error('لا توجد فئات نشطة، أضف فئة أولاً.');
      }

      const payload = {
        nameAr: formData.nameAr,
        slug: formData.slug,
        description: formData.description,
        fabric: formData.fabric,
        color: formData.color,
        price: Number(formData.price),
        stock: Number(formData.stock),
        categoryId: Number(formData.categoryId),
        isActive: formData.isActive,
        mainImage,
      };

      if (!payload.nameAr || !payload.slug || !payload.description || !payload.fabric) {
        throw new Error('الرجاء تعبئة جميع الحقول المطلوبة.');
      }

      if (Number.isNaN(payload.price) || payload.price < 0) {
        throw new Error('يرجى إدخال سعر صالح.');
      }

      if (Number.isNaN(payload.stock) || payload.stock < 0) {
        throw new Error('يرجى إدخال قيمة مخزون صالحة.');
      }

      const url = product
        ? `/api/admin/products/${product.id}`
        : '/api/admin/products';
      const method = product ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let data = null;
      try {
        data = await response.json();
      } catch (_) {
        data = null;
      }

      if (!response.ok) {
        setStatus({
          type: 'error',
          message: data?.message || 'تعذّر حفظ المنتج.',
        });
        return;
      }

      setStatus({
        type: 'success',
        message: data?.message || 'تم الحفظ بنجاح',
      });
      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleProductMainImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formPayload = new FormData();
    formPayload.append('file', file);
    setUploadingMainImage(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/upload/product', {
        method: 'POST',
        body: formPayload,
      });
      if (!response.ok) {
        throw new Error('تعذر رفع الصورة');
      }
      const data = await response.json();
      setMainImage(data.imageUrl);
      setFormData((prev) => ({ ...prev, mainImage: data.imageUrl }));
      setStatus({ type: 'success', message: 'تم رفع الصورة بنجاح' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setUploadingMainImage(false);
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    if (!window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'DELETE',
      });
      let data = null;
      try {
        data = await response.json();
      } catch (_) {
        data = null;
      }
      if (!response.ok) {
        throw new Error(data?.message || 'تعذر حذف المنتج');
      }
      setStatus({
        type: 'success',
        message: data?.message || 'تم تعطيل المنتج',
      });
      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-brand-white border border-brand-gold/30 rounded-3xl p-8 shadow-card space-y-5"
    >
      <div>
        <h1 className="text-3xl font-semibold text-brand-brown">
          {product ? 'تعديل المنتج' : 'إضافة منتج جديد'}
        </h1>
        <p className="text-slate-500 text-sm">
          أدخل تفاصيل البشت بما في ذلك الصور والسعر والمخزون.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-slate-600">اسم المنتج بالعربية</label>
          <input
            name="nameAr"
            value={formData.nameAr}
            onChange={handleChange}
            required
            className="rounded-2xl border border-brand-gold/40 px-4 py-3 bg-brand-soft"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-slate-600">الاسم المختصر (Slug)</label>
          <input
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            className="rounded-2xl border border-brand-gold/40 px-4 py-3 bg-brand-soft"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-slate-600">وصف المنتج</label>
        <textarea
          name="description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          required
          className="rounded-2xl border border-brand-gold/40 px-4 py-3 bg-brand-soft"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-slate-600">الفئة</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="rounded-2xl border border-brand-gold/40 px-4 py-3 bg-brand-soft"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nameAr}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-slate-600">اللون</label>
          <input
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="rounded-2xl border border-brand-gold/40 px-4 py-3 bg-brand-soft"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-slate-600">الخامة</label>
          <input
            name="fabric"
            value={formData.fabric}
            onChange={handleChange}
            className="rounded-2xl border border-brand-gold/40 px-4 py-3 bg-brand-soft"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-slate-600">السعر (ر.س)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="rounded-2xl border border-brand-gold/40 px-4 py-3 bg-brand-soft"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-slate-600">المخزون</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            className="rounded-2xl border border-brand-gold/40 px-4 py-3 bg-brand-soft"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-slate-600">رابط الصورة الرئيسية</label>
          <input
            name="mainImage"
            value={formData.mainImage}
            onChange={handleChange}
            className="rounded-2xl border border-brand-gold/40 px-4 py-3 bg-brand-soft"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-brand-brown">
          الصورة الرئيسية للمنتج
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleProductMainImageChange}
          className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-brand-gold/90 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-black hover:file:bg-brand-gold"
        />
        {uploadingMainImage && (
          <p className="text-xs text-slate-500">جاري رفع الصورة...</p>
        )}
        {mainImage && (
          <div className="mt-2">
            <img
              src={mainImage}
              alt="صورة المنتج"
              className="h-24 w-24 rounded-xl object-cover border border-brand-gold/40"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-slate-600">
          روابط صور إضافية (مفصولة بفاصلة)
        </label>
        <textarea
          name="galleryImages"
          rows="2"
          value={formData.galleryImages}
          onChange={handleChange}
          className="rounded-2xl border border-brand-gold/40 px-4 py-3 bg-brand-soft"
        />
      </div>

      <label className="inline-flex items-center gap-3 text-sm text-slate-600">
        <input
          type="checkbox"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
        />
        المنتج نشط ومتاح للعرض
      </label>

      {status.message && (
        <p
          className={`text-sm ${
            status.type === 'success' ? 'text-emerald-600' : 'text-rose-500'
          }`}
        >
          {status.message}
        </p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={loading || uploadingMainImage}
          className="bg-brand-gold text-brand-black rounded-full px-8 py-3 font-semibold hover:bg-[#c1952d] disabled:opacity-60"
        >
          {loading ? 'جاري الحفظ...' : 'حفظ المنتج'}
        </button>
        {product && (
          <button
            type="button"
            onClick={handleDelete}
            className="text-rose-500 text-sm"
          >
            حذف المنتج
          </button>
        )}
      </div>
    </form>
  );
}

