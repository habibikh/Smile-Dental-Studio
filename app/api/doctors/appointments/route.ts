import { NextRequest, NextResponse } from 'next/server';
import { getDoctorAppointments, updateAppointmentStatus } from '@/lib/db';
import { AppointmentStatus } from '@/types/dental';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get('doctorId');

    if (!doctorId) {
      return NextResponse.json({ error: 'doctorId parameter is required' }, { status: 400 });
    }

    const appointments = await getDoctorAppointments(doctorId);
    return NextResponse.json({ appointments });
  } catch (error: any) {
    console.error('Error fetching doctor appointments:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch doctor appointments' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { appointmentId, status, notes } = body;

    if (!appointmentId || !status) {
      return NextResponse.json({ error: 'appointmentId and status are required' }, { status: 400 });
    }

    const updated = await updateAppointmentStatus(appointmentId, status as AppointmentStatus, notes);
    return NextResponse.json({ success: true, appointment: updated, message: 'Appointment status updated.' });
  } catch (error: any) {
    console.error('Error updating appointment:', error);
    return NextResponse.json({ error: error.message || 'Failed to update appointment' }, { status: 500 });
  }
}
