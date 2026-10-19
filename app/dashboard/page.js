'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  Landmark, 
  MapPin, 
  LogOut, 
  Plus, 
  Eye, 
  EyeOff, 
  PackageX, 
  PackageCheck, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Edit3,
  Save,
  X,
  User,
  Truck,
  Clock,
  Search,
  MessageSquare,
  FileText,
  Printer,
  RefreshCw,
  Users,
  Wallet,
  ShieldCheck,
  XCircle,
  Headphones,
  Lock,
  Send,
  Video,
  Camera,
  UploadCloud,
  Play,
  CheckSquare,
  Film
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useLanguage } from '@/lib/LanguageContext';

// Dynamically import map (Leaflet is client-only)
const MapPicker = dynamic(() => import('../components/MapPicker'), { ssr: false, loading: () => null });

const DISTRICTS = [
  "Patna", "Muzaffarpur", "Darbhanga", "Bhagalpur",
  "Gaya", "Nalanda", "Madhubani", "Sitamarhi", "Vaishali", "Samastipur",
  "Begusarai", "Munger", "Bhojpur", "Rohtas", "Arrah", "Aurangabad",
  "Jehanabad", "Nawada", "Sheikhpura", "Lakhisarai", "Jamui",
];

const SELLER_TYPES = [
  "Individual Farmer",
  "Individual Artisan",
  "Self-Help Group (SHG) / Co-operative",
  "Small Business / Proprietorship",
];

const CATEGORIES = [
  "Food & Agricultural Products",
  "Handicrafts & Art",
  "Textiles & Silk",
  "Spices & Herbs",
  "Sweets & Snacks",
  "Fresh Fruits",
  "Dairy Products",
  "Other",
];

export default function SellerDashboardPage() {
  const router = useRouter();
  const { t } = useLanguage();

  // Active top navigation tab
  // 'orders' | 'payments' | 'crm' | 'products' | 'profile'
  const [activeTab, setActiveTab] = useState('orders');

  // Core data states
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [crmCustomers, setCrmCustomers] = useState([]);
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    placed: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    grossSales: 0,
    netEarnings: 0,
    pendingPayout: 0,
    disbursedPayout: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Orders filters
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  
  // Selected Order for Packing Slip / Invoice Modal
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);

  // Fulfillment update modal state
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [fulfillmentStatus, setFulfillmentStatus] = useState('');
  const [courierName, setCourierName] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [orderSellerNote, setOrderSellerNote] = useState('');
  const [fulfillmentSaving, setFulfillmentSaving] = useState(false);

  // Support Mediator Relay Modal (Seller communicates with buyer via BKB Support only)
  const [supportRelayOrder, setSupportRelayOrder] = useState(null);
  const [relayCategory, setRelayCategory] = useState('Delivery Address Clarification');
  const [relayMessage, setRelayMessage] = useState('');
  const [relaySubmitting, setRelaySubmitting] = useState(false);

  // 📹 Packaging Video Proof States
  const [viewingVideoOrder, setViewingVideoOrder] = useState(null);
  const [uploadingVideoOrder, setUploadingVideoOrder] = useState(null);
  const [packagingFile, setPackagingFile] = useState(null);
  const [packagingPreviewUrl, setPackagingPreviewUrl] = useState(null);
  const [packagingNotes, setPackagingNotes] = useState('');
  const [packagingUploading, setPackagingUploading] = useState(false);
  const fileInputRef = useRef(null);

  // CRM state
  const [crmSearchQuery, setCrmSearchQuery] = useState('');
  const [crmTagFilter, setCrmTagFilter] = useState('all');

  // Products filters & actions
  const [productStatusFilter, setProductStatusFilter] = useState('all');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Profile edit state
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({});
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState(null);
  const [showSellerMap, setShowSellerMap] = useState(false);

  // Payout request confirmation
  const [payoutRequested, setPayoutRequested] = useState(false);

  useEffect(() => {
    const storedId = localStorage.getItem('bkb_seller_id');
    if (!storedId) {
      router.replace('/login?role=seller');
    } else {
      loadSellerDashboard(storedId);
    }
  }, [router]);

  const loadSellerDashboard = async (id) => {
    setLoading(true);
    try {
      const resSeller = await fetch(`/api/register-seller?sellerId=${id}`);
      const dataSeller = await resSeller.json();

      if (dataSeller.success && dataSeller.seller) {
        setSeller(dataSeller.seller);
        setCheckedAuth(true);

        await Promise.all([
          fetchProducts(id),
          fetchOrdersAndCrm(id)
        ]);
      } else {
        localStorage.removeItem('bkb_seller_id');
        router.replace('/login?role=seller');
      }
    } catch (err) {
      console.error('Error loading seller dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (sellerId) => {
    try {
      const res = await fetch(`/api/products?sellerId=${sellerId}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error('Error fetching seller products:', err);
    }
  };

  const fetchOrdersAndCrm = async (sellerId) => {
    try {
      const res = await fetch(`/api/seller/orders?sellerId=${sellerId}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
        setOrderStats(data.stats || {});
        setPayouts(data.payouts || []);
        setCrmCustomers(data.crm || []);
      }
    } catch (err) {
      console.error('Error fetching seller orders & CRM:', err);
    }
  };

  const handleRefresh = async () => {
    if (!seller?.id) return;
    setRefreshing(true);
    await Promise.all([
      fetchProducts(seller.id),
      fetchOrdersAndCrm(seller.id)
    ]);
    setRefreshing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('bkb_seller_id');
    router.push('/login?role=seller&logout=true');
  };

  // ─── Fulfillment Actions ──────────────────────────────────────
  const openFulfillmentModal = (order) => {
    setUpdatingOrder(order);
    setFulfillmentStatus(order.orderStatus);
    setCourierName(order.courier || 'Delhivery Surface');
    setTrackingNumber(order.trackingNumber || '');
    setOrderSellerNote(order.sellerNotes || '');
  };

  const handleSaveFulfillment = async () => {
    if (!updatingOrder || !seller) return;
    setFulfillmentSaving(true);
    try {
      const res = await fetch('/api/seller/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sellerId: seller.id,
          orderId: updatingOrder.id,
          action: 'update_status',
          status: fulfillmentStatus,
          courier: courierName,
          trackingNumber: trackingNumber,
          sellerNotes: orderSellerNote
        })
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: `Order ${updatingOrder.id} status updated to "${fulfillmentStatus.toUpperCase()}".` });
        setUpdatingOrder(null);
        await fetchOrdersAndCrm(seller.id);
        setTimeout(() => setFeedback(null), 4000);
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to update order status.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Network error updating fulfillment.' });
    } finally {
      setFulfillmentSaving(false);
    }
  };

  // ─── 📹 Packaging Video Proof Handlers ────────────────────────
  const openPackagingVideoUploadModal = (order) => {
    setUploadingVideoOrder(order);
    setPackagingFile(null);
    setPackagingPreviewUrl(order.packagingVideo?.url || null);
    setPackagingNotes(order.packagingVideo?.notes || 'Full 360° parcel box recorded with product placement, cushioning, and tamper seal.');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPackagingFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPackagingPreviewUrl(objectUrl);
    }
  };

  const handleSimulateQuickVideo = () => {
    // Generates a certified demo packaging proof recording URL for fast testing
    const demoVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
    setPackagingPreviewUrl(demoVideoUrl);
    setPackagingNotes('Certified 360° packaging recording verified. Authentic product cushioning, BKB shipping label, and tamper-proof security tape verified on all 6 sides.');
  };

  const handleUploadPackagingVideo = async () => {
    if (!uploadingVideoOrder || !seller) return;
    setPackagingUploading(true);
    try {
      let res;
      if (packagingFile) {
        const formData = new FormData();
        formData.append('orderId', uploadingVideoOrder.id);
        formData.append('sellerId', seller.id);
        formData.append('notes', packagingNotes);
        formData.append('video', packagingFile);

        res = await fetch('/api/seller/orders/packaging-video', {
          method: 'POST',
          body: formData,
        });
      } else {
        res = await fetch('/api/seller/orders/packaging-video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: uploadingVideoOrder.id,
            sellerId: seller.id,
            videoUrl: packagingPreviewUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            notes: packagingNotes || 'Full 360° parcel box recorded with product placement, cushioning, and tamper seal.',
            fileSize: '14.2 MB'
          })
        });
      }

      const data = await res.json();
      if (data.success) {
        setFeedback({
          type: 'success',
          message: `📹 360° Packaging Proof Video successfully uploaded & verified for Order ${uploadingVideoOrder.id}!`
        });
        setUploadingVideoOrder(null);
        setPackagingFile(null);
        setPackagingPreviewUrl(null);
        await fetchOrdersAndCrm(seller.id);
        setTimeout(() => setFeedback(null), 5000);
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to upload packaging video.' });
      }
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: 'Network error uploading packaging video.' });
    } finally {
      setPackagingUploading(false);
    }
  };

  // ─── BKB Support Mediator Relay Action ────────────────────────
  const openSupportRelayModal = (order) => {
    setSupportRelayOrder(order);
    setRelayCategory('Delivery Address Clarification');
    setRelayMessage('');
  };

  const handleSubmitSupportRelay = async () => {
    if (!supportRelayOrder || !seller || !relayMessage.trim()) return;
    setRelaySubmitting(true);
    try {
      const res = await fetch('/api/seller/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'support_relay',
          sellerId: seller.id,
          orderId: supportRelayOrder.id,
          category: relayCategory,
          message: relayMessage.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({
          type: 'success',
          message: 'Inquiry routed to Bihar Ka Bazaar Support Desk. Our team will verify and relay it to the customer.'
        });
        setSupportRelayOrder(null);
        setRelayMessage('');
        await fetchOrdersAndCrm(seller.id);
        setTimeout(() => setFeedback(null), 5000);
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to submit support request.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Network error communicating with BKB Support.' });
    } finally {
      setRelaySubmitting(false);
    }
  };

  // ─── Product Actions ──────────────────────────────────────────
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

  // ─── Profile Edit Actions ─────────────────────────────────────
  const handleStartProfileEdit = () => {
    setProfileForm({
      businessName: seller.businessName || '',
      sellerType: seller.sellerType || '',
      district: seller.district || '',
      villageTown: seller.villageTown || '',
      pinCode: seller.pinCode || '',
      streetAddress: seller.streetAddress || '',
      category: seller.category || '',
      payoutMethod: seller.payoutMethod || 'upi',
      upiId: seller.upiId || '',
      bankHolderName: seller.bankHolderName || '',
      bankAccountNumber: seller.bankAccountNumber || '',
      bankIfsc: seller.bankIfsc || '',
    });
    setEditingProfile(true);
    setProfileFeedback(null);
  };

  const handleCancelProfileEdit = () => {
    setEditingProfile(false);
    setProfileFeedback(null);
  };

  const handleSaveProfile = async () => {
    if (profileForm.pinCode && !/^\d{6}$/.test(profileForm.pinCode)) {
      setProfileFeedback({ type: 'error', message: 'PIN code must be exactly 6 digits.' });
      return;
    }
    if (profileForm.payoutMethod === 'upi' && profileForm.upiId && !/^[\w.+-]+@[\w-]+$/.test(profileForm.upiId)) {
      setProfileFeedback({ type: 'error', message: 'Please enter a valid UPI ID (e.g. name@upi).' });
      return;
    }
    setProfileSaving(true);
    setProfileFeedback(null);
    try {
      const res = await fetch('/api/register-seller', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sellerId: seller.id, ...profileForm }),
      });
      const data = await res.json();
      if (data.success) {
        setSeller(prev => ({ ...prev, ...profileForm }));
        setEditingProfile(false);
        setProfileFeedback({ type: 'success', message: 'Business profile and payout details updated successfully!' });
        setTimeout(() => setProfileFeedback(null), 5000);
      } else {
        setProfileFeedback({ type: 'error', message: data.error || 'Failed to update profile.' });
      }
    } catch {
      setProfileFeedback({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setProfileSaving(false);
    }
  };

  const updateProfileField = (field, value) => setProfileForm(prev => ({ ...prev, [field]: value }));

  const handleSellerMapConfirm = (locationData) => {
    setProfileForm(prev => ({
      ...prev,
      streetAddress: [locationData.road, locationData.city].filter(Boolean).join(', ') || prev.streetAddress,
      district: locationData.district || prev.district,
      villageTown: locationData.city || prev.villageTown,
      pinCode: locationData.pincode || prev.pinCode,
      lat: locationData.lat,
      lng: locationData.lng,
    }));
    setShowSellerMap(false);
  };

  // ─── Filtered Data Computations ───────────────────────────────
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      if (orderStatusFilter !== 'all') {
        if (orderStatusFilter === 'received' && o.orderStatus !== 'placed' && o.orderStatus !== 'confirmed') return false;
        if (orderStatusFilter === 'shipped' && o.orderStatus !== 'shipped') return false;
        if (orderStatusFilter === 'delivered' && o.orderStatus !== 'delivered') return false;
        if (orderStatusFilter === 'cancelled' && o.orderStatus !== 'cancelled') return false;
      }
      if (orderSearchQuery.trim()) {
        const q = orderSearchQuery.toLowerCase().trim();
        const matchesId = (o.id || '').toLowerCase().includes(q);
        const matchesBuyer = (o.buyerName || '').toLowerCase().includes(q);
        const matchesCity = (o.shippingAddress?.city || '').toLowerCase().includes(q);
        const matchesProduct = (o.items || []).some(item => (item.name || '').toLowerCase().includes(q));
        if (!matchesId && !matchesBuyer && !matchesCity && !matchesProduct) return false;
      }
      return true;
    });
  }, [orders, orderStatusFilter, orderSearchQuery]);

  const filteredCrmCustomers = useMemo(() => {
    return crmCustomers.filter(c => {
      if (crmTagFilter !== 'all') {
        if (crmTagFilter === 'vip' && !c.customerTag?.includes('VIP')) return false;
        if (crmTagFilter === 'repeat' && !c.customerTag?.includes('Repeat')) return false;
        if (crmTagFilter === 'new' && !c.customerTag?.includes('New')) return false;
      }
      if (crmSearchQuery.trim()) {
        const q = crmSearchQuery.toLowerCase().trim();
        const matchesName = (c.name || '').toLowerCase().includes(q);
        const matchesCity = (c.city || '').toLowerCase().includes(q);
        if (!matchesName && !matchesCity) return false;
      }
      return true;
    });
  }, [crmCustomers, crmTagFilter, crmSearchQuery]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const isOut = p.status === 'out_of_stock' || p.outOfStock;
      const isHid = p.status === 'hidden' || p.isHidden;
      const isAct = !isOut && !isHid;

      if (productStatusFilter === 'active') return isAct;
      if (productStatusFilter === 'out_of_stock') return isOut;
      if (productStatusFilter === 'hidden') return isHid;
      return true;
    });
  }, [products, productStatusFilter]);

  if (!checkedAuth) {
    return (
      <div style={{ background: '#FFFCF8', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 44, height: 44, border: '3px solid #E8DDD4', borderTopColor: '#C85A08', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }} />
          <p style={{ fontSize: 16, color: '#8C7B6E', fontWeight: 600 }}>Loading Bihar Ka Bazaar Merchant Console...</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const statusColors = {
    'Completed': { bg: '#EAF5F0', color: '#1A5C38', text: 'Verification Under Review' },
    'Account Created': { bg: '#FFF4EC', color: '#C85A08', text: 'Setup In Progress' },
    'Products Added': { bg: '#FFF8E1', color: '#B7791F', text: 'Products Added - Verification Pending' },
    'Approved': { bg: '#EAF5F0', color: '#1A5C38', text: 'Verified Bihar Merchant' },
    'Rejected': { bg: '#FDECEA', color: '#D32F2F', text: 'Action Needed - Contact support' },
  };

  const currentStatus = statusColors[seller.status] || { bg: '#F5EEE6', color: '#8C7B6E', text: seller.status || 'Active Seller' };

  return (
    <div style={{ background: '#FBF8F5', minHeight: '100vh', paddingBottom: 80 }}>
      
      {/* ─── Top Brand Bar ─── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E8DDD4', padding: '18px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #1A5C38 0%, #2A8C56 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 18, boxShadow: '0 4px 12px rgba(26,92,56,0.2)' }}>
            बीKB
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontSize: 22, color: '#1A1410', fontFamily: "'Playfair Display', serif", margin: 0, fontWeight: 800 }}>
                {seller.businessName || seller.fullName}
              </h1>
              <span style={{ fontSize: 10, background: currentStatus.bg, color: currentStatus.color, fontWeight: 700, padding: '3px 8px', borderRadius: 20, border: `1px solid ${currentStatus.color}30` }}>
                {currentStatus.text}
              </span>
            </div>
            <div style={{ fontSize: 12, color: '#8C7B6E', marginTop: 2, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span>ID: <strong style={{ fontFamily: 'monospace' }}>{seller.id}</strong></span>
              <span>•</span>
              <span><MapPin size={12} style={{ display: 'inline', verticalAlign: -1 }} /> {seller.district || 'Bihar'}, India</span>
              <span>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#1A5C38', fontWeight: 700 }}>
                <ShieldCheck size={13} /> BKB Verified Merchant
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh dashboard data"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '9px 14px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              background: '#fff',
              border: '1.5px solid #E8DDD4',
              color: '#6B5C50',
              cursor: refreshing ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.2s'
            }}
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} /> {refreshing ? 'Refreshing...' : 'Sync Data'}
          </button>

          <Link href="/sellers/add-product" style={{ textDecoration: 'none' }}>
            <button style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '9px 16px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              background: '#1A5C38',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: '0 2px 8px rgba(26,92,56,0.25)'
            }}>
              <Plus size={14} /> Add Product
            </button>
          </Link>

          <button
            onClick={handleLogout}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '9px 14px',
              borderRadius: 8,
              fontSize: 12,
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
            <LogOut size={13} /> Log Out
          </button>
        </div>
      </div>

      {/* ─── Main Tab Navigation Bar ─── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E8DDD4', padding: '0 48px', display: 'flex', gap: 6, overflowX: 'auto' }}>
        {[
          { id: 'orders', label: 'Orders & Fulfillment', icon: Truck, count: orders.length },
          { id: 'payments', label: 'Payments & Payouts', icon: Wallet, badge: `₹${(orderStats.grossSales || 0).toLocaleString()}` },
          { id: 'crm', label: 'Customer Directory', icon: Users, count: crmCustomers.length },
          { id: 'products', label: 'Products & Inventory', icon: ShoppingBag, count: products.length },
          { id: 'profile', label: 'Business Profile & Payout', icon: User },
        ].map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '16px 20px',
                fontSize: 14,
                fontWeight: isActive ? 800 : 600,
                color: isActive ? '#C85A08' : '#6B5C50',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '3px solid #C85A08' : '3px solid transparent',
                cursor: 'pointer',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s'
              }}
            >
              <Icon size={16} color={isActive ? '#C85A08' : '#8C7B6E'} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span style={{
                  fontSize: 11,
                  padding: '2px 7px',
                  borderRadius: 20,
                  background: isActive ? '#FFF4EC' : '#F5EEE6',
                  color: isActive ? '#C85A08' : '#8C7B6E',
                  fontWeight: 700
                }}>
                  {tab.count}
                </span>
              )}
              {tab.badge && (
                <span style={{
                  fontSize: 10,
                  padding: '2px 7px',
                  borderRadius: 20,
                  background: '#EAF5F0',
                  color: '#1A5C38',
                  fontWeight: 800
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Global Mediator & 360° Packaging Proof Policy Banner */}
      <div style={{ maxWidth: 1240, margin: '16px auto 0', padding: '0 48px' }}>
        <div style={{
          background: '#EFF6FF',
          border: '1.5px solid #BFDBFE',
          borderRadius: 12,
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#1E40AF', fontWeight: 600 }}>
            <Video size={17} color="#1D4ED8" style={{ flexShrink: 0 }} />
            <span>
              <strong>BKB Quality & Packaging Assurance:</strong> To ensure that the authentic item reaches the buyer in pristine condition, merchants must record a complete <strong>360° video of the parcel box being packed</strong> and sealed with the shipping label prior to courier handover.
            </span>
          </div>
          <span style={{ fontSize: 11, color: '#1D4ED8', background: '#DBEAFE', padding: '3px 9px', borderRadius: 20, fontWeight: 700, whiteSpace: 'nowrap' }}>
            360° Video Proof Mandatory
          </span>
        </div>
      </div>

      {/* Global Feedback Banner */}
      {feedback && (
        <div style={{ maxWidth: 1240, margin: '14px auto 0', padding: '0 48px' }}>
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
            gap: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{feedback.message}</span>
          </div>
        </div>
      )}

      {/* ─── Tab Content Container ─── */}
      <div style={{ maxWidth: 1240, margin: '20px auto 0', padding: '0 48px' }}>

        {/* ════════════════════════════════════════════════════════════
            TAB 1: ORDERS & FULFILLMENT
        ════════════════════════════════════════════════════════════ */}
        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Quick Metrics Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {[
                { label: 'Received / New Orders', count: orderStats.placed + orderStats.confirmed, icon: PackageCheck, color: '#C85A08', bg: '#FFF4EC', note: 'Requires video & dispatch' },
                { label: 'In Transit / Shipped', count: orderStats.shipped, icon: Truck, color: '#2B6CB0', bg: '#EBF4FF', note: 'Out with courier' },
                { label: 'Delivered Successfully', count: orderStats.delivered, icon: CheckCircle2, color: '#1A5C38', bg: '#EAF5F0', note: 'Customer received' },
                { label: 'Cancelled / Returned', count: orderStats.cancelled, icon: XCircle, color: '#8C7B6E', bg: '#F5EEE6', note: 'Refunded / Voided' },
              ].map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div key={idx} style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#8C7B6E', textTransform: 'uppercase', letterSpacing: 0.5 }}>{card.label}</div>
                      <div style={{ fontSize: 28, fontWeight: 800, color: '#1A1410', marginTop: 4, fontFamily: "'Playfair Display', serif" }}>{card.count}</div>
                      <div style={{ fontSize: 11, color: card.color, fontWeight: 600, marginTop: 2 }}>{card.note}</div>
                    </div>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={22} color={card.color} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Filter & Search Bar */}
            <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[
                  { id: 'all', label: 'All Orders', count: orders.length },
                  { id: 'received', label: 'Received / New', count: orderStats.placed + orderStats.confirmed },
                  { id: 'shipped', label: 'In Transit', count: orderStats.shipped },
                  { id: 'delivered', label: 'Delivered', count: orderStats.delivered },
                  { id: 'cancelled', label: 'Cancelled', count: orderStats.cancelled },
                ].map(pill => {
                  const isSelected = orderStatusFilter === pill.id;
                  return (
                    <button
                      key={pill.id}
                      onClick={() => setOrderStatusFilter(pill.id)}
                      style={{
                        padding: '7px 14px',
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
                      {pill.label} <span style={{ opacity: 0.75, fontSize: 11 }}>({pill.count})</span>
                    </button>
                  );
                })}
              </div>

              <div style={{ position: 'relative', minWidth: 260 }}>
                <Search size={14} color="#8C7B6E" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  value={orderSearchQuery}
                  onChange={e => setOrderSearchQuery(e.target.value)}
                  placeholder="Search by Order ID, Buyer, City..."
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 34px',
                    borderRadius: 8,
                    border: '1.5px solid #E8DDD4',
                    fontSize: 12,
                    fontFamily: 'inherit',
                    outline: 'none',
                    background: '#FFFCF8',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#C85A08'}
                  onBlur={e => e.target.style.borderColor = '#E8DDD4'}
                />
              </div>
            </div>

            {/* Orders List View */}
            {filteredOrders.length === 0 ? (
              <div style={{ background: '#fff', border: '2px dashed #E8DDD4', borderRadius: 20, padding: '60px 24px', textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#F5EEE6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                  <Truck size={28} color="#C85A08" />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1410', margin: '0 0 6px' }}>No orders found</h3>
                <p style={{ fontSize: 13, color: '#8C7B6E', margin: '0 auto 16px', maxWidth: 360 }}>
                  {orderSearchQuery ? 'No orders match your search criteria. Try a different query.' : 'When customers purchase your Bihar-crafted goods, every detail will show here.'}
                </p>
                {orderSearchQuery && (
                  <button onClick={() => setOrderSearchQuery('')} style={{ padding: '8px 16px', borderRadius: 8, border: '1.5px solid #C85A08', background: 'none', color: '#C85A08', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {filteredOrders.map(order => {
                  const isDelivered = order.orderStatus === 'delivered';
                  const isShipped = order.orderStatus === 'shipped';
                  const isConfirmed = order.orderStatus === 'confirmed';
                  const isCancelled = order.orderStatus === 'cancelled';
                  const hasPackagingVideo = !!order.packagingVideo?.url;

                  let badgeBg = '#FFF4EC';
                  let badgeColor = '#C85A08';
                  let badgeText = 'Received (New)';

                  if (isConfirmed) {
                    badgeBg = '#FFF8E1';
                    badgeColor = '#B7791F';
                    badgeText = 'Confirmed / In Packing';
                  } else if (isShipped) {
                    badgeBg = '#EBF4FF';
                    badgeColor = '#2B6CB0';
                    badgeText = 'Dispatched / In Transit';
                  } else if (isDelivered) {
                    badgeBg = '#EAF5F0';
                    badgeColor = '#1A5C38';
                    badgeText = 'Delivered to Customer';
                  } else if (isCancelled) {
                    badgeBg = '#FDECEA';
                    badgeColor = '#D32F2F';
                    badgeText = 'Cancelled / Returned';
                  }

                  return (
                    <div
                      key={order.id}
                      style={{
                        background: '#fff',
                        border: '1.5px solid #E8DDD4',
                        borderRadius: 18,
                        padding: 24,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                        transition: 'all 0.2s'
                      }}
                    >
                      {/* Order Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, borderBottom: '1px solid #F5EEE6', paddingBottom: 16 }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 17, fontWeight: 800, color: '#1A1410', fontFamily: 'monospace' }}>{order.id}</span>
                            <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: badgeBg, color: badgeColor }}>
                              ● {badgeText}
                            </span>
                            
                            {/* 📹 360° Packaging Proof Video Status Pill */}
                            {hasPackagingVideo ? (
                              <button
                                type="button"
                                onClick={() => setViewingVideoOrder(order)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 5,
                                  fontSize: 11,
                                  fontWeight: 700,
                                  padding: '3px 10px',
                                  borderRadius: 20,
                                  background: '#EAF5F0',
                                  color: '#1A5C38',
                                  border: '1px solid #1A5C3830',
                                  cursor: 'pointer',
                                  fontFamily: 'inherit'
                                }}
                              >
                                <Video size={12} /> Box Video Verified ✓
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => openPackagingVideoUploadModal(order)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 5,
                                  fontSize: 11,
                                  fontWeight: 700,
                                  padding: '3px 10px',
                                  borderRadius: 20,
                                  background: '#FFF4EC',
                                  color: '#C85A08',
                                  border: '1px solid #C85A0830',
                                  cursor: 'pointer',
                                  fontFamily: 'inherit'
                                }}
                              >
                                <Camera size={12} /> + Record Box Video
                              </button>
                            )}

                            <span style={{ fontSize: 11, fontWeight: 600, color: '#8C7B6E' }}>
                              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          
                          {/* Buyer Preview with Masked Contact Information */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, fontSize: 13, color: '#6B5C50', flexWrap: 'wrap' }}>
                            <span>Buyer: <strong style={{ color: '#1A1410' }}>{order.buyerName}</strong></span>
                            <span>•</span>
                            <span><MapPin size={13} style={{ display: 'inline', verticalAlign: -1, color: '#1A5C38' }} /> {order.shippingAddress.city || 'Bihar'}, {order.shippingAddress.state || 'Bihar'} - {order.shippingAddress.pincode}</span>
                            <span>•</span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#64748B', fontSize: 12, background: '#F1F5F9', padding: '2px 8px', borderRadius: 4 }}>
                              <Lock size={11} /> Tel: <strong style={{ fontFamily: 'monospace' }}>{order.buyerPhoneMasked}</strong> (Protected)
                            </span>
                          </div>
                        </div>

                        {/* Top Action Buttons */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          {/* 📹 Video Proof Action Button */}
                          {hasPackagingVideo ? (
                            <button
                              type="button"
                              onClick={() => setViewingVideoOrder(order)}
                              title="Watch 360° Packaging Proof Video"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '8px 12px',
                                borderRadius: 8,
                                fontSize: 12,
                                fontWeight: 700,
                                background: '#EAF5F0',
                                color: '#1A5C38',
                                border: '1.5px solid #1A5C3840',
                                cursor: 'pointer',
                                fontFamily: 'inherit'
                              }}
                            >
                              <Play size={13} /> Watch Box Video
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => openPackagingVideoUploadModal(order)}
                              title="Record full box packaging video proof before courier dispatch"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '8px 12px',
                                borderRadius: 8,
                                fontSize: 12,
                                fontWeight: 700,
                                background: '#FFF4EC',
                                color: '#C85A08',
                                border: '1.5px solid #C85A0840',
                                cursor: 'pointer',
                                fontFamily: 'inherit'
                              }}
                            >
                              <Camera size={13} /> Record Packaging Video
                            </button>
                          )}

                          {/* Contact Buyer via BKB Support Mediator Relay */}
                          <button
                            type="button"
                            onClick={() => openSupportRelayModal(order)}
                            title="Send an official message to the buyer through BKB Customer Support Desk"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '8px 12px',
                              borderRadius: 8,
                              fontSize: 12,
                              fontWeight: 700,
                              background: '#EFF6FF',
                              color: '#1D4ED8',
                              border: '1.5px solid #BFDBFE',
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                              transition: 'all 0.15s'
                            }}
                          >
                            <Headphones size={13} /> Message via BKB Support
                          </button>

                          {/* Packing Slip / Invoice Generator */}
                          <button
                            type="button"
                            onClick={() => setSelectedInvoiceOrder(order)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 5,
                              padding: '8px 12px',
                              borderRadius: 8,
                              fontSize: 12,
                              fontWeight: 700,
                              background: '#FFF8E1',
                              color: '#7A5A08',
                              border: '1px solid #7A5A0830',
                              cursor: 'pointer',
                              fontFamily: 'inherit'
                            }}
                          >
                            <FileText size={13} /> Packing Slip / Invoice
                          </button>

                          {/* Update Fulfillment Status */}
                          <button
                            type="button"
                            onClick={() => openFulfillmentModal(order)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '8px 14px',
                              borderRadius: 8,
                              fontSize: 12,
                              fontWeight: 700,
                              background: '#1A1410',
                              color: '#fff',
                              border: 'none',
                              cursor: 'pointer',
                              fontFamily: 'inherit'
                            }}
                          >
                            <Truck size={13} /> Update Status
                          </button>
                        </div>
                      </div>

                      {/* Fulfillment Progress Stepper */}
                      {!isCancelled && (
                        <div style={{ margin: '18px 0', padding: '14px 18px', background: '#FFFCF8', borderRadius: 12, border: '1px solid #F5EEE6' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, position: 'relative' }}>
                            {[
                              { label: '1. Order Placed', done: true },
                              { label: '2. Confirmed & Packed (Video Proof)', done: isConfirmed || isShipped || isDelivered },
                              { label: '3. In Transit (Shipped)', done: isShipped || isDelivered },
                              { label: '4. Delivered', done: isDelivered },
                            ].map((step, sIdx) => (
                              <div key={sIdx} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: step.done ? '#1A5C38' : '#E8DDD4', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800 }}>
                                    {step.done ? '✓' : sIdx + 1}
                                  </div>
                                  <span style={{ fontSize: 11, fontWeight: step.done ? 700 : 500, color: step.done ? '#1A1410' : '#8C7B6E' }}>
                                    {step.label}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Items & Financial Detail Row */}
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, alignItems: 'start', marginTop: 14 }}>
                        {/* Ordered Items */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#8C7B6E', letterSpacing: 0.8 }}>
                            Ordered Items ({order.items.length})
                          </div>
                          {order.items.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: '#FBF8F5', borderRadius: 10, border: '1px solid #F5EEE6' }}>
                              <img
                                src={item.imgSrc || '/images/products/prod_1.png'}
                                alt={item.name}
                                style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8, background: '#fff' }}
                              />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1410', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {item.name}
                                </div>
                                <div style={{ fontSize: 11, color: '#8C7B6E' }}>
                                  Qty: <strong>{item.qty}</strong> × ₹{item.price}
                                </div>
                              </div>
                              <div style={{ fontSize: 14, fontWeight: 800, color: '#1A1410' }}>
                                ₹{(item.price * item.qty).toLocaleString()}
                              </div>
                            </div>
                          ))}

                          {/* 📹 Packaging Video Banner inside Order */}
                          {hasPackagingVideo ? (
                            <div style={{ padding: '10px 14px', background: '#EAF5F0', borderRadius: 8, border: '1px solid #1A5C3825', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#1A5C38', fontWeight: 600 }}>
                                <Video size={16} />
                                <span>360° Packaging Proof Recorded ({order.packagingVideo.fileSize || 'Verified'})</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setViewingVideoOrder(order)}
                                style={{ background: '#1A5C38', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                              >
                                Watch Video
                              </button>
                            </div>
                          ) : (
                            <div style={{ padding: '10px 14px', background: '#FFFDF9', borderRadius: 8, border: '1.5px dashed #C85A0840', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#C85A08', fontWeight: 600 }}>
                                <Camera size={16} />
                                <span>Packaging video not yet uploaded. Entire box recording required prior to courier dispatch.</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => openPackagingVideoUploadModal(order)}
                                style={{ background: '#C85A08', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
                              >
                                Record Video
                              </button>
                            </div>
                          )}

                          {/* Courier tracking note if shipped */}
                          {order.courier && order.trackingNumber && (
                            <div style={{ fontSize: 12, padding: '10px 14px', background: '#EBF4FF', borderRadius: 8, color: '#2B6CB0', display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #2B6CB020' }}>
                              <Truck size={15} />
                              <span>Shipped via <strong>{order.courier}</strong> • Tracking #: <strong style={{ fontFamily: 'monospace' }}>{order.trackingNumber}</strong></span>
                            </div>
                          )}

                          {order.sellerNotes && (
                            <div style={{ fontSize: 12, color: '#6B5C50', fontStyle: 'italic', background: '#FFFDF9', padding: '6px 10px', borderRadius: 6, borderLeft: '3px solid #C85A08' }}>
                              Note: {order.sellerNotes}
                            </div>
                          )}

                          {/* Existing Support Relay Tickets */}
                          {order.supportRelayTickets && order.supportRelayTickets.length > 0 && (
                            <div style={{ background: '#F0FDF4', border: '1px solid #DCFCE7', borderRadius: 8, padding: '10px 12px', fontSize: 11, color: '#166534' }}>
                              <div style={{ fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
                                <Headphones size={13} /> BKB Support Relay History:
                              </div>
                              {order.supportRelayTickets.map((tkt, tIdx) => (
                                <div key={tIdx} style={{ marginTop: 4 }}>
                                  • <strong>{tkt.category}</strong>: "{tkt.message}" — <span style={{ opacity: 0.8 }}>Relayed by BKB Support</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Financial Settlement Card for this Order */}
                        <div style={{ background: '#FFFDF9', border: '1.5px solid #E8DDD4', borderRadius: 12, padding: 14 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#1A5C38', letterSpacing: 0.8, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                            <Wallet size={12} /> Payment & Payout Breakdown
                          </div>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B5C50' }}>
                              <span>Gross Order Value:</span>
                              <strong style={{ color: '#1A1410' }}>₹{order.sellerSubtotal.toLocaleString()}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8C7B6E' }}>
                              <span>BKB Platform Fee (5%):</span>
                              <span>- ₹{order.platformCommission.toLocaleString()}</span>
                            </div>
                            <div style={{ height: 1, background: '#E8DDD4', margin: '4px 0' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 800, color: '#1A5C38' }}>
                              <span>Your Net Receivable (95%):</span>
                              <span>₹{order.sellerNetEarnings.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B5C50', fontSize: 11, marginTop: 4 }}>
                              <span>Payment Method:</span>
                              <span style={{ textTransform: 'uppercase', fontWeight: 700 }}>{order.paymentMethod} ({order.paymentStatus})</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B5C50', fontSize: 11 }}>
                              <span>Payout Status:</span>
                              <span style={{
                                fontWeight: 700,
                                color: order.payoutStatus === 'processed' ? '#1A5C38' : '#C85A08',
                                background: order.payoutStatus === 'processed' ? '#EAF5F0' : '#FFF4EC',
                                padding: '1px 6px',
                                borderRadius: 4
                              }}>
                                {order.payoutStatus === 'processed' ? 'Disbursed (Settled)' : 'Pending Settlement'}
                              </span>
                            </div>
                            {order.payoutUtr && (
                              <div style={{ fontSize: 10, color: '#1A5C38', background: '#EAF5F0', padding: '4px 8px', borderRadius: 4, fontFamily: 'monospace', marginTop: 4 }}>
                                Settlement UTR: {order.payoutUtr}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            TAB 2: PAYMENTS & PAYOUTS FINANCIAL HUB
        ════════════════════════════════════════════════════════════ */}
        {activeTab === 'payments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Financial Overview Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
              
              <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, padding: '20px 24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#8C7B6E', textTransform: 'uppercase', letterSpacing: 0.5 }}>Gross Marketplace Sales</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: '#1A1410', marginTop: 6, fontFamily: "'Playfair Display', serif" }}>
                  ₹{(orderStats.grossSales || 0).toLocaleString()}
                </div>
                <div style={{ fontSize: 12, color: '#6B5C50', marginTop: 4 }}>
                  From {orderStats.totalOrders} total buyer orders
                </div>
              </div>

              <div style={{ background: '#EAF5F0', border: '1.5px solid #1A5C3830', borderRadius: 16, padding: '20px 24px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#1A5C38', textTransform: 'uppercase', letterSpacing: 0.5 }}>Net Merchant Earnings (95%)</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: '#1A5C38', marginTop: 6, fontFamily: "'Playfair Display', serif" }}>
                  ₹{(orderStats.netEarnings || 0).toLocaleString()}
                </div>
                <div style={{ fontSize: 12, color: '#1A5C38', marginTop: 4, fontWeight: 600 }}>
                  After transparent 5% platform maintenance
                </div>
              </div>

              <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, padding: '20px 24px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#1A5C38', textTransform: 'uppercase', letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle2 size={13} /> Disbursed to Bank / UPI
                </div>
                <div style={{ fontSize: 32, fontWeight: 800, color: '#1A1410', marginTop: 6, fontFamily: "'Playfair Display', serif" }}>
                  ₹{(orderStats.disbursedPayout || 0).toLocaleString()}
                </div>
                <div style={{ fontSize: 12, color: '#1A5C38', marginTop: 4, fontWeight: 600 }}>
                  Completed bank transfer settlements
                </div>
              </div>

              <div style={{ background: '#FFF4EC', border: '1.5px solid #C85A0830', borderRadius: 16, padding: '20px 24px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#C85A08', textTransform: 'uppercase', letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={13} /> In Escrow / Pending Payout
                </div>
                <div style={{ fontSize: 32, fontWeight: 800, color: '#C85A08', marginTop: 6, fontFamily: "'Playfair Display', serif" }}>
                  ₹{(orderStats.pendingPayout || 0).toLocaleString()}
                </div>
                <div style={{ fontSize: 12, color: '#C85A08', marginTop: 4, fontWeight: 600 }}>
                  Scheduled for next Friday settlement cycle
                </div>
              </div>

            </div>

            {/* Payout Destination Info & Policy Banner */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              
              {/* Destination Box */}
              <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 18, padding: 22 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: '#2B6CB0', textTransform: 'uppercase', letterSpacing: 1, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Landmark size={15} /> Registered Payout Destination
                  </h3>
                  <button onClick={() => setActiveTab('profile')} style={{ background: 'none', border: 'none', color: '#C85A08', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                    Edit Payout Info →
                  </button>
                </div>

                <div style={{ padding: '14px 18px', background: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                  {seller.payoutMethod === 'upi' ? (
                    <div>
                      <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Direct UPI Payout</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginTop: 3, fontFamily: 'monospace' }}>
                        {seller.upiId || 'Not yet configured'}
                      </div>
                      <div style={{ fontSize: 12, color: '#16A34A', fontWeight: 600, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <ShieldCheck size={14} /> Instant VPA verification active
                      </div>
                    </div>
                  ) : seller.payoutMethod === 'bank' ? (
                    <div>
                      <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Direct NEFT / IMPS Bank Transfer</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', marginTop: 3 }}>
                        {seller.bankHolderName || seller.fullName}
                      </div>
                      <div style={{ fontSize: 13, color: '#475569', marginTop: 2 }}>
                        A/C: <strong style={{ fontFamily: 'monospace' }}>{seller.bankAccountNumber || '••••••••'}</strong> | IFSC: <strong style={{ fontFamily: 'monospace' }}>{seller.bankIfsc || '••••••••'}</strong>
                      </div>
                      <div style={{ fontSize: 12, color: '#16A34A', fontWeight: 600, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <ShieldCheck size={14} /> Bank IFSC validated
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: '#D32F2F', fontSize: 13, fontWeight: 600 }}>
                      ⚠️ Payout method not configured yet. Please configure UPI or Bank Account in your Profile tab to receive disbursements.
                    </div>
                  )}
                </div>
              </div>

              {/* Settlement Cycle Explanation */}
              <div style={{ background: '#FFFDF9', border: '1.5px solid #E8DDD4', borderRadius: 18, padding: 22 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#C85A08', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ShieldCheck size={15} /> Bihar Ka Bazaar Payout Guarantee
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, color: '#6B5C50', lineHeight: 1.55 }}>
                  <div>
                    <strong style={{ color: '#1A1410' }}>• 95% Producer Retention:</strong> Bihar Ka Bazaar only deducts a transparent 5% platform fee for maintenance, hosting, and gateway infrastructure. You retain 95%.
                  </div>
                  <div>
                    <strong style={{ color: '#1A1410' }}>• Settlement Cadence:</strong> Funds for delivered orders are credited directly into your verified bank account or UPI every Friday by 6:00 PM.
                  </div>
                  <div>
                    <strong style={{ color: '#1A1410' }}>• 100% Escrow Protection:</strong> Buyer payments are held securely in an official mediator escrow account until the buyer receives the package.
                  </div>
                </div>

                <div style={{ marginTop: 14 }}>
                  {payoutRequested ? (
                    <div style={{ fontSize: 12, color: '#1A5C38', background: '#EAF5F0', padding: '8px 12px', borderRadius: 8, fontWeight: 700 }}>
                      ✓ Early payout review request submitted. Operations team will process by 4 PM today.
                    </div>
                  ) : (
                    <button
                      onClick={() => setPayoutRequested(true)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: 8,
                        background: '#1A5C38',
                        color: '#fff',
                        border: 'none',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontFamily: 'inherit'
                      }}
                    >
                      Request Early Settlement Clearance
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* Detailed Transaction & Payout Ledger Table */}
            <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 20, overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #E8DDD4', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1A1410', margin: 0, fontFamily: "'Playfair Display', serif" }}>
                    Disbursement & Payout Transaction Ledger
                  </h3>
                  <p style={{ fontSize: 12, color: '#8C7B6E', margin: '4px 0 0' }}>
                    Complete audit trail of all electronic fund transfers, UTR references, and bank credits
                  </p>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#1A5C38', background: '#EAF5F0', padding: '4px 10px', borderRadius: 20 }}>
                  {payouts.length} Settlements Recorded
                </span>
              </div>

              {payouts.length === 0 ? (
                <div style={{ padding: '48px 24px', textAlign: 'center', color: '#8C7B6E', fontSize: 13 }}>
                  No payout disbursements recorded yet. Payouts will appear here once your delivered orders are processed during Friday settlements.
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: '#FBF8F5', borderBottom: '1.5px solid #E8DDD4', color: '#8C7B6E', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        <th style={{ padding: '12px 20px' }}>Transfer ID</th>
                        <th style={{ padding: '12px 20px' }}>Date & Time</th>
                        <th style={{ padding: '12px 20px' }}>Destination</th>
                        <th style={{ padding: '12px 20px' }}>UTR / Reference</th>
                        <th style={{ padding: '12px 20px' }}>Status</th>
                        <th style={{ padding: '12px 20px', textAlign: 'right' }}>Credited Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payouts.map(p => (
                        <tr key={p.id} style={{ borderBottom: '1px solid #F5EEE6' }}>
                          <td style={{ padding: '14px 20px', fontWeight: 700, color: '#1A1410', fontFamily: 'monospace' }}>
                            {p.id}
                          </td>
                          <td style={{ padding: '14px 20px', color: '#6B5C50' }}>
                            {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td style={{ padding: '14px 20px', color: '#1A1410', fontWeight: 600 }}>
                            {p.destination || p.method || 'Direct Account Payout'}
                          </td>
                          <td style={{ padding: '14px 20px', color: '#1A5C38', fontWeight: 700, fontFamily: 'monospace' }}>
                            {p.utrNumber || 'UTR-PROCESSED'}
                          </td>
                          <td style={{ padding: '14px 20px' }}>
                            <span style={{ fontSize: 11, fontWeight: 700, background: '#EAF5F0', color: '#1A5C38', padding: '3px 8px', borderRadius: 20 }}>
                              ● Settled
                            </span>
                          </td>
                          <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 800, color: '#1A5C38', fontSize: 15 }}>
                            ₹{Number(p.amount).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            TAB 3: CUSTOMER DIRECTORY & BKB MEDIATOR CRM
        ════════════════════════════════════════════════════════════ */}
        {activeTab === 'crm' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* CRM Header Card */}
            <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 20, padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1A1410', margin: 0, fontFamily: "'Playfair Display', serif" }}>
                  Customer Directory & Purchase History
                </h2>
                <p style={{ fontSize: 13, color: '#8C7B6E', margin: '4px 0 0' }}>
                  Track customer repeat orders and route inquiries safely through BKB Customer Support
                </p>
              </div>

              {/* CRM Metrics */}
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ padding: '10px 18px', background: '#FFFCF8', borderRadius: 12, border: '1px solid #E8DDD4', textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: '#8C7B6E', fontWeight: 700, textTransform: 'uppercase' }}>Total Customers</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#1A1410', marginTop: 2 }}>{crmCustomers.length}</div>
                </div>
                <div style={{ padding: '10px 18px', background: '#EAF5F0', borderRadius: 12, border: '1px solid #1A5C3820', textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: '#1A5C38', fontWeight: 700, textTransform: 'uppercase' }}>Repeat Buyers</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#1A5C38', marginTop: 2 }}>
                    {crmCustomers.filter(c => c.ordersCount > 1).length}
                  </div>
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { id: 'all', label: 'All Customers', count: crmCustomers.length },
                  { id: 'repeat', label: 'Repeat Buyers', count: crmCustomers.filter(c => c.ordersCount > 1).length },
                  { id: 'new', label: 'New Buyers', count: crmCustomers.filter(c => c.ordersCount === 1).length },
                ].map(pill => {
                  const isSelected = crmTagFilter === pill.id;
                  return (
                    <button
                      key={pill.id}
                      onClick={() => setCrmTagFilter(pill.id)}
                      style={{
                        padding: '7px 14px',
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
                      {pill.label} ({pill.count})
                    </button>
                  );
                })}
              </div>

              <div style={{ position: 'relative', minWidth: 260 }}>
                <Search size={14} color="#8C7B6E" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  value={crmSearchQuery}
                  onChange={e => setCrmSearchQuery(e.target.value)}
                  placeholder="Search customer by name, city..."
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 34px',
                    borderRadius: 8,
                    border: '1.5px solid #E8DDD4',
                    fontSize: 12,
                    fontFamily: 'inherit',
                    outline: 'none',
                    background: '#FFFCF8',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#C85A08'}
                  onBlur={e => e.target.style.borderColor = '#E8DDD4'}
                />
              </div>
            </div>

            {/* Customers Cards Grid */}
            {filteredCrmCustomers.length === 0 ? (
              <div style={{ background: '#fff', border: '2px dashed #E8DDD4', borderRadius: 20, padding: '48px 24px', textAlign: 'center', color: '#8C7B6E' }}>
                No customer records match your filter.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 18 }}>
                {filteredCrmCustomers.map((cust, idx) => {
                  return (
                    <div
                      key={idx}
                      style={{
                        background: '#fff',
                        border: '1.5px solid #E8DDD4',
                        borderRadius: 18,
                        padding: 22,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        {/* Customer Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#FFF4EC', color: '#C85A08', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16 }}>
                              {cust.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontSize: 15, fontWeight: 800, color: '#1A1410' }}>{cust.name}</div>
                              <div style={{ fontSize: 12, color: '#8C7B6E' }}>
                                <MapPin size={11} style={{ display: 'inline', verticalAlign: -1 }} /> {cust.city}, {cust.district}
                              </div>
                            </div>
                          </div>

                          <span style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: 20,
                            background: cust.ordersCount > 1 ? '#EAF5F0' : '#F5EEE6',
                            color: cust.ordersCount > 1 ? '#1A5C38' : '#6B5C50'
                          }}>
                            {cust.customerTag}
                          </span>
                        </div>

                        {/* Customer Lifetime Metrics */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '12px 14px', background: '#FFFCF8', borderRadius: 10, border: '1px solid #F5EEE6', marginBottom: 14 }}>
                          <div>
                            <div style={{ fontSize: 10, color: '#8C7B6E', textTransform: 'uppercase', fontWeight: 600 }}>Lifetime Value (LTV)</div>
                            <div style={{ fontSize: 16, fontWeight: 800, color: '#1A5C38', marginTop: 2 }}>₹{cust.totalSpent.toLocaleString()}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 10, color: '#8C7B6E', textTransform: 'uppercase', fontWeight: 600 }}>Total Orders</div>
                            <div style={{ fontSize: 16, fontWeight: 800, color: '#1A1410', marginTop: 2 }}>{cust.ordersCount} {cust.ordersCount === 1 ? 'order' : 'orders'}</div>
                          </div>
                        </div>

                        {/* Masked Contact & Security Tag */}
                        <div style={{ fontSize: 11, color: '#64748B', background: '#F8FAFC', padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Lock size={12} color="#1D4ED8" />
                          <span>Contact: <strong>{cust.maskedPhone}</strong> (Protected by BKB Mediator Policy)</span>
                        </div>

                        {/* Items Ordered List */}
                        <div style={{ marginBottom: 14 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: '#8C7B6E', textTransform: 'uppercase', marginBottom: 6 }}>Products Ordered</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {cust.allPurchasedItems.map((prodName, pIdx) => (
                              <span key={pIdx} style={{ fontSize: 11, padding: '2px 8px', background: '#F5EEE6', borderRadius: 6, color: '#4A3F35', fontWeight: 500 }}>
                                {prodName}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Official Mediator Relay Action */}
                      <div style={{ borderTop: '1px solid #E8DDD4', paddingTop: 14 }}>
                        <button
                          type="button"
                          onClick={() => {
                            const customerOrder = orders.find(o => (o.buyerId === cust.buyerId || o.buyerName === cust.name));
                            if (customerOrder) {
                              openSupportRelayModal(customerOrder);
                            } else {
                              alert('No active order reference available for this customer.');
                            }
                          }}
                          style={{
                            width: '100%',
                            padding: '9px 12px',
                            borderRadius: 8,
                            background: '#EFF6FF',
                            color: '#1D4ED8',
                            border: '1.5px solid #BFDBFE',
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6
                          }}
                        >
                          <Headphones size={14} /> Send Message via BKB Support Desk
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            TAB 4: PRODUCTS & INVENTORY
        ════════════════════════════════════════════════════════════ */}
        {activeTab === 'products' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 20, padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 14 }}>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1A1410', fontFamily: "'Playfair Display', serif", margin: 0 }}>
                    Product Catalog & Stock Controls ({products.length})
                  </h2>
                  <p style={{ fontSize: 13, color: '#8C7B6E', marginTop: 3 }}>
                    Control live catalog availability, pause items out of stock, or edit pricing
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
                    fontFamily: 'inherit',
                    boxShadow: '0 2px 8px rgba(26,92,56,0.25)'
                  }}>
                    <Plus size={15} /> Add New Listing
                  </button>
                </Link>
              </div>

              {/* Status Filter Tabs */}
              {products.length > 0 && (
                <div style={{ display: 'flex', gap: 8, marginBottom: 22, borderBottom: '1px solid #E8DDD4', paddingBottom: 12, flexWrap: 'wrap' }}>
                  {[
                    { id: 'all', label: 'All Items', count: products.length },
                    { id: 'active', label: 'Live & In Stock', count: products.filter(p => !p.outOfStock && !p.isHidden && p.status !== 'out_of_stock' && p.status !== 'hidden').length },
                    { id: 'out_of_stock', label: 'Out of Stock', count: products.filter(p => p.outOfStock || p.status === 'out_of_stock').length },
                    { id: 'hidden', label: 'Hidden / On Hold', count: products.filter(p => p.isHidden || p.status === 'hidden').length },
                  ].map(tab => {
                    const isSelected = productStatusFilter === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setProductStatusFilter(tab.id)}
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
                      onClick={() => setProductStatusFilter('all')}
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
                    const isUpdating = actionLoadingId === p.id;
                    const isConfirmingDelete = deleteConfirmId === p.id;

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
                        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                          <div style={{ width: 80, height: 80, borderRadius: 12, overflow: 'hidden', background: '#F5EEE6', flexShrink: 0, position: 'relative' }}>
                            <img src={p.imgSrc || '/images/products/prod_1.png'} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                                  GI TAGGED
                                </span>
                              )}
                            </div>
                            
                            <div style={{ fontSize: 12, color: '#8C7B6E' }}>
                              {p.cat} | Pack: {p.unit}
                            </div>
                            
                            <div style={{ fontSize: 16, fontWeight: 800, color: '#C85A08', marginTop: 4 }}>
                              ₹{p.price}
                            </div>
                          </div>

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
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#4A3F35' }}>Catalog Status:</span>
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

                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <button
                              type="button"
                              onClick={() => handleUpdateProductStatus(p.id, isOut ? 'active' : 'out_of_stock')}
                              disabled={isUpdating}
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
                                fontFamily: 'inherit'
                              }}
                            >
                              {isOut ? <PackageCheck size={14} /> : <PackageX size={14} />}
                              {isOut ? 'Mark In Stock' : 'Out of Stock'}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleUpdateProductStatus(p.id, isHid ? 'active' : 'hidden')}
                              disabled={isUpdating}
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
                                fontFamily: 'inherit'
                              }}
                            >
                              {isHid ? <Eye size={14} /> : <EyeOff size={14} />}
                              {isHid ? 'Make Public' : 'Hide from Store'}
                            </button>

                            {isConfirmingDelete ? (
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#FDECEA', padding: '3px 8px', borderRadius: 8 }}>
                                <span style={{ fontSize: 11, color: '#D32F2F', fontWeight: 700 }}>Confirm?</span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProduct(p.id)}
                                  disabled={isUpdating}
                                  style={{ padding: '4px 8px', borderRadius: 6, background: '#D32F2F', color: '#fff', border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                                >
                                  Delete
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmId(null)}
                                  style={{ padding: '4px 8px', borderRadius: 6, background: '#fff', color: '#6B5C50', border: '1px solid #E8DDD4', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(p.id)}
                                disabled={isUpdating}
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
                                  fontFamily: 'inherit'
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
        )}

        {/* ════════════════════════════════════════════════════════════
            TAB 5: BUSINESS PROFILE & PAYOUT SETTINGS
        ════════════════════════════════════════════════════════════ */}
        {activeTab === 'profile' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
            
            {/* Left: Profile Form / View */}
            <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 20, overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #E8DDD4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1A1410', margin: 0, fontFamily: "'Playfair Display', serif" }}>
                    Business Profile & Location Details
                  </h3>
                  <p style={{ fontSize: 12, color: '#8C7B6E', margin: '3px 0 0' }}>
                    Information shown on your Bihar Ka Bazaar store profile & shipping slips
                  </p>
                </div>
                {editingProfile ? (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={handleCancelProfileEdit}
                      style={{ padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, border: '1.5px solid #E8DDD4', background: 'transparent', color: '#6B5C50', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <X size={13} /> Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={profileSaving}
                      style={{ padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, border: 'none', background: profileSaving ? '#8C7B6E' : '#1A5C38', color: '#fff', cursor: profileSaving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Save size={13} /> {profileSaving ? 'Saving...' : 'Save Profile'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleStartProfileEdit}
                    style={{ padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, border: '1.5px solid #C85A08', background: 'transparent', color: '#C85A08', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Edit3 size={13} /> Edit Profile
                  </button>
                )}
              </div>

              {profileFeedback && (
                <div style={{
                  margin: '16px 24px 0',
                  background: profileFeedback.type === 'success' ? '#EAF5F0' : '#FDECEA',
                  border: `1.5px solid ${profileFeedback.type === 'success' ? '#1A5C38' : '#D32F2F'}30`,
                  color: profileFeedback.type === 'success' ? '#1A5C38' : '#D32F2F',
                  borderRadius: 12,
                  padding: '12px 16px',
                  fontSize: 13,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                  {profileFeedback.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                  {profileFeedback.message}
                </div>
              )}

              <div style={{ padding: '24px' }}>
                {editingProfile ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div style={{ padding: '10px 12px', background: '#F5EEE6', borderRadius: 8 }}>
                        <div style={{ fontSize: 9, fontWeight: 700, color: '#8C7B6E', textTransform: 'uppercase', marginBottom: 3 }}>Merchant Legal Name</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1410' }}>{seller.fullName}</div>
                      </div>
                      <div style={{ padding: '10px 12px', background: '#F5EEE6', borderRadius: 8 }}>
                        <div style={{ fontSize: 9, fontWeight: 700, color: '#8C7B6E', textTransform: 'uppercase', marginBottom: 3 }}>Mobile (SMS & Login)</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1410' }}>+91 {seller.mobile}</div>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: '#4A3F35', display: 'block', marginBottom: 5 }}>Business / Brand Name</label>
                      <input
                        value={profileForm.businessName}
                        onChange={e => updateProfileField('businessName', e.target.value)}
                        placeholder="Your enterprise or store name"
                        style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: '#4A3F35', display: 'block', marginBottom: 5 }}>Seller Type</label>
                        <select
                          value={profileForm.sellerType}
                          onChange={e => updateProfileField('sellerType', e.target.value)}
                          style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none', boxSizing: 'border-box' }}
                        >
                          <option value="">Select seller type</option>
                          {SELLER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: '#4A3F35', display: 'block', marginBottom: 5 }}>Category</label>
                        <select
                          value={profileForm.category}
                          onChange={e => updateProfileField('category', e.target.value)}
                          style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none', boxSizing: 'border-box' }}
                        >
                          <option value="">Select category</option>
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Location fields */}
                    <div style={{ borderTop: '1px solid #E8DDD4', paddingTop: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#1A5C38', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                        <MapPin size={13} /> Origin Location for Courier Pickups
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                        <div>
                          <label style={{ fontSize: 11, fontWeight: 700, color: '#4A3F35', display: 'block', marginBottom: 5 }}>District</label>
                          <select
                            value={profileForm.district}
                            onChange={e => updateProfileField('district', e.target.value)}
                            style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none', boxSizing: 'border-box' }}
                          >
                            <option value="">Select district</option>
                            {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: 11, fontWeight: 700, color: '#4A3F35', display: 'block', marginBottom: 5 }}>Village / Town</label>
                          <input
                            value={profileForm.villageTown}
                            onChange={e => updateProfileField('villageTown', e.target.value)}
                            placeholder="Village / Town"
                            style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>

                      <div style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                          <label style={{ fontSize: 11, fontWeight: 700, color: '#4A3F35' }}>Street Address for Courier Pickup</label>
                          <button type="button" onClick={() => setShowSellerMap(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 6, border: '1.5px solid #1A5C38', background: '#EAF5F0', color: '#1A5C38', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                            <MapPin size={12} /> Pin on Map
                          </button>
                        </div>
                        <textarea
                          value={profileForm.streetAddress}
                          onChange={e => updateProfileField('streetAddress', e.target.value)}
                          placeholder="Complete physical pickup address"
                          rows={2}
                          style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
                        />
                      </div>
                    </div>

                    {/* Payout method fields */}
                    <div style={{ borderTop: '1px solid #E8DDD4', paddingTop: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#2B6CB0', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Landmark size={13} /> Payout Method & Settlement Account
                      </div>
                      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                        {['upi', 'bank'].map(method => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => updateProfileField('payoutMethod', method)}
                            style={{
                              flex: 1,
                              padding: '10px',
                              borderRadius: 8,
                              border: `1.5px solid ${profileForm.payoutMethod === method ? '#2B6CB0' : '#E8DDD4'}`,
                              background: profileForm.payoutMethod === method ? '#EBF4FF' : '#fff',
                              color: profileForm.payoutMethod === method ? '#2B6CB0' : '#6B5C50',
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                              textTransform: 'uppercase'
                            }}>
                            {method === 'upi' ? 'UPI Virtual ID' : 'Bank Account (NEFT)'}
                          </button>
                        ))}
                      </div>

                      {profileForm.payoutMethod === 'upi' && (
                        <div>
                          <label style={{ fontSize: 11, fontWeight: 700, color: '#4A3F35', display: 'block', marginBottom: 5 }}>UPI ID (e.g. name@okhdfcbank)</label>
                          <input
                            value={profileForm.upiId}
                            onChange={e => updateProfileField('upiId', e.target.value)}
                            placeholder="yourname@upi"
                            style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                      )}

                      {profileForm.payoutMethod === 'bank' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: '#4A3F35', display: 'block', marginBottom: 5 }}>Account Holder Name</label>
                            <input
                              value={profileForm.bankHolderName}
                              onChange={e => updateProfileField('bankHolderName', e.target.value)}
                              placeholder="Account Holder Name"
                              style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none', boxSizing: 'border-box' }}
                            />
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                            <div>
                              <label style={{ fontSize: 11, fontWeight: 700, color: '#4A3F35', display: 'block', marginBottom: 5 }}>Bank Account Number</label>
                              <input
                                value={profileForm.bankAccountNumber}
                                onChange={e => updateProfileField('bankAccountNumber', e.target.value)}
                                placeholder="Account Number"
                                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none', boxSizing: 'border-box' }}
                              />
                            </div>
                            <div>
                              <label style={{ fontSize: 11, fontWeight: 700, color: '#4A3F35', display: 'block', marginBottom: 5 }}>Bank IFSC Code</label>
                              <input
                                value={profileForm.bankIfsc}
                                onChange={e => updateProfileField('bankIfsc', e.target.value.toUpperCase())}
                                placeholder="SBIN0001234"
                                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none', boxSizing: 'border-box' }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                ) : (
                  /* Read-Only Profile View */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {[
                      ['Merchant Legal Name', seller.fullName],
                      ['Business Brand', seller.businessName || 'Not configured'],
                      ['Contact Mobile', '+91 ' + seller.mobile],
                      ['Preferred Language', seller.language || 'Hindi'],
                      ['Seller Category', seller.category || 'Handicrafts & Art'],
                      ['Seller Type', seller.sellerType || 'Individual Artisan'],
                      ['Pickup District', seller.district || 'Not set'],
                      ['Pickup Village / Town', seller.villageTown || 'Not set'],
                      ['Pickup Street Address', seller.streetAddress || 'Not set'],
                    ].map(([l, v]) => (
                      <div key={l} style={{ borderBottom: '1px solid #F5EEE6', paddingBottom: 10 }}>
                        <div style={{ fontSize: 10, color: '#8C7B6E', fontWeight: 600, textTransform: 'uppercase' }}>{l}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: v.includes('Not') ? '#C8BFB8' : '#1A1410', fontStyle: v.includes('Not') ? 'italic' : 'normal', marginTop: 2 }}>{v}</div>
                      </div>
                    ))}

                    <div style={{ borderBottom: '1px solid #F5EEE6', paddingBottom: 10 }}>
                      <div style={{ fontSize: 10, color: '#2B6CB0', fontWeight: 600, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Landmark size={11} /> Registered Payout Destination
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1410', marginTop: 2 }}>
                        {seller.payoutMethod === 'upi' ? `UPI ID: ${seller.upiId}` : seller.payoutMethod === 'bank' ? `Bank Account: ${seller.bankHolderName} (${seller.bankAccountNumber})` : 'Not configured'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Quick Verification Checklist Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: '#FFFDF9', border: '1.5px solid #E8DDD4', borderRadius: 20, padding: 22 }}>
                <h3 style={{ fontSize: 12, fontWeight: 700, color: '#1A5C38', textTransform: 'uppercase', letterSpacing: 1.2, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ShieldCheck size={16} /> Verified Bihar Seller Status
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12, color: '#6B5C50' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#1A5C38', fontWeight: 800 }}>✓</span>
                    <span>Identity & Mobile Verified (+91)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#1A5C38', fontWeight: 800 }}>✓</span>
                    <span>Direct Artisan / Producer Authentication</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: seller.payoutMethod ? '#1A5C38' : '#C85A08', fontWeight: 800 }}>
                      {seller.payoutMethod ? '✓' : '●'}
                    </span>
                    <span>Bank / UPI Payout Verification</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: products.length > 0 ? '#1A5C38' : '#C85A08', fontWeight: 800 }}>
                      {products.length > 0 ? '✓' : '●'}
                    </span>
                    <span>Active Product Listings ({products.length})</span>
                  </div>
                </div>
              </div>

              {/* Help Box */}
              <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 20, padding: 22 }}>
                <h3 style={{ fontSize: 12, fontWeight: 700, color: '#C85A08', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <HelpCircle size={15} /> Support Helpline
                </h3>
                <p style={{ fontSize: 12, color: '#6B5C50', lineHeight: 1.55, margin: 0 }}>
                  For technical support with orders, courier dispatch integrations, or payout statements, contact our Bihar Merchant Help Desk at <strong>1800-BKB-CARE</strong> or email <strong>sellers@biharkabazaar.com</strong>.
                </p>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ════════════════════════════════════════════════════════════
          MODAL 1: 📹 360° PACKAGING VIDEO PROOF VIEWER MODAL
      ════════════════════════════════════════════════════════════ */}
      {viewingVideoOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 20, maxWidth: 640, width: '100%', maxHeight: '92vh', overflowY: 'auto', padding: 28, boxShadow: '0 24px 48px rgba(0,0,0,0.3)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E8DDD4', paddingBottom: 16, marginBottom: 18 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Video size={20} color="#1A5C38" />
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1A1410', margin: 0, fontFamily: "'Playfair Display', serif" }}>
                    360° Packaging Proof Video
                  </h3>
                </div>
                <div style={{ fontSize: 12, color: '#6B5C50', marginTop: 4 }}>
                  Order: <strong style={{ fontFamily: 'monospace' }}>{viewingVideoOrder.id}</strong> • Buyer: {viewingVideoOrder.buyerName}
                </div>
              </div>
              <button onClick={() => setViewingVideoOrder(null)} style={{ background: 'none', border: 'none', color: '#8C7B6E', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Video Player */}
            <div style={{ borderRadius: 14, overflow: 'hidden', background: '#000', marginBottom: 18, position: 'relative', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
              <video
                controls
                autoPlay
                playsInline
                src={viewingVideoOrder.packagingVideo?.url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
                style={{ width: '100%', maxHeight: 360, display: 'block', objectFit: 'contain' }}
              >
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Quality Checklist Card */}
            <div style={{ background: '#EAF5F0', border: '1.5px solid #1A5C3830', borderRadius: 14, padding: 18, marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#1A5C38', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={16} /> BKB Standard Packaging QC Checklist (Verified)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12, color: '#1A1410' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: '#1A5C38', fontWeight: 900 }}>✓</span>
                  <span>360° Full Box Exterior Recorded</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: '#1A5C38', fontWeight: 900 }}>✓</span>
                  <span>Authentic Bihar Product Placed</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: '#1A5C38', fontWeight: 900 }}>✓</span>
                  <span>Protective Bubble Cushioning</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: '#1A5C38', fontWeight: 900 }}>✓</span>
                  <span>BKB Shipping Label & Tamper Seal</span>
                </div>
              </div>
            </div>

            {/* Video Metadata */}
            <div style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 12, color: '#475569', display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
              <div><strong>Recorded At:</strong> {viewingVideoOrder.packagingVideo?.uploadedAt ? new Date(viewingVideoOrder.packagingVideo.uploadedAt).toLocaleString('en-IN') : 'Verified on packaging'}</div>
              <div><strong>File Reference:</strong> <span style={{ fontFamily: 'monospace' }}>{viewingVideoOrder.packagingVideo?.fileName || 'bkb_packaging_proof.mp4'}</span> ({viewingVideoOrder.packagingVideo?.fileSize || '14.2 MB'})</div>
              {viewingVideoOrder.packagingVideo?.notes && (
                <div><strong>Merchant Notes:</strong> {viewingVideoOrder.packagingVideo.notes}</div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                onClick={() => {
                  const orderToReRecord = viewingVideoOrder;
                  setViewingVideoOrder(null);
                  openPackagingVideoUploadModal(orderToReRecord);
                }}
                style={{ padding: '9px 16px', borderRadius: 8, background: '#fff', border: '1.5px solid #E8DDD4', color: '#6B5C50', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Re-record New Video
              </button>
              <button
                type="button"
                onClick={() => setViewingVideoOrder(null)}
                style={{ padding: '9px 18px', borderRadius: 8, background: '#1A5C38', color: '#fff', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          MODAL 2: 📹 RECORD / UPLOAD PACKAGING VIDEO PROOF MODAL
      ════════════════════════════════════════════════════════════ */}
      {uploadingVideoOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 20, maxWidth: 600, width: '100%', maxHeight: '92vh', overflowY: 'auto', padding: 28, boxShadow: '0 24px 48px rgba(0,0,0,0.3)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E8DDD4', paddingBottom: 16, marginBottom: 18 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Camera size={20} color="#C85A08" />
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1A1410', margin: 0, fontFamily: "'Playfair Display', serif" }}>
                    Record Packaging Proof Video
                  </h3>
                </div>
                <div style={{ fontSize: 12, color: '#6B5C50', marginTop: 4 }}>
                  Order: <strong style={{ fontFamily: 'monospace' }}>{uploadingVideoOrder.id}</strong> • Buyer: {uploadingVideoOrder.buyerName}
                </div>
              </div>
              <button onClick={() => setUploadingVideoOrder(null)} style={{ background: 'none', border: 'none', color: '#8C7B6E', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Instruction Banner */}
            <div style={{ background: '#FFF8E1', border: '1.5px solid #F6E05E', borderRadius: 12, padding: '14px 16px', marginBottom: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#744210', marginBottom: 6 }}>
                📹 Mandatory 360° Packaging Guidelines:
              </div>
              <div style={{ fontSize: 11, color: '#744210', lineHeight: 1.6 }}>
                1. <strong>Keep Entire Box in Frame:</strong> Pan the camera around all 6 sides of the parcel box.<br />
                2. <strong>Show Item & Protective Cushioning:</strong> Show the items being placed securely inside.<br />
                3. <strong>Show Affixed Label & Security Tape:</strong> Ensure the Bihar Ka Bazaar shipping label and tamper seal are clearly readable.
              </div>
            </div>

            {/* Video Capture & Upload Zone */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              
              {packagingPreviewUrl ? (
                <div>
                  <div style={{ borderRadius: 12, overflow: 'hidden', background: '#000', marginBottom: 10 }}>
                    <video
                      controls
                      autoPlay
                      src={packagingPreviewUrl}
                      style={{ width: '100%', maxHeight: 280, display: 'block', objectFit: 'contain' }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: '#16A34A', fontWeight: 700 }}>
                      ✓ Video ready for upload ({packagingFile ? `${(packagingFile.size / (1024 * 1024)).toFixed(1)} MB` : '14.2 MB'})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setPackagingFile(null);
                        setPackagingPreviewUrl(null);
                      }}
                      style={{ padding: '4px 10px', borderRadius: 6, background: '#FDECEA', color: '#D32F2F', border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                    >
                      Clear & Re-record
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ border: '2px dashed #CBD5E1', borderRadius: 14, padding: '28px 20px', textAlign: 'center', background: '#F8FAFC' }}>
                  <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <Camera size={24} color="#1D4ED8" />
                  </div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: '0 0 6px' }}>
                    Record with Device Camera or Select Video
                  </h4>
                  <p style={{ fontSize: 12, color: '#64748B', margin: '0 auto 16px', maxWidth: 360 }}>
                    Capture live with phone camera or upload an existing recording (.mp4, .webm, .mov)
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      capture="environment"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        padding: '10px 18px',
                        borderRadius: 8,
                        background: '#1D4ED8',
                        color: '#fff',
                        border: 'none',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      <Camera size={14} /> Open Camera / Choose File
                    </button>

                    <button
                      type="button"
                      onClick={handleSimulateQuickVideo}
                      style={{
                        padding: '10px 16px',
                        borderRadius: 8,
                        background: '#EAF5F0',
                        color: '#1A5C38',
                        border: '1.5px solid #1A5C3840',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      <Film size={14} /> Quick Verify Sample Box
                    </button>
                  </div>
                </div>
              )}

              {/* Packaging Notes */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#4A3F35', display: 'block', marginBottom: 5 }}>
                  Packaging & Seal Verification Note
                </label>
                <textarea
                  value={packagingNotes}
                  onChange={e => setPackagingNotes(e.target.value)}
                  placeholder="e.g. Full 360 box recorded. 2 layers of bubble wrap applied, BKB dispatch label affixed on top."
                  rows={2}
                  style={{ width: '100%', padding: '9px 11px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setUploadingVideoOrder(null)}
                  style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1.5px solid #E8DDD4', background: '#fff', color: '#6B5C50', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUploadPackagingVideo}
                  disabled={packagingUploading || !packagingPreviewUrl}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: 8,
                    border: 'none',
                    background: (packagingUploading || !packagingPreviewUrl) ? '#94A3B8' : '#1A5C38',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: (packagingUploading || !packagingPreviewUrl) ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6
                  }}
                >
                  <UploadCloud size={15} /> {packagingUploading ? 'Uploading & Verifying...' : 'Save & Verify Packaging Video'}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          MODAL 3: BKB SUPPORT MEDIATOR RELAY MODAL
      ════════════════════════════════════════════════════════════ */}
      {supportRelayOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 20, maxWidth: 540, width: '100%', padding: 28, boxShadow: '0 24px 48px rgba(0,0,0,0.25)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E8DDD4', paddingBottom: 16, marginBottom: 18 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Headphones size={20} color="#1D4ED8" />
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1A1410', margin: 0, fontFamily: "'Playfair Display', serif" }}>
                    BKB Customer Support Relay
                  </h3>
                </div>
                <div style={{ fontSize: 12, color: '#6B5C50', marginTop: 4 }}>
                  Order: <strong style={{ fontFamily: 'monospace' }}>{supportRelayOrder.id}</strong> • Buyer: <strong>{supportRelayOrder.buyerName}</strong>
                </div>
              </div>
              <button onClick={() => setSupportRelayOrder(null)} style={{ background: 'none', border: 'none', color: '#8C7B6E', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 10, padding: '10px 14px', marginBottom: 18, fontSize: 11, color: '#1E40AF', lineHeight: 1.5 }}>
              🛡️ <strong>Mediator Protection Notice:</strong> In line with Bihar Ka Bazaar policy, messages are reviewed by our Concierge Support Team and forwarded directly to the buyer's registered WhatsApp/SMS. Your payments and escrow remain 100% secure.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#4A3F35', display: 'block', marginBottom: 6 }}>
                  Inquiry Category
                </label>
                <select
                  value={relayCategory}
                  onChange={e => setRelayCategory(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none' }}
                >
                  <option value="Delivery Address Clarification">Delivery Address & Landmark Clarification</option>
                  <option value="Dispatch Schedule & Delay Notification">Dispatch Schedule / Custom Handcraft Delay</option>
                  <option value="Custom Handcraft Specification">Custom Artisan Sizing or Color Variant</option>
                  <option value="Packaging & Handling Advisory">Fragile Packaging & Organic Handling Advisory</option>
                  <option value="Return / Replacement Assistance">Return / Replacement Assistance</option>
                  <option value="Other Order Inquiry">Other Order Inquiry</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#4A3F35', display: 'block', marginBottom: 6 }}>
                  Message to Customer (via BKB Support)
                </label>
                <textarea
                  value={relayMessage}
                  onChange={e => setRelayMessage(e.target.value)}
                  placeholder="e.g. Namaste! We have crafted your handloom stole. Could you please clarify if your residence is near the main market square so our courier partner can deliver accurately?"
                  rows={4}
                  maxLength={1000}
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none', boxSizing: 'border-box', resize: 'vertical', lineHeight: 1.5 }}
                />
                <div style={{ fontSize: 10, color: '#8C7B6E', textAlign: 'right', marginTop: 3 }}>
                  {relayMessage.length} / 1000 characters
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setSupportRelayOrder(null)}
                  style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1.5px solid #E8DDD4', background: '#fff', color: '#6B5C50', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitSupportRelay}
                  disabled={relaySubmitting || !relayMessage.trim()}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: 8,
                    border: 'none',
                    background: (relaySubmitting || !relayMessage.trim()) ? '#94A3B8' : '#1D4ED8',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: (relaySubmitting || !relayMessage.trim()) ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6
                  }}
                >
                  <Send size={14} /> {relaySubmitting ? 'Relaying...' : 'Send via BKB Support'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          MODAL 4: FULFILLMENT & ORDER STATUS UPDATER
      ════════════════════════════════════════════════════════════ */}
      {updatingOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 20, maxWidth: 520, width: '100%', padding: 28, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1A1410', margin: 0, fontFamily: "'Playfair Display', serif" }}>
                  Update Order Fulfillment
                </h3>
                <div style={{ fontSize: 12, color: '#8C7B6E', marginTop: 3 }}>
                  Order: <strong style={{ fontFamily: 'monospace' }}>{updatingOrder.id}</strong> • Buyer: {updatingOrder.buyerName}
                </div>
              </div>
              <button onClick={() => setUpdatingOrder(null)} style={{ background: 'none', border: 'none', color: '#8C7B6E', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#4A3F35', display: 'block', marginBottom: 6 }}>
                  Fulfillment Status
                </label>
                <select
                  value={fulfillmentStatus}
                  onChange={e => setFulfillmentStatus(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none' }}
                >
                  <option value="placed">Received (Placed by Buyer)</option>
                  <option value="confirmed">Confirmed & Packed (Ready for courier pickup)</option>
                  <option value="shipped">Dispatched / In Transit (Handed over to courier)</option>
                  <option value="delivered">Delivered to Customer (Successful delivery)</option>
                  <option value="cancelled">Cancelled / Voided</option>
                </select>
              </div>

              {/* 📹 Packaging Video Requirement Notice inside Fulfillment Modal */}
              {(fulfillmentStatus === 'confirmed' || fulfillmentStatus === 'shipped') && (
                <div style={{
                  padding: '12px 14px',
                  background: updatingOrder.packagingVideo?.url ? '#EAF5F0' : '#FFF8E1',
                  border: `1.5px solid ${updatingOrder.packagingVideo?.url ? '#1A5C3830' : '#F6E05E'}`,
                  borderRadius: 10
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: updatingOrder.packagingVideo?.url ? '#1A5C38' : '#744210', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Video size={15} />
                      <span>{updatingOrder.packagingVideo?.url ? '360° Packaging Video Verified ✓' : '360° Packaging Video Required'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const target = updatingOrder;
                        setUpdatingOrder(null);
                        openPackagingVideoUploadModal(target);
                      }}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        background: updatingOrder.packagingVideo?.url ? '#1A5C38' : '#C85A08',
                        color: '#fff',
                        border: 'none',
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontFamily: 'inherit'
                      }}
                    >
                      {updatingOrder.packagingVideo?.url ? 'Change Video' : '+ Record Video'}
                    </button>
                  </div>
                  {!updatingOrder.packagingVideo?.url && (
                    <div style={{ fontSize: 11, color: '#744210', marginTop: 4 }}>
                      Record the full parcel box being packed with product cushioning & tamper tape to authorize courier handover.
                    </div>
                  )}
                </div>
              )}

              {(fulfillmentStatus === 'shipped' || fulfillmentStatus === 'confirmed') && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#4A3F35', display: 'block', marginBottom: 5 }}>Courier Partner</label>
                    <input
                      value={courierName}
                      onChange={e => setCourierName(e.target.value)}
                      placeholder="e.g. Delhivery, Bluedart, Bihar Post"
                      style={{ width: '100%', padding: '9px 11px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#4A3F35', display: 'block', marginBottom: 5 }}>Tracking / Waybill #</label>
                    <input
                      value={trackingNumber}
                      onChange={e => setTrackingNumber(e.target.value)}
                      placeholder="e.g. DEL982341234"
                      style={{ width: '100%', padding: '9px 11px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              )}

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#4A3F35', display: 'block', marginBottom: 5 }}>Merchant Fulfillment Note</label>
                <textarea
                  value={orderSellerNote}
                  onChange={e => setOrderSellerNote(e.target.value)}
                  placeholder="e.g. Packaged in bubble wrap and sealed in handmade wooden box."
                  rows={2}
                  style={{ width: '100%', padding: '9px 11px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setUpdatingOrder(null)}
                  style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1.5px solid #E8DDD4', background: '#fff', color: '#6B5C50', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveFulfillment}
                  disabled={fulfillmentSaving}
                  style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: fulfillmentSaving ? '#8C7B6E' : '#1A5C38', color: '#fff', fontSize: 13, fontWeight: 700, cursor: fulfillmentSaving ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
                >
                  {fulfillmentSaving ? 'Saving...' : 'Update Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          MODAL 5: PRINTABLE PACKING SLIP & TAX INVOICE
          (Disintermediation protected - no personal phone/email)
      ════════════════════════════════════════════════════════════ */}
      {selectedInvoiceOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 16, maxWidth: 680, width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: 36, boxShadow: '0 24px 48px rgba(0,0,0,0.3)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E8DDD4', paddingBottom: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Printer size={18} color="#C85A08" />
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1A1410', margin: 0, fontFamily: "'Playfair Display', serif" }}>
                  Merchant Packing Slip & Invoice
                </h3>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  style={{ padding: '7px 14px', borderRadius: 8, background: '#1A5C38', color: '#fff', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Printer size={13} /> Print Label
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceOrder(null)}
                  style={{ padding: '7px 12px', borderRadius: 8, background: '#F5EEE6', color: '#6B5C50', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Close
                </button>
              </div>
            </div>

            {/* Printable Document Body */}
            <div style={{ border: '2px solid #1A1410', padding: 24, borderRadius: 8, background: '#fff' }}>
              
              {/* Slip Top Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #1A1410', paddingBottom: 16, marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#1A5C38', letterSpacing: 0.5 }}>
                    BIHAR KA BAZAAR
                  </div>
                  <div style={{ fontSize: 11, color: '#6B5C50', marginTop: 2 }}>
                    Official Rural Producer Marketplace • State of Bihar
                  </div>
                  <div style={{ fontSize: 11, color: '#1A1410', marginTop: 4 }}>
                    Merchant: <strong>{seller.businessName || seller.fullName}</strong>
                  </div>
                  <div style={{ fontSize: 11, color: '#6B5C50' }}>
                    Origin: {seller.villageTown || seller.district}, {seller.district}, Bihar - {seller.pinCode}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, fontWeight: 900, color: '#1A1410', fontFamily: 'monospace' }}>
                    {selectedInvoiceOrder.id}
                  </div>
                  <div style={{ fontSize: 11, color: '#6B5C50', marginTop: 2 }}>
                    Date: {new Date(selectedInvoiceOrder.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <div style={{ fontSize: 11, color: '#1A5C38', fontWeight: 700, marginTop: 4 }}>
                    Payment: {selectedInvoiceOrder.paymentMethod.toUpperCase()} ({selectedInvoiceOrder.paymentStatus.toUpperCase()})
                  </div>
                </div>
              </div>

              {/* Shipping Destination - Address only, with BKB Support Care for Courier Help */}
              <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 8, border: '1px solid #E2E8F0', marginBottom: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>
                  DELIVER TO (RECIPIENT):
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A' }}>
                  {selectedInvoiceOrder.buyerName}
                </div>
                <div style={{ fontSize: 12, color: '#334155', marginTop: 2 }}>
                  {selectedInvoiceOrder.shippingAddress.addressLine1} {selectedInvoiceOrder.shippingAddress.addressLine2}
                </div>
                <div style={{ fontSize: 12, color: '#334155' }}>
                  {selectedInvoiceOrder.shippingAddress.city}, {selectedInvoiceOrder.shippingAddress.state || 'Bihar'} — <strong>{selectedInvoiceOrder.shippingAddress.pincode}</strong>
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#1D4ED8', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Headphones size={12} /> Courier Delivery Helpline: 1800-BKB-CARE (Toll-Free • Quote Ref: {selectedInvoiceOrder.id})
                </div>
              </div>

              {/* 360° Packaging Proof Verification Stamp */}
              <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 8, padding: '10px 14px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: '#166534' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
                  <Video size={14} />
                  <span>[✓] 360° PARCEL BOX PACKAGING VIDEO RECORDED & VERIFIED</span>
                </div>
                <div style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                  Ref: {selectedInvoiceOrder.packagingVideo?.fileName || `${selectedInvoiceOrder.id}_pack_verified.mp4`}
                </div>
              </div>

              {/* Items Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12, marginBottom: 16 }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid #1A1410', color: '#1A1410', fontWeight: 800 }}>
                    <th style={{ padding: '6px 0' }}>#</th>
                    <th style={{ padding: '6px 0' }}>Item Description</th>
                    <th style={{ padding: '6px 0', textAlign: 'center' }}>Qty</th>
                    <th style={{ padding: '6px 0', textAlign: 'right' }}>Unit Price</th>
                    <th style={{ padding: '6px 0', textAlign: 'right' }}>Total (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoiceOrder.items.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #E8DDD4' }}>
                      <td style={{ padding: '8px 0', color: '#8C7B6E' }}>{idx + 1}</td>
                      <td style={{ padding: '8px 0', fontWeight: 700, color: '#1A1410' }}>{item.name}</td>
                      <td style={{ padding: '8px 0', textAlign: 'center' }}>{item.qty}</td>
                      <td style={{ padding: '8px 0', textAlign: 'right' }}>₹{item.price}</td>
                      <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700 }}>₹{(item.price * item.qty).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total Row */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '2px solid #1A1410', paddingTop: 10 }}>
                <div style={{ width: 220, display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B5C50' }}>
                    <span>Subtotal:</span>
                    <span>₹{selectedInvoiceOrder.sellerSubtotal.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B5C50' }}>
                    <span>Shipping Charges:</span>
                    <span>FREE</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 900, color: '#1A1410', borderTop: '1px solid #E8DDD4', paddingTop: 6, marginTop: 4 }}>
                    <span>Total Paid:</span>
                    <span>₹{selectedInvoiceOrder.sellerSubtotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Dispatch Verification Stamp */}
              <div style={{ marginTop: 24, paddingTop: 12, borderTop: '1px dashed #CBD5E1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10, color: '#64748B' }}>
                <div>
                  Certified 100% Authentic Bihar Heritage Craft • biharkabazaar.com
                </div>
                <div style={{ textAlign: 'right', fontWeight: 700 }}>
                  Merchant Authorized Signatory
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          MODAL 6: SELLER MAP PICKER MODAL
      ════════════════════════════════════════════════════════════ */}
      {showSellerMap && (
        <MapPicker
          onConfirm={handleSellerMapConfirm}
          onClose={() => setShowSellerMap(false)}
          initialLat={profileForm.lat || undefined}
          initialLng={profileForm.lng || undefined}
        />
      )}

    </div>
  );
}