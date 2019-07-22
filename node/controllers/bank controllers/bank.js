const _ = require('lodash')
const fs = require('fs')
const formidable = require('formidable')
const Bank = require('@/models/bank models/bank')

/**
 * Membuat data bank soal secara individu
 */
exports.createBank = async (req, res) => {
  let bank = await new Bank(req.body)
  bank.save()
  res.json({ message: 'Bank created.' })
}

/**
 * Membuat data bank soal baru secara masal dengan syarat:
 * type, level, dan competency sudah terisi dengan id
 * masing-masing
 */
exports.massCreateBank = async (req, res) => {
  // proses simpan data
  const form = new formidable.IncomingForm()
  await form.parse(req, async (err, fields, files) => {
    const rawData = await fs.readFileSync(files.media.path)
    const banksJson = JSON.parse(rawData)
    const banks = await Bank.create(banksJson, async (error, docs) => {
      if (err) {
        return res.status(400).json({
          error: err
        })
      }

      res.json({ message: 'Banks created.' })
    })
  })
}

exports.allBanks = async (req, res) => {
  Bank.find()
  .populate('type')
  .populate('level')
  .populate('competency')
  .exec((err, banks) => {
    if (err) {
      return res.status(400).json({
        error: err
      })
    }

    res.json({ banks })
  })
}

exports.getBank = async (req, res) => {
  const bank = req.detailBank
  res.json({ bank })
}

exports.updateBank = async (req, res) => {
  let bank = req.detailBank
  bank = _.extend(bank, req.body)
  bank.save((err, bank) => {
    if (err) {
      res.status(400).json({ error: err })
    }

    res.json({ message: 'Bank updated.' })
  })
}

exports.addChoice = async (req, res) => {
  let bank = req.detailBank
  bank.choices.set(req.body)
  bank.save((err, bank) => {
    if (err) {
      res.status(400).json({ error: err })
    }

    res.json({ message: 'Choice updated.'})
  })
}

exports.updateChoice = async (req, res) => {
  let bank = req.detailBank
  let choice = bank.choices.id(req.params.choiceId)

  if (choice) {
    choice.set(req.body)
    bank.save((err, bank) => {
      if (err) {
        res.status(400).json({ error: err })
      }

      res.json({ message: 'Choice updated.'})
    })
  }
  else {
    res.status(404).json({ error: 'Choice not found.' })
  }
}

exports.deleteChoice = async (req, res) => {
  let bank = req.detailBank
  let choice = bank.choices.id(req.params.choiceId)
  if (choice) {
    bank.choices.pull({_id: req.params.choiceId})
    bank.save((err, bank) => {
      if (err) {
        res.status(400).json({ error: err })
      }

      res.json({ message: 'Choice deleted.'})
    })
  }
  else {
    res.status(404).json({ error: 'Choice not found.' })
  }
}

exports.deleteBank = async (req, res) => {
  const bank = req.detailBank
  bank.remove((err, bank) => {
    if (err) {
      res.status(400).json({ error: err })
    }
    
    res.json({ message: 'Bank deleted.' })
  })
}

exports.bankById = async (req, res, next, id) => {
  Bank.findById(id)
  .populate('type')
  .populate('competency')
  .populate('level')
  .exec((err, bank) => {
    if (err) {
      res.status(400).json({ error: err })
    }

    req.detailBank = bank
    next()
  })
}