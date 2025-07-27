const {
  requestReset,
  verifyToken,
  resetPassword,
} = require('../controller/restPassword')
const prisma = require('../prismaClient')
jest.mock('../prismaClient', () => ({
  user: { findUnique: jest.fn() },
  passwordResetToken: { findUnique: jest.fn(), delete: jest.fn() },
}))

describe('restPassword controller', () => {
  it('should return 400 if email is missing in requestReset', async () => {
    const req = { body: {} }
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    await requestReset(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('should return 400 if token is expired in verifyToken', async () => {
    const expiredDate = new Date(Date.now() - 1000) // 1 second ago
    require('../prismaClient').passwordResetToken.findUnique.mockResolvedValue({
      expiresAt: expiredDate,
    })
    const req = { params: { token: 'expiredtoken' } }
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    await verifyToken(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('should return 400 if token is expired in resetPassword', async () => {
    const expiredDate = new Date(Date.now() - 1000)
    require('../prismaClient').passwordResetToken.findUnique.mockResolvedValue({
      expiresAt: expiredDate,
    })
    const req = { body: { token: 'expiredtoken', password: 'newpass' } }
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    await resetPassword(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
  })
  // Add more unit tests for verifyToken and resetPassword as needed
})
