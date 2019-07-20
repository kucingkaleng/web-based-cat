const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const qruleSchema = new mongoose.Schema({
  exam: {
    type: ObjectId,
    ref: "Exam",
    required: true
  },
  type: {
    type: ObjectId,
    ref: "Type"
  },
  competency: {
    type: ObjectId,
    ref: "Competency"
  },
  level: {
    type: ObjectId,
    ref: "Level"
  },
  number: {
    type: Number
  }
})

module.exports = mongoose.model('QRule', qruleSchema)