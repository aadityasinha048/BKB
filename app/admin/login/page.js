'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password: password.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('bkb_admin_token', data.token);
        router.replace('/admin');
      } else {
        setError(data.error || 'Login failed. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0B0F14',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Ambient Depth Orbs */}
      <div style={{
        position: 'absolute',
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
        top: -150,
        right: -100,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)',
        bottom: -100,
        left: -80,
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%',
        maxWidth: 420,
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 32px rgba(16,185,129,0.22)',
            border: '2px solid #10B981',
            overflow: 'hidden',
          }}>
            <img
              src="/images/bkb_logo.png"
              alt="BKB Logo"
              style={{ width: '80%', height: '80%', objectFit: 'contain' }}
            />
          </div>
          <h1 style={{
            fontSize: 26,
            fontWeight: 800,
            color: '#F8FAFC',
            fontFamily: "'Playfair Display', serif",
            marginBottom: 6,
          }}>Bihar Ka Bazaar</h1>
          <p style={{ fontSize: 13, color: '#94A3B8', fontWeight: 500 }}>Admin Command Center</p>
        </div>

        {/* Login Card */}
        <form onSubmit={handleLogin} style={{
          background: '#121822',
          borderRadius: 20,
          padding: '36px 32px',
          border: '1px solid #1E2735',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        }}>
          <h2 style={{
            fontSize: 20,
            fontWeight: 700,
            color: '#F8FAFC',
            marginBottom: 6,
          }}>Welcome back</h2>
          <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 28 }}>
            Sign in to manage your marketplace platform.
          </p>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.28)',
              borderRadius: 10,
              padding: '12px 16px',
              fontSize: 13,
              color: '#F87171',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Username */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94A3B8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(''); }}
              placeholder="Enter your username"
              autoFocus
              style={{
                width: '100%',
                padding: '13px 16px',
                background: '#0B0F14',
                border: '1.5px solid #222D3D',
                borderRadius: 12,
                fontSize: 14,
                color: '#F8FAFC',
                outline: 'none',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = '#10B981'}
              onBlur={e => e.target.style.borderColor = '#222D3D'}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94A3B8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  padding: '13px 48px 13px 16px',
                  background: '#0B0F14',
                  border: '1.5px solid #222D3D',
                  borderRadius: 12,
                  fontSize: 14,
                  color: '#F8FAFC',
                  outline: 'none',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#10B981'}
                onBlur={e => e.target.style.borderColor = '#222D3D'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#94A3B8',
                  padding: 0,
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: 15,
              background: loading ? '#064E3B' : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              border: 'none',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              color: '#FFFFFF',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.25s',
              boxShadow: '0 4px 18px rgba(16,185,129,0.32)',
              marginBottom: 14,
            }}
            onMouseEnter={e => { if (!loading) e.target.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.target.style.transform = 'none'; }}
          >
            {loading ? 'Signing in...' : 'Sign In to Console →'}
          </button>

          {/* Quick Fill Demo Credentials */}
          <button
            type="button"
            onClick={() => {
              setUsername('admin');
              setPassword('bkb2026');
            }}
            style={{
              width: '100%',
              padding: '10px 14px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px dashed #2A3649',
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 600,
              color: '#94A3B8',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Fill Dev Credentials (admin / bkb2026)
          </button>
        </form>

        {/* Footer hint */}
        <div style={{
          textAlign: 'center',
          marginTop: 28,
          fontSize: 12,
          color: '#64748B',
        }}>
          🔒 Secured Enterprise Access · Bihar Ka Bazaar Admin
        </div>
      </div>
    </div>
  );
}
