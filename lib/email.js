import nodemailer from 'nodemailer';

/**
 * Email Utility for Bihar Ka Bazaar
 * 
 * Uses nodemailer to send transactional emails.
 * In development/demo mode, uses Ethereal (fake SMTP) so no real emails are sent.
 * 
 * To switch to production:
 *   1. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in .env.local
 *   2. Set SMTP_FROM for the sender address
 */

let transporter = null;

async function getTransporter() {
  if (transporter) return transporter;

  // Check if production SMTP credentials are configured
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Demo mode: use Ethereal fake SMTP (emails are captured but not delivered)
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  return transporter;
}

const FROM_ADDRESS = process.env.SMTP_FROM || '"Bihar Ka Bazaar" <noreply@biharkabazaar.com>';

/**
 * Send a welcome email to a newly registered seller with their Seller ID.
 * @param {string} toEmail - Seller's email address
 * @param {string} fullName - Seller's full name
 * @param {string} sellerId - Generated Seller ID (e.g. BKB-SEL-178...)
 */
export async function sendWelcomeEmail(toEmail, fullName, sellerId) {
  try {
    const transport = await getTransporter();

    const info = await transport.sendMail({
      from: FROM_ADDRESS,
      to: toEmail,
      subject: `Welcome to Bihar Ka Bazaar! Your Seller ID: ${sellerId}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #FFFCF8; border: 1px solid #E8DDD4; border-radius: 16px; overflow: hidden;">
          
          <!-- Header -->
          <div style="background: #1A5C38; padding: 32px 28px; text-align: center;">
            <h1 style="color: #fff; font-size: 22px; margin: 0 0 4px;">🌾 Bihar Ka Bazaar</h1>
            <p style="color: rgba(255,255,255,0.7); font-size: 13px; margin: 0;">Connecting Bihar to All of India</p>
          </div>

          <!-- Body -->
          <div style="padding: 28px;">
            <h2 style="color: #1A1410; font-size: 20px; margin: 0 0 12px;">Namaste, ${fullName}! 🙏</h2>
            <p style="color: #4A3F35; font-size: 14px; line-height: 1.7; margin: 0 0 20px;">
              Your seller account has been successfully created on <strong>Bihar Ka Bazaar</strong>. 
              Welcome to the platform — we are excited to help you reach customers across India!
            </p>

            <!-- Seller ID Box -->
            <div style="background: #EAF5F0; border: 2px solid #1A5C38; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 20px;">
              <div style="font-size: 11px; font-weight: 700; color: #1A5C38; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px;">Your Seller ID</div>
              <div style="font-size: 24px; font-weight: 800; color: #1A1410; letter-spacing: 1px;">${sellerId}</div>
              <div style="font-size: 11px; color: #8C7B6E; margin-top: 8px;">Save this ID — you will need it to resume your registration or log in later.</div>
            </div>

            <!-- Next Steps -->
            <h3 style="color: #1A1410; font-size: 15px; margin: 0 0 10px;">Next Steps:</h3>
            <ol style="color: #4A3F35; font-size: 13px; line-height: 1.8; padding-left: 20px; margin: 0 0 20px;">
              <li>Visit the <strong>Sell on BKB</strong> page and click <em>"Resume with Seller ID"</em></li>
              <li>Complete your business details, product info, and payout setup</li>
              <li>Our team will verify your account within <strong>24 hours</strong></li>
              <li>Start listing your products and getting orders!</li>
            </ol>

            <p style="color: #8C7B6E; font-size: 12px; line-height: 1.6;">
              If you have any questions, reply to this email or reach us on WhatsApp at <strong>+91 612-XXX-XXXX</strong> (Mon–Sat, 9am–6pm).
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #F5EEE6; padding: 16px 28px; text-align: center; border-top: 1px solid #E8DDD4;">
            <p style="color: #8C7B6E; font-size: 11px; margin: 0;">
              © ${new Date().getFullYear()} Bihar Ka Bazaar · Made with ❤️ in Bihar
            </p>
          </div>
        </div>
      `,
    });

    // In demo mode, log the preview URL where the email can be viewed
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('📧 Welcome email preview:', previewUrl);
    }

    return { success: true, messageId: info.messageId, previewUrl: previewUrl || null };
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
    // Don't throw — email failure should not block registration
    return { success: false, error: error.message };
  }
}
