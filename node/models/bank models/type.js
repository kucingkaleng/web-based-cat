const mongoose = require('mongoose')

const typeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Type', typeSchema)