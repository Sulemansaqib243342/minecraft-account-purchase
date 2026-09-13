import nodemailer from 'nodemailer';

const gmailUser = process.env.GMAIL_USER || 'zaydengrey172@gmail.com';
const gmailPass = process.env.GMAIL_APP_PASSWORD || 'lvkuhademujtbwjw';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailUser,
    pass: gmailPass,
  },
});

export async function sendReplyEmail(
  to: string,
  subject: string,
  replyText: string,
  inquiryOriginalMessage?: string
) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #0a0a0f; color: #ffffff; padding: 24px; border-radius: 12px;">
      <h2 style="color: #39FF14; margin-bottom: 16px;">Minecraft Account Purchase — Response</h2>
      <p style="font-size: 15px; color: #e5e7eb; line-height: 1.6; whitespace: pre-wrap;">${replyText.replace(/\n/g, '<br/>')}</p>
      
      ${
        inquiryOriginalMessage
          ? `
        <hr style="border: 0; border-top: 1px solid #1f2937; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 13px; font-weight: bold;">Your original inquiry:</p>
        <blockquote style="border-left: 3px solid #8B5CF6; margin: 0; padding-left: 12px; color: #9ca3af; font-size: 13px;">
          ${inquiryOriginalMessage.replace(/\n/g, '<br/>')}
        </blockquote>
      `
          : ''
      }

      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #1f2937; font-size: 12px; color: #6b7280;">
        <p>© Minecraft Account Purchase Support Team</p>
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"MC Accounts Support" <${gmailUser}>`,
      to,
      subject: subject || 'Response to your inquiry - Minecraft Account Purchase',
      html: htmlContent,
    });

    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Failed to send email via Gmail SMTP:', error);
    return { success: false, error: error.message || 'Gmail SMTP Error' };
  }
}

export async function sendNotificationToAdmin(inquiry: {
  name: string;
  email: string;
  subject?: string;
  message: string;
  product?: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || gmailUser;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #0a0a0f; color: #ffffff; padding: 24px; border-radius: 12px;">
      <h2 style="color: #06B6D4; margin-bottom: 16px;">📥 New Inquiry Received</h2>
      <p><strong>From:</strong> ${inquiry.name} (&lt;${inquiry.email}&gt;)</p>
      ${inquiry.product ? `<p><strong>Product:</strong> ${inquiry.product}</p>` : ''}
      ${inquiry.subject ? `<p><strong>Subject:</strong> ${inquiry.subject}</p>` : ''}
      <p><strong>Message:</strong></p>
      <div style="background-color: #111118; padding: 16px; border-radius: 8px; border-left: 4px solid #39FF14; color: #e5e7eb;">
        ${inquiry.message.replace(/\n/g, '<br/>')}
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"MC Accounts Portal" <${gmailUser}>`,
      to: adminEmail,
      subject: `New Inquiry: ${inquiry.subject || inquiry.name}`,
      html: htmlContent,
    });

    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Failed to send admin notification email:', error);
    return { success: false, error: error.message || 'Gmail SMTP Error' };
  }
}
