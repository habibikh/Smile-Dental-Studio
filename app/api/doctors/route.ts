import { NextRequest, NextResponse } from 'next/server';
import { getDoctors, getDoctorById } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const branchId = searchParams.get('branchId') || undefined;
    const serviceId = searchParams.get('serviceId') || undefined;

    if (id) {
      const doctor = await getDoctorById(id);
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
