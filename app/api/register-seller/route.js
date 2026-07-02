import { NextResponse } from 'next/server';
import { readCollection, writeCollection, findOne, insertOne, updateOne } from '@/lib/db';

// Helper for backwards compatibility
async function readDatabase() {
  return readCollection('sellers');
}

async function writeDatabase(data) {
  return writeCollection('sellers', data);
}

// GET - Retrieves a seller account by ID to resume registration progress
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');

    if (!sellerId) {
      return NextResponse.json(
        { success: false, error: 'Seller ID parameter is required.' },
        { status: 400 }
      );
    }

    const seller = await findOne('sellers', 'id', sellerId);

    if (!seller) {
      return NextResponse.json(
        { success: false, error: 'Seller account not found. Please verify your Seller ID.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, seller });
  } catch (error) {
    console.error('Registration GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error. Please try again later.' },
      { status: 500 }
    );
  }
}

// POST - Handles simulated OTP verification and initial account registration (Step 1)
export async function POST(request) {
  try {
    const { fullName, mobile, email, language, otp } = await request.json();

    // Verify fields
    if (!fullName || !mobile || !email || !language || !otp) {
      return NextResponse.json(
        { success: false, error: 'Full Name, Mobile, Email, Language, and OTP are required.' },
        { status: 400 }
      );
    }

    // Verify simulated OTP code (123456)
    if (otp !== '123456') {
      return NextResponse.json(
        { success: false, error: 'Invalid OTP code. Please enter 123456.' },
        { status: 400 }
      );
    }

    // Check if phone number is already registered
    const existingSeller = await findOne('sellers', 'mobile', mobile);
    if (existingSeller) {
      return NextResponse.json(
        { success: false, error: 'This mobile number is already registered.' },
        { status: 400 }
      );
    }

    // Create entry
    const newSellerId = `BKB-SEL-${Date.now()}`;
    const newSeller = {
      id: newSellerId,
      registeredAt: new Date().toISOString(),
      fullName,
      mobile,
      email,
      language,
      isVerified: true,
      status: 'Account Created',
      // Other details will start empty
      sellerType: '',
      businessName: '',
      district: '',
      villageTown: '',
      pinCode: '',
      streetAddress: '',
      category: '',
      productDescription: '',
      monthlyCapacity: '',
      hasGst: '',
      gstNumber: '',
      payoutMethod: '',
      upiId: '',
      bankHolderName: '',
      bankAccountNumber: '',
      bankIfsc: '',
      aadhaarNumber: '',
    };

    await insertOne('sellers', newSeller);

    return NextResponse.json({ success: true, sellerId: newSellerId });
  } catch (error) {
    console.error('Registration POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error. Please try again later.' },
      { status: 500 }
    );
  }
}

// PATCH - Handles incremental updates to the seller profile (Steps 2, 3, and 4)
export async function PATCH(request) {
  try {
    const { sellerId, ...updates } = await request.json();

    if (!sellerId) {
      return NextResponse.json(
        { success: false, error: 'Seller ID is required to update details.' },
        { status: 400 }
      );
    }

    // Determine status update
    const statusUpdate = (updates.payoutMethod || updates.bankAccountNumber || updates.upiId) ? 'Completed' : undefined;

    const updatedFields = { ...updates };
    if (statusUpdate) {
      updatedFields.status = statusUpdate;
    }

    const updatedSeller = await updateOne('sellers', 'id', sellerId, updatedFields);

    if (!updatedSeller) {
      return NextResponse.json(
        { success: false, error: 'Seller account not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, sellerId });
  } catch (error) {
    console.error('Registration PATCH Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error. Please try again later.' },
      { status: 500 }
    );
  }
}
