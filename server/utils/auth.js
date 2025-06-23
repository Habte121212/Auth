const jwt = require('jsonwebtoken')
const crypto = require('crypto')

// Generate access token
function generateAccessToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' })
}

// Generate refresh token (random string)
function generateRefreshToken() {
  return crypto.randomBytes(40).toString('hex')
}

// Verify access token
function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET)
}

// Verify refresh token (JWT or string, depending on your implementation)
function verifyRefreshToken(token, secret) {
  return jwt.verify(token, secret)
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
}
