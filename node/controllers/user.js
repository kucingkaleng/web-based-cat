const _ = require('lodash')
const User = require('@/models/user')

exports.allUsers = (req, res) => {
  User.find()
  .populate('profile', '_id profile_name')
  .select('nomor_induk data role active created_at updated_at')
  .then(users => {
    res.json({ users })
  })
  .catch(err => {
    res.status(400).json({
      error: err
    })
  })
}

exports.getUser = (req, res) => {
  req.detail.password = undefined
  res.json(req.detail)
}

exports.updateUser = (req, res, next) => {
  let user = req.detail
  user = _.extend(user, req.body)
  user.updated_at = Date.now()
  user.save( err => {
    if(err) {
      return res.status(400).json({
        error: 'You are not authorized to perform this action.'
      })
    }

    user.password = undefined
    res.json({ user })
  })
}

exports.deleteUser = (req, res) => {
  let user  = req.detail
  user.remove((err, user) => {
    if (err) {
      return res.status(400).json({
        error: err
      })
    }

    res.json({ message: 'User deleted!.' })
  })
}

exports.userInProfile = (req, res) => {
  User.find({profile: req.params.profileId})
  .populate('profile')
  .sort('-created_at')
  .exec((err, users) => {
    if (err) {
      res.status(400).json({
        error: err
      })
    }

    res.json(users)
  })
}

exports.userById = (req, res, next, id) => {
  User.findById(id)
  .populate('profile')
  .exec((err, user) => {
    if(err || !user) {
      return res.status(400).json({
        error: 'User not found'
      })
    }

    req.detail = user // adds detail object in req with user info
    next()
  })
}

exports.hasAuthorization = (req, res, next) => {
  const authorized = req.detail && req.auth && req.detail._id == req.auth._id

  if (!authorized) {
    return res.status(403).json({
      error: 'User is not authorized to perform this action.'
    })
  }
}