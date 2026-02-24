import prisma from "@/lib/prisma";
import CategoryManager from "./_components/CategoryManager";

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-brand-brown">إدارة الفئات</h1>
        <p className="text-slate-500 text-sm">
          أضف فئات جديدة أو قم بتفعيل وتعطيل الفئات الحالية.
        </p>
      </div>
      <CategoryManager initialCategories={categories} />
    </section>
  );
}

