'use client';

import Link from 'next/link';

const products = [
  { id: 1, name: "Premium Makhana (Fox Nuts)", seller: "Ram Prasad", dist: "Darbhanga", cat: "Food & Agri", price: 480, unit: "500g", em: "🌰", gi: true, rat: "4.8", rev: 96, bg: "#FFF8E8" },
  { id: 2, name: "Madhubani Painting — Fish Motif", seller: "Sunita Devi", dist: "Madhubani", cat: "Handicrafts", price: 1200, unit: "piece", em: "🎨", gi: true, rat: "5.0", rev: 48, bg: "#FFF0F5" },
  { id: 3, name: "Bhagalpuri Silk Saree", seller: "Md. Arshad", dist: "Bhagalpur", cat: "Textiles", price: 3800, unit: "piece", em: "🧣", gi: true, rat: "4.9", rev: 62, bg: "#F0F4FF" },
  { id: 4, name: "Shahi Litchi — Fresh", seller: "Vijay Kumar", dist: "Muzaffarpur", cat: "Fruits", price: 380, unit: "1kg", em: "🍈", gi: true, rat: "4.7", rev: 184, bg: "#F0FFF4" },
];

const categories = [
  { label: "Food & Agri", em: "🌾", count: 84 },
  { label: "Handicrafts", em: "🎨", count: 62 },
  { label: "Textiles & Silk", em: "🧵", count: 38 },
  { label: "Spices & Herbs", em: "🌶️", count: 29 },
  { label: "Sweets & Snacks", em: "🍭", count: 47 },
  { label: "Fresh Fruits", em: "🍈", count: 21 },
];

const marqueeItems = [
  "🪔 Madhubani Paintings",
  "🌿 Shahi Litchi · Muzaffarpur",
  "🍚 Katarni Rice · Bhojpur",
  "🍭 Silao Khaja · Nalanda",
  "🧵 Bhagalpuri Silk",
  "🌾 Makhana · Darbhanga",
  "🥭 Jardalu Mango · Bhagalpur",
];

const testimonials = [
  { name: "Priya Sharma", city: "Mumbai, Maharashtra", em: "👩", bg: "#FFF4EC", text: "The Makhana I ordered was absolutely fresh and of incredible quality. You can taste the difference from what you get in supermarkets." },
  { name: "Vikram Reddy", city: "Bengaluru, Karnataka", em: "👨", bg: "#EAF5F0", text: "Bought a Madhubani painting for my living room. Knowing it came directly from the artist makes it extra special. Stunning work." },
  { name: "Anjali Mehta", city: "New Delhi", em: "👩", bg: "#FEF8E0", text: "The Shahi Litchi was everything I'd heard about. Sweetest, most fragrant lychees I've ever had — delivered to Delhi still perfectly fresh." },
];

function ProductCard({ p }) {
  return (
    <Link href={`/shop/${p.id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: '#fff',
        border: '1.5px solid #E8DDD4',
        borderRadius: 16,
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.25s',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = '#F5A06A';
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(200,90,8,0.13)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = '#E8DDD4';
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 170, background: p.bg, fontSize: 64 }}>
          {p.gi && (
            <span style={{ position: 'absolute', top: 10, left: 10, background: '#9A720A', color: '#fff', fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 5 }}>
              🏅 GI Tag
            </span>
          )}
          {p.em}
        </div>

        {/* Body */}
        <div style={{ padding: '16px 16px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: '#8C7B6E' }}>📍 {p.dist}</span>
            <span style={{ fontSize: 11, color: '#9A720A', fontWeight: 700 }}>★ {p.rat} ({p.rev})</span>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1410', lineHeight: 1.3, marginBottom: 3 }}>{p.name}</div>
          <div style={{ fontSize: 11, color: '#8C7B6E', marginBottom: 12 }}>by {p.seller}</div>
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: 19, fontWeight: 800, color: '#C85A08' }}>₹{p.price.toLocaleString()}</span>
              <span style={{ fontSize: 10, color: '#C0B0A0' }}> /{p.unit}</span>
            </div>
            <button style={{
              background: '#C85A08', color: '#fff', border: 'none',
              borderRadius: 8, padding: '8px 14px', fontSize: 12,
              fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  return (
    <div style={{ fontFamily: "'Outfit', sans-serif" }}>

      {/* ── HERO ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '88vh',
        background: 'linear-gradient(150deg, #FFFCF8 0%, #FFF4EC 45%, #EAF5F0 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* dot pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(#E8DDD4 1px, transparent 1px)',
          backgroundSize: '28px 28px', opacity: 0.35,
        }} />

        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '64px 44px 64px 60px', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#FEF8E0', border: '1px solid rgba(154,114,10,0.25)',
            borderRadius: 40, padding: '5px 14px', fontSize: 11,
            fontWeight: 700, color: '#9A720A', marginBottom: 20, width: 'fit-content',
          }}>
            🏅 GI-Tagged · Authentic · Direct from Bihar
          </div>

          <h1 style={{ fontSize: 52, lineHeight: 1.07, marginBottom: 18, color: '#1A1410', fontFamily: "'Playfair Display', serif" }}>
            Bihar's <em style={{ color: '#C85A08' }}>Finest</em><br />
            <span style={{ color: '#1A5C38' }}>उत्पाद</span> — Direct<br />
            to Your Door
          </h1>

          <p style={{ fontSize: 16, color: '#4A3F35', lineHeight: 1.75, maxWidth: 460, marginBottom: 32 }}>
            From the wetlands of Darbhanga to your kitchen — discover{' '}
            <strong style={{ color: '#C85A08' }}>genuine GI-tagged products</strong>{' '}
            grown and crafted by real farmers and artisans of Bihar.
          </p>

          <div style={{ display: 'flex', gap: 12, marginBottom: 48, flexWrap: 'wrap' }}>
            <Link href="/shop">
              <button style={{
                padding: '13px 26px', borderRadius: 12, fontSize: 14, fontWeight: 700,
                background: '#C85A08', color: '#fff', border: '2px solid #C85A08',
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
              }}>
                Explore Products →
              </button>
            </Link>
            <Link href="/sellers">
              <button style={{
                padding: '13px 26px', borderRadius: 12, fontSize: 14, fontWeight: 700,
                background: '#fff', color: '#1A1410', border: '2px solid #E8DDD4',
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
                Sell Your Products
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, maxWidth: 380 }}>
            {[["240+", "Products Listed"], ["800+", "Verified Sellers"], ["38", "Districts Covered"]].map(([n, l]) => (
              <div key={l} style={{ background: '#fff', border: '1px solid #E8DDD4', borderRadius: 10, padding: '15px 17px' }}>
                <div style={{ fontSize: 25, fontWeight: 800, color: '#C85A08', fontFamily: "'Playfair Display', serif" }}>{n}</div>
                <div style={{ fontSize: 11, color: '#8C7B6E', marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Product Showcase */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 60px 48px 28px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, maxWidth: 420, width: '100%' }}>

            {/* Big card */}
            <Link href="/shop/1" style={{ textDecoration: 'none', gridRow: 'span 2', display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, overflow: 'hidden', flex: 1, cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, padding: '28px 16px', background: '#FFF8E8' }}>🌰</div>
                <div style={{ padding: 14 }}>
                  <span style={{ display: 'inline-block', background: '#FEF8E0', color: '#7A5A08', fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 5, marginBottom: 5 }}>GI TAG</span>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1410' }}>Premium Makhana</div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: '#C85A08', marginTop: 3 }}>₹480 <span style={{ fontSize: 12, fontWeight: 400, color: '#C0B0A0' }}>/500g</span></div>
                </div>
              </div>
            </Link>

            {/* Small cards */}
            {[{ id: 2, em: '🎨', bg: '#FFF0F5', name: 'Madhubani Painting', price: '₹1,200' },
              { id: 4, em: '🍈', bg: '#F0FFF4', name: 'Shahi Litchi', price: '₹380' }].map(p => (
              <Link key={p.id} href={`/shop/${p.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, overflow: 'hidden', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38, padding: '20px 14px', background: p.bg }}>{p.em}</div>
                  <div style={{ padding: 11 }}>
                    <span style={{ display: 'inline-block', background: '#FEF8E0', color: '#7A5A08', fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 5, marginBottom: 4 }}>GI TAG</span>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#1A1410' }}>{p.name}</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#C85A08', marginTop: 3 }}>{p.price}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── MARQUEE ── */}
      <div style={{ background: '#C85A08', padding: '12px 0', overflow: 'hidden' }}>
        <div className="marquee-track" style={{ display: 'flex', whiteSpace: 'nowrap' }}>
          {[...marqueeItems, ...marqueeItems].map((t, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.95)', fontSize: 13, fontWeight: 500, padding: '0 24px' }}>
              {t}
              <span style={{ width: 4, height: 4, background: 'rgba(255,255,255,0.4)', borderRadius: '50%', display: 'inline-block', marginLeft: 16 }} />
            </span>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <div style={{ padding: '60px 60px', background: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#C85A08', marginBottom: 8 }}>Browse</div>
            <h2 style={{ fontSize: 32, color: '#1A1410', fontFamily: "'Playfair Display', serif" }}>Shop by Category</h2>
            <p style={{ fontSize: 14, color: '#8C7B6E', marginTop: 6 }}>Authentic products from every corner of Bihar</p>
          </div>
          <Link href="/shop">
            <button style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 700, color: '#C85A08', padding: '8px 16px', borderRadius: 8, border: '1.5px solid #FFE8D4', background: '#FFF4EC', cursor: 'pointer', fontFamily: 'inherit' }}>
              View all →
            </button>
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14 }}>
          {categories.map(c => (
            <Link key={c.label} href="/shop" style={{ textDecoration: 'none' }}>
              <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, padding: '24px 14px 18px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.22s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#C85A08'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8DDD4'; e.currentTarget.style.transform = 'none'; }}
              >
                <span style={{ fontSize: 32, display: 'block', marginBottom: 10 }}>{c.em}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#1A1410', display: 'block' }}>{c.label}</span>
                <span style={{ fontSize: 10, color: '#C0B0A0', marginTop: 3, display: 'block' }}>{c.count} products</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── FEATURED PRODUCTS ── */}
      <div style={{ padding: '60px 60px', background: '#FFF8F2' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#C85A08', marginBottom: 8 }}>Featured</div>
            <h2 style={{ fontSize: 32, color: '#1A1410', fontFamily: "'Playfair Display', serif" }}>GI-Tagged Bestsellers</h2>
            <p style={{ fontSize: 14, color: '#8C7B6E', marginTop: 6 }}>Hand-picked from verified Bihar sellers</p>
          </div>
          <Link href="/shop">
            <button style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 700, color: '#C85A08', padding: '8px 16px', borderRadius: 8, border: '1.5px solid #FFE8D4', background: '#FFF4EC', cursor: 'pointer', fontFamily: 'inherit' }}>
              View all →
            </button>
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {products.map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      </div>

      {/* ── GI TAG SECTION ── */}
      <div style={{ background: 'linear-gradient(135deg, #FAF0E4 0%, #FEF8E0 100%)', borderTop: '1px solid #E8DDD4', borderBottom: '1px solid #E8DDD4', padding: '60px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 52, alignItems: 'center', maxWidth: 940, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}>
            <div style={{ width: 110, height: 110, borderRadius: '50%', background: 'linear-gradient(135deg, #9A720A, #7A5A08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52 }}>🏅</div>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#7A5A08', letterSpacing: 2, textTransform: 'uppercase' }}>GI Tag Certified</div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#C85A08', marginBottom: 8 }}>What is a GI Tag?</div>
            <h2 style={{ fontSize: 26, color: '#1A1410', fontFamily: "'Playfair Display', serif", marginBottom: 12 }}>Bihar's Geographically Indicated Products</h2>
            <p style={{ fontSize: 14, color: '#4A3F35', lineHeight: 1.75, marginBottom: 16 }}>
              A Geographical Indication tag certifies a product's special quality and origin from a specific region. Bihar's GI products are recognized nationally and internationally.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {["🌾 Shahi Litchi", "🍚 Katarni Rice", "🌰 Makhana", "🧵 Bhagalpuri Silk", "🎨 Madhubani Painting", "🍭 Silao Khaja", "🥭 Jardalu Mango"].map(t => (
                <span key={t} style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 40, padding: '5px 13px', fontSize: 11, fontWeight: 600, color: '#4A3F35' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── WHY BKB ── */}
      <div style={{ padding: '60px 60px', background: '#fff' }}>
        <div style={{ textAlign: 'center', maxWidth: 500, margin: '0 auto 36px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#C85A08', marginBottom: 8 }}>Why Bihar Ka Bazaar</div>
          <h2 style={{ fontSize: 32, color: '#1A1410', fontFamily: "'Playfair Display', serif" }}>Built for Bihar's People</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
          {[
            ["🤝", "No Middlemen", "#FFF4EC", "Money goes directly to the seller. Farmers and artisans keep 95% of what you pay. No commission cuts, no agents."],
            ["✅", "Verified & Authentic", "#EAF5F0", "Every seller is verified. GI-tagged products are certified. You always get exactly what Bihar genuinely offers."],
            ["🚚", "Pan-India Delivery", "#FEF8E0", "From Patna to Pune — free shipping on orders above ₹500. Careful packaging for fragile and delicate items."],
          ].map(([icon, title, bg, desc]) => (
            <div key={title} style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, padding: '28px 24px' }}>
              <div style={{ width: 52, height: 52, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 16 }}>{icon}</div>
              <h3 style={{ fontSize: 18, color: '#1A1410', marginBottom: 7, fontFamily: "'Playfair Display', serif" }}>{title}</h3>
              <p style={{ fontSize: 13, color: '#8C7B6E', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── SELLER BAND ── */}
      <div style={{ background: '#1A5C38', padding: '64px 60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: 120, top: '50%', transform: 'translateY(-50%)', fontSize: 220, opacity: 0.05, lineHeight: 1 }}>🌾</div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 36, color: '#fff', marginBottom: 12, lineHeight: 1.2, fontFamily: "'Playfair Display', serif" }}>Are You a Farmer or Artisan from Bihar?</h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.72)', lineHeight: 1.75, marginBottom: 24 }}>
            List your products on Bihar Ka Bazaar and reach customers across all of India. Free to join, no commissions on your first 100 orders.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
            {[["1", "Register free", "takes 5 minutes"], ["2", "List your products", "photos + description"], ["3", "Get orders", "we handle logistics"], ["4", "Get paid", "direct bank transfer in 3–5 days"]].map(([n, t, s]) => (
              <div key={n} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.35)', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{n}</span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.82)' }}><strong style={{ color: '#fff' }}>{t}</strong> — {s}</span>
              </div>
            ))}
          </div>
          <Link href="/sellers">
            <button style={{ padding: '13px 26px', borderRadius: 12, fontSize: 14, fontWeight: 700, background: '#fff', color: '#1A5C38', border: '2px solid #fff', cursor: 'pointer', fontFamily: 'inherit' }}>
              Start Selling Free →
            </button>
          </Link>
        </div>

        {/* Quick Register Form */}
        <div style={{ background: '#fff', borderRadius: 22, padding: 32, position: 'relative', zIndex: 1 }}>
          <h3 style={{ fontSize: 20, color: '#1A1410', marginBottom: 20, fontFamily: "'Playfair Display', serif" }}>Quick Registration</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            {[["Your Name", "Ram Prasad"], ["Mobile", "+91 99999 00000"]].map(([l, p]) => (
              <div key={l}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>{l}</label>
                <input placeholder={p} style={{ width: '100%', padding: '10px 13px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none' }} />
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>District</label>
            <select style={{ width: '100%', padding: '10px 13px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none' }}>
              <option>Select district</option>
              {["Patna", "Muzaffarpur", "Darbhanga", "Bhagalpur", "Gaya", "Nalanda", "Madhubani"].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>What do you sell?</label>
            <select style={{ width: '100%', padding: '10px 13px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none' }}>
              <option>Category</option>
              {["Food & Agri", "Handicrafts & Art", "Textiles & Silk", "Sweets & Snacks", "Fresh Fruits"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <button style={{ width: '100%', padding: 13, borderRadius: 8, fontSize: 14, fontWeight: 700, background: '#C85A08', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            Register as Seller
          </button>
        </div>
      </div>

      {/* ── TESTIMONIALS ── */}
      <div style={{ padding: '60px 60px', background: '#FFF8F2' }}>
        <div style={{ textAlign: 'center', maxWidth: 500, margin: '0 auto 36px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#C85A08', marginBottom: 8 }}>Customer Stories</div>
          <h2 style={{ fontSize: 32, color: '#1A1410', fontFamily: "'Playfair Display', serif" }}>Loved Across India</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {testimonials.map(t => (
            <div key={t.name} style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, padding: 26 }}>
              <div style={{ color: '#9A720A', fontSize: 15, marginBottom: 12, letterSpacing: 2 }}>★★★★★</div>
              <p style={{ fontSize: 13, color: '#4A3F35', lineHeight: 1.75, marginBottom: 16, fontStyle: 'italic' }}>"{t.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{t.em}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1410' }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: '#8C7B6E' }}>{t.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}