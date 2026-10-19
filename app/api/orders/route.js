import { NextResponse } from 'next/server';
import { readCollection, mutateCollection } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      buyerName,
      buyerPhone,
      buyerEmail,
      shippingAddress,
      items,
      paymentMethod,
      upiId,
      subtotal,
      shipping,
      total,
    } = body;

    if (!buyerName || !buyerPhone || !shippingAddress || !items || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Missing required order fields.' }, { status: 400 });
    }

    const orderId = `BKB-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toISOString();

    const newOrder = {
      id: orderId,
      buyerId: `BUY-${buyerPhone}`,
      buyerName,
      buyerPhone,
      buyerEmail: buyerEmail || '',
      shippingAddress: {
        addressLine1: shippingAddress.addressLine1 || '',
        addressLine2: shippingAddress.addressLine2 || '',
        city: shippingAddress.city || '',
        state: shippingAddress.state || 'Bihar',
        pincode: shippingAddress.pincode || '',
        lat: shippingAddress.lat || null,
        lng: shippingAddress.lng || null,
      },
      items: items.map(item => ({
        id: String(item.id || ''),
        name: item.name,
        sellerId: item.sellerId || '',
        sellerName: item.seller || item.sellerName || 'Bihar Artisan',
        qty: Number(item.qty) || 1,
        price: Number(item.price) || 0,
        imgSrc: item.imgSrc || item.image || ''
      })),
      subtotal: Number(subtotal) || 0,
      shipping: Number(shipping) || 0,
      total: Number(total) || 0,
      paymentMethod: paymentMethod || 'upi',
      upiId: upiId || null,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      orderStatus: 'placed',
      payoutStatus: 'pending',
      createdAt: now,
      updatedAt: now
    };

    // Save order
    await mutateCollection('orders', async orders => {
      orders.unshift(newOrder);
    });

    // Save or update buyer profile
    await mutateCollection('buyers', async buyers => {
      const idx = buyers.findIndex(b => b.mobile === buyerPhone);
      if (idx !== -1) {
        buyers[idx].ordersCount = (buyers[idx].ordersCount || 0) + 1;
        buyers[idx].totalSpent = (buyers[idx].totalSpent || 0) + newOrder.total;
        buyers[idx].lastOrderAt = now;
        if (shippingAddress.lat && shippingAddress.lng) {
          buyers[idx].lat = shippingAddress.lat;
          buyers[idx].lng = shippingAddress.lng;
        }
      } else {
        buyers.unshift({
          id: `BUY-${buyerPhone}`,
          name: buyerName,
          mobile: buyerPhone,
          email: buyerEmail || '',
          city: shippingAddress.city,
          state: shippingAddress.state,
          address: shippingAddress.addressLine1,
          pincode: shippingAddress.pincode,
          lat: shippingAddress.lat || null,
          lng: shippingAddress.lng || null,
          ordersCount: 1,
          totalSpent: newOrder.total,
          status: 'active',
          joinedAt: now
        });
      }
    });

    // Save payment record
    await mutateCollection('payments', async payments => {
      payments.unshift({
        id: `TXN-${Date.now().toString().slice(-6)}`,
        orderId,
        amount: newOrder.total,
        method: paymentMethod?.toUpperCase() || 'UPI',
        status: paymentMethod === 'cod' ? 'pending' : 'success',
        customerName: buyerName,
        customerPhone: buyerPhone,
        createdAt: now
      });
    });

    return NextResponse.json({
      success: true,
      orderId,
      order: newOrder
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process order.' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId') || searchParams.get('id');

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
    }

    const orders = await readCollection('orders');
    const cleanId = orderId.trim().toUpperCase();
    const order = orders.find(o => 
      o.id.toUpperCase() === cleanId || 
      o.id.replace('#', '').toUpperCase() === cleanId.replace('#', '')
    );

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found with provided ID' }, { status: 404 });
    }

    // Mask sensitive contact details to enforce platform mediator policy
    const sanitizedOrder = {
      id: order.id,
      buyerName: order.buyerName,
      // Mask phone for public tracking
      buyerPhone: order.buyerPhone ? `+91 ${order.buyerPhone.slice(0, 2)}••••••${order.buyerPhone.slice(-2)}` : '',
      shippingAddress: order.shippingAddress,
      items: (order.items || []).map(item => ({
        id: item.id,
        name: item.name,
        qty: item.qty,
        price: item.price,
        imgSrc: item.imgSrc,
        sellerName: item.sellerName || 'Bihar Ka Bazaar Artisan Partner'
        // Notice: No seller phone, email, or direct contact leaked!
      })),
      subtotal: order.subtotal,
      shipping: order.shipping,
      total: order.total,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      courier: order.courier,
      trackingNumber: order.trackingNumber,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      // Packaging Video Proof for buyer assurance
      packagingVideo: order.packagingVideo || null,
    };

    return NextResponse.json({
      success: true,
      order: sanitizedOrder
    });
  } catch (error) {
    console.error('Order tracking fetch error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

