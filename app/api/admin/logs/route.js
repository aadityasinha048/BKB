import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { readCollection, writeCollection } from '@/lib/db';

export async function GET(request) {
  try {
    const authError = await requireAdmin(request);
    if (authError) {
      return NextResponse.json(
        { success: false, error: authError.error },
        { status: authError.status }
      );
    }

    const logs = await readCollection('logs');
    // Sort logs: newest first
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return NextResponse.json({ success: true, logs: logs.slice(0, 50) });
  } catch (error) {
    console.error('Logs GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const authError = await requireAdmin(request);
    if (authError) {
      return NextResponse.json(
        { success: false, error: authError.error },
        { status: authError.status }
      );
    }

    await writeCollection('logs', []);
    return NextResponse.json({ success: true, message: 'Logs cleared.' });
  } catch (error) {
    console.error('Logs DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error.' },
      { status: 500 }
    );
  }
}
