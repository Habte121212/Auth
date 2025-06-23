// Gmail email verification routes
const express = require('express')
const router = express.Router()
const controller = require('../controller/GmailVerify')

router.get('/verify-email', controller.verifyEmail)

module.exports = router
