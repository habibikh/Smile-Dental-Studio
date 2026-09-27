import { NextRequest, NextResponse } from 'next/server';
import { provisionClinicalAdminPanel } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { hospitalId, provisionedBy } = body;

    if (!hospitalId) {
      return NextResponse.json({ error: 'Hospital ID is required' }, { status: 400 });
    }

    const result = await provisionClinicalAdminPanel(
      hospitalId,
      provisionedBy || 'Application Super Admin'
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Provisioning failed' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error provisioning clinic';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
