const _ = require('lodash')
const moment = require('moment')
const { getPaginatedItems } = require('@/helpers/rgp')
const Bank = require('@/models/bank models/bank')
const Exam = require('@/models/exam models/exam')
const QRule = require('@/models/exam models/qrule') // questions rule
const Result = require('@/models/player models/result')

const { getQuestionsAggregate } = require('./get-questions')

let now = moment().format('YYYY-MM-DD HH:mm:ss')

exports.getQuestions = async (req, res) => {
  let exam = req.examDetail
  let result = await Result.findOne({
    user: req.user._id,
    exam: exam._id
  })
  /**
   * mengecek apakah sudah ada data dengan id user dan id ujian tertentu pada
   * Result Collection. Jika sudah ada maka tinggal mengambil data soal dari
   * collection, jika tidak ada maka melakukan pengacakan soal yang kemudian
   * disimpan pada Result collection
   */
  // Kondisi ketika data ditemukan
  if (result) {
    result.populate('questions', (err, result) => {
      let questions = result.questions

      res.json({
        message: 'was created before',
        questions
      })
    })
  }
  // Kondisi ketika tidak ada data ditemukan
  else {
    exam.date = moment(exam.date).format('YYYY-MM-DD')
    exam.start_at = moment(exam.date + ' ' + exam.time).format('YYYY-MM-DD HH:mm:ss')
    exam.end_at = moment(exam.start_at).add(exam.duration, 'minutes').format('YYYY-MM-DD HH:mm:ss')

    if (now > exam.end_at) {
      return res.status(400).json({ error: 'Ujian telah dilaksanan.'})
    }

    let questions = await processQuestionRules(exam) // mengambil soal berdasarkan aturan jumlah soal pada ujian
    result = new Result({
      user: req.user._id,
      exam: exam._id,
      questions: questions,
      answer: []
    })
    result.save((err, result) => {
      result.populate('questions', (err, result) => {
        res.json({
          message: 'created',
          questions: result.questions
        })        
      })
    })
  }
}

exports.getQuestionsPaginate = async (req, res) => {
  let exam = req.examDetail
  let result = await Result.findOne({
    user: req.user._id,
    exam: exam._id
  })
  /**
   * mengecek apakah sudah ada data dengan id user dan id ujian tertentu pada
   * Result Collection. Jika sudah ada maka tinggal mengambil data soal dari
   * collection, jika tidak ada maka melakukan pengacakan soal yang kemudian
   * disimpan pada Result collection
   */
  // Kondisi ketika data ditemukan
  if (result) {
    Result.findOne({
      user: req.user._id,
      exam: exam._id
    })
    .populate('questions', '-correct_id -choices.correct')
    .lean()
    .exec(async (err, result) => {
      let questions = result.questions

      if (!req.query.page || !req.query.per_page) {
        return res.status(400).json({
          error: 'Page or Per page not defined'
        })
      }

      let datas = await getPaginatedItems(questions, req.query.page, req.query.per_page)
      /**
       * check answered question
       */
      datas.data.forEach(data => {
        result.answers.forEach(answer => {
          if (answer.bank.toString() == data._id.toString()) {
            data.chosen = answer.chosen
          }
        })
      })
      return res.json(datas)
    })
  }
  // data not found
  else {
    res.status(404).json({ error: 'Not found.'})
  }
}

// aturan jumlah soal berada pada key questions
const processQuestionRules = async (exam) => {
  let types = _.map(exam.questions, 'type') // array berupa id type soal
  let levels = _.map(exam.questions, 'level') // array berupa id level kesulitan
  let competencies = _.map(exam.questions, 'competency') // array berupa id skema kompetensi
  let numbers = _.map(exam.questions, 'number') // jumlah soal yang akan diambil
  let questions = [] // variabel untuk menampung semua soal
  
  /**
   * karena mongoose memakai asyncronous untuk proses pengambilan data,
   * maka kita membuat fungsi asyncronous untuk menampung data dari mongoose
   * dan mengecek apakah data sudah selesai terambil semua
   */
  async function start() {
    let index = 0 // iterasi untuk level, skema kompetensi, dan jumlah soal
    for (val of exam.questions) {
      curr_level = levels[index]
      curr_competency = competencies[index]
      curr_type = types[index]
      curr_number = numbers[index]

      /**
       * mengambil soal secara random berdasarkan aturan soal (qrule)
       * key $match untuk mengecek data bank soal apakah memiliki id
       * type, level, atau competency yang sama
       */
      
      let tmp = await getQuestionsAggregate(curr_type, curr_competency, curr_level, curr_number)
      
      questions = _.concat(questions, tmp)
      index++
    }
  }

  // menunggu fungsi start selesai
  await start()
  console.log('done')
  return questions
}

exports.examStart = async (req, res) => {
  let exam = req.examDetail
  await Result.findOne({
    user: req.user._id,
    exam: exam._id
  })
  .populate('exam')
  .lean()
  .exec((err, val) => {

    if (err || !val) {
      return res.status(404).json({ error: 'Not found.' })
    }

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
     * Making Durations and ramining times
     */
    let currentTime = moment(now).format('X') // convert into unix value
    let eventTime = moment(val.exam.end_at).format('X') // convert into unix value
    let diffTime = eventTime - currentTime
    let dur = moment.duration(diffTime * 1000, 'milliseconds') // convert into milliseconds
    val.exam.remaining_time = moment(diffTime*1000).valueOf() // convert unix value into number (milliseconds)

    res.json({ result: val })
  })
}

exports.examEnd = async (req, res) => {
  let exam = req.examDetail
  await Result.findOne({
    user: req.user._id,
    exam: exam._id
  })
  .exec( async (err, result) => {
    if (err || !result) {
      return res.status(404).json({ error: 'Not found.' })
    }
    // set has end status
    await Result.findByIdAndUpdate(result._id, {
      has_end: true
    }).exec()

    res.json({ message: 'Exam ended.' })
  })
}

/**
 * Route params methods
 * Metode yang hanya digunakan untuk middleware pada router
 */
// fungsi untuk mengambil data ujian berdasarkan parameter :idExam pada url
exports.getExamById = (req, res, next, id) => {
  Exam.findById(id)
  .populate('questions')
  .lean()
  .exec((err, exam) => {
    if (err) {
      return res.status(400).json({ error: err })
    }

    // set key examDetail pada current request
    req.examDetail = exam
    next()
  })
}