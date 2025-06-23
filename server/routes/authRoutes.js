const express = require('express')
const router = express.Router()
const authController = require('../controller/authController')
const { authenticate } = require('../middleware/auth')

// Registration
router.post('/register', authController.register)
// Login
router.post('/login', authController.login)
// Refresh token
router.post('/refresh', authController.refresh)
// Logout
router.post('/logout', authenticate, authController.logout)
// Email verification
router.get('/verify-email', authController.verifyEmail)
// Resend verification email
router.post('/resend-verification', authController.resendVerificationEmail)
// Example protected route
router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user })
})

module.exports = router
