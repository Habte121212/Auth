const nodemailer = require('nodemailer')
const prisma = require('../prismaClient')
const crypto = require('crypto')

// Send verification email
async function sendVerificationEmail(user, req) {
  // Generate a unique token
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour
  await prisma.emailVerificationToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    },
  })
  // Send email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
  // Use a fixed backend URL for local development
  const verifyUrl = `http://localhost:8600/server/auth/verify-email?token=${token}`
  // ...existing code...
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Verify your email',
    html: `
      <div style="
        padding: 0;
        margin: 0;
      ">
        <div style="
          width: 90%;
          margin: 12px auto;
          background: #ebebf7ff;
          border-radius: 14px;
          box-shadow: 0 4px 16px rgba(60, 60, 60, 0.10);
          font-family: 'Segoe UI', Arial, sans-serif;
          padding: 8px 18px 18px 18px;
          text-align: center;
          border: 1px solid #6ef4e9ff;
        ">
          <img src="https://res.cloudinary.com/di3ll9dgt/image/upload/v1753622861/HabiHub_fbxtmd.png" alt="Logo" style="width: 56px; margin-bottom: 22px;" />
          <h2 style="color: #13803fff; margin-bottom: 12px; font-size: 2rem; font-weight: 700; letter-spacing: 0.5px;">Verify your email address</h2>
          <p style="color: #444; font-size: 17px; margin-bottom: 28px; line-height: 1.6;">
            Hi ${user.name || 'there'},<br><br>
            Thank you for registering! Please verify your email to activate your account.<br>
            This link will expire in 1 hour.
          </p>
          <a href="${verifyUrl}" target="_blank" rel="noopener noreferrer" style="
            display: inline-block;
            padding: 18px 40px;
            background: linear-gradient(90deg, #6366F1 0%, #4F46E5 100%);
            color: #fff;
            text-decoration: none;
            border-radius: 32px;
            font-size: 20px;
            font-weight: 700;
            letter-spacing: 0.7px;
            box-shadow: 0 4px 16px rgba(79,70,229,0.18);
            transition: background 0.3s, box-shadow 0.3s;
            margin-bottom: 22px;
            border: none;
          ">Verify your email address</a>
          <p style="color: #888; font-size: 15px; margin-top: 28px;">
            If you did not request this, you can ignore this email.
          </p>
          <hr style="border:none;border-top:1px solid #eee;margin:28px 0;">
          <p style="color: #aaa; font-size: 14px;">
            Thanks,<br>
            The AcessNet Team
          </p>
        </div>
      </div>
    `,
  })
  // ...existing code...
}

module.exports = { sendVerificationEmail }
