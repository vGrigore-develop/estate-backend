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
      logger.warn('Login attempt with missing email or password', {
        module: 'AdminLogin',
      })
      return res.status(400).send({ message: 'All input is required' })
    }

    const admin = await Admin.findOne({ email })
    if (!admin) {
      logger.warn(`Login attempt with non-existent email: ${email}`, {
        module: 'AdminLogin',
      })
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

      logger.info(`Admin ${email} logged in successfully`, {
        module: 'AdminLogin',
      })
      return res.status(200).json(admin)
    }

    logger.warn(`Incorrect password attempt for email: ${email}`, {
      module: 'AdminLogin',
    })
    res.status(400).send({ message: 'Invalid credentials' })
  } catch (error) {
    logger.error(`Admin login error: ${error.message}`, {
      module: 'AdminLogin',
    })
    res.status(error.status || 500).json({ message: error.message })
  }
})

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!(email && password)) {
      logger.warn('Registration attempt with missing email or password', {
        module: 'AdminRegistration',
      })
      return res.status(400).send({ message: 'All input is required' })
    }

    const oldAdmin = await Admin.findOne({ email })

    if (oldAdmin) {
      logger.warn(`Registration attempt with existing email: ${email}`, {
        module: 'AdminRegistration',
      })
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

    logger.info(`Admin ${email} registered successfully`, {
      module: 'AdminRegistration',
    })
    res.status(201).json(admin)
  } catch (error) {
    logger.error(`Admin registration error: ${error.message}`, {
      module: 'AdminRegistration',
    })
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
