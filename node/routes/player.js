const express = require('express')

const {
  getQuestions,
  getExamById
} = require('@/controllers/player controllers/player')

const {
  createResult,
  updateAnswer,
  getUserAnswer,
  getResultByUser,
  convertToObjectId,
  getAuthData
} = require('@/controllers/player controllers/result')

const { requireSignIn } = require('@/controllers/auth')
const router = express.Router()

router.get('/questions/:examId', getAuthData, getQuestions)

router.get('/exams/in/:userId', getAuthData, getResultByUser)

// router.post('/questions/:examId/send/answer/:choiceId/to/:bankId', requireSignIn, getAuthData, createResult)
router.put('/questions/send/choosen/into/:resultId', requireSignIn, getAuthData, convertToObjectId, updateAnswer)
router.get('/answer/in/:examId/by/:userId', requireSignIn, getAuthData, getUserAnswer)

router.param('examId', getExamById)

module.exports = router