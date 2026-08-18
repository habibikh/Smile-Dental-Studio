import { NextRequest, NextResponse } from 'next/server';
import {
  exportFullDatabase,
  reuploadDatabase,
  resetDatabase,
  getAdminStats
} from '@/lib/db';

export async function GET() {
  try {
    const data = await exportFullDatabase();
    const stats = await getAdminStats();
    return NextResponse.json({
      success: true,
      stats,
      data,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to export database';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON payload provided.' },
        { status: 400 }
      );
    }

    const result = await reuploadDatabase(body);
    const stats = await getAdminStats();

    return NextResponse.json({
      success: true,
      result,
      stats,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to reupload database';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const result = await resetDatabase();
    const stats = await getAdminStats();
    return NextResponse.json({
      success: true,
      result,
      stats,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to reset database';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
