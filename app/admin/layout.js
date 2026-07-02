'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const NAV_ITEMS = [
  { href: '/admin', label: 'Overview', icon: '📊' },
  { href: '/admin/sellers', label: 'Sellers', icon: '👥' },
  { href: '/admin/prelaunch', label: 'Pre-Launch', icon: '🚀' },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Skip auth check on login page
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false);
      setAuthenticated(true);
      return;
    }

    const token = localStorage.getItem('bkb_admin_token');
    if (!token) {
      router.replace('/admin/login');
      return;
    }

    // Verify token
    fetch('/api/admin/verify', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.valid) {
          setAuthenticated(true);
        } else {
          localStorage.removeItem('bkb_admin_token');
          router.replace('/admin/login');
        }
      })
      .catch(() => {
        router.replace('/admin/login');
      })
      .finally(() => setChecking(false));
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    const token = localStorage.getItem('bkb_admin_token');
    try {
      await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch {}
    localStorage.removeItem('bkb_admin_token');
    router.replace('/admin/login');
  };

  // Login page — no shell
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state
  if (checking) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0F0F12',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 16, animation: 'pulse 1.5s infinite' }}>🌾</div>
          <div style={{ fontSize: 14, color: '#8C7B6E', fontWeight: 500 }}>Loading Admin Panel...</div>
        </div>
      </div>
    );
  }

  if (!authenticated) return null;

  const sidebarWidth = sidebarCollapsed ? 72 : 260;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0F0F12' }}>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: sidebarWidth,
        background: 'linear-gradient(180deg, #141418 0%, #0F0F12 100%)',
        borderRight: '1px solid #1E1E26',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 50,
      }}>

        {/* Logo */}
        <div style={{
          padding: sidebarCollapsed ? '24px 12px' : '24px 22px',
          borderBottom: '1px solid #1E1E26',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
        }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #C85A08, #F09819)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            flexShrink: 0,
          }}>🌾</div>
          {!sidebarCollapsed && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#F5F0EB', letterSpacing: 0.3 }}>BKB Admin</div>
              <div style={{ fontSize: 10, color: '#6B6B78', fontWeight: 500, marginTop: 1 }}>Bihar Ka Bazaar</div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '16px 10px' }}>
          {NAV_ITEMS.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: sidebarCollapsed ? '12px' : '12px 16px',
                    borderRadius: 10,
                    marginBottom: 4,
                    cursor: 'pointer',
                    background: isActive ? 'rgba(200,90,8,0.12)' : 'transparent',
                    border: isActive ? '1px solid rgba(200,90,8,0.25)' : '1px solid transparent',
                    transition: 'all 0.2s',
                    justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                  {!sidebarCollapsed && (
                    <span style={{
                      fontSize: 13,
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#F09819' : '#9B9BA8',
                      whiteSpace: 'nowrap',
                    }}>{item.label}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div style={{ padding: '16px 10px', borderTop: '1px solid #1E1E26' }}>
          {/* Collapse Toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: sidebarCollapsed ? '10px' : '10px 16px',
              borderRadius: 10,
              width: '100%',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              marginBottom: 4,
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <span style={{ fontSize: 16, color: '#6B6B78' }}>{sidebarCollapsed ? '→' : '←'}</span>
            {!sidebarCollapsed && (
              <span style={{ fontSize: 12, color: '#6B6B78', fontWeight: 500 }}>Collapse</span>
            )}
          </button>

          {/* Visit Site */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: sidebarCollapsed ? '10px' : '10px 16px',
                borderRadius: 10,
                cursor: 'pointer',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                marginBottom: 4,
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: 16 }}>🌐</span>
              {!sidebarCollapsed && (
                <span style={{ fontSize: 12, color: '#6B6B78', fontWeight: 500 }}>Visit Site</span>
              )}
            </div>
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: sidebarCollapsed ? '10px' : '10px 16px',
              borderRadius: 10,
              width: '100%',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(211,47,47,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <span style={{ fontSize: 16 }}>🚪</span>
            {!sidebarCollapsed && (
              <span style={{ fontSize: 12, color: '#D32F2F', fontWeight: 600 }}>Logout</span>
            )}
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{
        flex: 1,
        marginLeft: sidebarWidth,
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        minHeight: '100vh',
      }}>
        {children}
      </main>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
