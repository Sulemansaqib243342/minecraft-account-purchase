import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { sendReplyEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(
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
    const { replyText } = await request.json();

    if (!replyText || !replyText.trim()) {
      return NextResponse.json(
        { error: 'Reply text cannot be empty.' },
        { status: 400 }
      );
    }

    // Get the inquiry
    const inquiryStmt = db.prepare('SELECT * FROM inquiries WHERE id = ?');
    const inquiry = inquiryStmt.get(id) as { id: number; email: string; subject?: string; message: string; name: string } | undefined;

    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found.' }, { status: 404 });
    }

    // Send email via Resend
    const subject = inquiry.subject ? `Re: ${inquiry.subject}` : `Response to your inquiry - Minecraft Account Purchase`;
    const emailResult = await sendReplyEmail(inquiry.email, subject, replyText, inquiry.message);

    // Record reply in SQLite database
    const insertReply = db.prepare(
      'INSERT INTO replies (inquiry_id, message) VALUES (?, ?)'
    );
    insertReply.run(id, replyText.trim());

    // Update status of inquiry to 'replied'
    db.prepare("UPDATE inquiries SET status = 'replied' WHERE id = ?").run(id);

    if (!emailResult.success) {
      return NextResponse.json({
        success: true,
        emailSent: false,
        emailError: emailResult.error,
        message: `Reply saved in database! (Note: Resend Email Error: ${emailResult.error})`,
      });
    }

    return NextResponse.json({
      success: true,
      emailSent: true,
      message: `Reply sent successfully to ${inquiry.email}!`,
    });
  } catch (error) {
    console.error('Reply error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing the reply.' },
      { status: 500 }
    );
  }
}
