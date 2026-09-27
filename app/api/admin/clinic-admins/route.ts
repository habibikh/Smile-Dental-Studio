import { NextRequest, NextResponse } from 'next/server';
import { getClinicAdmins, createClinicAdmin, deleteClinicAdmin } from '@/lib/db';

export async function GET() {
  try {
    const clinicAdmins = await getClinicAdmins();
    return NextResponse.json({
      success: true,
      clinicAdmins,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to retrieve clinic administrators';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, phone, clinicId } = body;

    if (!name || !email || !clinicId) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and assigned clinic are required.' },
        { status: 400 }
      );
    }

    const result = await createClinicAdmin({
      name,
      email,
      password: password || 'smile1234',
      phone,
      clinicId,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      clinicAdmin: result.clinicAdmin,
      message: `Clinic Administrator account "${name}" created successfully.`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create clinic administrator';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Clinic Admin ID is required' },
        { status: 400 }
      );
    }

    const deleted = await deleteClinicAdmin(id);
    return NextResponse.json({
      success: deleted,
      message: deleted ? 'Clinic administrator account deleted.' : 'Account not found.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete clinic administrator';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
