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
  score: Number,
  score_each: Number,
  score_max: Number,
  correct_count: Number,
  corrects: [],
  incorrects: [],
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
  this.score = 0
  this.correct_count = 0
  this.corrects = []
  this.incorrects = []

  let isCorrect = false // penampung hasil pengecekan kebenaran jawaban

  /**
   * looping semua jawaban peserta yang kemudian akan dicek
   * setiap soal (answers.bank) apakah jawabannya benar atau salah
   */
  this.answers.forEach(async (v,index) => {
    /**
     * cek apakah jawaban berupa array (multiple answer)
     */
    if (v.chosen.constructor === Array) {
      isCorrect = await this.correctionMultiple(v)
    }
    else {
      // console.log('1 c');
      isCorrect = await this.correction(v)
    }

    /**
     * proses mutasi key corrects (id bank soal yang benar) dan
     * correct_count (jumlah jawaban yang benar)
     */
    // console.log('done');
    // console.log(isCorrect);
    if (isCorrect) {
      this.corrects.push(v.bank) // mutated corrects id (soal mana saja yang benar)
      this.correct_count++ // mutated correct counter
    }
    else {
      this.incorrects.push(v.bank) // mutated incorrects id (soal mana saja yang salah)
    }
  })

  /**
   * proses mutasi:
   * - score_each : score setiap soal (score per soal)
   * - score_max : score maksimal jika benar semua
   * - score : score peserta (score yang didapatkan)
   */
  let exam = await Exam.findById(this.exam).select('score -_id')
  this.score_each = exam.score
  this.score_max = exam.score * this.questions.length
  this.score = exam.score * this.correct_count
  next()
})

// methods
resultSchema.methods = {
  correction: async function (v) {
    const bank = await Bank.findById(v.bank).select('-_id')
    // console.log(bank.correct_id[0]);
    // console.log(v.chosen);
    // console.log(bank.correct_id[0].toString() == v.chosen.toString());
    return bank.correct_id[0].toString() == v.chosen.toString()
  },

  correctionMultiple: async function (v) {
    const bank = await Bank.findById(v.bank).select('-_id')

    let true_count = bank.correct_id.length
    // console.log(_.sortBy(bank.correct_id));
    // console.log(_.sortBy(v.chosen));
    // console.log(_.isEqual(_.sortBy(bank.correct_id), _.sortBy(v.chosen)));
    return _.isEqual(_.sortBy(bank.correct_id), _.sortBy(v.chosen))
  }
},

module.exports = mongoose.model('Result', resultSchema)