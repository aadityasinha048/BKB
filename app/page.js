'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Award, Users, ShieldCheck, Truck } from 'lucide-react';

const categories = [
  { label: "Food & Agri", imgSrc: "/images/categories/food_agri.png", count: 84 },
  { label: "Handicrafts", imgSrc: "/images/categories/handicrafts.png", count: 62 },
  { label: "Textiles & Silk", imgSrc: "/images/categories/textiles_silk.png", count: 38 },
  { label: "Spices & Herbs", imgSrc: "/images/categories/spices_herbs.png", count: 29 },
  { label: "Sweets & Snacks", imgSrc: "/images/categories/sweets_snacks.png", count: 47 },
  { label: "Fresh Fruits", imgSrc: "/images/categories/fresh_fruits.png", count: 21 },
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
  { name: "Priya Sharma", city: "Mumbai, Maharashtra", em: "👩", bg: "#E8F5EC", text: "The Makhana I ordered was absolutely fresh and of incredible quality. You can taste the difference from what you get in supermarkets." },
  { name: "Vikram Reddy", city: "Bengaluru, Karnataka", em: "👨", bg: "#FFF4EC", text: "Bought a Madhubani painting for my living room. Knowing it came directly from the artist makes it extra special. Stunning work." },
  { name: "Anjali Mehta", city: "New Delhi", em: "👩", bg: "#FEF8E0", text: "The Shahi Litchi was everything I'd heard about. Sweetest, most fragrant lychees I've ever had — delivered to Delhi still perfectly fresh." },
];

function ProductCard({ p }) {
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const existing = localStorage.getItem('bkb_cart');
    let cartItems = [];
    try {
      cartItems = existing ? JSON.parse(existing) : [];
    } catch {
      cartItems = [];
    }

    const itemIndex = cartItems.findIndex(item => item.id === p.id);
    if (itemIndex > -1) {
      cartItems[itemIndex].qty += 1;
    } else {
      cartItems.push({
        id: p.id,
        name: p.name,
        seller: p.seller,
        dist: p.dist,
        price: p.price,
        unit: p.unit,
        imgSrc: p.imgSrc || `/images/products/prod_${p.id}.png`,
        bg: p.bg || '#FFF8E8',
        qty: 1
      });
    }
    localStorage.setItem('bkb_cart', JSON.stringify(cartItems));
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <Link href={`/shop/${p.id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        border: '1px solid #EEEAE6',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-6px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.12)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative', height: 190, background: '#F8F6F3', overflow: 'hidden' }}>
          {p.gi && (
            <span style={{ position: 'absolute', top: 10, left: 10, background: '#B8860B', color: '#fff', fontSize: 9, fontWeight: 800, padding: '4px 10px', borderRadius: 6, zIndex: 1, letterSpacing: '0.3px' }}>
              🏅 GI TAG
            </span>
          )}
          <img 
            src={p.imgSrc || `/images/products/prod_${p.id}.png`} 
            alt={p.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} 
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />
        </div>

        {/* Body */}
        <div style={{ padding: '16px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: '#7A7067' }}>📍 {p.dist}</span>
            <span style={{ fontSize: 11, color: '#B8860B', fontWeight: 700 }}>★ {p.rat} ({p.rev})</span>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1410', lineHeight: 1.3, marginBottom: 4 }}>{p.name}</div>
          <div style={{ fontSize: 11, color: '#7A7067', marginBottom: 14 }}>by {p.seller}</div>
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F2F0ED', paddingTop: 14 }}>
            <div>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#1A1410' }}>₹{p.price.toLocaleString()}</span>
              <span style={{ fontSize: 11, color: '#B0A598', marginLeft: 2 }}>/{p.unit}</span>
            </div>
            <button 
              onClick={handleAddToCart}
              style={{
                background: added ? '#1B6B3A' : '#1B6B3A', 
                color: '#fff', border: 'none',
                borderRadius: 8, padding: '9px 18px', fontSize: 13,
                fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.2s',
                opacity: added ? 0.85 : 1,
              }}
            >
              {added ? '✓ Added' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const [bestsellers, setBestsellers] = useState([]);
  const [heroSlide, setHeroSlide] = useState(0);

  const fetchBestsellers = useCallback(async () => {
    try {
      const res = await fetch('/api/products?limit=4');
      const data = await res.json();
      if (data.success) {
        setBestsellers(data.products.slice(0, 4));
      }
    } catch (err) {
      console.error('Error loading bestsellers:', err);
    }
  }, []);

  useEffect(() => {
    fetchBestsellers();
  }, [fetchBestsellers]);

  useEffect(() => {
    const timer = setInterval(() => setHeroSlide(s => (s + 1) % 3), 5000);
    return () => clearInterval(timer);
  }, []);

  const heroSlides = [
    { 
      title: "FARM FRESH", subtitle: "From Bihar's Fields", 
      desc: "Authentic GI-tagged products directly from farmers",
      img: "/images/products/prod_1.png", bg: "linear-gradient(135deg, #FFF9F2 0%, #F0FAF3 100%)",
      accent: '#1B6B3A'
    },
    { 
      title: "SHAHI LITCHI", subtitle: "Muzaffarpur's Pride", 
      desc: "World-renowned sweetness, now at your doorstep",
      img: "/images/products/prod_4.png", bg: "linear-gradient(135deg, #F0FAF3 0%, #FFF9F2 100%)",
      accent: '#E87B24'
    },
    { 
      title: "SILK HERITAGE", subtitle: "Bhagalpur's Legacy", 
      desc: "Handwoven Tussar silk from fourth-generation weavers",
      img: "/images/products/prod_3.png", bg: "linear-gradient(135deg, #F0F4FF 0%, #F0FAF3 100%)",
      accent: '#1B6B3A'
    },
  ];

  const currentSlide = heroSlides[heroSlide];

  return (
    <div className="blob-container" style={{ fontFamily: "'Outfit', sans-serif", background: '#ffffff', overflow: 'hidden' }}>
      {/* Background organic blobs for premium depth */}
      <div className="blob-glow blob-green" />
      <div className="blob-glow blob-orange" />

      {/* ── HERO BANNER ── */}
      <div className="home-hero-grid" style={{
        background: currentSlide.bg,
        minHeight: '80vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background 0.8s ease',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', right: -80, top: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(27,107,58,0.04)' }} />
        <div style={{ position: 'absolute', left: -40, bottom: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(232,123,36,0.04)' }} />

        {/* Left text content */}
        <div style={{ padding: '80px 44px 80px 72px', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#E8F5EC', border: '1.5px solid rgba(27,107,58,0.2)',
            borderRadius: 40, padding: '6px 16px', fontSize: 11,
            fontWeight: 700, color: '#1B6B3A', marginBottom: 24, width: 'fit-content',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1B6B3A', display: 'inline-block' }} />
            Fresh From Bihar's Farms
          </div>

          <h1 style={{ 
            fontSize: 58, lineHeight: 1.05, marginBottom: 8, color: currentSlide.accent, 
            fontFamily: "'Playfair Display', serif",
            transition: 'color 0.5s',
            letterSpacing: '-1px',
          }}>
            {currentSlide.title}
          </h1>
          <h2 style={{ 
            fontSize: 36, lineHeight: 1.15, marginBottom: 18, color: '#1A1410', 
            fontFamily: "'Playfair Display', serif", fontWeight: 700,
          }}>
            {currentSlide.subtitle}
          </h2>

          <p style={{ fontSize: 16, color: '#3D3730', lineHeight: 1.7, maxWidth: 420, marginBottom: 36 }}>
            {currentSlide.desc}. Discover genuine GI-tagged products grown and crafted by real farmers and artisans of Bihar.
          </p>

          <div style={{ display: 'flex', gap: 14, marginBottom: 40 }}>
            <Link href="/shop">
              <button style={{
                padding: '14px 32px', borderRadius: 10, fontSize: 15, fontWeight: 700,
                background: '#1B6B3A', color: '#fff', border: 'none',
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.25s',
                boxShadow: '0 4px 16px rgba(27,107,58,0.25)',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#0D3B1E'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#1B6B3A'; e.currentTarget.style.transform = 'none'; }}
              >
                ORDER NOW
              </button>
            </Link>
            <Link href="/gi-products">
              <button style={{
                padding: '14px 32px', borderRadius: 10, fontSize: 15, fontWeight: 700,
                background: 'transparent', color: '#1B6B3A', border: '2px solid #1B6B3A',
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#E8F5EC'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                Explore GI Products
              </button>
            </Link>
          </div>

          {/* Slide dots */}
          <div style={{ display: 'flex', gap: 8 }}>
            {heroSlides.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setHeroSlide(i)}
                style={{ 
                  width: i === heroSlide ? 28 : 10, height: 10, borderRadius: 5, border: 'none',
                  background: i === heroSlide ? '#1B6B3A' : '#D0EBDA',
                  cursor: 'pointer', transition: 'all 0.3s',
                }} 
              />
            ))}
          </div>
        </div>

        {/* Right — hero product image */}
        <div style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          padding: '60px 72px 60px 0', position: 'relative', zIndex: 1,
        }}>
          <div style={{
            width: 420, height: 420, borderRadius: '50%',
            background: 'rgba(255,255,255,0.7)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
            border: '3px solid rgba(27,107,58,0.1)',
          }}>
            <img 
              src={currentSlide.img} 
              alt={currentSlide.title}
              style={{ 
                width: '105%', height: '105%', objectFit: 'cover',
                transition: 'all 0.6s ease',
              }}
            />
          </div>
          {/* Floating badges */}
          <div className="float" style={{
            position: 'absolute', top: 80, right: 80,
            background: '#fff', borderRadius: 14, padding: '12px 16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 22 }}>🏅</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1A1410' }}>GI Certified</div>
              <div style={{ fontSize: 10, color: '#7A7067' }}>7 Products</div>
            </div>
          </div>
          <div className="float" style={{
            position: 'absolute', bottom: 100, left: 20,
            background: '#fff', borderRadius: 14, padding: '12px 16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            display: 'flex', alignItems: 'center', gap: 8,
            animationDelay: '1.5s',
          }}>
            <span style={{ fontSize: 22 }}>🌾</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1A1410' }}>800+ Farmers</div>
              <div style={{ fontSize: 10, color: '#7A7067' }}>38 Districts</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TRUST STRIP (KisanKonnect style) ── */}
      <div style={{ padding: '36px 0' }}>
        <div className="trust-strip">
          {[
            ['🚚', 'Free Delivery*', 'On orders above ₹500'],
            ['⚡', 'Fast Shipping', 'Across India in 3–5 days'],
            ['✅', 'Verified Farmers', '100% authentic Bihar products'],
            ['💳', 'Secure Payments', 'UPI, Cards, Net Banking & COD'],
            ['🎧', 'Customer Support', '7 AM – 10 PM, Mon–Sat'],
          ].map(([icon, title, desc]) => (
            <div key={title} className="trust-item">
              <div className="trust-icon">{icon}</div>
              <div className="trust-title">{title}</div>
              <div className="trust-desc">{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MARQUEE ── */}
      <div style={{ background: '#1B6B3A', padding: '13px 0', overflow: 'hidden' }}>
        <div className="marquee-track" style={{ display: 'flex', whiteSpace: 'nowrap' }}>
          {[...marqueeItems, ...marqueeItems].map((t, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.92)', fontSize: 13, fontWeight: 500, padding: '0 28px' }}>
              {t}
              <span style={{ width: 4, height: 4, background: 'rgba(255,255,255,0.35)', borderRadius: '50%', display: 'inline-block', marginLeft: 18 }} />
            </span>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES (KisanKonnect-style large cards) ── */}
      <div style={{ padding: '64px 60px', background: 'radial-gradient(circle at 10% 20%, #F5FAF6 0%, #FFFFFF 100%)', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontSize: 34, color: '#1A1410', fontFamily: "'Playfair Display', serif", marginBottom: 10 }}>Categories</h2>
          <p style={{ fontSize: 15, color: '#7A7067' }}>Explore authentic products from every corner of Bihar</p>
        </div>
        <div className="home-categories-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 18 }}>
          {categories.map(c => (
            <Link key={c.label} href="/shop" style={{ textDecoration: 'none' }}>
              <div 
                className="interactive-card"
                style={{ 
                  background: '#fff', 
                  borderRadius: 16,
                  overflow: 'hidden', 
                  cursor: 'pointer', 
                }}
                onMouseEnter={e => { 
                  const img = e.currentTarget.querySelector('img');
                  if (img) img.style.transform = 'scale(1.08)';
                }}
                onMouseLeave={e => { 
                  const img = e.currentTarget.querySelector('img');
                  if (img) img.style.transform = 'scale(1)';
                }}
              >
                <div style={{ width: '100%', height: 130, overflow: 'hidden', background: '#F8F6F3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img 
                    src={c.imgSrc} 
                    alt={c.label} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover', 
                      transition: 'transform 0.4s ease' 
                    }} 
                  />
                </div>
                <div style={{ padding: '14px 12px', textAlign: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1410', display: 'block' }}>{c.label}</span>
                  <span style={{ fontSize: 11, color: '#7A7067', marginTop: 4, display: 'block' }}>{c.count} products</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── FEATURED PRODUCTS ── */}
      <div style={{ padding: '64px 60px', background: 'linear-gradient(180deg, #FFFFFF 0%, #FAF9F6 100%)', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#1B6B3A', marginBottom: 8 }}>Bestsellers</div>
            <h2 style={{ fontSize: 32, color: '#1A1410', fontFamily: "'Playfair Display', serif" }}>GI-Tagged Favourites</h2>
            <p style={{ fontSize: 14, color: '#7A7067', marginTop: 6 }}>Hand-picked from verified Bihar sellers</p>
          </div>
          <Link href="/shop">
            <button style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 700, color: '#1B6B3A', padding: '10px 20px', borderRadius: 10, border: '1.5px solid #1B6B3A', background: '#E8F5EC', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1B6B3A'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#E8F5EC'; e.currentTarget.style.color = '#1B6B3A'; }}
            >
              View all →
            </button>
          </Link>
        </div>
        <div className="home-products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22 }}>
          {bestsellers.map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      </div>

      {/* ── GI TAG SECTION ── */}
      <div style={{ background: 'linear-gradient(135deg, #FAF8F5 0%, #EBF4EE 50%, #FAF8F5 100%)', borderTop: '1px solid #E5E1DC', borderBottom: '1px solid #E5E1DC', padding: '64px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 52, alignItems: 'center', maxWidth: 940, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}>
            <div style={{
              width: 110,
              height: 110,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FFF9E6 0%, #FFF0CC 100%)',
              border: '2px solid #D4AF37',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 30px rgba(212,175,55,0.15)',
            }}>
              <Award size={48} color="#B8860B" strokeWidth={1.5} />
            </div>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#8B6508', letterSpacing: 2, textTransform: 'uppercase' }}>GI Tag Certified</div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#1B6B3A', marginBottom: 8 }}>What is a GI Tag?</div>
            <h2 style={{ fontSize: 26, color: '#1A1410', fontFamily: "'Playfair Display', serif", marginBottom: 12 }}>Bihar's Geographically Indicated Products</h2>
            <p style={{ fontSize: 14, color: '#3D3730', lineHeight: 1.75, marginBottom: 16 }}>
              A Geographical Indication tag certifies a product's special quality and origin from a specific region. Bihar's GI products are recognized nationally and internationally.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {["Shahi Litchi", "Katarni Rice", "Makhana", "Bhagalpuri Silk", "Madhubani Painting", "Silao Khaja", "Jardalu Mango"].map(t => (
                <span key={t} className="pill-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#B8860B', display: 'inline-block' }} />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── WHY BKB ── */}
      <div style={{ padding: '64px 60px', background: 'linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%)', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', maxWidth: 500, margin: '0 auto 40px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#1B6B3A', marginBottom: 8 }}>Why Bihar Ka Bazaar</div>
          <h2 style={{ fontSize: 32, color: '#1A1410', fontFamily: "'Playfair Display', serif" }}>Built for Bihar's People</h2>
        </div>
        <div className="home-why-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
          {[
            [Users, "No Middlemen", "#E8F5EC", "#1B6B3A", "Money goes directly to the seller. Farmers and artisans keep 95% of what you pay. No commission cuts, no agents."],
            [ShieldCheck, "Verified & Authentic", "#FFF4EC", "#E88724", "Every seller is verified. GI-tagged products are certified. You always get exactly what Bihar genuinely offers."],
            [Truck, "Pan-India Delivery", "#FEF8E0", "#B8860B", "From Patna to Pune — free shipping on orders above ₹500. Careful packaging for fragile and delicate items."],
          ].map(([Icon, title, bg, color, desc]) => (
            <div key={title} className="interactive-card" style={{ 
              background: '#fff', borderRadius: 16, padding: '30px 26px',
            }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                <Icon size={24} color={color} strokeWidth={1.8} />
              </div>
              <h3 style={{ fontSize: 18, color: '#1A1410', marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>{title}</h3>
              <p style={{ fontSize: 13, color: '#7A7067', lineHeight: 1.75 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── SELLER BAND ── */}
      <div className="home-seller-grid" style={{ background: 'linear-gradient(135deg, #0D3B1E 0%, #1B6B3A 100%)', padding: '72px 60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: 120, top: '50%', transform: 'translateY(-50%)', fontSize: 220, opacity: 0.06, lineHeight: 1 }}>🌾</div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 40, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: 20 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#28A745', display: 'inline-block' }} />
            Join 800+ Farmers & Artisans
          </div>
          <h2 style={{ fontSize: 38, color: '#fff', marginBottom: 14, lineHeight: 1.2, fontFamily: "'Playfair Display', serif" }}>Are You a Farmer or Artisan from Bihar?</h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.75, marginBottom: 26 }}>
            List your products on Bihar Ka Bazaar and reach customers across all of India. Free to join, no commissions on your first 100 orders.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 30 }}>
            {[["1", "Register free", "takes 5 minutes"], ["2", "List your products", "photos + description"], ["3", "Get orders", "we handle logistics"], ["4", "Get paid", "direct bank transfer in 3–5 days"]].map(([n, t, s]) => (
              <div key={n} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.3)', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{n}</span>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}><strong style={{ color: '#fff' }}>{t}</strong> — {s}</span>
              </div>
            ))}
          </div>
          <Link href="/sellers">
            <button style={{ padding: '14px 30px', borderRadius: 10, fontSize: 14, fontWeight: 700, background: '#fff', color: '#1B6B3A', border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.25s', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)'; }}
            >
              Start Selling Free →
            </button>
          </Link>
        </div>

        {/* Seller Registration CTA Card */}
        <div style={{ background: '#fff', borderRadius: 22, padding: 36, position: 'relative', zIndex: 1, boxShadow: '0 20px 60px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #E8F5EC, #D4EDD9)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '2px solid #1B6B3A' }}>
              <img src="/images/bkb_logo.png" alt="BKB" style={{ width: '70%', height: '70%', objectFit: 'contain' }} />
            </div>
            <h3 style={{ fontSize: 22, color: '#1A1410', marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>Start Selling on BKB</h3>
            <p style={{ fontSize: 13, color: '#7A7067', lineHeight: 1.6 }}>
              Complete our 4-step verified registration. Takes less than 3 minutes.
            </p>
          </div>

          {/* Steps Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            {[
              ["Personal Profile", "Name, mobile & photo"],
              ["Business Details", "Address, category & type"],
              ["Product Info", "GST & product details"],
              ["Payout Setup", "Bank account & verification"],
            ].map(([title, desc], i) => (
              <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: '#E8F5EC', border: '1.5px solid #1B6B3A',
                  color: '#1B6B3A', fontSize: 12, fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>{i + 1}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1410' }}>{title}</div>
                  <div style={{ fontSize: 11, color: '#7A7067' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 20 }}>
            {["Free Forever", "Verified in 24hrs", "No Commission"].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#1B6B3A', fontWeight: 600 }}>
                <ShieldCheck size={13} strokeWidth={2} />
                {t}
              </div>
            ))}
          </div>

          <Link href="/sellers">
            <button style={{
              width: '100%', padding: 15, borderRadius: 12, fontSize: 15, fontWeight: 700,
              background: 'linear-gradient(135deg, #1B6B3A, #2D9F5A)', color: '#fff',
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.25s', boxShadow: '0 4px 16px rgba(27,107,58,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(27,107,58,0.35)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(27,107,58,0.25)'; }}
            >
              Register as a Seller →
            </button>
          </Link>
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <div style={{ background: 'linear-gradient(135deg, #E8F5EC 0%, #FFFBF7 100%)', padding: '48px 60px', borderTop: '1px solid #E5E1DC', borderBottom: '1px solid #E5E1DC', position: 'relative', zIndex: 1 }}>
        <div className="home-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, maxWidth: 900, margin: '0 auto' }}>
          {[
            ["240+", "Products Listed", "🛍️"],
            ["800+", "Verified Sellers", "🌾"],
            ["38", "Districts Covered", "📍"],
            ["10K+", "Happy Customers", "💚"],
          ].map(([n, l, icon]) => (
            <div key={l} style={{ textAlign: 'center', padding: '20px 16px' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#1B6B3A', fontFamily: "'Playfair Display', serif", marginBottom: 4 }}>{n}</div>
              <div style={{ fontSize: 13, color: '#7A7067' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TESTIMONIALS ── */}
      <div style={{ padding: '64px 60px', background: 'linear-gradient(180deg, #FFFFFF 0%, #FAF9F6 100%)', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', maxWidth: 500, margin: '0 auto 40px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#1B6B3A', marginBottom: 8 }}>Customer Stories</div>
          <h2 style={{ fontSize: 32, color: '#1A1410', fontFamily: "'Playfair Display', serif" }}>Loved Across India</h2>
        </div>
        <div className="home-testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
          {testimonials.map(t => (
            <div key={t.name} className="interactive-card" style={{ 
              background: '#fff', borderRadius: 16, padding: 28,
            }}>
              <div style={{ color: '#1B6B3A', fontSize: 15, marginBottom: 14, letterSpacing: 2 }}>★★★★★</div>
              <p style={{ fontSize: 14, color: '#3D3730', lineHeight: 1.75, marginBottom: 18, fontStyle: 'italic' }}>"{t.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{t.em}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1410' }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: '#7A7067' }}>{t.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
