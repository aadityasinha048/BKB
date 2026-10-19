'use client';

import { useState, useEffect } from 'react';
import {
  UserCheck,
  Search,
  MapPin,
  ExternalLink,
  ShoppingBag,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Mail,
  Phone
} from 'lucide-react';

export default function AdminBuyersPage() {
  const [buyers, setBuyers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchBuyers = async () => {
    const token = localStorage.getItem('bkb_admin_token');
    try {
      const res = await fetch(`/api/admin/buyers?search=${encodeURIComponent(search)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setBuyers(data.buyers);
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Fetch buyers error:', err);
      showToast('Failed to load buyers list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuyers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBuyers();
  };

  const handleToggleStatus = async (buyerId, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    const token = localStorage.getItem('bkb_admin_token');
    try {
      const res = await fetch('/api/admin/buyers', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ buyerId, status: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Buyer marked as ${nextStatus.toUpperCase()}`);
        fetchBuyers();
      } else {
        showToast(data.error || 'Failed to update status', 'error');
      }
    } catch (err) {
      showToast('Network error updating buyer status', 'error');
    }
  };

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1400 }}>

      {/* Toast Alert */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 100,
          background: toast.type === 'error' ? '#EF4444' : '#10B981',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: 10,
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          fontWeight: 600,
          fontSize: 13,
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          {toast.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#F8F8FC', marginBottom: 4 }}>
            Buyers & Customer CRM
          </h1>
          <p style={{ fontSize: 13, color: '#94A3B8' }}>
            Registered customers, delivery location coordinates, lifetime spending volume, and account safety.
          </p>
        </div>

        <button
          onClick={fetchBuyers}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '9px 18px',
            background: '#121822',
            border: '1px solid #222E3E',
            borderRadius: 8,
            color: '#94A3B8',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit'
          }}
        >
          <RefreshCw size={14} /> Refresh Customers
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 14, padding: '16px 18px' }}>
          <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, marginBottom: 8 }}>REGISTERED BUYERS</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#F8F8FC' }}>{stats.total || 0}</div>
        </div>
        <div style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 14, padding: '16px 18px' }}>
          <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, marginBottom: 8 }}>ACTIVE ACCOUNTS</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#10B981' }}>{stats.active || 0}</div>
        </div>
        <div style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 14, padding: '16px 18px' }}>
          <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, marginBottom: 8 }}>TOTAL SPEND BY CUSTOMERS</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#3B82F6' }}>₹{(stats.totalCustomerSpend || 0).toLocaleString()}</div>
        </div>
        <div style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 14, padding: '16px 18px' }}>
          <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, marginBottom: 8 }}>SUSPENDED BUYERS</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#EF4444' }}>{stats.suspended || 0}</div>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 440 }}>
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: 12, top: 12 }} />
          <input
            type="text"
            placeholder="Search by name, phone, email, district..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 14px 10px 38px', background: '#121822', border: '1px solid #1C2633', borderRadius: 8, color: '#F8F8FC', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <button type="submit" style={{ padding: '9px 18px', background: '#10B981', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
          Search
        </button>
      </form>

      {/* Buyers Table */}
      <div style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 16, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#121822', color: '#94A3B8', borderBottom: '1px solid #1C2633', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              <th style={{ padding: '14px 18px' }}>Buyer Name & ID</th>
              <th style={{ padding: '14px 18px' }}>Contact</th>
              <th style={{ padding: '14px 18px' }}>Delivery Address & Map Coordinates</th>
              <th style={{ padding: '14px 18px' }}>Orders & Spend</th>
              <th style={{ padding: '14px 18px' }}>Status</th>
              <th style={{ padding: '14px 18px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {buyers.map(buyer => (
              <tr key={buyer.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '16px 18px' }}>
                  <div style={{ fontWeight: 700, color: '#F8F8FC' }}>{buyer.name}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{buyer.id}</div>
                </td>

                <td style={{ padding: '16px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#F1F5F9' }}>
                    <Phone size={13} color="#10B981" /> +91 {buyer.mobile}
                  </div>
                  {buyer.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94A3B8', fontSize: 11, marginTop: 4 }}>
                      <Mail size={12} /> {buyer.email}
                    </div>
                  )}
                </td>

                <td style={{ padding: '16px 18px' }}>
                  <div style={{ color: '#F1F5F9', fontSize: 12 }}>{buyer.address || 'Address pending'}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>{buyer.city || buyer.district}, Bihar {buyer.pincode ? `- ${buyer.pincode}` : ''}</div>
                  {buyer.lat && buyer.lng && (
                    <div style={{ marginTop: 4 }}>
                      <a
                        href={`https://www.openstreetmap.org/?mlat=${buyer.lat}&mlon=${buyer.lng}#map=16/${buyer.lat}/${buyer.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 10,
                          fontWeight: 700,
                          color: '#10B981',
                          background: 'rgba(16,185,129,0.12)',
                          padding: '2px 8px',
                          borderRadius: 4,
                          textDecoration: 'none'
                        }}
                      >
                        <MapPin size={10} /> Mapped: {buyer.lat.toFixed(4)}, {buyer.lng.toFixed(4)} ↗
                      </a>
                    </div>
                  )}
                </td>

                <td style={{ padding: '16px 18px' }}>
                  <div style={{ fontWeight: 800, color: '#F8F8FC' }}>₹{Number(buyer.totalSpent || 0).toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: '#38BDF8', fontWeight: 600 }}>{buyer.ordersCount || 0} Orders</div>
                </td>

                <td style={{ padding: '16px 18px' }}>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: 12,
                    fontSize: 10,
                    fontWeight: 700,
                    background: buyer.status === 'active' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                    color: buyer.status === 'active' ? '#10B981' : '#EF4444'
                  }}>
                    {buyer.status?.toUpperCase() || 'ACTIVE'}
                  </span>
                </td>

                <td style={{ padding: '16px 18px', textAlign: 'right' }}>
                  <button
                    onClick={() => handleToggleStatus(buyer.id, buyer.status || 'active')}
                    style={{
                      padding: '6px 12px',
                      background: '#121822',
                      border: '1px solid #222E3E',
                      borderRadius: 6,
                      color: buyer.status === 'active' ? '#EF4444' : '#10B981',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {buyer.status === 'active' ? 'Suspend' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
