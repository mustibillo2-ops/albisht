import ProductCard from "@/components/ProductCard";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function CategoryDetails({ params }) {
  const { slug } = await params;

  const category = await prisma.category.findFirst({
    where: { slug, isActive: true },
  });

  if (!category) {
    notFound();
  }

  const products = await prisma.product.findMany({
    where: { categoryId: category.id, isActive: true },
    include: { category: true },
  });

  return (
    <section className="space-y-8">
      <div className="bg-brand-white border border-brand-gold/20 rounded-3xl p-8 shadow-card">
        <span className="inline-flex items-center gap-2 text-sm text-brand-gold">
          <span className="w-12 h-px bg-brand-gold" />
          الفئة
        </span>
        <h1 className="text-3xl font-semibold text-brand-brown mt-2">
          {category.nameAr}
        </h1>
        {category.description ? (
          <p className="text-slate-600 mt-3">{category.description}</p>
        ) : null}
      </div>

      {products.length ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-slate-500">لا توجد منتجات ضمن هذه الفئة حالياً.</p>
      )}
    </section>
  );
}

