import { NextRequest, NextResponse } from 'next/server';
import { getDoctorSchedules, saveDoctorSchedule, deleteDoctorSchedule } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get('doctorId') || undefined;
    const branchId = searchParams.get('branchId') || undefined;

    const schedules = await getDoctorSchedules(doctorId, branchId);
    return NextResponse.json({ schedules });
  } catch (error: any) {
    console.error('Error fetching doctor schedules:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch schedules' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.doctorId || !body.branchId || body.dayOfWeek === undefined) {
      return NextResponse.json({ error: 'doctorId, branchId, and dayOfWeek are required' }, { status: 400 });
    }

    const schedule = await saveDoctorSchedule(body);
    return NextResponse.json({ success: true, schedule, message: 'Doctor availability schedule saved.' });
  } catch (error: any) {
    console.error('Error saving doctor schedule:', error);
    return NextResponse.json({ error: error.message || 'Failed to save schedule' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Schedule ID is required' }, { status: 400 });
    }

    const deleted = await deleteDoctorSchedule(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Schedule not found or already deleted' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Doctor availability schedule removed.' });
  } catch (error: any) {
    console.error('Error deleting doctor schedule:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete schedule' }, { status: 500 });
  }
}
