import { NextRequest, NextResponse } from 'next/server';
import { getBranches, getBranchById, saveBranch, deleteBranch } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    if (!body || !body.name || !body.name.trim()) {
      return NextResponse.json({ error: 'Branch name is required' }, { status: 400 });
    }
    const branch = await saveBranch(body);
    return NextResponse.json({ success: true, branch, message: 'Clinic studio successfully saved.' });
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
    const success = await deleteBranch(id);
    return NextResponse.json({ success: true, deleted: success, message: 'Clinic location removed from network.' });
  } catch (error: any) {
    console.error('Error deleting branch:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete branch' }, { status: 500 });
  }
}

