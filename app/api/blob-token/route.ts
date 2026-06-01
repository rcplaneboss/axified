import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST() {
  try {
    console.log('[BLOB-TOKEN] Starting request');
    
    const authResult = await auth();
    console.log('[BLOB-TOKEN] Auth result:', {
      userId: authResult?.userId || null,
      sessionId: authResult?.sessionId || null,
    });

    const { userId } = authResult;

    if (!userId) {
      console.log('[BLOB-TOKEN] No userId found, returning 401');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      console.log('[BLOB-TOKEN] BLOB_READ_WRITE_TOKEN not configured');
      throw new Error('BLOB_READ_WRITE_TOKEN not configured');
    }

    console.log('[BLOB-TOKEN] Token exists, returning to client');

    // Return the read-write token directly - the client will use it with the SDK
    return NextResponse.json({
      clientToken: token,
      userId,
    });
  } catch (error) {
    console.error('[BLOB-TOKEN] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate token' },
      { status: 500 }
    );
  }
}
