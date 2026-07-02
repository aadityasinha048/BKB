'use client';

import { useState, useEffect } from 'react';
import { DISTRICTS, CATEGORIES } from '@/lib/constants';

const STATUS_OPTIONS = ['All', 'Account Created', 'Completed', 'Approved', 'Rejected', 'Flagged'];

// Default empty checklist schema
const CHECKLIST_ITEMS = [
  { key: 'phoneVerified', label: 'Phone verified via call' },
  { key: 'aadhaarMatched', label: 'Aadhaar name matches profile' },
  { key: 'bankInfoConfirmed', label: 'Bank account/UPI ID verified' },
  { key: 'categoryCompliant', label: 'Products meet marketplace guidelines' },
];

function StatusBadge({ status }) {
  const styles = {
    'Completed': { bg: 'rgba(26,92,56,0.12)', color: '#4CAF50', dot: '#4CAF50' },
    'Account Created': { bg: 'rgba(200,90,8,0.12)', color: '#F09819', dot: '#F09819' },
    'Approved': { bg: 'rgba(26,92,56,0.15)', color: '#2E7D32', dot: '#2E7D32' },
    'Rejected': { bg: 'rgba(211,47,47,0.12)', color: '#EF5350', dot: '#EF5350' },
    'Flagged': { bg: 'rgba(249,168,37,0.12)', color: '#F9A825', dot: '#F9A825' },
  };
  const s = styles[status] || styles['Account Created'];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 11, fontWeight: 600, padding: '4px 10px',
      borderRadius: 20, background: s.bg, color: s.color,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot }} />
      {status || 'Pending'}
    </span>
  );
}

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [districtFilter, setDistrictFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Selection state
  const [selectedIds, setSelectedIds] = useState([]);
  
  const [expandedId, setExpandedId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);
  const [notesModal, setNotesModal] = useState(null);
  const [noteText, setNoteText] = useState('');

  // Check URL parameters for initial filters (e.g. from the district heatmap links)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlDistrict = params.get('district');
      if (urlDistrict) {
        setDistrictFilter(urlDistrict);
      }
    }
  }, []);

  const fetchSellers = async () => {
    const token = localStorage.getItem('bkb_admin_token');
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter !== 'All') params.set('status', statusFilter);
      if (districtFilter) params.set('district', districtFilter);
      if (categoryFilter) params.set('category', categoryFilter);

      const res = await fetch(`/api/admin/sellers?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setSellers(data.sellers);
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Fetch sellers error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
    setSelectedIds([]); // Clear selection when filters change
  }, [statusFilter, districtFilter, categoryFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSellers();
    }, 450);
    return () => clearTimeout(timer);
  }, [search]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Toggle selection for a single row
  const toggleSelectRow = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Toggle select all visible rows
  const toggleSelectAll = () => {
    const visibleIds = sellers.map(s => s.id);
    const allSelected = visibleIds.every(id => selectedIds.includes(id));

    if (allSelected) {
      // Uncheck visible
      setSelectedIds(prev => prev.filter(id => !visibleIds.includes(id)));
    } else {
      // Check visible
      setSelectedIds(prev => {
        const unique = new Set([...prev, ...visibleIds]);
        return Array.from(unique);
      });
    }
  };

  // Handle single status change
  const handleStatusChange = async (sellerId, newStatus) => {
    setActionLoading(sellerId);
    const token = localStorage.getItem('bkb_admin_token');
    try {
      const res = await fetch('/api/admin/sellers', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ sellerId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Seller ${newStatus.toLowerCase()} successfully!`);
        fetchSellers();
      } else {
        showToast(data.error || 'Failed to update status.', 'error');
      }
    } catch {
      showToast('Network error.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle bulk status change
  const handleBulkStatusChange = async (newStatus) => {
    if (selectedIds.length === 0) return;
    setActionLoading('bulk');
    const token = localStorage.getItem('bkb_admin_token');
    try {
      const res = await fetch('/api/admin/sellers', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ sellerIds: selectedIds, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Successfully updated ${data.updatedCount} sellers to ${newStatus.toLowerCase()}.`);
        setSelectedIds([]);
        fetchSellers();
      } else {
        showToast(data.error || 'Failed to update bulk status.', 'error');
      }
    } catch {
      showToast('Network error.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} selected sellers? This action is permanent.`)) return;

    setActionLoading('bulk');
    const token = localStorage.getItem('bkb_admin_token');
    try {
      const res = await fetch(`/api/admin/sellers?sellerIds=${selectedIds.join(',')}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Deleted ${data.deletedCount} sellers.`);
        setSelectedIds([]);
        setExpandedId(null);
        fetchSellers();
      } else {
        showToast(data.error || 'Failed to execute bulk delete.', 'error');
      }
    } catch {
      showToast('Network error.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle individual verification checklist change
  const handleChecklistChange = async (sellerId, itemKey, checked) => {
    const token = localStorage.getItem('bkb_admin_token');
    const seller = sellers.find(s => s.id === sellerId);
    if (!seller) return;

    const checklist = { ...(seller.verificationChecklist || {}) };
    checklist[itemKey] = checked;

    try {
      // Optimistically update frontend state
      setSellers(prev => prev.map(s =>
        s.id === sellerId ? { ...s, verificationChecklist: checklist } : s
      ));

      const res = await fetch('/api/admin/sellers', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ sellerId, verificationChecklist: checklist }),
      });
      const data = await res.json();
      if (!data.success) {
        showToast(data.error || 'Failed to save checklist state.', 'error');
        fetchSellers(); // Rollback on failure
      }
    } catch {
      showToast('Network error updating verification checkbox.', 'error');
      fetchSellers(); // Rollback on error
    }
  };

  // Handle delete single seller
  const handleDelete = async (sellerId) => {
    if (!confirm('Are you sure you want to delete this seller? This cannot be undone.')) return;
    setActionLoading(sellerId);
    const token = localStorage.getItem('bkb_admin_token');
    try {
      const res = await fetch(`/api/admin/sellers?sellerId=${sellerId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        showToast('Seller deleted.');
        setExpandedId(null);
        setSelectedIds(prev => prev.filter(id => id !== sellerId));
        fetchSellers();
      } else {
        showToast(data.error || 'Failed to delete.', 'error');
      }
    } catch {
      showToast('Network error.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle admin notes save
  const handleSaveNotes = async () => {
    if (!notesModal) return;
    setActionLoading(notesModal);
    const token = localStorage.getItem('bkb_admin_token');
    try {
      const res = await fetch('/api/admin/sellers', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ sellerId: notesModal, adminNotes: noteText }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Notes saved!');
        setNotesModal(null);
        setNoteText('');
        fetchSellers();
      }
    } catch {
      showToast('Failed to save notes.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Export to CSV helper
  const exportCSV = (exportList = sellers) => {
    if (exportList.length === 0) return;
    const headers = ['ID', 'Name', 'Mobile', 'Email', 'District', 'Village/Town', 'Pin Code', 'Category', 'Seller Type', 'Status', 'Registered At', 'Monthly Capacity', 'GST Status', 'GSTIN Number', 'Payout Method', 'UPI ID', 'Aadhaar Number', 'Verification Checklist', 'Admin Notes'];
    
    const rows = exportList.map(s => {
      const cl = s.verificationChecklist || {};
      const checklistStr = Object.entries(cl)
        .map(([k, v]) => `${k}:${v ? 'YES' : 'NO'}`)
        .join('; ');

      return [
        s.id, s.fullName, s.mobile, s.email || '', s.district, s.villageTown, s.pinCode,
        s.category, s.sellerType, s.status || 'Pending', s.registeredAt, s.monthlyCapacity,
        s.hasGst || 'N/A', s.gstNumber || '', s.payoutMethod, s.upiId || '', s.aadhaarNumber || '',
        checklistStr, s.adminNotes || ''
      ].map(v => `"${(v || '').toString().replace(/"/g, '""')}"`);
    });

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bkb-sellers-${exportList === sellers ? 'filtered' : 'selected'}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported!');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  // Determine if visible rows are selected
  const allVisibleSelected = sellers.length > 0 && sellers.map(s => s.id).every(id => selectedIds.includes(id));
  const someVisibleSelected = sellers.length > 0 && sellers.some(s => selectedIds.includes(s.id));

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1400 }}>

      {/* Toast Alert */}
      {toast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 100,
          padding: '14px 22px', borderRadius: 12,
          background: toast.type === 'error' ? '#2A1215' : '#122A1A',
          border: `1px solid ${toast.type === 'error' ? 'rgba(211,47,47,0.3)' : 'rgba(26,92,56,0.3)'}`,
          color: toast.type === 'error' ? '#EF5350' : '#4CAF50',
          fontSize: 13, fontWeight: 600,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          animation: 'slideIn 0.3s ease',
        }}>
          {toast.type === 'error' ? '⚠️' : '✅'} {toast.msg}
        </div>
      )}

      {/* Notes Dialog Modal */}
      {notesModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 90,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(4px)',
        }} onClick={() => { setNotesModal(null); setNoteText(''); }}>
          <div style={{
            background: '#18181F', border: '1px solid #26262F',
            borderRadius: 18, padding: 28, width: 440,
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#F5F0EB', marginBottom: 16 }}>📝 Update Notes</h3>
            <textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Add internal notes about verification status..."
              rows={4}
              style={{
                width: '100%', padding: '12px 14px', background: '#0F0F12',
                border: '1.5px solid #26262F', borderRadius: 10, fontSize: 13,
                color: '#F5F0EB', fontFamily: 'inherit', outline: 'none',
                resize: 'vertical', lineHeight: 1.6,
              }}
              onFocus={e => e.target.style.borderColor = '#C85A08'}
              onBlur={e => e.target.style.borderColor = '#26262F'}
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 16, justifyContent: 'flex-end' }}>
              <button onClick={() => { setNotesModal(null); setNoteText(''); }}
                style={{
                  padding: '9px 18px', background: 'none', border: '1px solid #26262F',
                  borderRadius: 8, color: '#9B9BA8', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>Cancel</button>
              <button onClick={handleSaveNotes}
                style={{
                  padding: '9px 18px', background: 'linear-gradient(135deg, #C85A08, #E87A28)',
                  border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>Save Notes</button>
            </div>
          </div>
        </div>
      )}

      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#F5F0EB', fontFamily: "'Playfair Display', serif", marginBottom: 4 }}>
            Seller Management
          </h1>
          <p style={{ fontSize: 13, color: '#6B6B78' }}>
            {stats.total || 0} total sellers · {sellers.length} shown
          </p>
        </div>
        <button onClick={() => exportCSV()}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', background: 'rgba(26,92,56,0.12)',
            border: '1px solid rgba(26,92,56,0.25)', borderRadius: 10,
            color: '#4CAF50', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(26,92,56,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(26,92,56,0.12)'}
        >
          📥 Export Filtered CSV
        </button>
      </div>

      {/* Interactive Filters Panel */}
      <div style={{
        background: '#18181F', border: '1px solid #26262F',
        borderRadius: 16, padding: '18px 20px', marginBottom: 20,
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
      }}>
        {/* District Filter */}
        <div>
          <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#6B6B78', textTransform: 'uppercase', marginBottom: 6, letterSpacing: 0.5 }}>District</label>
          <select
            value={districtFilter}
            onChange={e => setDistrictFilter(e.target.value)}
            style={{
              width: '100%', padding: '10px 12px', background: '#0F0F12',
              border: '1.5px solid #26262F', borderRadius: 8, fontSize: 13,
              color: '#F5F0EB', fontFamily: 'inherit', outline: 'none', cursor: 'pointer',
            }}
          >
            <option value="">All Districts</option>
            {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#6B6B78', textTransform: 'uppercase', marginBottom: 6, letterSpacing: 0.5 }}>Category</label>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            style={{
              width: '100%', padding: '10px 12px', background: '#0F0F12',
              border: '1.5px solid #26262F', borderRadius: 8, fontSize: 13,
              color: '#F5F0EB', fontFamily: 'inherit', outline: 'none', cursor: 'pointer',
            }}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Quick Search */}
        <div style={{ gridColumn: 'span 1' }}>
          <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#6B6B78', textTransform: 'uppercase', marginBottom: 6, letterSpacing: 0.5 }}>Search Query</label>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Name, phone, business, etc..."
            style={{
              width: '100%', padding: '10px 12px', background: '#0F0F12',
              border: '1.5px solid #26262F', borderRadius: 8, fontSize: 13,
              color: '#F5F0EB', fontFamily: 'inherit', outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = '#C85A08'}
            onBlur={e => e.target.style.borderColor = '#26262F'}
          />
        </div>
      </div>

      {/* Status Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
        {STATUS_OPTIONS.map(s => {
          const isActive = statusFilter === s;
          const count = s === 'All' ? stats.total : (stats[s === 'Account Created' ? 'accountCreated' : s.toLowerCase()] || 0);
          return (
            <button key={s} onClick={() => setStatusFilter(s)}
              style={{
                padding: '8px 16px', borderRadius: 8,
                fontSize: 12, fontWeight: isActive ? 700 : 500,
                background: isActive ? 'rgba(200,90,8,0.15)' : '#18181F',
                border: `1px solid ${isActive ? 'rgba(200,90,8,0.3)' : '#26262F'}`,
                color: isActive ? '#F09819' : '#9B9BA8',
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = '#3A3A45'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = '#26262F'; }}
            >
              {s} {count !== undefined ? `(${count})` : ''}
            </button>
          );
        })}
      </div>

      {/* Floating Action Bar for Bulk Selections */}
      {selectedIds.length > 0 && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          zIndex: 80, background: '#181824', border: '1.5px solid #C85A08',
          borderRadius: 16, padding: '12px 24px', display: 'flex', alignItems: 'center',
          gap: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          <span style={{ fontSize: 13, color: '#F5F0EB', fontWeight: 700 }}>
            {selectedIds.length} Sellers Selected
          </span>
          <div style={{ width: 1, height: 20, background: '#26262F' }} />
          
          <button
            onClick={() => handleBulkStatusChange('Approved')}
            disabled={actionLoading === 'bulk'}
            style={{ padding: '8px 14px', background: 'rgba(46,125,50,0.2)', border: '1px solid #2E7D32', borderRadius: 8, color: '#4CAF50', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Approve
          </button>
          <button
            onClick={() => handleBulkStatusChange('Rejected')}
            disabled={actionLoading === 'bulk'}
            style={{ padding: '8px 14px', background: 'rgba(211,47,47,0.2)', border: '1px solid #D32F2F', borderRadius: 8, color: '#EF5350', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Reject
          </button>
          <button
            onClick={() => exportCSV(sellers.filter(s => selectedIds.includes(s.id)))}
            style={{ padding: '8px 14px', background: 'rgba(200,90,8,0.15)', border: '1px solid #C85A08', borderRadius: 8, color: '#F09819', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Export Selected
          </button>
          <button
            onClick={handleBulkDelete}
            disabled={actionLoading === 'bulk'}
            style={{ padding: '8px 14px', background: 'rgba(211,47,47,0.1)', border: '1px solid rgba(211,47,47,0.3)', borderRadius: 8, color: '#EF5350', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Delete
          </button>
          <button
            onClick={() => setSelectedIds([])}
            style={{ background: 'none', border: 'none', color: '#6B6B78', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Sellers Grid / Table */}
      <div style={{
        background: '#18181F', border: '1px solid #26262F',
        borderRadius: 16, overflow: 'hidden',
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '40px 2fr 1.2fr 1fr 1fr 0.8fr 0.5fr',
          padding: '12px 20px',
          background: '#14141A',
          borderBottom: '1px solid #1E1E26',
          alignItems: 'center',
        }}>
          {/* Select All Checkbox */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={allVisibleSelected}
              ref={input => {
                if (input) {
                  input.indeterminate = someVisibleSelected && !allVisibleSelected;
                }
              }}
              onChange={toggleSelectAll}
              style={{ cursor: 'pointer', width: 15, height: 15 }}
            />
          </div>
          {['Seller', 'Contact', 'District', 'Category', 'Status', ''].map(h => (
            <span key={h} style={{
              fontSize: 10, fontWeight: 700, color: '#6B6B78',
              textTransform: 'uppercase', letterSpacing: 1.2,
            }}>{h}</span>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 8, animation: 'pulse 1.5s infinite' }}>⏳</div>
            <div style={{ fontSize: 13, color: '#6B6B78' }}>Loading sellers database...</div>
          </div>
        ) : sellers.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📭</div>
            <div style={{ fontSize: 13, color: '#6B6B78' }}>No sellers found matching filters.</div>
          </div>
        ) : (
          sellers.map((seller, i) => {
            const isExpanded = expandedId === seller.id;
            const isRowSelected = selectedIds.includes(seller.id);
            const isLoading = actionLoading === seller.id;

            return (
              <div key={seller.id} style={{ background: isRowSelected ? '#1A1C20' : 'transparent' }}>
                {/* Row */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '40px 2fr 1.2fr 1fr 1fr 0.8fr 0.5fr',
                    alignItems: 'center',
                    padding: '14px 20px',
                    borderBottom: '1px solid #1E1E26',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onClick={() => setExpandedId(isExpanded ? null : seller.id)}
                  onMouseEnter={e => { if (!isExpanded && !isRowSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                  onMouseLeave={e => { if (!isExpanded && !isRowSelected) e.currentTarget.style.background = 'transparent'; }}
                >
                  {/* Select Row Checkbox */}
                  <div style={{ display: 'flex', alignItems: 'center' }} onClick={e => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isRowSelected}
                      onChange={() => toggleSelectRow(seller.id)}
                      style={{ cursor: 'pointer', width: 14, height: 14 }}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#F5F0EB' }}>{seller.fullName}</div>
                    <div style={{ fontSize: 10, color: '#4A4A56', marginTop: 2, fontFamily: 'monospace' }}>{seller.id}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#9B9BA8' }}>{seller.mobile}</div>
                    <div style={{ fontSize: 11, color: '#6B6B78', marginTop: 1 }}>{seller.email || '—'}</div>
                  </div>
                  <div style={{ fontSize: 12, color: '#9B9BA8' }}>{seller.district || '—'}</div>
                  <div style={{ fontSize: 12, color: '#9B9BA8' }}>{seller.category || '—'}</div>
                  <StatusBadge status={seller.status} />
                  <div style={{ textAlign: 'right', fontSize: 14, color: '#6B6B78' }}>
                    {isExpanded ? '▲' : '▼'}
                  </div>
                </div>

                {/* Expanded Detail Audit Panel */}
                {isExpanded && (
                  <div style={{
                    padding: '24px 28px',
                    background: '#14141A',
                    borderBottom: '1px solid #1E1E26',
                    animation: 'slideIn 0.2s ease',
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr 1fr', gap: 24 }}>
                      {/* Personal */}
                      <div>
                        <h4 style={{ fontSize: 11, fontWeight: 700, color: '#C85A08', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>Personal Info</h4>
                        {[
                          ['Name', seller.fullName],
                          ['Mobile', seller.mobile],
                          ['Email', seller.email],
                          ['Language', seller.language],
                          ['Seller Type', seller.sellerType],
                          ['Business', seller.businessName],
                        ].map(([label, val]) => (
                          <div key={label} style={{ marginBottom: 8 }}>
                            <div style={{ fontSize: 10, color: '#6B6B78', fontWeight: 600, marginBottom: 2 }}>{label}</div>
                            <div style={{ fontSize: 13, color: '#F5F0EB' }}>{val || '—'}</div>
                          </div>
                        ))}
                      </div>

                      {/* Location & Product */}
                      <div>
                        <h4 style={{ fontSize: 11, fontWeight: 700, color: '#1A5C38', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>Location & Product</h4>
                        {[
                          ['District', seller.district],
                          ['Village/Town', seller.villageTown],
                          ['Pin Code', seller.pinCode],
                          ['Address', seller.streetAddress],
                          ['Category', seller.category],
                          ['Products', seller.productDescription],
                          ['Monthly Capacity', seller.monthlyCapacity],
                        ].map(([label, val]) => (
                          <div key={label} style={{ marginBottom: 8 }}>
                            <div style={{ fontSize: 10, color: '#6B6B78', fontWeight: 600, marginBottom: 2 }}>{label}</div>
                            <div style={{ fontSize: 13, color: '#F5F0EB' }}>{val || '—'}</div>
                          </div>
                        ))}
                      </div>

                      {/* Financial & Verification */}
                      <div>
                        <h4 style={{ fontSize: 11, fontWeight: 700, color: '#7C4DFF', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>Financial & Verification</h4>
                        {[
                          ['GST Status', seller.hasGst],
                          ['GST Number', seller.gstNumber],
                          ['Payout Method', seller.payoutMethod === 'upi' ? `UPI: ${seller.upiId}` : seller.payoutMethod === 'bank' ? `Bank: ****${(seller.bankAccountNumber || '').slice(-4)}` : '—'],
                          ['IFSC', seller.bankIfsc],
                          ['Aadhaar', seller.aadhaarNumber ? `****${seller.aadhaarNumber.slice(-4)}` : '—'],
                          ['Registered', formatDate(seller.registeredAt)],
                          ['Admin Notes', seller.adminNotes],
                        ].map(([label, val]) => (
                          <div key={label} style={{ marginBottom: 8 }}>
                            <div style={{ fontSize: 10, color: '#6B6B78', fontWeight: 600, marginBottom: 2 }}>{label}</div>
                            <div style={{ fontSize: 13, color: '#F5F0EB' }}>{val || '—'}</div>
                          </div>
                        ))}
                      </div>

                      {/* Verification Checklist persistence column */}
                      <div style={{ background: '#0F0F12', padding: 16, borderRadius: 12, border: '1px solid #26262F' }}>
                        <h4 style={{ fontSize: 11, fontWeight: 700, color: '#F09819', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 14 }}>
                          Audit Checklist
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          {CHECKLIST_ITEMS.map(item => {
                            const isChecked = seller.verificationChecklist?.[item.key] || false;
                            return (
                              <label key={item.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={e => handleChecklistChange(seller.id, item.key, e.target.checked)}
                                  style={{ marginTop: 2, cursor: 'pointer' }}
                                />
                                <span style={{ fontSize: 11, color: isChecked ? '#F5F0EB' : '#9B9BA8', lineHeight: 1.3, fontWeight: isChecked ? 600 : 400 }}>
                                  {item.label}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                        <div style={{ marginTop: 14, fontSize: 10, color: '#6B6B78', fontStyle: 'italic', borderTop: '1px solid #1E1E26', paddingTop: 10 }}>
                          Checkmarks auto-save to database in real-time.
                        </div>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div style={{
                      display: 'flex', gap: 10, marginTop: 20, paddingTop: 16,
                      borderTop: '1px solid #26262F', flexWrap: 'wrap',
                    }}>
                      {seller.status !== 'Approved' && (
                        <button onClick={() => handleStatusChange(seller.id, 'Approved')}
                          disabled={isLoading}
                          style={{
                            padding: '9px 18px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                            background: 'rgba(26,92,56,0.15)', border: '1px solid rgba(26,92,56,0.3)',
                            color: '#4CAF50', cursor: 'pointer', fontFamily: 'inherit',
                          }}>✅ Approve Seller</button>
                      )}
                      {seller.status !== 'Rejected' && (
                        <button onClick={() => handleStatusChange(seller.id, 'Rejected')}
                          disabled={isLoading}
                          style={{
                            padding: '9px 18px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                            background: 'rgba(211,47,47,0.1)', border: '1px solid rgba(211,47,47,0.25)',
                            color: '#EF5350', cursor: 'pointer', fontFamily: 'inherit',
                          }}>❌ Reject</button>
                      )}
                      {seller.status !== 'Flagged' && (
                        <button onClick={() => handleStatusChange(seller.id, 'Flagged')}
                          disabled={isLoading}
                          style={{
                            padding: '9px 18px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                            background: 'rgba(249,168,37,0.1)', border: '1px solid rgba(249,168,37,0.25)',
                            color: '#F9A825', cursor: 'pointer', fontFamily: 'inherit',
                          }}>🚩 Flag Under Review</button>
                      )}
                      <button onClick={() => {
                        setNotesModal(seller.id);
                        setNoteText(seller.adminNotes || '');
                      }}
                        style={{
                          padding: '9px 18px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                          background: 'rgba(124,77,255,0.1)', border: '1px solid rgba(124,77,255,0.25)',
                          color: '#B388FF', cursor: 'pointer', fontFamily: 'inherit',
                        }}>📝 Add notes / details</button>
                      <button onClick={() => handleDelete(seller.id)}
                        disabled={isLoading}
                        style={{
                          padding: '9px 18px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                          background: 'rgba(211,47,47,0.06)', border: '1px solid rgba(211,47,47,0.15)',
                          color: '#EF5350', cursor: 'pointer', fontFamily: 'inherit', marginLeft: 'auto',
                        }}>🗑️ Delete</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
        @keyframes slideUp { from { opacity: 0; transform: translate(-50%, 20px); } to { opacity: 1; transform: translate(-50%, 0); } }
      `}</style>
    </div>
  );
}
