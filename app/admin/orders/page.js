import prisma from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const revalidate = 0;

const paymentMethodLabel = (method = "") => {
  switch (method) {
    case "CARD":
      return "بطاقة بنكية";
    case "COD":
    default:
      return "الدفع عند الاستلام";
  }
};

const paymentStatusLabel = (status = "") => {
  switch (status) {
    case "paid":
      return "مدفوع";
    case "failed":
      return "فشل الدفع";
    case "processing":
      return "قيد المعالجة";
    case "pending":
    default:
      return "قيد الدفع";
  }
};

const formatItemsList = (items = []) => {
  if (!items.length) {
    return "لا توجد منتجات";
  }
  return items
    .map((item) => {
      const name =
        item.productName ||
        item.product?.nameAr ||
        item.product?.name ||
        "منتج بدون اسم";
      return `${name} (${item.quantity}x)`;
    })
    .join("، ");
};

const formatDate = (value) => {
  try {
    return new Date(value).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return value;
  }
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-brand-brown">الطلبات</h1>
        <p className="text-slate-500 text-sm">
          متابعة آخر الطلبات وحالات الدفع والشحن.
        </p>
      </div>

      <div className="overflow-x-auto bg-brand-white border border-brand-gold/30 rounded-3xl shadow-card">
        <table className="w-full text-right text-sm min-w-[800px]">
          <thead className="text-slate-500 text-xs uppercase tracking-wide">
            <tr>
              <th className="p-4">رقم الطلب</th>
              <th className="p-4">العميل</th>
              <th className="p-4">الجوال</th>
              <th className="p-4">المدينة</th>
              <th className="p-4">طريقة الدفع</th>
              <th className="p-4">حالة الدفع</th>
              <th className="p-4">الإجمالي</th>
              <th className="p-4">التاريخ</th>
              <th className="p-4">المنتجات</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-slate-100">
                <td className="p-4 font-semibold text-brand-brown">
                  #{order.id}
                </td>
                <td className="p-4 font-medium text-brand-brown">
                  {order.customerName}
                </td>
                <td className="p-4">{order.phone}</td>
                <td className="p-4">{order.city}</td>
                <td className="p-4">{paymentMethodLabel(order.paymentMethod)}</td>
                <td className="p-4">
                  <span className="inline-flex rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-brown border border-brand-gold/30">
                    {paymentStatusLabel(order.paymentStatus)}
                  </span>
                </td>
                <td className="p-4 text-brand-gold font-semibold">
                  {formatPrice(order.totalAmount)}
                </td>
                <td className="p-4 text-slate-500">{formatDate(order.createdAt)}</td>
                <td className="p-4 text-slate-600">{formatItemsList(order.items)}</td>
              </tr>
            ))}
            {!orders.length && (
              <tr>
                <td colSpan="9" className="p-6 text-center text-slate-500">
                  لا توجد طلبات حتى الآن.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

