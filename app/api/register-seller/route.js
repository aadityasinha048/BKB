import { NextResponse } from 'next/server';
import { findOne, insertOne, updateOne } from '@/lib/db';
import { sendWelcomeEmail } from '@/lib/email';
import { rateLimit } from '@/lib/rateLimit';
import {
  cleanImageSource,
  cleanString,
  cleanText,
  isEmail,
  isIndianMobile,
  isOtp,
  isPinCode,
  isUpiId,
  publicSeller,
} from '@/lib/validation';

import { z } from 'zod';

const DEMO_OTP = process.env.BKB_DEMO_OTP || '123456';

function sanitizeString(val) {
  if (typeof val !== 'string') return '';
  return val
    .replace(/<[^>]*>?/gm, '') // strip html tags
    .replace(/[<>"'`\\$]/g, '') // strip dangerous chars
    .trim();
}

const sellerSignupSchema = z.object({
  fullName: z.string()
    .min(2)
    .max(120)
    .transform(sanitizeString),
  mobile: z.string()
    .length(10)
    .regex(/^[6-9]\d{9}$/),
  email: z.string()
    .min(3)
    .max(254)
    .email()
    .transform(val => sanitizeString(val).toLowerCase()),
  language: z.string()
    .min(2)
    .max(40)
    .transform(sanitizeString),
  otp: z.string()
    .length(6)
    .regex(/^\d{6}$/),
  photoSrc: z.string().optional()
});
const PATCH_FIELDS = new Set([
  'sellerType',
  'businessName',
  'district',
  'villageTown',
  'pinCode',
  'streetAddress',
  'category',
  'productDescription',
  'monthlyCapacity',
  'hasGst',
  'gstNumber',
  'payoutMethod',
  'upiId',
  'bankHolderName',
  'bankAccountNumber',
  'bankIfsc',
  'aadhaarNumber',
]);

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
        { success: false, error: 'Incorrect email or password' },
        { status: 404 }
      );
    }

    // Strip sensitive fields before returning — only send what's needed to resume the form
    return NextResponse.json({ success: true, seller: publicSeller(seller) });
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
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const limitCheck = await rateLimit(ip, 'register-seller', 10, 60 * 1000);
    if (!limitCheck.success) {
      return NextResponse.json(
        { success: false, error: 'Too many registration attempts. Please try again in a minute.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validationResult = sellerSignupSchema.safeParse(body);

    if (!validationResult.success) {
      console.warn(`[SECURITY MONITOR] Seller registration validation failed:`, validationResult.error.format());
      return NextResponse.json(
        { success: false, error: 'Incorrect email or password' },
        { status: 400 }
      );
    }

    const { fullName, mobile, email, language, otp, photoSrc: rawPhotoSrc } = validationResult.data;
    const photoSrc = cleanImageSource(rawPhotoSrc, '/images/farmers/farmer_1.png');

    // Verify simulated OTP code (123456)
    if (otp !== DEMO_OTP) {
      return NextResponse.json(
        { success: false, error: 'Incorrect email or password' },
        { status: 400 }
      );
    }

    // Check if phone number is already registered
    const existingSeller = await findOne('sellers', 'mobile', mobile);
    if (existingSeller) {
      // Do not confirm existence. Return generic success message to prevent enumeration.
      return NextResponse.json({
        success: true,
        message: 'Registration request received. If valid, you will receive confirmation.'
      });
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
      photoSrc,
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

    // Send welcome email with Seller ID (non-blocking — failure doesn't halt registration)
    sendWelcomeEmail(email, fullName, newSellerId)
      .then(result => {
        if (result.success) {
          console.log(`✅ Welcome email sent to ${email} (Seller: ${newSellerId})`);
          if (result.previewUrl) console.log(`📧 Preview: ${result.previewUrl}`);
        }
      })
      .catch(err => console.error('Email send error (non-critical):', err));

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

    const sanitizedUpdates = {};
    for (const [key, value] of Object.entries(updates)) {
      if (!PATCH_FIELDS.has(key)) continue;
      if (key === 'productDescription' || key === 'streetAddress') {
        sanitizedUpdates[key] = cleanText(value);
      } else {
        sanitizedUpdates[key] = cleanString(value, 255);
      }
    }

    if (sanitizedUpdates.pinCode && !isPinCode(sanitizedUpdates.pinCode)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 6-digit PIN code.' },
        { status: 400 }
      );
    }

    if (sanitizedUpdates.upiId && !isUpiId(sanitizedUpdates.upiId)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid UPI ID.' },
        { status: 400 }
      );
    }

    if (Object.keys(sanitizedUpdates).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid update fields were provided.' },
        { status: 400 }
      );
    }

    // Determine status based on which fields are being updated
    let statusUpdate;
    const hasPayoutData = sanitizedUpdates.payoutMethod && (
      (sanitizedUpdates.payoutMethod === 'upi' && sanitizedUpdates.upiId) ||
      (sanitizedUpdates.payoutMethod === 'bank' && sanitizedUpdates.bankAccountNumber && sanitizedUpdates.bankIfsc && sanitizedUpdates.bankHolderName)
    );

    if (hasPayoutData) {
      statusUpdate = 'Completed';
    } else if (sanitizedUpdates.category || sanitizedUpdates.productDescription) {
      statusUpdate = 'Products Added';
    } else if (sanitizedUpdates.sellerType || sanitizedUpdates.district) {
      statusUpdate = 'Details Added';
    }

    const updatedFields = { ...sanitizedUpdates, lastUpdatedAt: new Date().toISOString() };
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
