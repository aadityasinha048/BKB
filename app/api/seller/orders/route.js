import { NextResponse } from 'next/server';
import { readCollection, mutateCollection, findOne } from '@/lib/db';
import { cleanString } from '@/lib/validation';

/**
 * Seller Orders & CRM API with Strict Mediator Disintermediation Protection
 * 
 * In accordance with BKB Platform Mediator Policy:
 * - Buyer contact details (personal phone & email) are masked to prevent bypassing BKB escrow.
 * - All merchant-to-buyer communication is routed exclusively through BKB Customer Support Relay.
 */

function maskPhone(phone) {
  if (!phone) return 'Protected';
  const clean = String(phone).replace(/\D/g, '');
  if (clean.length >= 10) {
    return `+91 ${clean.slice(0, 2)}••••••${clean.slice(-2)}`;
  }
  return '+91 ••••••••••';
}

function maskEmail(email) {
  if (!email || !email.includes('@')) return 'Protected (BKB Relay)';
  const [user, domain] = email.split('@');
  return `${user.slice(0, 2)}••••@${domain}`;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = cleanString(searchParams.get('sellerId'), 80);

    if (!sellerId) {
      return NextResponse.json({ success: false, error: 'sellerId is required.' }, { status: 400 });
    }

    const [allOrders, allPayments, seller] = await Promise.all([
      readCollection('orders'),
      readCollection('payments'),
      findOne('sellers', 'id', sellerId)
    ]);

    // Filter orders that contain at least one item from this seller
    const sellerOrders = [];

    for (const order of allOrders) {
      const sellerItems = (order.items || []).filter(item => item.sellerId === sellerId);
      if (sellerItems.length > 0) {
        const sellerSubtotal = sellerItems.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.qty || 1)), 0);
        const sellerNetEarnings = Math.round(sellerSubtotal * 0.95); // 95% net after 5% platform fee
        const platformCommission = sellerSubtotal - sellerNetEarnings;

        sellerOrders.push({
          id: order.id,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt || order.createdAt,
          buyerId: order.buyerId || `BUY-REF-${order.id.slice(-6)}`,
          buyerName: order.buyerName,
          // MASKED CONTACT INFO (Direct phone & email hidden to prevent off-platform bypass)
          buyerPhoneMasked: maskPhone(order.buyerPhone),
          buyerEmailMasked: maskEmail(order.buyerEmail),
          shippingAddress: {
            addressLine1: order.shippingAddress?.addressLine1 || '',
            addressLine2: order.shippingAddress?.addressLine2 || '',
            city: order.shippingAddress?.city || 'Bihar',
            district: order.shippingAddress?.district || order.shippingAddress?.city || 'Bihar',
            state: order.shippingAddress?.state || 'Bihar',
            pincode: order.shippingAddress?.pincode || '',
          },
          items: sellerItems,
          totalSellerItemsCount: sellerItems.reduce((sum, item) => sum + Number(item.qty || 1), 0),
          sellerSubtotal,
          sellerNetEarnings,
          platformCommission,
          paymentMethod: order.paymentMethod || 'upi',
          paymentStatus: order.paymentStatus || 'paid',
          orderStatus: order.orderStatus || 'placed',
          courier: order.courier || '',
          trackingNumber: order.trackingNumber || '',
          shippedAt: order.shippedAt || null,
          deliveredAt: order.deliveredAt || null,
          sellerNotes: order.sellerNotes || '',
          payoutStatus: order.payoutStatus || 'pending',
          payoutUtr: order.payoutUtr || null,
          payoutDate: order.payoutDate || null,
          packagingVideo: order.packagingVideo || null,
          supportRelayTickets: order.supportRelayTickets || [],
        });
      }
    }

    // Sort newest orders first
    sellerOrders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    // Calculate seller metrics
    const stats = {
      totalOrders: sellerOrders.length,
      placed: sellerOrders.filter(o => o.orderStatus === 'placed').length,
      confirmed: sellerOrders.filter(o => o.orderStatus === 'confirmed').length,
      shipped: sellerOrders.filter(o => o.orderStatus === 'shipped').length,
      delivered: sellerOrders.filter(o => o.orderStatus === 'delivered').length,
      cancelled: sellerOrders.filter(o => o.orderStatus === 'cancelled').length,
      grossSales: sellerOrders.reduce((sum, o) => o.orderStatus !== 'cancelled' ? sum + o.sellerSubtotal : sum, 0),
      netEarnings: sellerOrders.reduce((sum, o) => o.orderStatus !== 'cancelled' ? sum + o.sellerNetEarnings : sum, 0),
      pendingPayout: sellerOrders.reduce((sum, o) => (o.orderStatus !== 'cancelled' && o.payoutStatus !== 'processed') ? sum + o.sellerNetEarnings : sum, 0),
      disbursedPayout: sellerOrders.reduce((sum, o) => (o.orderStatus !== 'cancelled' && o.payoutStatus === 'processed') ? sum + o.sellerNetEarnings : sum, 0),
    };

    // Filter payouts for this seller
    const sellerPayouts = allPayments
      .filter(p => p.sellerId === sellerId || (p.orderId === 'SELLER-PAYOUT' && p.sellerId === sellerId))
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    // Construct CRM customer intelligence (with contact details masked)
    const crmMap = new Map();

    for (const order of sellerOrders) {
      const buyerKey = order.buyerId || order.buyerName;
      if (!crmMap.has(buyerKey)) {
        crmMap.set(buyerKey, {
          buyerId: order.buyerId,
          name: order.buyerName,
          // Masked contact
          maskedPhone: order.buyerPhoneMasked,
          maskedEmail: order.buyerEmailMasked,
          city: order.shippingAddress?.city || 'Bihar',
          district: order.shippingAddress?.district || order.shippingAddress?.state || 'Bihar',
          firstOrderDate: order.createdAt,
          lastOrderDate: order.createdAt,
          ordersCount: 0,
          totalSpent: 0,
          allPurchasedItems: [],
          customerTag: 'New Buyer',
          relayChannelId: `RELAY-${order.buyerId}`,
        });
      }

      const c = crmMap.get(buyerKey);
      c.ordersCount += 1;
      if (order.orderStatus !== 'cancelled') {
        c.totalSpent += order.sellerSubtotal;
      }
      if (new Date(order.createdAt) > new Date(c.lastOrderDate)) {
        c.lastOrderDate = order.createdAt;
      }
      if (new Date(order.createdAt) < new Date(c.firstOrderDate)) {
        c.firstOrderDate = order.createdAt;
      }
      order.items.forEach(it => {
        if (!c.allPurchasedItems.includes(it.name)) {
          c.allPurchasedItems.push(it.name);
        }
      });
    }

    // Derive tags
    const crmCustomers = Array.from(crmMap.values()).map(cust => {
      let tag = 'New Customer';
      if (cust.ordersCount >= 3 || cust.totalSpent >= 4000) {
        tag = 'VIP Loyal Customer';
      } else if (cust.ordersCount > 1) {
        tag = 'Repeat Buyer';
      }
      return {
        ...cust,
        customerTag: tag
      };
    }).sort((a, b) => b.totalSpent - a.totalSpent);

    return NextResponse.json({
      success: true,
      seller,
      stats,
      orders: sellerOrders,
      payouts: sellerPayouts,
      crm: crmCustomers,
      mediatorPolicy: {
        active: true,
        notice: 'Direct contact details are masked. All communications are mediated through BKB Support Desk.',
        supportHelpline: '1800-BKB-CARE (Toll Free)',
        supportEmail: 'support@biharkabazaar.com'
      }
    });

  } catch (error) {
    console.error('Seller Orders GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch seller orders.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, sellerId, orderId, category, message } = body;

    if (action === 'support_relay') {
      if (!sellerId || !orderId || !message) {
        return NextResponse.json({ success: false, error: 'sellerId, orderId, and message are required.' }, { status: 400 });
      }

      const now = new Date().toISOString();
      const ticketId = `BKB-RELAY-${Date.now().toString().slice(-6)}`;

      const newTicket = {
        id: ticketId,
        sellerId,
        orderId,
        category: category || 'Order Query',
        message: cleanString(message, 1000),
        status: 'pending_bkb_review',
        createdAt: now,
      };

      // Record ticket on order
      await mutateCollection('orders', async orders => {
        const order = orders.find(o => o.id === orderId);
        if (order) {
          if (!order.supportRelayTickets) order.supportRelayTickets = [];
          order.supportRelayTickets.unshift(newTicket);
          order.updatedAt = now;
        }
      });

      // Log in audit logs
      await mutateCollection('logs', async logs => {
        logs.unshift({
          id: `LOG-${Date.now()}`,
          timestamp: now,
          action: 'SELLER_SUPPORT_RELAY_REQUESTED',
          details: `Seller ${sellerId} requested buyer communication for Order ${orderId} (${category}). Ticket: ${ticketId}`
        });
      });

      return NextResponse.json({
        success: true,
        message: 'Your inquiry has been submitted to Bihar Ka Bazaar Support Desk. Our team will verify and relay it to the customer.',
        ticket: newTicket
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action.' }, { status: 400 });
  } catch (error) {
    console.error('Seller Orders POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process support request.' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { sellerId, orderId, action, status, courier, trackingNumber, sellerNotes } = body;

    if (!sellerId || !orderId) {
      return NextResponse.json({ success: false, error: 'sellerId and orderId are required.' }, { status: 400 });
    }

    const now = new Date().toISOString();
    let updatedOrder = null;

    await mutateCollection('orders', async orders => {
      const idx = orders.findIndex(o => o.id === orderId);
      if (idx === -1) {
        throw new Error('Order not found.');
      }

      const order = orders[idx];
      const hasSeller = (order.items || []).some(item => item.sellerId === sellerId);
      if (!hasSeller) {
        throw new Error('Unauthorized: Order does not belong to this seller.');
      }

      if (action === 'update_status' && status) {
        order.orderStatus = status;
        order.updatedAt = now;
        if (status === 'shipped') {
          order.courier = courier || order.courier || 'Bihar Express Postal / Delhivery';
          order.trackingNumber = trackingNumber || order.trackingNumber || `TRK${Date.now().toString().slice(-8)}`;
          order.shippedAt = now;
        } else if (status === 'delivered') {
          order.deliveredAt = now;
          if (order.paymentMethod === 'cod') {
            order.paymentStatus = 'paid';
          }
        }
      }

      if (sellerNotes !== undefined) {
        order.sellerNotes = sellerNotes;
        order.updatedAt = now;
      }

      if (body.packagingVideo) {
        order.packagingVideo = body.packagingVideo;
        order.updatedAt = now;
      }

      updatedOrder = order;
    });

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully.',
      order: updatedOrder
    });

  } catch (error) {
    console.error('Seller Orders PATCH error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to update order.' }, { status: 500 });
  }
}
