const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()

const adminAuthMiddleware = require('../../middleware/adminAuth')

const logger = require('../../config/logger')
const User = require('./model')

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!(email && password)) {
      logger.error('Missing email and password', { module: 'UserLogin' })
      return res.status(400).send({ message: 'All input is required' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      logger.error(`No User found with the email: ${email}`, {
        module: 'UserLogin',
      })
      return res.status(400).send({ message: 'Invalid credentials' })
    }

    if (await bcrypt.compare(password, user.password)) {
      if (user.subscriptionEndDate < Date.now()) {
        logger.error(
          `User Subscription expired on ${user.subscriptionEndDate}`,
          { module: 'UserLogin' }
        )
        return res.status(400).send({ message: 'Subscription expired' })
      }

      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: '2h',
        }
      )

      user.token = token

      logger.info(`User with email ${email} logged in successfully`, {
        module: 'UserLogin',
      })

      return res.status(200).json(user)
    }
    logger.error(`Wrong password for user with email: ${email}`, {
      module: 'UserLogin',
    })
    res.status(400).send({ message: 'Invalid credentials' })
  } catch (error) {
    logger.error(
      `Error during login for user with email: ${email} - ${error.message}`,
      { module: 'UserLogin' }
    )
    res.status(error.status).json({ message: error.message })
  }
})

router.post('/register', adminAuthMiddleware, async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!(email && password && name)) {
      logger.error('Missing name, email, or password during registration', {
        module: 'UserRegistration',
      })
      return res.status(400).send({ message: 'All input is required' })
    }

    const oldUser = await User.findOne({ email })

    if (oldUser) {
      logger.warn(
        `Attempt to register user with already existing email: ${email}`,
        { module: 'UserRegistration' }
      )
      return res.status(409).send({ message: 'User Already Exists.' })
    }

    const encryptedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    })
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: '2h',
      }
    )
    user.token = token

    logger.info(`User with email ${email} registered successfully`, {
      module: 'UserRegistration',
    })

    res.status(201).json(user)
  } catch (error) {
    logger.error(
      `Error during registration for user with email: ${email} - ${error.message}`,
      { module: 'UserRegistration' }
    )
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
