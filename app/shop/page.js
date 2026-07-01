'use client';

import { useState } from 'react';
import Link from 'next/link';

const ALL_PRODUCTS = [
  { id: 1, name: "Premium Makhana (Fox Nuts)", seller: "Ram Prasad", dist: "Darbhanga", cat: "Food & Agri", price: 480, unit: "500g", em: "🌰", gi: true, rat: "4.8", rev: 96, bg: "#FFF8E8", desc: "Hand-picked lotus seeds from the pristine wetlands of Darbhanga. Sun-dried, roasted and packed fresh." },
  { id: 2, name: "Madhubani Painting — Fish Motif", seller: "Sunita Devi", dist: "Madhubani", cat: "Handicrafts", price: 1200, unit: "piece", em: "🎨", gi: true, rat: "5.0", rev: 48, bg: "#FFF0F5", desc: "Authentic Madhubani painting depicting the sacred fish motif. Natural vegetable colors on handmade paper." },
  { id: 3, name: "Bhagalpuri Silk Saree", seller: "Md. Arshad", dist: "Bhagalpur", cat: "Textiles", price: 3800, unit: "piece", em: "🧣", gi: true, rat: "4.9", rev: 62, bg: "#F0F4FF", desc: "Authentic Tussar silk saree from Bhagalpur, handwoven on traditional pit-looms by fourth-generation weavers." },
  { id: 4, name: "Shahi Litchi — Fresh", seller: "Vijay Kumar", dist: "Muzaffarpur", cat: "Fruits", price: 380, unit: "1kg", em: "🍈", gi: true, rat: "4.7", rev: 184, bg: "#F0FFF4", desc: "The world-famous GI-tagged Shahi Litchi from Muzaffarpur. Dispatched within 12 hours of harvest." },
  { id: 5, name: "Silao Khaja", seller: "Deepak Halwai", dist: "Nalanda", cat: "Sweets", price: 250, unit: "500g", em: "🍭", gi: true, rat: "4.6", rev: 77, bg: "#FFF8E8", desc: "The legendary flaky sweet from Silao, made from refined flour, sugar and pure ghee using a century-old recipe." },
  { id: 6, name: "Katarni Rice", seller: "Manoj Sharma", dist: "Bhojpur", cat: "Food & Agri", price: 160, unit: "1kg", em: "🍚", gi: true, rat: "4.8", rev: 113, bg: "#FAFFF4", desc: "The aromatic GI-tagged Katarni rice — known for its distinct fragrance, slim grain and soft texture." },
  { id: 7, name: "Jardalu Mango", seller: "Ramesh Yadav", dist: "Bhagalpur", cat: "Fruits", price: 420, unit: "1kg", em: "🥭", gi: true, rat: "4.9", rev: 91, bg: "#FFF8E8", desc: "The royal GI-tagged Jardalu mango of Bhagalpur — celebrated for its distinct sweet taste and creamy texture." },
  { id: 8, name: "Madhubani Hand-Painted Dupatta", seller: "Rekha Devi", dist: "Madhubani", cat: "Textiles", price: 950, unit: "piece", em: "🎀", gi: false, rat: "4.7", rev: 34, bg: "#FFF0F5", desc: "Cotton dupatta hand-painted with traditional Madhubani motifs using eco-friendly natural colors." },
  { id: 9, name: "Bhagalpur Mango Pickle", seller: "Meena Devi", dist: "Bhagalpur", cat: "Food & Agri", price: 220, unit: "500g", em: "🫙", gi: false, rat: "4.5", rev: 58, bg: "#FFF8E8", desc: "Traditional mango pickle made from Jardalu mangoes, hand-crafted using a generations-old recipe." },
  { id: 10, name: "Tikuli Art Wall Piece", seller: "Arvind Kumar", dist: "Patna", cat: "Handicrafts", price: 680, unit: "piece", em: "🖼️", gi: false, rat: "4.6", rev: 29, bg: "#FFF4E8", desc: "Traditional Bihari Tikuli art wall piece with intricate geometric patterns and floral motifs." },
  { id: 11, name: "Shahi Litchi Juice", seller: "Vijay Kumar", dist: "Muzaffarpur", cat: "Sweets", price: 180, unit: "1L", em: "🧃", gi: false, rat: "4.4", rev: 43, bg: "#F0FFF4", desc: "Pure cold-pressed juice from GI-tagged Shahi Litchi. No added sugar, no preservatives." },
  { id: 12, name: "Sikki Grass Basket", seller: "Champa Devi", dist: "Sitamarhi", cat: "Handicrafts", price: 450, unit: "piece", em: "🧺", gi: false, rat: "4.8", rev: 67, bg: "#FAFFF4", desc: "Handwoven basket made from Sikki grass — a traditional Bihar craft practiced by women artisans." },
];

const CATEGORIES = ["All", "Food & Agri", "Handicrafts", "Textiles", "Sweets", "Fruits"];

const CATEGORY_COUNTS = {
  "All": 281, "Food & Agri": 84, "Handicrafts": 62,
  "Textiles": 38, "Sweets": 47, "Fruits": 21,
};

function ProductCard({ p }) {
  return (
    <Link href={`/shop/${p.id}`} style={{ textDecoration: 'none' }}>
      <div
        style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column', transition: 'all 0.25s', height: '100%' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#F5A06A'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(200,90,8,0.13)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8DDD4'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
      >
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 170, background: p.bg, fontSize: 64 }}>
          {p.gi && <span style={{ position: 'absolute', top: 10, left: 10, background: '#9A720A', color: '#fff', fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 5 }}>🏅 GI Tag</span>}
          <button
            onClick={e => e.preventDefault()}
            style={{ position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: '50%', background: '#fff', border: '1px solid #E8DDD4', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >🤍</button>
          {p.em}
        </div>
        <div style={{ padding: '16px 16px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: '#8C7B6E' }}>📍 {p.dist}</span>
            <span style={{ fontSize: 11, color: '#9A720A', fontWeight: 700 }}>★ {p.rat} ({p.rev})</span>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1410', lineHeight: 1.3, marginBottom: 3 }}>{p.name}</div>
          <div style={{ fontSize: 11, color: '#8C7B6E', marginBottom: 12 }}>by {p.seller}</div>
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
            <div>
              <span style={{ fontSize: 19, fontWeight: 800, color: '#C85A08' }}>₹{p.price.toLocaleString()}</span>
              <span style={{ fontSize: 10, color: '#C0B0A0' }}> /{p.unit}</span>
            </div>
            <button
              onClick={e => e.preventDefault()}
              style={{ background: '#C85A08', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function ShopPage() {
  const [activeCat, setActiveCat] = useState('All');
  const [giOnly, setGiOnly] = useState(false);
  const [sort, setSort] = useState('Featured');

  const filtered = ALL_PRODUCTS
    .filter(p => activeCat === 'All' || p.cat === activeCat)
    .filter(p => !giOnly || p.gi);

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'Price: Low to High') return a.price - b.price;
    if (sort === 'Price: High to Low') return b.price - a.price;
    if (sort === 'Best Rated') return parseFloat(b.rat) - parseFloat(a.rat);
    return 0;
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '230px 1fr', minHeight: '80vh' }}>

      {/* ── SIDEBAR ── */}
      <aside style={{ background: '#fff', borderRight: '1.5px solid #E8DDD4', padding: '28px 18px', position: 'sticky', top: 64, height: 'calc(100vh - 64px)', overflowY: 'auto' }}>

        {/* Categories */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#8C7B6E', marginBottom: 12 }}>Categories</div>
          {CATEGORIES.map(cat => (
            <div
              key={cat}
              onClick={() => setActiveCat(cat)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 8, cursor: 'pointer', marginBottom: 2, background: activeCat === cat ? '#FFF4EC' : 'transparent', color: activeCat === cat ? '#C85A08' : '#4A3F35', transition: 'all 0.18s', }}
            >
              <span style={{ fontSize: 13, fontWeight: 500 }}>{cat === 'All' ? 'All Products' : cat}</span>
              <span style={{ fontSize: 10, background: activeCat === cat ? 'rgba(200,90,8,0.13)' : '#F5EEE6', color: activeCat === cat ? '#C85A08' : '#8C7B6E', padding: '2px 7px', borderRadius: 20 }}>
                {CATEGORY_COUNTS[cat]}
              </span>
            </div>
          ))}
        </div>

        {/* District */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#8C7B6E', marginBottom: 12 }}>District</div>
          {["Muzaffarpur", "Darbhanga", "Bhagalpur", "Madhubani", "Nalanda", "Patna"].map(d => (
            <div key={d} style={{ padding: '8px 10px', borderRadius: 8, cursor: 'pointer', marginBottom: 2, fontSize: 13, fontWeight: 500, color: '#4A3F35', transition: 'all 0.18s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#FFF4EC'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >{d}</div>
          ))}
        </div>

        {/* Price Range */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#8C7B6E', marginBottom: 12 }}>Price Range</div>
          <div style={{ display: 'flex', gap: 7, marginBottom: 9 }}>
            <input placeholder="Min ₹" style={{ flex: 1, padding: '8px 10px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 12, fontFamily: 'inherit', outline: 'none', background: '#FFFCF8' }} />
            <input placeholder="Max ₹" style={{ flex: 1, padding: '8px 10px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 12, fontFamily: 'inherit', outline: 'none', background: '#FFFCF8' }} />
          </div>
          <button style={{ width: '100%', padding: 8, background: '#FFF4EC', color: '#C85A08', border: '1.5px solid #FFE8D4', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            Apply Filter
          </button>
        </div>

        {/* Certification */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#8C7B6E', marginBottom: 12 }}>Certification</div>
          {[["GI Tag Certified", giOnly, () => setGiOnly(!giOnly)], ["Organic Certified", false, () => {}], ["Handmade", false, () => {}]].map(([label, checked, toggle]) => (
            <label key={label} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#4A3F35', cursor: 'pointer', padding: '5px 0' }}>
              <input type="checkbox" checked={checked} onChange={toggle} style={{ accentColor: '#C85A08' }} />
              {label}
            </label>
          ))}
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div style={{ padding: '28px 36px' }}>

        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 18, borderBottom: '1px solid #E8DDD4' }}>
          <div style={{ fontSize: 13, color: '#8C7B6E' }}>
            <strong style={{ color: '#1A1410' }}>{sorted.length}</strong> products found
            {activeCat !== 'All' && <span> in <strong style={{ color: '#C85A08' }}>{activeCat}</strong></span>}
          </div>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{ padding: '8px 13px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 12, fontFamily: 'inherit', background: '#fff', color: '#1A1410', outline: 'none', cursor: 'pointer' }}
          >
            <option>Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Best Rated</option>
          </select>
        </div>

        {/* Product Grid */}
        {sorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontSize: 22, color: '#1A1410', marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>No products found</h3>
            <p style={{ fontSize: 14, color: '#8C7B6E' }}>Try adjusting your filters</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {sorted.map(p => <ProductCard key={p.id} p={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}