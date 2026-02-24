export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-brand-white border-t border-brand-gold/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-600 gap-2">
        <p>© {year} البشت العربي الأصيل</p>
        <p>أناقة خليجية بلمسة ذهبية</p>
      </div>
    </footer>
  );
}

