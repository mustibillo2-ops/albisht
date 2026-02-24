import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import OrderStatusForm from "./OrderStatusForm";

export const revalidate = 0;

export default async function OrderDetailsPage({ params }) {
  const { id } = await params;
  const orderId = Number(id);
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } },
  });

  if (!order) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-brand-brown">
          تفاصيل الطلب #{order.id}
        </h1>
        <p className="text-slate-500 text-sm">
          {order.customerName} - {order.phone}
        </p>
      </div>

      <div className="bg-brand-white border border-brand-gold/30 rounded-3xl p-6 shadow-card space-y-3">
        <p>الدولة: {order.country}</p>
        <p>المدينة: {order.city}</p>
        <p>العنوان: {order.address}</p>
        {order.notes && <p>ملاحظات: {order.notes}</p>}
        <p>طريقة الدفع: {order.paymentMethod}</p>
        <p>قيمة الطلب: {formatPrice(order.totalAmount)}</p>
      </div>

      <div className="bg-brand-white border border-brand-gold/30 rounded-3xl shadow-card overflow-hidden">
        <table className="w-full text-right text-sm">
          <thead className="bg-brand-soft text-slate-600">
            <tr>
              <th className="p-4">المنتج</th>
              <th className="p-4">الكمية</th>
              <th className="p-4">السعر</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-t border-slate-100">
                <td className="p-4">{item.product?.nameAr}</td>
                <td className="p-4">{item.quantity}</td>
                <td className="p-4 text-brand-gold">
                  {formatPrice(item.unitPrice)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <OrderStatusForm
        orderId={order.id}
        status={order.status}
        paymentStatus={order.paymentStatus}
      />
    </section>
  );
}

