const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const prisma = require('./prismaClient')
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID)

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find or create user in your DB
        let user = await prisma.user.findUnique({
          where: { email: profile.emails[0].value },
        })
        if (!user) {
          user = await prisma.user.create({
            data: {
              email: profile.emails[0].value,
              name: profile.displayName,
              password: '', // Social users may not have a password
              emailVerified: true, // Trust Google email as verified
              provider: 'google',
            },
          })
        } else {
          // If user exists but has no provider, update provider to 'google' (optional)
          if (!user.provider || user.provider !== 'google') {
            user = await prisma.user.update({
              where: { email: profile.emails[0].value },
              data: { provider: 'google', emailVerified: true },
            })
          }
        }
        return done(null, user)
      } catch (err) {
        return done(err, null)
      }
    },
  ),
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } })
    done(null, user)
  } catch (err) {
    done(err, null)
  }
})
