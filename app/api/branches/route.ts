import { NextRequest, NextResponse } from 'next/server';
import { getBranches, getBranchById } from '@/lib/db';

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
