'use client';

import { useState, useEffect } from 'react';
import {
  CreditCard,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  Send,
  RefreshCw,
  AlertTriangle,
  Landmark,
  Smartphone,
  FileText
} from 'lucide-react';

export default function AdminPaymentsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('payouts');
  const [payoutModalSeller, setPayoutModalSeller] = useState(null);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchPayments = async () => {
    const token = localStorage.getItem('bkb_admin_token');
    try {
      const res = await fetch('/api/admin/payments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error('Payments fetch error:', err);
      showToast('Failed to load financial records', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleDisbursePayout = async (e) => {
    e.preventDefault();
    if (!payoutAmount || Number(payoutAmount) <= 0) {
      showToast('Please enter a valid payout amount', 'error');
      return;
    }

    setProcessing(true);
    const token = localStorage.getItem('bkb_admin_token');
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'process_payout',
          sellerId: payoutModalSeller.sellerId,
          amount: Number(payoutAmount),
          utrNumber: utrNumber.trim()
        })
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Disbursed ₹${payoutAmount} to ${payoutModalSeller.sellerName}`);
        setPayoutModalSeller(null);
        setPayoutAmount('');
        setUtrNumber('');
        fetchPayments();
      } else {
        showToast(json.error || 'Failed to process payout', 'error');
      }
    } catch (err) {
      showToast('Network error during payout disbursal', 'error');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 60, textAlign: 'center', color: '#94A3B8' }}>
        <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 16px', color: '#10B981' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ fontSize: 14 }}>Aggregating financial ledger and transactions...</p>
      </div>
    );
  }

  const stats = data?.stats || {};
  const sellerPayouts = data?.sellerPayouts || [];
  const transactions = data?.transactions || [];

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
            Payments & Seller Payouts
          </h1>
          <p style={{ fontSize: 13, color: '#94A3B8' }}>
            Direct financial clearing, platform commission calculation (5%), and seller disbursement ledger.
          </p>
        </div>

        <button
          onClick={fetchPayments}
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
          <RefreshCw size={14} /> Refresh Ledger
        </button>
      </div>

      {/* Financial KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        <div style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 14, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700 }}>GROSS MERCHANDISE VALUE</span>
            <DollarSign size={16} color="#38BDF8" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#F8F8FC', marginBottom: 4 }}>
            ₹{(stats.totalGMV || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: 12, color: '#38BDF8', fontWeight: 600 }}>Total Order Transactions</div>
        </div>

        <div style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 14, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700 }}>PLATFORM COMMISSION (5%)</span>
            <ArrowUpRight size={16} color="#10B981" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#10B981', marginBottom: 4 }}>
            ₹{(stats.platformCommission || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: 12, color: '#10B981', fontWeight: 600 }}>BKB Retained Earnings</div>
        </div>

        <div style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 14, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700 }}>PENDING SELLER PAYOUTS</span>
            <Clock size={16} color="#F59E0B" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#F59E0B', marginBottom: 4 }}>
            ₹{(stats.totalPendingPayouts || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: 12, color: '#F59E0B', fontWeight: 600 }}>Due for Disbursal</div>
        </div>

        <div style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 14, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700 }}>SETTLED DISBURSEMENTS</span>
            <CheckCircle2 size={16} color="#A78BFA" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#A78BFA', marginBottom: 4 }}>
            ₹{(stats.totalDisbursedPayouts || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: 12, color: '#A78BFA', fontWeight: 600 }}>Transferred to Sellers</div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <button
          onClick={() => setActiveTab('payouts')}
          style={{
            padding: '10px 20px',
            borderRadius: 8,
            border: activeTab === 'payouts' ? '1px solid rgba(16,185,129,0.4)' : '1px solid #1C2633',
            background: activeTab === 'payouts' ? 'rgba(16,185,129,0.14)' : '#121822',
            color: activeTab === 'payouts' ? '#34D399' : '#94A3B8',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Seller Payouts Ledger ({sellerPayouts.length})
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          style={{
            padding: '10px 20px',
            borderRadius: 8,
            border: activeTab === 'transactions' ? '1px solid rgba(16,185,129,0.4)' : '1px solid #1C2633',
            background: activeTab === 'transactions' ? 'rgba(16,185,129,0.14)' : '#121822',
            color: activeTab === 'transactions' ? '#34D399' : '#94A3B8',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Customer Transactions ({transactions.length})
        </button>
      </div>

      {/* Active Tab Content */}
      {activeTab === 'payouts' ? (
        <div style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 16, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#121822', color: '#94A3B8', borderBottom: '1px solid #1C2633', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                <th style={{ padding: '14px 18px' }}>Seller & Contact</th>
                <th style={{ padding: '14px 18px' }}>Payout Channel</th>
                <th style={{ padding: '14px 18px' }}>Gross Sales</th>
                <th style={{ padding: '14px 18px' }}>Pending Payout (95%)</th>
                <th style={{ padding: '14px 18px' }}>Settled Paid</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {sellerPayouts.map(seller => (
                <tr key={seller.sellerId} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '16px 18px' }}>
                    <div style={{ fontWeight: 700, color: '#F8F8FC' }}>{seller.sellerName}</div>
                    {seller.businessName && <div style={{ fontSize: 12, color: '#94A3B8' }}>{seller.businessName}</div>}
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{seller.mobile} · {seller.ordersCount} orders</div>
                  </td>

                  <td style={{ padding: '16px 18px' }}>
                    {seller.payoutMethod === 'upi' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#34D399', fontWeight: 600, fontSize: 12 }}>
                        <Smartphone size={14} /> UPI: {seller.upiId}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#38BDF8', fontWeight: 600, fontSize: 12 }}>
                        <Landmark size={14} /> Bank: {seller.bankAccountNumber ? `••••${seller.bankAccountNumber.slice(-4)}` : 'Not set'}
                      </div>
                    )}
                  </td>

                  <td style={{ padding: '16px 18px', fontWeight: 600, color: '#F1F5F9' }}>
                    ₹{seller.totalSales.toLocaleString()}
                  </td>

                  <td style={{ padding: '16px 18px' }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: seller.pendingPayout > 0 ? '#F59E0B' : '#94A3B8' }}>
                      ₹{seller.pendingPayout.toLocaleString()}
                    </span>
                  </td>

                  <td style={{ padding: '16px 18px', color: '#10B981', fontWeight: 700 }}>
                    ₹{seller.completedPayout.toLocaleString()}
                  </td>

                  <td style={{ padding: '16px 18px', textAlign: 'right' }}>
                    {seller.pendingPayout > 0 ? (
                      <button
                        onClick={() => {
                          setPayoutModalSeller(seller);
                          setPayoutAmount(String(seller.pendingPayout));
                          setUtrNumber(`UTR${Date.now().toString().slice(-8)}`);
                        }}
                        style={{
                          padding: '7px 14px',
                          background: '#10B981',
                          border: 'none',
                          borderRadius: 6,
                          color: '#fff',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        <Send size={12} /> Disburse ₹{seller.pendingPayout}
                      </button>
                    ) : (
                      <span style={{ fontSize: 12, color: '#94A3B8' }}>Settled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ background: '#121822', border: '1px solid #1C2633', borderRadius: 16, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#121822', color: '#94A3B8', borderBottom: '1px solid #1C2633', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                <th style={{ padding: '14px 18px' }}>Transaction ID</th>
                <th style={{ padding: '14px 18px' }}>Order Ref</th>
                <th style={{ padding: '14px 18px' }}>Payer</th>
                <th style={{ padding: '14px 18px' }}>Amount</th>
                <th style={{ padding: '14px 18px' }}>Method</th>
                <th style={{ padding: '14px 18px' }}>Status</th>
                <th style={{ padding: '14px 18px' }}>UTR / Reference</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(txn => (
                <tr key={txn.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '16px 18px', fontWeight: 700, color: '#F8F8FC', fontFamily: 'monospace' }}>
                    {txn.id}
                  </td>
                  <td style={{ padding: '16px 18px', color: '#94A3B8' }}>{txn.orderId}</td>
                  <td style={{ padding: '16px 18px' }}>
                    <div style={{ color: '#F1F5F9', fontWeight: 600 }}>{txn.customerName || 'Customer'}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>{txn.customerPhone}</div>
                  </td>
                  <td style={{ padding: '16px 18px', fontSize: 15, fontWeight: 800, color: '#F8F8FC' }}>
                    ₹{Number(txn.amount).toLocaleString()}
                  </td>
                  <td style={{ padding: '16px 18px', color: '#38BDF8', fontWeight: 700, fontSize: 12 }}>
                    {txn.method}
                  </td>
                  <td style={{ padding: '16px 18px' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: 12,
                      fontSize: 10,
                      fontWeight: 700,
                      background: txn.status === 'success' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                      color: txn.status === 'success' ? '#10B981' : '#F59E0B'
                    }}>
                      {txn.status?.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '16px 18px', fontSize: 11, color: '#94A3B8', fontFamily: 'monospace' }}>
                    {txn.utrNumber || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Disburse Modal */}
      {payoutModalSeller && (
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
              Disburse Seller Payout
            </h3>
            <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 18 }}>
              Releasing net funds (95%) to {payoutModalSeller.sellerName}.
            </p>

            <div style={{ background: '#121822', border: '1px solid #222E3E', borderRadius: 8, padding: 12, marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4 }}>Destination Account</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#10B981' }}>
                {payoutModalSeller.payoutMethod === 'upi' ? `UPI: ${payoutModalSeller.upiId}` : `Bank: ${payoutModalSeller.bankAccountNumber}`}
              </div>
            </div>

            <form onSubmit={handleDisbursePayout}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94A3B8', marginBottom: 6 }}>
                  Payout Amount (₹)
                </label>
                <input
                  type="number"
                  value={payoutAmount}
                  onChange={e => setPayoutAmount(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', background: '#121822', border: '1px solid #222E3E', borderRadius: 8, color: '#F8F8FC', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94A3B8', marginBottom: 6 }}>
                  Bank UTR / Transaction Reference
                </label>
                <input
                  type="text"
                  value={utrNumber}
                  onChange={e => setUtrNumber(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', background: '#121822', border: '1px solid #222E3E', borderRadius: 8, color: '#F8F8FC', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setPayoutModalSeller(null)}
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
                  disabled={processing}
                  style={{
                    padding: '9px 20px',
                    background: '#10B981',
                    border: 'none',
                    borderRadius: 8,
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: processing ? 'not-allowed' : 'pointer'
                  }}
                >
                  {processing ? 'Processing...' : 'Confirm Disbursal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
