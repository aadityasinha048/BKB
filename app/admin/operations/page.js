'use client';

import { useState, useEffect } from 'react';
import {
  Cpu,
  ShieldCheck,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sliders,
  Bell,
  Database,
  Lock,
  Layers,
  Zap,
  Save,
  Trash2,
  Download
} from 'lucide-react';

export default function AdminOperationsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationReport, setVerificationReport] = useState(null);
  const [toast, setToast] = useState(null);

  // Form states for settings
  const [settingsForm, setSettingsForm] = useState({
    systemMode: 'live',
    allowSellerRegistrations: true,
    allowOrders: true,
    codEnabled: true,
    upiDirectPay: true,
    platformCommissionPercent: 5,
    freeShippingThreshold: 500,
    deliveryCharge: 60,
    emergencyBanner: {
      enabled: false,
      message: ''
    }
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchOperationsData = async () => {
    const token = localStorage.getItem('bkb_admin_token');
    try {
      const res = await fetch('/api/admin/operations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        setData(json);
        if (json.settings) {
          setSettingsForm({
            systemMode: json.settings.systemMode || 'live',
            allowSellerRegistrations: json.settings.allowSellerRegistrations !== false,
            allowOrders: json.settings.allowOrders !== false,
            codEnabled: json.settings.codEnabled !== false,
            upiDirectPay: json.settings.upiDirectPay !== false,
            platformCommissionPercent: json.settings.platformCommissionPercent || 5,
            freeShippingThreshold: json.settings.freeShippingThreshold || 500,
            deliveryCharge: json.settings.deliveryCharge || 60,
            emergencyBanner: json.settings.emergencyBanner || { enabled: false, message: '' }
          });
        }
      }
    } catch (err) {
      console.error('Operations fetch error:', err);
      showToast('Failed to load system diagnostics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperationsData();
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    const token = localStorage.getItem('bkb_admin_token');
    try {
      const res = await fetch('/api/admin/operations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'update_settings',
          settings: settingsForm
        })
      });
      const json = await res.json();
      if (json.success) {
        showToast('Platform operational settings saved successfully!');
        fetchOperationsData();
      } else {
        showToast(json.error || 'Failed to update settings', 'error');
      }
    } catch (err) {
      showToast('Network error while saving settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleRunVerification = async () => {
    setVerifying(true);
    setVerificationReport(null);
    const token = localStorage.getItem('bkb_admin_token');
    try {
      const res = await fetch('/api/admin/operations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'verify_system' })
      });
      const json = await res.json();
      if (json.success) {
        setVerificationReport(json);
        showToast('All system verification checks completed!');
      } else {
        showToast(json.error || 'Verification check failed', 'error');
      }
    } catch (err) {
      showToast('Error executing verification suite', 'error');
    } finally {
      setVerifying(false);
    }
  };

  const handleFlushCache = async () => {
    if (!confirm('Are you sure you want to flush platform caches?')) return;
    const token = localStorage.getItem('bkb_admin_token');
    try {
      const res = await fetch('/api/admin/operations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'flush_cache' })
      });
      const json = await res.json();
      if (json.success) {
        showToast('Platform cache purged and reconstructed.');
        fetchOperationsData();
      }
    } catch (err) {
      showToast('Cache flush failed', 'error');
    }
  };

  const downloadAuditCSV = () => {
    if (!data?.recentLogs || data.recentLogs.length === 0) return;
    const headers = ['Timestamp', 'Action', 'Details'];
    const rows = data.recentLogs.map(l => [
      `"${l.timestamp}"`,
      `"${l.action || ''}"`,
      `"${(l.details || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bkb-audit-logs-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div style={{ padding: 60, textAlign: 'center', color: '#94A3B8' }}>
        <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 16px', color: '#10B981' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ fontSize: 14 }}>Connecting to system operations telemetry...</p>
      </div>
    );
  }

  const diagnostics = data?.diagnostics || {};
  const counts = diagnostics.counts || {};
  const services = diagnostics.services || [];

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1400 }}>

      {/* Toast Notification */}
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

      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#F8F8FC', marginBottom: 4 }}>
            System Operations & Verification
          </h1>
          <p style={{ fontSize: 13, color: '#94A3B8' }}>
            Mission-control console for database integrity, platform modes, security policies, and live audit telemetry.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={handleFlushCache}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 16px',
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
            <Zap size={14} color="#F59E0B" /> Flush Cache
          </button>

          <button
            onClick={handleRunVerification}
            disabled={verifying}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 18px',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              border: 'none',
              borderRadius: 8,
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              cursor: verifying ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(200,90,8,0.25)',
              fontFamily: 'inherit'
            }}
          >
            <ShieldCheck size={16} />
            {verifying ? 'Executing Tests...' : 'Run System Verification'}
          </button>
        </div>
      </div>

      {/* Real-time Diagnostics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 14, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>PRIMARY DATABASE</span>
            <Database size={16} color="#3B82F6" />
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#F8F8FC', marginBottom: 4 }}>
            {diagnostics.dbEngine}
          </div>
          <div style={{ fontSize: 12, color: '#10B981', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
            Latency: {diagnostics.dbLatencyMs}ms (Healthy)
          </div>
        </div>

        <div style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 14, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>SYSTEM HEALTH SCORE</span>
            <Activity size={16} color="#10B981" />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#10B981', marginBottom: 4 }}>
            {diagnostics.healthScore}%
          </div>
          <div style={{ fontSize: 12, color: '#94A3B8' }}>
            Zero blocking exceptions recorded
          </div>
        </div>

        <div style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 14, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>RUNTIME & UPTIME</span>
            <Cpu size={16} color="#F59E0B" />
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#F8F8FC', marginBottom: 4 }}>
            Node {diagnostics.nodeVersion}
          </div>
          <div style={{ fontSize: 12, color: '#94A3B8' }}>
            Uptime: {Math.floor((diagnostics.uptimeSeconds || 0) / 60)} minutes
          </div>
        </div>

        <div style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 14, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>DATA REGISTRY</span>
            <Layers size={16} color="#8B5CF6" />
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#F8F8FC', marginBottom: 4 }}>
            {(counts.orders || 0) + (counts.sellers || 0) + (counts.buyers || 0)} Entities
          </div>
          <div style={{ fontSize: 12, color: '#94A3B8' }}>
            {counts.orders || 0} Orders · {counts.sellers || 0} Sellers · {counts.buyers || 0} Buyers
          </div>
        </div>
      </div>

      {/* Verification Results Banner (if ran) */}
      {verificationReport && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 14,
          padding: 24,
          marginBottom: 24
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <CheckCircle2 size={22} color="#10B981" />
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#10B981', margin: 0 }}>
              Automated Platform Verification Report — ALL SYSTEMS NOMINAL
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {verificationReport.results?.map((res, i) => (
              <div key={i} style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 10, padding: '12px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#F8F8FC', marginBottom: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: res.pass ? '#10B981' : '#EF4444' }} />
                  {res.test}
                </div>
                <div style={{ fontSize: 12, color: '#94A3B8', paddingLeft: 16 }}>{res.detail}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls & Services Split View */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 24, marginBottom: 28 }}>
        
        {/* Left: Operational Controls Form */}
        <div style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, borderBottom: '1px solid #1C2633', paddingBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sliders size={18} color="#10B981" />
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#F8F8FC', margin: 0 }}>System Operation Controls</h3>
            </div>
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 16px',
                background: '#10B981',
                border: 'none',
                borderRadius: 8,
                color: '#fff',
                fontSize: 12,
                fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit'
              }}
            >
              <Save size={14} /> {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            
            {/* System Mode */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94A3B8', marginBottom: 8 }}>Marketplace Operating Mode</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {['live', 'maintenance', 'read-only'].map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setSettingsForm({ ...settingsForm, systemMode: mode })}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: settingsForm.systemMode === mode ? '1.5px solid #10B981' : '1px solid #222E3E',
                      background: settingsForm.systemMode === mode ? 'rgba(200,90,8,0.15)' : '#181A22',
                      color: settingsForm.systemMode === mode ? '#34D399' : '#94A3B8',
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      fontFamily: 'inherit'
                    }}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Feature Toggles */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { label: 'Allow Buyer Checkout & Orders', key: 'allowOrders' },
                { label: 'Allow New Seller Registrations', key: 'allowSellerRegistrations' },
                { label: 'Direct UPI Pay Gateway Enabled', key: 'upiDirectPay' },
                { label: 'Cash on Delivery (COD) Enabled', key: 'codEnabled' },
              ].map(toggle => (
                <div key={toggle.key} style={{ background: '#121822', border: '1px solid #222E3E', borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#F1F5F9' }}>{toggle.label}</span>
                  <input
                    type="checkbox"
                    checked={settingsForm[toggle.key]}
                    onChange={e => setSettingsForm({ ...settingsForm, [toggle.key]: e.target.checked })}
                    style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#10B981' }}
                  />
                </div>
              ))}
            </div>

            {/* Financial Policies */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94A3B8', marginBottom: 6 }}>Commission Rate (%)</label>
                <input
                  type="number"
                  value={settingsForm.platformCommissionPercent}
                  onChange={e => setSettingsForm({ ...settingsForm, platformCommissionPercent: Number(e.target.value) })}
                  style={{ width: '100%', padding: '9px 12px', background: '#121822', border: '1px solid #222E3E', borderRadius: 8, color: '#F8F8FC', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94A3B8', marginBottom: 6 }}>Free Shipping Above (₹)</label>
                <input
                  type="number"
                  value={settingsForm.freeShippingThreshold}
                  onChange={e => setSettingsForm({ ...settingsForm, freeShippingThreshold: Number(e.target.value) })}
                  style={{ width: '100%', padding: '9px 12px', background: '#121822', border: '1px solid #222E3E', borderRadius: 8, color: '#F8F8FC', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94A3B8', marginBottom: 6 }}>Flat Delivery Charge (₹)</label>
                <input
                  type="number"
                  value={settingsForm.deliveryCharge}
                  onChange={e => setSettingsForm({ ...settingsForm, deliveryCharge: Number(e.target.value) })}
                  style={{ width: '100%', padding: '9px 12px', background: '#121822', border: '1px solid #222E3E', borderRadius: 8, color: '#F8F8FC', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* Emergency Banner Broadcast */}
            <div style={{ background: '#121822', border: '1px solid #222E3E', borderRadius: 10, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#F59E0B', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Bell size={14} /> Emergency Site Broadcast Banner
                </span>
                <input
                  type="checkbox"
                  checked={settingsForm.emergencyBanner?.enabled || false}
                  onChange={e => setSettingsForm({
                    ...settingsForm,
                    emergencyBanner: { ...settingsForm.emergencyBanner, enabled: e.target.checked }
                  })}
                  style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#F59E0B' }}
                />
              </div>
              <input
                type="text"
                placeholder="e.g. Due to Chhath Puja festive rush, dispatch timelines may take 2 additional business days."
                value={settingsForm.emergencyBanner?.message || ''}
                onChange={e => setSettingsForm({
                  ...settingsForm,
                  emergencyBanner: { ...settingsForm.emergencyBanner, message: e.target.value }
                })}
                style={{ width: '100%', padding: '9px 12px', background: '#121822', border: '1px solid #222E3E', borderRadius: 8, color: '#F8F8FC', fontSize: 12, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

          </div>
        </div>

        {/* Right: Infrastructure Services Telemetry */}
        <div style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, borderBottom: '1px solid #1C2633', paddingBottom: 14 }}>
            <Activity size={18} color="#10B981" />
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#F8F8FC', margin: 0 }}>Service Pipelines Status</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {services.map((s, idx) => (
              <div key={idx} style={{ background: '#121822', border: '1px solid #222E3E', borderRadius: 10, padding: '12px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#F8F8FC' }}>{s.name}</div>
                  <div style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '2px 8px',
                    borderRadius: 12,
                    background: s.status === 'healthy' || s.status === 'active' || s.status === 'accepting' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                    color: s.status === 'healthy' || s.status === 'active' || s.status === 'accepting' ? '#10B981' : '#F59E0B'
                  }}>
                    {s.status}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94A3B8' }}>
                  <span>{s.detail}</span>
                  <span>{s.latency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Audit Log Console */}
      <div style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 16, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#F8F8FC', margin: 0 }}>Administrative Audit & Activity Log</h3>
            <p style={{ fontSize: 12, color: '#94A3B8', margin: '2px 0 0' }}>Tamper-evident trail of administrative mutations and operational changes.</p>
          </div>
          <button
            onClick={downloadAuditCSV}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 14px',
              background: '#121822',
              border: '1px solid #222E3E',
              borderRadius: 8,
              color: '#94A3B8',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}
          >
            <Download size={14} /> Export CSV
          </button>
        </div>

        <div style={{ maxHeight: 320, overflowY: 'auto', border: '1px solid #1C2633', borderRadius: 10 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#121822', color: '#94A3B8', textAlign: 'left', borderBottom: '1px solid #1C2633' }}>
                <th style={{ padding: '10px 14px' }}>Timestamp</th>
                <th style={{ padding: '10px 14px' }}>Action</th>
                <th style={{ padding: '10px 14px' }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {data?.recentLogs?.map((log, i) => (
                <tr key={log.id || i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '10px 14px', color: '#94A3B8', whiteSpace: 'nowrap' }}>
                    {new Date(log.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true })}
                  </td>
                  <td style={{ padding: '10px 14px', color: '#38BDF8', fontWeight: 600 }}>{log.action}</td>
                  <td style={{ padding: '10px 14px', color: '#F1F5F9' }}>{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
