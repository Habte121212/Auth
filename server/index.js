const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const { csrfProtection } = require('./middleware/auth')
const connectDB = require('./db/dbconfig.js')

dotenv.config()

// initialize
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(csrfProtection)

// Route to get CSRF token for frontend
app.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() })
})

// connect Databaase
connectDB()

// routes
const authRoutes = require('./routes/authRoutes')
app.use('/server/auth', authRoutes)

//port
const port = process.env.PORT
app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})
