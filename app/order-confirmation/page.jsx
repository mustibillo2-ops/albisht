import Link from 'next/link';

export default async function OrderConfirmationPage({ searchParams }) {
  const params = await searchParams;
  const orderId = params?.orderId;

  return (
    <section className="max-w-3xl mx-auto">
      <div className="bg-brand-white border border-brand-gold/30 rounded-3xl shadow-card p-8 text-center space-y-5">
        <h1 className="text-3xl font-semibold text-brand-brown">تم تأكيد طلبك</h1>
        <p className="text-slate-600">
          شكراً لك. تم استلام طلبك بنجاح وسيتم التواصل معك قريباً لتأكيد التفاصيل.
        </p>
        {orderId ? (
          <p className="text-sm text-slate-500">
            رقم الطلب: <span className="font-semibold text-brand-brown">#{orderId}</span>
          </p>
        ) : null}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/categories"
            className="inline-flex items-center justify-center rounded-full border border-brand-gold/60 px-6 py-2 text-sm font-medium text-brand-brown hover:bg-brand-gold hover:text-brand-black transition"
          >
            متابعة التسوق
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-brand-gold text-brand-black px-6 py-2 text-sm font-semibold hover:bg-[#c1952d] transition-colors"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </section>
  );
}

