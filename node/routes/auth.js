const express = require('express')
const { createUser, signIn, signOut } = require('@/controllers/auth')
const { userById } = require('@/controllers/user')
const { userSignupValidator } = require('@/validator')

const router = express.Router()

router.post('/auth/signup', userSignupValidator, createUser)
router.post('/auth/signin', signIn)
router.get('/auth/signout', signOut)

// route containing :userId
router.param('userId', userById)

module.exports = router