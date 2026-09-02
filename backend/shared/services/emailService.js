const nodemailer = require('nodemailer');
const { smtp, isProduction } = require('../../config/env');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!smtp.host) return null;
  transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: smtp.user ? { user: smtp.user, pass: smtp.pass } : undefined
  });
  return transporter;
}

async function sendMail({ to, subject, text, html }) {
  const transport = getTransporter();
  if (!transport) {
    if (isProduction) {
      throw new Error('SMTP is not configured; cannot send email');
    }
    console.log(`[email:dev] To: ${to}\n[email:dev] Subject: ${subject}\n[email:dev] ${text}`);
    return { delivered: false, devLogged: true };
  }
  await transport.sendMail({ from: smtp.from, to, subject, text, html });
  return { delivered: true };
}

async function sendOtpEmail(to, code, minutes) {
  const subject = 'Your QuickCourt verification code';
  const text = `Your QuickCourt verification code is ${code}. It expires in ${minutes} minutes.`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #e2e8f0;border-radius:16px">
      <h2 style="color:#0f172a;margin:0 0 8px">Quick<span style="color:#059669">Court</span></h2>
      <p style="color:#475569">Use the code below to verify your email address.</p>
      <div style="font-size:32px;letter-spacing:8px;font-weight:800;color:#0f172a;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:12px;padding:16px;text-align:center">${code}</div>
      <p style="color:#64748b;font-size:13px">This code expires in ${minutes} minutes. If you did not request it, you can ignore this email.</p>
    </div>`;
  return sendMail({ to, subject, text, html });
}

module.exports = { sendMail, sendOtpEmail };
