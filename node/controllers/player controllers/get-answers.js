const _ = require('lodash')
const Bank = require('@/models/bank models/bank')
const Exam = require('@/models/exam models/exam')

exports.getAnswers = async (examId, result) => {
  let copy = []
  let correct = 0

  async function start() {
    for (let answer of result.answers) {
      /**
       * mencari bank soal denagn id yang sama dengan current id soal
       * dan select 'choice' yang sama dengan jawaban user ('answer')
       * lihat model Result untuk melihat Schema lengkapnya
       */
      if (answer.chosen.constructor === Array) {
        const bank = await Bank.findById(answer.bank._id)
        filtered_choices = _.remove(bank.choices, val => {
          console.log(answer.chosen);
          return !answer.chosen.includes(val._id)
        })
        console.log(filtered_choices);
        // answer.chosen.map((val, index) => {
          
        //   if (bank.choices[index].correct == 1) {
        //     correct++
        //   }
        // })
      }
      else {
        const bank = await Bank.findById(answer.bank._id)
        .select({
          'choices': {
            $elemMatch: {
              _id: answer.chosen
            }
          },
          _id: 0 // select hanya choice dan menghapus id bank soal
        })

        if (bank.choices[0].correct == 1) {
          correct++
        }
      }

      await copy.push({
        _id: answer._id, // id current answer dari result
        bank: answer.bank, // id soal dari bank soal
        chosen: bank.choices[0]
      })
    }

    /**
     * membuat key baru (questions_count, correct, dan incorrect)
     */
    result.questions_count = result.questions.length
    result.corrects = correct
    result.incorrects = result.questions_count - correct

    let exam = await Exam.findById(examId).select('score -_id')
    result.score_each = exam.score
    result.score_max = exam.score * result.questions_count
    result.score = exam.score * correct

    result.answers = copy
  }

  await start()
  return result
}