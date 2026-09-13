import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

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
    const stmt = db.prepare('SELECT * FROM inquiries WHERE id = ?');
    const inquiry = stmt.get(id) as any;

    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found.' }, { status: 404 });
    }

    // Auto-mark status as 'read' if it was 'new'
    if (inquiry.status === 'new') {
      db.prepare("UPDATE inquiries SET status = 'read' WHERE id = ?").run(id);
      inquiry.status = 'read';
    }

    // Get previous replies
    const repliesStmt = db.prepare('SELECT * FROM replies WHERE inquiry_id = ? ORDER BY sent_at ASC');
    const replies = repliesStmt.all(id);

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
