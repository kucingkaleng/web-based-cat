const Level = require('@/models/bank models/level')

exports.allLevels = (req, res) => {
  Level.find((err, levels) => {
    res.json({levels})
  })
}