import nodemailer from "nodemailer";

export type EmailOptions = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

// Create transporter (example with Gmail, but you can swap for SMTP provider)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,     
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,                    
  auth: {
    user: process.env.SMTP_USER,    
    pass: process.env.SMTP_PASS,     
  },
});

export async function sendEmail({ to, subject, text, html }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"Quest Platform" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log("Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("Email send error:", err);
    throw err;
  }
}
