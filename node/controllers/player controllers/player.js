const _ = require('lodash')
const Bank = require('@/models/bank models/bank')
const Exam = require('@/models/exam models/exam')
const QRule = require('@/models/exam models/qrule') // questions rule
const Result = require('@/models/player models/result')

const { getQuestionsAggregate } = require('./get-questions')

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
      res.json({questions})      
    })
  }
  // Kondisi ketika tidak ada data ditemukan
  else {
    let questions = await processQuestionRules(exam) // mengambil soal berdasarkan aturan jumlah soal pada ujian
    result = new Result({
      user: req.user._id,
      exam: exam._id,
      questions: questions,
      answer: []
    })
    result.save((err, result) => {
      result.populate('questions', (err, result) => {
        res.json({ questions: result.questions })        
      })
    })
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

// fungsi untuk mengambil data ujian berdasarkan parameter :idExam pada url
exports.getExamById = (req, res, next, id) => {
  Exam.findById(id)
  .select('_id questions')
  .populate('questions')
  .exec((err, exam) => {
    if (err) {
      return res.status(400).json({ error: err })
    }

    // set key examDetail pada current request
    req.examDetail = exam
    next()
  })
}