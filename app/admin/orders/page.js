'use client';

import { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Filter,
  Eye,
  MapPin,
  ExternalLink,
  ChevronDown,
  RefreshCw,
  AlertTriangle,
  User,
  Phone,
  FileText,
  DollarSign,
  Video,
  Play,
  ShieldCheck
} from 'lucide-react';

const STATUS_CONFIG = {
  placed: { label: 'Placed', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  confirmed: { label: 'Confirmed', color: '#38BDF8', bg: 'rgba(56,189,248,0.12)' },
  shipped: { label: 'Shipped', color: '#0EA5E9', bg: 'rgba(14,165,233,0.12)' },
  delivered: { label: 'Delivered', color: '#34D399', bg: 'rgba(16,185,129,0.12)' },
  cancelled: { label: 'Cancelled', color: '#F87171', bg: 'rgba(239,68,68,0.12)' },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [toast, setToast] = useState(null);

  // Modals
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [shippingModalOrder, setShippingModalOrder] = useState(null);
  const [courierName, setCourierName] = useState('Delhivery');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [updating, setUpdating] = useState(false);
  const [viewingPackagingVideo, setViewingPackagingVideo] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchOrders = async () => {
    const token = localStorage.getItem('bkb_admin_token');
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter !== 'All') params.set('status', statusFilter);
      if (paymentFilter !== 'All') params.set('payment', paymentFilter);

      const res = await fetch(`/api/admin/orders?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Fetch orders error:', err);
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, paymentFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdating(true);
    const token = localStorage.getItem('bkb_admin_token');
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId,
          action: 'update_status',
          orderStatus: newStatus
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Order marked as ${newStatus}`);
        fetchOrders();
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(data.order);
        }
      } else {
        showToast(data.error || 'Failed to update order status', 'error');
      }
    } catch (err) {
      showToast('Network error while updating status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleShipOrder = async (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      showToast('Please enter a tracking number / AWB', 'error');
      return;
    }

    setUpdating(true);
    const token = localStorage.getItem('bkb_admin_token');
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
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
        showToast(`Order dispatched via ${courierName}! Tracking updated.`);
        setShippingModalOrder(null);
        setTrackingNumber('');
        fetchOrders();
      } else {
        showToast(data.error || 'Failed to dispatch order', 'error');
      }
    } catch (err) {
      showToast('Error recording shipment', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleTogglePayment = async (orderId, currentStatus) => {
    const newStatus = currentStatus === 'paid' ? 'pending' : 'paid';
    const token = localStorage.getItem('bkb_admin_token');
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId,
          action: 'update_payment',
          paymentStatus: newStatus
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Payment marked as ${newStatus.toUpperCase()}`);
        fetchOrders();
      }
    } catch (err) {
      showToast('Failed to toggle payment status', 'error');
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
            Orders & Logistics Center
          </h1>
          <p style={{ fontSize: 13, color: '#94A3B8' }}>
            Live fulfillment, tracking number generation, shipment dispatch, and customer delivery coordinates.
          </p>
        </div>

        <button
          onClick={fetchOrders}
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
          <RefreshCw size={14} /> Refresh Orders
        </button>
      </div>

      {/* Order KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'TOTAL ORDERS', val: stats.total || 0, color: '#38BDF8', bg: 'rgba(56,189,248,0.12)', icon: ShoppingBag },
          { label: 'PENDING ACTION', val: (stats.placed || 0) + (stats.confirmed || 0), color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', icon: Clock },
          { label: 'IN-TRANSIT / SHIPPED', val: stats.shipped || 0, color: '#0EA5E9', bg: 'rgba(14,165,233,0.12)', icon: Truck },
          { label: 'SUCCESSFULLY DELIVERED', val: stats.delivered || 0, color: '#34D399', bg: 'rgba(16,185,129,0.12)', icon: CheckCircle2 },
          { label: 'GROSS ORDER VALUE', val: `₹${(stats.totalGMV || 0).toLocaleString()}`, color: '#10B981', bg: 'rgba(16,185,129,0.12)', icon: DollarSign },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 14, padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 700, letterSpacing: 0.5 }}>{kpi.label}</span>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={14} color={kpi.color} />
                </div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#F8F8FC' }}>{kpi.val}</div>
            </div>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 14, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, maxWidth: 440 }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: 12, top: 12 }} />
            <input
              type="text"
              placeholder="Search by Order ID, Buyer, Mobile, Tracking..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 38px',
                background: '#121822',
                border: '1px solid #222E3E',
                borderRadius: 8,
                color: '#F8F8FC',
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <button type="submit" style={{ padding: '9px 16px', background: '#10B981', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            Filter
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Status pills */}
          <div style={{ display: 'flex', gap: 4, background: '#121822', padding: 4, borderRadius: 8, border: '1px solid #222E3E' }}>
            {['All', 'placed', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  border: 'none',
                  background: statusFilter === st ? '#10B981' : 'transparent',
                  color: statusFilter === st ? '#fff' : '#7E8092',
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'capitalize',
                  cursor: 'pointer'
                }}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Payment filter */}
          <select
            value={paymentFilter}
            onChange={e => setPaymentFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              background: '#121822',
              border: '1px solid #222E3E',
              borderRadius: 8,
              color: '#F8F8FC',
              fontSize: 12,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="All">Payment: All</option>
            <option value="paid">Payment: Paid</option>
            <option value="pending">Payment: Pending</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 16, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#94A3B8' }}>Loading orders pipeline...</div>
        ) : orders.length === 0 ? (
          <div style={{ padding: 50, textAlign: 'center', color: '#94A3B8' }}>
            <ShoppingBag size={40} style={{ margin: '0 auto 12px', color: '#282B3C' }} />
            <div style={{ fontSize: 16, fontWeight: 600, color: '#F1F5F9' }}>No orders found</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Try adjusting your filters or search keywords.</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#121822', color: '#94A3B8', borderBottom: '1px solid #1C2633', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  <th style={{ padding: '14px 18px' }}>Order Details</th>
                  <th style={{ padding: '14px 18px' }}>Buyer & Destination</th>
                  <th style={{ padding: '14px 18px' }}>Products</th>
                  <th style={{ padding: '14px 18px' }}>Amount & Pay</th>
                  <th style={{ padding: '14px 18px' }}>Status & Courier</th>
                  <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => {
                  const statusConf = STATUS_CONFIG[order.orderStatus?.toLowerCase()] || STATUS_CONFIG.placed;
                  const isPaid = order.paymentStatus === 'paid';
                  const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <tr key={order.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      {/* Order Details */}
                      <td style={{ padding: '16px 18px', verticalAlign: 'top' }}>
                        <div style={{ fontWeight: 800, color: '#F8F8FC', fontFamily: 'monospace', fontSize: 14 }}>
                          {order.id}
                        </div>
                        <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 3 }}>
                          {dateStr}
                        </div>
                        <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 4, textTransform: 'uppercase', fontWeight: 700 }}>
                          Method: {order.paymentMethod || 'UPI'}
                        </div>
                      </td>

                      {/* Buyer */}
                      <td style={{ padding: '16px 18px', verticalAlign: 'top' }}>
                        <div style={{ fontWeight: 700, color: '#F1F5F9' }}>{order.buyerName}</div>
                        <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>+91 {order.buyerPhone}</div>
                        <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MapPin size={12} color="#10B981" />
                          {order.shippingAddress?.city || 'Bihar'} {order.shippingAddress?.pincode ? `(${order.shippingAddress.pincode})` : ''}
                        </div>
                        {order.shippingAddress?.lat && (
                          <div style={{ fontSize: 10, color: '#10B981', fontWeight: 600, marginTop: 2 }}>
                            ✓ Mapped GPS Coordinates
                          </div>
                        )}
                      </td>

                      {/* Products */}
                      <td style={{ padding: '16px 18px', verticalAlign: 'top' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {order.items?.map((item, idx) => (
                            <div key={idx} style={{ fontSize: 12, color: '#F1F5F9', display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ fontWeight: 700, color: '#38BDF8' }}>{item.qty}x</span>
                              <span style={{ maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Amount & Payment */}
                      <td style={{ padding: '16px 18px', verticalAlign: 'top' }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color: '#F8F8FC' }}>
                          ₹{Number(order.total).toLocaleString()}
                        </div>
                        <button
                          onClick={() => handleTogglePayment(order.id, order.paymentStatus)}
                          title="Click to toggle payment state"
                          style={{
                            marginTop: 6,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            fontSize: 10,
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: 12,
                            background: isPaid ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                            color: isPaid ? '#10B981' : '#EF4444',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: isPaid ? '#10B981' : '#EF4444' }} />
                          {isPaid ? 'PAID' : 'PENDING PAY'}
                        </button>
                      </td>

                      {/* Status & Courier */}
                      <td style={{ padding: '16px 18px', verticalAlign: 'top' }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '4px 10px',
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 700,
                          background: statusConf.bg,
                          color: statusConf.color
                        }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusConf.color }} />
                          {statusConf.label}
                        </div>

                        {order.trackingNumber ? (
                          <div style={{ fontSize: 11, color: '#8B5CF6', fontWeight: 600, marginTop: 6 }}>
                            {order.courier}: {order.trackingNumber}
                          </div>
                        ) : (
                          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 6 }}>No dispatch details</div>
                        )}

                        {/* Packaging Video Verification Badge */}
                        {order.packagingVideo?.status === 'verified' ? (
                          <button
                            onClick={() => setViewingPackagingVideo(order)}
                            style={{
                              marginTop: 6,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              background: 'rgba(34, 197, 94, 0.15)',
                              color: '#4ADE80',
                              border: '1px solid rgba(34, 197, 94, 0.3)',
                              borderRadius: 6,
                              padding: '3px 8px',
                              fontSize: 10,
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            <Video size={11} /> 360° Video Verified
                          </button>
                        ) : (
                          <div style={{ marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 4, color: '#F59E0B', fontSize: 10, fontWeight: 600 }}>
                            <AlertTriangle size={11} /> No packaging video
                          </div>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td style={{ padding: '16px 18px', verticalAlign: 'top', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            style={{
                              padding: '6px 10px',
                              background: '#121822',
                              border: '1px solid #222E3E',
                              borderRadius: 6,
                              color: '#94A3B8',
                              fontSize: 11,
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4
                            }}
                          >
                            <Eye size={12} /> View
                          </button>

                          {order.orderStatus !== 'shipped' && order.orderStatus !== 'delivered' && (
                            <button
                              onClick={() => {
                                setShippingModalOrder(order);
                                setTrackingNumber(order.trackingNumber || '');
                                setCourierName(order.courier || 'Delhivery');
                              }}
                              style={{
                                padding: '6px 10px',
                                background: '#8B5CF6',
                                border: 'none',
                                borderRadius: 6,
                                color: '#fff',
                                fontSize: 11,
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4
                              }}
                            >
                              <Truck size={12} /> Dispatch
                            </button>
                          )}

                          {order.orderStatus === 'shipped' && (
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'delivered')}
                              style={{
                                padding: '6px 10px',
                                background: '#10B981',
                                border: 'none',
                                borderRadius: 6,
                                color: '#fff',
                                fontSize: 11,
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              Mark Delivered
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
      </div>

      {/* Dispatch / Shipping Modal */}
      {shippingModalOrder && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 90
        }}>
          <div style={{
            background: '#121822',
            border: '1px solid #222E3E',
            borderRadius: 16,
            padding: 28,
            width: 440,
            maxWidth: '90%'
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#F8F8FC', marginBottom: 6 }}>
              Dispatch Order {shippingModalOrder.id}
            </h3>
            <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 16 }}>
              Enter courier partner and AWB tracking identifier to update customer status and trigger dispatch logistics.
            </p>

            {shippingModalOrder.packagingVideo?.status !== 'verified' ? (
              <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 8, padding: 12, marginBottom: 16, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <AlertTriangle size={16} color="#F59E0B" style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontSize: 11, color: '#FDE68A', lineHeight: 1.4 }}>
                  <strong>Missing 360° Packaging Proof:</strong> The seller has not yet recorded the box packaging video. It is strongly recommended to require packaging verification to guarantee no damage disputes.
                </div>
              </div>
            ) : (
              <div style={{ background: 'rgba(34, 197, 94, 0.12)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: 8, padding: 10, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#4ADE80', fontWeight: 700 }}>
                  <ShieldCheck size={14} /> 360° Packaging Video Verified
                </div>
                <button
                  type="button"
                  onClick={() => setViewingPackagingVideo(shippingModalOrder)}
                  style={{ background: 'transparent', border: 'none', color: '#38BDF8', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                >
                  Inspect Video ↗
                </button>
              </div>
            )}

            <form onSubmit={handleShipOrder}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94A3B8', marginBottom: 6 }}>
                  Courier Partner
                </label>
                <select
                  value={courierName}
                  onChange={e => setCourierName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#121822',
                    border: '1px solid #222E3E',
                    borderRadius: 8,
                    color: '#F8F8FC',
                    fontSize: 13,
                    outline: 'none'
                  }}
                >
                  <option value="Delhivery">Delhivery</option>
                  <option value="India Post">India Post Speed Post</option>
                  <option value="BlueDart">BlueDart Express</option>
                  <option value="DTDC">DTDC Courier</option>
                  <option value="Shadowfax">Shadowfax</option>
                </select>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94A3B8', marginBottom: 6 }}>
                  AWB / Tracking Number *
                </label>
                <input
                  type="text"
                  placeholder="e.g. DEL-BH-9827103"
                  value={trackingNumber}
                  onChange={e => setTrackingNumber(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#121822',
                    border: '1px solid #222E3E',
                    borderRadius: 8,
                    color: '#F8F8FC',
                    fontSize: 13,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShippingModalOrder(null)}
                  style={{
                    padding: '9px 16px',
                    background: '#121822',
                    border: '1px solid #222E3E',
                    borderRadius: 8,
                    color: '#94A3B8',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  style={{
                    padding: '9px 20px',
                    background: '#8B5CF6',
                    border: 'none',
                    borderRadius: 8,
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: updating ? 'not-allowed' : 'pointer'
                  }}
                >
                  {updating ? 'Updating...' : 'Confirm Dispatch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Order Invoice / Details Modal */}
      {selectedOrder && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 90
        }}>
          <div style={{
            background: '#121822',
            border: '1px solid #222E3E',
            borderRadius: 18,
            padding: 32,
            width: 600,
            maxWidth: '92%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1px solid #1C2633', paddingBottom: 16 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#10B981', textTransform: 'uppercase' }}>Invoice & Order Detail</span>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#F8F8FC', margin: '4px 0 0' }}>{selectedOrder.id}</h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: 20, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Buyer and Address */}
            <div style={{ background: '#121822', border: '1px solid #222E3E', borderRadius: 12, padding: 18, marginBottom: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <User size={13} color="#10B981" /> Delivery Consignee
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#F8F8FC' }}>{selectedOrder.buyerName}</div>
              <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 2 }}>Phone: +91 {selectedOrder.buyerPhone}</div>
              {selectedOrder.buyerEmail && <div style={{ fontSize: 13, color: '#94A3B8' }}>Email: {selectedOrder.buyerEmail}</div>}
              
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #242738' }}>
                <div style={{ fontSize: 13, color: '#F1F5F9' }}>
                  {selectedOrder.shippingAddress?.addressLine1} {selectedOrder.shippingAddress?.addressLine2}
                </div>
                <div style={{ fontSize: 13, color: '#F1F5F9' }}>
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                </div>
                {selectedOrder.shippingAddress?.lat && selectedOrder.shippingAddress?.lng && (
                  <div style={{ marginTop: 8 }}>
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${selectedOrder.shippingAddress.lat}&mlon=${selectedOrder.shippingAddress.lng}#map=16/${selectedOrder.shippingAddress.lat}/${selectedOrder.shippingAddress.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#10B981',
                        background: 'rgba(16,185,129,0.12)',
                        padding: '4px 10px',
                        borderRadius: 6,
                        textDecoration: 'none'
                      }}
                    >
                      <MapPin size={12} /> View Lat {selectedOrder.shippingAddress.lat.toFixed(4)}, Lng {selectedOrder.shippingAddress.lng.toFixed(4)} on Map ↗
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Line Items */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 10 }}>
                Ordered Products
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#121822', padding: '10px 14px', borderRadius: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={item.imgSrc || '/images/products/prod_1.png'} alt={item.name} style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#F8F8FC' }}>{item.name}</div>
                        <div style={{ fontSize: 11, color: '#94A3B8' }}>Qty: {item.qty} · ₹{item.price} each</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#F8F8FC' }}>
                      ₹{(item.qty * item.price).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Packaging Proof Video Section */}
            <div style={{ background: '#18212F', border: '1px solid #2B384E', borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#F8F8FC', textTransform: 'uppercase' }}>
                  <Video size={14} color="#38BDF8" /> 360° Box Packaging Video Proof
                </div>
                {selectedOrder.packagingVideo?.status === 'verified' ? (
                  <span style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#4ADE80', padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <ShieldCheck size={12} /> Verified
                  </span>
                ) : (
                  <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
                    Pending Video Upload
                  </span>
                )}
              </div>

              {selectedOrder.packagingVideo?.status === 'verified' ? (
                <div>
                  <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 12 }}>
                    The seller has recorded full 360° unedited footage of the items inside the box, safety padding, and tamper tape seal.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0F141C', padding: 10, borderRadius: 8, fontSize: 12 }}>
                    <div style={{ color: '#CBD5E1' }}>
                      <strong>File:</strong> {selectedOrder.packagingVideo.fileName || 'box-recording.mp4'} · {selectedOrder.packagingVideo.fileSize || '14 MB'}
                    </div>
                    <button
                      onClick={() => setViewingPackagingVideo(selectedOrder)}
                      style={{
                        padding: '5px 12px',
                        background: '#0284C7',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5
                      }}
                    >
                      <Play size={11} fill="#fff" /> Watch Video
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: 12, color: '#F59E0B' }}>
                  No packaging video submitted yet. The seller must record and upload the box packing video from their Seller Dashboard before order dispatch.
                </div>
              )}
            </div>

            {/* Total breakdown */}
            <div style={{ background: '#121822', border: '1px solid #222E3E', borderRadius: 12, padding: 16, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#94A3B8', marginBottom: 6 }}>
                <span>Subtotal</span>
                <span>₹{(selectedOrder.subtotal || 0).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#94A3B8', marginBottom: 8 }}>
                <span>Delivery</span>
                <span>{selectedOrder.shipping === 0 ? 'FREE' : `₹${selectedOrder.shipping}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 800, color: '#F8F8FC', borderTop: '1px solid #242738', paddingTop: 8 }}>
                <span>Total Amount</span>
                <span>₹{Number(selectedOrder.total).toLocaleString()}</span>
              </div>
            </div>

            {/* Status change selector */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 12, color: '#94A3B8' }}>
                Quick Change Status:
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {['confirmed', 'shipped', 'delivered', 'cancelled'].map(st => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                    style={{
                      padding: '6px 12px',
                      background: '#121822',
                      border: '1px solid #222E3E',
                      borderRadius: 6,
                      color: '#F1F5F9',
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: 'capitalize',
                      cursor: 'pointer'
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 360° Packaging Proof Video Player Modal for Admin */}
      {viewingPackagingVideo && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div style={{
            background: '#121822',
            border: '1px solid #2B384E',
            borderRadius: 16,
            width: 680,
            maxWidth: '92%',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #1E293B', background: '#0F141C' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldCheck size={18} color="#22C55E" />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#F8F8FC' }}>
                  Admin Quality Control: 360° Packaging Recording — {viewingPackagingVideo.id}
                </span>
              </div>
              <button
                onClick={() => setViewingPackagingVideo(null)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: 18, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: 20 }}>
              <div style={{ width: '100%', height: 340, background: '#000', borderRadius: 10, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <video
                  controls
                  autoPlay
                  playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  src={viewingPackagingVideo.packagingVideo?.url || '/uploads/packaging-videos/sample-packaging-proof.mp4'}
                >
                  Your browser does not support HTML5 video tag.
                </video>
              </div>

              <div style={{ marginTop: 14, background: '#1A2332', padding: 12, borderRadius: 8, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, fontSize: 12, color: '#CBD5E1' }}>
                <div><strong>Seller:</strong> {viewingPackagingVideo.sellerId || 'Registered Artisan'}</div>
                <div><strong>Consignee:</strong> {viewingPackagingVideo.buyerName}</div>
                <div><strong>Uploaded At:</strong> {viewingPackagingVideo.packagingVideo?.uploadedAt || 'N/A'}</div>
                <div><strong>QC Verification:</strong> <span style={{ color: '#22C55E', fontWeight: 700 }}>VERIFIED</span></div>
              </div>

              <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setViewingPackagingVideo(null)}
                  style={{ padding: '8px 20px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
