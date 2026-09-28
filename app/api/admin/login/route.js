import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';
import { handleLoginAttempt, getLockoutStatus } from '@/lib/lockout';
import { cleanString } from '@/lib/validation';
import crypto from 'crypto';

// POST — Admin Login credentials verification
export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim()
      || request.headers.get('x-real-ip')
      || '127.0.0.1';

    // 1. IP-level rate limit: 5 attempts per minute
    const ipLimit = await rateLimit(ip, 'admin-login', 5, 60 * 1000);
    if (!ipLimit.success) {
      return NextResponse.json(
        { success: false, error: 'Too many login attempts. Please wait a minute before trying again.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const username = cleanString(body.username, 100);
    const password = cleanString(body.password, 200);

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required.' },
        { status: 400 }
      );
    }

    const lockoutKey = `admin:${username}`;

    // 2. Check if this username is locked out
    const lockout = getLockoutStatus(lockoutKey);
    if (lockout.locked) {
      const minutesLeft = Math.ceil(lockout.remainingTime / 60000);
      return NextResponse.json(
        { success: false, error: `Account locked. Please try again in ${minutesLeft} minute(s).` },
        { status: 429 }
      );
    }

    const adminUsername = process.env.BKB_ADMIN_USERNAME;
    const adminPassword = process.env.BKB_ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      console.error('[SECURITY] BKB_ADMIN_USERNAME or BKB_ADMIN_PASSWORD env vars are not set. Admin login disabled.');
      return NextResponse.json(
        { success: false, error: 'Admin login is not configured. Please contact support.' },
        { status: 503 }
      );
    }

    // Warn if insecure default-like credentials are being used in production
    if (process.env.NODE_ENV === 'production' && (adminUsername === 'admin' || adminPassword.length < 12)) {
      console.warn('[SECURITY WARNING] Admin credentials appear weak in production. Please use strong credentials.');
    }

    // 3. Timing-safe comparison to prevent timing attacks
    const usernameMatch = crypto.timingSafeEqual(
      Buffer.from(username.padEnd(100)),
      Buffer.from(adminUsername.padEnd(100))
    );
    const passwordMatch = crypto.timingSafeEqual(
      Buffer.from(password.padEnd(200)),
      Buffer.from(adminPassword.padEnd(200))
    );
    const isValid = usernameMatch && passwordMatch;

    // 4. Record the attempt for progressive lockout
    await handleLoginAttempt(lockoutKey, isValid);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password.' },
        { status: 401 }
      );
    }

    // 5. Generate a dev token or instruct to use Firebase
    const devToken = process.env.BKB_DEV_ADMIN_TOKEN;
    if (!devToken) {
      console.warn('[SECURITY] BKB_DEV_ADMIN_TOKEN not set. Admin session token not issued.');
      return NextResponse.json(
        { success: false, error: 'Admin session not configured. Please set BKB_DEV_ADMIN_TOKEN.' },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      token: devToken,
      message: 'Authentication successful.',
    });
  } catch (error) {
    console.error('Admin Login Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
