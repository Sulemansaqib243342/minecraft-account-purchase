import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { sendReplyEmail } from '@/lib/email';
import { getInquiryById, saveNewReply } from '@/lib/persistentStore';

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

    const { inquiry } = getInquiryById(id);

    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found.' }, { status: 404 });
    }

    // Send email via Nodemailer Gmail SMTP
    const subject = inquiry.subject ? `Re: ${inquiry.subject}` : `Response to your inquiry - Gaming Zone Store`;
    const emailResult = await sendReplyEmail(inquiry.email, subject, replyText, inquiry.message);

    // Save reply to persistent store & SQLite
    saveNewReply(id, replyText.trim());

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
