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
    const status = searchParams.get('status') || '';
    const payment = searchParams.get('payment') || '';

    const orders = await readCollection('orders');

    // Stats
    const stats = {
      total: orders.length,
      placed: orders.filter(o => o.orderStatus === 'placed').length,
      confirmed: orders.filter(o => o.orderStatus === 'confirmed').length,
      shipped: orders.filter(o => o.orderStatus === 'shipped').length,
      delivered: orders.filter(o => o.orderStatus === 'delivered').length,
      cancelled: orders.filter(o => o.orderStatus === 'cancelled').length,
      paid: orders.filter(o => o.paymentStatus === 'paid').length,
      totalGMV: orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0)
    };

    let filtered = [...orders];

    if (search) {
      filtered = filtered.filter(o =>
        (o.id && o.id.toLowerCase().includes(search)) ||
        (o.buyerName && o.buyerName.toLowerCase().includes(search)) ||
        (o.buyerPhone && o.buyerPhone.includes(search)) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase().includes(search)) ||
        (o.shippingAddress?.city && o.shippingAddress.city.toLowerCase().includes(search))
      );
    }

    if (status && status !== 'All') {
      filtered = filtered.filter(o => o.orderStatus?.toLowerCase() === status.toLowerCase());
    }

    if (payment && payment !== 'All') {
      filtered = filtered.filter(o => o.paymentStatus?.toLowerCase() === payment.toLowerCase());
    }

    // Sort newest first
    filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    return NextResponse.json({
      success: true,
      orders: filtered,
      stats
    });
  } catch (error) {
    console.error('Admin Orders GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch orders.' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const authError = await requireAdmin(request);
    if (authError) {
      return NextResponse.json({ success: false, error: authError.error }, { status: authError.status });
    }

    const body = await request.json();
    const { orderId, action, orderStatus, courier, trackingNumber, paymentStatus, adminNote } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'orderId is required.' }, { status: 400 });
    }

    let updatedOrder = null;

    await mutateCollection('orders', async orders => {
      const idx = orders.findIndex(o => o.id === orderId);
      if (idx === -1) {
        throw new Error('Order not found');
      }

      const o = orders[idx];

      if (action === 'update_status' || orderStatus) {
        o.orderStatus = orderStatus || o.orderStatus;
        if (courier) o.courier = courier;
        if (trackingNumber) o.trackingNumber = trackingNumber;
        o.updatedAt = new Date().toISOString();
      }

      if (action === 'update_payment' || paymentStatus) {
        o.paymentStatus = paymentStatus || o.paymentStatus;
        o.updatedAt = new Date().toISOString();
      }

      if (adminNote) {
        o.adminNotes = o.adminNotes || [];
        o.adminNotes.push({
          note: adminNote,
          timestamp: new Date().toISOString()
        });
      }

      orders[idx] = o;
      updatedOrder = o;
    });

    await logAction('UPDATE_ORDER', `Updated order ${orderId} (Status: ${updatedOrder.orderStatus}, Payment: ${updatedOrder.paymentStatus})`);

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully.',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Admin Orders PUT error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to update order.' }, { status: 500 });
  }
}
