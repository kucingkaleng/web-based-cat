const Bank = require('@/models/bank models/bank')

exports.getQuestionsAggregate = async (curr_type, curr_competency, curr_level, curr_number) => {
  let tmp = []
  async function start() {
    if (curr_type == null && curr_competency != null && curr_level != null) {
      tmp = await Bank.aggregate([
        {
          $match: {
            competency: curr_competency,
            level: curr_level
          }
        },
        {$sample: { size: curr_number }}
      ])
    }
    else if (curr_type != null && curr_competency == null && curr_level != null) {
      tmp = await Bank.aggregate([
        {
          $match: {
            type: curr_type,
            level: curr_level
          }
        },
        {$sample: { size: curr_number }}
      ])
    }
    else if (curr_type != null && curr_competency != null && curr_level == null) {
      tmp = await Bank.aggregate([
        {
          $match: {
            type: curr_type,
            competency: curr_competency
          }
        },
        {$sample: { size: curr_number }}
      ])
    }
    else if (curr_type != null && curr_competency == null && curr_level == null) {
      tmp = await Bank.aggregate([
        {
          $match: {
            type: curr_type
          }
        },
        {$sample: { size: curr_number }}
      ])
    }
    else if (curr_type == null && curr_competency != null && curr_level == null) {
      tmp = await Bank.aggregate([
        {
          $match: {
            competency: curr_competency
          }
        },
        {$sample: { size: curr_number }}
      ])
    }
    else {
      tmp = await Bank.aggregate([
        {
          $match: {
            level: curr_level
          }
        },
        {$sample: { size: curr_number }}
      ])
    }
  }
  
  await start()
  return tmp
}