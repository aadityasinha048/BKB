import { NextResponse } from 'next/server';
import { cleanString, isUpiId } from '@/lib/validation';

export async function POST(request) {
  try {
    const body = await request.json();
    const upiId = cleanString(body.upiId, 320);

    if (!upiId) {
      return NextResponse.json(
        { success: false, error: 'UPI ID is required.' },
        { status: 400 }
      );
    }

    const cleanedUpi = upiId;

    // Check basic regex format first
    if (!isUpiId(cleanedUpi)) {
      return NextResponse.json({
        success: true,
        verified: false,
        error: 'Invalid UPI ID format. Should be name@bank.'
      });
    }

    // Simulate network delay to make the UX realistic (e.g. 800ms)
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simulated rejection for test handles
    if (
      cleanedUpi.toLowerCase().startsWith('fail') ||
      cleanedUpi.toLowerCase().startsWith('invalid') ||
      cleanedUpi.toLowerCase().includes('reject')
    ) {
      return NextResponse.json({
        success: true,
        verified: false,
        error: 'UPI ID could not be found. Please check and try again.'
      });
    }

    // Determine a mock account holder name based on prefix
    let accountHolderName = 'Verified BKB Seller';
    const prefix = cleanedUpi.split('@')[0].toLowerCase();
    
    if (prefix.includes('ram')) {
      accountHolderName = 'Ram Prasad';
    } else if (prefix.includes('sunita')) {
      accountHolderName = 'Sunita Devi';
    } else if (prefix.includes('arshad')) {
      accountHolderName = 'Md. Arshad';
    } else if (prefix.includes('aadit')) {
      accountHolderName = 'Aaditya Sinha';
    } else if (prefix.includes('ashish')) {
      accountHolderName = 'Ashish Kumar';
    }

    return NextResponse.json({
      success: true,
      verified: true,
      accountHolderName
    });

  } catch (error) {
    console.error('UPI Verification API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error. Please try again.' },
      { status: 500 }
    );
  }
}
