'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SellerDashboardPage() {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if there's a logged-in seller ID stored in localStorage
    const storedId = localStorage.getItem('bkb_seller_id');
    if (storedId) {
      fetchSellerById(storedId);
    }
  }, []);

  // Countdown timer for OTP
  useEffect(() => {
    let interval = null;
    if (otpSent && otpCountdown > 0) {
      interval = setInterval(() => {
        setOtpCountdown(prev => prev - 1);
      }, 1000);
    } else if (otpCountdown === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otpSent, otpCountdown]);

  const fetchSellerById = async (id) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/register-seller?sellerId=${id}`);
      const data = await res.json();
      if (data.success) {
        setSeller(data.seller);
        localStorage.setItem('bkb_seller_id', id);
      } else {
        localStorage.removeItem('bkb_seller_id');
        setSeller(null);
      }
    } catch {
      setError('Network error fetching session.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!mobile.trim()) {
      setError('Please enter your mobile number.');
      return;
    }
    if (!/^\d{10}$/.test(mobile.trim())) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/seller/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: mobile.trim() }),
      });
      const data = await res.json();

      if (data.success) {
        setOtpSent(true);
        setOtpCountdown(30);
      } else {
        setError(data.error || 'Failed to send OTP.');
      }
    } catch {
      setError('Network error sending OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError('Please enter the OTP code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/seller/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: mobile.trim(), otp: otp.trim() }),
      });
      const data = await res.json();

      if (data.success) {
        setSeller(data.seller);
        localStorage.setItem('bkb_seller_id', data.seller.id);
      } else {
        setError(data.error || 'Invalid OTP.');
      }
    } catch {
      setError('Network error verifying OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('bkb_seller_id');
    setSeller(null);
    setMobile('');
    setOtp('');
    setOtpSent(false);
    setError('');
  };

  const statusColors = {
    'Completed': { bg: '#EAF5F0', color: '#1A5C38', text: 'Registration Complete ✅' },
    'Account Created': { bg: '#FFF4EC', color: '#C85A08', text: 'In Progress — Complete your registration ⏳' },
    'Approved': { bg: '#EAF5F0', color: '#1A5C38', text: 'Approved & Active ✅' },
    'Rejected': { bg: '#FDECEA', color: '#D32F2F', text: 'Rejected — Contact support ❌' },
    'Flagged': { bg: '#FFF8E1', color: '#F9A825', text: 'Under Review 🚩' },
  };

  return (
    <div style={{ background: '#FFFCF8', minHeight: '80vh' }}>

      {/* Header */}
      <div style={{ padding: '32px 60px 0', background: '#fff', borderBottom: '1px solid #E8DDD4' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#C85A08', marginBottom: 6 }}>Seller</div>
        <h1 style={{ fontSize: 36, color: '#1A1410', fontFamily: "'Playfair Display', serif", marginBottom: 24 }}>Your Dashboard</h1>
      </div>

      <div style={{ padding: '36px 60px', maxWidth: 800, margin: '0 auto' }}>

        {!seller ? (
          /* ── Login / Lookup Panel ── */
          <div style={{
            background: '#fff', border: '1.5px solid #E8DDD4',
            borderRadius: 20, padding: 40, textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📱</div>
            <h2 style={{
              fontSize: 24, fontWeight: 800, color: '#1A1410',
              fontFamily: "'Playfair Display', serif", marginBottom: 8,
            }}>Seller Login</h2>
            <p style={{ fontSize: 14, color: '#8C7B6E', marginBottom: 28, maxWidth: 400, margin: '0 auto 28px' }}>
              Sign in with your registered mobile number and OTP to access your dashboard.
            </p>

            {!otpSent ? (
              /* Step 1: Mobile Input */
              <form onSubmit={handleSendOtp} style={{ maxWidth: 400, margin: '0 auto' }}>
                <div style={{ marginBottom: 14, textAlign: 'left' }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4A3F35', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={e => { setMobile(e.target.value); setError(''); }}
                    placeholder="Enter 10-digit mobile number"
                    style={{
                      width: '100%', padding: '14px 16px',
                      border: `1.5px solid ${error ? '#D32F2F' : '#E8DDD4'}`,
                      borderRadius: 12, fontSize: 14, fontFamily: 'inherit',
                      background: '#FFFCF8', outline: 'none', color: '#1A1410',
                    }}
                    onFocus={e => e.target.style.borderColor = '#C85A08'}
                    onBlur={e => e.target.style.borderColor = error ? '#D32F2F' : '#E8DDD4'}
                  />
                </div>
                {error && <div style={{ fontSize: 12, color: '#D32F2F', marginBottom: 14, textAlign: 'left' }}>⚠️ {error}</div>}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%', padding: 14, borderRadius: 12,
                    fontSize: 15, fontWeight: 700,
                    background: loading ? '#8C7B6E' : '#C85A08',
                    color: '#fff', border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit',
                    transition: 'background 0.2s',
                  }}
                >
                  {loading ? '⏳ Processing...' : 'Send OTP'}
                </button>
              </form>
            ) : (
              /* Step 2: OTP Input */
              <form onSubmit={handleVerifyOtp} style={{ maxWidth: 400, margin: '0 auto' }}>
                <div style={{ marginBottom: 14, textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4A3F35', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      Enter 6-Digit OTP
                    </label>
                    <button
                      type="button"
                      onClick={() => { setOtpSent(false); setOtp(''); setError(''); }}
                      style={{ background: 'none', border: 'none', fontSize: 11, color: '#C85A08', cursor: 'pointer', fontWeight: 600, padding: 0 }}
                    >
                      Change Mobile
                    </button>
                  </div>
                  <input
                    type="text"
                    value={otp}
                    onChange={e => { setOtp(e.target.value); setError(''); }}
                    placeholder="Enter OTP (use 123456)"
                    maxLength={6}
                    style={{
                      width: '100%', padding: '14px 16px',
                      border: `1.5px solid ${error ? '#D32F2F' : '#E8DDD4'}`,
                      borderRadius: 12, fontSize: 14, fontFamily: 'inherit',
                      background: '#FFFCF8', outline: 'none', color: '#1A1410',
                      letterSpacing: 2, textAlign: 'center',
                    }}
                    onFocus={e => e.target.style.borderColor = '#C85A08'}
                    onBlur={e => e.target.style.borderColor = error ? '#D32F2F' : '#E8DDD4'}
                  />
                  <div style={{ fontSize: 11, color: '#8C7B6E', marginTop: 6, display: 'flex', justifyContent: 'space-between' }}>
                    <span>OTP sent to {mobile}</span>
                    {otpCountdown > 0 ? (
                      <span>Resend in {otpCountdown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        style={{ background: 'none', border: 'none', fontSize: 11, color: '#C85A08', cursor: 'pointer', fontWeight: 600, padding: 0 }}
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
                {error && <div style={{ fontSize: 12, color: '#D32F2F', marginBottom: 14, textAlign: 'left' }}>⚠️ {error}</div>}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%', padding: 14, borderRadius: 12,
                    fontSize: 15, fontWeight: 700,
                    background: loading ? '#8C7B6E' : '#1A5C38',
                    color: '#fff', border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit',
                    transition: 'background 0.2s',
                  }}
                >
                  {loading ? '⏳ Verifying...' : 'Verify & Login'}
                </button>
              </form>
            )}

            <div style={{ marginTop: 24, fontSize: 13, color: '#C0B0A0' }}>
              Don&apos;t have an account?{' '}
              <Link href="/sellers" style={{ color: '#C85A08', fontWeight: 700 }}>Register as a Seller →</Link>
            </div>
          </div>
        ) : (
          /* ── Seller Dashboard ── */
          <div>
            {/* Status Banner */}
            <div style={{
              background: statusColors[seller.status]?.bg || '#F5EEE6',
              border: `1.5px solid ${statusColors[seller.status]?.color || '#C85A08'}20`,
              borderRadius: 16, padding: '20px 24px', marginBottom: 24,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: statusColors[seller.status]?.color || '#C85A08' }}>
                  {statusColors[seller.status]?.text || seller.status}
                </div>
                <div style={{ fontSize: 12, color: '#8C7B6E', marginTop: 4 }}>
                  Seller ID: <strong style={{ fontFamily: 'monospace' }}>{seller.id}</strong>
                </div>
              </div>
              {seller.status === 'Account Created' && (
                <Link href="/sellers" style={{ textDecoration: 'none' }}>
                  <button style={{
                    padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700,
                    background: '#C85A08', color: '#fff', border: 'none',
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}>Complete Registration →</button>
                </Link>
              )}
            </div>

            {/* Details Card */}
            <div style={{
              background: '#fff', border: '1.5px solid #E8DDD4',
              borderRadius: 20, overflow: 'hidden',
            }}>
              {/* Personal Info */}
              <div style={{ padding: '24px', borderBottom: '1px solid #E8DDD4' }}>
                <h3 style={{ fontSize: 11, fontWeight: 700, color: '#C85A08', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>Personal Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                  {[
                    ['Full Name', seller.fullName],
                    ['Mobile', seller.mobile],
                    ['Email', seller.email],
                    ['Language', seller.language],
                    ['Seller Type', seller.sellerType],
                    ['Business Name', seller.businessName],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div style={{ fontSize: 10, fontWeight: 600, color: '#C0B0A0', marginBottom: 3, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
                      <div style={{ fontSize: 14, color: value ? '#1A1410' : '#C0B0A0', fontWeight: 500 }}>{value || '—'}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div style={{ padding: '24px', borderBottom: '1px solid #E8DDD4' }}>
                <h3 style={{ fontSize: 11, fontWeight: 700, color: '#1A5C38', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>Location</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                  {[
                    ['District', seller.district],
                    ['Village/Town', seller.villageTown],
                    ['Pin Code', seller.pinCode],
                    ['Address', seller.streetAddress],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div style={{ fontSize: 10, fontWeight: 600, color: '#C0B0A0', marginBottom: 3, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
                      <div style={{ fontSize: 14, color: value ? '#1A1410' : '#C0B0A0', fontWeight: 500 }}>{value || '—'}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Products */}
              <div style={{ padding: '24px', borderBottom: '1px solid #E8DDD4' }}>
                <h3 style={{ fontSize: 11, fontWeight: 700, color: '#7C4DFF', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>Products</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                  {[
                    ['Category', seller.category],
                    ['Monthly Capacity', seller.monthlyCapacity],
                    ['Description', seller.productDescription],
                    ['GST Status', seller.hasGst],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div style={{ fontSize: 10, fontWeight: 600, color: '#C0B0A0', marginBottom: 3, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
                      <div style={{ fontSize: 14, color: value ? '#1A1410' : '#C0B0A0', fontWeight: 500 }}>{value || '—'}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payout */}
              <div style={{ padding: '24px' }}>
                <h3 style={{ fontSize: 11, fontWeight: 700, color: '#C85A08', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>Payout Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                  {[
                    ['Payout Method', seller.payoutMethod === 'upi' ? 'UPI' : seller.payoutMethod === 'bank' ? 'Bank Transfer' : '—'],
                    ['UPI ID', seller.upiId],
                    ['Registered', seller.registeredAt ? new Date(seller.registeredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div style={{ fontSize: 10, fontWeight: 600, color: '#C0B0A0', marginBottom: 3, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
                      <div style={{ fontSize: 14, color: value ? '#1A1410' : '#C0B0A0', fontWeight: 500 }}>{value || '—'}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Logout */}
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <button onClick={handleLogout}
                style={{
                  padding: '10px 20px', borderRadius: 8, fontSize: 13,
                  fontWeight: 600, background: 'none',
                  border: '1.5px solid #E8DDD4', color: '#8C7B6E',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>
                🔓 Logout / Switch Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}