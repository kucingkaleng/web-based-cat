const express = require('express')

const {
  createExam,
  allExams,
  getExam,
  updateExam,
  checkToken,
  examById
} = require('@/controllers/exam controllers/exam')

const {
  allQRules,
  createQRule,
  getQRulesByExam
} = require('@/controllers/exam controllers/qrule')

const { requireSignIn } = require('@/controllers/auth')

const router = express.Router()

router.get('/exams', requireSignIn, allExams)
router.get('/exam/:examId', requireSignIn, getExam)
router.post('/exam', requireSignIn, createExam)
router.put('/exam/:examId', requireSignIn, updateExam)

router.post('/exam/check/token', requireSignIn, checkToken)

router.get('/qrules', requireSignIn, allQRules)
router.get('/qrules/on/exam/:examId', requireSignIn, getQRulesByExam)
router.post('/qrule', requireSignIn, createQRule)

// route containing params
router.param('examId', examById)

module.exports = router

