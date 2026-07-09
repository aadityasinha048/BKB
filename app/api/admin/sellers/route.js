import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { readCollection, mutateCollection, updateOne, deleteOne, findOne } from '@/lib/db';
import { cleanString, cleanStringArray, cleanText } from '@/lib/validation';

const VALID_STATUSES = new Set([
  'Account Created',
  'Details Added',
  'Products Added',
  'Completed',
  'Approved',
  'Rejected',
  'Flagged',
]);

// Helper to log administrative actions
async function logAction(action, details) {
  try {
    await mutateCollection('logs', async logs => {
      logs.push({
        id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
        action,
        details,
      });
      // Keep logs cap to last 200 entries
      if (logs.length > 200) {
        logs.splice(0, logs.length - 200);
      }
    });
  } catch (err) {
    console.error('Failed to log admin action:', err);
  }
}

// GET — List all sellers with filters, search, sort, and aggregation stats
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

    // Search filter (name, mobile, email, district, id, businessName)
    if (search) {
      sellers = sellers.filter(s =>
        (s.fullName || '').toLowerCase().includes(search) ||
        (s.mobile || '').includes(search) ||
        (s.email || '').toLowerCase().includes(search) ||
        (s.district || '').toLowerCase().includes(search) ||
        (s.businessName || '').toLowerCase().includes(search) ||
        (s.id || '').toLowerCase().includes(search)
      );
    }

    // Status filter
    if (status && status !== 'All') {
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

// PATCH — Update seller details (Supports single ID updates, bulk updates, and verification checklists)
export async function PATCH(request) {
  try {
    const authError = await requireAdmin(request);
    if (authError) {
      return NextResponse.json(
        { success: false, error: authError.error },
        { status: authError.status }
      );
    }

    const body = await request.json();
    const sellerId = cleanString(body.sellerId, 80);
    const sellerIds = Array.isArray(body.sellerIds)
      ? body.sellerIds.map(id => cleanString(id, 80)).filter(Boolean).slice(0, 100)
      : null;
    const status = cleanString(body.status, 40);
    const adminNotes = body.adminNotes === undefined ? undefined : cleanText(body.adminNotes);
    const verificationChecklist = body.verificationChecklist === undefined
      ? undefined
      : cleanStringArray(body.verificationChecklist, 30);

    if (status && !VALID_STATUSES.has(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid seller status.' },
        { status: 400 }
      );
    }

    // Handle Bulk Update
    if (sellerIds && Array.isArray(sellerIds)) {
      if (!status) {
        return NextResponse.json(
          { success: false, error: 'Status is required for bulk updates.' },
          { status: 400 }
        );
      }

      const updatedCount = await mutateCollection('sellers', async sellers => {
        let count = 0;
        const updatedSellers = sellers.map(s => {
        if (sellerIds.includes(s.id)) {
          count++;
          return {
            ...s,
            status,
            lastUpdatedByAdmin: new Date().toISOString(),
          };
        }
        return s;
        });

        sellers.splice(0, sellers.length, ...updatedSellers);
        return count;
      });

      // Log bulk action
      await logAction(
        'BULK_STATUS_UPDATE',
        `Updated status to '${status}' for ${updatedCount} sellers.`
      );

      return NextResponse.json({ success: true, updatedCount });
    }

    // Handle Single Update
    if (!sellerId) {
      return NextResponse.json(
        { success: false, error: 'Seller ID or Seller IDs list is required.' },
        { status: 400 }
      );
    }

    const updates = {};
    if (status) updates.status = status;
    if (adminNotes !== undefined) updates.adminNotes = adminNotes;
    if (verificationChecklist !== undefined) updates.verificationChecklist = verificationChecklist;
    updates.lastUpdatedByAdmin = new Date().toISOString();

    const previousSeller = await findOne('sellers', 'id', sellerId);
    if (!previousSeller) {
      return NextResponse.json(
        { success: false, error: 'Seller not found.' },
        { status: 404 }
      );
    }

    const updated = await updateOne('sellers', 'id', sellerId, updates);

    // Create log message based on changes
    if (status && previousSeller.status !== status) {
      await logAction('SELLER_STATUS_CHANGE', `${previousSeller.fullName} (${sellerId}) status updated from '${previousSeller.status}' to '${status}'.`);
    } else if (adminNotes !== undefined && previousSeller.adminNotes !== adminNotes) {
      await logAction('SELLER_NOTE_UPDATED', `Notes updated for seller ${previousSeller.fullName} (${sellerId}).`);
    } else if (verificationChecklist !== undefined) {
      await logAction('SELLER_CHECKLIST_UPDATED', `Verification checklist updated for seller ${previousSeller.fullName} (${sellerId}).`);
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

// DELETE — Remove a seller or bulk delete sellers
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
    const sellerId = cleanString(searchParams.get('sellerId'), 80);
    const sellerIdsStr = searchParams.get('sellerIds');

    // Bulk Delete
    if (sellerIdsStr) {
      const ids = sellerIdsStr.split(',').map(id => cleanString(id, 80)).filter(Boolean).slice(0, 100);
      const deletedCount = await mutateCollection('sellers', async sellers => {
        const filtered = sellers.filter(s => !ids.includes(s.id));
        const count = sellers.length - filtered.length;
        sellers.splice(0, sellers.length, ...filtered);
        return count;
      });
      await logAction('BULK_DELETE', `Deleted ${deletedCount} sellers from database.`);

      return NextResponse.json({ success: true, deletedCount });
    }

    // Single Delete
    if (!sellerId) {
      return NextResponse.json(
        { success: false, error: 'Seller ID is required.' },
        { status: 400 }
      );
    }

    const seller = await findOne('sellers', 'id', sellerId);
    if (!seller) {
      return NextResponse.json(
        { success: false, error: 'Seller not found.' },
        { status: 404 }
      );
    }

    const deleted = await deleteOne('sellers', 'id', sellerId);

    if (deleted) {
      await logAction('SELLER_DELETED', `Deleted seller ${seller.fullName} (${sellerId}) from database.`);
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
