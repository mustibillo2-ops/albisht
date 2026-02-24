import Image from "next/image";
import Link from "next/link";

const fallbackImage =
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=80";

export default function CategoryCard({ category }) {
  if (!category) return null;

  const coverImage = category.imageUrl || fallbackImage;

  return (
    <div className="bg-brand-white rounded-3xl border border-brand-gold/20 p-6 shadow-card flex flex-col gap-3">
      <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-brand-gold/20">
        <Image
          src={coverImage}
          alt={category.nameAr}
          fill
          className="object-cover"
          sizes="(max-width:768px) 100vw, 25vw"
        />
      </div>
      <p className="text-sm text-slate-500">فئة مميزة</p>
      <h3 className="text-2xl font-semibold text-brand-brown">
        {category.nameAr}
      </h3>
      {category.description ? (
        <p className="text-slate-600 text-sm leading-relaxed">
          {category.description}
        </p>
      ) : null}
      <Link
        href={`/categories/${category.slug}`}
        className="mt-auto inline-flex items-center justify-center rounded-full border border-brand-gold text-brand-gold font-semibold py-2 hover:bg-brand-gold hover:text-brand-black transition-colors"
      >
        تصفح البشوت
      </Link>
    </div>
  );
}

