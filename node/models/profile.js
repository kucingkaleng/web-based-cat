const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
  profile_name: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Profile', profileSchema)