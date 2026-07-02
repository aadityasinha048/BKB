import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { readCollection, updateOne, deleteOne } from '@/lib/db';

// GET — List all sellers with optional filtering/searching
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
    const status = searchParams.get('status') || '';
    const category = searchParams.get('category') || '';
    const district = searchParams.get('district') || '';
    const sortBy = searchParams.get('sortBy') || 'registeredAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    let sellers = await readCollection('sellers');

    // Search filter (name, mobile, email, district, id)
    if (search) {
      sellers = sellers.filter(s =>
        (s.fullName || '').toLowerCase().includes(search) ||
        (s.mobile || '').includes(search) ||
        (s.email || '').toLowerCase().includes(search) ||
        (s.district || '').toLowerCase().includes(search) ||
        (s.id || '').toLowerCase().includes(search)
      );
    }

    // Status filter
    if (status) {
      sellers = sellers.filter(s => s.status === status);
    }

    // Category filter
    if (category) {
      sellers = sellers.filter(s => s.category === category);
    }

    // District filter
    if (district) {
      sellers = sellers.filter(s => s.district === district);
    }

    // Sort
    sellers.sort((a, b) => {
      let aVal = a[sortBy] || '';
      let bVal = b[sortBy] || '';

      if (sortBy === 'registeredAt') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else {
        aVal = aVal.toString().toLowerCase();
        bVal = bVal.toString().toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      }
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    });

    // Compute stats from full collection (before filtering)
    const allSellers = await readCollection('sellers');
    const stats = {
      total: allSellers.length,
      completed: allSellers.filter(s => s.status === 'Completed').length,
      accountCreated: allSellers.filter(s => s.status === 'Account Created').length,
      approved: allSellers.filter(s => s.status === 'Approved').length,
      rejected: allSellers.filter(s => s.status === 'Rejected').length,
      flagged: allSellers.filter(s => s.status === 'Flagged').length,
    };

    // Category breakdown
    const categoryBreakdown = {};
    allSellers.forEach(s => {
      if (s.category) {
        categoryBreakdown[s.category] = (categoryBreakdown[s.category] || 0) + 1;
      }
    });

    // District breakdown
    const districtBreakdown = {};
    allSellers.forEach(s => {
      if (s.district) {
        districtBreakdown[s.district] = (districtBreakdown[s.district] || 0) + 1;
      }
    });

    // Registration trend (last 7 days)
    const trend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = allSellers.filter(s => {
        const regDate = new Date(s.registeredAt).toISOString().split('T')[0];
        return regDate === dateStr;
      }).length;
      trend.push({ date: dateStr, count });
    }

    return NextResponse.json({
      success: true,
      sellers,
      stats,
      categoryBreakdown,
      districtBreakdown,
      trend,
      filteredCount: sellers.length,
    });
  } catch (error) {
    console.error('Admin Sellers GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

// PATCH — Update seller status/notes (approve, reject, flag)
export async function PATCH(request) {
  try {
    const authError = await requireAdmin(request);
    if (authError) {
      return NextResponse.json(
        { success: false, error: authError.error },
        { status: authError.status }
      );
    }

    const { sellerId, status, adminNotes } = await request.json();

    if (!sellerId) {
      return NextResponse.json(
        { success: false, error: 'Seller ID is required.' },
        { status: 400 }
      );
    }

    const updates = {};
    if (status) updates.status = status;
    if (adminNotes !== undefined) updates.adminNotes = adminNotes;
    updates.lastUpdatedByAdmin = new Date().toISOString();

    const updated = await updateOne('sellers', 'id', sellerId, updates);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Seller not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, seller: updated });
  } catch (error) {
    console.error('Admin Sellers PATCH Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

// DELETE — Remove a seller
export async function DELETE(request) {
  try {
    const authError = await requireAdmin(request);
    if (authError) {
      return NextResponse.json(
        { success: false, error: authError.error },
        { status: authError.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');

    if (!sellerId) {
      return NextResponse.json(
        { success: false, error: 'Seller ID is required.' },
        { status: 400 }
      );
    }

    const deleted = await deleteOne('sellers', 'id', sellerId);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Seller not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Seller deleted.' });
  } catch (error) {
    console.error('Admin Sellers DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
