const express = require('express')
const cors = require('cors')

require('dotenv').config()
require('../config/database').connect()

const estatesRoutes = require('./estates/routes')
const usersRoutes = require('./users/routes')
const adminsRoutes = require('./admins/routes')

const app = express()

app.use(cors())

app.use(express.json())
app.use('/api/estates', estatesRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/admins', adminsRoutes)

module.exports = app
