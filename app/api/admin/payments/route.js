import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { readCollection, mutateCollection } from '@/lib/db';

async function logAction(action, details) {
  try {
    await mutateCollection('logs', async logs => {
      logs.unshift({
        id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
        action,
        details,
      });
      if (logs.length > 300) logs.splice(300);
    });
  } catch (err) {
    console.error('Failed to log admin action:', err);
  }
}

export async function GET(request) {
  try {
    const authError = await requireAdmin(request);
    if (authError) {
      return NextResponse.json({ success: false, error: authError.error }, { status: authError.status });
    }

    const [payments, orders, sellers] = await Promise.all([
      readCollection('payments'),
      readCollection('orders'),
      readCollection('sellers'),
    ]);

    const totalGMV = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const platformCommission = Math.round(totalGMV * 0.05);

    // Group payouts by seller
    const sellerPayoutsMap = {};

    sellers.forEach(s => {
      const sId = s.sellerId || s.id;
      sellerPayoutsMap[sId] = {
        sellerId: sId,
        sellerName: s.fullName || s.businessName || 'Seller',
        businessName: s.businessName || '',
        mobile: s.mobile,
        payoutMethod: s.payoutMethod || 'upi',
        upiId: s.upiId || 'Not configured',
        bankHolderName: s.bankHolderName || '',
        bankAccountNumber: s.bankAccountNumber || '',
        bankIfsc: s.bankIfsc || '',
        totalSales: 0,
        pendingPayout: 0,
        completedPayout: 0,
        ordersCount: 0
      };
    });

    orders.forEach(o => {
      o.items?.forEach(item => {
        const sId = item.sellerId;
        if (sId && sellerPayoutsMap[sId]) {
          const itemTotal = (Number(item.price) || 0) * (Number(item.qty) || 1);
          const sellerShare = Math.round(itemTotal * 0.95);
          sellerPayoutsMap[sId].totalSales += itemTotal;
          sellerPayoutsMap[sId].ordersCount += 1;

          if (o.payoutStatus === 'processed') {
            sellerPayoutsMap[sId].completedPayout += sellerShare;
          } else {
            sellerPayoutsMap[sId].pendingPayout += sellerShare;
          }
        }
      });
    });

    const sellerPayouts = Object.values(sellerPayoutsMap).filter(s => s.totalSales > 0 || s.pendingPayout > 0 || s.completedPayout > 0);

    const stats = {
      totalGMV,
      platformCommission,
      totalPendingPayouts: sellerPayouts.reduce((sum, s) => sum + s.pendingPayout, 0),
      totalDisbursedPayouts: sellerPayouts.reduce((sum, s) => sum + s.completedPayout, 0),
      transactionsCount: payments.length,
      successfulPayments: payments.filter(p => p.status === 'success').length
    };

    return NextResponse.json({
      success: true,
      stats,
      transactions: payments.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)),
      sellerPayouts
    });
  } catch (error) {
    console.error('Admin Payments GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch financial data.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const authError = await requireAdmin(request);
    if (authError) {
      return NextResponse.json({ success: false, error: authError.error }, { status: authError.status });
    }

    const body = await request.json();
    const { action, sellerId, amount, utrNumber, note } = body;

    if (action === 'process_payout') {
      if (!sellerId || !amount) {
        return NextResponse.json({ success: false, error: 'sellerId and amount are required.' }, { status: 400 });
      }

      const payoutRecord = {
        id: `PO-${Date.now()}`,
        sellerId,
        amount: Number(amount),
        utrNumber: utrNumber || `UTR${Date.now().toString().slice(-8)}`,
        note: note || 'Disbursed via automated batch payout',
        status: 'completed',
        createdAt: new Date().toISOString()
      };

      // Update orders for this seller to processed payout
      await mutateCollection('orders', async orders => {
        orders.forEach(o => {
          const hasSeller = o.items?.some(i => i.sellerId === sellerId);
          if (hasSeller && o.payoutStatus !== 'processed') {
            o.payoutStatus = 'processed';
            o.payoutUtr = payoutRecord.utrNumber;
            o.payoutDate = payoutRecord.createdAt;
          }
        });
      });

      // Record transaction
      await mutateCollection('payments', async payments => {
        payments.unshift({
          id: payoutRecord.id,
          orderId: 'SELLER-PAYOUT',
          amount: payoutRecord.amount,
          method: 'BANK/UPI PAYOUT',
          status: 'success',
          sellerId,
          utrNumber: payoutRecord.utrNumber,
          createdAt: payoutRecord.createdAt
        });
      });

      await logAction('SELLER_PAYOUT_DISBURSED', `Disbursed ₹${amount} to seller ${sellerId} (UTR: ${payoutRecord.utrNumber})`);

      return NextResponse.json({
        success: true,
        message: `Payout of ₹${amount} recorded successfully.`,
        payout: payoutRecord
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action.' }, { status: 400 });
  } catch (error) {
    console.error('Admin Payments POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process payment operation.' }, { status: 500 });
  }
}
