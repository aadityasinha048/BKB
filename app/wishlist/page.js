'use client';

import { useState } from 'react';
import Link from 'next/link';

const WISHLIST_ITEMS = [
  { id: 1, name: "Premium Makhana (Fox Nuts)", seller: "Ram Prasad", dist: "Darbhanga", price: 480, unit: "500g", em: "🌰", gi: true, rat: "4.8", bg: "#FFF8E8" },
  { id: 2, name: "Madhubani Painting — Fish Motif", seller: "Sunita Devi", dist: "Madhubani", price: 1200, unit: "piece", em: "🎨", gi: true, rat: "5.0", bg: "#FFF0F5" },
  { id: 7, name: "Jardalu Mango", seller: "Ramesh Yadav", dist: "Bhagalpur", price: 420, unit: "1kg", em: "🥭", gi: true, rat: "4.9", bg: "#FFF8E8" },
  { id: 3, name: "Bhagalpuri Silk Saree", seller: "Md. Arshad", dist: "Bhagalpur", price: 3800, unit: "piece", em: "🧣", gi: true, rat: "4.9", bg: "#F0F4FF" },
];

export default function WishlistPage() {
  const [items, setItems] = useState(WISHLIST_ITEMS);

  const remove = (id) => setItems(i => i.filter(x => x.id !== id));

  return (
    <div style={{ background: '#FFFCF8', minHeight: '80vh' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E8DDD4', padding: '28px 60px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#C85A08', marginBottom: 6 }}>Saved Items</div>
        <h1 style={{ fontSize: 34, color: '#1A1410', fontFamily: "'Playfair Display', serif" }}>My Wishlist ❤️</h1>
      </div>

      <div style={{ padding: '36px 60px' }}>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🤍</div>
            <h2 style={{ fontSize: 26, color: '#1A1410', marginBottom: 10, fontFamily: "'Playfair Display', serif" }}>Your wishlist is empty</h2>
            <p style={{ fontSize: 15, color: '#8C7B6E', marginBottom: 24 }}>Save products you love and come back to them anytime.</p>
            <Link href="/shop">
              <button style={{ padding: '13px 28px', background: '#C85A08', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                Explore Products →
              </button>
            </Link>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 14, color: '#8C7B6E', marginBottom: 28 }}>{items.length} saved products</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22 }}>
              {items.map(p => (
                <div key={p.id} style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.25s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#F5A06A'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(200,90,8,0.13)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8DDD4'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 170, background: p.bg, fontSize: 64 }}>
                    {p.gi && <span style={{ position: 'absolute', top: 10, left: 10, background: '#9A720A', color: '#fff', fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 5 }}>🏅 GI Tag</span>}
                    <button onClick={() => remove(p.id)} style={{ position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: '50%', background: '#fff', border: '1px solid #E8DDD4', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>❤️</button>
                    {p.em}
                  </div>
                  <div style={{ padding: '15px 16px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: 11, color: '#8C7B6E', marginBottom: 4 }}>📍 {p.dist} &nbsp;·&nbsp; ★ {p.rat}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1410', lineHeight: 1.3, marginBottom: 3 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: '#8C7B6E', marginBottom: 14 }}>by {p.seller}</div>
                    <div style={{ marginTop: 'auto' }}>
                      <div style={{ fontSize: 19, fontWeight: 800, color: '#C85A08', marginBottom: 10 }}>₹{p.price.toLocaleString()} <span style={{ fontSize: 10, color: '#C0B0A0', fontWeight: 400 }}>/{p.unit}</span></div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <Link href={`/shop/${p.id}`} style={{ textDecoration: 'none' }}>
                          <button style={{ width: '100%', padding: '9px', background: '#FFF4EC', color: '#C85A08', border: '1.5px solid #FFE8D4', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>View</button>
                        </Link>
                        <button style={{ padding: '9px', background: '#C85A08', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Add to Cart</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}