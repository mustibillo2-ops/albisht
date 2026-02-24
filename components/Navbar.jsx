'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { BsBag } from 'react-icons/bs';
import { NAV_LINKS } from '@/lib/constants';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className="bg-brand-white border-b border-brand-gold/40">
      <div className="flex h-20 items-center justify-between max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-6 text-sm sm:text-base font-medium">
          <Link
            href="/"
            className="text-brand-brown font-semibold text-lg sm:text-xl"
          >
            البشت العربي الأصيل
          </Link>
          <ul className="hidden md:flex items-center gap-4 lg:gap-6 text-brand-black/80">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`transition-colors hover:text-brand-gold ${
                    pathname === link.href ? 'text-brand-gold' : ''
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full border border-brand-gold/60 px-4 py-2 text-sm font-medium text-brand-brown hover:bg-brand-gold hover:text-brand-black transition"
          >
            تسجيل الدخول
          </Link>
          <Link
            href="/cart"
            className="relative flex items-center justify-center rounded-full border border-brand-gold text-brand-black px-4 py-2 text-sm font-medium transition-all hover:bg-brand-gold hover:text-brand-white"
            aria-label="السلة"
          >
            <BsBag className="text-lg" />
            {isClient && itemCount > 0 && (
              <span className="absolute -top-2 -left-2 bg-brand-black text-white text-xs rounded-full px-2 py-0.5">
                {itemCount}
              </span>
            )}
          </Link>
          <button className="md:hidden text-sm text-brand-brown border border-brand-gold px-3 py-1 rounded-full">
            القائمة
          </button>
        </div>
      </div>
      <div className="md:hidden border-t border-brand-gold/30">
        <ul className="flex flex-wrap justify-between text-sm px-4 py-3 gap-2">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`transition-colors hover:text-brand-gold ${
                  pathname === link.href ? 'text-brand-gold' : 'text-brand-black/80'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}

