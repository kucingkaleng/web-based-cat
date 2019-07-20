const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
require('dotenv').config()
const User = require('@/models/user')

// SignUp method
exports.createUser = async (req, res) => {
  // validation
  const userExists = await User.findOne({
    nomor_induk: req.body.nomor_induk
  })

  if (userExists) {
    return res.status(403).json({
      error: 'Nomor Induk is taken'
    })
  }
  // end validation

  req.body.active = 1
  const user = await new User(req.body)
  await user.save()
  res.json(user)
}

// SignIn method
exports.signIn = (req, res) => {
  // find the user based on username
  const {username, password} = req.body
  
  User.findOne({username}, (err, user) => {
    // if err or no user
    if (err || !user) {
      return res.status(401).json({
        error: 'User not found.'
      })
    }
    // if user is found make sure the username and password match
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Username and Password didn't macth"
      })
    }
    // generate a token
    const token = jwt.sign({user: user}, process.env.JWT_SECRET)
    // persist a token as 't' in cookie with expiry date
    res.cookie('t', token, {expire: new Date() + 9999})
    // return response with user and token to frontend
    const {_id, data, nomor_induk, role, profile, active} = user

    return res.json({
      token,
      user: {_id, data, nomor_induk, role, profile, active}
    })
  })
}

// SignOut method
exports.signOut = (req, res) => {
  res.clearCookie('t')
  return res.json({ message: 'Signout Success!' })
}

// Authorization methods
exports.requireSignIn = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'auth'
})