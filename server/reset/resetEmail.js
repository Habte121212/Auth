const nodemailer = require('nodemailer')
const prisma = require('../prismaClient')
const crypto = require('crypto')

// Send password reset email
async function sendResetEmail(user, req) {
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
  await prisma.passwordResetToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    },
  })
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
  const resetUrl = `${req.protocol}://${req.get(
    'host',
  )}/api/auth/reset-password?token=${token}`
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`,
  })
}

module.exports = { sendResetEmail }
