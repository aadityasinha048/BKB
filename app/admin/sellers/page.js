'use client';

import { useState, useEffect } from 'react';

const STATUS_OPTIONS = ['All', 'Account Created', 'Completed', 'Approved', 'Rejected', 'Flagged'];

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
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);
  const [notesModal, setNotesModal] = useState(null);
  const [noteText, setNoteText] = useState('');

  const fetchSellers = async () => {
    const token = localStorage.getItem('bkb_admin_token');
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter !== 'All') params.set('status', statusFilter);

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
  }, [statusFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSellers();
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

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
        showToast(data.error || 'Failed to update.', 'error');
      }
    } catch {
      showToast('Network error.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

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

  const exportCSV = () => {
    if (sellers.length === 0) return;
    const headers = ['ID', 'Name', 'Mobile', 'Email', 'District', 'Village/Town', 'Pin Code', 'Category', 'Seller Type', 'Status', 'Registered At', 'Monthly Capacity', 'GST', 'Payout Method', 'Admin Notes'];
    const rows = sellers.map(s => [
      s.id, s.fullName, s.mobile, s.email || '', s.district, s.villageTown, s.pinCode,
      s.category, s.sellerType, s.status || 'Pending', s.registeredAt, s.monthlyCapacity,
      s.hasGst || 'N/A', s.payoutMethod, s.adminNotes || ''
    ].map(v => `"${(v || '').toString().replace(/"/g, '""')}"`));

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bkb-sellers-${new Date().toISOString().split('T')[0]}.csv`;
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

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1400 }}>

      {/* Toast */}
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

      {/* Notes Modal */}
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
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#F5F0EB', marginBottom: 16 }}>📝 Admin Notes</h3>
            <textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Add internal notes about this seller..."
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

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#F5F0EB', fontFamily: "'Playfair Display', serif", marginBottom: 4 }}>
            Seller Management
          </h1>
          <p style={{ fontSize: 13, color: '#6B6B78' }}>
            {stats.total || 0} total sellers · {sellers.length} shown
          </p>
        </div>
        <button onClick={exportCSV}
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
          📥 Export CSV
        </button>
      </div>

      {/* Status Filter Tabs */}
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

      {/* Search */}
      <div style={{ marginBottom: 18 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Search by name, mobile, email, district, or seller ID..."
          style={{
            width: '100%', maxWidth: 500, padding: '12px 18px',
            background: '#18181F', border: '1.5px solid #26262F',
            borderRadius: 12, fontSize: 13, color: '#F5F0EB',
            fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = '#C85A08'}
          onBlur={e => e.target.style.borderColor = '#26262F'}
        />
      </div>

      {/* Sellers Table */}
      <div style={{
        background: '#18181F', border: '1px solid #26262F',
        borderRadius: 16, overflow: 'hidden',
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1.2fr 1fr 1fr 0.8fr 0.5fr',
          padding: '12px 20px',
          background: '#14141A',
          borderBottom: '1px solid #1E1E26',
        }}>
          {['Seller', 'Contact', 'District', 'Category', 'Status', ''].map(h => (
            <span key={h} style={{
              fontSize: 10, fontWeight: 700, color: '#6B6B78',
              textTransform: 'uppercase', letterSpacing: 1.2,
            }}>{h}</span>
          ))}
        </div>

        {/* Loading */}
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 8, animation: 'pulse 1.5s infinite' }}>⏳</div>
            <div style={{ fontSize: 13, color: '#6B6B78' }}>Loading sellers...</div>
          </div>
        ) : sellers.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📭</div>
            <div style={{ fontSize: 13, color: '#6B6B78' }}>No sellers found matching your filters.</div>
          </div>
        ) : (
          sellers.map((seller, i) => {
            const isExpanded = expandedId === seller.id;
            const isLoading = actionLoading === seller.id;

            return (
              <div key={seller.id}>
                {/* Row */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1.2fr 1fr 1fr 0.8fr 0.5fr',
                    alignItems: 'center',
                    padding: '14px 20px',
                    borderBottom: '1px solid #1E1E26',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                    background: isExpanded ? 'rgba(200,90,8,0.04)' : 'transparent',
                  }}
                  onClick={() => setExpandedId(isExpanded ? null : seller.id)}
                  onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                  onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.background = 'transparent'; }}
                >
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

                {/* Expanded Detail */}
                {isExpanded && (
                  <div style={{
                    padding: '20px 24px',
                    background: '#14141A',
                    borderBottom: '1px solid #1E1E26',
                    animation: 'slideIn 0.2s ease',
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
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

                      {/* Financial & Meta */}
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
                    </div>

                    {/* Actions */}
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
                          }}>✅ Approve</button>
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
                          }}>🚩 Flag</button>
                      )}
                      <button onClick={() => {
                        setNotesModal(seller.id);
                        setNoteText(seller.adminNotes || '');
                      }}
                        style={{
                          padding: '9px 18px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                          background: 'rgba(124,77,255,0.1)', border: '1px solid rgba(124,77,255,0.25)',
                          color: '#B388FF', cursor: 'pointer', fontFamily: 'inherit',
                        }}>📝 Notes</button>
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
      `}</style>
    </div>
  );
}
