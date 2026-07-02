'use client';

import { useState, useEffect } from 'react';

export default function AdminPrelaunchPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [total, setTotal] = useState(0);
  const [interestBreakdown, setInterestBreakdown] = useState({});
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  const fetchData = async () => {
    const token = localStorage.getItem('bkb_admin_token');
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);

      const res = await fetch(`/api/prelaunch?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setSubscribers(data.subscribers);
        setTotal(data.total);
        setInterestBreakdown(data.interestBreakdown || {});
        setTrend(data.trend || []);
      }
    } catch (err) {
      console.error('Fetch prelaunch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchData(), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this subscriber?')) return;
    const token = localStorage.getItem('bkb_admin_token');
    try {
      const res = await fetch(`/api/prelaunch?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        showToast('Subscriber removed.');
        fetchData();
      }
    } catch {
      showToast('Failed to remove.', 'error');
    }
  };

  const exportCSV = () => {
    if (subscribers.length === 0) return;
    const headers = ['ID', 'Name', 'Email', 'Phone', 'City', 'Interests', 'Registered At'];
    const rows = subscribers.map(s => [
      s.id, s.name, s.email, s.phone || '', s.city || '',
      (s.interests || []).join('; '), s.registeredAt
    ].map(v => `"${(v || '').toString().replace(/"/g, '""')}"`));

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bkb-prelaunch-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported!');
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  // Top interests
  const topInterests = Object.entries(interestBreakdown).sort((a, b) => b[1] - a[1]);

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
        }}>
          {toast.type === 'error' ? '⚠️' : '✅'} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#F5F0EB', fontFamily: "'Playfair Display', serif", marginBottom: 4 }}>
            🚀 Pre-Launch Signups
          </h1>
          <p style={{ fontSize: 13, color: '#6B6B78' }}>
            {total} total subscribers
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

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {/* Total Card */}
        <div style={{
          background: '#18181F', border: '1px solid #26262F', borderRadius: 16, padding: '22px 20px',
        }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#F5F0EB', fontFamily: "'Playfair Display', serif" }}>{total}</div>
          <div style={{ fontSize: 12, color: '#6B6B78', marginTop: 4 }}>Total Subscribers</div>
        </div>

        {/* Trend */}
        <div style={{
          background: '#18181F', border: '1px solid #26262F', borderRadius: 16, padding: '22px 20px',
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#F5F0EB', marginBottom: 12 }}>Daily Trend</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 40 }}>
            {trend.map((d, i) => {
              const maxVal = Math.max(...trend.map(t => t.count), 1);
              const height = Math.max(4, (d.count / maxVal) * 40);
              return (
                <div key={i} style={{
                  flex: 1, height, borderRadius: 3,
                  background: d.count > 0 ? 'linear-gradient(180deg, #7C4DFF, #B388FF)' : '#26262F',
                  minWidth: 12,
                }} title={`${d.date}: ${d.count}`} />
              );
            })}
          </div>
        </div>

        {/* Top Interest */}
        <div style={{
          background: '#18181F', border: '1px solid #26262F', borderRadius: 16, padding: '22px 20px',
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#F5F0EB', marginBottom: 10 }}>Top Interests</div>
          {topInterests.length === 0 ? (
            <div style={{ fontSize: 12, color: '#3A3A45', fontStyle: 'italic' }}>No data yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {topInterests.slice(0, 3).map(([interest, count]) => (
                <div key={interest} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#9B9BA8' }}>{interest}</span>
                  <span style={{ color: '#F5F0EB', fontWeight: 700 }}>{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 18 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Search by name, email, phone, or city..."
          style={{
            width: '100%', maxWidth: 500, padding: '12px 18px',
            background: '#18181F', border: '1.5px solid #26262F',
            borderRadius: 12, fontSize: 13, color: '#F5F0EB',
            fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = '#7C4DFF'}
          onBlur={e => e.target.style.borderColor = '#26262F'}
        />
      </div>

      {/* Subscribers Table */}
      <div style={{
        background: '#18181F', border: '1px solid #26262F',
        borderRadius: 16, overflow: 'hidden',
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 1.5fr 0.5fr',
          padding: '12px 20px',
          background: '#14141A',
          borderBottom: '1px solid #1E1E26',
        }}>
          {['Name', 'Email', 'Phone', 'City', 'Interests', ''].map(h => (
            <span key={h} style={{
              fontSize: 10, fontWeight: 700, color: '#6B6B78',
              textTransform: 'uppercase', letterSpacing: 1.2,
            }}>{h}</span>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 8, animation: 'pulse 1.5s infinite' }}>⏳</div>
            <div style={{ fontSize: 13, color: '#6B6B78' }}>Loading subscribers...</div>
          </div>
        ) : subscribers.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🚀</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#9B9BA8', marginBottom: 4 }}>No pre-launch signups yet</div>
            <div style={{ fontSize: 12, color: '#6B6B78' }}>Share the pre-launch page to start collecting subscribers</div>
          </div>
        ) : (
          subscribers.map((sub, i) => (
            <div key={sub.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 1.5fr 0.5fr',
                alignItems: 'center',
                padding: '14px 20px',
                borderBottom: i < subscribers.length - 1 ? '1px solid #1E1E26' : 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#F5F0EB' }}>{sub.name}</div>
                <div style={{ fontSize: 10, color: '#4A4A56', marginTop: 2 }}>{formatDate(sub.registeredAt)}</div>
              </div>
              <div style={{ fontSize: 12, color: '#9B9BA8' }}>{sub.email}</div>
              <div style={{ fontSize: 12, color: '#9B9BA8' }}>{sub.phone || '—'}</div>
              <div style={{ fontSize: 12, color: '#9B9BA8' }}>{sub.city || '—'}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {(sub.interests || []).slice(0, 3).map(int => (
                  <span key={int} style={{
                    fontSize: 10, padding: '2px 8px', borderRadius: 12,
                    background: 'rgba(124,77,255,0.1)', color: '#B388FF', fontWeight: 500,
                  }}>{int}</span>
                ))}
                {(sub.interests || []).length > 3 && (
                  <span style={{ fontSize: 10, color: '#6B6B78' }}>+{sub.interests.length - 3}</span>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <button onClick={() => handleDelete(sub.id)}
                  style={{
                    background: 'none', border: 'none', color: '#6B6B78',
                    cursor: 'pointer', fontSize: 14, padding: 4, transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.target.style.color = '#EF5350'}
                  onMouseLeave={e => e.target.style.color = '#6B6B78'}
                  title="Remove subscriber"
                >✕</button>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}
