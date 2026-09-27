import { NextRequest, NextResponse } from 'next/server';
import { savePatient, getRegisteredUsers } from '@/lib/db';
import { PatientProfile } from '@/types/dental';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const fullName = (body.fullName || '').trim();
    const email = (body.email || '').trim().toLowerCase();
    const phone = (body.phone || '').trim();
    const password = (body.password || '').trim();

    if (!fullName || !email) {
      return NextResponse.json(
        { success: false, error: 'Full name and email address are required.' },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Please provide a password for your account.' },
        { status: 400 }
      );
    }

    // Check if email already belongs to an existing user
    const existingUsers = await getRegisteredUsers();
    const alreadyExists = existingUsers.some((u) => u.email.toLowerCase() === email);
    if (alreadyExists) {
      return NextResponse.json(
        {
          success: false,
          error: 'An account with this email address already exists. Please sign in.',
        },
        { status: 409 }
      );
    }

    // Save as general user (patient)
    const newPatient = {
      fullName,
      email,
      phone: phone || '(555) 000-0000',
      role: 'patient' as const,
      gender: body.gender || 'Prefer not to say',
      address: body.address || '',
      dentalInsurance: body.dentalInsurance || '',
      medicalNotes: body.medicalNotes || '',
    };

    const saved = await savePatient(newPatient);

    return NextResponse.json({
      success: true,
      user: saved,
      message: 'Account successfully created. Welcome to Smile Dental Studio!',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to register account';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
