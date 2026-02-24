import CategoryCard from "@/components/CategoryCard";
import prisma from "@/lib/prisma";

export const revalidate = 0;

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { nameAr: "asc" },
  });

  return (
    <section className="space-y-6">
      <div className="bg-brand-white border border-brand-gold/20 rounded-3xl p-8 shadow-card">
        <span className="inline-flex items-center gap-2 text-sm text-brand-gold">
          <span className="w-12 h-px bg-brand-gold" />
          الفئات
        </span>
        <h1 className="text-3xl font-semibold text-brand-brown mt-2">
          اختر البشت المناسب لمناسبتك
        </h1>
        <p className="text-slate-600 mt-2">
          نقدم مجموعة متنوعة من البشوت الرسمية واليومية بتفاصيل فاخرة تناسب جميع
          الأذواق.
        </p>
      </div>
      {categories.length ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      ) : (
        <p className="text-slate-500">لا توجد فئات مفعلة حالياً.</p>
      )}
    </section>
  );
}

