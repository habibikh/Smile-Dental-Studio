import { NextRequest, NextResponse } from 'next/server';
import {
  getPersonalAssistantForDoctor,
  getAllPersonalAssistants,
  savePersonalAssistant,
  deletePersonalAssistant
} from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get('doctorId');

    if (doctorId) {
      const pa = await getPersonalAssistantForDoctor(doctorId);
      return NextResponse.json({ pa });
    }

    const personalAssistants = await getAllPersonalAssistants();
    return NextResponse.json({ personalAssistants });
  } catch (err: any) {
    console.error('Error fetching personal assistants:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { doctorId, name, email, phone, title, password, avatarUrl, status, permissions } = body;

    if (!doctorId || !name || !email || !phone) {
      return NextResponse.json(
        { error: 'Doctor ID, Assistant Name, Email, and Phone are required.' },
        { status: 400 }
      );
    }

    // Save PA (enforces strictly 1 PA per doctor rule)
    const result = await savePersonalAssistant(doctorId, {
      name,
      email,
      phone,
      title,
      password,
      avatarUrl,
      status,
      permissions,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to save personal assistant' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Personal Assistant account saved successfully.',
      pa: result.pa,
    });
  } catch (err: any) {
    console.error('Error saving personal assistant:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get('doctorId');

    if (!doctorId) {
      return NextResponse.json({ error: 'Doctor ID is required' }, { status: 400 });
    }

    const result = await deletePersonalAssistant(doctorId);
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: result.message });
  } catch (err: any) {
    console.error('Error deleting personal assistant:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
