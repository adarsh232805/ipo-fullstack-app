import nodemailer from "nodemailer";

/**
 * Send email utility
 * @param {Object} param0
 * @param {string} param0.to
 * @param {string} param0.subject
 * @param {string} param0.html
 */
export async function sendEmail({ to, subject, html }) {
  try {
    // DEV MODE: log instead of sending if SMTP not configured
    if (!process.env.EMAIL_HOST) {
      console.log("📧 [DEV MODE] Email sent to:", to);
      console.log("Subject:", subject);
      return;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"IPO Alerts" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });

    console.log(`📧 Email successfully sent to ${to}`);
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
  }
}
