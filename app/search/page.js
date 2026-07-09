'use client';

import { useState, useEffect, Suspense } from 'react';
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
  const [filter, setFilter] = useState('All');
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProductsList(data.products);
      }
    } catch (err) {
      console.error('Error fetching search products:', err);
    } finally {
      setLoading(false);
    }
  };

  const results = productsList.filter(p =>
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

  const filtered = sorted.filter(p => {
    if (filter === 'GI Tag Only') return p.gi;
    if (filter === 'Under ₹500') return p.price < 500;
    if (filter === 'Under ₹1000') return p.price < 1000;
    return true;
  });

  return (
    <div style={{ background: '#fff', minHeight: '80vh' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E1DC', padding: '28px 60px' }}>
        <div style={{ fontSize: 13, color: '#7A7067', marginBottom: 6 }}>
          Search results for
        </div>
        <h1 style={{ fontSize: 32, color: '#1A1410', fontFamily: "'Playfair Display', serif" }}>
          "{query}"
        </h1>
        <div style={{ fontSize: 13, color: '#7A7067', marginTop: 6 }}>
          {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
        </div>
      </div>

      <div style={{ padding: '32px 60px' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['All', 'GI Tag Only', 'Under ₹500', 'Under ₹1000'].map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f)}
                style={{
                  padding: '7px 16px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  border: '1px solid #E5E1DC',
                  background: f === filter ? '#1B6B3A' : '#fff',
                  color: f === filter ? '#fff' : '#3D3730',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s'
                }}
              >
                {f}
              </button>
            ))}
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '8px 13px', border: '1.5px solid #E5E1DC', borderRadius: 8, fontSize: 12, fontFamily: 'inherit', background: '#fff', color: '#1A1410', outline: 'none', cursor: 'pointer' }}>
            <option>Relevance</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Best Rated</option>
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: 15, color: '#7A7067', fontWeight: 600 }}>Searching marketplace products...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
            <h2 style={{ fontSize: 26, color: '#1A1410', marginBottom: 10, fontFamily: "'Playfair Display', serif" }}>No results found</h2>
            <p style={{ fontSize: 15, color: '#7A7067', marginBottom: 24 }}>Try adjusting your filters or search keywords.</p>
            <button onClick={() => setFilter('All')} style={{ padding: '13px 28px', background: '#1B6B3A', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22 }}>
            {filtered.map(p => (
              <SearchProductCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SearchProductCard({ p }) {
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
      <div style={{ background: '#fff', border: '1px solid #E5E1DC', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.25s', height: '100%' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#1B6B3A'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(27,107,58,0.13)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E1DC'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
      >
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 160, background: p.bg, overflow: 'hidden' }}>
          {p.gi && <span style={{ position: 'absolute', top: 10, left: 10, background: '#B8860B', color: '#fff', fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 5, zIndex: 1 }}>🏅 GI Tag</span>}
          <img 
            src={p.imgSrc || `/images/products/prod_${p.id}.png`} 
            alt={p.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>
        <div style={{ padding: '14px 15px 13px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 11, color: '#7A7067', marginBottom: 3 }}>📍 {p.dist} · ★ {p.rat || '4.8'}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1410', lineHeight: 1.3, marginBottom: 2 }}>{p.name}</div>
          <div style={{ fontSize: 11, color: '#7A7067', marginBottom: 10 }}>by {p.seller}</div>
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#1A1410' }}>₹{p.price.toLocaleString()}</span>
            <button onClick={handleAddToCart} style={{ background: '#1B6B3A', color: '#fff', border: 'none', borderRadius: 7, padding: '7px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
              {added ? '✓ Added' : 'Add +'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ padding: '80px 60px', textAlign: 'center', fontSize: 16, color: '#7A7067' }}>Searching...</div>}>
      <SearchContent />
    </Suspense>
  );
}