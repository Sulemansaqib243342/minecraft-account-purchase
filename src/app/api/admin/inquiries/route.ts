import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getAllInquiries } from '@/lib/persistentStore';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status') || undefined;

    const inquiries = getAllInquiries(statusFilter);
    const allInquiries = getAllInquiries();

    const stats = {
      total: allInquiries.length,
      newCount: allInquiries.filter((i) => i.status === 'new').length,
      readCount: allInquiries.filter((i) => i.status === 'read').length,
      repliedCount: allInquiries.filter((i) => i.status === 'replied').length,
    };

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
