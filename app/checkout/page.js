'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ORDER_ITEMS = [
  { id: 1, name: "Premium Makhana (Fox Nuts)", price: 480, unit: "500g", em: "🌰", bg: "#FFF8E8", qty: 2 },
  { id: 2, name: "Madhubani Painting — Fish Motif", price: 1200, unit: "piece", em: "🎨", bg: "#FFF0F5", qty: 1 },
  { id: 4, name: "Shahi Litchi — Fresh", price: 380, unit: "1kg", em: "🍈", bg: "#F0FFF4", qty: 1 },
];

const PAYMENT_METHODS = [
  { id: 'upi', icon: '', label: 'UPI' },
  { id: 'card', icon: '', label: 'Card' },
  { id: 'cod', icon: '', label: 'Cash on Delivery' },
  { id: 'netbanking', icon: '', label: 'Net Banking' },
  { id: 'emi', icon: '', label: 'EMI' },
  { id: 'wallet', icon: '', label: 'Wallet' },
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

function FormInput({ label, placeholder, type = 'text', required = false }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>
        {label}{required && <span style={{ color: '#C85A08' }}> *</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        style={{ width: '100%', padding: '11px 13px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none', color: '#1A1410' }}
        onFocus={e => e.target.style.borderColor = '#C85A08'}
        onBlur={e => e.target.style.borderColor = '#E8DDD4'}
      />
    </div>
  );
}

function FormSelect({ label, options, required = false }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>
        {label}{required && <span style={{ color: '#C85A08' }}> *</span>}
      </label>
      <select
        style={{ width: '100%', padding: '11px 13px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none', color: '#1A1410', cursor: 'pointer' }}
        onFocus={e => e.target.style.borderColor = '#C85A08'}
        onBlur={e => e.target.style.borderColor = '#E8DDD4'}
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const [payMethod, setPayMethod] = useState('upi');
  const [placing, setPlacing] = useState(false);

  const subtotal = ORDER_ITEMS.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 500 ? 0 : 60;
  const total = subtotal + shipping;

  const handlePlaceOrder = () => {
    setPlacing(true);
    setTimeout(() => {
      router.push('/order-success');
    }, 1500);
  };

  return (
    <div style={{ background: '#FFFCF8', minHeight: '80vh' }}>

      {/* Header */}
      <div style={{ padding: '32px 60px 24px', background: '#fff', borderBottom: '1px solid #E8DDD4' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#C85A08', marginBottom: 6 }}>Almost There</div>
        <h1 style={{ fontSize: 36, color: '#1A1410', fontFamily: "'Playfair Display', serif" }}>Checkout</h1>
      </div>

      <div style={{ padding: '36px 60px', display: 'grid', gridTemplateColumns: '1fr 400px', gap: 28, alignItems: 'start' }}>

        {/* ── LEFT: FORMS ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Step 1 — Delivery Address */}
          <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '20px 26px', borderBottom: '1px solid #E8DDD4', display: 'flex', alignItems: 'center', gap: 10 }}>
              <StepNumber n={1} />
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1A1410' }}>Delivery Address</h2>
            </div>
            <div style={{ padding: 26 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <FormInput label="Full Name" placeholder="Your Name" required />
                <FormInput label="Phone Number" placeholder="+91 00000 00000" required />
              </div>
              <FormInput label="Email Address" placeholder="123@example.com" type="email" />
              <FormInput label="Address Line 1" placeholder="House no. / Building / Street" required />
              <FormInput label="Address Line 2" placeholder="Area / Locality / Colony (optional)" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <FormInput label="City" placeholder="City" required />
                <FormInput label="Pincode" placeholder="11111" required />
                <FormSelect label="State" options={INDIAN_STATES} required />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#4A3F35', cursor: 'pointer', marginTop: 4 }}>
                <input type="checkbox" defaultChecked style={{ accentColor: '#C85A08' }} />
                Save this address for future orders
              </label>
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
                    onClick={() => setPayMethod(m.id)}
                    style={{ border: `2px solid ${payMethod === m.id ? '#C85A08' : '#E8DDD4'}`, borderRadius: 10, padding: '14px 10px', textAlign: 'center', cursor: 'pointer', background: payMethod === m.id ? '#FFF4EC' : '#fff', transition: 'all 0.2s' }}
                  >
                    <span style={{ fontSize: 24, display: 'block', marginBottom: 6 }}>{m.icon}</span>
                    <div style={{ fontSize: 12, fontWeight: 700, color: payMethod === m.id ? '#C85A08' : '#1A1410' }}>{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Dynamic Payment Fields */}
              {payMethod === 'upi' && (
                <div>
                  <FormInput label="UPI ID" placeholder="yourname@paytm / @upi / @gpay" required />
                  <div style={{ background: '#F5EEE6', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#4A3F35' }}>
                     You will receive a payment request on your UPI app after placing the order
                  </div>
                </div>
              )}
              {payMethod === 'card' && (
                <div>
                  <FormInput label="Card Number" placeholder="1234 5678 9012 3456" required />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                    <FormInput label="Card Holder Name" placeholder="Rajan Kumar" required />
                    <FormInput label="Expiry Date" placeholder="MM / YY" required />
                    <FormInput label="CVV" placeholder="123" required />
                  </div>
                </div>
              )}
              {payMethod === 'netbanking' && (
                <FormSelect label="Select your Bank" options={["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Punjab National Bank", "Bank of Baroda", "Canara Bank", "Other"]} />
              )}
              {payMethod === 'cod' && (
                <div style={{ background: '#EAF5F0', border: '1px solid rgba(26,92,56,0.2)', borderRadius: 10, padding: '16px 18px', fontSize: 14, color: '#1A5C38', fontWeight: 500 }}>
                  ✅ Pay ₹{total.toLocaleString()} in cash when your order is delivered. Please keep exact change ready.
                </div>
              )}
              {payMethod === 'emi' && (
                <div>
                  <FormSelect label="Select EMI Plan" options={["3 months - No Cost EMI", "6 months - No Cost EMI", "9 months - ₹12/month interest", "12 months - ₹18/month interest"]} />
                  <FormInput label="Card Number for EMI" placeholder="1234 5678 9012 3456" required />
                </div>
              )}
              {payMethod === 'wallet' && (
                <FormSelect label="Select Wallet" options={["Paytm Wallet", "PhonePe Wallet", "Amazon Pay", "Mobikwik", "Freecharge"]} />
              )}

              {/* SSL Badge */}
              <div style={{ marginTop: 18, background: '#EAF5F0', border: '1px solid rgba(26,92,56,0.2)', borderRadius: 8, padding: '12px 16px', fontSize: 13, color: '#1A5C38', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                 All payments are 256-bit SSL encrypted and completely secure
              </div>
            </div>
          </div>

          {/* Step 3 — Review */}
          <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '20px 26px', borderBottom: '1px solid #E8DDD4', display: 'flex', alignItems: 'center', gap: 10 }}>
              <StepNumber n={3} />
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1A1410' }}>Review Your Order</h2>
            </div>
            <div style={{ padding: 26 }}>
              {ORDER_ITEMS.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid #E8DDD4' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 10, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>{item.em}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1410' }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: '#8C7B6E' }}>Qty: {item.qty} × ₹{item.price}</div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#C85A08' }}>₹{(item.price * item.qty).toLocaleString()}</div>
                </div>
              ))}
              <div style={{ paddingTop: 14, fontSize: 13, color: '#8C7B6E', lineHeight: 1.6 }}>
                By placing this order, you agree to Bihar Ka Bazaar's{' '}
                <span style={{ color: '#C85A08', cursor: 'pointer' }}>Terms of Service</span>{' '}and{' '}
                <span style={{ color: '#C85A08', cursor: 'pointer' }}>Privacy Policy</span>.
              </div>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            onClick={handlePlaceOrder}
            disabled={placing}
            style={{ width: '100%', padding: 17, background: placing ? '#8C7B6E' : '#C85A08', color: '#fff', border: 'none', borderRadius: 14, fontSize: 17, fontWeight: 800, cursor: placing ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', letterSpacing: 0.3 }}
          >
            {placing ? '⏳ Placing your order...' : '🎉 Place Order & Pay Securely'}
          </button>
        </div>

        {/* ── RIGHT: ORDER SUMMARY ── */}
        <div style={{ position: 'sticky', top: 84 }}>
          <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, padding: 26 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1A1410', marginBottom: 20 }}>Order Summary</h3>

            {/* Items */}
            {ORDER_ITEMS.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: 12, marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid #E8DDD4' }}>
                <div style={{ width: 44, height: 44, borderRadius: 8, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{item.em}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1410', lineHeight: 1.3 }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: '#8C7B6E' }}>Qty: {item.qty}</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#C85A08' }}>₹{(item.price * item.qty).toLocaleString()}</div>
              </div>
            ))}

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