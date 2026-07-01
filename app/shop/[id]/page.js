'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const ALL_PRODUCTS = [
  { id: 1, name: "Premium Makhana (Fox Nuts)", seller: "Ram Prasad", dist: "Darbhanga", cat: "Food & Agri", price: 480, unit: "500g", em: "🌰", gi: true, rat: "4.8", rev: 96, bg: "#FFF8E8", desc: "Hand-picked lotus seeds from the pristine wetlands of Darbhanga. Sun-dried, roasted and packed fresh. Naturally rich in protein, calcium and antioxidants — a true Bihar superfood recognized globally.", tags: ["GI Tag Certified", "Naturally Organic", "High Protein", "Gluten Free", "Vegan"] },
  { id: 2, name: "Madhubani Painting — Fish Motif", seller: "Sunita Devi", dist: "Madhubani", cat: "Handicrafts", price: 1200, unit: "piece", em: "🎨", gi: true, rat: "5.0", rev: 48, bg: "#FFF0F5", desc: "An authentic Madhubani painting by master artist Sunita Devi, depicting the sacred fish motif symbolising prosperity. Painted with natural vegetable colors on handmade paper — every stroke following a 2,500-year-old tradition.", tags: ["GI Tag Certified", "100% Handmade", "Natural Colors", "Archival Paper"] },
  { id: 3, name: "Bhagalpuri Silk Saree", seller: "Md. Arshad", dist: "Bhagalpur", cat: "Textiles", price: 3800, unit: "piece", em: "🧣", gi: true, rat: "4.9", rev: 62, bg: "#F0F4FF", desc: "Authentic Tussar silk saree from the silk city of Bhagalpur, handwoven on traditional pit-looms by fourth-generation weavers. Each piece is entirely unique — the texture and sheen of genuine Bhagalpuri silk is unmatched.", tags: ["GI Tag Certified", "Handwoven", "Tussar Silk", "Heirloom Quality"] },
  { id: 4, name: "Shahi Litchi — Fresh", seller: "Vijay Kumar", dist: "Muzaffarpur", cat: "Fruits", price: 380, unit: "1kg", em: "🍈", gi: true, rat: "4.7", rev: 184, bg: "#F0FFF4", desc: "The world-famous GI-tagged Shahi Litchi from Muzaffarpur — unmatched in sweetness, fragrance and size. Dispatched within 12 hours of harvest for maximum freshness.", tags: ["GI Tag Certified", "Seasonal", "Freshly Harvested", "No Preservatives"] },
  { id: 5, name: "Silao Khaja", seller: "Deepak Halwai", dist: "Nalanda", cat: "Sweets", price: 250, unit: "500g", em: "🍭", gi: true, rat: "4.6", rev: 77, bg: "#FFF8E8", desc: "The legendary flaky sweet from Silao, on the ancient Rajgir-Patna route. Made from refined flour, sugar and pure ghee using a recipe passed down through generations.", tags: ["GI Tag Certified", "Traditional Recipe", "Pure Ghee"] },
  { id: 6, name: "Katarni Rice", seller: "Manoj Sharma", dist: "Bhojpur", cat: "Food & Agri", price: 160, unit: "1kg", em: "🍚", gi: true, rat: "4.8", rev: 113, bg: "#FAFFF4", desc: "The aromatic GI-tagged Katarni rice — known for its distinct fragrance, slim grain and soft texture. Grown using traditional, chemical-minimal farming.", tags: ["GI Tag Certified", "Aromatic", "Premium", "Traditional Farming"] },
  { id: 7, name: "Jardalu Mango", seller: "Ramesh Yadav", dist: "Bhagalpur", cat: "Fruits", price: 420, unit: "1kg", em: "🥭", gi: true, rat: "4.9", rev: 91, bg: "#FFF8E8", desc: "The royal GI-tagged Jardalu mango of Bhagalpur — celebrated for its distinct sweet taste, creamy texture and saffron-yellow color. Limited seasonal stock.", tags: ["GI Tag Certified", "Premium", "Seasonal", "Saffron Variety"] },
  { id: 8, name: "Madhubani Hand-Painted Dupatta", seller: "Rekha Devi", dist: "Madhubani", cat: "Textiles", price: 950, unit: "piece", em: "🎀", gi: false, rat: "4.7", rev: 34, bg: "#FFF0F5", desc: "A beautiful cotton dupatta hand-painted with traditional Madhubani motifs — peacocks, lotus flowers and geometric borders using eco-friendly natural colors.", tags: ["Handmade", "Natural Colors", "Cotton", "Folk Art"] },
  { id: 9, name: "Bhagalpur Mango Pickle", seller: "Meena Devi", dist: "Bhagalpur", cat: "Food & Agri", price: 220, unit: "500g", em: "🫙", gi: false, rat: "4.5", rev: 58, bg: "#FFF8E8", desc: "Traditional mango pickle made from Jardalu mangoes, hand-crafted using a generations-old recipe with mustard oil and Bihari spices.", tags: ["Traditional Recipe", "Handmade", "No Preservatives"] },
  { id: 10, name: "Tikuli Art Wall Piece", seller: "Arvind Kumar", dist: "Patna", cat: "Handicrafts", price: 680, unit: "piece", em: "🖼️", gi: false, rat: "4.6", rev: 29, bg: "#FFF4E8", desc: "Traditional Bihari Tikuli art wall piece showcasing intricate geometric patterns and floral motifs in vibrant colors.", tags: ["Handmade", "Traditional Art", "Wall Decor"] },
  { id: 11, name: "Shahi Litchi Juice", seller: "Vijay Kumar", dist: "Muzaffarpur", cat: "Sweets", price: 180, unit: "1L", em: "🧃", gi: false, rat: "4.4", rev: 43, bg: "#F0FFF4", desc: "Pure cold-pressed juice from GI-tagged Shahi Litchi. No added sugar, no preservatives. Bottled fresh during the season.", tags: ["No Preservatives", "100% Natural", "Cold Pressed"] },
  { id: 12, name: "Sikki Grass Basket", seller: "Champa Devi", dist: "Sitamarhi", cat: "Handicrafts", price: 450, unit: "piece", em: "🧺", gi: false, rat: "4.8", rev: 67, bg: "#FAFFF4", desc: "Handwoven basket made from Sikki grass — a traditional Bihar craft practiced by women artisans. Each basket is uniquely patterned and takes 2–3 days to weave.", tags: ["Handmade", "Eco-Friendly", "Traditional Craft"] },
];

export default function ProductDetailPage() {
  const params = useParams();
  const product = ALL_PRODUCTS.find(p => p.id === parseInt(params.id));
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 60px' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>😕</div>
        <h2 style={{ fontSize: 28, color: '#1A1410', marginBottom: 12, fontFamily: "'Playfair Display', serif" }}>Product not found</h2>
        <Link href="/shop">
          <button style={{ padding: '12px 24px', background: '#C85A08', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            Back to Shop
          </button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Related products
  const related = ALL_PRODUCTS.filter(p => p.cat === product.cat && p.id !== product.id).slice(0, 3);

  return (
    <div style={{ background: '#FFFCF8' }}>

      {/* ── BREADCRUMB ── */}
      <div style={{ padding: '20px 60px', borderBottom: '1px solid #E8DDD4', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#8C7B6E' }}>
          <Link href="/" style={{ color: '#8C7B6E', textDecoration: 'none' }}>Home</Link>
          <span>›</span>
          <Link href="/shop" style={{ color: '#8C7B6E', textDecoration: 'none' }}>Shop</Link>
          <span>›</span>
          <span style={{ color: '#1A1410', fontWeight: 500 }}>{product.name}</span>
        </div>
      </div>

      {/* ── MAIN DETAIL ── */}
      <div style={{ padding: '48px 60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>

        {/* Left — Image */}
        <div>
          <div style={{ background: product.bg, border: '1.5px solid #E8DDD4', borderRadius: 22, padding: '60px 40px', textAlign: 'center', fontSize: 140, lineHeight: 1, position: 'relative' }}>
            {product.gi && (
              <div style={{ position: 'absolute', top: 18, left: 18, background: '#9A720A', color: '#fff', fontSize: 11, fontWeight: 800, padding: '6px 12px', borderRadius: 8 }}>
                🏅 GI Tag Certified
              </div>
            )}
            {product.em}
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
            <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 12, padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#8C7B6E', marginBottom: 4 }}>Rating</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#9A720A' }}>★ {product.rat}</div>
              <div style={{ fontSize: 11, color: '#C0B0A0' }}>{product.rev} reviews</div>
            </div>
            <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 12, padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#8C7B6E', marginBottom: 4 }}>Ships from</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1410' }}>{product.dist}</div>
              <div style={{ fontSize: 11, color: '#C0B0A0' }}>Bihar, India</div>
            </div>
          </div>
        </div>

        {/* Right — Info */}
        <div>
          <h1 style={{ fontSize: 32, color: '#1A1410', lineHeight: 1.2, marginBottom: 14, fontFamily: "'Playfair Display', serif" }}>
            {product.name}
          </h1>

          {/* Seller Card */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#F5EEE6', borderRadius: 12, padding: '14px 16px', marginBottom: 22 }}>
            <div style={{ width: 46, height: 46, borderRadius: '50%', background: '#FFF4EC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>👨‍🌾</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1410' }}>{product.seller}</div>
              <div style={{ fontSize: 12, color: '#8C7B6E' }}>Verified Seller · {product.dist}, Bihar</div>
            </div>
            <div style={{ marginLeft: 'auto', background: '#EAF5F0', color: '#1A5C38', fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 20 }}>
              ✓ Verified
            </div>
          </div>

          {/* Price */}
          <div style={{ fontSize: 44, fontWeight: 800, color: '#C85A08', fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>
            ₹{product.price.toLocaleString()}
          </div>
          <div style={{ fontSize: 13, color: '#8C7B6E', marginTop: 4, marginBottom: 24 }}>
            per {product.unit} · Free delivery on orders above ₹500
          </div>

          {/* Description */}
          <p style={{ fontSize: 15, color: '#4A3F35', lineHeight: 1.8, marginBottom: 26, borderTop: '1px solid #E8DDD4', paddingTop: 22 }}>
            {product.desc}
          </p>

          {/* Quantity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 22 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#4A3F35' }}>Quantity</span>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #E8DDD4', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                style={{ background: 'none', border: 'none', padding: '10px 18px', fontSize: 20, color: '#4A3F35', cursor: 'pointer', fontFamily: 'inherit' }}
              >−</button>
              <span style={{ padding: '10px 22px', fontSize: 16, fontWeight: 800, borderLeft: '1px solid #E8DDD4', borderRight: '1px solid #E8DDD4', minWidth: 56, textAlign: 'center' }}>
                {qty}
              </span>
              <button
                onClick={() => setQty(q => Math.min(99, q + 1))}
                style={{ background: 'none', border: 'none', padding: '10px 18px', fontSize: 20, color: '#4A3F35', cursor: 'pointer', fontFamily: 'inherit' }}
              >+</button>
            </div>
            <span style={{ fontSize: 13, color: '#8C7B6E' }}>
              Total: <strong style={{ color: '#C85A08' }}>₹{(product.price * qty).toLocaleString()}</strong>
            </span>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 22 }}>
            <button
              onClick={handleAddToCart}
              style={{ padding: 15, borderRadius: 12, fontSize: 15, fontWeight: 700, border: '2px solid #C85A08', background: added ? '#C85A08' : '#FFF4EC', color: added ? '#fff' : '#C85A08', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
            >
              {added ? '✓ Added to Cart!' : '🛒 Add to Cart'}
            </button>
            <Link href="/cart" style={{ textDecoration: 'none' }}>
              <button
                onClick={handleAddToCart}
                style={{ width: '100%', padding: 15, borderRadius: 12, fontSize: 15, fontWeight: 700, border: '2px solid #1A5C38', background: '#1A5C38', color: '#fff', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
              >
                Buy Now →
              </button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', paddingTop: 16, borderTop: '1px solid #E8DDD4', marginBottom: 20 }}>
            {["✅ Verified Seller", "🚚 Pan-India Shipping", "💳 Secure Payment", "↩️ Easy Returns"].map(t => (
              <span key={t} style={{ fontSize: 12, color: '#8C7B6E', fontWeight: 600 }}>{t}</span>
            ))}
          </div>

          {/* Tags */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 10 }}>Product Tags</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {product.tags.map(t => (
                <span key={t} style={{ background: '#FFF4EC', color: '#9A4006', fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 40, border: '1px solid #FFE8D4' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── RELATED PRODUCTS ── */}
      {related.length > 0 && (
        <div style={{ padding: '48px 60px', background: '#FFF8F2', borderTop: '1px solid #E8DDD4' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#C85A08', marginBottom: 8 }}>More Like This</div>
          <h2 style={{ fontSize: 28, color: '#1A1410', marginBottom: 32, fontFamily: "'Playfair Display', serif" }}>Related Products</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {related.map(p => (
              <Link key={p.id} href={`/shop/${p.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.25s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#F5A06A'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8DDD4'; e.currentTarget.style.transform = 'none'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 150, background: p.bg, fontSize: 56 }}>{p.em}</div>
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1410', marginBottom: 4 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: '#8C7B6E', marginBottom: 8 }}>by {p.seller}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#C85A08' }}>₹{p.price.toLocaleString()} <span style={{ fontSize: 11, fontWeight: 400, color: '#C0B0A0' }}>/{p.unit}</span></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}