require('module-alias/register')
const express = require('express') // server
const app = express()
const mongoose = require('mongoose') // mongoDB
const morgan = require('morgan') // middleware
const cookieParser = require('cookie-parser')
const cors = require('cors')

const dotenv = require('dotenv') // .env variable
dotenv.config()
global.__basedir = __dirname

// db
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true})
.then(() => console.log('DB Connected'))

mongoose.connection.on('error', err => {
  console.log(`DB connection error: ${err.message}`)
})

// middleware
app.use(cors({
	origin: '*'
}))
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())

// bring in routes
const routes = require('@/routes')
app.use('/', routes)

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: 'Unauthorized!' });
  }
})

const port = 8000
app.listen(port, () => {
  console.log(`Backend API started on port : ${port}`)
})