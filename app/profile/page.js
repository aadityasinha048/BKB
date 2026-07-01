'use client';

import { useState } from 'react';
import Link from 'next/link';

const TABS = ['Profile', 'My Orders', 'Addresses', 'Settings'];

const ORDERS = [
  { id: '#BKB-1082', product: 'Premium Makhana 500g', em: '🌰', date: 'Dec 28, 2024', amount: '₹480', status: 'Delivered', bg: '#FFF8E8' },
  { id: '#BKB-1079', product: 'Madhubani Painting', em: '🎨', date: 'Dec 20, 2024', amount: '₹1,200', status: 'Delivered', bg: '#FFF0F5' },
  { id: '#BKB-1065', product: 'Shahi Litchi 2kg', em: '🍈', date: 'Dec 10, 2024', amount: '₹720', status: 'Delivered', bg: '#F0FFF4' },
  { id: '#BKB-1058', product: 'Katarni Rice 2kg', em: '🍚', date: 'Nov 28, 2024', amount: '₹320', status: 'Delivered', bg: '#FAFFF4' },
];

function StatusPill({ status }) {
  const map = {
    Delivered: { bg: '#EAF5F0', color: '#1A5C38' },
    Shipped: { bg: '#EEF2FF', color: '#3060CC' },
    Processing: { bg: '#FEF8E0', color: '#9A720A' },
    Cancelled: { bg: '#FEEBEB', color: '#C0392B' },
  };
  const s = map[status] || map.Delivered;
  return <span style={{ padding: '4px 10px', borderRadius: 40, fontSize: 11, fontWeight: 800, background: s.bg, color: s.color }}>{status}</span>;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [editing, setEditing] = useState(false);

  return (
    <div style={{ background: '#FFFCF8', minHeight: '80vh' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E8DDD4', padding: '28px 60px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#C85A08', marginBottom: 6 }}>Account</div>
        <h1 style={{ fontSize: 34, color: '#1A1410', fontFamily: "'Playfair Display', serif" }}>My Profile</h1>
      </div>

      <div style={{ padding: '36px 60px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: 28, alignItems: 'start' }}>

        {/* Sidebar */}
        <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, overflow: 'hidden' }}>
          {/* Avatar */}
          <div style={{ padding: '28px 24px', textAlign: 'center', borderBottom: '1px solid #E8DDD4', background: 'linear-gradient(135deg, #FFF4EC, #FFFCF8)' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#FFF4EC', border: '3px solid #FFE8D4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 12px' }}>👤</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1410', marginBottom: 3 }}>Rajan Kumar</div>
            <div style={{ fontSize: 12, color: '#8C7B6E' }}>rajan@example.com</div>
            <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 5, background: '#EAF5F0', color: '#1A5C38', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>✓ Verified Account</div>
          </div>
          {/* Nav */}
          <div style={{ padding: '10px 10px' }}>
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ width: '100%', padding: '11px 14px', borderRadius: 9, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', marginBottom: 3, background: activeTab === tab ? '#FFF4EC' : 'transparent', color: activeTab === tab ? '#C85A08' : '#4A3F35', transition: 'all 0.18s' }}>
                {tab === 'Profile' ? '👤 ' : tab === 'My Orders' ? '📦 ' : tab === 'Addresses' ? '📍 ' : '⚙️ '}{tab}
              </button>
            ))}
            <div style={{ margin: '8px 0', height: 1, background: '#E8DDD4' }} />
            <Link href="/dashboard">
              <button style={{ width: '100%', padding: '11px 14px', borderRadius: 9, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', background: 'transparent', color: '#4A3F35' }}>
                🌾 Seller Dashboard
              </button>
            </Link>
            <button style={{ width: '100%', padding: '11px 14px', borderRadius: 9, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', background: 'transparent', color: '#C0392B' }}>
              🚪 Log Out
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div>
          {/* PROFILE TAB */}
          {activeTab === 'Profile' && (
            <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '20px 26px', borderBottom: '1px solid #E8DDD4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1A1410' }}>Personal Information</h2>
                <button onClick={() => setEditing(!editing)} style={{ padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700, border: '1.5px solid #C85A08', background: editing ? '#C85A08' : 'transparent', color: editing ? '#fff' : '#C85A08', cursor: 'pointer', fontFamily: 'inherit' }}>
                  {editing ? 'Save Changes' : 'Edit Profile'}
                </button>
              </div>
              <div style={{ padding: 26 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
                  {[['Full Name', 'Rajan Kumar'], ['Phone Number', '+91 98765 43210'], ['Email Address', 'rajan@example.com'], ['Date of Birth', '15 March 1992']].map(([label, value]) => (
                    <div key={label}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#8C7B6E', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
                      {editing
                        ? <input defaultValue={value} style={{ width: '100%', padding: '10px 13px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none', color: '#1A1410' }} />
                        : <div style={{ fontSize: 15, fontWeight: 500, color: '#1A1410' }}>{value}</div>}
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid #E8DDD4', paddingTop: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#8C7B6E', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Member Since</div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: '#1A1410' }}>January 2024</div>
                </div>
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'My Orders' && (
            <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '20px 26px', borderBottom: '1px solid #E8DDD4' }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1A1410' }}>Order History</h2>
              </div>
              {ORDERS.map((o, i) => (
                <div key={o.id} style={{ display: 'grid', gridTemplateColumns: '60px 1fr auto', gap: 16, padding: '20px 26px', borderBottom: i < ORDERS.length - 1 ? '1px solid #E8DDD4' : 'none', alignItems: 'center' }}>
                  <div style={{ width: 60, height: 60, borderRadius: 10, background: o.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{o.em}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1410', marginBottom: 3 }}>{o.product}</div>
                    <div style={{ fontSize: 12, color: '#8C7B6E', marginBottom: 6 }}>Ordered on {o.date}</div>
                    <StatusPill status={o.status} />
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 17, fontWeight: 800, color: '#C85A08', marginBottom: 8 }}>{o.amount}</div>
                    <Link href="/order-tracking">
                      <button style={{ padding: '7px 14px', background: '#FFF4EC', color: '#C85A08', border: '1.5px solid #FFE8D4', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Track</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ADDRESSES TAB */}
          {activeTab === 'Addresses' && (
            <div>
              <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, padding: 26, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#EAF5F0', color: '#1A5C38', fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, marginBottom: 10 }}>✓ Default Address</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1410', marginBottom: 4 }}>Rajan Kumar</div>
                    <div style={{ fontSize: 14, color: '#4A3F35', lineHeight: 1.7 }}>
                      House No. 42, Rajendra Nagar<br />Near Central School, Boring Road<br />Patna, Bihar — 800001<br />+91 98765 43210
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ padding: '7px 14px', background: '#FFF4EC', color: '#C85A08', border: '1.5px solid #FFE8D4', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Edit</button>
                  </div>
                </div>
              </div>
              <button style={{ width: '100%', padding: 14, background: '#fff', color: '#C85A08', border: '2px dashed #FFE8D4', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                + Add New Address
              </button>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'Settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                ['Notifications', [['Order updates via SMS', true], ['Order updates via Email', true], ['Promotional offers', false], ['New product alerts', true]]],
                ['Privacy', [['Share my purchase history for recommendations', true], ['Allow personalized ads', false]]],
              ].map(([title, settings]) => (
                <div key={title} style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, overflow: 'hidden' }}>
                  <div style={{ padding: '18px 24px', borderBottom: '1px solid #E8DDD4', fontSize: 16, fontWeight: 700, color: '#1A1410' }}>{title}</div>
                  <div style={{ padding: '8px 24px' }}>
                    {settings.map(([label, defaultVal]) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #F5EEE6' }}>
                        <span style={{ fontSize: 14, color: '#4A3F35' }}>{label}</span>
                        <div style={{ width: 44, height: 24, borderRadius: 12, background: defaultVal ? '#C85A08' : '#E8DDD4', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
                          <div style={{ position: 'absolute', top: 3, left: defaultVal ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{ background: '#FEEBEB', border: '1.5px solid #F5C6C6', borderRadius: 16, padding: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#C0392B', marginBottom: 8 }}>Danger Zone</h3>
                <p style={{ fontSize: 13, color: '#8C7B6E', marginBottom: 16 }}>Once you delete your account, there is no going back. Please be certain.</p>
                <button style={{ padding: '10px 20px', background: '#C0392B', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Delete Account</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}