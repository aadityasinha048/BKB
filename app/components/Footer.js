'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  const footerLinks = {
    [t('footer.forBuyers')]: [
      { label: t('footer.browseProducts'), href: '/shop' },
      { label: t('footer.giTagProducts'), href: '/gi-products' },
      { label: t('footer.myCart'), href: '/cart' },
      { label: t('footer.trackOrder'), href: '/order-tracking' },
      { label: t('footer.returnsPolicy'), href: '#' },
    ],
    [t('footer.forSellers')]: [
      { label: t('footer.becomeASeller'), href: '/sellers' },
      { label: t('footer.sellerDashboard'), href: '/dashboard' },
      { label: t('footer.addProduct'), href: '/seller/add-product' },
      { label: t('footer.packagingTips'), href: '#' },
      { label: t('footer.paymentInfo'), href: '#' },
    ],
    [t('footer.company')]: [
      { label: t('footer.aboutUs'), href: '/about' },
      { label: t('footer.bindisaAgritech'), href: '/about' },
      { label: t('footer.ourMission'), href: '/mission' },
      { label: t('footer.contactBkb'), href: '/contact' },
      { label: t('footer.privacyPolicy'), href: '/privacy' },
    ],
  };

  return (
    <footer style={{ background: 'linear-gradient(180deg, #0C3D1F 0%, #071F10 100%)', color: '#A8C9B4', position: 'relative', overflow: 'hidden' }}>

      {/* Decorative top border — marigold harvest line */}
      <div style={{ height: 3, background: 'linear-gradient(90deg, #D97706 0%, #FBBF24 30%, #D97706 60%, #92400E 100%)' }} />

      {/* Subtle radial glow behind footer content */}
      <div style={{
        position: 'absolute',
        width: 600,
        height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(26,107,58,0.08) 0%, transparent 70%)',
        top: '-200px',
        left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
        filter: 'blur(60px)',
      }} />

      {/* Main Footer */}
      <div className="bkb-footer-main" style={{
        padding: '56px 60px 40px',
        display: 'grid',
        gridTemplateColumns: '2.2fr 1fr 1fr 1fr',
        gap: 48,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* Brand */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <img
              src="/images/bkb_logo.png"
              alt="BKB Logo"
              style={{ height: 44, width: 'auto', objectFit: 'contain', borderRadius: 8, background: '#fff', padding: '4px' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', lineHeight: 1.1, fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                बिहार का बाज़ार
              </div>
              <div style={{ fontSize: 8, color: '#FBBF24', letterSpacing: 2.5, textTransform: 'uppercase', marginTop: 2, fontWeight: 700 }}>
                Bihar Ka Bazaar
              </div>
            </div>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.8, color: 'rgba(255,255,255,0.45)', maxWidth: 280, marginBottom: 20 }}>
            {t('footer.tagline')}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ opacity: 0.8 }}>📍</span> Patna, Bihar, India — 800001
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ opacity: 0.8 }}>✉️</span> contact@biharkabazaar.in
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ opacity: 0.8 }}>📞</span> +91 612-XXX-XXXX
            </div>
          </div>

          {/* Heritage badges */}
          <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
            {['🌾 Farm Fresh', '🎨 Artisan Made', '🏷️ GI Certified'].map(tag => (
              <span key={tag} style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 20,
                padding: '4px 10px',
                fontSize: 10,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.5)',
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Link Columns */}
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2.5,
              textTransform: 'uppercase',
              color: '#FBBF24',
              marginBottom: 18,
            }}>
              {title}
            </div>
            {links.map((link) => (
              <Link key={link.href + link.label} href={link.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.4)',
                  marginBottom: 11,
                  cursor: 'pointer',
                  transition: 'color 0.2s, padding-left 0.2s',
                }}
                  onMouseEnter={e => { e.target.style.color = '#FBBF24'; e.target.style.paddingLeft = '6px'; }}
                  onMouseLeave={e => { e.target.style.color = 'rgba(255,255,255,0.4)'; e.target.style.paddingLeft = '0'; }}
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
        position: 'relative',
        zIndex: 1,
      }}>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)' }}>
          © {new Date().getFullYear()} Bihar Ka Bazaar. {t('footer.allRightsReserved')}
        </span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)' }}>
          {t('footer.initiativeBy')} <strong style={{ color: '#D97706' }}>Bindisa Agritech</strong>
        </span>
      </div>

    </footer>
  );
}