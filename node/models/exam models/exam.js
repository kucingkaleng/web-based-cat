const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  token: {
    type: String
  },
  group: {
    type: ObjectId,
    ref: 'Group'
  },
  score: {
    type: Number
  },
  questions: [
    {
      type: ObjectId,
      ref: 'QRule'
    }
  ]
})


module.exports = mongoose.model('Exam', examSchema)