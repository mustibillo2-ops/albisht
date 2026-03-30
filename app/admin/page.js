import prisma from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const revalidate = 0;

export default async function AdminDashboard() {
  let productsCount = 0;
  let categoriesCount = 0;
  let ordersCount = 0;
  let paidRevenue = 0;

  try {
    const [productsTotal, categoriesTotal, ordersTotal, paidOrders] =
      await Promise.all([
        prisma.product.count(),
        prisma.category.count(),
        prisma.order.count(),
        prisma.order.findMany({
          where: { paymentStatus: "paid" },
          select: { totalAmount: true },
        }),
      ]);

    productsCount = productsTotal;
    categoriesCount = categoriesTotal;
    ordersCount = ordersTotal;
    paidRevenue = paidOrders.reduce(
      (sum, order) => sum + Number(order.totalAmount || 0),
      0
    );
  } catch (error) {
    console.error("Failed to load dashboard stats", error);
  }

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
      value: formatPrice(paidRevenue),
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

