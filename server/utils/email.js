const nodemailer = require('nodemailer')
const prisma = require('../prismaClient')
const crypto = require('crypto')

// Send verification email
async function sendVerificationEmail(user, req) {
  // Generate a unique token
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
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
  const verifyUrl = `${req.protocol}://${req.get(
    'host',
  )}/api/auth/verify-email?token=${token}`
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Verify your email',
    html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>`,
  })
}

module.exports = { sendVerificationEmail }
