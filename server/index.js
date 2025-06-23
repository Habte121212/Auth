const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { csrfProtection } = require('./middleware/auth')
const connectDB = require('./db/dbconfig.js')
const session = require('express-session')
const passport = require('passport')
const tokenUtils = require('./utils/auth')
require('./passport')

dotenv.config()

// initialize
const app = express()
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())
app.use(
  session({ secret: 'your_secret', resave: false, saveUninitialized: false }),
)
app.use(passport.initialize())
app.use(passport.session())
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

// Gmail email verification route
const gmailVerifyRoutes = require('./routes/gmailVerifyRoutes')
app.use('/server/auth', gmailVerifyRoutes)

// Password reset routes
const restPasswordRoutes = require('./routes/restPasswordRoutes')
app.use('/server/auth', restPasswordRoutes)

// Social login routes
app.get(
  '/server/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
)
app.get(
  '/server/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Generate JWT for the user
    const accessToken = tokenUtils.generateAccessToken(req.user.id)
    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 min
    })
    res.redirect('http://localhost:5173/')
  },
)
app.get(
  '/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Generate JWT for the user
    const accessToken = tokenUtils.generateAccessToken(req.user.id)
    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 min
    })
    res.redirect('http://localhost:5173/')
  },
)

//port
const port = process.env.PORT
app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})
