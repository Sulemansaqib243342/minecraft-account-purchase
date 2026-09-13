import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');

    let query = 'SELECT * FROM inquiries';
    const params: string[] = [];

    if (statusFilter && ['new', 'read', 'replied'].includes(statusFilter)) {
      query += ' WHERE status = ?';
      params.push(statusFilter);
    }

    query += ' ORDER BY created_at DESC';

    const stmt = db.prepare(query);
    const inquiries = stmt.all(...params);

    // Get count statistics
    const statsStmt = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as newCount,
        SUM(CASE WHEN status = 'read' THEN 1 ELSE 0 END) as readCount,
        SUM(CASE WHEN status = 'replied' THEN 1 ELSE 0 END) as repliedCount
      FROM inquiries
    `);
    const stats = statsStmt.get() || { total: 0, newCount: 0, readCount: 0, repliedCount: 0 };

    return NextResponse.json({
      inquiries,
      stats,
    });
  } catch (error) {
    console.error('Fetch inquiries error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inquiries.' },
      { status: 500 }
    );
  }
}
