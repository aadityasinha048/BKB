'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function OrderSuccessPage() {
  const [orderId, setOrderId] = useState('BKB-000000');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('orderId');
    if (/^BKB-\d{6}$/.test(id || '')) {
      setOrderId(id);
    }
  }, []);

  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '72px 60px', textAlign: 'center', background: '#FFFCF8' }}>
      <div className="pop-in" style={{ width: 110, height: 110, borderRadius: '50%', background: '#EAF5F0', border: '3px solid #1A5C38', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, marginBottom: 24 }}>🎊</div>
      <h1 style={{ fontSize: 42, color: '#1A1410', marginBottom: 12, fontFamily: "'Playfair Display', serif" }}>Order Placed!</h1>
      <p style={{ fontSize: 16, color: '#8C7B6E', maxWidth: 480, lineHeight: 1.75, marginBottom: 24 }}>Your order from Bihar Ka Bazaar is confirmed. The seller has been notified and will dispatch your package shortly.</p>
      <div style={{ background: '#EAF5F0', border: '1.5px solid rgba(26,92,56,0.25)', borderRadius: 12, padding: '12px 32px', fontSize: 18, fontWeight: 800, color: '#1A5C38', marginBottom: 36, display: 'inline-block' }}>#{orderId}</div>
      <div style={{ display: 'flex', gap: 14 }}>
        <Link href="/shop"><button style={{ padding: '13px 28px', background: '#1A5C38', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Continue Shopping</button></Link>
        <Link href="/dashboard"><button style={{ padding: '13px 28px', background: '#fff', color: '#1A1410', border: '2px solid #E8DDD4', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Track My Order</button></Link>
      </div>
    </div>
  );
}
