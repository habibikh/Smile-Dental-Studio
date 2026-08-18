import { NextRequest, NextResponse } from 'next/server';
import { cancelAppointment } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Body is optional
    }

    const cancelled = await cancelAppointment(id, body.patientEmail, body.reason);
    return NextResponse.json({ success: true, appointment: cancelled });
  } catch (error: any) {
    console.error('Error cancelling appointment:', error);
    return NextResponse.json({ error: error.message || 'Failed to cancel appointment.' }, { status: 400 });
  }
}
