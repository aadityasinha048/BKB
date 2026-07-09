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
      background: '#0F0F12',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Background Orbs */}
      <div style={{
        position: 'absolute',
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(200,90,8,0.08) 0%, transparent 70%)',
        top: -150,
        right: -100,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(26,92,56,0.06) 0%, transparent 70%)',
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
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 32px rgba(27,107,58,0.25)',
            border: '2px solid #1B6B3A',
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
            color: '#F5F0EB',
            fontFamily: "'Playfair Display', serif",
            marginBottom: 6,
          }}>Bihar Ka Bazaar</h1>
          <p style={{ fontSize: 13, color: '#6B6B78', fontWeight: 500 }}>Admin Control Panel</p>
        </div>

        {/* Login Card */}
        <form onSubmit={handleLogin} style={{
          background: '#18181F',
          borderRadius: 20,
          padding: '36px 32px',
          border: '1px solid #26262F',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }}>
          <h2 style={{
            fontSize: 20,
            fontWeight: 700,
            color: '#F5F0EB',
            marginBottom: 6,
          }}>Welcome back</h2>
          <p style={{ fontSize: 13, color: '#6B6B78', marginBottom: 28 }}>
            Sign in to manage your platform.
          </p>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(211,47,47,0.1)',
              border: '1px solid rgba(211,47,47,0.25)',
              borderRadius: 10,
              padding: '12px 16px',
              fontSize: 13,
              color: '#EF5350',
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
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#9B9BA8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
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
                background: '#0F0F12',
                border: '1.5px solid #26262F',
                borderRadius: 12,
                fontSize: 14,
                color: '#F5F0EB',
                outline: 'none',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = '#C85A08'}
              onBlur={e => e.target.style.borderColor = '#26262F'}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#9B9BA8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
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
                  background: '#0F0F12',
                  border: '1.5px solid #26262F',
                  borderRadius: 12,
                  fontSize: 14,
                  color: '#F5F0EB',
                  outline: 'none',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#C85A08'}
                onBlur={e => e.target.style.borderColor = '#26262F'}
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
                  fontSize: 16,
                  color: '#6B6B78',
                  padding: 0,
                }}
              >
                {showPassword ? '🙈' : '👁️'}
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
              background: loading ? '#8C5A20' : 'linear-gradient(135deg, #C85A08, #E87A28)',
              border: 'none',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              color: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.25s',
              boxShadow: '0 4px 16px rgba(200,90,8,0.3)',
            }}
            onMouseEnter={e => { if (!loading) e.target.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.target.style.transform = 'none'; }}
          >
            {loading ? '⏳ Signing in...' : 'Sign In →'}
          </button>
        </form>

        {/* Footer hint */}
        <div style={{
          textAlign: 'center',
          marginTop: 28,
          fontSize: 12,
          color: '#3A3A45',
        }}>
          🔒 Secured admin access · Bindisa Agritech Pvt. Ltd.
        </div>
      </div>
    </div>
  );
}
