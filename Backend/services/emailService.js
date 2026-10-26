const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

async function sendPasswordResetEmail(email, resetUrl) {
    return transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: "Reset your password — Healing Star",
        text: `We received a request to reset your password.

Open this link to choose a new password:
${resetUrl}

This link expires in 15 minutes. If you did not request a reset, you can ignore this email.`,
        html: `
            <div style="font-family: Georgia, serif; color: #342d26; line-height: 1.6;">
                <h2>Healing Star</h2>
                <p>We received a request to reset your password.</p>
                <p>
                    <a href="${resetUrl}"
                       style="display:inline-block;padding:12px 22px;background:#b8955a;color:#fff;text-decoration:none;">
                       Reset Password
                    </a>
                </p>
                <p>This link expires in 15 minutes. If you did not request a reset, you can ignore this email.</p>
            </div>
        `,
    });
}

module.exports = { sendPasswordResetEmail };