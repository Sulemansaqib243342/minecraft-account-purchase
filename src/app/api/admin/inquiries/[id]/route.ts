import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { getInquiryById } from '@/lib/persistentStore';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid inquiry ID.' }, { status: 400 });
  }

  try {
    const { inquiry, replies } = getInquiryById(id);

    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found.' }, { status: 404 });
    }

    if (inquiry.status === 'new') {
      inquiry.status = 'read';
    }

    return NextResponse.json({ inquiry, replies });
  } catch (error) {
    console.error('Fetch inquiry detail error:', error);
    return NextResponse.json({ error: 'Failed to fetch inquiry.' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid inquiry ID.' }, { status: 400 });
  }

  try {
    const { status } = await request.json();
    if (!['new', 'read', 'replied'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status value.' }, { status: 400 });
    }

    db.prepare('UPDATE inquiries SET status = ? WHERE id = ?').run(status, id);
    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error('Update inquiry status error:', error);
    return NextResponse.json({ error: 'Failed to update status.' }, { status: 500 });
  }
}
