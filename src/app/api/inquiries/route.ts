import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { sendNotificationToAdmin } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, product } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required fields.' },
        { status: 400 }
      );
    }

    // Basic email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address format.' },
        { status: 400 }
      );
    }

    // Insert into SQLite database
    const stmt = db.prepare(`
      INSERT INTO inquiries (name, email, subject, message, product, status)
      VALUES (?, ?, ?, ?, ?, 'new')
    `);
    const result = stmt.run(name, email, subject || '', message, product || '');

    // Send async email notification to admin via Resend
    sendNotificationToAdmin({ name, email, subject, message, product }).catch((err) =>
      console.error('Background admin notification error:', err)
    );

    return NextResponse.json({
      success: true,
      message: 'Your inquiry has been submitted successfully!',
      inquiryId: result.lastInsertRowid,
    });
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
