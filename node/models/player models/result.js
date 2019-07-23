const _ = require('lodash')
const Bank = require('@/models/bank models/bank')
const Exam = require('@/models/exam models/exam')
const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const answerSchema = new mongoose.Schema({
  bank: {
    type: ObjectId,
    ref: 'Bank'
  },
  chosen: {}
})

const resultSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    ref: 'User'
  },
  exam: {
    type: ObjectId,
    ref: 'Exam'
  },
  questions: [
    {
      type: ObjectId,
      ref: 'Bank'
    }
  ],
  answers: [answerSchema],
  score_each: Number,
  score_max: Number,
  corrects: [],
  incorrects: [],
  has_end: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now()
  }
})

// middleware
resultSchema.pre('save', async function (next) {
  /**
   * inisialisasi awal (reset value ke default)
   */
  this.corrects = []
  this.incorrects = []
  let isCorrect = false // penampung hasil pengecekan kebenaran jawaban
  /**
   * looping semua jawaban peserta yang kemudian akan dicek
   * setiap soal (answers.bank) apakah jawabannya benar atau salah
   */

  const res = await mutationCorrection(this.answers)
  this.corrects = res.cr
  this.incorrects = res.incr

  /**
   * proses mutasi:
   * - score_each : score setiap soal (score per soal)
   * - score_max : score maksimal jika benar semua
   * - score : score peserta (score yang didapatkan)
   */

  let exam = await Exam.findById(this.exam).select('score -_id')
  this.score_each = exam.score
  this.score_max = exam.score * this.questions.length
  next()
})

async function mutationCorrection (answers) {
  let corrects = [],
      incorrects = []

  async function start () {
    for (v of answers) {
      /**
       * cek apakah jawaban berupa array (multiple answer)
       */
      const bank = await Bank.findById(v.bank).select('correct_count correct_id -_id')

      if (bank.correct_count > 1) {
        isCorrect = _.isEqual(_.sortBy(bank.correct_id), _.sortBy(v.chosen))
      } else {
        isCorrect = bank.correct_id[0].toString() == v.chosen.toString()
      }

      /**
       * proses mutasi key corrects (id bank soal yang benar) dan
       * correct_count (jumlah jawaban yang benar)
       */
      if (isCorrect) {
        corrects.push(v.bank) // mutated corrects id (soal mana saja yang benar)
      } else {
        incorrects.push(v.bank) // mutated incorrects id (soal mana saja yang salah)
      }
    }
  }
  await start()
  return {
    cr: corrects,
    incr: incorrects
  }
}

async function correction (v) {
  const bank = await Bank.findById(v.bank).select('-_id')
  return bank.correct_id[0].toString() == v.chosen.toString()
}

async function correctionMultiple (v) {
  const bank = await Bank.findById(v.bank).select('-_id')

  let true_count = bank.correct_id.length
  return _.isEqual(_.sortBy(bank.correct_id), _.sortBy(v.chosen))
}

// methods
resultSchema.methods = {
  
}

module.exports = mongoose.model('Result', resultSchema)