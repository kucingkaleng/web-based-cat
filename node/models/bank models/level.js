const mongoose = require('mongoose')

const levelSchema = new mongoose.Schema({
  level: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Level', levelSchema)