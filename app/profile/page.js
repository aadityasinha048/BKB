'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Package, MapPin, Settings, LogOut, Leaf, Palette, Citrus, CheckCircle2, AlertCircle, Edit3, Save, X, Map } from 'lucide-react';

// Dynamically import map (Leaflet is client-only)
const MapPicker = dynamic(() => import('../components/MapPicker'), { ssr: false, loading: () => null });

const TABS = ['Profile', 'My Orders', 'Addresses', 'Settings'];

const ORDERS = [
  { id: '#BKB-1082', product: 'Premium Makhana 500g', icon: Leaf, date: 'Dec 28, 2024', amount: '₹480', status: 'Delivered', bg: '#FFF8E8', color: '#1B6B3A' },
  { id: '#BKB-1079', product: 'Madhubani Painting', icon: Palette, date: 'Dec 20, 2024', amount: '₹1,200', status: 'Delivered', bg: '#FFF0F5', color: '#B83280' },
  { id: '#BKB-1065', product: 'Shahi Litchi 2kg', icon: Citrus, date: 'Dec 10, 2024', amount: '₹720', status: 'Delivered', bg: '#F0FFF4', color: '#2F855A' },
  { id: '#BKB-1058', product: 'Katarni Rice 2kg', icon: Leaf, date: 'Nov 28, 2024', amount: '₹320', status: 'Delivered', bg: '#FAFFF4', color: '#276749' },
];

const DISTRICTS = [
  "Select district", "Patna", "Muzaffarpur", "Darbhanga", "Bhagalpur",
  "Gaya", "Nalanda", "Madhubani", "Sitamarhi", "Vaishali", "Samastipur",
  "Begusarai", "Munger", "Bhojpur", "Rohtas", "Arrah", "Aurangabad",
  "Jehanabad", "Nawada", "Sheikhpura", "Lakhisarai", "Jamui", "Other",
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

function FieldInput({ label, value, onChange, type = 'text', required = false, maxLength, placeholder }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: '#8C7B6E', textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}{required && <span style={{ color: '#C85A08' }}> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        maxLength={maxLength}
        placeholder={placeholder}
        style={{
          padding: '10px 13px',
          border: '1.5px solid #E8DDD4',
          borderRadius: 8,
          fontSize: 14,
          fontFamily: 'inherit',
          background: '#FFFCF8',
          color: '#1A1410',
          outline: 'none',
          transition: 'border-color 0.2s',
          width: '100%',
          boxSizing: 'border-box',
        }}
        onFocus={e => e.target.style.borderColor = '#C85A08'}
        onBlur={e => e.target.style.borderColor = '#E8DDD4'}
      />
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Profile');
  const [editing, setEditing] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [savedMobile, setSavedMobile] = useState('');
  const [saveStatus, setSaveStatus] = useState(null); // null | 'success' | 'error'
  const [saveError, setSaveError] = useState('');

  const [buyerProfile, setBuyerProfile] = useState({
    name: '',
    email: '',
    mobile: '',
    district: '',
    address: '',
    pincode: '',
    city: '',
    state: 'Bihar',
  });

  // Edited form state (separate from saved state)
  const [editForm, setEditForm] = useState({ ...buyerProfile });

  const [isSeller, setIsSeller] = useState(false);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('bkb_user_logged_in');
    if (!isLoggedIn) {
      router.replace('/login?role=buyer');
    } else {
      setIsSeller(!!localStorage.getItem('bkb_seller_id'));
      const mobile = localStorage.getItem('bkb_user_mobile') || '';
      setSavedMobile(mobile);
      const storedProfile = mobile ? localStorage.getItem(`bkb_buyer_profile_${mobile}`) : null;
      let profile = {
        name: '',
        email: '',
        mobile: mobile,
        district: '',
        address: '',
        pincode: '',
        city: '',
        state: 'Bihar',
      };
      if (storedProfile) {
        try {
          profile = { ...profile, ...JSON.parse(storedProfile) };
        } catch {
          // keep default
        }
      }
      setBuyerProfile(profile);
      setEditForm(profile);
      setCheckedAuth(true);
    }
  }, [router]);

  const handleStartEdit = () => {
    setEditForm({ ...buyerProfile });
    setEditing(true);
    setSaveStatus(null);
  };

  const handleCancelEdit = () => {
    setEditForm({ ...buyerProfile });
    setEditing(false);
    setSaveStatus(null);
  };

  const handleSaveProfile = () => {
    // Validate required fields
    if (!editForm.name || editForm.name.trim().length < 2) {
      setSaveError('Full name must be at least 2 characters.');
      setSaveStatus('error');
      return;
    }
    if (editForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      setSaveError('Please enter a valid email address.');
      setSaveStatus('error');
      return;
    }
    if (editForm.pincode && !/^\d{6}$/.test(editForm.pincode)) {
      setSaveError('PIN code must be exactly 6 digits.');
      setSaveStatus('error');
      return;
    }

    const updatedProfile = { ...editForm, mobile: savedMobile };
    setBuyerProfile(updatedProfile);
    if (savedMobile) {
      localStorage.setItem(`bkb_buyer_profile_${savedMobile}`, JSON.stringify(updatedProfile));
    }
    setEditing(false);
    setSaveStatus('success');
    setTimeout(() => setSaveStatus(null), 4000);
  };

  const updateField = (field, value) => setEditForm(prev => ({ ...prev, [field]: value }));

  const handleMapConfirm = (locationData) => {
    setEditForm(prev => ({
      ...prev,
      address: [locationData.road, locationData.city].filter(Boolean).join(', ') || prev.address,
      district: locationData.district || prev.district,
      city: locationData.city || prev.city,
      pincode: locationData.pincode || prev.pincode,
      lat: locationData.lat,
      lng: locationData.lng,
      mapAddress: locationData.address,
    }));
    setShowMap(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('bkb_user_logged_in');
    localStorage.removeItem('bkb_user_mobile');
    router.push('/login?role=buyer&logout=true');
  };

  if (!checkedAuth) {
    return (
      <div style={{ background: '#FFFCF8', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: 16, color: '#8C7B6E', fontWeight: 600 }}>Loading profile...</p>
      </div>
    );
  }

  const displayName = buyerProfile.name || 'My Account';
  const displayEmail = buyerProfile.email || 'No email set';

  return (
    <div style={{ background: '#FFFCF8', minHeight: '80vh' }}>
      {/* Header */}
      <div className="profile-header-container" style={{ background: '#fff', borderBottom: '1px solid #E8DDD4', padding: '28px 60px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#C85A08', marginBottom: 6 }}>Account</div>
        <h1 style={{ fontSize: 34, color: '#1A1410', fontFamily: "'Playfair Display', serif" }}>My Profile</h1>
      </div>

      {/* Save Status Banner */}
      {saveStatus && (
        <div style={{
          margin: '0',
          padding: '14px 60px',
          background: saveStatus === 'success' ? '#EAF5F0' : '#FDECEA',
          borderBottom: `1px solid ${saveStatus === 'success' ? '#1A5C38' : '#D32F2F'}20`,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: 13,
          fontWeight: 600,
          color: saveStatus === 'success' ? '#1A5C38' : '#D32F2F',
        }}>
          {saveStatus === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {saveStatus === 'success' ? 'Profile updated successfully!' : saveError}
        </div>
      )}

      <div className="profile-layout-grid" style={{ padding: '36px 60px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: 28, alignItems: 'start' }}>

        {/* Sidebar */}
        <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, overflow: 'hidden' }}>
          {/* Avatar */}
          <div style={{ padding: '28px 24px', textAlign: 'center', borderBottom: '1px solid #E8DDD4', background: 'linear-gradient(135deg, #FFF4EC, #FFFCF8)' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#FFF4EC', border: '3px solid #FFE8D4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <User size={36} color="#C85A08" />
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1410', marginBottom: 3 }}>{displayName}</div>
            <div style={{ fontSize: 12, color: '#8C7B6E' }}>{displayEmail}</div>
            <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 5, background: '#EAF5F0', color: '#1A5C38', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>
              <CheckCircle2 size={11} /> Verified Account
            </div>
          </div>
          {/* Nav */}
          <div style={{ padding: '10px 10px' }}>
            {TABS.map(tab => {
              const Icon = tab === 'Profile' ? User : tab === 'My Orders' ? Package : tab === 'Addresses' ? MapPin : Settings;
              const active = activeTab === tab;
              return (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 9, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', marginBottom: 3, background: active ? '#FFF4EC' : 'transparent', color: active ? '#C85A08' : '#4A3F35', transition: 'all 0.18s', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={16} color={active ? '#C85A08' : '#7A7067'} />
                  {tab}
                </button>
              );
            })}
            <div style={{ margin: '8px 0', height: 1, background: '#E8DDD4' }} />
            {isSeller ? (
              <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                <button style={{ width: '100%', padding: '11px 14px', borderRadius: 9, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', background: 'transparent', color: '#4A3F35', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Leaf size={16} color="#7A7067" />
                  Seller Dashboard
                </button>
              </Link>
            ) : (
              <Link href="/sellers" style={{ textDecoration: 'none' }}>
                <button style={{ width: '100%', padding: '11px 14px', borderRadius: 9, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', background: 'transparent', color: '#1A5C38', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Leaf size={16} color="#1A5C38" />
                  Sell on BKB
                </button>
              </Link>
            )}
            <button onClick={handleLogout} style={{ width: '100%', padding: '11px 14px', borderRadius: 9, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', background: 'transparent', color: '#C0392B', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <LogOut size={16} color="#C0392B" />
              Log Out
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div>
          {/* PROFILE TAB */}
          {activeTab === 'Profile' && (
            <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '20px 26px', borderBottom: '1px solid #E8DDD4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1A1410', margin: 0 }}>Personal Information</h2>
                  {!editing && <p style={{ fontSize: 12, color: '#8C7B6E', margin: '4px 0 0' }}>Keep your details up to date for smooth deliveries</p>}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {editing ? (
                    <>
                      <button
                        onClick={handleCancelEdit}
                        style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, border: '1.5px solid #E8DDD4', background: 'transparent', color: '#6B5C50', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <X size={14} /> Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        style={{ padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700, border: 'none', background: '#1A5C38', color: '#fff', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Save size={14} /> Save Changes
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleStartEdit}
                      style={{ padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700, border: '1.5px solid #C85A08', background: 'transparent', color: '#C85A08', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Edit3 size={14} /> Edit Profile
                    </button>
                  )}
                </div>
              </div>

              <div style={{ padding: 26 }}>
                {editing ? (
                  /* EDIT FORM */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <FieldInput
                        label="Full Name"
                        value={editForm.name}
                        onChange={v => updateField('name', v)}
                        required
                        maxLength={120}
                        placeholder="Your full name"
                      />
                      <FieldInput
                        label="Email Address"
                        value={editForm.email}
                        onChange={v => updateField('email', v)}
                        type="email"
                        maxLength={254}
                        placeholder="you@example.com"
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: '#8C7B6E', textTransform: 'uppercase', letterSpacing: 0.5 }}>Mobile Number</label>
                        <div style={{ padding: '10px 13px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 14, background: '#F5EEE6', color: '#8C7B6E', display: 'flex', alignItems: 'center', gap: 6 }}>
                          +91 {savedMobile}
                          <span style={{ fontSize: 10, background: '#EAF5F0', color: '#1A5C38', fontWeight: 700, padding: '2px 7px', borderRadius: 10 }}>Verified</span>
                        </div>
                        <span style={{ fontSize: 10, color: '#8C7B6E' }}>Mobile number is your login ID and cannot be changed here.</span>
                      </div>
                      <FieldInput
                        label="PIN Code"
                        value={editForm.pincode}
                        onChange={v => updateField('pincode', v)}
                        maxLength={6}
                        placeholder="6-digit PIN code"
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: '#8C7B6E', textTransform: 'uppercase', letterSpacing: 0.5 }}>District</label>
                        <select
                          value={editForm.district}
                          onChange={e => updateField('district', e.target.value)}
                          style={{ padding: '10px 13px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', background: '#FFFCF8', color: '#1A1410', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                          onFocus={e => e.target.style.borderColor = '#C85A08'}
                          onBlur={e => e.target.style.borderColor = '#E8DDD4'}
                        >
                          {DISTRICTS.map(d => <option key={d} value={d === 'Select district' ? '' : d}>{d}</option>)}
                        </select>
                      </div>
                      <FieldInput
                        label="City / Town"
                        value={editForm.city}
                        onChange={v => updateField('city', v)}
                        maxLength={100}
                        placeholder="Your city or town"
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: '#8C7B6E', textTransform: 'uppercase', letterSpacing: 0.5 }}>Delivery Address</label>
                        <button
                          type="button"
                          onClick={() => setShowMap(true)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 8, border: '1.5px solid #1A5C38', background: '#EAF5F0', color: '#1A5C38', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                          <Map size={12} /> Pin on Map
                        </button>
                      </div>
                      <textarea
                        value={editForm.address}
                        onChange={e => updateField('address', e.target.value)}
                        maxLength={500}
                        placeholder="House/Flat No., Street, Area, Landmark..."
                        rows={3}
                        style={{ padding: '10px 13px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', background: '#FFFCF8', color: '#1A1410', outline: 'none', resize: 'vertical', width: '100%', boxSizing: 'border-box', lineHeight: 1.5 }}
                        onFocus={e => e.target.style.borderColor = '#C85A08'}
                        onBlur={e => e.target.style.borderColor = '#E8DDD4'}
                      />
                      {editForm.lat && editForm.lng && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: '#EAF5F0', borderRadius: 8, fontSize: 11, color: '#1A5C38', fontWeight: 600 }}>
                          <MapPin size={12} />
                          <span>Location pinned: {editForm.lat}° N, {editForm.lng}° E</span>
                          <button type="button" onClick={() => updateField('lat', null) || updateField('lng', null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#8C7B6E', fontSize: 11, padding: 0 }}>Remove</button>
                        </div>
                      )}
                    </div>

                    {saveStatus === 'error' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#FDECEA', border: '1px solid #D32F2F30', borderRadius: 8, fontSize: 13, color: '#D32F2F', fontWeight: 600 }}>
                        <AlertCircle size={15} /> {saveError}
                      </div>
                    )}
                  </div>
                ) : (
                  /* VIEW MODE */
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
                      {[
                        ['Full Name', buyerProfile.name || 'Not set'],
                        ['Email Address', buyerProfile.email || 'Not set'],
                        ['Mobile Number', `+91 ${savedMobile}`],
                        ['District', buyerProfile.district || 'Not set'],
                        ['PIN Code', buyerProfile.pincode || 'Not set'],
                        ['City / Town', buyerProfile.city || 'Not set'],
                      ].map(([label, val]) => (
                        <div key={label}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: '#8C7B6E', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
                          <div style={{ fontSize: 15, fontWeight: 500, color: val === 'Not set' ? '#C8BFB8' : '#1A1410', fontStyle: val === 'Not set' ? 'italic' : 'normal' }}>{val}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ borderTop: '1px solid #E8DDD4', paddingTop: 18, marginBottom: 18 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#8C7B6E', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Delivery Address</div>
                      <div style={{ fontSize: 15, fontWeight: 500, color: buyerProfile.address ? '#1A1410' : '#C8BFB8', fontStyle: buyerProfile.address ? 'normal' : 'italic' }}>
                        {buyerProfile.address || 'Not set - click Edit Profile to add'}
                      </div>
                    </div>
                    <div style={{ borderTop: '1px solid #E8DDD4', paddingTop: 18 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#8C7B6E', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>State</div>
                      <div style={{ fontSize: 15, fontWeight: 500, color: '#1A1410' }}>Bihar</div>
                    </div>
                  </div>
                )}
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
                  <div style={{ width: 60, height: 60, borderRadius: 10, background: o.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <o.icon size={26} color={o.color} />
                  </div>
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
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#EAF5F0', color: '#1A5C38', fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, marginBottom: 10 }}>
                      <CheckCircle2 size={11} /> Default Address
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1410', marginBottom: 4 }}>{buyerProfile.name || 'Name not set'}</div>
                    <div style={{ fontSize: 14, color: '#4A3F35', lineHeight: 1.7 }}>
                      {buyerProfile.address || 'Address not set'}<br />
                      {buyerProfile.city ? `${buyerProfile.city}, ` : ''}{buyerProfile.district ? `${buyerProfile.district}, ` : ''}Bihar{buyerProfile.pincode ? ` - ${buyerProfile.pincode}` : ''}<br />
                      Mobile: +91 {savedMobile}
                    </div>
                  </div>
                  <button
                    onClick={() => { setActiveTab('Profile'); handleStartEdit(); }}
                    style={{ padding: '7px 14px', background: '#FFF4EC', color: '#C85A08', border: '1.5px solid #FFE8D4', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                    Edit
                  </button>
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

          {/* Map Picker Modal */}
          {showMap && (
            <MapPicker
              onConfirm={handleMapConfirm}
              onClose={() => setShowMap(false)}
              initialLat={editForm.lat || undefined}
              initialLng={editForm.lng || undefined}
            />
          )}
    </div>
  );
}