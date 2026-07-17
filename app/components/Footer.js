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
    <footer style={{ background: '#0D3B1E', color: '#A8C9B4' }}>

      {/* Main Footer */}
      <div className="bkb-footer-main" style={{
        padding: '56px 60px 40px',
        display: 'grid',
        gridTemplateColumns: '2.2fr 1fr 1fr 1fr',
        gap: 48,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>

        {/* Brand */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <img
              src="/images/bkb_logo.png"
              alt="BKB Logo"
              style={{
                height: 44,
                width: 'auto',
                objectFit: 'contain',
                borderRadius: 8,
                background: '#fff',
                padding: '4px',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', lineHeight: 1.1, fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                बिहार का बाज़ार
              </div>
              <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, textTransform: 'uppercase', marginTop: 2 }}>
                Bihar Ka Bazaar
              </div>
            </div>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.8, color: 'rgba(255,255,255,0.5)', maxWidth: 280, marginBottom: 20 }}>
            An initiative by Bindisa Agritech to connect Bihar's farmers and artisans directly to buyers across India. Authentic. Transparent. Empowering.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>📍 Patna, Bihar, India — 800001</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>✉️ contact@biharkabazaar.in</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>📞 +91 612-XXX-XXXX</div>
          </div>
        </div>

        {/* Link Columns */}
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.6)',
              marginBottom: 16,
            }}>
              {title}
            </div>
            {links.map((link) => (
              <Link key={link.label} href={link.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.4)',
                  marginBottom: 10,
                  cursor: 'pointer',
                  transition: 'color 0.18s',
                }}
                  onMouseEnter={e => e.target.style.color = '#E87B24'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.4)'}
                >
                  {link.label}
                </div>
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="bkb-footer-bottom" style={{
        padding: '18px 60px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>
          © {new Date().getFullYear()} Bihar Ka Bazaar. All rights reserved.
        </span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>
          An initiative by <strong style={{ color: '#E87B24' }}>Bindisa Agritech</strong>
        </span>
      </div>

    </footer>
  );
}