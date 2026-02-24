import HeroSection from "@/components/HeroSection";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import prisma from "@/lib/prisma";

export const revalidate = 0;

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { nameAr: "asc" },
      take: 6,
    }),
    prisma.product.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  return (
    <div className="space-y-16">
      <HeroSection />

      <section className="space-y-8">
        <div>
          <span className="inline-flex items-center gap-2 text-sm text-brand-gold">
            <span className="w-12 h-px bg-brand-gold" />
            الفئات
          </span>
          <h2 className="text-3xl font-semibold text-brand-brown mt-2">
            اكتشف مجموعاتنا
          </h2>
        </div>
        {categories.length ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <p className="text-slate-500">لم يتم إضافة فئات بعد.</p>
        )}
      </section>

      <section className="space-y-8">
        <div>
          <span className="inline-flex items-center gap-2 text-sm text-brand-gold">
            <span className="w-12 h-px bg-brand-gold" />
            أحدث البشوت
          </span>
          <h2 className="text-3xl font-semibold text-brand-brown mt-2">
            روائع جديدة كل أسبوع
          </h2>
        </div>
        {products.length ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-slate-500">
            لم يتم إضافة منتجات بعد، تابعنا قريباً.
          </p>
        )}
      </section>
    </div>
  );
}
