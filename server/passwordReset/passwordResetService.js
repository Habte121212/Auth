// Business logic for password reset
const prisma = require('../prismaClient')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const { sendResetEmail } = require('../reset/resetEmail')

module.exports = {
  async requestReset(email, req) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return // Do not reveal user existence
    await sendResetEmail(user, req)
  },

  async verifyToken(token) {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    })
    if (!resetToken || resetToken.expiresAt < new Date()) return null
    return resetToken
  },

  async resetPassword(token, newPassword) {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    })
    if (!resetToken || resetToken.expiresAt < new Date()) return false
    const hashed = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashed },
    })
    await prisma.passwordResetToken.delete({ where: { token } })
    return true
  },
}
