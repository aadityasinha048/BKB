'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  Landmark, 
  MapPin, 
  ClipboardList, 
  LogOut, 
  Plus, 
  Eye, 
  EyeOff, 
  PackageX, 
  PackageCheck, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export default function SellerDashboardPage() {
  const router = useRouter();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

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

  // Status handler: 'active', 'out_of_stock', 'hidden'
  const handleUpdateProductStatus = async (productId, newStatus) => {
    setActionLoadingId(productId);
    setFeedback(null);
    try {
      const res = await fetch('/api/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: productId,
          sellerId: seller.id,
          status: newStatus
        })
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.map(p => {
          if (String(p.id) === String(productId)) {
            return {
              ...p,
              status: newStatus,
              outOfStock: newStatus === 'out_of_stock',
              isHidden: newStatus === 'hidden'
            };
          }
          return p;
        }));

        let msg = 'Product is now Live & In Stock';
        if (newStatus === 'out_of_stock') msg = 'Product marked as Out of Stock';
        if (newStatus === 'hidden') msg = 'Product is now Hidden / On Hold (not visible to buyers)';

        setFeedback({ type: 'success', message: msg });
        setTimeout(() => setFeedback(null), 4000);
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to update product status.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Network error updating product.' });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete handler
  const handleDeleteProduct = async (productId) => {
    setActionLoadingId(productId);
    setFeedback(null);
    try {
      const res = await fetch(`/api/products?id=${encodeURIComponent(productId)}&sellerId=${encodeURIComponent(seller.id)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.filter(p => String(p.id) !== String(productId)));
        setDeleteConfirmId(null);
        setFeedback({ type: 'success', message: 'Product deleted permanently.' });
        setTimeout(() => setFeedback(null), 4000);
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to delete product.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Network error deleting product.' });
    } finally {
      setActionLoadingId(null);
    }
  };

  if (!checkedAuth) {
    return (
      <div style={{ background: '#FFFCF8', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: 16, color: '#8C7B6E', fontWeight: 600 }}>Verifying credentials...</p>
      </div>
    );
  }

  const statusColors = {
    'Completed': { bg: '#EAF5F0', color: '#1A5C38', text: 'Registration Under Review' },
    'Account Created': { bg: '#FFF4EC', color: '#C85A08', text: 'In Progress - Complete your registration' },
    'Products Added': { bg: '#FFF8E1', color: '#B7791F', text: 'Products Added - Verification Pending' },
    'Approved': { bg: '#EAF5F0', color: '#1A5C38', text: 'Approved & Active Seller' },
    'Rejected': { bg: '#FDECEA', color: '#D32F2F', text: 'Rejected - Contact support' },
  };

  const currentStatus = statusColors[seller.status] || { bg: '#F5EEE6', color: '#8C7B6E', text: seller.status };

  // Compute product status counts
  const totalCount = products.length;
  const activeCount = products.filter(p => (p.status === 'active' || (!p.status && !p.outOfStock && !p.isHidden))).length;
  const outOfStockCount = products.filter(p => p.status === 'out_of_stock' || p.outOfStock).length;
  const hiddenCount = products.filter(p => p.status === 'hidden' || p.isHidden).length;

  const filteredProducts = products.filter(p => {
    const isOut = p.status === 'out_of_stock' || p.outOfStock;
    const isHid = p.status === 'hidden' || p.isHidden;
    const isAct = !isOut && !isHid;

    if (statusFilter === 'active') return isAct;
    if (statusFilter === 'out_of_stock') return isOut;
    if (statusFilter === 'hidden') return isHid;
    return true;
  });

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

      <div style={{ padding: '36px 60px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28, alignItems: 'start' }}>
        
        {/* Left Side: Listings & Inventory Controls */}
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

          {/* Feedback message */}
          {feedback && (
            <div style={{
              background: feedback.type === 'success' ? '#EAF5F0' : '#FDECEA',
              border: `1.5px solid ${feedback.type === 'success' ? '#1A5C38' : '#D32F2F'}30`,
              color: feedback.type === 'success' ? '#1A5C38' : '#D32F2F',
              borderRadius: 12,
              padding: '12px 18px',
              fontSize: 13,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Active Listings Grid */}
          <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 20, padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 14 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1A1410', fontFamily: "'Playfair Display', serif", margin: 0 }}>
                  Products & Inventory ({products.length})
                </h2>
                <p style={{ fontSize: 12, color: '#8C7B6E', marginTop: 3 }}>
                  Manage stock availability, hide items on hold, or remove products from the marketplace
                </p>
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

            {/* Inventory Filter Tabs */}
            {products.length > 0 && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 22, borderBottom: '1px solid #E8DDD4', paddingBottom: 12, flexWrap: 'wrap' }}>
                {[
                  { id: 'all', label: 'All Items', count: totalCount },
                  { id: 'active', label: 'Live & In Stock', count: activeCount },
                  { id: 'out_of_stock', label: 'Out of Stock', count: outOfStockCount },
                  { id: 'hidden', label: 'Hidden / On Hold', count: hiddenCount },
                ].map(tab => {
                  const isSelected = statusFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setStatusFilter(tab.id)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 20,
                        border: isSelected ? '1.5px solid #C85A08' : '1.5px solid #E8DDD4',
                        background: isSelected ? '#FFF4EC' : '#fff',
                        color: isSelected ? '#C85A08' : '#6B5C50',
                        fontSize: 12,
                        fontWeight: isSelected ? 700 : 500,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        transition: 'all 0.15s'
                      }}
                    >
                      {tab.label} <span style={{ opacity: 0.75, fontSize: 11 }}>({tab.count})</span>
                    </button>
                  );
                })}
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <div style={{ border: '2px dashed #E8DDD4', borderRadius: 16, padding: '48px 24px', textAlign: 'center', background: '#FFFCF8' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#F5EEE6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <ShoppingBag size={28} color="#C85A08" />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1A1410' }}>
                  {products.length === 0 ? 'No products listed yet' : 'No products in this filter'}
                </h3>
                <p style={{ fontSize: 12, color: '#8C7B6E', margin: '6px auto 18px', maxWidth: 320 }}>
                  {products.length === 0 
                    ? 'Add your Bihar-crafted goods to make them live on the public marketplace.'
                    : 'Switch back to "All Items" to view and manage your full inventory.'}
                </p>
                {products.length === 0 ? (
                  <Link href="/sellers/add-product" style={{ textDecoration: 'none' }}>
                    <button style={{ padding: '10px 20px', background: 'none', border: '1.5px solid #C85A08', color: '#C85A08', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                      Create First Listing
                    </button>
                  </Link>
                ) : (
                  <button 
                    onClick={() => setStatusFilter('all')}
                    style={{ padding: '8px 18px', background: 'none', border: '1.5px solid #C85A08', color: '#C85A08', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                    Show All Items
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                {filteredProducts.map(p => {
                  const isOut = p.status === 'out_of_stock' || p.outOfStock;
                  const isHid = p.status === 'hidden' || p.isHidden;
                  const isAct = !isOut && !isHid;
                  const isUpdating = actionLoadingId === p.id;
                  const isConfirmingDelete = deleteConfirmId === p.id;

                  // Status styling
                  let statusBadgeBg = '#EAF5F0';
                  let statusBadgeColor = '#1A5C38';
                  let statusBadgeText = '● Live & In Stock';

                  if (isOut) {
                    statusBadgeBg = '#FFF4EC';
                    statusBadgeColor = '#C85A08';
                    statusBadgeText = '● Out of Stock';
                  } else if (isHid) {
                    statusBadgeBg = '#F1F5F9';
                    statusBadgeColor = '#475569';
                    statusBadgeText = '● Hidden (On Hold)';
                  }

                  return (
                    <div 
                      key={p.id} 
                      style={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        gap: 12, 
                        background: '#FFFCF8', 
                        border: `1.5px solid ${isHid ? '#CBD5E1' : '#E8DDD4'}`, 
                        borderRadius: 16, 
                        padding: 16, 
                        position: 'relative',
                        opacity: isUpdating ? 0.6 : 1,
                        transition: 'all 0.2s'
                      }}
                    >
                      {/* Product Main Row */}
                      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        <div style={{ width: 80, height: 80, borderRadius: 12, overflow: 'hidden', background: '#F5EEE6', flexShrink: 0, position: 'relative' }}>
                          <img src={p.imgSrc} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          {isHid && (
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <EyeOff size={22} color="#fff" />
                            </div>
                          )}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                            <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1410', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {p.name}
                            </div>
                            {p.gi && (
                              <span style={{ fontSize: 9, background: '#FEF8E0', color: '#7A5A08', fontWeight: 800, padding: '2px 7px', borderRadius: 4, textTransform: 'uppercase' }}>
                                GI TAG
                              </span>
                            )}
                          </div>
                          
                          <div style={{ fontSize: 12, color: '#8C7B6E' }}>
                            {p.cat} | Pack: {p.unit}
                          </div>
                          
                          <div style={{ fontSize: 15, fontWeight: 800, color: '#C85A08', marginTop: 4 }}>
                            ₹{p.price}
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div style={{ flexShrink: 0, textAlign: 'right' }}>
                          <span style={{
                            fontSize: 11,
                            background: statusBadgeBg,
                            color: statusBadgeColor,
                            fontWeight: 700,
                            padding: '4px 10px',
                            borderRadius: 20,
                            display: 'inline-block'
                          }}>
                            {statusBadgeText}
                          </span>
                        </div>
                      </div>

                      {/* Management Action Bar */}
                      <div style={{ 
                        borderTop: '1px solid #E8DDD4', 
                        paddingTop: 12, 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 10
                      }}>
                        {/* Status Selector Dropdown */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#4A3F35' }}>Status:</span>
                          <select
                            value={p.status || (isOut ? 'out_of_stock' : (isHid ? 'hidden' : 'active'))}
                            onChange={(e) => handleUpdateProductStatus(p.id, e.target.value)}
                            disabled={isUpdating}
                            style={{
                              padding: '6px 12px',
                              borderRadius: 8,
                              border: '1.5px solid #E8DDD4',
                              background: '#fff',
                              fontSize: 12,
                              fontWeight: 600,
                              color: '#1A1410',
                              cursor: isUpdating ? 'not-allowed' : 'pointer',
                              fontFamily: 'inherit',
                              outline: 'none'
                            }}
                          >
                            <option value="active">Live & In Stock</option>
                            <option value="out_of_stock">Mark Out of Stock</option>
                            <option value="hidden">Hold / Hide from Store</option>
                          </select>
                        </div>

                        {/* Quick action buttons & Delete */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          
                          {/* Quick Toggle: Out of Stock */}
                          <button
                            type="button"
                            onClick={() => handleUpdateProductStatus(p.id, isOut ? 'active' : 'out_of_stock')}
                            disabled={isUpdating}
                            title={isOut ? "Mark this product as In Stock" : "Mark this product as Out of Stock"}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 5,
                              padding: '6px 12px',
                              borderRadius: 8,
                              fontSize: 11,
                              fontWeight: 700,
                              background: isOut ? '#EAF5F0' : '#FFF4EC',
                              color: isOut ? '#1A5C38' : '#C85A08',
                              border: `1px solid ${isOut ? '#1A5C38' : '#C85A08'}30`,
                              cursor: isUpdating ? 'not-allowed' : 'pointer',
                              fontFamily: 'inherit',
                              transition: 'all 0.15s'
                            }}
                          >
                            {isOut ? <PackageCheck size={14} /> : <PackageX size={14} />}
                            {isOut ? 'Mark In Stock' : 'Out of Stock'}
                          </button>

                          {/* Quick Toggle: Hide / On Hold */}
                          <button
                            type="button"
                            onClick={() => handleUpdateProductStatus(p.id, isHid ? 'active' : 'hidden')}
                            disabled={isUpdating}
                            title={isHid ? "Make product visible on global store" : "Hide product from global store list"}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 5,
                              padding: '6px 12px',
                              borderRadius: 8,
                              fontSize: 11,
                              fontWeight: 700,
                              background: isHid ? '#EAF5F0' : '#F1F5F9',
                              color: isHid ? '#1A5C38' : '#475569',
                              border: `1px solid ${isHid ? '#1A5C38' : '#475569'}30`,
                              cursor: isUpdating ? 'not-allowed' : 'pointer',
                              fontFamily: 'inherit',
                              transition: 'all 0.15s'
                            }}
                          >
                            {isHid ? <Eye size={14} /> : <EyeOff size={14} />}
                            {isHid ? 'Make Public' : 'Hide from Store'}
                          </button>

                          {/* Delete Product */}
                          {isConfirmingDelete ? (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#FDECEA', padding: '3px 8px', borderRadius: 8 }}>
                              <span style={{ fontSize: 11, color: '#D32F2F', fontWeight: 700 }}>Confirm?</span>
                              <button
                                type="button"
                                onClick={() => handleDeleteProduct(p.id)}
                                disabled={isUpdating}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: 6,
                                  background: '#D32F2F',
                                  color: '#fff',
                                  border: 'none',
                                  fontSize: 11,
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  fontFamily: 'inherit'
                                }}
                              >
                                Delete
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(null)}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: 6,
                                  background: '#fff',
                                  color: '#6B5C50',
                                  border: '1px solid #E8DDD4',
                                  fontSize: 11,
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  fontFamily: 'inherit'
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(p.id)}
                              disabled={isUpdating}
                              title="Delete product permanently"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                padding: '6px 10px',
                                borderRadius: 8,
                                fontSize: 11,
                                fontWeight: 700,
                                background: '#FFF4F4',
                                color: '#D32F2F',
                                border: '1px solid rgba(211,47,47,0.25)',
                                cursor: isUpdating ? 'not-allowed' : 'pointer',
                                fontFamily: 'inherit',
                                transition: 'all 0.15s'
                              }}
                            >
                              <Trash2 size={13} /> Delete
                            </button>
                          )}

                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Account Details Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Inventory Help Box */}
          <div style={{ background: '#FFFDF9', border: '1.5px solid #E8DDD4', borderRadius: 20, padding: 22 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: '#C85A08', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <HelpCircle size={15} /> Inventory Guide
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12, color: '#6B5C50', lineHeight: 1.55 }}>
              <div>
                <strong style={{ color: '#1A5C38' }}>● Live & In Stock:</strong> Visible on the public store catalog; buyers can order immediately.
              </div>
              <div>
                <strong style={{ color: '#C85A08' }}>● Out of Stock:</strong> Visible to buyers with an "Out of Stock" notice; ordering is paused until you restock.
              </div>
              <div>
                <strong style={{ color: '#475569' }}>● Hidden (On Hold):</strong> Completely hidden from search and catalog. Use when pausing production or seasonal items.
              </div>
              <div>
                <strong style={{ color: '#D32F2F' }}>● Delete:</strong> Permanently removes the listing from your store.
              </div>
            </div>
          </div>

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
              <div><strong>District:</strong> {seller.district || '-'}</div>
              <div><strong>Village/Town:</strong> {seller.villageTown || '-'}</div>
              <div><strong>ZIP/PIN Code:</strong> {seller.pinCode || '-'}</div>
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