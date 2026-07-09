'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Star, Truck, ShieldCheck, RefreshCw, ShoppingCart, Check, ChevronLeft, ChevronRight, User } from 'lucide-react';

const REVIEWS_SAMPLE = [
  { name: "Rajan Kumar", loc: "Patna", date: "Jan 12, 2026", rating: 5, comment: "Absolutely fresh and premium quality. The texture and aroma is authentic Bihari taste! Highly recommended." },
  { name: "Preeti Sharma", loc: "Muzaffarpur", date: "Jan 08, 2026", rating: 5, comment: "Very fast delivery, packaging was robust. Will purchase again from this farmer." },
  { name: "Amit Singh", loc: "Delhi", date: "Dec 28, 2025", rating: 4, comment: "Excellent taste and very clean makhana. Standard packaging. 4 stars!" },
  { name: "Suresh Gupta", loc: "Patna", date: "Dec 20, 2025", rating: 5, comment: "Genuine GI-tagged quality. Direct from Darbhanga artisans, support local." }
];

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  // Carousel state
  const [activeImg, setActiveImg] = useState(0);

  // Tab State
  const [activeTab, setActiveTab] = useState('Specs');

  // Variant State
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  // "Also Buy" checkboxes state
  const [alsoBuySelected, setAlsoBuySelected] = useState([true, true]);

  const [sellerProfile, setSellerProfile] = useState(null);

  useEffect(() => {
    setSelectedVariantIndex(0);
    fetchProductDetail();
  }, [params.id]);

  useEffect(() => {
    if (product && product.sellerId) {
      fetchSellerProfile(product.sellerId);
    } else {
      setSellerProfile(null);
    }
  }, [product]);

  const fetchSellerProfile = async (sellerId) => {
    try {
      const res = await fetch(`/api/register-seller?sellerId=${sellerId}`);
      const data = await res.json();
      if (data.success) {
        setSellerProfile(data.seller);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProductDetail = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProductsList(data.products);
        const item = data.products.find(p => p.id === parseInt(params.id));
        setProduct(item || null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Automatic slide transition timer
  useEffect(() => {
    if (!product) return;
    const images = product.images && product.images.length > 0 
      ? product.images 
      : [product.imgSrc, '/images/products/prod_10.png', '/images/products/prod_11.png'];
      
    const timer = setInterval(() => {
      setActiveImg(prev => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [product]);

  const handleAddToCart = () => {
    const existing = localStorage.getItem('bkb_cart');
    let cartItems = [];
    try {
      cartItems = existing ? JSON.parse(existing) : [];
    } catch {
      cartItems = [];
    }

    const itemIndex = cartItems.findIndex(item => item.id === product.id && item.unit === currentVariant.weight);

    if (itemIndex > -1) {
      cartItems[itemIndex].qty += qty;
    } else {
      cartItems.push({
        id: product.id,
        name: product.name,
        seller: product.seller,
        dist: product.dist,
        price: currentVariant.price,
        unit: currentVariant.weight,
        imgSrc: product.imgSrc,
        bg: product.bg,
        qty: qty
      });
    }

    localStorage.setItem('bkb_cart', JSON.stringify(cartItems));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div style={{ background: '#FFFCF8', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: 16, color: '#8C7B6E', fontWeight: 600 }}>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 60px' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>😕</div>
        <h2 style={{ fontSize: 28, color: '#1A1410', marginBottom: 12, fontFamily: "'Playfair Display', serif" }}>Product not found</h2>
        <Link href="/shop">
          <button style={{ padding: '12px 24px', background: '#1B6B3A', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            Back to Shop
          </button>
        </Link>
      </div>
    );
  }

  // Variants setup
  const productVariants = product.variants && product.variants.length > 0
    ? product.variants
    : [{ weight: product.unit, price: product.price, stock: 100 }];

  const currentVariant = productVariants[selectedVariantIndex] || productVariants[0];

  // Alternates list for image carousel
  const carouselImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.imgSrc, '/images/products/prod_10.png', '/images/products/prod_11.png'];

  // Other sellers offering similar products
  const otherSellers = productsList.filter(p => {
    if (p.id === product.id) return false;
    const currentKeywords = product.name.toLowerCase().split(' ');
    const otherKeywords = p.name.toLowerCase().split(' ');
    const common = currentKeywords.filter(k => k.length > 3 && otherKeywords.includes(k));
    return p.cat === product.cat && common.length > 0;
  });

  // Related products
  const related = productsList.filter(p => p.cat === product.cat && p.id !== product.id).slice(0, 3);

  // Bundle suggestions for frequently bought together (excluding current product)
  const bundleItems = productsList.filter(p => p.id !== product.id).slice(0, 2);

  // Calculate bundle total price
  let bundleTotal = currentVariant.price * qty;
  if (alsoBuySelected[0] && bundleItems[0]) bundleTotal += bundleItems[0].price;
  if (alsoBuySelected[1] && bundleItems[1]) bundleTotal += bundleItems[1].price;

  const handleAddBundleToCart = () => {
    const existing = localStorage.getItem('bkb_cart');
    let cartItems = [];
    try {
      cartItems = existing ? JSON.parse(existing) : [];
    } catch {
      cartItems = [];
    }

    // Add main product
    const mainIndex = cartItems.findIndex(item => item.id === product.id && item.unit === currentVariant.weight);
    if (mainIndex > -1) {
      cartItems[mainIndex].qty += qty;
    } else {
      cartItems.push({
        id: product.id,
        name: product.name,
        seller: product.seller,
        dist: product.dist,
        price: currentVariant.price,
        unit: currentVariant.weight,
        imgSrc: product.imgSrc,
        bg: product.bg,
        qty: qty
      });
    }

    // Add selected bundle items
    bundleItems.forEach((item, idx) => {
      if (alsoBuySelected[idx]) {
        const bundleIndex = cartItems.findIndex(cItem => cItem.id === item.id);
        if (bundleIndex > -1) {
          cartItems[bundleIndex].qty += 1;
        } else {
          cartItems.push({
            id: item.id,
            name: item.name,
            seller: item.seller,
            dist: item.dist,
            price: item.price,
            unit: item.unit,
            imgSrc: item.imgSrc,
            bg: item.bg,
            qty: 1
          });
        }
      }
    });

    localStorage.setItem('bkb_cart', JSON.stringify(cartItems));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ background: '#FFFCF8', paddingBottom: 64 }}>
      
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

      {/* ── MAIN DETAIL CONTAINER ── */}
      <div style={{ padding: '36px 60px', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 48, alignItems: 'start' }}>
        
        {/* LEFT COLUMN: Image Carousel Slider */}
        <div>
          <div style={{ position: 'relative', background: product.bg, border: '1.5px solid #E8DDD4', borderRadius: 24, overflow: 'hidden', height: 440, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {product.gi && (
              <div style={{ position: 'absolute', top: 18, left: 18, background: '#9A720A', color: '#fff', fontSize: 11, fontWeight: 800, padding: '6px 12px', borderRadius: 8, zIndex: 1 }}>
                🏅 GI Tag Certified
              </div>
            )}

            {/* Slider Images */}
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              <img 
                src={carouselImages[activeImg]} 
                alt={`${product.name} - slide ${activeImg + 1}`} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.5s ease-in-out' }} 
              />
            </div>

            {/* Carousel navigation arrows */}
            <button
              onClick={() => setActiveImg(prev => (prev - 1 + carouselImages.length) % carouselImages.length)}
              style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.85)', border: 'none', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            >
              <ChevronLeft size={20} color="#1A1410" />
            </button>
            <button
              onClick={() => setActiveImg(prev => (prev + 1) % carouselImages.length)}
              style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.85)', border: 'none', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            >
              <ChevronRight size={20} color="#1A1410" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 14 }}>
            {carouselImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImg(idx)}
                style={{
                  width: activeImg === idx ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: activeImg === idx ? '#1B6B3A' : '#B0A598',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              />
            ))}
          </div>

          {/* Stats Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 18 }}>
            <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 14, padding: '16px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#8C7B6E', textTransform: 'uppercase', fontWeight: 600 }}>Artisan Rating</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#9A720A', marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <Star size={18} fill="#9A720A" color="none" /> {product.rat}
              </div>
              <div style={{ fontSize: 11, color: '#C0B0A0', marginTop: 2 }}>{product.rev} verified customer reviews</div>
            </div>
            <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 14, padding: '16px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#8C7B6E', textTransform: 'uppercase', fontWeight: 600 }}>Artisan Hub</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#1A1410', marginTop: 4 }}>{product.dist} Hub</div>
              <div style={{ fontSize: 11, color: '#C0B0A0', marginTop: 2 }}>Direct Dispatch from Bihar</div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Product Config & Purchase Info */}
        <div>
          <h1 style={{ fontSize: 34, color: '#1A1410', lineHeight: 1.15, marginBottom: 14, fontFamily: "'Playfair Display', serif", fontWeight: 800 }}>
            {product.name}
          </h1>

          {/* Seller Card */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#F8F6F3', borderRadius: 14, padding: '14px 18px', marginBottom: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', background: '#E8F5EC', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {sellerProfile?.photoSrc ? (
                <img src={sellerProfile.photoSrc} alt={product.seller} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ fontSize: 20 }}>👨‍🌾</div>
              )}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#1A1410', display: 'flex', alignItems: 'center', gap: 6 }}>
                {product.seller}
                <span style={{ background: '#E8F5EC', color: '#1B6B3A', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 20 }}>Farmer</span>
              </div>
              <div style={{ fontSize: 12, color: '#7A7067' }}>Bihar Ka Bazaar Verified Artisan · {product.dist}</div>
            </div>
            <span style={{ marginLeft: 'auto', background: 'rgba(27,107,58,0.12)', color: '#1B6B3A', fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 20 }}>✓ Direct</span>
          </div>

          {/* Pricing Info */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
            <span style={{ fontSize: 44, fontWeight: 900, color: '#1B6B3A', fontFamily: "'Playfair Display', serif" }}>
              ₹{currentVariant.price.toLocaleString()}
            </span>
            <span style={{ fontSize: 14, color: '#7A7067' }}>
              / {currentVariant.weight}
            </span>
          </div>
          <p style={{ fontSize: 12, color: '#7A7067', marginBottom: 22 }}>Includes all local taxes. Free delivery above ₹500.</p>

          {/* Variant weight switcher */}
          {productVariants.length > 0 && (
            <div style={{ marginBottom: 24, borderTop: '1px solid #E5E1DC', paddingTop: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#3D3730', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>Select Weight / Size:</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {productVariants.map((v, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedVariantIndex(i)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 700,
                      border: `2.5px solid ${selectedVariantIndex === i ? '#1B6B3A' : '#E5E1DC'}`,
                      background: selectedVariantIndex === i ? '#E8F5EC' : '#fff',
                      color: selectedVariantIndex === i ? '#1B6B3A' : '#3D3730',
                      cursor: 'pointer',
                      transition: 'all 0.18s',
                      fontFamily: 'inherit'
                    }}
                  >
                    {v.weight} · ₹{v.price}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24, borderTop: '1px solid #E5E1DC', paddingTop: 20 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#3D3730', textTransform: 'uppercase', letterSpacing: 0.5 }}>Quantity</span>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #E5E1DC', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                style={{ background: 'none', border: 'none', padding: '10px 18px', fontSize: 18, color: '#3D3730', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 'bold' }}
              >−</button>
              <span style={{ padding: '10px 20px', fontSize: 15, fontWeight: 800, borderLeft: '1px solid #E5E1DC', borderRight: '1px solid #E5E1DC', minWidth: 50, textAlign: 'center' }}>
                {qty}
              </span>
              <button
                onClick={() => setQty(q => Math.min(99, q + 1))}
                style={{ background: 'none', border: 'none', padding: '10px 18px', fontSize: 18, color: '#3D3730', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 'bold' }}
              >+</button>
            </div>
            <span style={{ fontSize: 13, color: '#7A7067' }}>
              Total Price: <strong style={{ fontSize: 16, color: '#1B6B3A' }}>₹{(currentVariant.price * qty).toLocaleString()}</strong>
            </span>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
            <button
              onClick={handleAddToCart}
              style={{
                padding: '16px',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 700,
                border: '2px solid #1B6B3A',
                background: added ? '#1B6B3A' : '#E8F5EC',
                color: added ? '#fff' : '#1B6B3A',
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'all 0.2s'
              }}
            >
              <ShoppingCart size={16} />
              {added ? '✓ Added to Cart!' : 'Add to Cart'}
            </button>
            <Link href="/cart" style={{ textDecoration: 'none' }}>
              <button
                onClick={handleAddToCart}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 700,
                  border: 'none',
                  background: '#1B6B3A',
                  color: '#fff',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'background 0.2s'
                }}
              >
                Buy Now →
              </button>
            </Link>
          </div>

          {/* Trust badges row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 10px', background: '#F8F6F3', borderRadius: 12, marginBottom: 24 }}>
            {[
              { icon: Truck, text: "Fast Shipping" },
              { icon: ShieldCheck, text: "Secure Payout" },
              { icon: RefreshCw, text: "Easy Returns" }
            ].map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#3D3730', fontWeight: 600 }}>
                  <Icon size={15} color="#1B6B3A" /> {badge.text}
                </div>
              );
            })}
          </div>

          {/* Other Sellers comparison offers list */}
          {otherSellers.length > 0 && (
            <div style={{ border: '1px solid #E5E1DC', borderRadius: 16, background: '#F8FBF8', padding: 18 }}>
              <h3 style={{ fontSize: 13, fontWeight: 800, color: '#1A1410', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: 0.5 }}>🤝 Compare Offers from other Sellers</h3>
              <p style={{ fontSize: 11, color: '#7A7067', margin: '0 0 14px' }}>Support other local Bihar artisans offering similar products</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {otherSellers.slice(0, 3).map(s => (
                  <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', border: '1px solid #E5E1DC', borderRadius: 10, padding: '10px 12px' }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#1A1410' }}>{s.seller}</div>
                      <div style={{ fontSize: 11, color: '#7A7067' }}>{s.dist} · {s.rat} ★</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: '#1B6B3A' }}>
                        ₹{s.price}
                      </span>
                      <Link href={`/shop/${s.id}`} style={{ textDecoration: 'none' }}>
                        <button style={{ padding: '6px 12px', background: '#1B6B3A', color: '#fff', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                          View Seller
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── BUNDLE PROMOTION ("Also Buy") SECTION ── */}
      {bundleItems.length > 0 && (
        <div style={{ margin: '0 60px 48px', padding: 24, background: '#fff', border: '1px solid #E5E1DC', borderRadius: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1A1410', fontFamily: "'Playfair Display', serif", marginBottom: 18 }}>🛍️ Frequently Bought Together ("Also Buy")</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
            
            {/* Bundle items checklist */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, flex: 1 }}>
              {/* Main Product */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 60, height: 60, borderRadius: 8, overflow: 'hidden', background: '#F8F6F3' }}>
                  <img src={carouselImages[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#7A7067', fontWeight: 600 }}>This Item</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1410', maxWidth: 150, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</div>
                  <div style={{ fontSize: 13, color: '#1B6B3A', fontWeight: 800 }}>₹{currentVariant.price}</div>
                </div>
              </div>

              {bundleItems.map((item, idx) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ fontSize: 20, color: '#B0A598' }}>+</div>
                  <input
                    type="checkbox"
                    checked={alsoBuySelected[idx]}
                    onChange={() => setAlsoBuySelected(prev => {
                      const updated = [...prev];
                      updated[idx] = !updated[idx];
                      return updated;
                    })}
                    style={{ accentColor: '#1B6B3A', cursor: 'pointer', width: 16, height: 16 }}
                  />
                  <div style={{ width: 60, height: 60, borderRadius: 8, overflow: 'hidden', background: '#F8F6F3' }}>
                    <img src={item.imgSrc} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1410', maxWidth: 150, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: '#7A7067' }}>by {item.seller}</div>
                    <div style={{ fontSize: 13, color: '#1B6B3A', fontWeight: 800 }}>₹{item.price}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Bundle Add to Cart Panel */}
            <div style={{ background: '#FFF9F2', padding: '16px 20px', borderRadius: 12, border: '1px solid #E5E1DC', minWidth: 260, textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: '#7A7067', marginBottom: 4 }}>Total Bundle Price:</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#1B6B3A', marginBottom: 12 }}>
                ₹{bundleTotal.toLocaleString()}
              </div>
              <button
                onClick={handleAddBundleToCart}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  background: '#1B6B3A',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                Add Selected to Cart
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── DETAIL SPECIFICATION TABS ── */}
      <div style={{ margin: '0 60px 48px', background: '#fff', border: '1px solid #E5E1DC', borderRadius: 20, overflow: 'hidden' }}>
        
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', background: '#F8F6F3', borderBottom: '1px solid #E5E1DC' }}>
          {[
            { id: 'Specs', label: '📄 Specifications' },
            { id: 'Biography', label: '🌱 Seller Biography' },
            { id: 'Reviews', label: `⭐ Reviews & Ratings (${REVIEWS_SAMPLE.length})` }
          ].map(tab => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '16px 24px',
                  border: 'none',
                  background: active ? '#fff' : 'transparent',
                  color: active ? '#1B6B3A' : '#3D3730',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  borderRight: '1px solid #E5E1DC',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div style={{ padding: 28 }}>
          {activeTab === 'Specs' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1A1410', marginBottom: 16 }}>Product Specifications</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <tbody>
                  {[
                    ['Brand', 'BKB Authentic'],
                    ['Origin', `Bihar, India (District: ${product.dist})`],
                    ['Category', product.cat],
                    ['GI Tag Certified', product.gi ? 'Yes' : 'No'],
                    ['Package Dimensions', '24cm x 15cm x 8cm'],
                    ['Shelf Life', '6 Months'],
                    ['Care Instructions', 'Store in a cool, dry place inside an airtight container.']
                  ].map(([label, value], idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #E5E1DC', background: idx % 2 === 0 ? '#FFFCF8' : 'transparent' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#7A7067', width: '25%' }}>{label}</td>
                      <td style={{ padding: '12px 16px', color: '#1A1410' }}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'Biography' && (
            <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ width: 110, height: 110, borderRadius: '50%', overflow: 'hidden', background: '#F8F6F3', border: '3px solid #E5E1DC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {sellerProfile?.photoSrc ? (
                  <img src={sellerProfile.photoSrc} alt={product.seller} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ fontSize: 44 }}>👨‍🌾</div>
                )}
              </div>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: '#1A1410', marginBottom: 6 }}>About the Artisan: {product.seller}</h3>
                <div style={{ fontSize: 12, color: '#1B6B3A', fontWeight: 700, marginBottom: 12 }}>📍 Located in {product.dist}, Bihar</div>
                <p style={{ fontSize: 14, color: '#4A3F35', lineHeight: 1.7, maxWidth: 800 }}>
                  {sellerProfile?.productDescription || `${product.seller} is a registered premium supplier with Bihar Ka Bazaar. Based in the geographical hub of ${product.dist}, they practice age-old techniques passed down through generations. Each product is packed direct-from-source under strict quality checks to deliver authentic, natural taste and handcrafted excellence.`}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'Reviews' && (
            <div>
              {/* Ratings Summary Card */}
              <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 40, borderBottom: '1px solid #E5E1DC', paddingBottom: 28, marginBottom: 28 }}>
                <div style={{ textAlign: 'center', background: '#FFFCF8', border: '1px solid #E5E1DC', borderRadius: 12, padding: 20 }}>
                   <div style={{ fontSize: 44, fontWeight: 900, color: '#1A1410' }}>{product.rat}</div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 2, margin: '8px 0' }}>
                    {[1, 2, 3, 4, 5].map(n => (
                      <Star key={n} size={15} fill={n <= Math.round(parseFloat(product.rat)) ? '#B8860B' : 'none'} color="#B8860B" />
                    ))}
                  </div>
                  <div style={{ fontSize: 12, color: '#7A7067' }}>Product Overall Rating</div>
                </div>

                {/* Rating breakdown bars */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center' }}>
                  {[
                    { stars: 5, pct: '85%' },
                    { stars: 4, pct: '10%' },
                    { stars: 3, pct: '3%' },
                    { stars: 2, pct: '2%' },
                    { stars: 1, pct: '0%' }
                  ].map(bar => (
                    <div key={bar.stars} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12 }}>
                      <span style={{ width: 48, color: '#3D3730', fontWeight: 600 }}>{bar.stars} Star</span>
                      <div style={{ flex: 1, height: 8, background: '#F8F6F3', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ width: bar.pct, height: '100%', background: '#B8860B', borderRadius: 4 }} />
                      </div>
                      <span style={{ width: 36, color: '#7A7067', textAlign: 'right' }}>{bar.pct}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Reviews List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {REVIEWS_SAMPLE.map((rev, idx) => (
                  <div key={idx} style={{ background: '#FFFCF8', border: '1px solid #E5E1DC', borderRadius: 12, padding: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#F8F6F3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={14} color="#7A7067" /></div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1410' }}>{rev.name} ({rev.loc})</div>
                          <div style={{ display: 'flex', gap: 1, marginTop: 2 }}>
                            {[1, 2, 3, 4, 5].map(n => (
                              <Star key={n} size={11} fill={n <= rev.rating ? '#B8860B' : 'none'} color="#B8860B" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: 11, color: '#B0A598' }}>{rev.date}</span>
                    </div>
                    <p style={{ fontSize: 13, color: '#3D3730', lineHeight: 1.6, margin: 0 }}>{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ── RELATED PRODUCTS ── */}
      {related.length > 0 && (
        <div style={{ padding: '48px 60px 0', background: '#FFF9F2', borderTop: '1px solid #E5E1DC' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#1B6B3A', marginBottom: 8 }}>Discover More</div>
          <h2 style={{ fontSize: 28, color: '#1A1410', marginBottom: 28, fontFamily: "'Playfair Display', serif" }}>Related Products</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {related.map(p => (
              <Link key={p.id} href={`/shop/${p.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#fff', border: '1.5px solid #E5E1DC', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.25s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#1B6B3A'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E1DC'; e.currentTarget.style.transform = 'none'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 150, background: p.bg, overflow: 'hidden' }}>
                    <img src={p.imgSrc} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1410', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: '#7A7067', marginBottom: 8 }}>by {p.seller}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#1B6B3A' }}>₹{p.price.toLocaleString()} <span style={{ fontSize: 11, fontWeight: 400, color: '#B0A598' }}>/{p.unit}</span></div>
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