'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';



const CATEGORIES = ["All", "Food & Agri", "Handicrafts", "Textiles", "Sweets", "Fruits"];

const CATEGORY_COUNTS = {
  "All": 281, "Food & Agri": 84, "Handicrafts": 62,
  "Textiles": 38, "Sweets": 47, "Fruits": 21,
};

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
      <div
        style={{ background: '#fff', border: '1.5px solid #E5E1DC', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column', transition: 'all 0.25s', height: '100%' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#1B6B3A'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(27,107,58,0.13)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E1DC'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
      >
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 170, background: p.bg, overflow: 'hidden' }}>
          {p.gi && <span style={{ position: 'absolute', top: 10, left: 10, background: '#B8860B', color: '#fff', fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 5, zIndex: 1 }}>🏅 GI Tag</span>}
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); }}
            style={{ position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: '50%', background: '#fff', border: '1px solid #E5E1DC', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}
          >🤍</button>
          <img 
            src={p.imgSrc || `/images/products/prod_${p.id}.png`} 
            alt={p.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>
        <div style={{ padding: '16px 16px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: '#7A7067' }}>📍 {p.dist}</span>
            <span style={{ fontSize: 11, color: '#B8860B', fontWeight: 700 }}>★ {p.rat} ({p.rev})</span>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1410', lineHeight: 1.3, marginBottom: 3 }}>{p.name}</div>
          <div style={{ fontSize: 11, color: '#7A7067', marginBottom: 12 }}>by {p.seller}</div>
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
            <div>
              <span style={{ fontSize: 19, fontWeight: 800, color: '#1A1410' }}>₹{p.price.toLocaleString()}</span>
              <span style={{ fontSize: 10, color: '#B0A598' }}> /{p.unit}</span>
            </div>
            <button
              onClick={handleAddToCart}
              style={{ background: '#1B6B3A', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' }}
            >
              {added ? '✓ Added' : 'Add to Cart'}
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
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = productsList
    .filter(p => activeCat === 'All' || p.cat === activeCat)
    .filter(p => !giOnly || p.gi);

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'Price: Low to High') return a.price - b.price;
    if (sort === 'Price: High to Low') return b.price - a.price;
    if (sort === 'Best Rated') return parseFloat(b.rat) - parseFloat(a.rat);
    return 0;
  });

  return (
    <div className="shop-layout" style={{ display: 'grid', gridTemplateColumns: '230px 1fr', minHeight: '80vh' }}>

      {/* ── SIDEBAR ── */}
      <aside className="shop-sidebar" style={{ background: '#fff', borderRight: '1px solid #E5E1DC', padding: '28px 18px', position: 'sticky', top: 64, height: 'calc(100vh - 64px)', overflowY: 'auto' }}>

        {/* Categories */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#7A7067', marginBottom: 12 }}>Categories</div>
          {CATEGORIES.map(cat => (
            <div
              key={cat}
              onClick={() => setActiveCat(cat)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 8, cursor: 'pointer', marginBottom: 2, background: activeCat === cat ? '#E8F5EC' : 'transparent', color: activeCat === cat ? '#1B6B3A' : '#3D3730', transition: 'all 0.18s', }}
            >
              <span style={{ fontSize: 13, fontWeight: 500 }}>{cat === 'All' ? 'All Products' : cat}</span>
              <span style={{ fontSize: 10, background: activeCat === cat ? 'rgba(27,107,58,0.13)' : '#F2F0ED', color: activeCat === cat ? '#1B6B3A' : '#7A7067', padding: '2px 7px', borderRadius: 20 }}>
                {CATEGORY_COUNTS[cat]}
              </span>
            </div>
          ))}
        </div>

        {/* District */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#7A7067', marginBottom: 12 }}>District</div>
          {["Muzaffarpur", "Darbhanga", "Bhagalpur", "Madhubani", "Nalanda", "Patna"].map(d => (
            <div key={d} style={{ padding: '8px 10px', borderRadius: 8, cursor: 'pointer', marginBottom: 2, fontSize: 13, fontWeight: 500, color: '#3D3730', transition: 'all 0.18s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#E8F5EC'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >{d}</div>
          ))}
        </div>

        {/* Price Range */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#7A7067', marginBottom: 12 }}>Price Range</div>
          <div style={{ display: 'flex', gap: 7, marginBottom: 9 }}>
            <input placeholder="Min ₹" style={{ flex: 1, padding: '8px 10px', border: '1.5px solid #E5E1DC', borderRadius: 8, fontSize: 12, fontFamily: 'inherit', outline: 'none', background: '#FAFAFA' }} />
            <input placeholder="Max ₹" style={{ flex: 1, padding: '8px 10px', border: '1.5px solid #E5E1DC', borderRadius: 8, fontSize: 12, fontFamily: 'inherit', outline: 'none', background: '#FAFAFA' }} />
          </div>
          <button style={{ width: '100%', padding: 8, background: '#E8F5EC', color: '#1B6B3A', border: '1px solid #D0EBDA', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            Apply Filter
          </button>
        </div>

        {/* Certification */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#7A7067', marginBottom: 12 }}>Certification</div>
          {[["GI Tag Certified", giOnly, () => setGiOnly(!giOnly)], ["Organic Certified", false, () => {}], ["Handmade", false, () => {}]].map(([label, checked, toggle]) => (
            <label key={label} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#3D3730', cursor: 'pointer', padding: '5px 0' }}>
              <input type="checkbox" checked={checked} onChange={toggle} style={{ accentColor: '#1B6B3A' }} />
              {label}
            </label>
          ))}
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div style={{ padding: '28px 36px' }}>

        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 18, borderBottom: '1px solid #E5E1DC' }}>
          <div style={{ fontSize: 13, color: '#7A7067' }}>
            <strong style={{ color: '#1A1410' }}>{sorted.length}</strong> products found
            {activeCat !== 'All' && <span> in <strong style={{ color: '#1B6B3A' }}>{activeCat}</strong></span>}
          </div>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{ padding: '8px 13px', border: '1.5px solid #E5E1DC', borderRadius: 8, fontSize: 12, fontFamily: 'inherit', background: '#fff', color: '#1A1410', outline: 'none', cursor: 'pointer' }}
          >
            <option>Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Best Rated</option>
          </select>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <p style={{ fontSize: 15, color: '#8C7B6E', fontWeight: 600 }}>Loading marketplace listings...</p>
          </div>
        ) : sorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontSize: 22, color: '#1A1410', marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>No products found</h3>
            <p style={{ fontSize: 14, color: '#8C7B6E' }}>Try adjusting your filters</p>
          </div>
        ) : (
          <div className="shop-products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {sorted.map(p => <ProductCard key={p.id} p={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}