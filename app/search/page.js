'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const ALL_PRODUCTS = [
  { id: 1, name: "Premium Makhana (Fox Nuts)", seller: "Ram Prasad", dist: "Darbhanga", cat: "Food & Agri", price: 480, unit: "500g", em: "🌰", gi: true, rat: "4.8", rev: 96, bg: "#FFF8E8" },
  { id: 2, name: "Madhubani Painting — Fish Motif", seller: "Sunita Devi", dist: "Madhubani", cat: "Handicrafts", price: 1200, unit: "piece", em: "🎨", gi: true, rat: "5.0", rev: 48, bg: "#FFF0F5" },
  { id: 3, name: "Bhagalpuri Silk Saree", seller: "Md. Arshad", dist: "Bhagalpur", cat: "Textiles", price: 3800, unit: "piece", em: "🧣", gi: true, rat: "4.9", rev: 62, bg: "#F0F4FF" },
  { id: 4, name: "Shahi Litchi — Fresh", seller: "Vijay Kumar", dist: "Muzaffarpur", cat: "Fruits", price: 380, unit: "1kg", em: "🍈", gi: true, rat: "4.7", rev: 184, bg: "#F0FFF4" },
  { id: 5, name: "Silao Khaja", seller: "Deepak Halwai", dist: "Nalanda", cat: "Sweets", price: 250, unit: "500g", em: "🍭", gi: true, rat: "4.6", rev: 77, bg: "#FFF8E8" },
  { id: 6, name: "Katarni Rice", seller: "Manoj Sharma", dist: "Bhojpur", cat: "Food & Agri", price: 160, unit: "1kg", em: "🍚", gi: true, rat: "4.8", rev: 113, bg: "#FAFFF4" },
  { id: 7, name: "Jardalu Mango", seller: "Ramesh Yadav", dist: "Bhagalpur", cat: "Fruits", price: 420, unit: "1kg", em: "🥭", gi: true, rat: "4.9", rev: 91, bg: "#FFF8E8" },
  { id: 8, name: "Madhubani Hand-Painted Dupatta", seller: "Rekha Devi", dist: "Madhubani", cat: "Textiles", price: 950, unit: "piece", em: "🎀", gi: false, rat: "4.7", rev: 34, bg: "#FFF0F5" },
  { id: 9, name: "Bhagalpur Mango Pickle", seller: "Meena Devi", dist: "Bhagalpur", cat: "Food & Agri", price: 220, unit: "500g", em: "🫙", gi: false, rat: "4.5", rev: 58, bg: "#FFF8E8" },
  { id: 10, name: "Tikuli Art Wall Piece", seller: "Arvind Kumar", dist: "Patna", cat: "Handicrafts", price: 680, unit: "piece", em: "🖼️", gi: false, rat: "4.6", rev: 29, bg: "#FFF4E8" },
  { id: 11, name: "Shahi Litchi Juice", seller: "Vijay Kumar", dist: "Muzaffarpur", cat: "Sweets", price: 180, unit: "1L", em: "🧃", gi: false, rat: "4.4", rev: 43, bg: "#F0FFF4" },
  { id: 12, name: "Sikki Grass Basket", seller: "Champa Devi", dist: "Sitamarhi", cat: "Handicrafts", price: 450, unit: "piece", em: "🧺", gi: false, rat: "4.8", rev: 67, bg: "#FAFFF4" },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [sort, setSort] = useState('Relevance');

  const results = ALL_PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.dist.toLowerCase().includes(query.toLowerCase()) ||
    p.cat.toLowerCase().includes(query.toLowerCase()) ||
    p.seller.toLowerCase().includes(query.toLowerCase())
  );

  const sorted = [...results].sort((a, b) => {
    if (sort === 'Price: Low to High') return a.price - b.price;
    if (sort === 'Price: High to Low') return b.price - a.price;
    if (sort === 'Best Rated') return parseFloat(b.rat) - parseFloat(a.rat);
    return 0;
  });

  return (
    <div style={{ background: '#FFFCF8', minHeight: '80vh' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E8DDD4', padding: '28px 60px' }}>
        <div style={{ fontSize: 13, color: '#8C7B6E', marginBottom: 6 }}>
          Search results for
        </div>
        <h1 style={{ fontSize: 32, color: '#1A1410', fontFamily: "'Playfair Display', serif" }}>
          "{query}"
        </h1>
        <div style={{ fontSize: 13, color: '#8C7B6E', marginTop: 6 }}>
          {sorted.length} product{sorted.length !== 1 ? 's' : ''} found
        </div>
      </div>

      <div style={{ padding: '32px 60px' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['All', 'GI Tag Only', 'Under ₹500', 'Under ₹1000'].map(f => (
              <button key={f} style={{ padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: '1.5px solid #E8DDD4', background: f === 'All' ? '#C85A08' : '#fff', color: f === 'All' ? '#fff' : '#4A3F35', cursor: 'pointer', fontFamily: 'inherit' }}>
                {f}
              </button>
            ))}
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '8px 13px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 12, fontFamily: 'inherit', background: '#fff', color: '#1A1410', outline: 'none', cursor: 'pointer' }}>
            <option>Relevance</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Best Rated</option>
          </select>
        </div>

        {sorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
            <h2 style={{ fontSize: 26, color: '#1A1410', marginBottom: 10, fontFamily: "'Playfair Display', serif" }}>No results found</h2>
            <p style={{ fontSize: 15, color: '#8C7B6E', marginBottom: 24 }}>Try searching for makhana, madhubani, silk, litchi...</p>
            <Link href="/shop">
              <button style={{ padding: '13px 28px', background: '#C85A08', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                Browse All Products →
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22 }}>
            {sorted.map(p => (
              <Link key={p.id} href={`/shop/${p.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.25s', height: '100%' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#F5A06A'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(200,90,8,0.13)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8DDD4'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 160, background: p.bg, fontSize: 60 }}>
                    {p.gi && <span style={{ position: 'absolute', top: 10, left: 10, background: '#9A720A', color: '#fff', fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 5 }}>🏅 GI Tag</span>}
                    {p.em}
                  </div>
                  <div style={{ padding: '14px 15px 13px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: 11, color: '#8C7B6E', marginBottom: 3 }}>📍 {p.dist} · ★ {p.rat}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1410', lineHeight: 1.3, marginBottom: 2 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: '#8C7B6E', marginBottom: 10 }}>by {p.seller}</div>
                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: '#C85A08' }}>₹{p.price.toLocaleString()}</span>
                      <button onClick={e => e.preventDefault()} style={{ background: '#C85A08', color: '#fff', border: 'none', borderRadius: 7, padding: '7px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Add +</button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ padding: '80px 60px', textAlign: 'center', fontSize: 16, color: '#8C7B6E' }}>Searching...</div>}>
      <SearchContent />
    </Suspense>
  );
}