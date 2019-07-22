const express = require('express')

const {
  getQuestions,
  getQuestionsPaginate,
  examStart,
  examEnd,
  getExamById
} = require('@/controllers/player controllers/player')

const {
  updateAnswer,
  getUserAnswer,
  getResultByUser,
  getScore,
  getScores,
  convertToObjectId,
  getAuthData
} = require('@/controllers/player controllers/result')

const { requireSignIn } = require('@/controllers/auth')
const router = express.Router()

/**
 * membuat collection Result(inisialisasi awal setelah check token)
 */
router.get('/questions/:examId', requireSignIn, getAuthData, getQuestions)
/**
 * mengambil data ujian yang sedang berlangsung (sisa durasi, soal yang telah dijawab, dll)
 * API ini tidak include data lengkap soal atau pertanyaan (hanya ditampilkan berupa id)
 * karena secara umum hanya berfungsi untuk melihat sisa durasi waktu dan check soal
 * mana saja yang telah terjawab
 */
router.get('/play/:examId', requireSignIn, getAuthData, examStart)
/**
 * mengambil semua pertanyaan untuk dijawab oleh user (diambil dari pertanyaan yang dibuat dari /questions/:examId)
 */
router.get('/questions/:examId/paginate', requireSignIn, getAuthData, getQuestionsPaginate)

/** Mengakhikiri ujian */
router.put('/play/:examId/declare/end', requireSignIn, getAuthData, examEnd)

/** mendapatkan score ujian per peserta */
router.get('/score/by/:userId/in/:examId', requireSignIn, getAuthData, getScore)

/** mendapatkan score ujian semua peserta */
router.get('/score/in/:examId', requireSignIn, getAuthData, getScores)


router.get('/exams/in/:userId', requireSignIn, getAuthData, getResultByUser)

// router.post('/questions/:examId/send/answer/:choiceId/to/:bankId', requireSignIn, getAuthData, createResult)
router.put('/questions/send/choosen/into/:resultId', requireSignIn, getAuthData, convertToObjectId, updateAnswer)
// router.get('/answer/in/:examId/by/:userId', requireSignIn, getAuthData, getUserAnswer)

router.param('examId', getExamById)

module.exports = router