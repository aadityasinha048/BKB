import { NextResponse } from 'next/server';
import { findOne } from '@/lib/db';
import { cleanString, isIndianMobile, isOtp, publicSeller } from '@/lib/validation';

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
    const body = await request.json();
    const validationResult = sellerLoginSchema.safeParse(body);

    if (!validationResult.success) {
      console.warn(`[SECURITY MONITOR] Seller login validation failed:`, validationResult.error.format());
      return NextResponse.json(
        { success: false, error: 'Incorrect email or password' },
        { status: 400 }
      );
    }

    const { mobile, otp } = validationResult.data;

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
    if (!isOtp(otp) || otp !== DEMO_OTP) {
      return NextResponse.json(
        { success: false, error: 'Incorrect email or password' },
        { status: 400 }
      );
    }

    if (!seller) {
      return NextResponse.json(
        { success: false, error: 'Incorrect email or password' },
        { status: 401 }
      );
    }

    // Success login
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
