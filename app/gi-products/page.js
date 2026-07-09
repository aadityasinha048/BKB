'use client';

import Link from 'next/link';

const GI_PRODUCTS = [
  { id: 4, name: "Shahi Litchi", dist: "Muzaffarpur", em: "🍈", since: "2018", desc: "World-renowned for its exceptional sweetness, fragrance and size. Grown in the unique alluvial soil of Muzaffarpur.", color: "#F0FFF4", accent: "#1A5C38" },
  { id: 1, name: "Makhana (Fox Nuts)", dist: "Darbhanga", em: "🌰", since: "2022", desc: "India's largest producer of Makhana. These lotus seeds from Bihar's wetlands are a globally recognized superfood.", color: "#FFF8E8", accent: "#9A720A" },
  { id: 6, name: "Katarni Rice", dist: "Bhojpur", em: "🍚", since: "2021", desc: "Aromatic slim-grained rice with a distinct fragrance. Grown using traditional methods in the Bhojpur region.", color: "#FAFFF4", accent: "#1A5C38" },
  { id: 3, name: "Bhagalpuri Silk (Tussar)", dist: "Bhagalpur", em: "🧵", since: "2017", desc: "Handwoven Tussar silk from the Silk City of India. Known for its natural golden sheen and unique texture.", color: "#F0F4FF", accent: "#3060CC" },
  { id: 2, name: "Madhubani Painting", dist: "Madhubani", em: "🎨", since: "2007", desc: "Ancient folk art tradition with 2,500 years of history. Uses natural colors and depicts mythology and nature.", color: "#FFF0F5", accent: "#993556" },
  { id: 5, name: "Silao Khaja", dist: "Nalanda", em: "🍭", since: "2016", desc: "A uniquely flaky sweet from Silao on the Rajgir-Patna route, made with a centuries-old recipe using pure ghee.", color: "#FFF8E8", accent: "#9A720A" },
  { id: 7, name: "Jardalu Mango", dist: "Bhagalpur", em: "🥭", since: "2018", desc: "Saffron-yellow seasonal mango with a distinct creamy sweetness. Grows exclusively along the Ganga riverbanks.", color: "#FFF8E8", accent: "#E87B24" },
];

export default function GIProductsPage() {
  return (
    <div style={{ background: '#fff' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #E8F5EC, #F0FAF3)', padding: '72px 60px', textAlign: 'center', borderBottom: '1px solid #E5E1DC' }}>
        <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'linear-gradient(135deg, #B8860B, #8B6508)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(184,134,11,0.2)' }}>🏅</div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#1B6B3A', marginBottom: 12 }}>Certified Authentic</div>
        <h1 style={{ fontSize: 48, color: '#1A1410', fontFamily: "'Playfair Display', serif", marginBottom: 16 }}>
          Bihar's GI-Tagged Products
        </h1>
        <p style={{ fontSize: 17, color: '#3D3730', maxWidth: 620, margin: '0 auto 28px', lineHeight: 1.75 }}>
          Geographical Indication (GI) tags are awarded to products with a specific geographical origin that possess qualities or reputation due to that origin. Bihar has <strong>7 GI-certified products</strong> — each a cultural and agricultural treasure.
        </p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#fff', border: '1.5px solid #E5E1DC', borderRadius: 40, padding: '10px 22px', fontSize: 14, color: '#3D3730' }}>
          <span>🇮🇳</span> Certified by the Government of India · Geographical Indications Registry
        </div>
      </div>

      {/* What is GI */}
      <div style={{ padding: '60px 60px', background: '#fff' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, maxWidth: 900, margin: '0 auto' }}>
          {[
            ['🔍', 'Verified Origin', 'Every GI product comes from a specific geographic region in Bihar that gives it its unique character.'],
            ['🌟', 'Certified Quality', 'GI certification guarantees the quality and authenticity that makes Bihar products world-famous.'],
            ['🛡️', 'Protected by Law', 'GI tags are legally protected — only genuine products from the region can carry the certification.'],
          ].map(([em, title, desc]) => (
            <div key={title} style={{ background: '#FFF9F2', border: '1px solid #E5E1DC', borderRadius: 14, padding: '22px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{em}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1410', marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>{title}</h3>
              <p style={{ fontSize: 13, color: '#7A7067', lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* GI Products List */}
      <div style={{ padding: '20px 60px 72px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#1B6B3A', marginBottom: 10 }}>All 7 GI Products</div>
        <h2 style={{ fontSize: 34, color: '#1A1410', fontFamily: "'Playfair Display', serif", marginBottom: 40 }}>Bihar's Certified Treasures</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {GI_PRODUCTS.map((p, i) => (
            <div key={p.id} style={{ background: '#fff', border: '1px solid #E5E1DC', borderRadius: 18, overflow: 'hidden', display: 'grid', gridTemplateColumns: '280px 1fr auto', alignItems: 'center', transition: 'all 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#1B6B3A'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(27,107,58,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E1DC'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              {/* Image */}
              <div style={{ height: 160, background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 72, position: 'relative' }}>
                <span style={{ position: 'absolute', top: 12, left: 12, background: '#B8860B', color: '#fff', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 6 }}>🏅 GI #{i + 1}</span>
                {p.em}
              </div>
              {/* Info */}
              <div style={{ padding: '28px 32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <h3 style={{ fontSize: 24, color: '#1A1410', fontFamily: "'Playfair Display', serif" }}>{p.name}</h3>
                  <span style={{ background: p.color, color: p.accent, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, border: `1px solid ${p.accent}30` }}>GI Since {p.since}</span>
                </div>
                <div style={{ fontSize: 13, color: '#7A7067', marginBottom: 12 }}>📍 {p.dist}, Bihar</div>
                <p style={{ fontSize: 14, color: '#3D3730', lineHeight: 1.75 }}>{p.desc}</p>
              </div>
              {/* CTA */}
              <div style={{ padding: '28px 32px 28px 0', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
                <Link href={`/shop/${p.id}`}>
                  <button style={{ padding: '11px 22px', background: '#1B6B3A', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                    Shop Now →
                  </button>
                </Link>
                <button style={{ padding: '11px 22px', background: '#E8F5EC', color: '#1B6B3A', border: '1px solid #D0EBDA', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}