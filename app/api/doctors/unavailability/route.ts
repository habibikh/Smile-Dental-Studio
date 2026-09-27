import { NextRequest, NextResponse } from 'next/server';
import { getDoctorUnavailability, saveDoctorUnavailability, deleteDoctorUnavailability } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get('doctorId') || undefined;
    const date = searchParams.get('date') || undefined;

    const unavailabilities = await getDoctorUnavailability(doctorId, date);
    return NextResponse.json({ unavailabilities });
  } catch (error: any) {
    console.error('Error fetching doctor unavailabilities:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch unavailabilities' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.doctorId || !body.date) {
      return NextResponse.json({ error: 'doctorId and date (YYYY-MM-DD) are required' }, { status: 400 });
    }

    const unavailability = await saveDoctorUnavailability(body);
    return NextResponse.json({ success: true, unavailability, message: 'Time-off / unavailability recorded.' });
  } catch (error: any) {
    console.error('Error saving doctor unavailability:', error);
    return NextResponse.json({ error: error.message || 'Failed to save unavailability' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Unavailability ID is required' }, { status: 400 });
    }

    const deleted = await deleteDoctorUnavailability(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Unavailability record not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Time-off record removed; doctor availability restored.' });
  } catch (error: any) {
    console.error('Error deleting doctor unavailability:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete unavailability' }, { status: 500 });
  }
}
