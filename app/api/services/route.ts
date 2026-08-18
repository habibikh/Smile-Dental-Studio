import { NextRequest, NextResponse } from 'next/server';
import { getServices, getServiceById } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const service = await getServiceById(id);
      if (!service) {
        return NextResponse.json({ error: 'Service not found' }, { status: 404 });
      }
      return NextResponse.json({ service });
    }

    const services = await getServices();
    return NextResponse.json({ services });
  } catch (error: any) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch services' }, { status: 500 });
  }
}
