'use client';

import { useState } from 'react';
import Link from 'next/link';

const SAMPLE_CART = [
  { id: 1, name: "Premium Makhana (Fox Nuts)", seller: "Ram Prasad", dist: "Darbhanga", price: 480, unit: "500g", em: "🌰", bg: "#FFF8E8", qty: 2 },
  { id: 2, name: "Madhubani Painting — Fish Motif", seller: "Sunita Devi", dist: "Madhubani", price: 1200, unit: "piece", em: "🎨", bg: "#FFF0F5", qty: 1 },
  { id: 4, name: "Shahi Litchi — Fresh", seller: "Vijay Kumar", dist: "Muzaffarpur", price: 380, unit: "1kg", em: "🍈", bg: "#F0FFF4", qty: 1 },
];

export default function CartPage() {
  const [cart, setCart] = useState(SAMPLE_CART);
  const [promo, setPromo] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const updateQty = (id, delta) => {
    setCart(c => c.map(item =>
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };

  const removeItem = (id) => {
    setCart(c => c.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal >= 500 ? 0 : 60;
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + shipping - discount;

  const applyPromo = () => {
    if (promo.toLowerCase() === 'bihar10') {
      setPromoApplied(true);
    }
  };

  return (
    <div style={{ background: '#FFFCF8', minHeight: '80vh' }}>

      {/* Header */}
      <div style={{ padding: '32px 60px 0', background: '#fff', borderBottom: '1px solid #E8DDD4' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#C85A08', marginBottom: 6 }}>Shopping</div>
        <h1 style={{ fontSize: 36, color: '#1A1410', fontFamily: "'Playfair Display', serif", marginBottom: 24 }}>Your Cart</h1>
      </div>

      <div style={{ padding: '36px 60px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 28, alignItems: 'start' }}>

        {/* ── CART ITEMS ── */}
        <div>
          {cart.length === 0 ? (
            <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, padding: '64px', textAlign: 'center' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
              <h3 style={{ fontSize: 24, color: '#1A1410', marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>Your cart is empty</h3>
              <p style={{ fontSize: 14, color: '#8C7B6E', marginBottom: 24 }}>Explore Bihar's finest products and add them to your cart.</p>
              <Link href="/shop">
                <button style={{ padding: '13px 28px', background: '#C85A08', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Start Shopping →
                </button>
              </Link>
            </div>
          ) : (
            <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, overflow: 'hidden' }}>

              {/* Cart Header */}
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #E8DDD4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#1A1410' }}>
                  {cart.length} item{cart.length !== 1 ? 's' : ''} in your cart
                </span>
                <button
                  onClick={() => setCart([])}
                  style={{ fontSize: 12, color: '#8C7B6E', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Clear all
                </button>
              </div>

              {/* Cart Items */}
              {cart.map((item, index) => (
                <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: 18, padding: '22px 24px', borderBottom: index < cart.length - 1 ? '1px solid #E8DDD4' : 'none', alignItems: 'center' }}>

                  {/* Product Image */}
                  <Link href={`/shop/${item.id}`}>
                    <div style={{ width: 80, height: 80, borderRadius: 12, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38, cursor: 'pointer', flexShrink: 0 }}>
                      {item.em}
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div>
                    <Link href={`/shop/${item.id}`} style={{ textDecoration: 'none' }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1410', marginBottom: 3, cursor: 'pointer' }}
                        onMouseEnter={e => e.target.style.color = '#C85A08'}
                        onMouseLeave={e => e.target.style.color = '#1A1410'}
                      >{item.name}</div>
                    </Link>
                    <div style={{ fontSize: 12, color: '#8C7B6E', marginBottom: 12 }}>
                      by {item.seller} · {item.dist}, Bihar
                    </div>

                    {/* Qty + Price Row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #E8DDD4', borderRadius: 8, overflow: 'hidden' }}>
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          style={{ background: 'none', border: 'none', padding: '7px 14px', fontSize: 16, cursor: 'pointer', color: '#4A3F35', fontFamily: 'inherit' }}
                        >−</button>
                        <span style={{ padding: '7px 16px', fontSize: 14, fontWeight: 800, borderLeft: '1px solid #E8DDD4', borderRight: '1px solid #E8DDD4', minWidth: 42, textAlign: 'center' }}>
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          style={{ background: 'none', border: 'none', padding: '7px 14px', fontSize: 16, cursor: 'pointer', color: '#4A3F35', fontFamily: 'inherit' }}
                        >+</button>
                      </div>
                      <span style={{ fontSize: 18, fontWeight: 800, color: '#C85A08' }}>
                        ₹{(item.price * item.qty).toLocaleString()}
                      </span>
                      <span style={{ fontSize: 12, color: '#C0B0A0' }}>
                        ₹{item.price} × {item.qty}
                      </span>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    style={{ background: 'none', border: 'none', color: '#C0B0A0', fontSize: 20, cursor: 'pointer', padding: 4, transition: 'color 0.18s', alignSelf: 'flex-start' }}
                    onMouseEnter={e => e.target.style.color = '#E24B4A'}
                    onMouseLeave={e => e.target.style.color = '#C0B0A0'}
                  >✕</button>
                </div>
              ))}
            </div>
          )}

          {/* Continue Shopping */}
          <div style={{ marginTop: 20 }}>
            <Link href="/shop">
              <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#C85A08', padding: '10px 20px', borderRadius: 8, border: '1.5px solid #FFE8D4', background: '#FFF4EC', cursor: 'pointer', fontFamily: 'inherit' }}>
                ← Continue Shopping
              </button>
            </Link>
          </div>
        </div>

        {/* ── ORDER SUMMARY ── */}
        <div style={{ position: 'sticky', top: 84 }}>
          <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, padding: 26 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1A1410', marginBottom: 20 }}>Order Summary</h3>

            {/* Promo Code */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 7 }}>Promo Code</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  value={promo}
                  onChange={e => setPromo(e.target.value)}
                  placeholder="Enter code (try BIHAR10)"
                  style={{ flex: 1, padding: '10px 12px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 12, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none', color: '#1A1410' }}
                />
                <button
                  onClick={applyPromo}
                  style={{ padding: '10px 14px', background: promoApplied ? '#EAF5F0' : '#F5EEE6', border: `1.5px solid ${promoApplied ? '#1A5C38' : '#E8DDD4'}`, borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', color: promoApplied ? '#1A5C38' : '#4A3F35' }}
                >
                  {promoApplied ? '✓' : 'Apply'}
                </button>
              </div>
              {promoApplied && (
                <div style={{ marginTop: 7, fontSize: 12, color: '#1A5C38', fontWeight: 600 }}>
                  ✅ BIHAR10 applied — 10% off!
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div style={{ borderTop: '1px solid #E8DDD4', paddingTop: 16 }}>
              {[
                ["Subtotal", `₹${subtotal.toLocaleString()}`, false],
                ["Delivery", shipping === 0 ? "FREE" : `₹${shipping}`, shipping === 0],
                ...(promoApplied ? [["Discount (10%)", `-₹${discount.toLocaleString()}`, true]] : []),
              ].map(([label, value, isGreen]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: isGreen ? '#1A5C38' : '#4A3F35', marginBottom: 12, fontWeight: isGreen ? 700 : 400 }}>
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 800, color: '#1A1410', borderTop: '1px solid #E8DDD4', paddingTop: 14, marginTop: 4 }}>
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Free delivery nudge */}
            {subtotal < 500 && subtotal > 0 && (
              <div style={{ marginTop: 14, background: '#FFF4EC', border: '1px solid #FFE8D4', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#C85A08', textAlign: 'center' }}>
                Add ₹{500 - subtotal} more for <strong>free delivery!</strong>
              </div>
            )}

            {/* Checkout Button */}
            <Link href="/checkout" style={{ textDecoration: 'none' }}>
              <button style={{ width: '100%', padding: 15, background: '#C85A08', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginTop: 18, transition: 'all 0.2s' }}
                onMouseEnter={e => e.target.style.background = '#A04806'}
                onMouseLeave={e => e.target.style.background = '#C85A08'}
              >
                Proceed to Checkout →
              </button>
            </Link>

            {/* Trust */}
            <div style={{ textAlign: 'center', marginTop: 14, fontSize: 12, color: '#C0B0A0' }}>
              🔒 256-bit SSL secured · Direct payment to Bihar sellers
            </div>
          </div>

          {/* Accepted Payments */}
          <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, padding: '18px 24px', marginTop: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#8C7B6E', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>We Accept</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[" UPI", " Cards", " Net Banking", " COD", " EMI"].map(p => (
                <span key={p} style={{ background: '#F5EEE6', color: '#4A3F35', fontSize: 12, fontWeight: 600, padding: '5px 10px', borderRadius: 6 }}>{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}