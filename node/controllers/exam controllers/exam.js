const _ = require('lodash')
const Exam = require('@/models/exam models/exam')

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
  .populate('questions', '-exam')
  .exec((err, exams) => {
    if (err) {
      return res.status(400).json({
        error: err
      })
    }

    res.json({exams})
  })
}

// method untuk menampilkan data ujian berdasarkan id
exports.getExam = (req, res) => {
  res.json({ exam: req.detailExam })
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
      messgae: 'Token is exists'
    })
  }
  else {
    return res.json({
      status: false,
      messgae: 'Token doesn\'t exists'
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