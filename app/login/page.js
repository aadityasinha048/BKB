'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Shield, UserCheck, Phone, Key, ArrowRight } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') || 'buyer'; // default to buyer

  const [activeTab, setActiveTab] = useState(initialRole);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);

  // Buyer signup profile states
  const [signupMode, setSignupMode] = useState(false);
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerDistrict, setBuyerDistrict] = useState('Patna');
  const [buyerAddress, setBuyerAddress] = useState('');

  // Admin login details
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleBuyerSignup = (e) => {
    e.preventDefault();
    if (!buyerName.trim() || !buyerEmail.trim() || !buyerAddress.trim()) {
      setError('Please fill in all profile fields.');
      return;
    }

    const newProfile = {
      name: buyerName.trim(),
      email: buyerEmail.trim(),
      mobile: mobile.trim(),
      district: buyerDistrict,
      address: buyerAddress.trim()
    };

    localStorage.setItem(`bkb_buyer_profile_${mobile.trim()}`, JSON.stringify(newProfile));
    localStorage.setItem('bkb_user_logged_in', 'true');
    localStorage.setItem('bkb_user_mobile', mobile.trim());
    setSuccess('Signup complete! Redirecting to Profile...');
    setTimeout(() => router.push('/profile'), 1500);
  };

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

  useEffect(() => {
    const logoutParam = searchParams.get('logout');
    if (logoutParam === 'true') {
      setSuccess('You have been logged out securely. Dhanyavaad!');
      const timer = setTimeout(() => {
        const url = new URL(window.location.href);
        url.searchParams.delete('logout');
        window.history.replaceState({}, '', url.toString());
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!mobile.trim() || !/^\d{10}$/.test(mobile.trim())) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (activeTab === 'seller') {
        // Look up registered seller first
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
      } else {
        // Buyer/User login simulated OTP send
        setOtpSent(true);
        setOtpCountdown(30);
      }
    } catch {
      setError('Network error. Please try again.');
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
      if (activeTab === 'seller') {
        const res = await fetch('/api/seller/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mobile: mobile.trim(), otp: otp.trim() }),
        });
        const data = await res.json();

        if (data.success) {
          localStorage.setItem('bkb_seller_id', data.seller.id);
          setSuccess('Login successful! Redirecting to Dashboard...');
          setTimeout(() => router.push('/dashboard'), 1500);
        } else {
          setError(data.error || 'Invalid OTP code.');
        }
      } else {
        // Buyer login verification
        if (otp.trim() !== '123456') {
          setError('Invalid OTP code. Please enter 123456.');
          setLoading(false);
          return;
        }

        const existingProfile = localStorage.getItem(`bkb_buyer_profile_${mobile.trim()}`);
        if (!existingProfile) {
          setSignupMode(true);
          setSuccess('Mobile verified! Please set up your delivery profile.');
          setLoading(false);
          return;
        }

        localStorage.setItem('bkb_user_logged_in', 'true');
        localStorage.setItem('bkb_user_mobile', mobile.trim());
        setSuccess('Login successful! Redirecting to Profile...');
        setTimeout(() => router.push('/profile'), 1500);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!adminUser.trim() || !adminPass.trim()) {
      setError('Please fill in both fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: adminUser.trim(), password: adminPass.trim() }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess('Admin login successful! Redirecting...');
        setTimeout(() => router.push('/admin'), 1500);
      } else {
        setError(data.error || 'Invalid admin credentials.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetState = (tab) => {
    setActiveTab(tab);
    setMobile('');
    setOtp('');
    setOtpSent(false);
    setOtpCountdown(0);
    setSignupMode(false);
    setBuyerName('');
    setBuyerEmail('');
    setBuyerDistrict('Patna');
    setBuyerAddress('');
    setAdminUser('');
    setAdminPass('');
    setError('');
    setSuccess('');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden' }}>

      {/* ── CSS Animations ── */}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(27,107,58,0.15); }
          50% { box-shadow: 0 0 40px rgba(27,107,58,0.3); }
        }
        @keyframes slideInRight {
          from { transform: translateX(30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .login-input:focus {
          border-color: #1B6B3A !important;
          box-shadow: 0 0 0 3px rgba(27,107,58,0.1) !important;
        }
        .login-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(27,107,58,0.35);
        }
        .login-submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }
      `}</style>

      {/* ════════════════════════════════════════════ */}
      {/* LEFT PANEL — Farm Imagery                   */}
      {/* ════════════════════════════════════════════ */}
      <div style={{
        flex: '0 0 50%',
        position: 'relative',
        background: '#0D3B1E',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}>
        {/* Background Farm Image */}
        <img
          src="/images/farm_login_bg.png"
          alt="Bihar farmlands"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.85,
          }}
        />

        {/* Dark gradient overlay for text legibility */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(13,59,30,0.92) 0%, rgba(13,59,30,0.5) 40%, rgba(13,59,30,0.2) 70%, transparent 100%)',
        }} />

        {/* Floating leaf/grain particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${10 + Math.random() * 80}%`,
              bottom: 0,
              fontSize: [18, 14, 20, 16, 22, 12, 17, 15][i],
              animation: `floatUp ${8 + i * 2}s linear infinite`,
              animationDelay: `${i * 1.5}s`,
              opacity: 0,
              pointerEvents: 'none',
              zIndex: 2,
            }}
          >
            {['🌾', '🍃', '🌿', '🌱', '🍂', '🌻', '🪺', '🌼'][i]}
          </div>
        ))}

        {/* Bottom overlay content */}
        <div style={{ position: 'relative', zIndex: 3, padding: '0 48px 48px' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(12px)',
            borderRadius: 12,
            padding: '8px 16px',
            marginBottom: 16,
            border: '1px solid rgba(255,255,255,0.2)',
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#A8E6C3' }}>
              🌾 Farm to Doorstep
            </span>
          </div>

          <h1 style={{
            fontSize: 38,
            color: '#fff',
            fontFamily: "'Playfair Display', serif",
            lineHeight: 1.2,
            marginBottom: 12,
            fontWeight: 800,
          }}>
            Connecting Bihar's<br />
            <span style={{ color: '#90E8B0' }}>Farmers & Artisans</span><br />
            to Your Home
          </h1>

          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, maxWidth: 420, marginBottom: 28 }}>
            Fresh produce, authentic spices, handcrafted textiles — sourced directly from villages across all 38 districts of Bihar.
          </p>

          {/* Trust badges */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              ['🌿', '800+ Farmers'],
              ['📍', '38 Districts'],
              ['🏅', 'GI Certified'],
              ['🚚', 'Pan-India'],
            ].map(([em, label]) => (
              <div key={label} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(8px)',
                borderRadius: 10,
                padding: '8px 14px',
                border: '1px solid rgba(255,255,255,0.15)',
              }}>
                <span style={{ fontSize: 16 }}>{em}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════ */}
      {/* RIGHT PANEL — Login Form                    */}
      {/* ════════════════════════════════════════════ */}
      <div style={{
        flex: '0 0 50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        background: 'linear-gradient(165deg, #F0FAF3 0%, #FFFCF8 40%, #FEF8E8 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle background pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(#D4E8D9 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.3,
          pointerEvents: 'none',
        }} />

        {/* Background decorative blobs */}
        <div style={{
          position: 'absolute',
          top: -60,
          right: -60,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(27,107,58,0.08), transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: -40,
          left: -40,
          width: 160,
          height: 160,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,135,36,0.08), transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Login Card */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px)',
          border: '1.5px solid rgba(27,107,58,0.15)',
          borderRadius: 24,
          padding: '40px 36px',
          width: '100%',
          maxWidth: 440,
          boxShadow: '0 8px 40px rgba(27,107,58,0.08), 0 1px 3px rgba(0,0,0,0.04)',
          animation: 'slideInRight 0.5s ease-out',
        }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: '#fff',
              border: '2.5px solid #1B6B3A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
              overflow: 'hidden',
              boxShadow: '0 4px 15px rgba(27,107,58,0.15)',
              animation: 'pulseGlow 3s ease-in-out infinite',
            }}>
              <img
                src="/images/bkb_logo.png"
                alt="BKB logo"
                style={{ width: '80%', height: '80%', objectFit: 'contain' }}
              />
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#1B6B3A', marginBottom: 6 }}>Welcome to BKB</div>
            <h2 style={{ fontSize: 26, color: '#1A1410', fontFamily: "'Playfair Display', serif", fontWeight: 800 }}>Account Login</h2>
            <p style={{ fontSize: 13, color: '#7A7067', marginTop: 6 }}>Select your portal and verify to enter</p>
          </div>

          {/* Roles Tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: activeTab === 'admin' ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)', gap: 8, background: 'rgba(27,107,58,0.06)', padding: 6, borderRadius: 14, marginBottom: 28 }}>
            {[
              { id: 'buyer', label: 'Buyer', icon: User },
              { id: 'seller', label: 'Seller', icon: UserCheck },
              ...(activeTab === 'admin' ? [{ id: 'admin', label: 'Admin', icon: Shield }] : [])
            ].map(role => {
              const Icon = role.icon;
              const active = activeTab === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => resetState(role.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    padding: '10px 0',
                    borderRadius: 10,
                    fontSize: 12,
                    fontWeight: 700,
                    border: 'none',
                    background: active ? '#fff' : 'transparent',
                    color: active ? '#1B6B3A' : '#7A7067',
                    boxShadow: active ? '0 4px 14px rgba(27,107,58,0.1)' : 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <Icon size={16} />
                  {role.label}
                </button>
              );
            })}
          </div>

          {/* Feedback Alert Messages */}
          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid rgba(211,47,47,0.15)', borderRadius: 10, padding: '12px 14px', color: '#D32F2F', fontSize: 13, marginBottom: 20, fontWeight: 600, animation: 'fadeInUp 0.3s ease' }}>
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div style={{ background: '#EAF5F0', border: '1px solid rgba(27,107,58,0.2)', borderRadius: 10, padding: '12px 14px', color: '#1B6B3A', fontSize: 13, marginBottom: 20, fontWeight: 600, animation: 'fadeInUp 0.3s ease' }}>
              🎉 {success}
            </div>
          )}

          {/* Forms Area */}
          {signupMode ? (
            /* BUYER PROFILE SIGNUP FORM */
            <form onSubmit={handleBuyerSignup} style={{ animation: 'fadeInUp 0.4s ease' }}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 6 }}>Full Name *</label>
                <input
                  className="login-input"
                  type="text"
                  placeholder="e.g. Rajan Kumar"
                  required
                  value={buyerName}
                  onChange={e => {
                    setBuyerName(e.target.value);
                    if (error) setError('');
                  }}
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #D4E8D9', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', background: 'rgba(255,255,255,0.7)', outline: 'none', color: '#1A1410', boxSizing: 'border-box', transition: 'all 0.2s' }}
                />
              </div>
              
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 6 }}>Email Address *</label>
                <input
                  className="login-input"
                  type="email"
                  placeholder="e.g. rajan@example.com"
                  required
                  value={buyerEmail}
                  onChange={e => {
                    setBuyerEmail(e.target.value);
                    if (error) setError('');
                  }}
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #D4E8D9', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', background: 'rgba(255,255,255,0.7)', outline: 'none', color: '#1A1410', boxSizing: 'border-box', transition: 'all 0.2s' }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 6 }}>District *</label>
                <select
                  value={buyerDistrict}
                  onChange={e => setBuyerDistrict(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #D4E8D9', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', background: 'rgba(255,255,255,0.7)', outline: 'none', color: '#1A1410', boxSizing: 'border-box', cursor: 'pointer' }}
                >
                  {["Patna", "Muzaffarpur", "Darbhanga", "Bhagalpur", "Gaya", "Nalanda", "Madhubani"].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 6 }}>Delivery Address *</label>
                <textarea
                  className="login-input"
                  placeholder="Enter your complete delivery address"
                  rows={3}
                  required
                  value={buyerAddress}
                  onChange={e => {
                    setBuyerAddress(e.target.value);
                    if (error) setError('');
                  }}
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #D4E8D9', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', background: 'rgba(255,255,255,0.7)', outline: 'none', color: '#1A1410', boxSizing: 'border-box', resize: 'vertical', lineHeight: 1.5, transition: 'all 0.2s' }}
                />
              </div>

              <button
                className="login-submit-btn"
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: 14,
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #1B6B3A, #2D9F5A)',
                  color: '#fff',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.25s ease',
                }}
              >
                {loading ? 'Setting up profile...' : 'Complete Sign Up'}
                <ArrowRight size={16} />
              </button>
            </form>
          ) : activeTab !== 'admin' ? (
            /* BUYER AND SELLER LOGIN FLOW (MOBILE/OTP) */
            <form onSubmit={!otpSent ? handleSendOtp : handleVerifyOtp} style={{ animation: 'fadeInUp 0.4s ease' }}>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 6 }}>Registered Mobile Number *</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: 13, color: '#7A7067', fontSize: 13 }}><Phone size={15} /></span>
                  <input
                    className="login-input"
                    type="text"
                    placeholder="10-digit mobile number"
                    disabled={otpSent}
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 40px',
                      border: '1.5px solid #D4E8D9',
                      borderRadius: 10,
                      fontSize: 14,
                      fontFamily: 'inherit',
                      background: otpSent ? 'rgba(27,107,58,0.04)' : 'rgba(255,255,255,0.7)',
                      outline: 'none',
                      color: '#1A1410',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s'
                    }}
                  />
                </div>
              </div>

              {otpSent && (
                <div style={{ marginBottom: 18, animation: 'fadeInUp 0.3s ease' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#4A3F35' }}>Enter 6-digit OTP *</label>
                    <span style={{ fontSize: 11, color: '#7A7067', fontWeight: 600 }}>Demo code: 123456</span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 14, top: 13, color: '#7A7067', fontSize: 13 }}><Key size={15} /></span>
                    <input
                      className="login-input"
                      type="text"
                      maxLength={6}
                      placeholder="Enter OTP (e.g. 123456)"
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 14px 11px 40px',
                        border: '1.5px solid #D4E8D9',
                        borderRadius: 10,
                        fontSize: 14,
                        fontFamily: 'inherit',
                        background: 'rgba(255,255,255,0.7)',
                        outline: 'none',
                        color: '#1A1410',
                        boxSizing: 'border-box',
                        transition: 'all 0.2s'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                    <span style={{ fontSize: 12, color: '#7A7067' }}>
                      {otpCountdown > 0 ? `Resend in ${otpCountdown}s` : 'Didn\'t receive code?'}
                    </span>
                    {otpCountdown === 0 && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        style={{ background: 'none', border: 'none', color: '#1B6B3A', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
              )}

              <button
                className="login-submit-btn"
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: 14,
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 700,
                  background: loading ? '#7A7067' : (activeTab === 'seller' ? 'linear-gradient(135deg, #0D3B1E, #1B6B3A)' : 'linear-gradient(135deg, #1B6B3A, #2D9F5A)'),
                  color: '#fff',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.25s ease',
                }}
              >
                {loading ? 'Processing...' : (!otpSent ? 'Send OTP Verification' : 'Verify & Log In')}
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            /* ADMIN LOGIN FORM */
            <form onSubmit={handleAdminLogin} style={{ animation: 'fadeInUp 0.4s ease' }}>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 6 }}>Username *</label>
                <input
                  className="login-input"
                  type="text"
                  placeholder="e.g. admin"
                  value={adminUser}
                  onChange={e => setAdminUser(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    border: '1.5px solid #D4E8D9',
                    borderRadius: 10,
                    fontSize: 14,
                    fontFamily: 'inherit',
                    background: 'rgba(255,255,255,0.7)',
                    outline: 'none',
                    color: '#1A1410',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s'
                  }}
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#4A3F35' }}>Password *</label>
                  <span style={{ fontSize: 11, color: '#7A7067', fontWeight: 600 }}>Demo code: bkb2026</span>
                </div>
                <input
                  className="login-input"
                  type="password"
                  placeholder="••••••••"
                  value={adminPass}
                  onChange={e => setAdminPass(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    border: '1.5px solid #D4E8D9',
                    borderRadius: 10,
                    fontSize: 14,
                    fontFamily: 'inherit',
                    background: 'rgba(255,255,255,0.7)',
                    outline: 'none',
                    color: '#1A1410',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s'
                  }}
                />
              </div>

              <button
                className="login-submit-btn"
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: 14,
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 700,
                  background: loading ? '#7A7067' : 'linear-gradient(135deg, #1A1410, #3D3429)',
                  color: '#fff',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.25s ease',
                }}
              >
                {loading ? 'Verifying credentials...' : 'Enter Admin Console'}
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* Extra Actions footer */}
          <div style={{ marginTop: 24, textAlign: 'center', fontSize: 13, borderTop: '1px solid rgba(27,107,58,0.1)', paddingTop: 18 }}>
            {activeTab === 'seller' ? (
              <div style={{ color: '#7A7067' }}>
                Want to start selling?{' '}
                <Link href="/sellers" style={{ color: '#1B6B3A', fontWeight: 700, textDecoration: 'none' }}>
                  Register as a Seller →
                </Link>
              </div>
            ) : activeTab === 'buyer' ? (
              <div style={{ color: '#7A7067' }}>
                Don't have a buyer account?{' '}
                <span onClick={() => {
                  localStorage.setItem('bkb_user_logged_in', 'true');
                  localStorage.setItem('bkb_user_mobile', '9876543210');
                  router.push('/profile');
                }} style={{ color: '#1B6B3A', fontWeight: 700, cursor: 'pointer' }}>
                  Simulate Sign Up
                </span>
              </div>
            ) : (
              <div style={{ color: '#7A7067' }}>
                Restricted console area for system staff.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ background: '#FFFCF8', minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: 16, color: '#8C7B6E', fontWeight: 600 }}>Loading login console...</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
