import { NextRequest, NextResponse } from 'next/server';
import { getAppointmentById, rescheduleAppointment } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const appointment = await getAppointmentById(id);

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json({ appointment });
  } catch (error: any) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!body.newDate || !body.newStartTime) {
      return NextResponse.json({ error: 'newDate and newStartTime are required.' }, { status: 400 });
    }

    const updated = await rescheduleAppointment({
      appointmentId: id,
      newDate: body.newDate,
      newStartTime: body.newStartTime,
      patientEmail: body.patientEmail,
      reason: body.reason,
    });

    return NextResponse.json({ success: true, appointment: updated });
  } catch (error: any) {
    console.error('Error rescheduling appointment:', error);
    return NextResponse.json({ error: error.message || 'Rescheduling failed.' }, { status: 400 });
  }
}
