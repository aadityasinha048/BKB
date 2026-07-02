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
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pre-launch goal config
  const GOAL_TARGET = 1000;

  const fetchData = async () => {
    const token = localStorage.getItem('bkb_admin_token');
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      const [sellersRes, prelaunchRes, logsRes] = await Promise.all([
        fetch('/api/admin/sellers', { headers }),
        fetch('/api/prelaunch', { headers }),
        fetch('/api/admin/logs', { headers }),
      ]);

      const sellersData = await sellersRes.json();
      const plData = await prelaunchRes.json();
      const logsData = await logsRes.json();

      if (sellersData.success) setData(sellersData);
      if (plData.success) setPrelaunchData(plData);
      if (logsData.success) setLogs(logsData.logs);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearLogs = async () => {
    if (!confirm('Are you sure you want to clear the activity logs?')) return;
    const token = localStorage.getItem('bkb_admin_token');
    try {
      const res = await fetch('/api/admin/logs', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const result = await res.json();
      if (result.success) {
        setLogs([]);
      }
    } catch (err) {
      console.error('Failed to clear logs:', err);
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
  const recentSellers = (data?.sellers || []).slice(0, 5);
  const prelaunchTotal = prelaunchData?.total || 0;

  // Calculate Goal Percentage
  const goalPercentage = Math.min(100, Math.round((prelaunchTotal / GOAL_TARGET) * 100));

  // Top categories
  const topCategories = Object.entries(categoryBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  // Top districts list sorted by density
  const topDistricts = Object.entries(districtBreakdown)
    .sort((a, b) => b[1] - a[1]);

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

      {/* Hype Goal Tracker Row */}
      <div style={{
        background: '#18181F',
        border: '1px solid #26262F',
        borderRadius: 16,
        padding: '24px 28px',
        marginBottom: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 40,
        flexWrap: 'wrap',
      }}>
        <div style={{ flex: '1 1 300px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 20 }}>🎯</span>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#F5F0EB' }}>Pre-Launch Campaign Goal</h3>
          </div>
          <p style={{ fontSize: 12, color: '#6B6B78', lineHeight: 1.6 }}>
            Tracking early email signups against our launch target of <strong>{GOAL_TARGET.toLocaleString()}</strong> early buyers to create pre-launch viral buzz.
          </p>
        </div>
        <div style={{ flex: '2 1 400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#9B9BA8', marginBottom: 8, fontWeight: 600 }}>
            <span>Progress: {goalPercentage}%</span>
            <span>{prelaunchTotal} / {GOAL_TARGET} Subscribers</span>
          </div>
          <div style={{ height: 12, background: '#0F0F12', borderRadius: 6, overflow: 'hidden', border: '1px solid #26262F' }}>
            <div style={{
              width: `${goalPercentage}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #7C4DFF 0%, #B388FF 100%)',
              borderRadius: 6,
              transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }} />
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column (Table + District Heatmap) | Right Column (Trend, Log, Categories) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 24, alignItems: 'start', marginBottom: 28 }}>

        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

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

          {/* District Density Heat Grid */}
          <div style={{
            background: '#18181F',
            border: '1px solid #26262F',
            borderRadius: 16,
            padding: '22px 20px',
          }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#F5F0EB', marginBottom: 4 }}>District Density Index</div>
            <div style={{ fontSize: 11, color: '#6B6B78', marginBottom: 18 }}>Active artisan/farmer clusters in Bihar</div>
            {topDistricts.length === 0 ? (
              <div style={{ fontSize: 12, color: '#3A3A45', fontStyle: 'italic' }}>No seller locations registered yet</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
                {topDistricts.map(([district, count]) => (
                  <Link key={district} href={`/admin/sellers?district=${district}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: '#0F0F12',
                      border: '1px solid #26262F',
                      borderRadius: 10,
                      padding: '12px 14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#1A5C38'; e.currentTarget.style.background = '#141E18'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#26262F'; e.currentTarget.style.background = '#0F0F12'; }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#F5F0EB' }}>{district}</div>
                      <div style={{ fontSize: 11, color: '#6B6B78', marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Sellers</span>
                        <span style={{ fontWeight: 800, color: '#4CAF50', background: 'rgba(76,175,80,0.1)', padding: '2px 6px', borderRadius: 6 }}>{count}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Trend Chart Card */}
          <div style={{
            background: '#18181F',
            border: '1px solid #26262F',
            borderRadius: 16,
            padding: '22px 20px',
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F0EB', marginBottom: 4 }}>Registration Activity</div>
            <div style={{ fontSize: 11, color: '#6B6B78', marginBottom: 18 }}>Daily signups (Last 7 days)</div>
            <MiniBarChart data={trend} maxHeight={65} />
          </div>

          {/* Live Action/System Log */}
          <div style={{
            background: '#18181F',
            border: '1px solid #26262F',
            borderRadius: 16,
            padding: '22px 20px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F0EB' }}>System Activity Logs</div>
                <div style={{ fontSize: 11, color: '#6B6B78', marginTop: 2 }}>Audit history of admin actions</div>
              </div>
              {logs.length > 0 && (
                <button
                  onClick={handleClearLogs}
                  style={{ background: 'none', border: 'none', color: '#D32F2F', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}
                >
                  Clear Logs
                </button>
              )}
            </div>

            <div style={{
              maxHeight: 200,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              paddingRight: 4,
            }}>
              {logs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0', fontSize: 12, color: '#6B6B78', fontStyle: 'italic' }}>
                  No system logs available.
                </div>
              ) : (
                logs.map(log => {
                  const logTime = new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                  return (
                    <div key={log.id} style={{
                      background: '#0F0F12',
                      borderRadius: 8,
                      padding: '8px 10px',
                      borderLeft: '3px solid #C85A08',
                      fontSize: 11,
                      lineHeight: 1.4,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B6B78', marginBottom: 2 }}>
                        <span style={{ fontWeight: 700, fontSize: 9 }}>{log.action}</span>
                        <span>{logTime}</span>
                      </div>
                      <div style={{ color: '#9B9BA8' }}>{log.details}</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Top Categories Breakdown */}
          <div style={{
            background: '#18181F',
            border: '1px solid #26262F',
            borderRadius: 16,
            padding: '22px 20px',
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F0EB', marginBottom: 4 }}>Product Categories</div>
            <div style={{ fontSize: 11, color: '#6B6B78', marginBottom: 16 }}>by seller registration count</div>
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
        </div>

      </div>

      {/* Pulse animation for loading states */}
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}
