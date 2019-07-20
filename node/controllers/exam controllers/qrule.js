const QRule = require('@/models/exam models/qrule')
const Exam = require('@/models/exam models/exam')

exports.allQRules = async (req, res) => {
  QRule.find()
  .populate('competency')
  .populate('level')
  .exec((err, qrules) => {
    res.json({ qrules })
  })
}

exports.createQRule = async (req, res) => {
  const qrule = new QRule(req.body)
  qrule.save((err, qrule) => {
    if (err) return res.status(400).json({ error: err })

    Exam.findOneAndUpdate({ _id: qrule.exam }, {
      $push: {
        questions: qrule._id
      }
    })
    .exec((err, success) => {
      res.json({ message: 'Question Rule created.' })
    })

  })
}

exports.getQRulesByExam = async (req, res) => {
  QRule.find({
    exam: req.detailExam._id
  })
  .populate('competency')
  .populate('level')
  .exec((err, qrules) => {
    if (err) return res.status(400).json({ error: err })
  
    res.json({ qrules })
  })
}