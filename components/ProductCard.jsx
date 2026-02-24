import Image from "next/image";
import Link from "next/link";
import { colorToHex, formatPrice } from "@/lib/utils";

const placeholderImage =
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80";

export default function ProductCard({ product }) {
  if (!product) return null;

  return (
    <div className="bg-brand-white rounded-3xl shadow-card overflow-hidden flex flex-col border border-brand-gold/10">
      <div className="relative aspect-[4/3]">
        <Image
          src={product.mainImage || placeholderImage}
          alt={product.nameAr}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={false}
        />
      </div>
      <div className="p-6 flex flex-col flex-1 gap-3">
        <div>
          <p className="text-sm text-slate-500 mb-1">{product.category?.nameAr}</p>
          <h3 className="text-lg font-semibold text-brand-brown">
            {product.nameAr}
          </h3>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <span>اللون:</span>
          <span className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded-full border border-slate-200"
              style={{ backgroundColor: colorToHex(product.color) }}
            />
            {product.color}
          </span>
        </div>
        <p className="text-2xl font-bold text-brand-gold mt-auto">
          {formatPrice(product.price)}
        </p>
        <Link
          href={`/product/${product.slug}`}
          className="mt-4 inline-flex items-center justify-center rounded-full border border-brand-gold text-brand-brown font-semibold py-2 hover:bg-brand-gold hover:text-brand-black transition-colors"
        >
          عرض التفاصيل
        </Link>
      </div>
    </div>
  );
}

