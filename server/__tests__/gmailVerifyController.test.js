const { verifyEmail } = require('../controller/GmailVerify')
// const prisma = require('../prismaClient')
// jest.mock('../prismaClient')

describe('GmailVerify controller', () => {
  it('should return 400 if token is missing', async () => {
    const req = { query: {} }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      redirect: jest.fn(),
    }
    await verifyEmail(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
  })
  // Add more unit tests for valid/invalid/expired token as needed
})
