// Gmail email verification controller
const prisma = require('../prismaClient')

module.exports = {
  async verifyEmail(req, res) {
    const { token } = req.query
    if (!token) return res.status(400).json({ error: 'Token required.' })
    const record = await prisma.emailVerificationToken.findUnique({
      where: { token },
    })
    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired token.' })
    }
    await prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: true },
    })
    await prisma.emailVerificationToken.delete({ where: { token } })
    res.json({ message: 'Email verified successfully.' })
  },
}
