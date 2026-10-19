'use client';

import { useState, useEffect } from 'react';
import {
  Package,
  Search,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Tag
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchProducts = async () => {
    const token = localStorage.getItem('bkb_admin_token');
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter !== 'All') params.set('status', statusFilter);

      const res = await fetch(`/api/admin/products?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Fetch products error:', err);
      showToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [statusFilter]);

  const handleUpdateProduct = async (productId, updates) => {
    // Optimistic UI update
    setProducts(prev => prev.map(p => {
      if (String(p.id) === String(productId)) {
        return { ...p, ...updates };
      }
      return p;
    }));

    const token = localStorage.getItem('bkb_admin_token');
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId, ...updates })
      });
      const data = await res.json();
      if (data.success && data.product) {
        showToast('Catalog listing updated successfully');
        setProducts(prev => prev.map(p => String(p.id) === String(productId) ? data.product : p));
      } else {
        showToast(data.error || 'Failed to update product', 'error');
        fetchProducts();
      }
    } catch (err) {
      showToast('Network error while updating product', 'error');
      fetchProducts();
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
            Products & Marketplace Catalog
          </h1>
          <p style={{ fontSize: 13, color: '#94A3B8' }}>
            Direct inventory control, GI tag verification seals, out-of-stock states, and visibility toggles.
          </p>
        </div>

        <button
          onClick={fetchProducts}
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
          <RefreshCw size={14} /> Refresh Catalog
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 14, padding: '16px 18px' }}>
          <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, marginBottom: 8 }}>CATALOG ITEMS</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#F8F8FC' }}>{stats.total || 0}</div>
        </div>
        <div style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 14, padding: '16px 18px' }}>
          <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, marginBottom: 8 }}>ACTIVE & IN STOCK</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#10B981' }}>{stats.active || 0}</div>
        </div>
        <div style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 14, padding: '16px 18px' }}>
          <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, marginBottom: 8 }}>OUT OF STOCK ITEMS</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#F59E0B' }}>{stats.outOfStock || 0}</div>
        </div>
        <div style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 14, padding: '16px 18px' }}>
          <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, marginBottom: 8 }}>GI CERTIFIED PRODUCTS</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#A78BFA' }}>{stats.giCertified || 0}</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 20, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 440 }}>
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: 12, top: 12 }} />
          <input
            type="text"
            placeholder="Search by product title, seller, category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchProducts()}
            style={{ width: '100%', padding: '10px 14px 10px 38px', background: '#121822', border: '1px solid #1C2633', borderRadius: 8, color: '#F8F8FC', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ display: 'flex', gap: 6, background: '#121822', padding: 4, borderRadius: 8, border: '1px solid #1C2633' }}>
          {['All', 'active', 'out_of_stock', 'hidden'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: 'none',
                background: statusFilter === st ? '#10B981' : 'transparent',
                color: statusFilter === st ? '#fff' : '#94A3B8',
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'capitalize',
                cursor: 'pointer'
              }}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 16, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#121822', color: '#94A3B8', borderBottom: '1px solid #1C2633', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              <th style={{ padding: '14px 18px' }}>Product</th>
              <th style={{ padding: '14px 18px' }}>Category & Origin</th>
              <th style={{ padding: '14px 18px' }}>Seller</th>
              <th style={{ padding: '14px 18px' }}>Price</th>
              <th style={{ padding: '14px 18px' }}>GI Seal</th>
              <th style={{ padding: '14px 18px', textAlign: 'right' }}>Controls</th>
            </tr>
          </thead>
          <tbody>
            {products.map(prod => {
              const isOut = prod.outOfStock || prod.status === 'out_of_stock';
              const isHid = prod.isHidden || prod.status === 'hidden';
              const isGi = Boolean(prod.gi || prod.giTag || prod.giCertified);

              return (
                <tr key={prod.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '16px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={prod.image || prod.imgSrc || '/images/products/prod_1.png'} alt={prod.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 700, color: '#F8F8FC' }}>{prod.name}</div>
                        <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>ID: #{prod.id}</div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '16px 18px' }}>
                    <div style={{ color: '#F1F5F9', fontWeight: 600 }}>{prod.category}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>{prod.origin || 'Bihar'}</div>
                  </td>

                  <td style={{ padding: '16px 18px', color: '#34D399', fontWeight: 600 }}>
                    {prod.seller}
                  </td>

                  <td style={{ padding: '16px 18px', fontWeight: 800, color: '#F8F8FC', fontSize: 15 }}>
                    ₹{prod.price}
                  </td>

                  <td style={{ padding: '16px 18px' }}>
                    <button
                      onClick={() => handleUpdateProduct(prod.id, { gi: !isGi, giTag: !isGi, giCertified: !isGi })}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '4px 10px',
                        borderRadius: 14,
                        border: 'none',
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
                        background: isGi ? 'rgba(139,92,246,0.22)' : 'rgba(255,255,255,0.06)',
                        color: isGi ? '#A78BFA' : '#7E8092'
                      }}
                    >
                      <ShieldCheck size={12} />
                      {isGi ? '✓ GI Verified' : 'Unverified'}
                    </button>
                  </td>

                  <td style={{ padding: '16px 18px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      {/* Out of Stock toggle */}
                      <button
                        onClick={() => handleUpdateProduct(prod.id, { outOfStock: !isOut })}
                        style={{
                          padding: '6px 10px',
                          background: isOut ? '#EF4444' : '#181A22',
                          border: isOut ? 'none' : '1px solid #282B3C',
                          borderRadius: 6,
                          color: isOut ? '#fff' : '#A4A6B8',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {isOut ? 'Out of Stock' : 'In Stock'}
                      </button>

                      {/* Hide / Unhide toggle */}
                      <button
                        onClick={() => handleUpdateProduct(prod.id, { isHidden: !isHid })}
                        style={{
                          padding: '6px 10px',
                          background: '#121822',
                          border: '1px solid #222E3E',
                          borderRadius: 6,
                          color: isHid ? '#F59E0B' : '#7E8092',
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        {isHid ? <EyeOff size={12} /> : <Eye size={12} />}
                        {isHid ? 'Hidden' : 'Visible'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
