const moment = require('moment')
const bcrypt = require('bcrypt')
const saltRounds = 10

exports.encrypt = function (paswd) {
  return bcrypt.hashSync(paswd, saltRounds)
}

exports.compare = function (paswd, hash) {
  return bcrypt.compareSync(paswd, hash)
}

exports.makeToken = function (length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

exports.minutesToHours = function (mins) {
  if (mins >= 24 * 60 || mins < 0) {
      throw new RangeError("Valid input should be greater than or equal to 0 and less than 1440.");
  }
  var h = mins / 60 | 0,
      m = mins % 60 | 0;
  return moment.utc().hours(h).minutes(m).format("HH:mm");
}