import { NextRequest, NextResponse } from 'next/server';
import { createAdminFromInviteToken } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, name, email, password, phone } = body;

    if (!token || !name || !email || !password) {
      return NextResponse.json(
        { error: 'Token, Administrator Full Name, Email, and Password are required.' },
        { status: 400 }
      );
    }

    const result = await createAdminFromInviteToken(token, {
      name,
      email,
      password,
      phone,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to create administrator' }, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    console.error('Error creating admin from token:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
