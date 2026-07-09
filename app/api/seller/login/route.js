import { NextResponse } from 'next/server';
import { findOne } from '@/lib/db';
import { cleanString, isIndianMobile, isOtp, publicSeller } from '@/lib/validation';

const DEMO_OTP = process.env.BKB_DEMO_OTP || '123456';

export async function POST(request) {
  try {
    const body = await request.json();
    const mobile = cleanString(body.mobile, 10);
    const otp = body.otp === undefined ? undefined : cleanString(body.otp, 6);

    if (!mobile) {
      return NextResponse.json(
        { success: false, error: 'Mobile number is required.' },
        { status: 400 }
      );
    }

    if (!isIndianMobile(mobile)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 10-digit Indian mobile number.' },
        { status: 400 }
      );
    }

    // Check if seller exists with this mobile number
    const seller = await findOne('sellers', 'mobile', mobile);

    if (!seller) {
      return NextResponse.json(
        { success: false, error: 'This mobile number is not registered as a seller.' },
        { status: 404 }
      );
    }

    // If OTP is not provided, we simulate sending it
    if (otp === undefined) {
      return NextResponse.json({
        success: true,
        message: 'OTP sent successfully (Simulated code: 123456)',
      });
    }

    // If OTP is provided, verify it
    if (!isOtp(otp) || otp !== DEMO_OTP) {
      return NextResponse.json(
        { success: false, error: 'Invalid OTP code.' },
        { status: 400 }
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
