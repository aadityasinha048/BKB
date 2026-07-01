'use client';

import { useState } from 'react';

const FEATURES = [
  { em: "🆓", title: "Free Registration", desc: "No charges to join. No monthly fees. List your products and start selling completely free." },
  { em: "🚚", title: "Logistics Support", desc: "We partner with couriers and guide you on packaging. You just prepare the order — we handle the rest." },
  { em: "💸", title: "Fast Payments", desc: "Get paid directly to your bank account within 3–5 working days after successful delivery." },
  { em: "📊", title: "Seller Dashboard", desc: "Track your orders, sales, revenue and customers — all in one easy-to-use dashboard." },
  { em: "🏅", title: "GI Tag Help", desc: "Don't have a GI certificate? We help you apply and get your products officially certified." },
  { em: "📱", title: "WhatsApp Support", desc: "Dedicated seller support team on WhatsApp. Get help in Hindi or English, anytime." },
  { em: "📸", title: "Photography Help", desc: "Need better product photos? Our team assists with photography tips and guidance — completely free." },
  { em: "🌍", title: "Pan-India Reach", desc: "Sell from your village in Bihar and reach customers in Mumbai, Delhi, Bengaluru and beyond." },
];

const STEPS = [
  { n: "1", title: "Fill this form", desc: "Takes less than 3 minutes to complete" },
  { n: "2", title: "Team verification call", desc: "Our team calls you within 24 hours" },
  { n: "3", title: "Account activated", desc: "Get access to your seller dashboard" },
  { n: "4", title: "List & sell", desc: "Upload photos and start getting orders" },
];

const DISTRICTS = [
  "Select your district", "Patna", "Muzaffarpur", "Darbhanga", "Bhagalpur",
  "Gaya", "Nalanda", "Madhubani", "Sitamarhi", "Vaishali", "Samastipur",
  "Begusarai", "Munger", "Bhojpur", "Rohtas", "Arrah", "Aurangabad",
  "Jehanabad", "Nawada", "Sheikhpura", "Lakhisarai", "Jamui",
];

const CATEGORIES = [
  "What do you sell or make?",
  "Food & Agricultural Products",
  "Handicrafts & Art",
  "Textiles & Silk",
  "Spices & Herbs",
  "Sweets & Snacks",
  "Fresh Fruits",
  "Dairy Products",
  "Other",
];

function FormInput({ label, placeholder, type = 'text', required = false }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>
        {label}{required && <span style={{ color: '#C85A08' }}> *</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        style={{ width: '100%', padding: '11px 13px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none', color: '#1A1410' }}
        onFocus={e => e.target.style.borderColor = '#C85A08'}
        onBlur={e => e.target.style.borderColor = '#E8DDD4'}
      />
    </div>
  );
}

function FormSelect({ label, options, required = false }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>
        {label}{required && <span style={{ color: '#C85A08' }}> *</span>}
      </label>
      <select
        style={{ width: '100%', padding: '11px 13px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none', color: '#1A1410', cursor: 'pointer' }}
        onFocus={e => e.target.style.borderColor = '#C85A08'}
        onBlur={e => e.target.style.borderColor = '#E8DDD4'}
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

export default function SellersPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={{ background: '#FFFCF8' }}>

      {/* ── HERO ── */}
      <div style={{
        background: 'linear-gradient(140deg, #EAF5F0 0%, #FFFCF8 60%, #FFF4EC 100%)',
        padding: '72px 60px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 72,
        alignItems: 'center',
        borderBottom: '1px solid #E8DDD4',
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#EAF5F0', border: '1px solid rgba(26,92,56,0.2)', borderRadius: 40, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: '#1A5C38', marginBottom: 20 }}>
            🌾 For Farmers & Artisans of Bihar
          </div>
          <h1 style={{ fontSize: 46, color: '#1A1410', lineHeight: 1.1, marginBottom: 16, fontFamily: "'Playfair Display', serif" }}>
            Sell Your <em style={{ color: '#1A5C38', fontStyle: 'italic' }}>Bihar Products</em> to All of India
          </h1>
          <p style={{ fontSize: 16, color: '#4A3F35', lineHeight: 1.75, marginBottom: 28 }}>
            No middlemen. No hidden fees. Direct payment to your bank account within 3–5 days. Join 800+ sellers already growing with Bihar Ka Bazaar.
          </p>
          <button
            onClick={() => document.getElementById('register-section').scrollIntoView({ behavior: 'smooth' })}
            style={{ padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#1A5C38', color: '#fff', border: '2px solid #1A5C38', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Register Free Today →
          </button>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 36 }}>
            {[["800+", "Active Sellers"], ["₹0", "Registration Fee"], ["3–5", "Days to First Payment"]].map(([n, l]) => (
              <div key={l} style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#1A5C38', fontFamily: "'Playfair Display', serif" }}>{n}</div>
                <div style={{ fontSize: 11, color: '#8C7B6E', marginTop: 3 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Seller Story Card */}
        <div style={{ background: '#fff', borderRadius: 22, padding: 36, border: '1.5px solid #E8DDD4', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <div style={{ textAlign: 'center', marginBottom: 22 }}>
            <div style={{ fontSize: 64, marginBottom: 10 }}>👨‍🌾</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1A5C38' }}>Ram Prasad — Makhana Farmer</div>
            <div style={{ fontSize: 12, color: '#8C7B6E' }}>Darbhanga, Bihar</div>
          </div>
          <div style={{ background: '#F5EEE6', borderRadius: 12, padding: '16px 18px', marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: '#8C7B6E', marginBottom: 4 }}>Monthly Earnings Before BKB</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#8C7B6E' }}>₹8,000 – ₹12,000</div>
          </div>
          <div style={{ background: '#EAF5F0', border: '1.5px solid rgba(26,92,56,0.2)', borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ fontSize: 11, color: '#1A5C38', marginBottom: 4, fontWeight: 700 }}>Monthly Earnings with BKB</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#1A5C38', fontFamily: "'Playfair Display', serif" }}>₹38,000+</div>
          </div>
          <div style={{ textAlign: 'center', fontSize: 13, color: '#8C7B6E', marginTop: 16, fontStyle: 'italic' }}>
            "Bihar Ka Bazaar changed everything for my family"
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div style={{ padding: '72px 60px', background: '#fff' }}>
        <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 44px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#C85A08', marginBottom: 8 }}>Benefits</div>
          <h2 style={{ fontSize: 34, color: '#1A1410', fontFamily: "'Playfair Display', serif" }}>Everything You Need to Sell</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{ background: '#FFFCF8', border: '1.5px solid #E8DDD4', borderRadius: 16, padding: '24px 18px', textAlign: 'center', transition: 'all 0.22s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C85A08'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8DDD4'; e.currentTarget.style.transform = 'none'; }}
            >
              <span style={{ fontSize: 38, display: 'block', marginBottom: 12 }}>{f.em}</span>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1A1410', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 12, color: '#8C7B6E', lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div style={{ padding: '72px 60px', background: '#FFF8F2', borderTop: '1px solid #E8DDD4', borderBottom: '1px solid #E8DDD4' }}>
        <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 44px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#C85A08', marginBottom: 8 }}>Process</div>
          <h2 style={{ fontSize: 34, color: '#1A1410', fontFamily: "'Playfair Display', serif" }}>How It Works</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, maxWidth: 900, margin: '0 auto' }}>
          {STEPS.map((s, i) => (
            <div key={s.n} style={{ textAlign: 'center', position: 'relative' }}>
              {i < STEPS.length - 1 && (
                <div style={{ position: 'absolute', top: 28, left: '60%', width: '80%', height: 2, background: '#E8DDD4', zIndex: 0 }} />
              )}
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#C85A08', color: '#fff', fontSize: 22, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', position: 'relative', zIndex: 1, fontFamily: "'Playfair Display', serif" }}>
                {s.n}
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1A1410', marginBottom: 6 }}>{s.title}</h3>
              <p style={{ fontSize: 12, color: '#8C7B6E', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── REGISTRATION FORM ── */}
      <div id="register-section" style={{ background: '#1A5C38', padding: '72px 60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>

        {/* Left text */}
        <div>
          <h2 style={{ fontSize: 36, color: '#fff', marginBottom: 14, fontFamily: "'Playfair Display', serif", lineHeight: 1.2 }}>
            Register as a Seller Today
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.72)', lineHeight: 1.75, marginBottom: 32 }}>
            Fill the form and our team will contact you within 24 hours to complete your registration and help you list your first product.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {STEPS.map(s => (
              <div key={s.n} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)', color: '#fff', fontSize: 14, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.n}</span>
                <div>
                  <strong style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 3 }}>{s.title}</strong>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{s.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 36, padding: '20px 22px', background: 'rgba(255,255,255,0.1)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>Need help? Call us directly</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>+91 612-XXX-XXXX</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 3 }}>Mon–Sat, 9am to 6pm · Hindi & English</div>
          </div>
        </div>

        {/* Registration Form */}
        <div style={{ background: '#fff', borderRadius: 22, padding: 36 }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
              <h3 style={{ fontSize: 24, color: '#1A5C38', marginBottom: 12, fontFamily: "'Playfair Display', serif" }}>Registration Submitted!</h3>
              <p style={{ fontSize: 14, color: '#4A3F35', lineHeight: 1.7 }}>
                Our team will call you within 24 hours to verify your account and help you list your first product.
              </p>
            </div>
          ) : (
            <>
              <h3 style={{ fontSize: 22, color: '#1A1410', marginBottom: 22, fontFamily: "'Playfair Display', serif" }}>Seller Registration Form</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <FormInput label="Full Name" placeholder="Ram Prasad" required />
                <FormInput label="Mobile Number" placeholder="+91 99999 00000" required />
              </div>
              <FormInput label="Email Address" placeholder="name@example.com" type="email" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <FormSelect label="District" options={DISTRICTS} required />
                <FormInput label="Village / Town" placeholder="Your village name" required />
              </div>
              <FormSelect label="Product Category" options={CATEGORIES} required />
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>
                  About Your Products <span style={{ color: '#C85A08' }}>*</span>
                </label>
                <textarea
                  placeholder="Describe what you sell, your experience, how much you can supply..."
                  rows={3}
                  style={{ width: '100%', padding: '11px 13px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none', color: '#1A1410', resize: 'vertical', lineHeight: 1.6 }}
                  onFocus={e => e.target.style.borderColor = '#C85A08'}
                  onBlur={e => e.target.style.borderColor = '#E8DDD4'}
                />
              </div>
              <FormSelect
                label="Do you have a GI Tag certificate?"
                options={["I'm not sure", "Yes, I have it", "No, I don't have it", "My product qualifies but not certified yet"]}
              />
              <FormInput label="Bank Account / UPI for Payments" placeholder="Account number or UPI ID" />
              <button
                onClick={() => setSubmitted(true)}
                style={{ width: '100%', padding: 14, borderRadius: 10, fontSize: 15, fontWeight: 700, background: '#C85A08', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', marginTop: 4 }}
                onMouseEnter={e => e.target.style.background = '#A04806'}
                onMouseLeave={e => e.target.style.background = '#C85A08'}
              >
                Submit Registration
              </button>
              <div style={{ textAlign: 'center', fontSize: 12, color: '#8C7B6E', marginTop: 12 }}>
                Or call us: <strong style={{ color: '#1A1410' }}>+91 612-XXX-XXXX</strong>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── TESTIMONIALS FROM SELLERS ── */}
      <div style={{ padding: '72px 60px', background: '#fff' }}>
        <div style={{ textAlign: 'center', maxWidth: 520, margin: '0 auto 44px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#C85A08', marginBottom: 8 }}>Seller Stories</div>
          <h2 style={{ fontSize: 34, color: '#1A1410', fontFamily: "'Playfair Display', serif" }}>What Our Sellers Say</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
          {[
            { em: "👩‍🌾", bg: "#EAF5F0", name: "Kamla Devi", role: "Madhubani Artist · Madhubani", text: "Before BKB I could only sell locally. Now my paintings go to Bangalore, Mumbai, even overseas. I earn 4x more than before." },
            { em: "👨‍🌾", bg: "#FFF4EC", name: "Ram Prasad", role: "Makhana Farmer · Darbhanga", text: "I used to sell to middlemen at very low prices. Now I get the full market price directly. My family's life has completely changed." },
            { em: "👩‍🌾", bg: "#FEF8E0", name: "Sunita Kumari", role: "Silk Weaver · Bhagalpur", text: "The team helped me get my GI certificate and even helped me take better photos of my sarees. Orders started coming within a week!" },
          ].map(t => (
            <div key={t.name} style={{ background: '#FFFCF8', border: '1.5px solid #E8DDD4', borderRadius: 16, padding: 28 }}>
              <div style={{ color: '#9A720A', fontSize: 15, marginBottom: 12, letterSpacing: 2 }}>★★★★★</div>
              <p style={{ fontSize: 14, color: '#4A3F35', lineHeight: 1.75, marginBottom: 18, fontStyle: 'italic' }}>"{t.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{t.em}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1410' }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: '#8C7B6E' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}