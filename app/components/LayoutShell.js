'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import { LanguageProvider } from '@/lib/LanguageContext';

/**
 * Conditionally renders the public Navbar + Footer.
 * Hides them on /admin routes where the admin layout provides its own shell.
 * Wraps the entire public shell with LanguageProvider for multi-language support.
 */
export default function LayoutShell({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <LanguageProvider>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </LanguageProvider>
  );
}
