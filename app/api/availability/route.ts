import { NextRequest, NextResponse } from 'next/server';
import { calculateDoctorAvailability } from '@/lib/availability';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get('doctorId');
    const branchId = searchParams.get('branchId');
    const serviceId = searchParams.get('serviceId');
    const date = searchParams.get('date');

    if (!doctorId || !branchId || !serviceId || !date) {
      return NextResponse.json(
        { error: 'doctorId, branchId, serviceId, and date query parameters are required.' },
        { status: 400 }
      );
    }

    const availability = await calculateDoctorAvailability(doctorId, branchId, serviceId, date);
    return NextResponse.json(availability);
  } catch (error: any) {
    console.error('Error calculating availability:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to calculate doctor availability' },
      { status: 500 }
    );
  }
}
