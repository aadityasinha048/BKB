import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';

// POST — Admin Login Token Verification
export async function POST(request) {
  try {
    const authError = await requireAdmin(request);
    
    if (authError) {
      return NextResponse.json(
        { success: false, error: 'Incorrect email or password' },
        { status: authError.status }
      );
    }

    // Success! Return user details verified from Firebase ID Token
    return NextResponse.json({
      success: true,
      message: 'Authentication successful via Firebase Auth.',
      uid: request.user?.uid,
      email: request.user?.email,
    });
  } catch (error) {
    console.error('Admin Firebase Token Verify Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
