'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={{ background: '#FFFCF8' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E8DDD4', padding: '28px 60px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#C85A08', marginBottom: 6 }}>Get In Touch</div>
        <h1 style={{ fontSize: 34, color: '#1A1410', fontFamily: "'Playfair Display', serif" }}>Contact Us</h1>
      </div>

      <div style={{ padding: '52px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, maxWidth: 1100, margin: '0 auto' }}>

          {/* Left Info */}
          <div>
            <h2 style={{ fontSize: 30, color: '#1A1410', fontFamily: "'Playfair Display', serif", marginBottom: 14 }}>
              We're Here to Help
            </h2>
            <p style={{ fontSize: 15, color: '#4A3F35', lineHeight: 1.75, marginBottom: 36 }}>
              Whether you're a buyer with a question about your order, a farmer wanting to sell on our platform, or a business looking to partner — our team is ready to help.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 36 }}>
              {[
                ['📞', 'Phone', '+91 612-XXX-XXXX', 'Mon–Sat, 9am to 6pm IST'],
                ['✉️', 'General Email', 'contact@biharkazaar.in', 'We reply within 24 hours'],
                ['🌾', 'Seller Support', 'sellers@biharkazaar.in', 'For farmers & artisans'],
                ['📍', 'Office Address', 'Bindisa Agritech, Patna', 'Bihar, India — 800001'],
              ].map(([em, label, value, sub]) => (
                <div key={label} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: '#FFF4EC', border: '1.5px solid #FFE8D4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{em}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#8C7B6E', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1410', marginBottom: 2 }}>{value}</div>
                    <div style={{ fontSize: 12, color: '#8C7B6E' }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ */}
            <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, padding: 24 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1A1410', marginBottom: 16, fontFamily: "'Playfair Display', serif" }}>Frequently Asked</h3>
              {[
                ['How long does delivery take?', '3–7 business days across India. Tracking SMS sent after dispatch.'],
                ['How do I become a seller?', 'Click "Sell on BKB" in the navbar and fill the registration form. Our team contacts you within 24 hours.'],
                ['What is a GI Tag?', 'A Geographical Indication tag certifies a product\'s origin and unique qualities from a specific region.'],
                ['Is payment secure?', 'Yes — all payments are 256-bit SSL encrypted and go directly to the Bihar seller.'],
              ].map(([q, a]) => (
                <div key={q} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid #F5EEE6' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1410', marginBottom: 4 }}>{q}</div>
                  <div style={{ fontSize: 13, color: '#8C7B6E', lineHeight: 1.6 }}>{a}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            {submitted ? (
              <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 20, padding: '60px 40px', textAlign: 'center' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
                <h3 style={{ fontSize: 26, color: '#1A5C38', marginBottom: 12, fontFamily: "'Playfair Display', serif" }}>Message Sent!</h3>
                <p style={{ fontSize: 14, color: '#4A3F35', lineHeight: 1.7 }}>Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} style={{ marginTop: 24, padding: '11px 24px', background: '#FFF4EC', color: '#C85A08', border: '1.5px solid #FFE8D4', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 20, padding: 36 }}>
                <h3 style={{ fontSize: 22, color: '#1A1410', marginBottom: 6, fontFamily: "'Playfair Display', serif" }}>Send a Message</h3>
                <p style={{ fontSize: 13, color: '#8C7B6E', marginBottom: 24 }}>Fill out the form and we'll get back to you shortly.</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 0 }}>
                  {[['Full Name', 'text', 'Ram Kumar'], ['Phone Number', 'text', '+91 99999 00000']].map(([l, t, p]) => (
                    <div key={l} style={{ marginBottom: 14 }}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>{l}</label>
                      <input type={t} placeholder={p} style={{ width: '100%', padding: '11px 13px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none', color: '#1A1410' }}
                        onFocus={e => e.target.style.borderColor = '#C85A08'}
                        onBlur={e => e.target.style.borderColor = '#E8DDD4'} />
                    </div>
                  ))}
                </div>

                {[['Email Address', 'email', 'ram@example.com']].map(([l, t, p]) => (
                  <div key={l} style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>{l}</label>
                    <input type={t} placeholder={p} style={{ width: '100%', padding: '11px 13px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none', color: '#1A1410' }}
                      onFocus={e => e.target.style.borderColor = '#C85A08'}
                      onBlur={e => e.target.style.borderColor = '#E8DDD4'} />
                  </div>
                ))}

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>Subject</label>
                  <select style={{ width: '100%', padding: '11px 13px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none', color: '#1A1410', cursor: 'pointer' }}
                    onFocus={e => e.target.style.borderColor = '#C85A08'}
                    onBlur={e => e.target.style.borderColor = '#E8DDD4'}>
                    <option>Order related query</option>
                    <option>I want to become a seller</option>
                    <option>Product quality complaint</option>
                    <option>Partnership / Business inquiry</option>
                    <option>GI Tag information</option>
                    <option>Other</option>
                  </select>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>Your Message</label>
                  <textarea placeholder="Describe your query in detail..." rows={5} style={{ width: '100%', padding: '11px 13px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none', color: '#1A1410', resize: 'vertical', lineHeight: 1.6 }}
                    onFocus={e => e.target.style.borderColor = '#C85A08'}
                    onBlur={e => e.target.style.borderColor = '#E8DDD4'} />
                </div>

                <button onClick={() => setSubmitted(true)} style={{ width: '100%', padding: 14, background: '#C85A08', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.target.style.background = '#A04806'}
                  onMouseLeave={e => e.target.style.background = '#C85A08'}>
                  Send Message →
                </button>

                <div style={{ textAlign: 'center', marginTop: 14, fontSize: 12, color: '#8C7B6E' }}>
                  We typically reply within <strong style={{ color: '#1A1410' }}>24 hours</strong>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}