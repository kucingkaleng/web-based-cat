const _ = require('lodash')
const Profile = require('@/models/profile')
const User = require('@/models/user')

exports.allProfiles = async (req, res) => {
  await Profile.find((err, profiles) => {
    if (err) {
      res.status(400).json({
        error: err
      })
    }

    res.json({ profiles })
  })
}

exports.createProfile = async (req, res) => {
  let profile = await new Profile(req.body)
  profile.save()
  res.json({ message: 'Profile created.' })
}

exports.getProfile = (req, res) => {
  res.json( req.detail )
}

exports.updateProfile = (req, res) => {
  let profile = req.detail
  profile = _.extend(profile, req.body)
  profile.save(err => {
    if (err) {
      res.status(400).json({
        error: err
      })
    }

    res.json({ profile })
  })
}

exports.deleteProfile = (req, res) => {
  let profile = req.detail
  profile.remove((err, profile) => {
    if (err) {
      res.status(400).json({
        error: err
      })
    }
    
    res.json({ message: 'Profile deleted!.' })
  })
}

exports.profileById = (req, res, next, id) => {
  Profile.findById(id)
  .exec((err, profile) => {
    if (err) {
      res.status(400).json({
        error: err
      })
    }

    req.detail = profile
    next()
  })
}

