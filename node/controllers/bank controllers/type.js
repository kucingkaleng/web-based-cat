const _ = require('lodash')
const Type = require('@/models/bank models/type')

exports.allTypes = async (req, res) => {
  Type.find()
  .exec((err, types) => {
    if (err) {
      res.status(400).json({ error: err })
    }

    res.json({ types })
  })
}

exports.createType = async (req, res) => {
  const type = new Type(req.body)
  type.save((err, type) => {
    if (err) {
      res.status(400).json({ error: err })
    }

    res.json({ message: 'Type created.'})
  })
}

exports.getType = async (req, res) => {
  const type = req.detailType
  res.json({ type })
}

exports.updateType = async (req, res) => {
  let type = req.detailType
  type = _.extend(type, req.body)
  type.save((err, type) => {
    if (err) {
      res.status(400).json({ error: err })
    }

    res.json({ message: 'Type updated.' })
  })
}

exports.deleteType = async (req, res) => {
  let type = req.detailType
  type.remove((err, type) => {
    if (err) {
      res.status(400).json({ error: err })
    }

    res.json({ message: 'Type deleted.' })
  })
}

exports.typeById = async (req, res, next, id) => {
  Type.findById(id)
  .exec((err, type) => {
    if (err) {
      res.status(400).json({ error: err })
    }
    
    req.detailType = type
    next()
  })
}