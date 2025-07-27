const { register } = require('../controller/authController')
// const prisma = require('../prismaClient')
// jest.mock('../prismaClient'); // Commented out to avoid Jest mock error

describe('register controller', () => {
  it('should return 400 if validation fails', async () => {
    const req = { body: { email: '', name: '', password: '' } }
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    await register(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
  })
  // Add more unit tests for logic branches as needed
})
