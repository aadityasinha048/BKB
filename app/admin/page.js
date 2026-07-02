'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

function KPICard({ icon, label, value, subtext, color, bgColor }) {
  return (
    <div
      style={{
        background: '#18181F',
        border: '1px solid #26262F',
        borderRadius: 16,
        padding: '22px 20px',
        transition: 'all 0.25s',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = color || '#3A3A45';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.3)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#26262F';
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: bgColor || 'rgba(200,90,8,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20,
        }}>{icon}</div>
        {subtext && (
          <span style={{ fontSize: 11, fontWeight: 600, color: '#1A5C38', background: 'rgba(26,92,56,0.12)', padding: '3px 10px', borderRadius: 20 }}>
            {subtext}
          </span>
        )}
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, color: '#F5F0EB', fontFamily: "'Playfair Display', serif", marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: '#6B6B78', fontWeight: 500 }}>{label}</div>
    </div>
  );
}

function MiniBarChart({ data, maxHeight = 60 }) {
  const maxVal = Math.max(...data.map(d => d.count), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: maxHeight }}>
      {data.map((d, i) => {
        const height = Math.max(4, (d.count / maxVal) * maxHeight);
        const day = new Date(d.date).toLocaleDateString('en-IN', { weekday: 'short' });
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: 6 }}>
            <div
              style={{
                width: '100%',
                height,
                borderRadius: 4,
                background: d.count > 0 ? 'linear-gradient(180deg, #C85A08, #F09819)' : '#26262F',
                transition: 'height 0.4s ease',
                minWidth: 16,
              }}
              title={`${d.date}: ${d.count} registrations`}
            />
            <span style={{ fontSize: 9, color: '#6B6B78', fontWeight: 500 }}>{day}</span>
          </div>
        );
      })}
    </div>
  );
}

function RecentSellerRow({ seller, isLast }) {
  const statusColors = {
    'Completed': { bg: 'rgba(26,92,56,0.12)', color: '#4CAF50', dot: '#4CAF50' },
    'Account Created': { bg: 'rgba(200,90,8,0.12)', color: '#F09819', dot: '#F09819' },
    'Approved': { bg: 'rgba(26,92,56,0.15)', color: '#2E7D32', dot: '#2E7D32' },
    'Rejected': { bg: 'rgba(211,47,47,0.12)', color: '#EF5350', dot: '#EF5350' },
    'Flagged': { bg: 'rgba(249,168,37,0.12)', color: '#F9A825', dot: '#F9A825' },
  };

  const statusStyle = statusColors[seller.status] || statusColors['Account Created'];
  const timeAgo = getTimeAgo(seller.registeredAt);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr 0.8fr 0.8fr 0.6fr',
      alignItems: 'center',
      padding: '14px 20px',
      borderBottom: isLast ? 'none' : '1px solid #1E1E26',
      transition: 'background 0.15s',
    }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#F5F0EB' }}>{seller.fullName}</div>
        <div style={{ fontSize: 11, color: '#6B6B78', marginTop: 2 }}>{seller.mobile}</div>
      </div>
      <div style={{ fontSize: 12, color: '#9B9BA8' }}>{seller.district || '—'}</div>
      <div style={{ fontSize: 12, color: '#9B9BA8' }}>{seller.category || '—'}</div>
      <div>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          fontSize: 11,
          fontWeight: 600,
          padding: '4px 10px',
          borderRadius: 20,
          background: statusStyle.bg,
          color: statusStyle.color,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusStyle.dot }} />
          {seller.status || 'Pending'}
        </span>
      </div>
      <div style={{ fontSize: 11, color: '#6B6B78', textAlign: 'right' }}>{timeAgo}</div>
    </div>
  );
}

function getTimeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function AdminOverviewPage() {
  const [data, setData] = useState(null);
  const [prelaunchData, setPrelaunchData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const token = localStorage.getItem('bkb_admin_token');
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      const [sellersRes, prelaunchRes] = await Promise.all([
        fetch('/api/admin/sellers', { headers }),
        fetch('/api/prelaunch', { headers }),
      ]);

      const sellersData = await sellersRes.json();
      const plData = await prelaunchRes.json();

      if (sellersData.success) setData(sellersData);
      if (plData.success) setPrelaunchData(plData);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12, animation: 'pulse 1.5s infinite' }}>📊</div>
          <div style={{ fontSize: 13, color: '#6B6B78' }}>Loading dashboard...</div>
        </div>
        <style>{`
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        `}</style>
      </div>
    );
  }

  const stats = data?.stats || {};
  const trend = data?.trend || [];
  const categoryBreakdown = data?.categoryBreakdown || {};
  const districtBreakdown = data?.districtBreakdown || {};
  const recentSellers = (data?.sellers || []).slice(0, 8);
  const prelaunchTotal = prelaunchData?.total || 0;

  // Top categories
  const topCategories = Object.entries(categoryBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Top districts
  const topDistricts = Object.entries(districtBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1400 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#F5F0EB', fontFamily: "'Playfair Display', serif", marginBottom: 4 }}>
            Dashboard Overview
          </h1>
          <p style={{ fontSize: 13, color: '#6B6B78' }}>
            Welcome back — here&apos;s what&apos;s happening at Bihar Ka Bazaar today.
          </p>
        </div>
        <button
          onClick={fetchData}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            background: '#18181F',
            border: '1px solid #26262F',
            borderRadius: 10,
            color: '#9B9BA8',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#C85A08'; e.currentTarget.style.color = '#F5F0EB'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#26262F'; e.currentTarget.style.color = '#9B9BA8'; }}
        >
          🔄 Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        <KPICard
          icon="👥"
          label="Total Sellers"
          value={stats.total || 0}
          color="#C85A08"
          bgColor="rgba(200,90,8,0.12)"
        />
        <KPICard
          icon="✅"
          label="Completed Registrations"
          value={stats.completed || 0}
          subtext={stats.total ? `${Math.round((stats.completed / stats.total) * 100)}%` : '0%'}
          color="#1A5C38"
          bgColor="rgba(26,92,56,0.12)"
        />
        <KPICard
          icon="⏳"
          label="Pending / In-Progress"
          value={stats.accountCreated || 0}
          color="#F09819"
          bgColor="rgba(240,152,25,0.12)"
        />
        <KPICard
          icon="🚀"
          label="Pre-Launch Signups"
          value={prelaunchTotal}
          color="#7C4DFF"
          bgColor="rgba(124,77,255,0.12)"
        />
      </div>

      {/* Second Row: Trend + Breakdowns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 28 }}>

        {/* Registration Trend */}
        <div style={{
          background: '#18181F',
          border: '1px solid #26262F',
          borderRadius: 16,
          padding: '22px 20px',
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F0EB', marginBottom: 4 }}>Registration Trend</div>
          <div style={{ fontSize: 11, color: '#6B6B78', marginBottom: 18 }}>Last 7 days</div>
          <MiniBarChart data={trend} maxHeight={80} />
        </div>

        {/* Top Categories */}
        <div style={{
          background: '#18181F',
          border: '1px solid #26262F',
          borderRadius: 16,
          padding: '22px 20px',
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F0EB', marginBottom: 4 }}>Top Categories</div>
          <div style={{ fontSize: 11, color: '#6B6B78', marginBottom: 16 }}>by seller count</div>
          {topCategories.length === 0 ? (
            <div style={{ fontSize: 12, color: '#3A3A45', fontStyle: 'italic' }}>No data yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {topCategories.map(([cat, count]) => {
                const maxCat = topCategories[0][1];
                const pct = (count / maxCat) * 100;
                return (
                  <div key={cat}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#9B9BA8', marginBottom: 4 }}>
                      <span style={{ fontWeight: 500 }}>{cat}</span>
                      <span style={{ fontWeight: 700, color: '#F5F0EB' }}>{count}</span>
                    </div>
                    <div style={{ height: 4, background: '#26262F', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #C85A08, #F09819)', borderRadius: 2, transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Districts */}
        <div style={{
          background: '#18181F',
          border: '1px solid #26262F',
          borderRadius: 16,
          padding: '22px 20px',
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F0EB', marginBottom: 4 }}>Top Districts</div>
          <div style={{ fontSize: 11, color: '#6B6B78', marginBottom: 16 }}>by seller count</div>
          {topDistricts.length === 0 ? (
            <div style={{ fontSize: 12, color: '#3A3A45', fontStyle: 'italic' }}>No data yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {topDistricts.map(([dist, count]) => {
                const maxDist = topDistricts[0][1];
                const pct = (count / maxDist) * 100;
                return (
                  <div key={dist}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#9B9BA8', marginBottom: 4 }}>
                      <span style={{ fontWeight: 500 }}>{dist}</span>
                      <span style={{ fontWeight: 700, color: '#F5F0EB' }}>{count}</span>
                    </div>
                    <div style={{ height: 4, background: '#26262F', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #1A5C38, #4CAF50)', borderRadius: 2, transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Sellers Table */}
      <div style={{
        background: '#18181F',
        border: '1px solid #26262F',
        borderRadius: 16,
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '18px 20px',
          borderBottom: '1px solid #26262F',
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#F5F0EB' }}>Recent Registrations</div>
            <div style={{ fontSize: 11, color: '#6B6B78', marginTop: 2 }}>Latest sellers who signed up</div>
          </div>
          <Link href="/admin/sellers" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '8px 16px',
              background: 'rgba(200,90,8,0.1)',
              border: '1px solid rgba(200,90,8,0.25)',
              borderRadius: 8,
              color: '#F09819',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(200,90,8,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(200,90,8,0.1)'}
            >
              View All →
            </button>
          </Link>
        </div>

        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 0.8fr 0.8fr 0.6fr',
          padding: '10px 20px',
          background: '#14141A',
          borderBottom: '1px solid #1E1E26',
        }}>
          {['Seller', 'District', 'Category', 'Status', 'When'].map(h => (
            <span key={h} style={{ fontSize: 10, fontWeight: 700, color: '#6B6B78', textTransform: 'uppercase', letterSpacing: 1.2, textAlign: h === 'When' ? 'right' : 'left' }}>
              {h}
            </span>
          ))}
        </div>

        {/* Table Body */}
        {recentSellers.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
            <div style={{ fontSize: 13, color: '#6B6B78' }}>No seller registrations yet.</div>
          </div>
        ) : (
          recentSellers.map((seller, i) => (
            <RecentSellerRow key={seller.id} seller={seller} isLast={i === recentSellers.length - 1} />
          ))
        )}
      </div>

      {/* Quick Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16,
        marginTop: 28,
      }}>
        <Link href="/admin/sellers" style={{ textDecoration: 'none' }}>
          <div style={{
            background: '#18181F',
            border: '1px solid #26262F',
            borderRadius: 16,
            padding: '20px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#C85A08'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#26262F'; e.currentTarget.style.transform = 'none'; }}
          >
            <div style={{ fontSize: 24, marginBottom: 10 }}>👥</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F0EB', marginBottom: 4 }}>Manage Sellers</div>
            <div style={{ fontSize: 12, color: '#6B6B78' }}>Search, approve, reject sellers</div>
          </div>
        </Link>

        <Link href="/admin/prelaunch" style={{ textDecoration: 'none' }}>
          <div style={{
            background: '#18181F',
            border: '1px solid #26262F',
            borderRadius: 16,
            padding: '20px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#7C4DFF'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#26262F'; e.currentTarget.style.transform = 'none'; }}
          >
            <div style={{ fontSize: 24, marginBottom: 10 }}>🚀</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F0EB', marginBottom: 4 }}>Pre-Launch Signups</div>
            <div style={{ fontSize: 12, color: '#6B6B78' }}>View early access subscribers</div>
          </div>
        </Link>

        <Link href="/sellers" style={{ textDecoration: 'none' }}>
          <div style={{
            background: '#18181F',
            border: '1px solid #26262F',
            borderRadius: 16,
            padding: '20px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#1A5C38'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#26262F'; e.currentTarget.style.transform = 'none'; }}
          >
            <div style={{ fontSize: 24, marginBottom: 10 }}>📝</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F0EB', marginBottom: 4 }}>Registration Form</div>
            <div style={{ fontSize: 12, color: '#6B6B78' }}>View public seller registration</div>
          </div>
        </Link>
      </div>

      {/* Pulse animation for loading states */}
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}
