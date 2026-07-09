'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, ShoppingBag, ShieldCheck, Truck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const PAYMENT_METHODS = [
  { id: 'upi', icon: '📱', label: 'UPI' },
  { id: 'card', icon: '💳', label: 'Card' },
  { id: 'cod', icon: '💵', label: 'Cash on Delivery' },
];

const INDIAN_STATES = [
  "Bihar", "Delhi", "Maharashtra", "Uttar Pradesh", "West Bengal",
  "Gujarat", "Tamil Nadu", "Karnataka", "Telangana", "Rajasthan",
  "Madhya Pradesh", "Andhra Pradesh", "Kerala", "Punjab", "Haryana",
];

function StepNumber({ n }) {
  return (
    <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#C85A08', color: '#fff', fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {n}
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const [payMethod, setPayMethod] = useState('upi');
  const [placing, setPlacing] = useState(false);

  // Cart & profile states
  const [cart, setCart] = useState([]);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [stateName, setStateName] = useState('Bihar');
  const [upiId, setUpiId] = useState('');

  const [error, setError] = useState('');

  useEffect(() => {
    // Load cart
    const storedCart = localStorage.getItem('bkb_cart');
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch {
        setCart([]);
      }
    }

    // Load profile default address values
    const mobile = localStorage.getItem('bkb_user_mobile');
    if (mobile) {
      setPhone(mobile);
      const storedProfile = localStorage.getItem(`bkb_buyer_profile_${mobile}`);
      if (storedProfile) {
        try {
          const profile = JSON.parse(storedProfile);
          setFullName(profile.name || '');
          setEmail(profile.email || '');
          setAddressLine1(profile.address || '');
          setCity(profile.district || '');
          setPincode('846004'); // sensible default
        } catch {
          // Ignore fallback
        }
      }
    }
  }, []);

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 500 ? 0 : 60;
  const total = subtotal + shipping;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !addressLine1.trim() || !city.trim() || !pincode.trim()) {
      setError('Please fill in all required delivery fields.');
      return;
    }
    if (payMethod === 'upi' && !upiId.trim()) {
      setError('Please enter your UPI ID.');
      return;
    }

    setError('');
    setPlacing(true);
    const orderId = `BKB-${Math.floor(100000 + Math.random() * 900000)}`;
    setTimeout(() => {
      // Clear Cart after successful order placement
      localStorage.removeItem('bkb_cart');
      router.push(`/order-success?orderId=${encodeURIComponent(orderId)}`);
    }, 1800);
  };

  return (
    <div style={{ background: '#FFFCF8', minHeight: '80vh' }}>
      
      {/* Header */}
      <div style={{ padding: '32px 60px 24px', background: '#fff', borderBottom: '1px solid #E8DDD4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#C85A08', marginBottom: 6 }}>Almost There</div>
          <h1 style={{ fontSize: 36, color: '#1A1410', fontFamily: "'Playfair Display', serif" }}>Checkout</h1>
        </div>
        <Link href="/cart" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#C85A08', textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Back to Cart
        </Link>
      </div>

      <div style={{ padding: '36px 60px', display: 'grid', gridTemplateColumns: '1fr 400px', gap: 28, alignItems: 'start' }}>
        
        {/* ── LEFT: FORMS ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {error && (
            <div style={{ background: '#FDECEA', border: '1px solid rgba(211,47,47,0.2)', borderRadius: 10, padding: '12px 14px', color: '#D32F2F', fontSize: 13, fontWeight: 600 }}>
              ⚠️ {error}
            </div>
          )}

          {/* Step 1 — Delivery Address */}
          <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '20px 26px', borderBottom: '1px solid #E8DDD4', display: 'flex', alignItems: 'center', gap: 10 }}>
              <StepNumber n={1} />
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1A1410' }}>Delivery Address</h2>
            </div>
            <div style={{ padding: 26 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>Full Name *</label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    style={{ width: '100%', padding: '11px 13px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none', color: '#1A1410', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>Phone Number *</label>
                  <input
                    type="text"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    style={{ width: '100%', padding: '11px 13px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none', color: '#1A1410', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '11px 13px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none', color: '#1A1410', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>Address Line 1 *</label>
                <input
                  type="text"
                  placeholder="House no. / Building / Street"
                  value={addressLine1}
                  onChange={e => setAddressLine1(e.target.value)}
                  style={{ width: '100%', padding: '11px 13px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none', color: '#1A1410', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>Address Line 2</label>
                <input
                  type="text"
                  placeholder="Area / Locality / Colony (optional)"
                  value={addressLine2}
                  onChange={e => setAddressLine2(e.target.value)}
                  style={{ width: '100%', padding: '11px 13px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none', color: '#1A1410', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>City / Town *</label>
                  <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    style={{ width: '100%', padding: '11px 13px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none', color: '#1A1410', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>Pincode *</label>
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={pincode}
                    onChange={e => setPincode(e.target.value)}
                    style={{ width: '100%', padding: '11px 13px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none', color: '#1A1410', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>State *</label>
                  <select
                    value={stateName}
                    onChange={e => setStateName(e.target.value)}
                    style={{ width: '100%', padding: '11px 13px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none', color: '#1A1410', cursor: 'pointer', boxSizing: 'border-box' }}
                  >
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 — Payment */}
          <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '20px 26px', borderBottom: '1px solid #E8DDD4', display: 'flex', alignItems: 'center', gap: 10 }}>
              <StepNumber n={2} />
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1A1410' }}>Payment Method</h2>
            </div>
            <div style={{ padding: 26 }}>
              {/* Payment Options Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 22 }}>
                {PAYMENT_METHODS.map(m => (
                  <div
                    key={m.id}
                    onClick={() => {
                      setPayMethod(m.id);
                      setError('');
                    }}
                    style={{ border: `2.5px solid ${payMethod === m.id ? '#C85A08' : '#E8DDD4'}`, borderRadius: 12, padding: '14px 10px', textAlign: 'center', cursor: 'pointer', background: payMethod === m.id ? '#FFF4EC' : '#fff', transition: 'all 0.2s' }}
                  >
                    <span style={{ fontSize: 24, display: 'block', marginBottom: 6 }}>{m.icon}</span>
                    <div style={{ fontSize: 12, fontWeight: 700, color: payMethod === m.id ? '#C85A08' : '#1A1410' }}>{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Dynamic Payment Fields */}
              {payMethod === 'upi' && (
                <div style={{ background: '#FFFCF8', border: '1px solid #E8DDD4', borderRadius: 10, padding: 18 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>UPI ID *</label>
                  <input
                    type="text"
                    placeholder="yourname@paytm / @upi / @gpay"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    style={{ width: '100%', padding: '11px 13px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#fff', outline: 'none', color: '#1A1410', boxSizing: 'border-box' }}
                  />
                  <div style={{ fontSize: 11, color: '#8C7B6E', marginTop: 6 }}>Direct verification will be simulated on order placement.</div>
                </div>
              )}

              {payMethod === 'card' && (
                <div style={{ background: '#FFFCF8', border: '1px solid #E8DDD4', borderRadius: 10, padding: 18, display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12 }}>
                  <div style={{ gridColumn: 'span 3' }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>Card Number *</label>
                    <input type="text" placeholder="1234 5678 9101 1121" style={{ width: '100%', padding: '11px 13px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#fff', outline: 'none', color: '#1A1410', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>Expiry Date *</label>
                    <input type="text" placeholder="MM/YY" style={{ width: '100%', padding: '11px 13px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#fff', outline: 'none', color: '#1A1410', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>CVV *</label>
                    <input type="password" placeholder="***" style={{ width: '100%', padding: '11px 13px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#fff', outline: 'none', color: '#1A1410', boxSizing: 'border-box' }} />
                  </div>
                </div>
              )}

              {payMethod === 'cod' && (
                <div style={{ background: '#FFF4EC', border: '1.5px solid #FFE8D4', borderRadius: 10, padding: 18, color: '#C85A08', fontSize: 13, fontWeight: 600 }}>
                  📦 Extra delivery confirmation call will be triggered by Bihar Ka Bazaar to verify COD.
                </div>
              )}
            </div>
          </div>

          {/* Place Order Button */}
          <button
            onClick={handlePlaceOrder}
            disabled={placing || cart.length === 0}
            style={{ width: '100%', padding: 17, background: placing || cart.length === 0 ? '#8C7B6E' : '#C85A08', color: '#fff', border: 'none', borderRadius: 14, fontSize: 17, fontWeight: 800, cursor: placing || cart.length === 0 ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', letterSpacing: 0.3 }}
          >
            {placing ? '⏳ Placing your order...' : '🎉 Place Order & Pay Securely'}
          </button>
        </div>

        {/* ── RIGHT: ORDER SUMMARY ── */}
        <div style={{ position: 'sticky', top: 84 }}>
          <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, padding: 26 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1A1410', marginBottom: 20 }}>Order Summary</h3>

            {/* Items */}
            {cart.length > 0 ? (
              cart.map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: 12, marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid #E8DDD4' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 8, background: item.bg || '#F5EEE6', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <img src={item.imgSrc || `/images/products/prod_1.png`} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1410', lineHeight: 1.3 }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: '#8C7B6E' }}>Size: {item.unit} · Qty: {item.qty}</div>
                    <div style={{ fontSize: 10, color: '#C85A08', fontWeight: 600 }}>Seller: {item.seller}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#C85A08' }}>₹{(item.price * item.qty).toLocaleString()}</div>
                </div>
              ))
            ) : (
              <div style={{ textHeading: 'center', padding: '20px 0', color: '#8C7B6E', fontSize: 13 }}>
                Your cart is empty.
              </div>
            )}

            {/* Price Breakdown */}
            <div style={{ marginBottom: 14 }}>
              {[
                ["Subtotal", `₹${subtotal.toLocaleString()}`],
                ["Delivery", shipping === 0 ? "FREE" : `₹${shipping}`],
                ["Platform Fee", "₹0"],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: label === "Delivery" && shipping === 0 ? '#1A5C38' : '#4A3F35', marginBottom: 10, fontWeight: label === "Delivery" && shipping === 0 ? 700 : 400 }}>
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, fontWeight: 800, color: '#1A1410', borderTop: '1px solid #E8DDD4', paddingTop: 14 }}>
              <span>Total Payable</span>
              <span>₹{total.toLocaleString()}</span>
            </div>

            {/* Direct payment badge */}
            <div style={{ marginTop: 16, background: '#EAF5F0', border: '1px solid rgba(26,92,56,0.2)', borderRadius: 10, padding: '12px 14px', fontSize: 12, color: '#1A5C38', fontWeight: 600, textAlign: 'center' }}>
              ✅ Your payment goes directly to the Bihar seller
            </div>

            {/* Delivery info */}
            <div style={{ marginTop: 14, background: '#FFF8F2', border: '1px solid #FFE8D4', borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 6 }}>📦 Estimated Delivery</div>
              <div style={{ fontSize: 13, color: '#C85A08', fontWeight: 700 }}>3 – 7 Business Days</div>
              <div style={{ fontSize: 11, color: '#8C7B6E', marginTop: 2 }}>Tracking SMS will be sent after dispatch</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
