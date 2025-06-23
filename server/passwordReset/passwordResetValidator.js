// Joi validation for password reset
const Joi = require('joi')

const requestResetSchema = Joi.object({
  email: Joi.string().email().required(),
})

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(8).required(),
})

module.exports = {
  requestResetSchema,
  resetPasswordSchema,
}
