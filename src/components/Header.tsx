// src/components/Header.tsx
// Top header bar displaying page title.

'use client';

import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  let title = '';
  if (pathname === '/') title = 'Tableau de bord';
  else if (pathname.startsWith('/clients')) title = 'Clients';
  else if (pathname.startsWith('/dossiers')) title = 'Dossiers';
  else title = '';

  return (
    <header className="h-16 flex items-center px-6 bg-white border-b sticky top-0 z-10">
      <h1 className="text-xl font-semibold flex-1 capitalize">{title}</h1>
    </header>
  );
}
