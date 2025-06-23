// Password reset controller
const prisma = require('../prismaClient')
const bcrypt = require('bcrypt')
const { sendResetEmail } = require('../reset/resetEmail')

module.exports = {
  async requestReset(req, res) {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email required.' })
    const user = await prisma.user.findUnique({ where: { email } })
    if (user) await sendResetEmail(user, req)
    res.json({ message: 'If that email exists, a reset link has been sent.' })
  },
  async verifyToken(req, res) {
    const { token } = req.params
    const record = await prisma.passwordResetToken.findUnique({
      where: { token },
    })
    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired token.' })
    }
    res.json({ message: 'Token is valid.' })
  },
  async resetPassword(req, res) {
    const { token, password } = req.body
    if (!token || !password)
      return res.status(400).json({ error: 'Token and password required.' })
    const record = await prisma.passwordResetToken.findUnique({
      where: { token },
    })
    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired token.' })
    }
    const hashed = await bcrypt.hash(password, 10)
    await prisma.user.update({
      where: { id: record.userId },
      data: { password: hashed },
    })
    await prisma.passwordResetToken.delete({ where: { token } })
    res.json({ message: 'Password has been reset.' })
  },
}
