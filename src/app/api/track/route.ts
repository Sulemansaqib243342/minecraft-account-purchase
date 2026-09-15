import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim();

    if (!query) {
      return NextResponse.json(
        { error: 'Please enter an Inquiry ID or Email address to search.' },
        { status: 400 }
      );
    }

    let statement;
    let results = [];

    // Check if query is a numeric Inquiry ID
    if (/^\d+$/.test(query)) {
      statement = db.prepare(`
        SELECT id, name, email, subject, product, status, created_at
        FROM inquiries
        WHERE id = ?
      `);
      const row = statement.get(parseInt(query, 10));
      if (row) results.push(row);
    } else {
      // Search by email address
      statement = db.prepare(`
        SELECT id, name, email, subject, product, status, created_at
        FROM inquiries
        WHERE LOWER(email) = LOWER(?)
        ORDER BY created_at DESC
        LIMIT 10
      `);
      results = statement.all(query);
    }

    if (!results || results.length === 0) {
      return NextResponse.json(
        { message: 'No inquiries found matching your query.', inquiries: [] },
        { status: 200 }
      );
    }

    // Attach public replies (if any)
    const inquiriesWithReplies = results.map((inquiry: any) => {
      const repliesStmt = db.prepare(`
        SELECT id, message, sent_at
        FROM replies
        WHERE inquiry_id = ?
        ORDER BY sent_at ASC
      `);
      const replies = repliesStmt.all(inquiry.id);
      return { ...inquiry, replies };
    });

    return NextResponse.json({ inquiries: inquiriesWithReplies }, { status: 200 });
  } catch (error) {
    console.error('Track Order API Error:', error);
    return NextResponse.json(
      { error: 'An error occurred while tracking your order.' },
      { status: 500 }
    );
  }
}
