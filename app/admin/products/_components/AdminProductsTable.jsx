'use client';

import Link from 'next/link';
import { useState } from 'react';
import { formatPrice, statusBadgeClass } from '@/lib/utils';

export default function AdminProductsTable({ initialProducts = [] }) {
  const [products, setProducts] = useState(initialProducts);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (product) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    setDeletingId(product.id);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'DELETE',
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || 'تعذر حذف المنتج');
      }

      setProducts((prev) => prev.filter((item) => item.id !== product.id));
      setStatus({
        type: 'success',
        message: data?.message || 'تم حذف المنتج بنجاح.',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error?.message || 'تعذر حذف المنتج',
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {status.message && (
        <p
          className={`text-sm ${
            status.type === 'success' ? 'text-emerald-600' : 'text-rose-500'
          }`}
        >
          {status.message}
        </p>
      )}
      <div className="overflow-x-auto bg-brand-white border border-brand-gold/30 rounded-3xl shadow-card">
        <table className="w-full text-right text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="p-4">الاسم</th>
              <th className="p-4">الفئة</th>
              <th className="p-4">السعر</th>
              <th className="p-4">المخزون</th>
              <th className="p-4">الحالة</th>
              <th className="p-4">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-slate-100">
                <td className="p-4 font-medium text-brand-brown">{product.nameAr}</td>
                <td className="p-4">{product.category?.nameAr || '-'}</td>
                <td className="p-4 text-brand-gold">{formatPrice(product.price)}</td>
                <td className="p-4">{product.stock}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClass(
                      product.isActive ? 'active' : 'inactive'
                    )}`}
                  >
                    {product.isActive ? 'نشط' : 'متوقف'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-brand-gold"
                    >
                      تعديل
                    </Link>
                    <button
                      type="button"
                      disabled={deletingId === product.id}
                      className="text-rose-500 disabled:opacity-60"
                      onClick={() => handleDelete(product)}
                    >
                      {deletingId === product.id ? 'جاري الحذف...' : 'حذف'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!products.length && (
              <tr>
                <td colSpan="6" className="p-6 text-center text-slate-500">
                  لا توجد منتجات نشطة حالياً.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

