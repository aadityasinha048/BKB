'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Leaf, Info, Award, Heart, ShoppingBag } from 'lucide-react';

const CATEGORIES = ["All", "Food & Agri", "Handicrafts", "Textiles", "Sweets", "Fruits"];

const CATEGORY_COUNTS = {
  "All": 281, "Food & Agri": 84, "Handicrafts": 62,
  "Textiles": 38, "Sweets": 47, "Fruits": 21,
};

const CATEGORY_BANNERS = {
  "All": {
    title: "Support Bihar's Grassroots Farmers & Weavers",
    subtitle: "सीधा खेत और शिल्पकारों के घरों से",
    desc: "Every purchase directly supports rural families in Bihar. We ensure no middleman commission cuts, allowing producers to keep 95% of their hard-earned revenue. हर खरीद गाँव की समृद्धि में योगदान है।",
    fact: "Over 800+ families across all 38 districts of Bihar are directly connected to our marketplace.",
    img: "/images/about/team_field_1.jpg",
    bgColor: "linear-gradient(135deg, #0D3B1E 0%, #1B6B3A 100%)",
    textColor: "#ffffff",
    accentColor: "#A8E6C3",
    icon: Leaf
  },
  "Food & Agri": {
    title: "Bihar's Pure Agricultural Wealth",
    subtitle: "मिट्टी की खुशबू, शुद्ध स्वाद",
    desc: "From the fertile floodplains of Darbhanga comes the world-famous GI-tagged Mithila Makhana, hand-harvested by local fishermen. Fragrant Katarni Rice from Bhojpur is nurtured with traditional organic practices.",
    fact: "Mithila Makhana is rich in protein and antioxidants, harvested through an ancient, grueling manual process of seed collection from pond beds.",
    img: "/images/banners/food_agri_banner.png",
    bgColor: "linear-gradient(135deg, #F0FAF3 0%, #E8F5EC 100%)",
    textColor: "#1A1410",
    accentColor: "#1B6B3A",
    icon: Leaf
  },
  "Handicrafts": {
    title: "Empowering Madhubani Women Artisans",
    subtitle: "हाथों का हुनर, सदियों की परंपरा",
    desc: "Each Madhubani painting tells a story of mythological folklore and nature. Traditionally painted using fingers, twigs, and matchsticks with natural plant-based dyes.",
    fact: "Madhubani art dates back to the Ramayana era. By buying directly, you ensure these women receive the true value of weeks of meticulous handcrafting.",
    img: "/images/banners/handicrafts_banner.png",
    bgColor: "linear-gradient(135deg, #FFF4EC 0%, #FFF0E4 100%)",
    textColor: "#1A1410",
    accentColor: "#E87B24",
    icon: Award
  },
  "Textiles": {
    title: "The Handloom Weavers of Bhagalpur",
    subtitle: "भागलपुरी सिल्क — ताने-बाने का जादू",
    desc: "Bhagalpur is known as the 'Silk City'. Traditional weavers use wooden handlooms to weave Tussar Silk, celebrated for its unique texture and natural golden sheen.",
    fact: "A single Bhagalpuri Tussar silk saree takes 3 to 4 days of continuous handloom weaving by fourth-generation weavers.",
    img: "/images/banners/textiles_banner.png",
    bgColor: "linear-gradient(135deg, #F0F4FF 0%, #EAF0FF 100%)",
    textColor: "#1A1410",
    accentColor: "#3060CC",
    icon: ShoppingBag
  },
  "Sweets": {
    title: "The Heritage Sweet Makers of Bihar",
    subtitle: "सिलाव का खाजा — मिठास का इतिहास",
    desc: "Silao Khaja is a multi-layered crisp sweet preparation from Nalanda district. Nurtured by local halwais who have preserved this recipe for centuries.",
    fact: "Silao Khaja received its GI Tag because of its unique 52 distinct layers, prepared using local water from heritage wells in Nalanda.",
    img: "/images/banners/sweets_banner.png",
    bgColor: "linear-gradient(135deg, #FEF8E0 0%, #FFF0CC 100%)",
    textColor: "#1A1410",
    accentColor: "#B8860B",
    icon: Heart
  },
  "Fruits": {
    title: "Muzaffarpur's Celebrated Orchards",
    subtitle: "शाही लीची — स्वाद और सुगंध",
    desc: "Nurtured by the unique climate and soil of Muzaffarpur, the Shahi Litchi is famous for its sweet, juicy pulp and signature aroma.",
    fact: "Shahi Litchi received its GI Tag in 2018. We pick them at dawn and package them with temperature-control wraps to deliver fresh across India.",
    img: "/images/banners/fruits_banner.png",
    bgColor: "linear-gradient(135deg, #FFF0F0 0%, #FFE5E5 100%)",
    textColor: "#1A1410",
    accentColor: "#C0392B",
    icon: Award
  }
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
    if (p.status === 'out_of_stock' || p.outOfStock) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const isOutOfStock = p.status === 'out_of_stock' || p.outOfStock;

  return (
    <Link href={`/shop/${p.id}`} style={{ textDecoration: 'none' }}>
      <div
        style={{ background: '#fff', border: '1.5px solid #E5E1DC', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column', transition: 'all 0.25s', height: '100%', opacity: isOutOfStock ? 0.85 : 1 }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#1B6B3A'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(27,107,58,0.13)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E1DC'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
      >
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 170, background: p.bg, overflow: 'hidden' }}>
          {p.gi && <span style={{ position: 'absolute', top: 10, left: 10, background: '#B8860B', color: '#fff', fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 5, zIndex: 1 }}>GI Tag</span>}
          {isOutOfStock && <span style={{ position: 'absolute', top: 10, left: p.gi ? 72 : 10, background: '#C85A08', color: '#fff', fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 5, zIndex: 1 }}>Out of Stock</span>}
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); }}
            style={{ position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: '50%', background: '#fff', border: '1px solid #E5E1DC', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}
          ><Heart size={14} color="#6B5C50" /></button>
          <img 
            src={p.imgSrc || `/images/products/prod_${p.id}.png`} 
            alt={p.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>
        <div style={{ padding: '16px 16px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: '#7A7067' }}>{p.dist}</span>
            <span style={{ fontSize: 11, color: '#B8860B', fontWeight: 700 }}>★ {p.rat} ({p.rev})</span>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1410', lineHeight: 1.3, marginBottom: 3 }}>{p.name}</div>
          <div style={{ fontSize: 11, color: '#7A7067', marginBottom: 12 }}>by {p.seller}</div>
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
            <div>
              <span style={{ fontSize: 19, fontWeight: 800, color: '#1A1410' }}>₹{p.price.toLocaleString()}</span>
              <span style={{ fontSize: 10, color: '#B0A598' }}> /{p.unit}</span>
            </div>
            {isOutOfStock ? (
              <button
                disabled
                onClick={e => { e.preventDefault(); e.stopPropagation(); }}
                style={{ background: '#F5EEE6', color: '#8C7B6E', border: '1px solid #E8DDD4', borderRadius: 8, padding: '8px 12px', fontSize: 11, fontWeight: 700, cursor: 'not-allowed', whiteSpace: 'nowrap', fontFamily: 'inherit' }}
              >
                Out of Stock
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                style={{ background: '#1B6B3A', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' }}
              >
                {added ? '✓ Added' : 'Add to Cart'}
              </button>
            )}
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

        {/* Dynamic Educational Banner */}
        {(() => {
          const banner = CATEGORY_BANNERS[activeCat];
          if (!banner) return null;
          const BannerIcon = banner.icon;
          return (
            <div
              key={activeCat}
              className="hero-text-animate"
              style={{
                background: banner.bgColor,
                borderRadius: 20,
                padding: '32px 36px',
                marginBottom: 28,
                color: banner.textColor,
                display: 'grid',
                gridTemplateColumns: '1.4fr 1fr',
                gap: 32,
                alignItems: 'center',
                boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
                border: activeCat === 'All' ? 'none' : `1.5px solid ${banner.accentColor}25`,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Subtle background overlay circles */}
              <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />
              
              <div style={{ zIndex: 1 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: activeCat === 'All' ? 'rgba(255,255,255,0.15)' : `${banner.accentColor}15`, border: `1px solid ${activeCat === 'All' ? 'rgba(255,255,255,0.25)' : `${banner.accentColor}25`}`, borderRadius: 40, padding: '4px 12px', fontSize: 10, fontWeight: 700, color: activeCat === 'All' ? '#A8E6C3' : banner.accentColor, marginBottom: 12 }}>
                  <BannerIcon size={12} />
                  <span>{banner.subtitle}</span>
                </div>
                <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8, fontFamily: "'Playfair Display', serif", color: activeCat === 'All' ? '#fff' : '#1A1410' }}>
                  {banner.title}
                </h2>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: activeCat === 'All' ? 'rgba(255,255,255,0.85)' : '#4A3F35', marginBottom: 18, maxWidth: 540 }}>
                  {banner.desc}
                </p>
                
                {/* Educational / Fact Box */}
                <div style={{ background: activeCat === 'All' ? 'rgba(255,255,255,0.08)' : '#ffffff', border: activeCat === 'All' ? '1px solid rgba(255,255,255,0.15)' : `1px solid ${banner.accentColor}25`, borderRadius: 12, padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: activeCat === 'All' ? 'rgba(255,255,255,0.15)' : `${banner.accentColor}12`, display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    <Info size={14} color={activeCat === 'All' ? '#fff' : banner.accentColor} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: activeCat === 'All' ? '#A8E6C3' : banner.accentColor, marginBottom: 2 }}>Did you know?</div>
                    <div style={{ fontSize: 12, lineHeight: 1.5, color: activeCat === 'All' ? 'rgba(255,255,255,0.8)' : '#5C544C' }}>{banner.fact}</div>
                  </div>
                </div>
              </div>

              {/* Right column: Image with zoom hover effect */}
              <div style={{ display: 'flex', justifyContent: 'center', zIndex: 1 }}>
                <div style={{ width: 200, height: 200, borderRadius: '50%', overflow: 'hidden', border: `4px solid ${activeCat === 'All' ? 'rgba(255,255,255,0.15)' : '#ffffff'}`, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
                  <img
                    className="hero-img-zoom"
                    src={banner.img}
                    alt={banner.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>
          );
        })()}

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