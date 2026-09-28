import { NextRequest, NextResponse } from 'next/server';
import { getBranches, getBranchById, saveBranch } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const branch = await getBranchById(id);
      if (!branch) {
        return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
      }
      return NextResponse.json({ branch });
    }

    const branches = await getBranches();
    return NextResponse.json({ branches });
  } catch (error: any) {
    console.error('Error fetching branches:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch branches' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !body.name) {
      return NextResponse.json({ error: 'Branch name is required' }, { status: 400 });
    }
    const branch = await saveBranch(body);
    return NextResponse.json({ success: true, branch });
  } catch (error: any) {
    console.error('Error saving branch:', error);
    return NextResponse.json({ error: error.message || 'Failed to save branch' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Branch id is required' }, { status: 400 });
    }
    const { deleteBranch } = await import('@/lib/db');
    const success = await deleteBranch(id);
    return NextResponse.json({ success });
  } catch (error: any) {
    console.error('Error deleting branch:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete branch' }, { status: 500 });
  }
}
