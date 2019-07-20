const express = require('express')

// Bank
const {
  createBank,
  massCreateBank,
  allBanks,
  getBank,
  updateBank,
  deleteBank,
  updateChoice,
  deleteChoice,
  bankById
} = require('@/controllers/bank controllers/bank')

// Type
const {
  allTypes,
  createType,
  getType,
  updateType,
  deleteType,
  typeById
} = require('@/controllers/bank controllers/type')

// Level
const { allLevels } = require('@/controllers/bank controllers/level')

// Competency
const {
  allCompetencies,
  createCompetency
} = require('@/controllers/bank controllers/competency')

const { requireSignIn } = require('@/controllers/auth')

const router = express.Router()

router.post('/bank', requireSignIn, createBank)
router.post('/bank/mass', requireSignIn, massCreateBank) // mass create bank soal
router.get('/banks', requireSignIn, allBanks)
router.get('/bank/:bankId', requireSignIn, getBank)
router.put('/bank/:bankId', requireSignIn, updateBank)
router.delete('/bank/:bankId', requireSignIn, deleteBank)

router.put('/bank/:bankId/update/choice/:choiceId', requireSignIn, updateChoice)
router.delete('/bank/:bankId/delete/choice/:choiceId', requireSignIn, deleteChoice)

router.get('/types', requireSignIn, allTypes)
router.post('/type', requireSignIn, createType)
router.get('/type/:typeId', requireSignIn, getType)
router.put('/type/:typeId', requireSignIn, updateType)
router.delete('/type/:typeId', requireSignIn, deleteType)

router.get('/levels', requireSignIn, allLevels)

router.get('/competencies', requireSignIn, allCompetencies)
router.post('/competency', requireSignIn, createCompetency)

// params middleware
router.param('typeId', typeById)
router.param('bankId', bankById)

module.exports = router

