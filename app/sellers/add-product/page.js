'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AddProductPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [preview, setPreview] = useState('🌰');

  const emojis = ['🌰','🎨','🧣','🍈','🍭','🍚','🥭','🎀','🫙','🖼️','🧃','🧺','🌾','🍯','🧵','🎋'];

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => router.push('/seller/listings'), 2000);
  };

  return (
    <div style={{ background: '#FFFCF8', minHeight: '80vh' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E8DDD4', padding: '20px 60px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <button style={{ padding: '8px 16px', background: '#F5EEE6', color: '#4A3F35', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>← Dashboard</button>
        </Link>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#C85A08' }}>Seller Tools</div>
          <h1 style={{ fontSize: 26, color: '#1A1410', fontFamily: "'Playfair Display', serif" }}>Add New Product</h1>
        </div>
      </div>

      {submitted ? (
        <div style={{ textAlign: 'center', padding: '80px 60px' }}>
          <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 28, color: '#1A5C38', marginBottom: 10, fontFamily: "'Playfair Display', serif" }}>Product Listed!</h2>
          <p style={{ fontSize: 15, color: '#8C7B6E' }}>Your product is now live on Bihar Ka Bazaar. Redirecting to your listings...</p>
        </div>
      ) : (
        <div style={{ padding: '36px 60px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28, alignItems: 'start' }}>

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Basic Info */}
            <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #E8DDD4', fontSize: 15, fontWeight: 700, color: '#1A1410' }}>📦 Basic Information</div>
              <div style={{ padding: 24 }}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>Product Name <span style={{ color: '#C85A08' }}>*</span></label>
                  <input placeholder="e.g. Premium Makhana 500g" style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none', color: '#1A1410' }}
                    onFocus={e => e.target.style.borderColor = '#C85A08'} onBlur={e => e.target.style.borderColor = '#E8DDD4'} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>Product Description <span style={{ color: '#C85A08' }}>*</span></label>
                  <textarea placeholder="Describe your product — what makes it special, how it's made, its quality..." rows={4}
                    style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none', color: '#1A1410', resize: 'vertical', lineHeight: 1.6 }}
                    onFocus={e => e.target.style.borderColor = '#C85A08'} onBlur={e => e.target.style.borderColor = '#E8DDD4'} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {[['Category', 'select', ['Food & Agri', 'Handicrafts', 'Textiles & Silk', 'Spices & Herbs', 'Sweets & Snacks', 'Fresh Fruits', 'Dairy', 'Other']],
                    ['Sub-category', 'select', ['Select category first', 'Lotus Seeds', 'Paintings', 'Silk Sarees', 'Rice', 'Mangoes', 'Pickles']]].map(([l, type, opts]) => (
                    <div key={l}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>{l} <span style={{ color: '#C85A08' }}>*</span></label>
                      <select style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none', color: '#1A1410', cursor: 'pointer' }}>
                        {opts.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pricing & Stock */}
            <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #E8DDD4', fontSize: 15, fontWeight: 700, color: '#1A1410' }}>💰 Pricing & Stock</div>
              <div style={{ padding: 24, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                {[['Selling Price (₹)', '480', 'Price buyers will pay'],
                  ['Unit / Pack Size', '500g', 'e.g. 500g, 1kg, piece'],
                  ['Available Stock', '100', 'How many units you have']].map(([l, p, hint]) => (
                  <div key={l}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>{l} <span style={{ color: '#C85A08' }}>*</span></label>
                    <input placeholder={p} style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none', color: '#1A1410' }}
                      onFocus={e => e.target.style.borderColor = '#C85A08'} onBlur={e => e.target.style.borderColor = '#E8DDD4'} />
                    <div style={{ fontSize: 11, color: '#8C7B6E', marginTop: 4 }}>{hint}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Image */}
            <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #E8DDD4', fontSize: 15, fontWeight: 700, color: '#1A1410' }}>📸 Product Image</div>
              <div style={{ padding: 24 }}>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 8 }}>Choose a product icon</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {emojis.map(em => (
                      <button key={em} onClick={() => setPreview(em)}
                        style={{ width: 44, height: 44, borderRadius: 10, background: preview === em ? '#FFF4EC' : '#F5EEE6', border: `1.5px solid ${preview === em ? '#C85A08' : '#E8DDD4'}`, fontSize: 22, cursor: 'pointer' }}>
                        {em}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ background: '#F5EEE6', border: '2px dashed #E8DDD4', borderRadius: 12, padding: '32px', textAlign: 'center', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#C85A08'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#E8DDD4'}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>📁</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#4A3F35', marginBottom: 4 }}>Upload Product Photos</div>
                  <div style={{ fontSize: 12, color: '#8C7B6E' }}>JPG, PNG up to 5MB each. Minimum 3 photos recommended.</div>
                </div>
              </div>
            </div>

            {/* GI & Certification */}
            <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #E8DDD4', fontSize: 15, fontWeight: 700, color: '#1A1410' }}>🏅 Certification</div>
              <div style={{ padding: 24 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[['GI Tag Certified', 'My product has an official GI Tag certificate'],
                    ['Organic Certified', 'My product is certified organic'],
                    ['Handmade / Hand-crafted', 'This product is made by hand without machines']].map(([l, desc]) => (
                    <label key={l} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', padding: '12px 14px', background: '#FFFCF8', borderRadius: 10, border: '1px solid #E8DDD4' }}>
                      <input type="checkbox" style={{ accentColor: '#C85A08', marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1410' }}>{l}</div>
                        <div style={{ fontSize: 11, color: '#8C7B6E', marginTop: 2 }}>{desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
                <div style={{ marginTop: 16, padding: '12px 14px', background: '#EAF5F0', borderRadius: 10, fontSize: 13, color: '#1A5C38' }}>
                  💡 Don't have a GI certificate yet? <strong>We can help you apply.</strong> Contact us at sellers@biharkazaar.in
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #E8DDD4', fontSize: 15, fontWeight: 700, color: '#1A1410' }}>🚚 Shipping Details</div>
              <div style={{ padding: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {[['Package Weight (grams)', '600', 'Approx weight when packed'],
                    ['Processing Time (days)', '1-2', 'Days to pack and dispatch']].map(([l, p, hint]) => (
                    <div key={l}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>{l}</label>
                      <input placeholder={p} style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none', color: '#1A1410' }}
                        onFocus={e => e.target.style.borderColor = '#C85A08'} onBlur={e => e.target.style.borderColor = '#E8DDD4'} />
                      <div style={{ fontSize: 11, color: '#8C7B6E', marginTop: 4 }}>{hint}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Link href="/dashboard">
                <button style={{ width: '100%', padding: 14, background: '#fff', color: '#4A3F35', border: '1.5px solid #E8DDD4', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Save as Draft
                </button>
              </Link>
              <button onClick={handleSubmit} style={{ padding: 14, background: '#C85A08', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                Publish Product →
              </button>
            </div>
          </div>

          {/* Preview Card */}
          <div style={{ position: 'sticky', top: 84 }}>
            <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #E8DDD4', fontSize: 12, fontWeight: 700, color: '#8C7B6E', textTransform: 'uppercase', letterSpacing: 1 }}>Live Preview</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 180, background: '#FFF8E8', fontSize: 80 }}>{preview}</div>
              <div style={{ padding: '16px 18px' }}>
                <div style={{ display: 'inline-block', background: '#FEF8E0', color: '#7A5A08', fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 5, marginBottom: 8 }}>GI TAG</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1410', marginBottom: 3 }}>Your Product Name</div>
                <div style={{ fontSize: 12, color: '#8C7B6E', marginBottom: 12 }}>by Ram Prasad · Darbhanga</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: '#C85A08' }}>₹480 <span style={{ fontSize: 11, fontWeight: 400, color: '#C0B0A0' }}>/500g</span></span>
                  <button style={{ background: '#C85A08', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Add to Cart</button>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 14, background: '#EAF5F0', border: '1px solid rgba(26,92,56,0.2)', borderRadius: 12, padding: '14px 16px', fontSize: 13, color: '#1A5C38' }}>
              ✅ Your product will be reviewed and go live within <strong>2–4 hours</strong> of publishing.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}