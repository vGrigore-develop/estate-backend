const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()

const logger = require('../../config/logger')
const Admin = require('./model')

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!(email && password)) {
      logger.error('Missing email and password')
      return res.status(400).send({ message: 'All input is required' })
    }

    const admin = await Admin.findOne({ email })
    if (!admin) {
      logger.error('No Admin found with the inputed email')
      return res.status(400).send({ message: 'Invalid credentials' })
    }

    if (await bcrypt.compare(password, admin.password)) {
      const token = jwt.sign(
        { admin_id: admin._id, email },
        process.env.ADMIN_TOKEN_KEY,
        {
          expiresIn: '2h',
        }
      )

      admin.token = token

      return res.status(200).json(admin)
    }

    logger.error('Password is wrong')
    res.status(400).send({ message: 'Invalid credentials' })
  } catch (error) {
    logger.error(error)
    res.status(error.status).json({ message: error.message })
  }
})

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!(email && password)) {
      return res.status(400).send({ message: 'All input is required' })
    }

    const oldAdmin = await Admin.findOne({ email })

    if (oldAdmin) {
      return res.status(409).send({ message: 'Admin Already Exists.' })
    }

    const encryptedPassword = await bcrypt.hash(password, 10)

    const admin = await Admin.create({
      email: email.toLowerCase(),
      password: encryptedPassword,
    })
    const token = jwt.sign(
      { admin_id: admin._id, email },
      process.env.ADMIN_TOKEN_KEY,
      {
        expiresIn: '2h',
      }
    )
    admin.token = token

    res.status(201).json(admin)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
