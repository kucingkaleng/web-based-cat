const mongoose = require('mongoose')

const roleSchema = new mongoose.Schema({
  role: {
    type: String
  }
})

module.exports = mongoose.model('Role', roleSchema)