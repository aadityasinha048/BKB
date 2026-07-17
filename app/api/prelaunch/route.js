import { NextResponse } from 'next/server';
import { readCollection, mutateCollection, deleteOne } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { rateLimit } from '@/lib/rateLimit';
import { cleanString, cleanStringArray, isEmail, isIndianMobile } from '@/lib/validation';

// POST — Public: Register a new pre-launch subscriber
export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const limitCheck = await rateLimit(ip, 'prelaunch', 5, 60 * 1000);
    if (!limitCheck.success) {
      return NextResponse.json(
        { success: false, error: 'Too many early access requests. Please try again in a minute.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const name = cleanString(body.name, 120);
    const email = cleanString(body.email, 254).toLowerCase();
    const phone = cleanString(body.phone, 10);
    const city = cleanString(body.city, 80);
    const interests = cleanStringArray(body.interests);

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required.' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (phone && !isIndianMobile(phone)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 10-digit Indian mobile number.' },
        { status: 400 }
      );
    }

    const result = await mutateCollection('prelaunch', async subscribers => {
      if (subscribers.find(s => (s.email || '').toLowerCase() === email)) {
        return { duplicate: true };
      }

      const subscriber = {
        id: `BKB-PL-${Date.now()}`,
        registeredAt: new Date().toISOString(),
        name,
        email,
        phone,
        city,
        interests,
      };

      subscribers.push(subscriber);
      return { duplicate: false, subscriber, totalSignups: subscribers.length };
    });

    if (result.duplicate) {
      return NextResponse.json({
        success: true,
        message: 'Welcome aboard! You\'re now on the early access list.',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Welcome aboard! You\'re now on the early access list.',
      subscriberId: result.subscriber.id,
      totalSignups: result.totalSignups,
    });
  } catch (error) {
    console.error('Pre-launch POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

// GET — Admin: Fetch all pre-launch subscribers
export async function GET(request) {
  try {
    const authError = await requireAdmin(request);
    if (authError) {
      return NextResponse.json(
        { success: false, error: authError.error },
        { status: authError.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';

    const allSubscribers = await readCollection('prelaunch');
    let subscribers = [...allSubscribers];

    // Search filter
    if (search) {
      subscribers = subscribers.filter(s =>
        (s.name || '').toLowerCase().includes(search) ||
        (s.email || '').toLowerCase().includes(search) ||
        (s.phone || '').includes(search) ||
        (s.city || '').toLowerCase().includes(search)
      );
    }

    // Sort by newest first
    subscribers.sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));

    // Stats
    const interestBreakdown = {};
    allSubscribers.forEach(s => {
      (s.interests || []).forEach(interest => {
        interestBreakdown[interest] = (interestBreakdown[interest] || 0) + 1;
      });
    });

    // City breakdown
    const cityBreakdown = {};
    allSubscribers.forEach(s => {
      if (s.city) {
        cityBreakdown[s.city] = (cityBreakdown[s.city] || 0) + 1;
      }
    });

    // Daily trend (last 7 days)
    const trend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = allSubscribers.filter(s => {
        const regDate = new Date(s.registeredAt).toISOString().split('T')[0];
        return regDate === dateStr;
      }).length;
      trend.push({ date: dateStr, count });
    }

    return NextResponse.json({
      success: true,
      subscribers,
      total: allSubscribers.length,
      filteredCount: subscribers.length,
      interestBreakdown,
      cityBreakdown,
      trend,
    });
  } catch (error) {
    console.error('Pre-launch GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

// DELETE — Admin: Remove a subscriber
export async function DELETE(request) {
  try {
    const authError = await requireAdmin(request);
    if (authError) {
      return NextResponse.json(
        { success: false, error: authError.error },
        { status: authError.status }
      );
    }

    const { searchParams = new URL(request.url).searchParams } = request;
    const subscriberId = searchParams.get('id');

    if (!subscriberId) {
      return NextResponse.json(
        { success: false, error: 'Subscriber ID is required.' },
        { status: 400 }
      );
    }

    const deleted = await deleteOne('prelaunch', 'id', subscriberId);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Subscriber not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Subscriber removed.' });
  } catch (error) {
    console.error('Pre-launch DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
