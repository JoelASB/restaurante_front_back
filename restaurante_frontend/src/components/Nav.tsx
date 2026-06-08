'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/platos', label: 'Platos' },
  { href: '/mesas', label: 'Mesas' },
  { href: '/pedidos', label: 'Pedidos' },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-1 px-4 py-3">
        <span className="mr-6 text-lg font-semibold text-gray-900">
          Restaurante
        </span>
        {links.map(({ href, label }) => {
          const isActive =
            href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-orange-100 text-orange-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
