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
    let result_selected = await Result.findOne({
      _id: req.params.resultId,
      "answers.bank": req.body.bank
    }).select('answers.$')

    result.answers.id(result_selected.answers[0]._id).set(req.body)
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
  .sort({ created_at: -1 })
  .exec((err, results) => {
    if (err) {
      res.status(400).json({ error: err })
    }

    /**
     * Proses mutasi tanggal, waktu, dan durasi
     */
    results.forEach((val, index) => {
      // initialize current date (today)
      let now = moment().format('YYYY-MM-DD HH:mm:ss')
      /**
       * mutasi:
       * - format tanggal setiap ujian ke YYYY-MM-DD
       * - penggabungan tanggal dan waktu ujian menjadi satu variabel
       * datetime (YYYY-MM-DD H:mm:ss)
       */
      val.exam.date = moment(val.exam.date).format('YYYY-MM-DD')
      val.exam.start_at = moment(val.exam.date + ' ' + val.exam.time).format('YYYY-MM-DD HH:mm:ss')
      val.exam.end_at = moment(val.exam.start_at).add(val.exam.duration, 'minutes').format('YYYY-MM-DD HH:mm:ss')

      /**
       * mutasi field atau key baru dengan nama alive yang menampung
       * status waktu mulai ujian
       */
      if (now < val.exam.start_at) {
        val.exam.alive = 'Pending'
      }
      else if (now >= val.exam.start_at && now < val.exam.end_at) {
        val.exam.alive = 'Starting'
      }
      else {
        val.exam.alive = 'Ended'
      }
    })

    res.json({results})
  })
}

exports.getScore = async (req, res) => {
  await Result.findOne({
    user: req.params.userId,
    exam: req.params.examId
  })
  .select('corrects score_each')
  .lean()
  .exec((err, result) => {
    if (err) {
      return res.status(400).json({ error: err })
    }

    if (!result) {
      return res.status(400).json({ error: 'Not found.'})
    }
    
    res.json({ result })
  })
}

exports.getScores = async (req, res) => {
  await Result.find({
    exam: req.params.examId
  })
  .select('user corrects score_each')
  .populate('user', 'nomor_induk data.nama')
  .lean()
  .exec((err, results) => {
    if (err) {
      return res.status(400).json({ error: err })
    }

    if (!results) {
      return res.status(400).json({ error: 'Not found.'})
    }
    
    res.json({ results })
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