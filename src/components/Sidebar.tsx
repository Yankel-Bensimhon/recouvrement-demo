// src/components/Sidebar.tsx
// Navigation sidebar listing main sections of the CRM.

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Dashboard' },
  { href: '/clients', label: 'Clients' },
  { href: '/dossiers', label: 'Dossiers' },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 bg-white border-r hidden md:flex md:flex-col">
      <div className="h-16 flex items-center justify-center border-b">
        <span className="text-xl font-bold">Cabinet CRM</span>
      </div>
      <nav className="mt-4 flex-1">
        {navItems.map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href} legacyBehavior>
              <a
                className={`flex items-center px-4 py-2 hover:bg-gray-100 border-l-4 ${
                  isActive ? 'border-blue-600 font-medium text-blue-600 bg-gray-50' : 'border-transparent text-gray-700'
                }`}
              >
                {label}
              </a>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
