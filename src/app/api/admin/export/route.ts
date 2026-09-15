import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const stmt = db.prepare('SELECT id, name, email, subject, product, status, created_at, message FROM inquiries ORDER BY created_at DESC');
    const rows = stmt.all();

    // Generate CSV Content
    const headers = ['ID', 'Name', 'Email', 'Subject', 'Product', 'Status', 'Date', 'Message'];
    const csvRows = [headers.join(',')];

    for (const row of rows as any[]) {
      const escapedMessage = `"${(row.message || '').replace(/"/g, '""')}"`;
      const escapedSubject = `"${(row.subject || '').replace(/"/g, '""')}"`;
      const escapedName = `"${(row.name || '').replace(/"/g, '""')}"`;
      const escapedEmail = `"${(row.email || '').replace(/"/g, '""')}"`;
      const escapedProduct = `"${(row.product || '').replace(/"/g, '""')}"`;

      csvRows.push([
        row.id,
        escapedName,
        escapedEmail,
        escapedSubject,
        escapedProduct,
        row.status,
        row.created_at,
        escapedMessage,
      ].join(','));
    }

    const csvContent = csvRows.join('\n');

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="inquiries_export_${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    console.error('Export CSV Error:', error);
    return NextResponse.json({ error: 'Failed to export CSV' }, { status: 500 });
  }
}
