'use client';

import Link from 'next/link';

const footerLinks = {
  'For Buyers': [
    { label: 'Browse Products', href: '/shop' },
    { label: 'GI-Tag Products', href: '/gi-products' },
    { label: 'My Cart', href: '/cart' },
    { label: 'Track Order', href: '/order-tracking' },
    { label: 'Returns Policy', href: '#' },
  ],
  'For Sellers': [
    { label: 'Become a Seller', href: '/sellers' },
    { label: 'Seller Dashboard', href: '/dashboard' },
    { label: 'Add a Product', href: '/seller/add-product' },
    { label: 'Packaging Tips', href: '#' },
    { label: 'Payment Info', href: '#' },
  ],
  'Company': [
    { label: 'About Us', href: '/about' },
    { label: 'Bindisa Agritech', href: '/about' },
    { label: 'Our Mission', href: '/about' },
    { label: 'Contact BKB', href: '/contact' },
    { label: 'Privacy Policy', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-green-dark text-[#A8C9B4]">

      {/* Main Footer */}
      <div className="grid grid-cols-1 gap-9 border-b border-white/10 px-6 py-10 lg:grid-cols-[2.2fr_1fr_1fr_1fr] lg:gap-12 lg:px-[60px] lg:pb-10 lg:pt-14">

        {/* Brand */}
        <div className="flex flex-col">
          <div className="mb-4 flex items-center gap-3">
            <img
              src="/images/bkb_logo.png"
              alt="BKB Logo"
              className="h-11 w-auto rounded-lg bg-white object-contain p-1"
            />
            <div className="flex flex-col">
              <div className="devanagari text-xl font-extrabold leading-tight text-white">
                बिहार का बाज़ार
              </div>
              <div className="mt-0.5 text-[8px] uppercase tracking-[2px] text-white/50">
                Bihar Ka Bazaar
              </div>
            </div>
          </div>
          <p className="mb-5 max-w-[280px] text-[13px] leading-relaxed text-white/50">
            An initiative by Bindisa Agritech to connect Bihar&apos;s farmers and artisans directly to buyers across India. Authentic. Transparent. Empowering.
          </p>
          <div className="flex flex-col gap-1.5">
            <div className="text-xs text-white/45">📍 Patna, Bihar, India — 800001</div>
            <div className="text-xs text-white/45">✉️ contact@biharkabazaar.in</div>
            <div className="text-xs text-white/45">📞 +91 612-XXX-XXXX</div>
          </div>
        </div>

        {/* Link Columns */}
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <div className="mb-4 text-[11px] font-bold uppercase tracking-[2px] text-white/60">
              {title}
            </div>
            {links.map((link) => (
              <Link key={link.label} href={link.href} className="no-underline">
                <div className="mb-2.5 cursor-pointer text-[13px] text-white/40 transition-colors duration-200 hover:text-orange">
                  {link.label}
                </div>
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="flex flex-col items-center gap-2 px-6 py-[18px] text-center lg:flex-row lg:justify-between lg:px-[60px] lg:text-left">
        <span className="text-[11px] text-white/25">
          © {new Date().getFullYear()} Bihar Ka Bazaar. All rights reserved.
        </span>
        <span className="text-[11px] text-white/25">
          An initiative by <strong className="text-orange">Bindisa Agritech</strong>
        </span>
      </div>

    </footer>
  );
}
