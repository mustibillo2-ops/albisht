import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-brand-brown via-[#1b100a] to-brand-black text-brand-white rounded-3xl p-8 lg:p-12 shadow-card overflow-hidden relative">
      <div className="flex flex-col lg:flex-row items-start gap-10">
        <div className="flex-1 flex flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-gold/40 bg-white/10 px-4 py-1 text-sm text-brand-gold">
            تشكيلة خاصة من البشوت الخليجية
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-snug">
            إطلالة بشوت <span className="text-brand-gold">خليجية فاخرة</span>
          </h1>
          <p className="text-lg text-white/80 leading-relaxed max-w-2xl">
            اكتشف مجموعة مختارة من البشوت العربية الأصيلة بتفاصيل ذهبية راقية،
            وأقمشة فاخرة تليق بالمناسبات الرسمية. شحن سريع إلى جميع دول الخليج.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/categories"
              className="bg-brand-gold text-brand-black px-8 py-3 rounded-full font-semibold hover:bg-[#c1952d] transition-colors"
            >
              تسوق الآن
            </Link>
            <Link
              href="/categories"
              className="border border-brand-gold text-brand-gold px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors"
            >
              تصفح الفئات
            </Link>
          </div>
        </div>
        <div className="flex-1">
          <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-transparent via-white/5 to-white/10 p-8">
            <p className="text-xl text-brand-gold font-semibold mb-4">
              بشوت فاخرة بتصميم كلاسيكي
            </p>
            <p className="text-white/70 leading-relaxed">
              نصمم كل بشت بعناية فائقة، بخيوط حريرية ذهبية وتطريز يدوي، لنمنحك
              تجربة ملبس لا تضاهى. اختر من الألوان السوداء، البيضاء، والعنابية
              مع أطراف ذهبية براقة.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-brand-gold font-semibold">ألوان كلاسيكية</p>
                <p className="text-white/70">أسود، أبيض، ذهبي، وبني فاخر</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-brand-gold font-semibold">شحن خليجي</p>
                <p className="text-white/70">خلال 3-5 أيام عمل داخل دول الخليج</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -left-10 w-60 h-60 rounded-full blur-3xl bg-brand-gold/20" />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full blur-3xl bg-white/10" />
      </div>
    </section>
  );
}

