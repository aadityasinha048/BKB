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
    <footer style={{ background: '#18120D', color: '#B0A090' }}>

      {/* Main Footer */}
      <div style={{
        padding: '52px 60px 36px',
        display: 'grid',
        gridTemplateColumns: '2.2fr 1fr 1fr 1fr',
        gap: 44,
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>

        {/* Brand */}
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#E06A1A', marginBottom: 4 }}>
            बिहार का बाज़ार
          </div>
          <div style={{ fontSize: 9, color: '#5A4A3A', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>
            Bihar Ka Bazaar
          </div>
          <p style={{ fontSize: 12, lineHeight: 1.8, color: '#705A45', maxWidth: 260, marginBottom: 16 }}>
            An initiative by Bindisa Agritech to connect Bihar's farmers and artisans directly to buyers across India. Authentic. Transparent. Empowering.
          </p>
          <div style={{ fontSize: 12, color: '#705A45', marginBottom: 5 }}>📍 Patna, Bihar, India — 800001</div>
          <div style={{ fontSize: 12, color: '#705A45', marginBottom: 5 }}>✉️ contact@biharkazaar.in</div>
          <div style={{ fontSize: 12, color: '#705A45' }}>📞 +91 612-XXX-XXXX</div>
        </div>

        {/* Link Columns */}
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: '#C0B0A0',
              marginBottom: 14,
            }}>
              {title}
            </div>
            {links.map((link) => (
              <Link key={link.label} href={link.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  fontSize: 12,
                  color: '#705A45',
                  marginBottom: 8,
                  cursor: 'pointer',
                  transition: 'color 0.18s',
                }}
                  onMouseEnter={e => e.target.style.color = '#E06A1A'}
                  onMouseLeave={e => e.target.style.color = '#705A45'}
                >
                  {link.label}
                </div>
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div style={{
        padding: '17px 60px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: 11, color: '#4A3A2A' }}>
          © 2025 Bihar Ka Bazaar. All rights reserved.
        </span>
        <span style={{ fontSize: 11, color: '#4A3A2A' }}>
          An initiative by <strong style={{ color: '#E06A1A' }}>Bindisa Agritech</strong>
        </span>
      </div>

    </footer>
  );
}