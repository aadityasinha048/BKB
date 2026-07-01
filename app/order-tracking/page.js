'use client';

import { useState } from 'react';

const SAMPLE_ORDER = {
  id: '#BKB-1082',
  product: 'Premium Makhana (Fox Nuts)',
  em: '🌰',
  bg: '#FFF8E8',
  seller: 'Ram Prasad, Darbhanga',
  date: 'December 28, 2024',
  amount: '₹480',
  address: 'Rajan Kumar, House No. 42, Rajendra Nagar, Patna — 800001',
  steps: [
    { label: 'Order Placed', desc: 'Your order has been confirmed', date: 'Dec 28, 10:32 AM', done: true },
    { label: 'Packed by Seller', desc: 'Ram Prasad has packed your order', date: 'Dec 28, 3:15 PM', done: true },
    { label: 'Picked Up', desc: 'Package picked up by courier', date: 'Dec 29, 9:00 AM', done: true },
    { label: 'In Transit', desc: 'Package is on the way to Patna', date: 'Dec 30, 11:45 AM', done: true },
    { label: 'Out for Delivery', desc: 'Your package is out for delivery', date: 'Dec 31, 8:00 AM', done: true },
    { label: 'Delivered', desc: 'Package delivered successfully', date: 'Dec 31, 2:14 PM', done: true },
  ],
};

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(SAMPLE_ORDER);
  const [searched, setSearched] = useState(true);

  const handleSearch = () => {
    if (orderId.trim()) setSearched(true);
  };

  return (
    <div style={{ background: '#FFFCF8', minHeight: '80vh' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E8DDD4', padding: '28px 60px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#C85A08', marginBottom: 6 }}>Delivery Status</div>
        <h1 style={{ fontSize: 34, color: '#1A1410', fontFamily: "'Playfair Display', serif" }}>Track Your Order</h1>
      </div>

      <div style={{ padding: '40px 60px', maxWidth: 860, margin: '0 auto' }}>
        {/* Search Box */}
        <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, padding: 26, marginBottom: 28 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1410', marginBottom: 14 }}>Enter your Order ID</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              value={orderId}
              onChange={e => setOrderId(e.target.value)}
              placeholder="e.g. #BKB-1082"
              style={{ flex: 1, padding: '12px 16px', border: '1.5px solid #E8DDD4', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none', color: '#1A1410' }}
              onFocus={e => e.target.style.borderColor = '#C85A08'}
              onBlur={e => e.target.style.borderColor = '#E8DDD4'}
            />
            <button onClick={handleSearch} style={{ padding: '12px 28px', background: '#C85A08', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              Track Order
            </button>
          </div>
          <div style={{ fontSize: 12, color: '#8C7B6E', marginTop: 10 }}>
            💡 You can find your Order ID in the confirmation SMS or email
          </div>
        </div>

        {searched && order && (
          <>
            {/* Order Info */}
            <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, padding: 26, marginBottom: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 20, alignItems: 'center', marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #E8DDD4' }}>
                <div style={{ width: 80, height: 80, borderRadius: 12, background: order.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>{order.em}</div>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: '#1A1410', marginBottom: 4 }}>{order.product}</div>
                  <div style={{ fontSize: 13, color: '#8C7B6E', marginBottom: 3 }}>Sold by {order.seller}</div>
                  <div style={{ fontSize: 13, color: '#8C7B6E' }}>Ordered on {order.date}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {[['Order ID', order.id], ['Amount Paid', order.amount], ['Status', 'Delivered ✅']].map(([l, v]) => (
                  <div key={l}>
                    <div style={{ fontSize: 11, color: '#8C7B6E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{l}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: l === 'Status' ? '#1A5C38' : '#1A1410' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracking Timeline */}
            <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, padding: 30 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1A1410', marginBottom: 28, fontFamily: "'Playfair Display', serif" }}>Delivery Timeline</h3>
              <div style={{ position: 'relative', paddingLeft: 40 }}>
                <div style={{ position: 'absolute', left: 15, top: 10, bottom: 10, width: 2, background: '#E8DDD4' }} />
                {order.steps.map((step, i) => (
                  <div key={step.label} style={{ position: 'relative', marginBottom: i < order.steps.length - 1 ? 28 : 0 }}>
                    <div style={{ position: 'absolute', left: -34, top: 2, width: 22, height: 22, borderRadius: '50%', background: step.done ? '#1A5C38' : '#E8DDD4', border: `3px solid ${step.done ? '#1A5C38' : '#E8DDD4'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                      {step.done && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
                    </div>
                    <div style={{ opacity: step.done ? 1 : 0.45 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: step.done ? '#1A1410' : '#8C7B6E', marginBottom: 3 }}>{step.label}</div>
                      <div style={{ fontSize: 13, color: '#8C7B6E', marginBottom: 2 }}>{step.desc}</div>
                      <div style={{ fontSize: 12, color: '#C0B0A0' }}>{step.date}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Address */}
              <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid #E8DDD4' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#8C7B6E', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Delivered to</div>
                <div style={{ fontSize: 14, color: '#4A3F35', lineHeight: 1.7 }}>{order.address}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}