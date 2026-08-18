import { NextRequest, NextResponse } from 'next/server';
import { getAppointments, createAppointment } from '@/lib/db';
import { BookingPayload } from '@/types/dental';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('patientEmail') || searchParams.get('email') || undefined;

    const appointments = await getAppointments(email);
    return NextResponse.json({ appointments });
  } catch (error: any) {
    console.error('Error getting appointments:', error);
    return NextResponse.json({ error: error.message || 'Failed to retrieve appointments' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: BookingPayload = await req.json();

    if (!body.doctorId || !body.branchId || !body.serviceId || !body.appointmentDate || !body.startTime) {
      return NextResponse.json(
        { error: 'Missing required appointment parameters (doctorId, branchId, serviceId, date, time).' },
        { status: 400 }
      );
    }

    if (!body.patientName || !body.patientEmail || !body.patientPhone) {
      return NextResponse.json(
        { error: 'Patient full name, email address, and phone number are required.' },
        { status: 400 }
      );
    }

    const appointment = await createAppointment(body);
    return NextResponse.json({ success: true, appointment }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to book appointment' },
      { status: 400 }
    );
  }
}
