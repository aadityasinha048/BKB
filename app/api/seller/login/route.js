import { NextResponse } from 'next/server';
import { findOne } from '@/lib/db';

export async function POST(request) {
  try {
    const { mobile, otp } = await request.json();

    if (!mobile) {
      return NextResponse.json(
        { success: false, error: 'Mobile number is required.' },
        { status: 400 }
      );
    }

    // Clean up mobile input
    const cleanMobile = mobile.trim();

    // Check if seller exists with this mobile number
    const seller = await findOne('sellers', 'mobile', cleanMobile);

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
    if (otp !== '123456') {
      return NextResponse.json(
        { success: false, error: 'Invalid OTP code. Please enter 123456.' },
        { status: 400 }
      );
    }

    // Success login
    return NextResponse.json({
      success: true,
      seller,
    });
  } catch (error) {
    console.error('Seller Login API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error. Please try again later.' },
      { status: 500 }
    );
  }
}
