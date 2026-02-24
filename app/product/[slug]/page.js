import Image from "next/image";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import AddToCartButton from "@/components/AddToCartButton";

const fallbackImage =
  "https://images.unsplash.com/photo-1503342250614-ca4407868a5b?auto=format&fit=crop&w=900&q=80";

export const revalidate = 0;

export default async function ProductPage({ params }) {
  const { slug } = await params;

  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
    include: { category: true },
  });

  if (!product) {
    notFound();
  }

  const priceValue =
    typeof product.price === "object" && "toNumber" in product.price
      ? product.price.toNumber()
      : Number(product.price);

  const cartProduct = {
    id: product.id,
    nameAr: product.nameAr,
    slug: product.slug,
    price: priceValue,
    mainImage: product.mainImage,
    color: product.color,
  };

  return (
    <section className="grid gap-10 lg:grid-cols-2">
      <div className="bg-brand-white border border-brand-gold/20 rounded-3xl shadow-card overflow-hidden">
        <div className="relative w-full aspect-[4/5]">
          <Image
            src={product.mainImage || fallbackImage}
            alt={product.nameAr}
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="bg-brand-white border border-brand-gold/20 rounded-3xl shadow-card p-8 space-y-6">
        <div>
          <p className="text-sm text-slate-500">{product.category?.nameAr}</p>
          <h1 className="text-4xl font-semibold text-brand-brown mt-2">
            {product.nameAr}
          </h1>
        </div>
        <p className="text-3xl font-bold text-brand-gold">
          {formatPrice(priceValue)}
        </p>
        <div className="space-y-2 text-slate-600">
          <p>اللون: {product.color}</p>
          <p>الخامة: {product.fabric}</p>
          <p>المخزون: {product.stock} قطعة</p>
        </div>
        <p className="leading-relaxed text-slate-700">{product.description}</p>
        <AddToCartButton product={cartProduct} />
      </div>
    </section>
  );
}

