'use client';

import { useState } from 'react';
import Link from 'next/link';

const INTERESTS = [
  { id: 'madhubani', label: 'Madhubani Paintings', emoji: '🎨' },
  { id: 'silk', label: 'Bhagalpuri Silk', emoji: '🧣' },
  { id: 'makhana', label: 'Makhana (Fox Nuts)', emoji: '🌰' },
  { id: 'litchi', label: 'Shahi Litchi', emoji: '🍈' },
  { id: 'spices', label: 'Bihar Spices', emoji: '🌶️' },
  { id: 'handloom', label: 'Handloom Textiles', emoji: '🧶' },
  { id: 'organic', label: 'Organic Food', emoji: '🌿' },
  { id: 'sweets', label: 'Sweets & Snacks', emoji: '🍬' },
];

export default function PreLaunchPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    interests: [],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [totalSignups, setTotalSignups] = useState(0);

  const toggleInterest = (label) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(label)
        ? prev.interests.filter(i => i !== label)
        : [...prev.interests, label]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[\w.-]+@[\w.-]+\.\w+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await fetch('/api/prelaunch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        setTotalSignups(data.totalSignups || 0);
      } else {
        setErrors({ submit: data.error || 'Something went wrong. Try again.' });
      }
    } catch {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#FFFCF8', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <div style={{
        background: 'linear-gradient(140deg, #1A1410 0%, #2A1F16 40%, #1A5C38 100%)',
        padding: '80px 60px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative orbs */}
        <div style={{
          position: 'absolute', width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,90,8,0.12) 0%, transparent 70%)',
          top: -100, right: -50, pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(26,92,56,0.15) 0%, transparent 70%)',
          bottom: -80, left: -40, pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(200,90,8,0.2)', border: '1px solid rgba(200,90,8,0.3)',
            borderRadius: 40, padding: '7px 18px', fontSize: 12, fontWeight: 700,
            color: '#F09819', marginBottom: 28,
          }}>
            🚀 Launching Soon — Be the First to Know
          </div>

          <h1 style={{
            fontSize: 52, fontWeight: 800, color: '#fff', lineHeight: 1.1,
            fontFamily: "'Playfair Display', serif", marginBottom: 18,
          }}>
            Bihar Ka Bazaar is <br />
            <em style={{ color: '#F09819', fontStyle: 'italic' }}>Coming Soon</em>
          </h1>

          <p style={{
            fontSize: 17, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7,
            maxWidth: 560, margin: '0 auto 36px',
          }}>
            The first marketplace dedicated to authentic Bihar products. From Madhubani paintings to Bhagalpuri silk, from Makhana to Shahi Litchi — directly from makers to you.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 32 }}>
            {[
              ['🌾', 'Authentic Products'],
              ['🤝', 'Direct from Makers'],
              ['🚚', 'Pan-India Delivery'],
            ].map(([emoji, text]) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20 }}>{emoji}</span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SIGNUP FORM ── */}
      <div style={{
        maxWidth: 600, margin: '-48px auto 0', padding: '0 24px',
        position: 'relative', zIndex: 2,
      }}>
        <div style={{
          background: '#fff', borderRadius: 24, padding: submitted ? '48px 36px' : '36px',
          border: '1.5px solid #E8DDD4',
          boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
        }}>
          {submitted ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
              <h2 style={{
                fontSize: 28, fontWeight: 800, color: '#1A5C38',
                fontFamily: "'Playfair Display', serif", marginBottom: 10,
              }}>
                You&apos;re In!
              </h2>
              <p style={{ fontSize: 15, color: '#4A3F35', lineHeight: 1.7, marginBottom: 20 }}>
                Welcome aboard, <strong>{formData.name}</strong>! You&apos;ve joined <strong>{totalSignups}+</strong> early supporters. We&apos;ll notify you at <strong>{formData.email}</strong> as soon as we launch.
              </p>
              <div style={{
                background: '#EAF5F0', border: '1.5px solid rgba(26,92,56,0.2)',
                borderRadius: 14, padding: '18px 22px', textAlign: 'left',
                fontSize: 13, color: '#1A5C38', lineHeight: 1.7,
              }}>
                <strong>What happens next?</strong>
                <ul style={{ paddingLeft: 18, margin: '8px 0 0' }}>
                  <li>You&apos;ll receive an email confirmation</li>
                  <li>Get exclusive early access when we launch</li>
                  <li>Special discounts for early supporters</li>
                </ul>
              </div>
              <div style={{ marginTop: 24 }}>
                <Link href="/" style={{ textDecoration: 'none' }}>
                  <button style={{
                    padding: '13px 28px', borderRadius: 12, fontSize: 14, fontWeight: 700,
                    background: '#C85A08', color: '#fff', border: 'none', cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}>
                    ← Back to Home
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <h2 style={{
                  fontSize: 24, fontWeight: 800, color: '#1A1410',
                  fontFamily: "'Playfair Display', serif", marginBottom: 6,
                }}>Get Early Access</h2>
                <p style={{ fontSize: 13, color: '#8C7B6E' }}>
                  Sign up now and be the first to shop when we launch.
                </p>
              </div>

              {errors.submit && (
                <div style={{
                  background: '#FDECEA', border: '1px solid rgba(211,47,47,0.2)',
                  borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#D32F2F',
                  marginBottom: 18,
                }}>
                  ⚠️ {errors.submit}
                </div>
              )}

              {/* Name */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 6 }}>
                  Full Name <span style={{ color: '#C85A08' }}>*</span>
                </label>
                <input
                  value={formData.name}
                  onChange={e => { setFormData(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: null })); }}
                  placeholder="Your full name"
                  style={{
                    width: '100%', padding: '12px 14px',
                    border: `1.5px solid ${errors.name ? '#D32F2F' : '#E8DDD4'}`,
                    borderRadius: 10, fontSize: 14, fontFamily: 'inherit',
                    background: '#FFFCF8', outline: 'none', color: '#1A1410',
                  }}
                  onFocus={e => e.target.style.borderColor = errors.name ? '#D32F2F' : '#C85A08'}
                  onBlur={e => e.target.style.borderColor = errors.name ? '#D32F2F' : '#E8DDD4'}
                />
                {errors.name && <span style={{ fontSize: 11, color: '#D32F2F', marginTop: 4, display: 'block' }}>{errors.name}</span>}
              </div>

              {/* Email */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 6 }}>
                  Email Address <span style={{ color: '#C85A08' }}>*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => { setFormData(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: null })); }}
                  placeholder="you@example.com"
                  style={{
                    width: '100%', padding: '12px 14px',
                    border: `1.5px solid ${errors.email ? '#D32F2F' : '#E8DDD4'}`,
                    borderRadius: 10, fontSize: 14, fontFamily: 'inherit',
                    background: '#FFFCF8', outline: 'none', color: '#1A1410',
                  }}
                  onFocus={e => e.target.style.borderColor = errors.email ? '#D32F2F' : '#C85A08'}
                  onBlur={e => e.target.style.borderColor = errors.email ? '#D32F2F' : '#E8DDD4'}
                />
                {errors.email && <span style={{ fontSize: 11, color: '#D32F2F', marginTop: 4, display: 'block' }}>{errors.email}</span>}
              </div>

              {/* Phone + City */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 6 }}>
                    Phone (Optional)
                  </label>
                  <input
                    value={formData.phone}
                    onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                    placeholder="10-digit mobile"
                    style={{
                      width: '100%', padding: '12px 14px',
                      border: '1.5px solid #E8DDD4', borderRadius: 10,
                      fontSize: 14, fontFamily: 'inherit',
                      background: '#FFFCF8', outline: 'none', color: '#1A1410',
                    }}
                    onFocus={e => e.target.style.borderColor = '#C85A08'}
                    onBlur={e => e.target.style.borderColor = '#E8DDD4'}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 6 }}>
                    City (Optional)
                  </label>
                  <input
                    value={formData.city}
                    onChange={e => setFormData(p => ({ ...p, city: e.target.value }))}
                    placeholder="Your city"
                    style={{
                      width: '100%', padding: '12px 14px',
                      border: '1.5px solid #E8DDD4', borderRadius: 10,
                      fontSize: 14, fontFamily: 'inherit',
                      background: '#FFFCF8', outline: 'none', color: '#1A1410',
                    }}
                    onFocus={e => e.target.style.borderColor = '#C85A08'}
                    onBlur={e => e.target.style.borderColor = '#E8DDD4'}
                  />
                </div>
              </div>

              {/* Interests */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 10 }}>
                  What interests you? (select any)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                  {INTERESTS.map(interest => {
                    const isSelected = formData.interests.includes(interest.label);
                    return (
                      <div
                        key={interest.id}
                        onClick={() => toggleInterest(interest.label)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
                          background: isSelected ? '#EAF5F0' : '#FFFCF8',
                          border: `1.5px solid ${isSelected ? '#1A5C38' : '#E8DDD4'}`,
                          transition: 'all 0.2s',
                        }}
                      >
                        <span style={{ fontSize: 18 }}>{interest.emoji}</span>
                        <span style={{
                          fontSize: 12, fontWeight: isSelected ? 700 : 500,
                          color: isSelected ? '#1A5C38' : '#4A3F35',
                        }}>{interest.label}</span>
                        {isSelected && (
                          <span style={{ marginLeft: 'auto', fontSize: 14, color: '#1A5C38' }}>✓</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: 15, borderRadius: 12,
                  fontSize: 16, fontWeight: 700,
                  background: loading ? '#8C7B6E' : 'linear-gradient(135deg, #C85A08, #E87A28)',
                  color: '#fff', border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  boxShadow: '0 4px 16px rgba(200,90,8,0.25)',
                  transition: 'all 0.25s',
                }}
                onMouseEnter={e => { if (!loading) e.target.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => e.target.style.transform = 'none'}
              >
                {loading ? '⏳ Signing up...' : '🚀 Get Early Access — It\'s Free'}
              </button>

              <p style={{ textAlign: 'center', marginTop: 14, fontSize: 11, color: '#C0B0A0' }}>
                No spam. Unsubscribe anytime. We only send launch updates.
              </p>
            </form>
          )}
        </div>
      </div>

      {/* ── WHY JOIN ── */}
      <div style={{ padding: '72px 60px', textAlign: 'center' }}>
        <h2 style={{
          fontSize: 30, fontWeight: 800, color: '#1A1410',
          fontFamily: "'Playfair Display', serif", marginBottom: 12,
        }}>Why Join Early?</h2>
        <p style={{ fontSize: 14, color: '#8C7B6E', marginBottom: 44, maxWidth: 500, margin: '0 auto 44px' }}>
          Early supporters get exclusive benefits when we launch.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, maxWidth: 900, margin: '0 auto' }}>
          {[
            { em: '🎁', title: 'Exclusive Discounts', desc: 'Get special launch-day discounts only available to early supporters.' },
            { em: '🥇', title: 'First Access', desc: 'Be the first to browse and shop authentic Bihar products before anyone else.' },
            { em: '📬', title: 'Insider Updates', desc: 'Receive updates on new products, artisan stories, and behind-the-scenes content.' },
          ].map(item => (
            <div key={item.title} style={{
              background: '#fff', border: '1.5px solid #E8DDD4',
              borderRadius: 18, padding: '32px 24px',
              transition: 'all 0.22s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C85A08'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8DDD4'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ fontSize: 42, marginBottom: 16 }}>{item.em}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1410', marginBottom: 8 }}>{item.title}</h3>
              <p style={{ fontSize: 13, color: '#8C7B6E', lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA FOOTER ── */}
      <div style={{
        background: '#1A5C38', padding: '48px 60px', textAlign: 'center',
      }}>
        <h3 style={{
          fontSize: 24, fontWeight: 800, color: '#fff',
          fontFamily: "'Playfair Display', serif", marginBottom: 10,
        }}>Are you a seller or artisan from Bihar?</h3>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 24 }}>
          Join 800+ sellers already registered. Registration is completely free.
        </p>
        <Link href="/sellers" style={{ textDecoration: 'none' }}>
          <button style={{
            padding: '14px 32px', borderRadius: 12, fontSize: 15, fontWeight: 700,
            background: '#fff', color: '#1A5C38', border: 'none',
            cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.target.style.transform = 'none'}
          >
            Register as a Seller →
          </button>
        </Link>
      </div>
    </div>
  );
}
