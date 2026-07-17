import { NextResponse } from 'next/server';
import { validateSession, extractToken } from '@/lib/auth';

// GET — Verify if session token is still valid
export async function GET(request) {
  try {
    const token = extractToken(request);

    if (!token) {
      return NextResponse.json(
        { success: false, valid: false, error: 'Incorrect email or password' },
        { status: 401 }
      );
    }

    const valid = await validateSession(token);

    if (!valid) {
      return NextResponse.json(
        { success: false, valid: false, error: 'Incorrect email or password' },
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

// POST — Logout (managed client-side via Firebase signOut)
export async function POST() {
  return NextResponse.json({ success: true, message: 'Logged out successfully.' });
}
