import { NextResponse } from 'next/server';
import { validateAdminLogin } from '@/lib/auth';

// POST — Admin Login
export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required.' },
        { status: 400 }
      );
    }

    const result = await validateAdminLogin(username, password);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      token: result.token,
      message: 'Login successful.',
    });
  } catch (error) {
    console.error('Admin Login Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
