// Library
const jwt = require('jsonwebtoken')
require('dotenv').config()
const moment = require('moment')
const rgp = require('@/helpers/rgp')
const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types
// Models
const Result = require('@/models/player models/result')
const { getAnswers } = require('./get-answers')

exports.createResult = async (req, res) => {
  const result = await new Result({
    user: req.user._id,
    exam: req.params.examId,
    answers: [
      {
        question_bank: req.params.bankId,
        answer: req.params.choiceId
      }
    ]
  })
  await result.save()
  res.json({ message: 'Result created.' })
}

exports.updateAnswer = async (req, res) => {
  /**
   * cari data result dengan kriteria id dan answer
   * dengan bank id tertentu
   */
  let result = await Result.findOne({
    _id: req.params.resultId,
    "answers.bank": req.body.bank
  })
  
  // jika terdapat data result di atas (true)
  if (result) {
    result.answers.id(result.answers[0]._id).set(req.body)
    result.save()
  }
  else {
    result = await Result.findById(req.params.resultId)
    result.answers.push({
      bank: req.body.bank,
      chosen: req.body.chosen
    })
    result.save()
  }

  res.json({ message: 'ok'})
}

exports.getUserAnswer = async (req, res) => {
  await Result.findOne({
    user: req.params.userId,
    exam: req.params.examId
  })
  .populate('answers.bank', 'title')
  .populate('users')
  .lean() // lean() untuk membuat hasil dari findOne dapat dimutasi
  .exec( async (err, result) => {
    if (err) {
      res.status(400).json({ error: err })
    }
    result = await getAnswers(req.params.examId, result)
    res.json(result)
  })
}

exports.getResultByUser = async (req, res) => {
  await Result.find({
    user: req.params.userId
  })
  .populate('exam')
  .select('-questions -answers -corrects -incorrects')
  .lean()
  .exec((err, results) => {
    if (err) {
      res.status(400).json({ error: err })
    }

    results.forEach((val, index) => {
      let now = moment().format('YYYY-MM-DD H:mm:ss')

      val.exam.date = moment(val.exam.date).format('YYYY-MM-DD')
      val.exam.datetime = moment(val.exam.date+' '+val.exam.time).format('YYYY-MM-DD H:mm:ss')

      if (now < val.exam.datetime) {
        val.exam.alive = 'Pending'
      }
      else if (now >= val.exam.datetime) {
        val.exam.alive = 'Starting'
      }
    })
    res.json({results})
  })
}

exports.getAuthData = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]
  let decoded = jwt.verify(token, process.env.JWT_SECRET)
  req.user = decoded.user
  next()
}

exports.convertToObjectId = (req, res, next) => {
  req.body.bank = ObjectId(req.body.bank)
  if (req.body.chosen.constructor === Array) {
    req.body.chosen.forEach((chosen, index) => {
      req.body.chosen[index] = ObjectId(chosen)
    })
  } else {
    req.body.chosen = ObjectId(req.body.chosen)
  }
  next()
}