import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getAllInquiries } from '@/lib/persistentStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const rows = getAllInquiries();

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
