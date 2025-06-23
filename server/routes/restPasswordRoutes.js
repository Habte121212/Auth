// Password reset routes
const express = require('express')
const router = express.Router()
const controller = require('../controller/restPassword')

router.post('/password/request', controller.requestReset)
router.get('/password/verify/:token', controller.verifyToken)
router.post('/password/reset', controller.resetPassword)

module.exports = router
