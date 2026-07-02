import { NextResponse } from 'next/server';
import { validateSession, extractToken, invalidateSession } from '@/lib/auth';

// GET — Verify if session token is still valid
export async function GET(request) {
  try {
    const token = extractToken(request);

    if (!token) {
      return NextResponse.json(
        { success: false, valid: false, error: 'No token provided.' },
        { status: 401 }
      );
    }

    const valid = await validateSession(token);

    if (!valid) {
      return NextResponse.json(
        { success: false, valid: false, error: 'Session expired or invalid.' },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, valid: true });
  } catch (error) {
    console.error('Admin Verify Error:', error);
    return NextResponse.json(
      { success: false, valid: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

// POST — Logout (invalidate session)
export async function POST(request) {
  try {
    const token = extractToken(request);
    if (token) {
      await invalidateSession(token);
    }
    return NextResponse.json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    console.error('Admin Logout Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
