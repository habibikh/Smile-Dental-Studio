import { NextRequest, NextResponse } from 'next/server';
import { registerHospitalAndPayFee, getHospitalRegistrations } from '@/lib/db';

export async function GET() {
  try {
    const registrations = await getHospitalRegistrations();
    return NextResponse.json({ registrations });
  } catch (err: any) {
    console.error('Error fetching hospital registrations:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      hospitalName,
      licenseNumber,
      directorName,
      officialEmail,
      phone,
      city,
      address,
      suiteCount,
      paymentMethod,
      registrationFeeAmount,
    } = body;

    if (!hospitalName || !licenseNumber || !directorName || !officialEmail || !phone || !city || !address) {
      return NextResponse.json(
        { error: 'All hospital details, license number, director name, and contact details are required.' },
        { status: 400 }
      );
    }

    const result = await registerHospitalAndPayFee({
      hospitalName,
      licenseNumber,
      directorName,
      officialEmail,
      phone,
      city,
      address,
      suiteCount: suiteCount ? Number(suiteCount) : 6,
      paymentMethod: paymentMethod || 'Credit Card (Corporate)',
      registrationFeeAmount: registrationFeeAmount ? Number(registrationFeeAmount) : 499.00,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    console.error('Error registering hospital and processing fee:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
