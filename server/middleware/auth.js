const jwt = require('jsonwebtoken')
const prisma = require('../prismaClient')
const csrf = require('csurf')

// CSRF protection middleware
const csrfProtection = csrf({ cookie: true })

// Middleware for HTTP-only cookie JWT authentication with refresh token support
const authenticate = async (req, res, next) => {
  const token = req.cookies?.token
  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await prisma.user.findUnique({ where: { id: decoded.id } })
    if (!req.user) return res.status(401).json({ error: 'User not found' })
    next()
  } catch (err) {
    // Check for refresh token
    if (err.name === 'TokenExpiredError') {
      const refreshToken = req.cookies?.refreshToken
      if (!refreshToken)
        return res
          .status(401)
          .json({ error: 'Session expired. Please login again.' })
      try {
        const decodedRefresh = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET,
        )
        req.user = await prisma.user.findUnique({
          where: { id: decodedRefresh.id },
        })
        if (!req.user) return res.status(401).json({ error: 'User not found' })

        // Issue new access token
        const newToken = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
          expiresIn: '15m',
        })
        res.cookie('token', newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000,
        })
        next()
      } catch (refreshErr) {
        return res
          .status(401)
          .json({ error: 'Invalid refresh token. Please login again.' })
      }
    } else {
      res.status(401).json({ error: 'Invalid token' })
    }
  }
}

module.exports = { authenticate, csrfProtection }
