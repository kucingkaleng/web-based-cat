const mongoose = require('mongoose')

const groupSchema = new mongoose.Schema({
  group_name: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Group', groupSchema)