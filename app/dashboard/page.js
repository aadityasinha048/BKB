'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Landmark, MapPin, ClipboardList, LogOut, Plus, Edit } from 'lucide-react';

export default function SellerDashboardPage() {
  const router = useRouter();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => {
    const storedId = localStorage.getItem('bkb_seller_id');
    if (!storedId) {
      router.replace('/login?role=seller');
    } else {
      fetchSellerById(storedId);
    }
  }, [router]);

  const fetchSellerById = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/register-seller?sellerId=${id}`);
      const data = await res.json();
      if (data.success) {
        setSeller(data.seller);
        fetchProducts(id);
        setCheckedAuth(true);
      } else {
        localStorage.removeItem('bkb_seller_id');
        router.replace('/login?role=seller');
      }
    } catch (err) {
      console.error('Error verifying seller session:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (sellerId) => {
    try {
      const res = await fetch(`/api/products?sellerId=${sellerId}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Error fetching seller products:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('bkb_seller_id');
    router.push('/login?role=seller&logout=true');
  };

  if (!checkedAuth) {
    return (
      <div style={{ background: '#FFFCF8', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: 16, color: '#8C7B6E', fontWeight: 600 }}>Verifying credentials...</p>
      </div>
    );
  }

  const statusColors = {
    'Completed': { bg: '#EAF5F0', color: '#1A5C38', text: 'Registration Under Review ✅' },
    'Account Created': { bg: '#FFF4EC', color: '#C85A08', text: 'In Progress — Complete your registration ⏳' },
    'Products Added': { bg: '#FFF8E1', color: '#B7791F', text: 'Products Added — Verification Pending 🚩' },
    'Approved': { bg: '#EAF5F0', color: '#1A5C38', text: 'Approved & Active Seller ✅' },
    'Rejected': { bg: '#FDECEA', color: '#D32F2F', text: 'Rejected — Contact support ❌' },
  };

  const currentStatus = statusColors[seller.status] || { bg: '#F5EEE6', color: '#8C7B6E', text: seller.status };

  return (
    <div style={{ background: '#FFFCF8', minHeight: '80vh' }}>
      
      {/* Header */}
      <div style={{ padding: '28px 60px', background: '#fff', borderBottom: '1px solid #E8DDD4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#C85A08', marginBottom: 6 }}>Console</div>
          <h1 style={{ fontSize: 32, color: '#1A1410', fontFamily: "'Playfair Display', serif", margin: 0 }}>Seller Dashboard</h1>
        </div>
        <button
          onClick={handleLogout}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '9px 16px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            background: 'none',
            border: '1.5px solid #E8DDD4',
            color: '#8C7B6E',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#D32F2F'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#E8DDD4'}
        >
          <LogOut size={14} /> Log Out
        </button>
      </div>

      <div style={{ padding: '36px 60px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 28, alignItems: 'start' }}>
        
        {/* Left Side: Listings & Management */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Status Alert Banner */}
          <div style={{
            background: currentStatus.bg,
            border: `1.5px solid ${currentStatus.color}20`,
            borderRadius: 16,
            padding: '20px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: currentStatus.color, letterSpacing: 1 }}>Account Status</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#1A1410', marginTop: 4 }}>
                {currentStatus.text}
              </div>
              <div style={{ fontSize: 12, color: '#8C7B6E', marginTop: 4 }}>
                Seller ID: <strong style={{ fontFamily: 'monospace' }}>{seller.id}</strong>
              </div>
            </div>
            {seller.status === 'Account Created' && (
              <Link href="/sellers" style={{ textDecoration: 'none' }}>
                <button style={{
                  padding: '10px 18px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  background: '#C85A08',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}>
                  Complete Setup
                </button>
              </Link>
            )}
          </div>

          {/* Active Listings Grid */}
          <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 20, padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1A1410', fontFamily: "'Playfair Display', serif" }}>🎒 Products & Inventory</h2>
                <p style={{ fontSize: 12, color: '#8C7B6E', marginTop: 2 }}>Manage items available for buyers on the store</p>
              </div>
              <Link href="/sellers/add-product" style={{ textDecoration: 'none' }}>
                <button style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '10px 20px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  background: '#1A5C38',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}>
                  <Plus size={15} /> Add Product
                </button>
              </Link>
            </div>

            {products.length === 0 ? (
              <div style={{ border: '2px dashed #E8DDD4', borderRadius: 16, padding: '48px 24px', textAlign: 'center', background: '#FFFCF8' }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>📦</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1A1410' }}>No products listed yet</h3>
                <p style={{ fontSize: 12, color: '#8C7B6E', margin: '6px auto 18px', maxWidth: 300 }}>
                  Add your Bihar-crafted goods to make them live on the public marketplace.
                </p>
                <Link href="/sellers/add-product" style={{ textDecoration: 'none' }}>
                  <button style={{ padding: '10px 20px', background: 'none', border: '1.5px solid #C85A08', color: '#C85A08', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                    Create First Listing
                  </button>
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {products.map(p => (
                  <div key={p.id} style={{ display: 'flex', gap: 14, background: '#FFFCF8', border: '1.5px solid #E8DDD4', borderRadius: 16, padding: 14, alignItems: 'center', position: 'relative' }}>
                    <div style={{ width: 72, height: 72, borderRadius: 10, overflow: 'hidden', background: '#F5EEE6', flexShrink: 0 }}>
                      <img src={p.imgSrc} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1410', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: '#8C7B6E', marginTop: 2 }}>{p.cat} · Pack: {p.unit}</div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#C85A08', marginTop: 4 }}>₹{p.price}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                      <span style={{ fontSize: 9, background: p.gi ? '#FEF8E0' : '#EAF5F0', color: p.gi ? '#7A5A08' : '#1A5C38', fontWeight: 800, padding: '3px 8px', borderRadius: 20, textTransform: 'uppercase' }}>
                        {p.gi ? 'GI TAG' : 'ACTIVE'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Account Details Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Profile Overview */}
          <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 20, padding: 24 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: '#C85A08', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
              <ClipboardList size={15} /> Business Overview
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                ['Seller Name', seller.fullName],
                ['Business Name', seller.businessName || 'Individual Artisan/Farmer'],
                ['Preferred Language', seller.language],
                ['Contact Number', seller.mobile],
                ['Seller Type', seller.sellerType || 'Not set'],
              ].map(([l, v]) => (
                <div key={l} style={{ borderBottom: '1px solid #F5EEE6', paddingBottom: 10 }}>
                  <div style={{ fontSize: 10, color: '#8C7B6E', fontWeight: 600, textTransform: 'uppercase' }}>{l}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1410', marginTop: 3 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Location details */}
          <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 20, padding: 24 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: '#1A5C38', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={15} /> Location Details
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
              <div><strong>District:</strong> {seller.district || '—'}</div>
              <div><strong>Village/Town:</strong> {seller.villageTown || '—'}</div>
              <div><strong>ZIP/PIN Code:</strong> {seller.pinCode || '—'}</div>
              {seller.streetAddress && <div style={{ fontSize: 12, color: '#8C7B6E', marginTop: 4 }}>{seller.streetAddress}</div>}
            </div>
          </div>

          {/* Payout details */}
          <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 20, padding: 24 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: '#2B6CB0', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Landmark size={15} /> Payout Details
            </h3>
            <div style={{ fontSize: 13 }}>
              <div><strong>Method:</strong> {seller.payoutMethod === 'upi' ? 'UPI Direct Transfer' : (seller.payoutMethod === 'bank' ? 'Bank Account Transfer' : 'Not configured')}</div>
              {seller.payoutMethod === 'upi' && <div style={{ marginTop: 6 }}><strong>UPI ID:</strong> <code style={{ color: '#C85A08' }}>{seller.upiId}</code></div>}
              {seller.payoutMethod === 'bank' && <div style={{ marginTop: 6 }}><strong>Holder Name:</strong> {seller.bankHolderName}</div>}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}