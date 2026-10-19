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

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';

    const [buyers, orders] = await Promise.all([
      readCollection('buyers'),
      readCollection('orders'),
    ]);

    // Compute live order totals per buyer
    const buyersWithStats = buyers.map(buyer => {
      const buyerOrders = orders.filter(o => o.buyerPhone === buyer.mobile || o.buyerId === buyer.id);
      const ordersCount = buyerOrders.length || buyer.ordersCount || 0;
      const totalSpent = buyerOrders.reduce((s, o) => s + (Number(o.total) || 0), 0) || buyer.totalSpent || 0;
      return {
        ...buyer,
        ordersCount,
        totalSpent,
        recentOrders: buyerOrders.slice(0, 3)
      };
    });

    let filtered = buyersWithStats;
    if (search) {
      filtered = filtered.filter(b =>
        (b.name && b.name.toLowerCase().includes(search)) ||
        (b.mobile && b.mobile.includes(search)) ||
        (b.email && b.email.toLowerCase().includes(search)) ||
        (b.city && b.city.toLowerCase().includes(search)) ||
        (b.district && b.district.toLowerCase().includes(search))
      );
    }

    return NextResponse.json({
      success: true,
      buyers: filtered,
      stats: {
        total: buyers.length,
        active: buyers.filter(b => b.status === 'active').length,
        suspended: buyers.filter(b => b.status === 'suspended').length,
        totalCustomerSpend: buyersWithStats.reduce((s, b) => s + b.totalSpent, 0)
      }
    });
  } catch (error) {
    console.error('Admin Buyers GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch buyers.' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const authError = await requireAdmin(request);
    if (authError) {
      return NextResponse.json({ success: false, error: authError.error }, { status: authError.status });
    }

    const body = await request.json();
    const { buyerId, status, adminNote } = body;

    if (!buyerId) {
      return NextResponse.json({ success: false, error: 'buyerId is required.' }, { status: 400 });
    }

    let updatedBuyer = null;

    await mutateCollection('buyers', async buyers => {
      const idx = buyers.findIndex(b => b.id === buyerId || b.mobile === buyerId);
      if (idx === -1) {
        throw new Error('Buyer not found');
      }

      if (status) {
        buyers[idx].status = status;
      }
      if (adminNote) {
        buyers[idx].adminNotes = buyers[idx].adminNotes || [];
        buyers[idx].adminNotes.push({ note: adminNote, date: new Date().toISOString() });
      }
      buyers[idx].updatedAt = new Date().toISOString();
      updatedBuyer = buyers[idx];
    });

    await logAction('UPDATE_BUYER_STATUS', `Updated buyer ${buyerId} status to ${status}`);

    return NextResponse.json({
      success: true,
      message: 'Buyer profile updated successfully.',
      buyer: updatedBuyer
    });
  } catch (error) {
    console.error('Admin Buyers PUT error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to update buyer.' }, { status: 500 });
  }
}
