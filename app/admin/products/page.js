import Link from "next/link";
import prisma from "@/lib/prisma";
import AdminProductsTable from "./_components/AdminProductsTable";

export const revalidate = 0;

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-brand-brown">المنتجات</h1>
          <p className="text-slate-500 text-sm">إدارة وإضافة بشوت جديدة.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center rounded-full bg-brand-gold text-brand-black px-6 py-2 font-semibold hover:bg-[#c1952d]"
        >
          إضافة منتج جديد
        </Link>
      </div>

      <AdminProductsTable initialProducts={products} />
    </section>
  );
}

