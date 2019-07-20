const mongoose = require('mongoose')

const competencySchema = new mongoose.Schema({
  competency: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Competency', competencySchema)