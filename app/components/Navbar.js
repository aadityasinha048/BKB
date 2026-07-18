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

  const iconBtnClasses =
    'flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border-[1.5px] border-line bg-transparent text-ink-2 transition-all duration-200 hover:border-green hover:bg-green-bg hover:text-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green';

  return (
    <>
      <nav className="sticky top-0 z-100 flex h-[68px] items-center border-b border-line bg-white px-5 shadow-[0_1px_8px_rgba(0,0,0,0.04)] lg:px-12">

        {/* Logo */}
        <Link href="/" className="mr-4 flex shrink-0 items-center gap-3 no-underline lg:mr-9">
          <img
            src="/images/bkb_logo.png"
            alt="BKB Logo"
            className="h-10 w-auto object-contain"
          />
          <div className="flex flex-col">
            <div className="devanagari text-base font-extrabold leading-tight text-green">
              बिहार का बाज़ार
            </div>
            <div className="mt-0.5 text-[8px] font-bold uppercase tracking-[2px] text-ink-3">
              Bihar Ka Bazaar
            </div>
          </div>
        </Link>

        {/* Nav Links (desktop) */}
        <div className="hidden flex-1 items-center gap-0.5 lg:flex">
          {linksToShow.map((link) => (
            link.children ? (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className={`flex cursor-pointer items-center gap-1 rounded-lg border-none px-3.5 py-2 font-sans text-[13px] font-medium transition-all duration-200 ${
                    activeDropdown === link.label ? 'bg-green-bg text-green' : 'bg-transparent text-ink-2'
                  }`}
                >
                  {link.label}
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${activeDropdown === link.label ? 'rotate-180' : ''}`}
                  />
                </button>

                {activeDropdown === link.label && (
                  <div className="absolute left-0 top-full z-200 mt-1 min-w-[210px] rounded-[14px] border border-line bg-white p-2 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
                    {link.children.map(child => (
                      <Link key={child.href} href={child.href} className="no-underline">
                        <div className="cursor-pointer rounded-lg px-3 py-2 text-[13px] font-medium text-ink-2 transition-colors duration-150 hover:bg-green-bg hover:text-green">
                          {child.label}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={link.href} href={link.href} className="no-underline">
                <div
                  className={`cursor-pointer rounded-lg px-3.5 py-2 text-[13px] font-medium transition-all duration-200 ${
                    pathname === link.href
                      ? 'bg-green-bg text-green'
                      : 'bg-transparent text-ink-2 hover:bg-green-bg hover:text-green'
                  }`}
                >
                  {link.label}
                </div>
              </Link>
            )
          ))}
        </div>

        {/* Right Actions */}
        <div className="ml-auto flex shrink-0 items-center gap-1.5 lg:ml-0">

          {/* Search */}
          <button onClick={() => setSearchOpen(true)} aria-label="Search products" className={iconBtnClasses}>
            <Search size={16} />
          </button>

          {/* Wishlist */}
          <Link href="/wishlist" className="hidden lg:block" aria-label="View saved items">
            <span className={iconBtnClasses}>
              <Heart size={16} />
            </span>
          </Link>

          {/* Profile */}
          <Link
            href={userRole === 'seller' ? '/dashboard' : (userRole === 'buyer' ? '/profile' : '/login')}
            className="hidden lg:block"
            aria-label="My account profile"
          >
            <span className={iconBtnClasses}>
              <User size={16} />
            </span>
          </Link>

          <div className="mx-1 hidden h-7 w-px bg-line lg:block" />

          {/* Sell Button */}
          <Link href="/sellers" className="hidden no-underline lg:block">
            <span className="inline-flex cursor-pointer items-center rounded-lg border-[1.5px] border-green bg-green-bg px-4 py-2 font-sans text-[13px] font-semibold text-green transition-all duration-200 hover:bg-green hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green">
              Sell
            </span>
          </Link>

          {/* Cart */}
          <Link href="/cart" className="no-underline" aria-label="Shopping Cart">
            <div className="group relative flex h-10 w-[42px] cursor-pointer items-center justify-center rounded-lg border-[1.5px] border-green-bg2 bg-green-bg transition-all duration-200 hover:bg-green">
              <ShoppingCart size={17} className="text-green transition-colors duration-200 group-hover:text-white" />
              <span className="absolute -right-1.5 -top-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-white bg-orange font-sans text-[10px] font-extrabold text-white">
                {cartCount}
              </span>
            </div>
          </Link>

          {/* Mobile Hamburger menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`${iconBtnClasses} ml-1 lg:hidden`}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

        </div>
      </nav>

      {/* ── SEARCH OVERLAY ── */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-300 flex items-start justify-center bg-black/50 pt-20 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}
        >
          <div className="mx-6 w-full max-w-[640px] rounded-[20px] bg-white p-7 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
            <form onSubmit={handleSearch}>
              <div className="mb-5 flex items-center gap-2.5">
                <Search size={20} className="shrink-0 text-ink-3" />
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search for makhana, madhubani, silk saree..."
                  className="flex-1 border-none bg-transparent font-sans text-base text-ink outline-none placeholder:text-ink-4"
                />
                <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search" className="cursor-pointer border-none bg-transparent p-1 text-ink-3 hover:text-ink">
                  <X size={20} />
                </button>
              </div>
            </form>
            <div className="border-t border-line pt-4">
              <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-ink-3">
                Popular Searches
              </div>
              <div className="flex flex-wrap gap-2">
                {SEARCH_SUGGESTIONS.map(s => (
                  <Link key={s} href={`/search?q=${encodeURIComponent(s)}`} className="no-underline">
                    <span
                      onClick={() => setSearchOpen(false)}
                      className="inline-block cursor-pointer rounded-full border border-green-bg2 bg-green-bg px-3.5 py-[7px] text-[13px] font-semibold text-green transition-all duration-200 hover:bg-green hover:text-white"
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
        <div className="fixed inset-x-0 bottom-0 top-[68px] z-99 flex flex-col gap-4 overflow-y-auto border-t border-line bg-white px-5 py-6 lg:hidden">
          {linksToShow.map((link) => (
            link.children ? (
              <div key={link.label} className="flex flex-col gap-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-ink-3">{link.label}</div>
                {link.children.map(child => (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={() => setMobileOpen(false)}
                    className="pl-3 text-sm font-medium text-ink-2 no-underline"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`py-1.5 text-[15px] font-semibold no-underline ${pathname === link.href ? 'text-green' : 'text-ink-2'}`}
              >
                {link.label}
              </Link>
            )
          ))}
          <div className="mt-auto flex gap-2.5 border-t border-line pt-4">
            <Link
              href={userRole === 'seller' ? '/dashboard' : (userRole === 'buyer' ? '/profile' : '/login')}
              onClick={() => setMobileOpen(false)}
              className="flex-1 no-underline"
            >
              <button className="w-full cursor-pointer rounded-lg border-[1.5px] border-line bg-bg-3 p-2.5 font-sans text-[13px] font-semibold text-ink-2">
                Account Profile
              </button>
            </Link>
            <Link href="/sellers" onClick={() => setMobileOpen(false)} className="flex-1 no-underline">
              <button className="w-full cursor-pointer rounded-lg border-none bg-green p-2.5 font-sans text-[13px] font-semibold text-white">
                Sell on BKB
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
