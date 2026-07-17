import { NextResponse } from 'next/server';
import { mutateCollection } from '@/lib/db';
import { z } from 'zod';

const webhookSchema = z.object({
  secret: z.string(),
  event: z.enum(['user.created', 'user.deleted']),
  user: z.object({
    uid: z.string(),
    email: z.string().email(),
    displayName: z.string().optional(),
  }),
});

// POST — Secure HTTP webhook for Firebase Cloud Trigger events
export async function POST(request) {
  try {
    const body = await request.json();
    const result = webhookSchema.safeParse(body);

    if (!result.success) {
      console.warn('[SECURITY MONITOR] Firebase Webhook parse failed:', result.error.format());
      return NextResponse.json({ success: false, error: 'Incorrect email or password' }, { status: 400 });
    }

    const { secret, event, user } = result.data;

    // Verify webhook signature/secret mapping
    if (secret !== process.env.FIREBASE_WEBHOOK_SECRET) {
      console.warn('[SECURITY MONITOR] Unauthorized Firebase Webhook access attempt.');
      return NextResponse.json({ success: false, error: 'Incorrect email or password' }, { status: 401 });
    }

    if (event === 'user.created') {
      await mutateCollection('users', async (users) => {
        // Store only non-sensitive user metadata in our own database
        const index = users.findIndex(u => u.uid === user.uid);
        if (index === -1) {
          users.push({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || '',
            plan: 'free',
            preferences: {},
            createdAt: new Date().toISOString(),
          });
        }
      });
      console.log(`[Firebase Webhook] Non-sensitive metadata synced for user: ${user.uid}`);
    } else if (event === 'user.deleted') {
      await mutateCollection('users', async (users) => {
        const index = users.findIndex(u => u.uid === user.uid);
        if (index > -1) {
          users.splice(index, 1);
        }
      });
      console.log(`[Firebase Webhook] Metadata purged for user: ${user.uid}`);
    }

    return NextResponse.json({ success: true, message: 'Webhook processed successfully.' });
  } catch (error) {
    console.error('Firebase Webhook Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
  }
}
