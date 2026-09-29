import { NextRequest, NextResponse } from 'next/server';
import { getDoctors, getDoctorById, getDoctorByEmail, saveDoctor, deleteDoctor } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const email = searchParams.get('email');
    const branchId = searchParams.get('branchId') || searchParams.get('clinicId') || undefined;
    const serviceId = searchParams.get('serviceId') || undefined;

    if (id) {
      const doctor = await getDoctorById(id);
      if (!doctor) {
        return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
      }
      return NextResponse.json({ doctor });
    }

    if (email) {
      const doctor = await getDoctorByEmail(email);
      if (!doctor) {
        return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
      }
      return NextResponse.json({ doctor });
    }

    const doctors = await getDoctors(branchId, serviceId);
    return NextResponse.json({ doctors });
  } catch (error: any) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch doctors' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !body.name || !body.name.trim()) {
      return NextResponse.json({ error: 'Doctor name is required' }, { status: 400 });
    }

    const doctor = await saveDoctor({
      ...body,
      name: body.name.trim(),
      specialization: body.specialization?.trim() || 'Cosmetic & Aesthetic Dentistry',
    });
    return NextResponse.json({ success: true, doctor, message: 'Doctor account successfully saved.' });
  } catch (error: any) {
    console.error('Error saving doctor:', error);
    return NextResponse.json({ error: error.message || 'Failed to save doctor' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Doctor ID is required' }, { status: 400 });
    }

    const deleted = await deleteDoctor(id);
    return NextResponse.json({ success: true, deleted, message: 'Doctor account and associated schedules removed.' });
  } catch (error: any) {
    console.error('Error deleting doctor:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete doctor' }, { status: 500 });
  }
}


