import { NextRequest, NextResponse } from 'next/server';
import {
  getRegisteredUsers,
  savePatient,
  deletePatient
} from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q')?.toLowerCase() || '';
    const branchId = searchParams.get('branchId') || searchParams.get('clinicId') || undefined;

    let users = await getRegisteredUsers(branchId);

    if (search) {
      users = users.filter(
        (u) =>
          u.fullName.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search) ||
          u.phone.toLowerCase().includes(search) ||
          (u.dentalInsurance && u.dentalInsurance.toLowerCase().includes(search))
      );
    }

    return NextResponse.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch registered users';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.email || !body.fullName) {
      return NextResponse.json(
        { success: false, error: 'Both email and fullName are required to register/update a user.' },
        { status: 400 }
      );
    }

    const saved = await savePatient(body);
    return NextResponse.json({
      success: true,
      user: saved,
      message: 'User profile saved successfully.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to save user';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const emailOrId = searchParams.get('id') || searchParams.get('email');

    if (!emailOrId) {
      return NextResponse.json(
        { success: false, error: 'User ID or email parameter is required.' },
        { status: 400 }
      );
    }

    const deleted = await deletePatient(emailOrId);
    return NextResponse.json({
      success: deleted,
      message: deleted ? 'User removed from registered records.' : 'User not found.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete user';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
