import Link from "next/link";

const adminLinks = [
  { href: "/admin", label: "لوحة التحكم" },
  { href: "/admin/products", label: "المنتجات" },
  { href: "/admin/categories", label: "الفئات" },
  { href: "/admin/orders", label: "الطلبات" },
];

export default function AdminSidebar() {
  return (
    <aside className="bg-brand-white border border-brand-gold/30 rounded-3xl p-6 shadow-card h-fit sticky top-8">
      <p className="text-sm text-slate-500 mb-4">إدارة المتجر</p>
      <ul className="flex flex-col gap-3 text-brand-brown font-medium">
        {adminLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block rounded-2xl border border-transparent px-4 py-2 hover:border-brand-gold/60 hover:text-brand-gold transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

