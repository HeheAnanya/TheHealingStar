const nodemailer = require("nodemailer");

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function createTransport() {
  const required = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"];
  if (required.some((key) => !process.env[key])) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: String(process.env.SMTP_SECURE || "").toLowerCase() === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

async function sendServiceBookingEmails({ appointment, user, servicePackage, cancelled = false }) {
  const transport = createTransport();
  if (!transport) {
    console.info("Service booking emails skipped: SMTP environment variables are not configured.");
    return;
  }

  const when = appointment.scheduledAt
    ? new Date(appointment.scheduledAt).toLocaleString("en-IN", {
        dateStyle: "full", timeStyle: "short", timeZone: "Asia/Kolkata",
      }) + " (Asia/Kolkata)"
    : "To be confirmed";
  const customerName = escapeHtml(user.name);
  const serviceName = escapeHtml(servicePackage.name);
  const statusLine = cancelled
    ? "Your Calendly appointment has been cancelled."
    : "Your service appointment has been confirmed.";
  const subject = cancelled
    ? `The Healing Star – appointment cancelled: ${servicePackage.name}`
    : `The Healing Star – booking confirmed: ${servicePackage.name}`;
  const html = `<div style="font-family:Arial,sans-serif;color:#49382d;line-height:1.7"><h2>The Healing Star</h2><p>Hello ${customerName},</p><p>${statusLine}</p><p><strong>Service:</strong> ${serviceName}<br/><strong>Appointment:</strong> ${when}</p><p>Thank you,<br/>The Healing Star</p></div>`;

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const messages = [];
  if (user.email) messages.push(transport.sendMail({ from, to: user.email, subject, html }));
  if (process.env.ADMIN_NOTIFICATION_EMAIL) {
    messages.push(transport.sendMail({
      from,
      to: process.env.ADMIN_NOTIFICATION_EMAIL,
      subject: `[Admin] ${subject}`,
      html: `${html}<p>Customer email: ${escapeHtml(user.email)}</p><p>Booking ID: ${appointment.id}</p>`,
    }));
  }
  await Promise.allSettled(messages);
}

module.exports = { sendServiceBookingEmails };
