const Competency = require('@/models/bank models/competency')

exports.allCompetencies = async (req, res) => {
  await Competency.find((err, competencies) => {
    res.json({competencies})
  })
}

exports.createCompetency = async (req, res) => {
  let competency = await new Competency(req.body)
  competency.save()
  res.json({ message: 'Competency created.' })
}