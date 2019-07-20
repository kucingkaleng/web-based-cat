const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const choiceSchema = new mongoose.Schema({
  answer: {
    type: String,
    required: true
  },
  correct: Number
})

const bankSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  media: {
    type: Buffer,
    contenType: String
  },
  level: {
    type: ObjectId,
    ref: "Level"
  },
  competency: {
    type: ObjectId,
    ref: "Competency"
  },
  type: {
    type: ObjectId,
    ref: "Type"
  },
  correct_count: Number,
  correct_id: {},
  choices: [choiceSchema]
})

// middleware
bankSchema.pre('save', function (next) {
  this.correct_count = 0
  this.correct_id = []
  let tmp = this.choices.filter(v => {
    return v.correct == 1
  })
  tmp = tmp.map(function (v) {
    return v._id
  })
  this.correct_count = tmp.length
  this.correct_id = tmp
  next()
})

module.exports = mongoose.model('Bank', bankSchema)