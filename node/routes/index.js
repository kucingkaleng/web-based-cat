const routes = require('express').Router()

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

routes.use('/', authRoute)
routes.use('/', profileRoute)
routes.use('/', userRoute)
routes.use('/', examRoute)
routes.use('/', playerRoute)
routes.use('/', bankRoute)

module.exports = routes