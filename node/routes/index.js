const routes = require('express').Router()
const backup = require('mongodb-backup')

// authentication
const authRoute = require('./auth')

// user and profile
const profileRoute = require('./profile')
const userRoute = require('./user')

// exam and group
const examRoute = require('./exam')
const playerRoute = require('./player')

// bank
const bankRoute = require('./bank')

routes.get('/', (req, res) => {
  res.status(200).json({
    message: 'Connected!'
  })
})

routes.get('/backup/now', (req, res) => {
  backup({
    uri: 'mongodb://localhost:27017/exam',
    root: __dirname+'/database'
  })
})

routes.use('/', authRoute)
routes.use('/', profileRoute)
routes.use('/', userRoute)
routes.use('/', examRoute)
routes.use('/', playerRoute)
routes.use('/', bankRoute)

module.exports = routes