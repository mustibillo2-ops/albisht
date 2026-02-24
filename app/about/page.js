export const revalidate = 0;

export default function AboutPage() {
  return (
    <section className="space-y-6 bg-brand-white border border-brand-gold/20 rounded-3xl p-8 shadow-card">
      <div>
        <span className="inline-flex items-center gap-2 text-sm text-brand-gold">
          <span className="w-12 h-px bg-brand-gold" />
          عن المتجر
        </span>
        <h1 className="text-3xl font-semibold text-brand-brown mt-2">
          البشت العربي الأصيل
        </h1>
      </div>
      <p className="text-lg text-slate-600 leading-relaxed">
        نؤمن بأن البشت أكثر من مجرد عباءة، بل هو هوية خليجية متجذرة في الأصالة
        والتراث. في متجر البشت العربي الأصيل نختار أجود الأقمشة ونعتني
        بالتفاصيل الذهبية ليناسب البشت المناسبات الرسمية والاحتفالات الخاصة
        والمجالس الرفيعة.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="border border-brand-gold/30 rounded-2xl p-4">
          <h3 className="text-xl font-semibold text-brand-brown mb-2">
            رسالتنا
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            تقديم تجربة تسوق إلكترونية فاخرة تمنح عملاء الخليج وصولاً سريعاً
            لأجمل البشوت مع خيارات تفصيل وألوان متعددة.
          </p>
        </div>
        <div className="border border-brand-gold/30 rounded-2xl p-4">
          <h3 className="text-xl font-semibold text-brand-brown mb-2">
            رؤيتنا
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            أن نكون الوجهة الرقمية الأولى لعشاق البشوت الأصلية في المنطقة،
            ونواصل تحديث التصاميم مع الحفاظ على اللمسة الكلاسيكية المميزة.
          </p>
        </div>
      </div>
    </section>
  );
}

