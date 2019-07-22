const _ = require('lodash')
const moment = require('moment')
const Exam = require('@/models/exam models/exam')
let now = moment().format('YYYY-MM-DD HH:mm:ss')

// method untuk membuat data ujian baru
exports.createExam = async (req, res) => {
  // validation
  // validasi apakah token sudah pernah digunakan
  const tokenExists = await Exam.findOne({
    token: req.body.token
  })

  if (tokenExists) {
    return res.status(403).json({
      error: 'Token is taken'
    })
  }
  // end validation

  // set array kosong untuk aturan pertanyaan pertama kali
  req.body.questions = []

  // proses simpan data
  let exam = new Exam(req.body)
  await exam.save((err, exam) => {
    if (err) {
      return res.status(400).json({
        error: err
      })
    }

    res.json({ message: 'Exam created.' })
  })
}

// method untuk mengambil semua data ujian
exports.allExams = (req, res) => {
  Exam.find()
  .lean()
  .exec((err, exams) => {
    if (err) {
      return res.status(400).json({
        error: err
      })
    }
    
    exams.forEach(v => {
      v.alive = getAlive(v)
    })
    res.json({exams})
  })
}

// method untuk menampilkan data ujian berdasarkan id
exports.getExam = (req, res) => {
  exam = req.detailExam
  exam.alive = getAlive(exam)
  res.json({ exam: exam })
}

function getAlive(v) {
  v.date = moment(v.date).format('YYYY-MM-DD')
  v.start_at = moment(v.date + ' ' + v.time).format('YYYY-MM-DD HH:mm:ss')
  v.end_at = moment(v.start_at).add(v.duration, 'minutes').format('YYYY-MM-DD HH:mm:ss')

  if (now < v.start_at) {
    v.alive = 'Pending'
  }
  else if (now >= v.start_at && now < v.end_at) {
    v.alive = 'Starting'
  }
  else {
    v.alive = 'Ended'
  }
  
  return v.alive
}

// method untuk mengupdate data ujian
exports.updateExam = async (req, res) => {
  // validasi apakah token sudah pernah digunakan
  const tokenExists = await Exam.findOne({
    token: req.body.token
  })

  if (tokenExists && tokenExists._id != req.body._id) {
    return res.status(403).json({
      error: 'Token is taken'
    })
  }
  // end validation

  let exam = req.detailExam
  exam = _.extend(exam, req.body)
  exam.save((err, exam) => {
    if (err) return res.status(400).json({ error: err })

    res.json({ message: 'Exam updated.' })
  })
}

exports.checkToken = async (req, res) => {
  const tokenExists = await Exam.findOne({
    token: req.body.token
  })

  if (tokenExists) {
    return res.json({
      status: true,
      message: 'Token is exists',
      _id: tokenExists._id
    })
  }
  else {
    return res.json({
      status: false,
      message: 'Token doesn\'t exists'
    })
  }
}

exports.examById = (req, res, next, id) => {
  Exam.findById(id)
  .populate({
    path: 'questions',
    populate: [
      { path: 'competency' },
      { path: 'level' }
    ]
  })
  .exec((err, exam) => {
    if (err) {
      return res.status(400).json({ error: err })
    }

    req.detailExam = exam
    next()
  })
}