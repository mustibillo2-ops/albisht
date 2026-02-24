import prisma from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const revalidate = 0;

export default async function AdminDashboard() {
  const [productsCount, categoriesCount, ordersCount, paidOrders] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { paymentStatus: "paid" },
      }),
    ]);

  const cards = [
    {
      label: "إجمالي المنتجات",
      value: productsCount,
    },
    {
      label: "إجمالي الفئات",
      value: categoriesCount,
    },
    {
      label: "عدد الطلبات",
      value: ordersCount,
    },
    {
      label: "إيرادات مدفوعة",
      value: formatPrice(paidOrders._sum.totalAmount || 0),
    },
  ];

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-brand-brown">لوحة التحكم</h1>
        <p className="text-slate-500 text-sm">
          نظرة عامة على أداء المتجر والطلبات.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-brand-white border border-brand-gold/30 rounded-3xl p-6 shadow-card"
          >
            <p className="text-sm text-slate-500 mb-2">{card.label}</p>
            <p className="text-3xl font-semibold text-brand-brown">
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

