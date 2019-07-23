const moment = require('moment')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const saltRounds = 10

exports.encrypt = function (paswd) {
  return bcrypt.hashSync(paswd, saltRounds)
}

exports.compare = function (paswd, hash) {
  return bcrypt.compareSync(paswd, hash)
}

/**
 * membuat token ujian
 */
exports.makeToken = function (length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

exports.getAlive = function (v) {
  let now = moment().format('YYYY-MM-DD HH:mm:ss')
  v.date = moment(v.date).format('YYYY-MM-DD')
  v.start_at = moment(v.date + ' ' + v.time).format('YYYY-MM-DD HH:mm:ss')
  v.end_at = moment(v.start_at).add(v.duration, 'minutes').format('YYYY-MM-DD HH:mm:ss')

  if (now < v.start_at) {
    v.alive = 'Pending'
  }
  else if (now >= v.start_at && now < v.end_at) {
    v.alive = 'Starting'
  }
  else {
    v.alive = 'Ended'
  }
  
  return v.alive
}

/**
 * mengubah array ke pagination format
 */
exports.getPaginatedItems = function (items, page = 0, per_page = 5) {
  --page
  let paginatedItems = _.slice(items, page * per_page, (page + 1) * per_page)
  return {
    page: page+1,
    per_page: per_page,
    total: items.length,
    total_pages: Math.ceil(items.length / per_page),
    data: paginatedItems
  };
}

/**
 * convert minute to hour format
 * for example : 120 to 02:00
 */
exports.minutesToHours = function (mins) {
  if (mins >= 24 * 60 || mins < 0) {
      throw new RangeError("Valid input should be greater than or equal to 0 and less than 1440.");
  }
  var h = mins / 60 | 0,
      m = mins % 60 | 0;
  return moment.utc().hours(h).minutes(m).format("HH:mm");
}