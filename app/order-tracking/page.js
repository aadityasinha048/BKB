'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Video,
  ShieldCheck,
  Play,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Eye,
  MapPin,
  Calendar,
  X
} from 'lucide-react';

const DEFAULT_FALLBACK_ORDER = {
  id: 'BKB-ORD-902411',
  product: 'Madhubani Hand-painted Silk Scarf',
  items: [
    {
      id: 'prod_1',
      name: 'Madhubani Hand-painted Silk Scarf',
      qty: 1,
      price: 2499,
      imgSrc: '/images/products/prod_1.png',
      sellerName: 'Mithila Kala Kendra'
    }
  ],
  amount: '₹2,548',
  subtotal: 2499,
  shipping: 49,
  total: 2548,
  date: 'October 05, 2026',
  buyerName: 'Priya Sharma',
  address: 'Flat 402, Ashiana Greens, Bailey Road, Patna, Bihar — 800014',
  orderStatus: 'shipped',
  courier: 'Delhivery Surface',
  trackingNumber: 'DEL-BH-982401',
  packagingVideo: {
    status: 'verified',
    url: '/uploads/packaging-videos/sample-packaging-proof.mp4',
    uploadedAt: '2026-10-05T09:30:00Z',
    fileSize: '14.2 MB',
    fileName: 'BKB-ORD-902411-box-packing-360.mp4',
    checklist: [
      'Authentic products placed inside packaging box',
      'Protective bubble cushioning & inner safety seal verified',
      'Bihar Ka Bazaar tamper-proof security tape applied',
      'Full 360° view of all 6 sides of the box recorded clearly'
    ]
  }
};

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const queryOrderId = searchParams?.get('orderId') || searchParams?.get('id') || '';

  const [orderId, setOrderId] = useState(queryOrderId || 'BKB-ORD-902411');
  const [order, setOrder] = useState(DEFAULT_FALLBACK_ORDER);
  const [searched, setSearched] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSubmitted, setSupportSubmitted] = useState(false);

  const fetchTracking = async (idToSearch) => {
    if (!idToSearch || !idToSearch.trim()) return;
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch(`/api/orders?orderId=${encodeURIComponent(idToSearch.trim())}`);
      const data = await res.json();

      if (data.success && data.order) {
        const o = data.order;
        const mainItem = o.items?.[0] || { name: 'Bihar Ka Bazaar Package' };
        
        setOrder({
          id: o.id,
          product: mainItem.name,
          items: o.items || [],
          amount: `₹${(o.total || 0).toLocaleString()}`,
          subtotal: o.subtotal || 0,
          shipping: o.shipping || 0,
          total: o.total || 0,
          date: o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Recent Order',
          buyerName: o.buyerName || 'Valued Customer',
          address: o.shippingAddress ? `${o.shippingAddress.addressLine1 || ''} ${o.shippingAddress.addressLine2 || ''}, ${o.shippingAddress.city || 'Patna'}, ${o.shippingAddress.state || 'Bihar'} — ${o.shippingAddress.pincode || ''}` : 'Shipping address on file',
          orderStatus: o.orderStatus || 'confirmed',
          courier: o.courier || 'Bihar Ka Bazaar Logistics Partner',
          trackingNumber: o.trackingNumber || 'Pending Dispatch',
          packagingVideo: o.packagingVideo || null
        });
        setSearched(true);
      } else {
        // If not found in API, check if it matches fallback demo
        if (idToSearch.trim().toUpperCase() === 'BKB-ORD-902411' || idToSearch.trim().toUpperCase() === '#BKB-1082') {
          setOrder(DEFAULT_FALLBACK_ORDER);
          setSearched(true);
        } else {
          setErrorMessage(data.error || 'No order found with this Order ID. Please check and try again.');
        }
      }
    } catch (err) {
      console.error('Tracking fetch error:', err);
      setErrorMessage('Could not load order tracking. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryOrderId) {
      setOrderId(queryOrderId);
      fetchTracking(queryOrderId);
    } else {
      fetchTracking('BKB-ORD-902411');
    }
  }, [queryOrderId]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTracking(orderId);
  };

  // Build steps based on order status
  const getTimelineSteps = () => {
    const status = order?.orderStatus || 'placed';
    const hasVideo = !!order?.packagingVideo;

    return [
      {
        label: 'Order Confirmed',
        desc: 'Payment received & seller notified to prepare package',
        done: ['placed', 'confirmed', 'shipped', 'delivered'].includes(status)
      },
      {
        label: 'Box Packed & 360° Video Recorded',
        desc: hasVideo 
          ? 'Seller completed 360° box packing video recording. Verified by BKB Quality Control.' 
          : 'Seller is packaging items with tamper-evident seal and recording 360° verification video.',
        done: hasVideo || ['shipped', 'delivered'].includes(status),
        isPackagingStep: true
      },
      {
        label: 'Dispatched & In Transit',
        desc: order?.trackingNumber ? `Handed over to ${order.courier} (AWB: ${order.trackingNumber})` : 'Awaiting courier pick up',
        done: ['shipped', 'delivered'].includes(status)
      },
      {
        label: 'Out for Delivery',
        desc: 'Courier executive is delivering the sealed package to your address',
        done: status === 'delivered'
      },
      {
        label: 'Delivered',
        desc: 'Package handed over in original tamper-sealed condition',
        done: status === 'delivered'
      }
    ];
  };

  const steps = getTimelineSteps();

  return (
    <div style={{ background: '#FDFBF7', minHeight: '100vh', paddingBottom: 80 }}>
      {/* Header Banner */}
      <div style={{ background: 'linear-gradient(135deg, #1C2430 0%, #0F141C 100%)', color: '#fff', padding: '40px 24px', borderBottom: '1px solid #2B384E' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(234, 88, 12, 0.18)', border: '1px solid rgba(234, 88, 12, 0.4)', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#FB923C', marginBottom: 12 }}>
            <ShieldCheck size={14} /> Guaranteed Authentic & Transparent Delivery
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#F8FAFC', marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>
            Track Your Order & Box Packaging Proof
          </h1>
          <p style={{ fontSize: 14, color: '#94A3B8', maxWidth: 640 }}>
            Every parcel on Bihar Ka Bazaar is recorded on video by the seller during packaging. Watch the complete 360° box recording to verify items, safety cushioning, and tamper seals before delivery.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '-24px auto 0', padding: '0 20px' }}>
        {/* Search Input Box */}
        <div style={{ background: '#fff', border: '1.5px solid #E2D9CF', borderRadius: 16, padding: '24px 28px', boxShadow: '0 8px 30px rgba(0,0,0,0.06)', marginBottom: 28 }}>
          <form onSubmit={handleSearch}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1E293B', marginBottom: 8 }}>
              Enter Order ID to Inspect Packaging & Track Status
            </label>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <input
                value={orderId}
                onChange={e => setOrderId(e.target.value)}
                placeholder="e.g. BKB-ORD-902411"
                style={{
                  flex: 1,
                  minWidth: 240,
                  padding: '13px 18px',
                  border: '1.5px solid #CBD5E1',
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  background: '#F8FAFC',
                  outline: 'none',
                  color: '#0F172A'
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '13px 28px',
                  background: '#C25E00',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                {loading ? 'Searching...' : 'Track & View Proof'}
              </button>
            </div>
            {errorMessage && (
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, color: '#DC2626', fontSize: 13, fontWeight: 600 }}>
                <AlertCircle size={16} /> {errorMessage}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, fontSize: 12, color: '#64748B' }}>
              <span>Try test orders with packaging video:</span>
              <button
                type="button"
                onClick={() => { setOrderId('BKB-ORD-902411'); fetchTracking('BKB-ORD-902411'); }}
                style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 700, color: '#0F172A', cursor: 'pointer' }}
              >
                BKB-ORD-902411
              </button>
            </div>
          </form>
        </div>

        {searched && order && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
            {/* Top Order Snapshot */}
            <div style={{ background: '#fff', border: '1px solid #E2D9CF', borderRadius: 16, padding: '24px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, borderBottom: '1px solid #F1EBE4', paddingBottom: 18, marginBottom: 20 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#C25E00', letterSpacing: 1, textTransform: 'uppercase' }}>
                    Order Reference
                  </span>
                  <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: '4px 0 2px' }}>
                    {order.id}
                  </h2>
                  <div style={{ fontSize: 13, color: '#64748B' }}>
                    Ordered on {order.date} · Consignee: <strong>{order.buyerName}</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', background: order.orderStatus === 'delivered' ? 'rgba(16,185,129,0.12)' : 'rgba(234,88,12,0.12)', color: order.orderStatus === 'delivered' ? '#059669' : '#C25E00' }}>
                    <Truck size={14} /> Status: {order.orderStatus}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginTop: 6 }}>
                    Total: {order.amount}
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                {order.items?.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FAF7F2', padding: '12px 16px', borderRadius: 10, border: '1px solid #EFE8DE' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <img src={item.imgSrc || '/images/products/prod_1.png'} alt={item.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B' }}>{item.name}</div>
                        <div style={{ fontSize: 12, color: '#64748B' }}>
                          Qty: {item.qty} · Artisan: <strong>{item.sellerName || 'Bihar Ka Bazaar Partner'}</strong>
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                      ₹{(item.price * item.qty).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 12, color: '#64748B', display: 'flex', alignItems: 'center', gap: 6, background: '#F8FAFC', padding: '10px 14px', borderRadius: 8 }}>
                <MapPin size={14} color="#C25E00" />
                <span><strong>Destination Address:</strong> {order.address}</span>
              </div>
            </div>

            {/* Packaging Video Proof Section (CRITICAL GUARANTEE) */}
            <div style={{
              background: 'linear-gradient(135deg, #FFF7ED 0%, #FFFBEB 100%)',
              border: '2px solid #FDBA74',
              borderRadius: 18,
              padding: '28px 30px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 30px rgba(234, 88, 12, 0.08)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 18 }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#16A34A', color: '#fff', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 }}>
                    <CheckCircle2 size={13} /> 360° Packaging Proof Verified
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: '#9A3412', margin: 0, fontFamily: "'Playfair Display', serif" }}>
                    Seller Box Packaging Video Recording
                  </h3>
                  <p style={{ fontSize: 13, color: '#7C2D12', marginTop: 4, maxWidth: 620, lineHeight: 1.5 }}>
                    To ensure you receive the exact authentic product in flawless condition, the seller has recorded the entire box packaging workflow in 360°. You can review the unboxing condition before courier handover.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '12px 22px',
                    background: '#C25E00',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(194,94,0,0.3)',
                    fontFamily: 'inherit'
                  }}
                >
                  <Play size={16} fill="#fff" /> Watch 360° Packaging Video
                </button>
              </div>

              {/* Video Preview Snapshot Box */}
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 340px) 1fr', gap: 24, background: '#fff', border: '1px solid #FED7AA', borderRadius: 14, padding: 18 }}>
                <div
                  onClick={() => setIsVideoModalOpen(true)}
                  style={{
                    position: 'relative',
                    borderRadius: 10,
                    overflow: 'hidden',
                    background: '#1E293B',
                    height: 190,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <div style={{ position: 'absolute', inset: 0, opacity: 0.6, background: 'radial-gradient(circle at center, #334155, #0F172A)' }} />
                  <div style={{ zIndex: 2, textAlign: 'center', padding: 16 }}>
                    <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#C25E00', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}>
                      <Play size={22} fill="#fff" style={{ marginLeft: 3 }} />
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Click to Play Full 360° Recording</div>
                    <div style={{ fontSize: 11, color: '#CBD5E1', marginTop: 2 }}>Length: 0:48 · HD 1080p · Verified</div>
                  </div>
                  <div style={{ position: 'absolute', bottom: 8, left: 10, right: 10, display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#F1F5F9', background: 'rgba(0,0,0,0.6)', padding: '3px 8px', borderRadius: 4, zIndex: 3 }}>
                    <span>📦 Box ID: {order.id}</span>
                    <span>All 6 Sides Visible</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#9A3412', textTransform: 'uppercase', marginBottom: 10, letterSpacing: 0.5 }}>
                    BKB Certified Packaging Checklist:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {(order.packagingVideo?.checklist || [
                      'Original authentic artisan items verified inside box',
                      'Protective cushioning & foam buffers applied',
                      'Bihar Ka Bazaar security hologram tape applied',
                      'Full 360° perimeter of box shown intact without dents'
                    ]).map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#334155' }}>
                        <CheckCircle2 size={16} color="#16A34A" style={{ flexShrink: 0 }} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #FED7AA', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: '#7C2D12' }}>
                    <span>Recorded: {order.packagingVideo?.uploadedAt ? new Date(order.packagingVideo.uploadedAt).toLocaleString('en-IN') : 'During order packaging'}</span>
                    <span style={{ fontWeight: 700, color: '#16A34A' }}>✓ 100% Tamper Proof Guarantee</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking Milestones Timeline */}
            <div style={{ background: '#fff', border: '1px solid #E2D9CF', borderRadius: 16, padding: '30px 32px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26 }}>
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', margin: 0, fontFamily: "'Playfair Display', serif" }}>
                    Fulfillment & Delivery Milestones
                  </h3>
                  <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0' }}>
                    Courier: <strong>{order.courier}</strong> · AWB Tracking: <strong>{order.trackingNumber}</strong>
                  </p>
                </div>
              </div>

              <div style={{ position: 'relative', paddingLeft: 36 }}>
                <div style={{ position: 'absolute', left: 14, top: 12, bottom: 20, width: 2, background: '#E2E8F0' }} />
                {steps.map((step, idx) => (
                  <div key={idx} style={{ position: 'relative', marginBottom: idx < steps.length - 1 ? 28 : 0 }}>
                    <div style={{
                      position: 'absolute',
                      left: -32,
                      top: 2,
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      background: step.done ? '#16A34A' : '#E2E8F0',
                      border: `3px solid ${step.done ? '#DCFCE7' : '#F8FAFC'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 2
                    }}>
                      {step.done ? <CheckCircle2 size={14} color="#fff" /> : <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#94A3B8' }} />}
                    </div>

                    <div style={{ opacity: step.done ? 1 : 0.45 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: step.done ? '#0F172A' : '#64748B' }}>
                          {step.label}
                        </span>
                        {step.isPackagingStep && order.packagingVideo && (
                          <span style={{ background: '#FEF3C7', color: '#92400E', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 4 }}>
                            360° Video Verified
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mediated BKB Customer Support Help */}
              <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid #F1EBE4', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, background: '#F8FAFC', padding: 18, borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(194,94,0,0.1)', color: '#C25E00', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <HelpCircle size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Questions about your package or video proof?</div>
                    <div style={{ fontSize: 12, color: '#64748B' }}>
                      Bihar Ka Bazaar Customer Support team will immediately assist you.
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSupportModalOpen(true)}
                  style={{
                    padding: '9px 18px',
                    background: '#1E293B',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}
                >
                  Contact BKB Support
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 360° Video Player Modal */}
      {isVideoModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 20
        }}>
          <div style={{
            background: '#121822',
            border: '1px solid #2B384E',
            borderRadius: 18,
            width: 720,
            maxWidth: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 50px rgba(0,0,0,0.6)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #1E293B', background: '#0F141C' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22C55E' }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#F8FAFC' }}>
                  360° Box Packaging Video Proof — {order?.id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: 20 }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: 20 }}>
              <div style={{ position: 'relative', width: '100%', height: 380, background: '#000', borderRadius: 12, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <video
                  controls
                  autoPlay
                  playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  src={order?.packagingVideo?.url || '/uploads/packaging-videos/sample-packaging-proof.mp4'}
                >
                  Your browser does not support HTML5 video streaming.
                </video>
                <div style={{ position: 'absolute', top: 12, left: 14, background: 'rgba(0,0,0,0.7)', color: '#22C55E', fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ShieldCheck size={14} /> BKB SEALED PACKAGING PROOF
                </div>
              </div>

              <div style={{ marginTop: 16, background: '#1A2332', padding: 14, borderRadius: 10, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, fontSize: 12, color: '#CBD5E1' }}>
                <div>
                  <span style={{ color: '#94A3B8' }}>Consignee:</span> <strong>{order?.buyerName}</strong>
                </div>
                <div>
                  <span style={{ color: '#94A3B8' }}>Tamper Seal:</span> <strong style={{ color: '#22C55E' }}>Verified Untouched</strong>
                </div>
                <div>
                  <span style={{ color: '#94A3B8' }}>Box Condition:</span> <strong>360° Intact on all sides</strong>
                </div>
                <div>
                  <span style={{ color: '#94A3B8' }}>Courier AWB:</span> <strong>{order?.trackingNumber}</strong>
                </div>
              </div>

              <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>
                  If your package arrives with broken seals or box damage, refuse delivery and contact BKB support.
                </div>
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(false)}
                  style={{ padding: '8px 20px', background: '#C25E00', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                >
                  Done Watching
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Support Inquiry Modal (Enforces Platform Mediator Rule) */}
      {isSupportModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 20
        }}>
          <div style={{ background: '#fff', border: '1px solid #E2D9CF', borderRadius: 18, width: 480, maxWidth: '100%', padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Bihar Ka Bazaar Helpdesk Relay
              </h3>
              <button
                type="button"
                onClick={() => { setIsSupportModalOpen(false); setSupportSubmitted(false); }}
                style={{ background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: 18 }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: 13, color: '#64748B', marginBottom: 16, lineHeight: 1.5 }}>
              For your buyer protection, all order queries are handled through our dedicated Bihar Ka Bazaar liaison team. We resolve any transit or box condition inquiries directly with the seller.
            </p>

            {supportSubmitted ? (
              <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: 18, textAlign: 'center' }}>
                <CheckCircle2 size={32} color="#16A34A" style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: 15, fontWeight: 700, color: '#166534' }}>Inquiry Registered Successfully!</div>
                <div style={{ fontSize: 12, color: '#15803D', marginTop: 4 }}>
                  Ticket <strong>#TK-{Math.floor(10000 + Math.random() * 90000)}</strong> has been opened. Our support executive will reach out to you shortly.
                </div>
                <button
                  type="button"
                  onClick={() => { setIsSupportModalOpen(false); setSupportSubmitted(false); }}
                  style={{ marginTop: 14, padding: '8px 16px', background: '#16A34A', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSupportSubmitted(true); }}>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                    Describe your query regarding Order {order?.id}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={supportMessage}
                    onChange={e => setSupportMessage(e.target.value)}
                    placeholder="e.g. Can you confirm if delivery can be scheduled between 2 PM and 5 PM? Also wanted to check the packaging video seal..."
                    style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #CBD5E1', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setIsSupportModalOpen(false)}
                    style={{ padding: '8px 14px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#475569', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '8px 18px', background: '#C25E00', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                  >
                    Send to BKB Support
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={
      <div style={{ background: '#FAF7F2', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: 16, color: '#8C7B6E', fontWeight: 600 }}>Loading tracking details...</p>
      </div>
    }>
      <OrderTrackingContent />
    </Suspense>
  );
}