import { NextResponse } from 'next/server';
import { findOne } from '@/lib/db';
import { cleanString, isOtp, publicSeller } from '@/lib/validation';
import { rateLimit } from '@/lib/rateLimit';
import { handleLoginAttempt, getLockoutStatus } from '@/lib/lockout';

const DEMO_OTP = process.env.BKB_DEMO_OTP || '123456';

import { z } from 'zod';

const sellerLoginSchema = z.object({
  mobile: z.string()
    .length(10)
    .regex(/^[6-9]\d{9}$/),
  otp: z.string()
    .length(6)
    .regex(/^\d{6}$/)
    .optional()
});

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim()
      || request.headers.get('x-real-ip')
      || '127.0.0.1';

    // 1. IP-level rate limit: 10 requests per minute
    const ipLimit = await rateLimit(ip, 'seller-login', 10, 60 * 1000);
    if (!ipLimit.success) {
      return NextResponse.json(
        { success: false, error: 'Too many login attempts. Please wait a minute before trying again.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validationResult = sellerLoginSchema.safeParse(body);

    if (!validationResult.success) {
      console.warn(`[SECURITY MONITOR] Seller login validation failed:`, validationResult.error.format());
      return NextResponse.json(
        { success: false, error: 'Invalid 10-digit mobile number format.' },
        { status: 400 }
      );
    }

    const { mobile, otp } = validationResult.data;
    const lockoutKey = `seller:${mobile}`;

    // 2. Check if this mobile number is currently locked out
    const lockout = getLockoutStatus(lockoutKey);
    if (lockout.locked) {
      const minutesLeft = Math.ceil(lockout.remainingTime / 60000);
      return NextResponse.json(
        { success: false, error: `Too many failed attempts. Please try again in ${minutesLeft} minute(s).` },
        { status: 429 }
      );
    }

    // Check if seller exists with this mobile number
    const seller = await findOne('sellers', 'mobile', mobile);

    // If OTP is not provided, we simulate sending it
    if (otp === undefined) {
      // Return success regardless of account existence to prevent enumeration
      return NextResponse.json({
        success: true,
        message: 'OTP sent successfully.',
      });
    }

    // If OTP is provided, verify it
    const otpValid = isOtp(otp) && otp === DEMO_OTP;

    // Record the attempt for progressive lockout (keyed to mobile)
    await handleLoginAttempt(lockoutKey, otpValid);

    if (!otpValid) {
      return NextResponse.json(
        { success: false, error: 'Incorrect OTP code. Please use the demo code 123456.' },
        { status: 400 }
      );
    }

    if (!seller) {
      return NextResponse.json(
        { success: false, error: 'Seller account not registered. Please register as a seller first.' },
        { status: 404 }
      );
    }

    // Successful login
    return NextResponse.json({
      success: true,
      seller: publicSeller(seller),
    });
  } catch (error) {
    console.error('Seller Login API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error. Please try again later.' },
      { status: 500 }
    );
  }
}
