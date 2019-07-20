const express = require('express')
const {
  allUsers,
  getUser,
  userById,
  updateUser,
  deleteUser,
  userInProfile
} = require('@/controllers/user')
const { requireSignIn } = require('@/controllers/auth')

const router = express.Router()

router.get('/users', allUsers)
router.get('/user/:userId', getUser)
router.get('/user/profile/:profileId', userInProfile)

router.put('/user/:userId', requireSignIn, updateUser)
router.delete('/user/:userId', requireSignIn, deleteUser)

// route containing :userId
router.param('userId', userById)

module.exports = router