export const revalidate = 0;

const policyItems = [
  "يمكن استرجاع البشت خلال 7 أيام من تاريخ الاستلام بشرط عدم الاستخدام أو إزالة البطاقة.",
  "يتحمل العميل تكاليف الشحن في حال لم يكن هناك عيب مصنعي.",
  "في حالة وجود خلل مصنعي سنقوم باستبدال البشت أو إعادة المبلغ كاملاً.",
  "يتم فحص البشت قبل الشحن وبعد الاسترجاع لضمان الجودة.",
  "مدة معالجة الاسترجاع من 3 إلى 5 أيام عمل بعد استلام المنتج.",
];

export default function ReturnPolicyPage() {
  return (
    <section className="bg-brand-white border border-brand-gold/20 rounded-3xl p-8 shadow-card space-y-6">
      <div>
        <span className="inline-flex items-center gap-2 text-sm text-brand-gold">
          <span className="w-12 h-px bg-brand-gold" />
          سياسة الاسترجاع
        </span>
        <h1 className="text-3xl font-semibold text-brand-brown mt-2">
          ضمان رضاكم هو أولويتنا
        </h1>
      </div>
      <ul className="space-y-3 text-slate-600 leading-relaxed">
        {policyItems.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 w-2 h-2 rounded-full bg-brand-gold" />
            <p>{item}</p>
          </li>
        ))}
      </ul>
      <p className="text-sm text-slate-500">
        للاستفسارات حول الاسترجاع يرجى التواصل معنا عبر صفحة تواصل معنا أو عبر
        الواتساب.
      </p>
    </section>
  );
}

