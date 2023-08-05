const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const estatesRoutes = require('./estates/routes')

const app = express()
const port = 3000

const mongoString = process.env.DATABASE_URL
mongoose.connect(mongoString)
const database = mongoose.connection

database.on('error', (error) => {
  console.log(error)
})
database.once('connected', () => {
  console.log('Database Connected')
})

app.use(express.json())
app.use('/api/estates', estatesRoutes)

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
