'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, Search, Heart, User, Menu, X, ChevronDown } from 'lucide-react';

const navLinks = [
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
  { href: '/sellers', label: 'Sell on BKB' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/about', label: 'About' },
];

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

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

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
      <nav style={{
        background: '#fff',
        borderBottom: '1.5px solid #E8DDD4',
        height: 68,
        display: 'flex',
        alignItems: 'center',
        padding: '0 48px',
        gap: 0,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 12px rgba(100,60,20,0.06)',
      }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0, marginRight: 36 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#C85A08', lineHeight: 1, fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
            बिहार का बाज़ार
          </div>
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase', color: '#8C7B6E', marginTop: 1 }}>
            Bihar Ka Bazaar
          </div>
        </Link>

        {/* Nav Links */}
        <div style={{ display: 'flex', gap: 2, flex: 1, alignItems: 'center' }}>
          {navLinks.map((link) => (
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
                  color: '#4A3F35',
                  background: activeDropdown === link.label ? '#FFF4EC' : 'transparent',
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
                    border: '1.5px solid #E8DDD4',
                    borderRadius: 14,
                    padding: '8px',
                    minWidth: 210,
                    boxShadow: '0 8px 32px rgba(100,60,20,0.12)',
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
                          color: '#4A3F35',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#FFF4EC'; e.currentTarget.style.color = '#C85A08'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4A3F35'; }}
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
                  color: pathname === link.href ? '#C85A08' : '#4A3F35',
                  background: pathname === link.href ? '#FFF4EC' : 'transparent',
                  transition: 'all 0.18s',
                  cursor: 'pointer',
                }}
                  onMouseEnter={e => { if (pathname !== link.href) { e.currentTarget.style.background = '#FFF4EC'; e.currentTarget.style.color = '#C85A08'; }}}
                  onMouseLeave={e => { if (pathname !== link.href) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4A3F35'; }}}
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
          <button onClick={() => setSearchOpen(true)} style={{ width: 38, height: 38, borderRadius: 8, background: 'none', border: '1.5px solid #E8DDD4', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.18s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#C85A08'; e.currentTarget.style.background = '#FFF4EC'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8DDD4'; e.currentTarget.style.background = 'none'; }}
          >
            <Search size={16} color="#4A3F35" />
          </button>

          {/* Wishlist */}
          <Link href="/wishlist">
            <button style={{ width: 38, height: 38, borderRadius: 8, background: 'none', border: '1.5px solid #E8DDD4', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C85A08'; e.currentTarget.style.background = '#FFF4EC'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8DDD4'; e.currentTarget.style.background = 'none'; }}
            >
              <Heart size={16} color="#4A3F35" />
            </button>
          </Link>

          {/* Profile */}
          <Link href="/profile">
            <button style={{ width: 38, height: 38, borderRadius: 8, background: 'none', border: '1.5px solid #E8DDD4', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C85A08'; e.currentTarget.style.background = '#FFF4EC'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8DDD4'; e.currentTarget.style.background = 'none'; }}
            >
              <User size={16} color="#4A3F35" />
            </button>
          </Link>

          <div style={{ width: 1, height: 28, background: '#E8DDD4', margin: '0 4px' }} />

          {/* Sell Button */}
          <Link href="/sellers" style={{ textDecoration: 'none' }}>
            <button style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: '1.5px solid #E8DDD4', color: '#4A3F35', background: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C85A08'; e.currentTarget.style.color = '#C85A08'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8DDD4'; e.currentTarget.style.color = '#4A3F35'; }}
            >
              Sell
            </button>
          </Link>

          {/* Cart */}
          <Link href="/cart" style={{ textDecoration: 'none' }}>
            <div style={{ position: 'relative', width: 42, height: 38, borderRadius: 8, background: '#FFF4EC', border: '1.5px solid #FFE8D4', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#C85A08'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#FFF4EC'; }}
            >
              <ShoppingCart size={17} color="#C85A08" />
              <span style={{ position: 'absolute', top: -6, right: -6, background: '#C85A08', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #FFFCF8', fontFamily: 'inherit' }}>
                0
              </span>
            </div>
          </Link>
        </div>
      </nav>

      {/* ── SEARCH OVERLAY ── */}
      {searchOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(26,20,16,0.6)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 80 }}
          onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}
        >
          <div style={{ background: '#fff', borderRadius: 20, padding: '28px', width: '100%', maxWidth: 640, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', margin: '0 24px' }}>
            <form onSubmit={handleSearch}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20 }}>
                <Search size={20} color="#8C7B6E" style={{ flexShrink: 0 }} />
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search for makhana, madhubani, silk saree..."
                  style={{ flex: 1, border: 'none', fontSize: 16, fontFamily: 'inherit', outline: 'none', color: '#1A1410', background: 'transparent' }}
                />
                <button type="button" onClick={() => setSearchOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                  <X size={20} color="#8C7B6E" />
                </button>
              </div>
            </form>
            <div style={{ borderTop: '1px solid #E8DDD4', paddingTop: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#8C7B6E', marginBottom: 12 }}>
                Popular Searches
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {SEARCH_SUGGESTIONS.map(s => (
                  <Link key={s} href={`/search?q=${encodeURIComponent(s)}`} style={{ textDecoration: 'none' }}>
                    <span
                      onClick={() => setSearchOpen(false)}
                      style={{ background: '#FFF4EC', color: '#C85A08', fontSize: 13, fontWeight: 600, padding: '7px 14px', borderRadius: 40, border: '1px solid #FFE8D4', cursor: 'pointer', display: 'inline-block', transition: 'all 0.18s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#C85A08'; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#FFF4EC'; e.currentTarget.style.color = '#C85A08'; }}
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
    </>
  );
}