import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminInviteToken } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ valid: false, message: 'Invite token is required' }, { status: 400 });
    }

    const result = await verifyAdminInviteToken(token);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Error verifying invite token:', err);
    return NextResponse.json({ valid: false, message: err.message || 'Internal server error' }, { status: 500 });
  }
}
