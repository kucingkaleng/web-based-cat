const v = require('node-input-validator')

v.messages({
  required: 'The :attribute field must not be empty.'
})

exports.userSignupValidator = (req, res, next) => {
  let validator = new v(req.body, {
    nomor_induk: 'required',
    // password: 'required'
  })

  validator.check().then(function (matched) {
    if (!matched) {
      res.status(422).send(validator.errors);
    }
    else {
      next()
    }
  })
}