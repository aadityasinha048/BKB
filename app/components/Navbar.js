'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, Search, Heart, User, Menu, X, ChevronDown } from 'lucide-react';



const SEARCH_SUGGESTIONS = [
  "Premium Makhana", "Madhubani Painting", "Bhagalpuri Silk",
  "Shahi Litchi", "Katarni Rice", "Silao Khaja", "Jardalu Mango",
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const searchRef = useRef(null);

  const [userRole, setUserRole] = useState(null); // 'buyer', 'seller', or null
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    const sellerId = localStorage.getItem('bkb_seller_id');
    const userLoggedIn = localStorage.getItem('bkb_user_logged_in');
    
    if (sellerId) {
      setUserRole('seller');
    } else if (userLoggedIn === 'true') {
      setUserRole('buyer');
    } else {
      setUserRole(null);
    }

    const updateCartCount = () => {
      const stored = localStorage.getItem('bkb_cart');
      if (stored) {
        try {
          const items = JSON.parse(stored);
          const count = items.reduce((sum, item) => sum + item.qty, 0);
          setCartCount(count);
        } catch {
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    const interval = setInterval(updateCartCount, 5000);
    return () => {
      window.removeEventListener('storage', updateCartCount);
      clearInterval(interval);
    };
  }, [pathname]);

  const linksToShow = [
    { href: '/', label: 'Home' },
    {
      label: 'Shop',
      children: [
        { href: '/shop', label: '🛍️ All Products' },
        { href: '/gi-products', label: '🏅 GI Tag Products' },
        { href: '/shop?cat=Food & Agri', label: '🌾 Food & Agri' },
        { href: '/shop?cat=Handicrafts', label: '🎨 Handicrafts' },
        { href: '/shop?cat=Textiles', label: '🧵 Textiles & Silk' },
        { href: '/shop?cat=Fruits', label: '🍈 Fresh Fruits' },
      ]
    },
    ...(userRole !== 'seller' ? [{ href: '/sellers', label: 'Sell on BKB' }] : []),
    ...(userRole === 'seller' ? [{ href: '/dashboard', label: 'Seller Console' }] : []),
    ...(userRole === 'buyer' ? [{ href: '/profile', label: 'My Profile' }] : []),
    ...(userRole === null ? [{ href: '/login', label: 'Login' }] : []),
    { href: '/about', label: 'About' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav className="bkb-navbar" style={{
        background: '#fff',
        borderBottom: '1px solid #E5E1DC',
        height: 68,
        display: 'flex',
        alignItems: 'center',
        padding: '0 48px',
        gap: 0,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.3s',
      }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', flexShrink: 0, marginRight: 36 }}>
          <img
            src="/images/bkb_logo.png"
            alt="BKB Logo"
            style={{
              height: 40,
              width: 'auto',
              objectFit: 'contain',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#1B6B3A', lineHeight: 1.1, fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
              बिहार का बाज़ार
            </div>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#7A7067', marginTop: 2 }}>
              Bihar Ka Bazaar
            </div>
          </div>
        </Link>

        {/* Nav Links */}
        <div className="desktop-nav" style={{ display: 'flex', gap: 2, flex: 1, alignItems: 'center' }}>
          {linksToShow.map((link) => (
            link.children ? (
              <div key={link.label}
                style={{ position: 'relative' }}
                onMouseEnter={() => setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button style={{
                  padding: '8px 14px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  color: activeDropdown === link.label ? '#1B6B3A' : '#3D3730',
                  background: activeDropdown === link.label ? '#E8F5EC' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  transition: 'all 0.18s',
                }}>
                  {link.label}
                  <ChevronDown size={13} style={{ transition: 'transform 0.2s', transform: activeDropdown === link.label ? 'rotate(180deg)' : 'none' }} />
                </button>

                {activeDropdown === link.label && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    background: '#fff',
                    border: '1px solid #E5E1DC',
                    borderRadius: 14,
                    padding: '8px',
                    minWidth: 210,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    zIndex: 200,
                    marginTop: 4,
                  }}>
                    {link.children.map(child => (
                      <Link key={child.href} href={child.href} style={{ textDecoration: 'none' }}>
                        <div style={{
                          padding: '9px 13px',
                          borderRadius: 8,
                          fontSize: 13,
                          fontWeight: 500,
                          color: '#3D3730',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#E8F5EC'; e.currentTarget.style.color = '#1B6B3A'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#3D3730'; }}
                        >
                          {child.label}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: '8px 14px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  color: pathname === link.href ? '#1B6B3A' : '#3D3730',
                  background: pathname === link.href ? '#E8F5EC' : 'transparent',
                  transition: 'all 0.18s',
                  cursor: 'pointer',
                }}
                  onMouseEnter={e => { if (pathname !== link.href) { e.currentTarget.style.background = '#E8F5EC'; e.currentTarget.style.color = '#1B6B3A'; }}}
                  onMouseLeave={e => { if (pathname !== link.href) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#3D3730'; }}}
                >
                  {link.label}
                </div>
              </Link>
            )
          ))}
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>

          {/* Search */}
          <button onClick={() => setSearchOpen(true)} aria-label="Search products" style={{ width: 38, height: 38, borderRadius: 8, background: 'none', border: '1.5px solid #E5E1DC', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.18s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#1B6B3A'; e.currentTarget.style.background = '#E8F5EC'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E1DC'; e.currentTarget.style.background = 'none'; }}
          >
            <Search size={16} color="#3D3730" />
          </button>

          {/* Wishlist */}
          <Link href="/wishlist" className="desktop-nav">
            <button aria-label="View saved items" style={{ width: 38, height: 38, borderRadius: 8, background: 'none', border: '1.5px solid #E5E1DC', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#1B6B3A'; e.currentTarget.style.background = '#E8F5EC'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E1DC'; e.currentTarget.style.background = 'none'; }}
            >
              <Heart size={16} color="#3D3730" />
            </button>
          </Link>

          {/* Profile */}
          <Link href={userRole === 'seller' ? '/dashboard' : (userRole === 'buyer' ? '/profile' : '/login')} className="desktop-nav">
            <button aria-label="My account profile" style={{ width: 38, height: 38, borderRadius: 8, background: 'none', border: '1.5px solid #E5E1DC', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#1B6B3A'; e.currentTarget.style.background = '#E8F5EC'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E1DC'; e.currentTarget.style.background = 'none'; }}
            >
              <User size={16} color="#3D3730" />
            </button>
          </Link>

          <div className="desktop-nav" style={{ width: 1, height: 28, background: '#E5E1DC', margin: '0 4px' }} />

          {/* Sell Button */}
          <Link href="/sellers" className="desktop-nav" style={{ textDecoration: 'none' }}>
            <button style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: '1.5px solid #1B6B3A', color: '#1B6B3A', background: '#E8F5EC', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1B6B3A'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#E8F5EC'; e.currentTarget.style.color = '#1B6B3A'; }}
            >
              Sell
            </button>
          </Link>

          {/* Cart */}
          <Link href="/cart" style={{ textDecoration: 'none' }}>
            <div aria-label="Shopping Cart" style={{ position: 'relative', width: 42, height: 38, borderRadius: 8, background: '#E8F5EC', border: '1.5px solid #D0EBDA', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1B6B3A'; const icon = e.currentTarget.querySelector('svg'); if (icon) icon.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#E8F5EC'; const icon = e.currentTarget.querySelector('svg'); if (icon) icon.style.color = '#1B6B3A'; }}
            >
              <ShoppingCart size={17} color="#1B6B3A" />
              <span style={{ position: 'absolute', top: -6, right: -6, background: '#E87B24', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff', fontFamily: 'inherit' }}>
                {cartCount}
              </span>
            </div>
          </Link>

          {/* Mobile Hamburger menu toggle */}
          <button
            className="mobile-nav-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: 'none',
              width: 38,
              height: 38,
              borderRadius: 8,
              background: 'none',
              border: '1.5px solid #E5E1DC',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              marginLeft: 4,
            }}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={18} color="#3D3730" /> : <Menu size={18} color="#3D3730" />}
          </button>

        </div>
      </nav>

      {/* ── SEARCH OVERLAY ── */}
      {searchOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 80 }}
          onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}
        >
          <div style={{ background: '#fff', borderRadius: 20, padding: '28px', width: '100%', maxWidth: 640, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', margin: '0 24px' }}>
            <form onSubmit={handleSearch}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20 }}>
                <Search size={20} color="#7A7067" style={{ flexShrink: 0 }} />
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search for makhana, madhubani, silk saree..."
                  style={{ flex: 1, border: 'none', fontSize: 16, fontFamily: 'inherit', outline: 'none', color: '#1A1410', background: 'transparent' }}
                />
                <button type="button" onClick={() => setSearchOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                  <X size={20} color="#7A7067" />
                </button>
              </div>
            </form>
            <div style={{ borderTop: '1px solid #E5E1DC', paddingTop: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#7A7067', marginBottom: 12 }}>
                Popular Searches
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {SEARCH_SUGGESTIONS.map(s => (
                  <Link key={s} href={`/search?q=${encodeURIComponent(s)}`} style={{ textDecoration: 'none' }}>
                    <span
                      onClick={() => setSearchOpen(false)}
                      style={{ background: '#E8F5EC', color: '#1B6B3A', fontSize: 13, fontWeight: 600, padding: '7px 14px', borderRadius: 40, border: '1px solid #D0EBDA', cursor: 'pointer', display: 'inline-block', transition: 'all 0.18s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#1B6B3A'; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#E8F5EC'; e.currentTarget.style.color = '#1B6B3A'; }}
                    >
                      {s}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ── MOBILE MENU DRAWER ── */}
      {mobileOpen && (
        <div style={{
          position: 'fixed',
          top: 68,
          left: 0,
          right: 0,
          bottom: 0,
          background: '#fff',
          zIndex: 99,
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          borderTop: '1px solid #E5E1DC',
          overflowY: 'auto',
        }}>
          {linksToShow.map((link) => (
            link.children ? (
              <div key={link.label} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#7A7067', textTransform: 'uppercase', letterSpacing: 1 }}>{link.label}</div>
                {link.children.map(child => (
                  <Link key={child.href} href={child.href} onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none', paddingLeft: 12, fontSize: 14, fontWeight: 500, color: '#3D3730' }}>
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none', fontSize: 15, fontWeight: 600, color: pathname === link.href ? '#1B6B3A' : '#3D3730', padding: '6px 0' }}>
                {link.label}
              </Link>
            )
          ))}
          <div style={{ borderTop: '1px solid #E5E1DC', paddingTop: 16, marginTop: 'auto', display: 'flex', gap: 10 }}>
            <Link href={userRole === 'seller' ? '/dashboard' : (userRole === 'buyer' ? '/profile' : '/login')} onClick={() => setMobileOpen(false)} style={{ flex: 1, textDecoration: 'none' }}>
              <button style={{ width: '100%', padding: '10px', borderRadius: 8, background: '#F8F6F3', border: '1.5px solid #E5E1DC', color: '#3D3730', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                Account Profile
              </button>
            </Link>
            <Link href="/sellers" onClick={() => setMobileOpen(false)} style={{ flex: 1, textDecoration: 'none' }}>
              <button style={{ width: '100%', padding: '10px', borderRadius: 8, background: '#1B6B3A', border: 'none', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                Sell on BKB
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}