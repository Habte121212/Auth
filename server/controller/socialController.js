// social login
const googleLogin = (req, res, next) => next()
const googleCallback = (req, res) => {
  
  //session
  req.login(req.user, (err) => {
    if (err) {
      return res.redirect('http://localhost:5173/login?error=oauth')
    }
    res.redirect('http://localhost:5173/')
  })
}
