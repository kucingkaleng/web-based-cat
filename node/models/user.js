const mongoose = require('mongoose')
const rgp = require('@/helpers/rgp')
const { ObjectId } = mongoose.Schema

const userSchema = new mongoose.Schema({
  nomor_induk: {
    type: String,
    trim: true,
    required: true
  },
  username: {
    type: String,
    trim: true
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    required: true
  },
  data: {
    nama: {
      type: String,
      required: true
    }
  },
  profile: {
    type: ObjectId,
    ref: "Profile"
  },
  active: Number,
  created_at: {
    type: Date,
    default: Date.now()
  },
  updated_at: Date
})

// hash before save
userSchema.pre('save', function (next) {
  this.password = rgp.encrypt(this.nomor_induk)
  this.username = this.nomor_induk
  next()
})

// methods
userSchema.methods = {
  authenticate: function(plainText) {
    return rgp.compare(plainText.toString(), this.password)
  }
}

module.exports = mongoose.model('User', userSchema)