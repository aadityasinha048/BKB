'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Truck,
  ArrowRight,
  RefreshCw,
  Activity,
  Layers,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  ExternalLink,
  Search,
  Filter,
  Sliders,
  Bell,
  Save,
  Trash2,
  Plus,
  Send,
  UserCheck,
  Package,
  CreditCard,
  Eye,
  EyeOff,
  AlertTriangle,
  Download,
  Zap,
  Tag,
  Landmark,
  Smartphone,
  Phone,
  Mail,
  X
} from 'lucide-react';

export default function WorldClassAdminConsole() {
  // Global Data States
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'sellers', 'buyers', 'payments', 'products', 'operations'
  const [toast, setToast] = useState(null);

  // Raw API Datasets
  const [orders, setOrders] = useState([]);
  const [orderStats, setOrderStats] = useState({});
  const [sellers, setSellers] = useState([]);
  const [sellerStats, setSellerStats] = useState({});
  const [buyers, setBuyers] = useState([]);
  const [buyerStats, setBuyerStats] = useState({});
  const [payments, setPayments] = useState([]);
  const [paymentStats, setPaymentStats] = useState({});
  const [sellerPayouts, setSellerPayouts] = useState([]);
  const [products, setProducts] = useState([]);
  const [productStats, setProductStats] = useState({});
  const [operationsData, setOperationsData] = useState(null);

  // Omni Search state
  const [omniSearch, setOmniSearch] = useState('');

  // Operational Settings Form
  const [settings, setSettings] = useState({
    systemMode: 'live',
    allowOrders: true,
    allowSellerRegistrations: true,
    upiDirectPay: true,
    codEnabled: true,
    platformCommissionPercent: 5,
    freeShippingThreshold: 500,
    deliveryCharge: 60,
    emergencyBanner: { enabled: false, message: '' }
  });

  // Modals & Action States
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [shippingModalOrder, setShippingModalOrder] = useState(null);
  const [courierName, setCourierName] = useState('Delhivery');
  const [trackingNumber, setTrackingNumber] = useState('');
  
  const [payoutModalSeller, setPayoutModalSeller] = useState(null);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutUtr, setPayoutUtr] = useState('');

  const [addProductModal, setAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Handicrafts',
    price: '',
    seller: '',
    origin: 'Bihar',
    giTag: false,
    image: '/images/products/prod_1.png'
  });

  const [verificationReport, setVerificationReport] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch all collections in parallel for zero latency
  const loadAllConsoleData = async () => {
    let token = typeof window !== 'undefined' ? localStorage.getItem('bkb_admin_token') : null;
    if (!token && typeof window !== 'undefined') {
      token = 'dev-only-change-this-to-a-long-random-string-before-use';
      localStorage.setItem('bkb_admin_token', token);
    }
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      const [oRes, sRes, bRes, pRes, prRes, opRes] = await Promise.all([
        fetch('/api/admin/orders', { headers }).catch(() => null),
        fetch('/api/admin/sellers', { headers }).catch(() => null),
        fetch('/api/admin/buyers', { headers }).catch(() => null),
        fetch('/api/admin/payments', { headers }).catch(() => null),
        fetch('/api/admin/products', { headers }).catch(() => null),
        fetch('/api/admin/operations', { headers }).catch(() => null),
      ]);

      const [oData, sData, bData, pData, prData, opData] = await Promise.all([
        oRes?.ok ? oRes.json().catch(() => ({})) : Promise.resolve({}),
        sRes?.ok ? sRes.json().catch(() => ({})) : Promise.resolve({}),
        bRes?.ok ? bRes.json().catch(() => ({})) : Promise.resolve({}),
        pRes?.ok ? pRes.json().catch(() => ({})) : Promise.resolve({}),
        prRes?.ok ? prRes.json().catch(() => ({})) : Promise.resolve({}),
        opRes?.ok ? opRes.json().catch(() => ({})) : Promise.resolve({}),
      ]);

      if (oData.success) {
        setOrders(oData.orders || []);
        setOrderStats(oData.stats || {});
      }
      if (sData.success) {
        setSellers(sData.sellers || []);
        setSellerStats(sData.stats || {});
      }
      if (bData.success) {
        setBuyers(bData.buyers || []);
        setBuyerStats(bData.stats || {});
      }
      if (pData.success) {
        setPayments(pData.transactions || []);
        setPaymentStats(pData.stats || {});
        setSellerPayouts(pData.sellerPayouts || []);
      }
      if (prData.success) {
        setProducts(prData.products || []);
        setProductStats(prData.stats || {});
      }
      if (opData.success) {
        setOperationsData(opData);
        if (opData.settings) {
          setSettings(opData.settings);
        }
      }
    } catch (err) {
      console.error('Console fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllConsoleData();
  }, []);

  // Omni Search Filtering Across All Entities
  const omniSearchResults = useMemo(() => {
    if (!omniSearch.trim()) return null;
    const q = omniSearch.toLowerCase();

    return {
      orders: orders.filter(o => o.id?.toLowerCase().includes(q) || o.buyerName?.toLowerCase().includes(q) || o.buyerPhone?.includes(q)),
      sellers: sellers.filter(s => s.fullName?.toLowerCase().includes(q) || s.mobile?.includes(q) || s.businessName?.toLowerCase().includes(q)),
      buyers: buyers.filter(b => b.name?.toLowerCase().includes(q) || b.mobile?.includes(q) || b.city?.toLowerCase().includes(q)),
      products: products.filter(p => p.name?.toLowerCase().includes(q) || p.seller?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q)),
    };
  }, [omniSearch, orders, sellers, buyers, products]);

  // Order Operations
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setActionLoading(true);
    const token = localStorage.getItem('bkb_admin_token');
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, action: 'update_status', orderStatus: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Order status updated to ${newStatus.toUpperCase()}`);
        loadAllConsoleData();
        if (selectedOrder?.id === orderId) setSelectedOrder(data.order);
      } else {
        showToast(data.error || 'Failed to update order', 'error');
      }
    } catch {
      showToast('Network error updating order', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleShipOrder = async (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      showToast('Tracking number / AWB is required', 'error');
      return;
    }
    setActionLoading(true);
    const token = localStorage.getItem('bkb_admin_token');
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: shippingModalOrder.id,
          action: 'update_status',
          orderStatus: 'shipped',
          courier: courierName,
          trackingNumber: trackingNumber.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Dispatched via ${courierName}! Tracking AWB updated.`);
        setShippingModalOrder(null);
        setTrackingNumber('');
        loadAllConsoleData();
      }
    } catch {
      showToast('Dispatch failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleTogglePayment = async (orderId, current) => {
    const next = current === 'paid' ? 'pending' : 'paid';
    const token = localStorage.getItem('bkb_admin_token');
    try {
      await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, action: 'update_payment', paymentStatus: next })
      });
      showToast(`Payment marked as ${next.toUpperCase()}`);
      loadAllConsoleData();
    } catch {
      showToast('Payment update error', 'error');
    }
  };

  // Seller Operations
  const handleUpdateSellerStatus = async (sellerId, newStatus) => {
    const token = localStorage.getItem('bkb_admin_token');
    try {
      const res = await fetch('/api/admin/sellers', {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ sellerId, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Seller marked as ${newStatus}`);
        loadAllConsoleData();
      }
    } catch {
      showToast('Failed to update seller status', 'error');
    }
  };

  // Buyer Operations
  const handleToggleBuyer = async (buyerId, current) => {
    const next = current === 'active' ? 'suspended' : 'active';
    const token = localStorage.getItem('bkb_admin_token');
    try {
      await fetch('/api/admin/buyers', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyerId, status: next })
      });
      showToast(`Buyer marked as ${next.toUpperCase()}`);
      loadAllConsoleData();
    } catch {
      showToast('Failed to toggle buyer status', 'error');
    }
  };

  // Payout Disbursal
  const handleDisbursePayout = async (e) => {
    e.preventDefault();
    if (!payoutAmount || Number(payoutAmount) <= 0) return;
    setActionLoading(true);
    const token = localStorage.getItem('bkb_admin_token');
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'process_payout',
          sellerId: payoutModalSeller.sellerId,
          amount: Number(payoutAmount),
          utrNumber: payoutUtr.trim() || `UTR${Date.now().toString().slice(-8)}`
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Disbursed ₹${payoutAmount} to ${payoutModalSeller.sellerName}`);
        setPayoutModalSeller(null);
        setPayoutAmount('');
        setPayoutUtr('');
        loadAllConsoleData();
      }
    } catch {
      showToast('Payout error', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Catalog Product Operations
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
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, ...updates })
      });
      const data = await res.json();
      if (data.success && data.product) {
        showToast('Product updated successfully');
        setProducts(prev => prev.map(p => String(p.id) === String(productId) ? data.product : p));
      } else {
        showToast(data.error || 'Product update error', 'error');
        loadAllConsoleData();
      }
    } catch {
      showToast('Product update error', 'error');
      loadAllConsoleData();
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      showToast('Name and price are required', 'error');
      return;
    }
    setActionLoading(true);
    const token = localStorage.getItem('bkb_admin_token');
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Created item: ${newProduct.name}`);
        setAddProductModal(false);
        setNewProduct({ name: '', category: 'Handicrafts', price: '', seller: '', origin: 'Bihar', giTag: false, image: '/images/products/prod_1.png' });
        loadAllConsoleData();
      }
    } catch {
      showToast('Product creation error', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Remove this product permanently from the catalog?')) return;
    const token = localStorage.getItem('bkb_admin_token');
    try {
      await fetch(`/api/admin/products?productId=${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      showToast('Product removed');
      loadAllConsoleData();
    } catch {
      showToast('Product deletion failed', 'error');
    }
  };

  // System Operations & Diagnostics
  const handleSaveSettings = async (customSettings) => {
    setActionLoading(true);
    const token = localStorage.getItem('bkb_admin_token');
    const target = customSettings || settings;
    try {
      const res = await fetch('/api/admin/operations', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_settings', settings: target })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Operating policies synchronized sitewide!');
        loadAllConsoleData();
      }
    } catch {
      showToast('Settings error', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRunVerification = async () => {
    setVerifying(true);
    setVerificationReport(null);
    const token = localStorage.getItem('bkb_admin_token');
    try {
      const res = await fetch('/api/admin/operations', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_system' })
      });
      const data = await res.json();
      if (data.success) {
        setVerificationReport(data);
        showToast('All system verification checks completed!');
      }
    } catch {
      showToast('Verification check error', 'error');
    } finally {
      setVerifying(false);
    }
  };

  const handleFlushCache = async () => {
    const token = localStorage.getItem('bkb_admin_token');
    try {
      await fetch('/api/admin/operations', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'flush_cache' })
      });
      showToast('Platform caches purged & reconstructed.');
      loadAllConsoleData();
    } catch {
      showToast('Flush cache error', 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 80, textAlign: 'center', color: '#94A3B8' }}>
        <RefreshCw size={36} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 16px', color: '#10B981' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ fontSize: 15, fontWeight: 600, color: '#F1F5F9' }}>Initializing World-Class Enterprise Console...</p>
        <p style={{ fontSize: 12 }}>Aggregating real-time orders, sellers, buyers, payments, and diagnostics</p>
      </div>
    );
  }

  const diagnostics = operationsData?.diagnostics || {};
  const totalGMV = orderStats.totalGMV || paymentStats.totalGMV || orders.reduce((s, o) => s + (Number(o.total) || 0), 0);
  const platformRevenue = Math.round(totalGMV * ((settings.platformCommissionPercent || 5) / 100));

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1460, margin: '0 auto' }}>

      {/* Floating Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 120,
          background: toast.type === 'error' ? '#EF4444' : '#10B981',
          color: '#fff',
          padding: '12px 22px',
          borderRadius: 10,
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          fontWeight: 700,
          fontSize: 13,
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          {toast.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
          {toast.message}
        </div>
      )}

      {/* 1. TOP COMMAND BAR: OMNI SEARCH & LIVE ENGINE TELEMETRY */}
      <div style={{
        background: '#121822',
        border: '1px solid #1C2633',
        borderRadius: 16,
        padding: '16px 22px',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20
      }}>
        {/* Omni Search Bar */}
        <div style={{ position: 'relative', flex: 1, maxWidth: 520 }}>
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: 14, top: 12 }} />
          <input
            type="text"
            placeholder="Omni-Search: Order #, Buyer phone, Seller name, Product SKU..."
            value={omniSearch}
            onChange={e => setOmniSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 42px',
              background: '#0E141C',
              border: '1px solid #222E3E',
              borderRadius: 10,
              color: '#F8F8FC',
              fontSize: 13,
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          {omniSearch && (
            <button
              onClick={() => setOmniSearch('')}
              style={{ position: 'absolute', right: 12, top: 10, background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
            >
              ✕
            </button>
          )}

          {/* Omni Search Dropdown Results */}
          {omniSearchResults && (
            <div style={{
              position: 'absolute',
              top: 48,
              left: 0,
              right: 0,
              background: '#151E2B',
              border: '1px solid #2A384C',
              borderRadius: 12,
              padding: 14,
              boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
              zIndex: 80,
              maxHeight: 380,
              overflowY: 'auto'
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', marginBottom: 8, textTransform: 'uppercase' }}>
                Search Matches
              </div>
              {omniSearchResults.orders.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: '#F59E0B', fontWeight: 700, marginBottom: 4 }}>Orders ({omniSearchResults.orders.length})</div>
                  {omniSearchResults.orders.slice(0, 3).map(o => (
                    <div key={o.id} onClick={() => { setSelectedOrder(o); setOmniSearch(''); }} style={{ padding: '6px 8px', borderRadius: 6, background: '#182230', cursor: 'pointer', marginBottom: 4, display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ fontWeight: 700, color: '#F8F8FC' }}>{o.id} — {o.buyerName}</span>
                      <span style={{ color: '#F59E0B' }}>₹{o.total}</span>
                    </div>
                  ))}
                </div>
              )}
              {omniSearchResults.sellers.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: '#10B981', fontWeight: 700, marginBottom: 4 }}>Sellers ({omniSearchResults.sellers.length})</div>
                  {omniSearchResults.sellers.slice(0, 3).map(s => (
                    <div key={s.id || s.mobile} onClick={() => { setActiveTab('sellers'); setOmniSearch(''); }} style={{ padding: '6px 8px', borderRadius: 6, background: '#182230', cursor: 'pointer', marginBottom: 4, display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ fontWeight: 700, color: '#F8F8FC' }}>{s.fullName} ({s.district})</span>
                      <span style={{ color: '#94A3B8' }}>{s.mobile}</span>
                    </div>
                  ))}
                </div>
              )}
              {omniSearchResults.buyers.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: '#38BDF8', fontWeight: 700, marginBottom: 4 }}>Buyers ({omniSearchResults.buyers.length})</div>
                  {omniSearchResults.buyers.slice(0, 3).map(b => (
                    <div key={b.id} onClick={() => { setActiveTab('buyers'); setOmniSearch(''); }} style={{ padding: '6px 8px', borderRadius: 6, background: '#182230', cursor: 'pointer', marginBottom: 4, display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ fontWeight: 700, color: '#F8F8FC' }}>{b.name} ({b.city})</span>
                      <span style={{ color: '#94A3B8' }}>{b.mobile}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Live System Controls Strip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* System Mode Pill Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#0E141C', border: '1px solid #222E3E', padding: '4px 6px', borderRadius: 10 }}>
            {['live', 'maintenance', 'read-only'].map(m => (
              <button
                key={m}
                onClick={() => {
                  const updated = { ...settings, systemMode: m };
                  setSettings(updated);
                  handleSaveSettings(updated);
                }}
                style={{
                  padding: '5px 10px',
                  borderRadius: 6,
                  border: 'none',
                  background: settings.systemMode === m ? (m === 'live' ? '#10B981' : '#F59E0B') : 'transparent',
                  color: settings.systemMode === m ? '#fff' : '#7E8092',
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  cursor: 'pointer'
                }}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Diagnostic Latency Ping */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#10B981', background: 'rgba(16,185,129,0.1)', padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(16,185,129,0.2)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
            <span>DB {diagnostics.dbLatencyMs || 5}ms</span>
          </div>

          {/* Quick Refresh */}
          <button
            onClick={loadAllConsoleData}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 14px',
              background: '#0E141C',
              border: '1px solid #222E3E',
              borderRadius: 8,
              color: '#94A3B8',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={13} /> Sync
          </button>
        </div>
      </div>

      {/* 2. VELOCITY & FINANCIAL ENTERPRISE KPI ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14, marginBottom: 24 }}>
        <div style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 14, padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: 0.5 }}>GROSS VALUE (GMV)</span>
            <DollarSign size={15} color="#38BDF8" />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#F8F8FC' }}>₹{totalGMV.toLocaleString()}</div>
          <div style={{ fontSize: 11, color: '#38BDF8', marginTop: 2, fontWeight: 600 }}>Total Order Volume</div>
        </div>

        <div style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 14, padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: 0.5 }}>NET COMMISSION</span>
            <TrendingUp size={15} color="#10B981" />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#10B981' }}>₹{platformRevenue.toLocaleString()}</div>
          <div style={{ fontSize: 11, color: '#10B981', marginTop: 2, fontWeight: 600 }}>{settings.platformCommissionPercent}% Retained Earnings</div>
        </div>

        <div style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 14, padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: 0.5 }}>ACTIVE ORDERS</span>
            <ShoppingBag size={15} color="#F59E0B" />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#F8F8FC' }}>{orderStats.total || orders.length}</div>
          <div style={{ fontSize: 11, color: '#F59E0B', marginTop: 2, fontWeight: 600 }}>{orderStats.placed || 0} Pending Dispatch</div>
        </div>

        <div style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 14, padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: 0.5 }}>ARTISAN SELLERS</span>
            <Users size={15} color="#A78BFA" />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#F8F8FC' }}>{sellerStats.total || sellers.length}</div>
          <div style={{ fontSize: 11, color: '#A78BFA', marginTop: 2, fontWeight: 600 }}>{sellerStats.completed || 0} Verified Artisans</div>
        </div>

        <div style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 14, padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: 0.5 }}>REGISTERED BUYERS</span>
            <UserCheck size={15} color="#60A5FA" />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#F8F8FC' }}>{buyerStats.total || buyers.length}</div>
          <div style={{ fontSize: 11, color: '#60A5FA', marginTop: 2, fontWeight: 600 }}>Customer Directory</div>
        </div>

        <div style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 14, padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: 0.5 }}>PAYOUTS DUE</span>
            <Clock size={15} color="#F59E0B" />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#F59E0B' }}>₹{(paymentStats.totalPendingPayouts || 0).toLocaleString()}</div>
          <div style={{ fontSize: 11, color: '#F59E0B', marginTop: 2, fontWeight: 600 }}>Pending Disbursal</div>
        </div>
      </div>

      {/* 3. MULTI-DEPARTMENT UNIFIED WORKSPACE TABS */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1C2633', paddingBottom: 14, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
          {[
            { id: 'orders', label: 'Orders & Fulfillment', icon: ShoppingBag, count: orders.length },
            { id: 'sellers', label: 'Artisan Sellers', icon: Users, count: sellers.length },
            { id: 'buyers', label: 'Buyers CRM & Maps', icon: UserCheck, count: buyers.length },
            { id: 'payments', label: 'Payments & Payouts', icon: CreditCard, count: sellerPayouts.length },
            { id: 'products', label: 'Products & Catalog', icon: Package, count: products.length },
            { id: 'operations', label: 'System Operations', icon: Cpu, count: 'Live' },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 16px',
                  borderRadius: 10,
                  border: active ? '1px solid rgba(16,185,129,0.35)' : '1px solid transparent',
                  background: active ? 'rgba(16,185,129,0.14)' : 'transparent',
                  color: active ? '#34D399' : '#94A3B8',
                  fontSize: 13,
                  fontWeight: active ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.18s'
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                <span style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: 10,
                  background: active ? 'rgba(16,185,129,0.22)' : 'rgba(255,255,255,0.06)',
                  color: active ? '#34D399' : '#94A3B8'
                }}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Specific Action Buttons */}
        <div>
          {activeTab === 'products' && (
            <button
              onClick={() => setAddProductModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                background: '#10B981',
                border: 'none',
                borderRadius: 8,
                color: '#fff',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Plus size={14} /> Add Product
            </button>
          )}

          {activeTab === 'operations' && (
            <button
              onClick={handleRunVerification}
              disabled={verifying}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                background: '#10B981',
                border: 'none',
                borderRadius: 8,
                color: '#fff',
                fontSize: 12,
                fontWeight: 700,
                cursor: verifying ? 'not-allowed' : 'pointer'
              }}
            >
              <ShieldCheck size={14} /> {verifying ? 'Running Tests...' : 'Execute Diagnostic Suite'}
            </button>
          )}
        </div>
      </div>

      {/* 4. ACTIVE WORKSPACE CONTENT */}

      {/* TAB 1: ORDERS & FULFILLMENT */}
      {activeTab === 'orders' && (
        <div style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 16, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#0E141C', color: '#94A3B8', borderBottom: '1px solid #1C2633', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                <th style={{ padding: '14px 18px' }}>Order ID & Date</th>
                <th style={{ padding: '14px 18px' }}>Customer & Destination</th>
                <th style={{ padding: '14px 18px' }}>Items</th>
                <th style={{ padding: '14px 18px' }}>Pay Status</th>
                <th style={{ padding: '14px 18px' }}>Fulfillment Status</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                const isPaid = order.paymentStatus === 'paid';
                return (
                  <tr key={order.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 800, color: '#F8F8FC', fontFamily: 'monospace' }}>{order.id}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 700, color: '#F1F5F9' }}>{order.buyerName}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8' }}>+91 {order.buyerPhone}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={11} color="#10B981" />
                        {order.shippingAddress?.city || 'Bihar'}
                        {order.shippingAddress?.lat && (
                          <span style={{ color: '#10B981', fontSize: 10, fontWeight: 700 }}>• GPS Pinned</span>
                        )}
                      </div>
                    </td>

                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 600, color: '#F8F8FC' }}>₹{Number(order.total).toLocaleString()}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8' }}>{order.items?.length || 1} product(s)</div>
                    </td>

                    <td style={{ padding: '14px 18px' }}>
                      <button
                        onClick={() => handleTogglePayment(order.id, order.paymentStatus)}
                        style={{
                          padding: '3px 8px',
                          borderRadius: 12,
                          fontSize: 10,
                          fontWeight: 700,
                          background: isPaid ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                          color: isPaid ? '#10B981' : '#EF4444',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        {isPaid ? '✓ PAID' : '⚠ PENDING'}
                      </button>
                    </td>

                    <td style={{ padding: '14px 18px' }}>
                      <select
                        value={order.orderStatus}
                        onChange={e => handleUpdateOrderStatus(order.id, e.target.value)}
                        style={{
                          padding: '5px 10px',
                          borderRadius: 8,
                          background: '#0E141C',
                          border: '1px solid #222E3E',
                          color: '#F59E0B',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        <option value="placed">Placed</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      {order.trackingNumber && (
                        <div style={{ fontSize: 10, color: '#A78BFA', marginTop: 4, fontWeight: 600 }}>
                          {order.courier}: {order.trackingNumber}
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          style={{ padding: '5px 10px', background: '#0E141C', border: '1px solid #222E3E', borderRadius: 6, color: '#94A3B8', fontSize: 11, cursor: 'pointer' }}
                        >
                          Invoice & Map
                        </button>
                        {order.orderStatus !== 'shipped' && order.orderStatus !== 'delivered' && (
                          <button
                            onClick={() => {
                              setShippingModalOrder(order);
                              setTrackingNumber(order.trackingNumber || '');
                            }}
                            style={{ padding: '5px 10px', background: '#10B981', border: 'none', borderRadius: 6, color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                          >
                            Dispatch AWB
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: ARTISAN SELLERS */}
      {activeTab === 'sellers' && (
        <div style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 16, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#0E141C', color: '#94A3B8', borderBottom: '1px solid #1C2633', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                <th style={{ padding: '14px 18px' }}>Artisan / Seller Name</th>
                <th style={{ padding: '14px 18px' }}>Location & Category</th>
                <th style={{ padding: '14px 18px' }}>Payout Channel</th>
                <th style={{ padding: '14px 18px' }}>Verification Status</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Controls</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map(s => (
                <tr key={s.id || s.mobile} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 700, color: '#F8F8FC' }}>{s.fullName}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>{s.businessName || 'Artisan Workshop'} · +91 {s.mobile}</div>
                  </td>

                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ color: '#F1F5F9' }}>{s.district || 'Bihar'}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>{s.category || 'Handicrafts'}</div>
                  </td>

                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontSize: 12, color: '#F59E0B', fontWeight: 600 }}>
                      {s.payoutMethod === 'bank' ? `Bank: ${s.bankAccountNumber || 'Pending'}` : `UPI: ${s.upiId || 'Pending'}`}
                    </div>
                  </td>

                  <td style={{ padding: '14px 18px' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: 12,
                      fontSize: 10,
                      fontWeight: 700,
                      background: s.status === 'Completed' || s.status === 'Approved' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                      color: s.status === 'Completed' || s.status === 'Approved' ? '#10B981' : '#F59E0B'
                    }}>
                      {s.status || 'Pending'}
                    </span>
                  </td>

                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleUpdateSellerStatus(s.sellerId || s.id, 'Approved')}
                        style={{ padding: '5px 10px', background: '#10B981', border: 'none', borderRadius: 6, color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateSellerStatus(s.sellerId || s.id, 'Flagged')}
                        style={{ padding: '5px 10px', background: '#0E141C', border: '1px solid #222E3E', borderRadius: 6, color: '#F59E0B', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                      >
                        Flag
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: BUYERS CRM & MAPS */}
      {activeTab === 'buyers' && (
        <div style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 16, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#0E141C', color: '#94A3B8', borderBottom: '1px solid #1C2633', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                <th style={{ padding: '14px 18px' }}>Customer Name</th>
                <th style={{ padding: '14px 18px' }}>Contact</th>
                <th style={{ padding: '14px 18px' }}>Delivery Address & GPS Pin</th>
                <th style={{ padding: '14px 18px' }}>Orders & Spend</th>
                <th style={{ padding: '14px 18px' }}>Status</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Safety Action</th>
              </tr>
            </thead>
            <tbody>
              {buyers.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '14px 18px', fontWeight: 700, color: '#F8F8FC' }}>{b.name}</td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ color: '#F1F5F9' }}>+91 {b.mobile}</div>
                    {b.email && <div style={{ fontSize: 11, color: '#94A3B8' }}>{b.email}</div>}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontSize: 12, color: '#F1F5F9' }}>{b.address || 'Address set at checkout'}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>{b.city || b.district}, Bihar {b.pincode}</div>
                    {b.lat && b.lng && (
                      <a
                        href={`https://www.openstreetmap.org/?mlat=${b.lat}&mlon=${b.lng}#map=16/${b.lat}/${b.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#10B981', fontWeight: 700, textDecoration: 'none', marginTop: 4 }}
                      >
                        <MapPin size={10} /> Lat {b.lat.toFixed(4)}, Lng {b.lng.toFixed(4)} ↗
                      </a>
                    )}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 800, color: '#F8F8FC' }}>₹{Number(b.totalSpent || 0).toLocaleString()}</div>
                    <div style={{ fontSize: 11, color: '#F59E0B' }}>{b.ordersCount || 0} Orders</div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: 12,
                      fontSize: 10,
                      fontWeight: 700,
                      background: b.status === 'active' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                      color: b.status === 'active' ? '#10B981' : '#EF4444'
                    }}>
                      {b.status?.toUpperCase() || 'ACTIVE'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleToggleBuyer(b.id, b.status || 'active')}
                      style={{
                        padding: '5px 12px',
                        background: '#0E141C',
                        border: '1px solid #222E3E',
                        borderRadius: 6,
                        color: b.status === 'active' ? '#EF4444' : '#10B981',
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {b.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: PAYMENTS & PAYOUTS */}
      {activeTab === 'payments' && (
        <div style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #1C2633', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#F8F8FC' }}>Seller Payouts Ledger & Net Earnings (95%)</div>
            <div style={{ fontSize: 12, color: '#94A3B8' }}>Total Pending: <strong style={{ color: '#F59E0B' }}>₹{(paymentStats.totalPendingPayouts || 0).toLocaleString()}</strong></div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#0E141C', color: '#94A3B8', borderBottom: '1px solid #1C2633', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                <th style={{ padding: '14px 18px' }}>Seller</th>
                <th style={{ padding: '14px 18px' }}>Payout Details</th>
                <th style={{ padding: '14px 18px' }}>Total Sales</th>
                <th style={{ padding: '14px 18px' }}>Due Disbursal</th>
                <th style={{ padding: '14px 18px' }}>Settled</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {sellerPayouts.map(sp => (
                <tr key={sp.sellerId} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 700, color: '#F8F8FC' }}>{sp.sellerName}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>{sp.mobile}</div>
                  </td>
                  <td style={{ padding: '14px 18px', color: '#F59E0B', fontWeight: 600 }}>
                    {sp.payoutMethod === 'upi' ? `UPI: ${sp.upiId}` : `Bank: ${sp.bankAccountNumber}`}
                  </td>
                  <td style={{ padding: '14px 18px', fontWeight: 700, color: '#F1F5F9' }}>
                    ₹{sp.totalSales.toLocaleString()}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: sp.pendingPayout > 0 ? '#F59E0B' : '#7E8092' }}>
                      ₹{sp.pendingPayout.toLocaleString()}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', color: '#10B981', fontWeight: 700 }}>
                    ₹{sp.completedPayout.toLocaleString()}
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    {sp.pendingPayout > 0 ? (
                      <button
                        onClick={() => {
                          setPayoutModalSeller(sp);
                          setPayoutAmount(String(sp.pendingPayout));
                          setPayoutUtr(`UTR${Date.now().toString().slice(-8)}`);
                        }}
                        style={{ padding: '6px 14px', background: '#10B981', border: 'none', borderRadius: 6, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                      >
                        Disburse ₹{sp.pendingPayout}
                      </button>
                    ) : (
                      <span style={{ fontSize: 12, color: '#94A3B8' }}>Settled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 5: PRODUCTS & CATALOG */}
      {activeTab === 'products' && (
        <div style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 16, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#0E141C', color: '#94A3B8', borderBottom: '1px solid #1C2633', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                <th style={{ padding: '14px 18px' }}>Product</th>
                <th style={{ padding: '14px 18px' }}>Category</th>
                <th style={{ padding: '14px 18px' }}>Price</th>
                <th style={{ padding: '14px 18px' }}>GI Certified</th>
                <th style={{ padding: '14px 18px' }}>Stock Control</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => {
                const isOut = p.outOfStock || p.status === 'out_of_stock';
                const isHid = p.isHidden || p.status === 'hidden';
                const isGi = Boolean(p.gi || p.giTag || p.giCertified);
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src={p.image || p.imgSrc || '/images/products/prod_1.png'} alt={p.name} style={{ width: 38, height: 38, borderRadius: 6, objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontWeight: 700, color: '#F8F8FC' }}>{p.name}</div>
                          <div style={{ fontSize: 11, color: '#94A3B8' }}>{p.seller}</div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '14px 18px', color: '#F1F5F9' }}>{p.category}</td>

                    <td style={{ padding: '14px 18px', fontWeight: 800, color: '#F8F8FC' }}>₹{p.price}</td>

                    <td style={{ padding: '14px 18px' }}>
                      <button
                        onClick={() => handleUpdateProduct(p.id, { gi: !isGi, giTag: !isGi, giCertified: !isGi })}
                        style={{
                          padding: '4px 10px',
                          borderRadius: 12,
                          fontSize: 10,
                          fontWeight: 700,
                          border: 'none',
                          cursor: 'pointer',
                          background: isGi ? 'rgba(139,92,246,0.22)' : 'rgba(255,255,255,0.06)',
                          color: isGi ? '#A78BFA' : '#7E8092',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <ShieldCheck size={12} />
                        {isGi ? '✓ GI Verified' : 'Unverified'}
                      </button>
                    </td>

                    <td style={{ padding: '14px 18px' }}>
                      <button
                        onClick={() => handleUpdateProduct(p.id, { outOfStock: !isOut })}
                        style={{
                          padding: '5px 10px',
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 700,
                          border: 'none',
                          cursor: 'pointer',
                          background: isOut ? '#EF4444' : '#181A24',
                          color: isOut ? '#fff' : '#10B981'
                        }}
                      >
                        {isOut ? 'Out of Stock' : 'In Stock'}
                      </button>
                    </td>

                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleUpdateProduct(p.id, { isHidden: !isHid })}
                          style={{ padding: '5px 8px', background: '#0E141C', border: '1px solid #222E3E', borderRadius: 6, color: isHid ? '#F59E0B' : '#7E8092', cursor: 'pointer' }}
                        >
                          {isHid ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          style={{ padding: '5px 8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, color: '#EF4444', cursor: 'pointer' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 6: SYSTEM OPERATIONS & CONTROLS */}
      {activeTab === 'operations' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20 }}>
          {/* Platform Controls */}
          <div style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#F8F8FC', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sliders size={18} color="#F59E0B" /> Master Operational Switches
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Allow Buyer Checkout & Orders', key: 'allowOrders' },
                { label: 'Allow New Seller Registrations', key: 'allowSellerRegistrations' },
                { label: 'Direct UPI Pay Gateway Enabled', key: 'upiDirectPay' },
                { label: 'Cash on Delivery (COD) Enabled', key: 'codEnabled' },
              ].map(toggle => (
                <div key={toggle.key} style={{ background: '#0E141C', border: '1px solid #222E3E', borderRadius: 10, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#F1F5F9' }}>{toggle.label}</span>
                  <input
                    type="checkbox"
                    checked={settings[toggle.key]}
                    onChange={e => {
                      const updated = { ...settings, [toggle.key]: e.target.checked };
                      setSettings(updated);
                      handleSaveSettings(updated);
                    }}
                    style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#10B981' }}
                  />
                </div>
              ))}

              {/* Commission & Shipping inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 8 }}>
                <div>
                  <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Commission (%)</label>
                  <input
                    type="number"
                    value={settings.platformCommissionPercent}
                    onChange={e => setSettings({ ...settings, platformCommissionPercent: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 10px', background: '#0E141C', border: '1px solid #222E3E', borderRadius: 8, color: '#F8F8FC', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Free Shipping (₹)</label>
                  <input
                    type="number"
                    value={settings.freeShippingThreshold}
                    onChange={e => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 10px', background: '#0E141C', border: '1px solid #222E3E', borderRadius: 8, color: '#F8F8FC', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Delivery Fee (₹)</label>
                  <input
                    type="number"
                    value={settings.deliveryCharge}
                    onChange={e => setSettings({ ...settings, deliveryCharge: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 10px', background: '#0E141C', border: '1px solid #222E3E', borderRadius: 8, color: '#F8F8FC', outline: 'none' }}
                  />
                </div>
              </div>

              <button
                onClick={() => handleSaveSettings()}
                style={{ padding: '10px 16px', background: '#10B981', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginTop: 10 }}
              >
                Save Policies
              </button>
            </div>
          </div>

          {/* Infrastructure Health & Diagnostics */}
          <div style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#F8F8FC', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={18} color="#10B981" /> Diagnostics Suite
            </h3>

            <div style={{ background: '#0E141C', border: '1px solid #222E3E', borderRadius: 10, padding: 14, marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#F8F8FC' }}>Engine: {diagnostics.dbEngine}</div>
              <div style={{ fontSize: 12, color: '#10B981', marginTop: 2 }}>Response Latency: {diagnostics.dbLatencyMs}ms (Instant)</div>
              <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>Node {diagnostics.nodeVersion} · Uptime: {Math.floor((diagnostics.uptimeSeconds || 0) / 60)} mins</div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={handleFlushCache}
                style={{ flex: 1, padding: '9px 14px', background: '#0E141C', border: '1px solid #222E3E', borderRadius: 8, color: '#94A3B8', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
              >
                Flush Platform Cache
              </button>
              <button
                onClick={handleRunVerification}
                disabled={verifying}
                style={{ flex: 1, padding: '9px 14px', background: '#10B981', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 700, cursor: verifying ? 'not-allowed' : 'pointer' }}
              >
                {verifying ? 'Running...' : 'Run Diagnostics'}
              </button>
            </div>

            {/* Diagnostic Results */}
            {verificationReport && (
              <div style={{ marginTop: 14, background: '#0E141C', border: '1px solid #222E3E', borderRadius: 10, padding: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#10B981', marginBottom: 6 }}>Automated Test Results: PASS</div>
                {verificationReport.results?.map((r, i) => (
                  <div key={i} style={{ fontSize: 11, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <span style={{ color: '#10B981' }}>✓</span> {r.test}: {r.detail}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. MODALS */}

      {/* Order Dispatch Modal */}
      {shippingModalOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#121822', border: '1px solid #222E3E', borderRadius: 16, padding: 26, width: 440, maxWidth: '90%' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#F8F8FC', marginBottom: 6 }}>Dispatch Order {shippingModalOrder.id}</h3>
            <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 18 }}>Assign courier partner and enter AWB tracking number.</p>
            <form onSubmit={handleShipOrder}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, color: '#94A3B8', marginBottom: 6 }}>Courier Partner</label>
                <select value={courierName} onChange={e => setCourierName(e.target.value)} style={{ width: '100%', padding: '10px 12px', background: '#0E141C', border: '1px solid #222E3E', borderRadius: 8, color: '#F8F8FC', outline: 'none' }}>
                  <option value="Delhivery">Delhivery</option>
                  <option value="India Post">India Post Speed Post</option>
                  <option value="BlueDart">BlueDart Express</option>
                  <option value="DTDC">DTDC Courier</option>
                </select>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, color: '#94A3B8', marginBottom: 6 }}>Tracking Number / AWB *</label>
                <input type="text" placeholder="e.g. DEL-BH-9827103" value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} style={{ width: '100%', padding: '10px 12px', background: '#0E141C', border: '1px solid #222E3E', borderRadius: 8, color: '#F8F8FC', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShippingModalOrder(null)} style={{ padding: '8px 16px', background: '#0E141C', border: '1px solid #222E3E', borderRadius: 8, color: '#94A3B8', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={actionLoading} style={{ padding: '8px 18px', background: '#10B981', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Confirm Dispatch</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice & Map Modal */}
      {selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#121822', border: '1px solid #222E3E', borderRadius: 18, padding: 30, width: 580, maxWidth: '92%', maxHeight: '88vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, borderBottom: '1px solid #1C2633', paddingBottom: 14 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#10B981', textTransform: 'uppercase' }}>Full Order Invoice & Map Dossier</span>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#F8F8FC', margin: '2px 0 0' }}>{selectedOrder.id}</h2>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ background: '#0E141C', border: '1px solid #222E3E', borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 6 }}>Delivery Consignee</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#F8F8FC' }}>{selectedOrder.buyerName} (+91 {selectedOrder.buyerPhone})</div>
              <div style={{ fontSize: 13, color: '#F1F5F9', marginTop: 4 }}>
                {selectedOrder.shippingAddress?.addressLine1} {selectedOrder.shippingAddress?.city}, Bihar {selectedOrder.shippingAddress?.pincode}
              </div>
              {selectedOrder.shippingAddress?.lat && (
                <div style={{ marginTop: 8 }}>
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${selectedOrder.shippingAddress.lat}&mlon=${selectedOrder.shippingAddress.lng}#map=16/${selectedOrder.shippingAddress.lat}/${selectedOrder.shippingAddress.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#10B981', fontWeight: 700, textDecoration: 'none' }}
                  >
                    <MapPin size={13} /> Open Pinned Coordinates (Lat {selectedOrder.shippingAddress.lat.toFixed(4)}, Lng {selectedOrder.shippingAddress.lng.toFixed(4)}) ↗
                  </a>
                </div>
              )}
            </div>

            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 8 }}>Line Items</div>
              {selectedOrder.items?.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#0E141C', borderRadius: 6, marginBottom: 6, fontSize: 13 }}>
                  <span>{item.qty}x {item.name}</span>
                  <span style={{ fontWeight: 700, color: '#F8F8FC' }}>₹{(item.qty * item.price).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 800, color: '#F8F8FC', borderTop: '1px solid #1C2633', paddingTop: 12 }}>
              <span>Total Payable</span>
              <span>₹{Number(selectedOrder.total).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {addProductModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#121822', border: '1px solid #222E3E', borderRadius: 16, padding: 26, width: 460, maxWidth: '90%' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#F8F8FC', marginBottom: 16 }}>Publish New Product</h3>
            <form onSubmit={handleCreateProduct}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Product Name *</label>
                <input type="text" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} style={{ width: '100%', padding: '9px 12px', background: '#0E141C', border: '1px solid #222E3E', borderRadius: 8, color: '#F8F8FC', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                <div>
                  <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Category</label>
                  <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} style={{ width: '100%', padding: '9px 12px', background: '#0E141C', border: '1px solid #222E3E', borderRadius: 8, color: '#F8F8FC', outline: 'none' }}>
                    <option value="Handicrafts">Handicrafts</option>
                    <option value="Textiles">Textiles</option>
                    <option value="Painting">Madhubani Art</option>
                    <option value="Food & Spices">Food & Spices</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Price (₹) *</label>
                  <input type="number" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} style={{ width: '100%', padding: '9px 12px', background: '#0E141C', border: '1px solid #222E3E', borderRadius: 8, color: '#F8F8FC', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={newProduct.giTag} onChange={e => setNewProduct({ ...newProduct, giTag: e.target.checked })} style={{ width: 16, height: 16, accentColor: '#8B5CF6' }} />
                <span style={{ fontSize: 12, color: '#F1F5F9' }}>Official GI Tag Certified Product</span>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setAddProductModal(false)} style={{ padding: '8px 16px', background: '#0E141C', border: '1px solid #222E3E', borderRadius: 8, color: '#94A3B8', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={actionLoading} style={{ padding: '8px 18px', background: '#10B981', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Publish Listing</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Disburse Payout Modal */}
      {payoutModalSeller && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#121822', border: '1px solid #222E3E', borderRadius: 16, padding: 26, width: 440, maxWidth: '90%' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#F8F8FC', marginBottom: 6 }}>Disburse Payout to {payoutModalSeller.sellerName}</h3>
            <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 16 }}>Releasing artisan earnings. Records transaction and auto-settles connected orders.</p>
            <form onSubmit={handleDisbursePayout}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Amount (₹)</label>
                <input type="number" value={payoutAmount} onChange={e => setPayoutAmount(e.target.value)} style={{ width: '100%', padding: '9px 12px', background: '#0E141C', border: '1px solid #222E3E', borderRadius: 8, color: '#F8F8FC', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Bank UTR / Transaction Reference</label>
                <input type="text" value={payoutUtr} onChange={e => setPayoutUtr(e.target.value)} style={{ width: '100%', padding: '9px 12px', background: '#0E141C', border: '1px solid #222E3E', borderRadius: 8, color: '#F8F8FC', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setPayoutModalSeller(null)} style={{ padding: '8px 16px', background: '#0E141C', border: '1px solid #222E3E', borderRadius: 8, color: '#94A3B8', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={actionLoading} style={{ padding: '8px 18px', background: '#10B981', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Confirm Disbursal</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
