import nodemailer from "nodemailer";
import 'dotenv/config';

async function main() {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Test Script" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: "✅ Gmail SMTP Test",
      text: "Hello! This is a test email from NodeMailer + Gmail.",
    });
    console.log("Email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Email failed:", err);
  }
}

main();
