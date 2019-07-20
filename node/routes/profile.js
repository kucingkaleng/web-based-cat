const express = require('express')

const {
  createProfile,
  allProfiles,
  getProfile,
  updateProfile,
  deleteProfile,
  profileById
} = require('@/controllers/profile')

const { requireSignIn } = require('@/controllers/auth') // middleware

const router = express.Router()

router.get('/profiles', requireSignIn, allProfiles)
router.get('/profile/:profileId', requireSignIn, getProfile)

router.put('/profile/:profileId', requireSignIn, updateProfile)
router.delete('/profile/:profileId', requireSignIn, deleteProfile)
router.post('/profile', requireSignIn, createProfile)

// route containing params
router.param('profileId', profileById)

module.exports = router