const { resendVerificationEmail } = require('../controller/authController')

jest.mock('../prismaClient', () => ({
  user: { findUnique: jest.fn() },
}))

jest.mock('../utils/email', () => ({
  sendVerificationEmail: jest.fn(),
}))

describe('resendVerificationEmail', () => {
  it('should return 400 if email is missing', async () => {
    const req = { body: {} }
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    await resendVerificationEmail(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('should return 404 if user not found', async () => {
    require('../prismaClient').user.findUnique.mockResolvedValue(null)
    const req = { body: { email: 'notfound@example.com' } }
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    await resendVerificationEmail(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
  })

  it('should return 400 if email is already verified', async () => {
    require('../prismaClient').user.findUnique.mockResolvedValue({
      emailVerified: true,
    })
    const req = { body: { email: 'verified@example.com' } }
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    await resendVerificationEmail(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('should return 200 and call sendVerificationEmail if user is unverified', async () => {
    const user = { emailVerified: false }
    require('../prismaClient').user.findUnique.mockResolvedValue(user)
    const req = { body: { email: 'unverified@example.com' } }
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    const { sendVerificationEmail } = require('../utils/email')
    await resendVerificationEmail(req, res)
    expect(sendVerificationEmail).toHaveBeenCalledWith(user, req)
    expect(res.status).toHaveBeenCalledWith(200)
  })
})
