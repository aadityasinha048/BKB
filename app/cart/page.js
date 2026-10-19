'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Share2, ShoppingBag } from 'lucide-react';



export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [promo, setPromo] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [showShareCart, setShowShareCart] = useState(false);
  const [cartLinkCopied, setCartLinkCopied] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('bkb_cart');
    if (stored) {
      try {
        setCart(JSON.parse(stored));
      } catch {
        setCart([]);
      }
    }
  }, []);

  const updateQty = (id, delta) => {
    setCart(c => {
      const updated = c.map(item =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      );
      localStorage.setItem('bkb_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const removeItem = (id) => {
    setCart(c => {
      const updated = c.filter(item => item.id !== id);
      localStorage.setItem('bkb_cart', JSON.stringify(updated));
      return updated;
    });
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
    <div style={{ background: '#fff', minHeight: '80vh' }}>

      {/* Header */}
      <div className="cart-header-container" style={{ padding: '32px 60px 0', background: '#fff', borderBottom: '1px solid #E5E1DC' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#1B6B3A', marginBottom: 6 }}>Shopping</div>
        <h1 style={{ fontSize: 36, color: '#1A1410', fontFamily: "'Playfair Display', serif", marginBottom: 24 }}>Your Cart</h1>
      </div>

      <div className="cart-layout-grid" style={{ padding: '36px 60px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 28, alignItems: 'start' }}>

        {/* ── CART ITEMS ── */}
        <div>
          {cart.length === 0 ? (
            <div style={{ background: '#fff', border: '1px solid #E5E1DC', borderRadius: 16, padding: '64px', textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#F5EEE6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                <ShoppingBag size={28} color="#8C7B6E" />
              </div>
              <h3 style={{ fontSize: 24, color: '#1A1410', marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>Your cart is empty</h3>
              <p style={{ fontSize: 14, color: '#7A7067', marginBottom: 24 }}>Explore Bihar's finest products and add them to your cart.</p>
              <Link href="/shop">
                <button style={{ padding: '13px 28px', background: '#1B6B3A', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Start Shopping →
                </button>
              </Link>
            </div>
          ) : (
            <div style={{ background: '#fff', border: '1px solid #E5E1DC', borderRadius: 16, overflow: 'hidden' }}>

              {/* Cart Header */}
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #E5E1DC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#1A1410' }}>
                  {cart.length} item{cart.length !== 1 ? 's' : ''} in your cart
                </span>
                <button
                  onClick={() => {
                    setCart([]);
                    localStorage.setItem('bkb_cart', JSON.stringify([]));
                  }}
                  style={{ fontSize: 12, color: '#7A7067', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Clear all
                </button>
              </div>

              {/* Cart Items */}
              {cart.map((item, index) => (
                <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: 18, padding: '22px 24px', borderBottom: index < cart.length - 1 ? '1px solid #E5E1DC' : 'none', alignItems: 'center' }}>

                  {/* Product Image */}
                  <Link href={`/shop/${item.id}`}>
                    <div style={{ width: 80, height: 80, borderRadius: 12, background: item.bg, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                      <img 
                        src={item.imgSrc || `/images/products/prod_${item.id}.png`} 
                        alt={item.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div>
                    <Link href={`/shop/${item.id}`} style={{ textDecoration: 'none' }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1410', marginBottom: 3, cursor: 'pointer' }}
                        onMouseEnter={e => e.target.style.color = '#1B6B3A'}
                        onMouseLeave={e => e.target.style.color = '#1A1410'}
                      >{item.name}</div>
                    </Link>
                    <div style={{ fontSize: 12, color: '#7A7067', marginBottom: 8 }}>
                      by {item.seller} · {item.dist}, Bihar
                    </div>
                    {item.unit && (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#F0FAF3', border: '1px solid #C8E6D2', borderRadius: 20, padding: '2px 9px', marginBottom: 10, alignSelf: 'flex-start' }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#1B6B3A' }}>📦 per {item.unit}</span>
                      </div>
                    )}

                    {/* Qty + Price Row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #E5E1DC', borderRadius: 8, overflow: 'hidden' }}>
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          style={{ background: 'none', border: 'none', padding: '7px 14px', fontSize: 16, cursor: 'pointer', color: '#3D3730', fontFamily: 'inherit' }}
                        >−</button>
                        <span style={{ padding: '7px 16px', fontSize: 14, fontWeight: 800, borderLeft: '1px solid #E5E1DC', borderRight: '1px solid #E5E1DC', minWidth: 42, textAlign: 'center' }}>
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          style={{ background: 'none', border: 'none', padding: '7px 14px', fontSize: 16, cursor: 'pointer', color: '#3D3730', fontFamily: 'inherit' }}
                        >+</button>
                      </div>
                      <span style={{ fontSize: 18, fontWeight: 800, color: '#1B6B3A' }}>
                        ₹{(item.price * item.qty).toLocaleString()}
                      </span>
                      <span style={{ fontSize: 12, color: '#B0A598' }}>
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
              <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#1B6B3A', padding: '10px 20px', borderRadius: 8, border: '1px solid #D0EBDA', background: '#E8F5EC', cursor: 'pointer', fontFamily: 'inherit' }}>
                ← Continue Shopping
              </button>
            </Link>
          </div>
        </div>

        {/* ── ORDER SUMMARY ── */}
        <div style={{ position: 'sticky', top: 84 }}>
          <div style={{ background: '#fff', border: '1px solid #E5E1DC', borderRadius: 16, padding: 26 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1A1410', marginBottom: 20 }}>Order Summary</h3>

            {/* Promo Code */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#3D3730', marginBottom: 7 }}>Promo Code</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  value={promo}
                  onChange={e => setPromo(e.target.value)}
                  placeholder="Enter code (try BIHAR10)"
                  style={{ flex: 1, padding: '10px 12px', border: '1px solid #E5E1DC', borderRadius: 8, fontSize: 12, fontFamily: 'inherit', background: '#FAFAFA', outline: 'none', color: '#1A1410' }}
                />
                <button
                  onClick={applyPromo}
                  style={{ padding: '10px 14px', background: promoApplied ? '#E8F5EC' : '#F2F0ED', border: `1px solid ${promoApplied ? '#1B6B3A' : '#E5E1DC'}`, borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', color: promoApplied ? '#1B6B3A' : '#3D3730' }}
                >
                  {promoApplied ? '✓' : 'Apply'}
                </button>
              </div>
              {promoApplied && (
                <div style={{ marginTop: 7, fontSize: 12, color: '#1B6B3A', fontWeight: 600 }}>
                  ✅ BIHAR10 applied — 10% off!
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div style={{ borderTop: '1px solid #E5E1DC', paddingTop: 16 }}>
              {[
                ["Subtotal", `₹${subtotal.toLocaleString()}`, false],
                ["Delivery", shipping === 0 ? "FREE" : `₹${shipping}`, shipping === 0],
                ...(promoApplied ? [["Discount (10%)", `-₹${discount.toLocaleString()}`, true]] : []),
              ].map(([label, value, isGreen]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: isGreen ? '#1B6B3A' : '#3D3730', marginBottom: 12, fontWeight: isGreen ? 700 : 400 }}>
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 800, color: '#1A1410', borderTop: '1px solid #E5E1DC', paddingTop: 14, marginTop: 4 }}>
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Free delivery nudge */}
            {subtotal < 500 && subtotal > 0 && (
              <div style={{ marginTop: 14, background: '#E8F5EC', border: '1px solid #D0EBDA', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#1B6B3A', textAlign: 'center' }}>
                Add ₹{500 - subtotal} more for <strong>free delivery!</strong>
              </div>
            )}

            {/* Checkout Button */}
            <Link href="/checkout" style={{ textDecoration: 'none' }}>
              <button style={{ width: '100%', padding: 15, background: '#1B6B3A', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginTop: 18, transition: 'all 0.25s' }}
                onMouseEnter={e => e.target.style.background = '#0D3B1E'}
                onMouseLeave={e => e.target.style.background = '#1B6B3A'}
              >
                Proceed to Checkout →
              </button>
            </Link>

            {/* Share Cart */}
            <div style={{ position: 'relative', marginTop: 14 }}>
              <button
                onClick={() => {
                  const cartText = cart.map(item => `• ${item.name} x${item.qty} — ₹${(item.price * item.qty).toLocaleString()}`).join('\n');
                  const shareText = `My Bihar Ka Bazaar Cart (₹${total.toLocaleString()} total):\n${cartText}\n\nShop here: ${window.location.origin}/shop`;
                  if (navigator.share) {
                    navigator.share({ title: 'My Bihar Ka Bazaar Cart', text: shareText, url: window.location.origin + '/shop' }).catch(() => {});
                  } else {
                    setShowShareCart(s => !s);
                  }
                }}
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E5E1DC', borderRadius: 10, background: '#FAFAFA', color: '#3D3730', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#1B6B3A'; e.currentTarget.style.background = '#F0FAF3'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E1DC'; e.currentTarget.style.background = '#FAFAFA'; }}
                disabled={cart.length === 0}
              >
                <Share2 size={14} color="#1B6B3A" />
                Share Cart
              </button>

              {showShareCart && (
                <div style={{ position: 'absolute', bottom: '110%', left: 0, right: 0, background: '#fff', border: '1.5px solid #E5E1DC', borderRadius: 12, padding: '10px 0', zIndex: 20, boxShadow: '0 12px 40px rgba(0,0,0,0.14)' }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: '#7A7067', padding: '0 14px 8px', borderBottom: '1px solid #F2F0ED', textTransform: 'uppercase', letterSpacing: 1 }}>Share Cart via</div>
                  {[
                    {
                      label: 'WhatsApp',
                      fn: () => {
                        const itemsList = cart.map(item => `• ${item.name} x${item.qty} — ₹${(item.price * item.qty).toLocaleString()}`).join('\n');
                        const text = `My Bihar Ka Bazaar Cart (₹${total.toLocaleString()} total):\n${itemsList}\n\nShop here: ${window.location.origin}/shop`;
                        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                      }
                    },
                    {
                      label: 'Email',
                      fn: () => {
                        const itemsList = cart.map(item => `• ${item.name} x${item.qty} — ₹${(item.price * item.qty).toLocaleString()}`).join('\n');
                        const body = `My cart (total ₹${total.toLocaleString()}):\n${itemsList}\n\nShop now: ${window.location.origin}/shop`;
                        window.open(`mailto:?subject=${encodeURIComponent('My Bihar Ka Bazaar Cart')}&body=${encodeURIComponent(body)}`);
                      }
                    },
                    {
                      label: 'SMS',
                      fn: () => {
                        const itemsList = cart.map(i => `${i.name} x${i.qty}`).join(', ');
                        const body = `My Bihar Ka Bazaar Cart (₹${total.toLocaleString()}): ${itemsList} — ${window.location.origin}/shop`;
                        window.open(`sms:?body=${encodeURIComponent(body)}`);
                      }
                    },
                    {
                      label: cartLinkCopied ? 'Link Copied' : 'Copy Shop Link',
                      fn: () => { navigator.clipboard.writeText(window.location.origin + '/shop'); setCartLinkCopied(true); setTimeout(() => { setCartLinkCopied(false); setShowShareCart(false); }, 1500); }
                    },
                  ].map(opt => (
                    <div
                      key={opt.label}
                      onClick={opt.fn}
                      style={{ padding: '10px 16px', fontSize: 12, fontWeight: 600, color: '#1A1410', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#F0FAF3'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Trust */}
            <div style={{ textAlign: 'center', marginTop: 14, fontSize: 12, color: '#C0B0A0' }}>
              🔒 256-bit SSL secured · Direct payment to Bihar sellers
            </div>
          </div>

          {/* Accepted Payments */}
          <div style={{ background: '#fff', border: '1px solid #E5E1DC', borderRadius: 16, padding: '18px 24px', marginTop: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#7A7067', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>We Accept</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {["📱 UPI", "💳 Cards", "🏦 Net Banking", "💵 COD", "📋 EMI"].map(p => (
                <span key={p} style={{ background: '#F8F6F3', color: '#3D3730', fontSize: 12, fontWeight: 600, padding: '5px 10px', borderRadius: 6 }}>{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}