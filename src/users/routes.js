const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()

const User = require('./model')

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!(email && password)) {
      return res.status(400).send({ message: 'All input is required' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).send({ message: 'Invalid credentials' })
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: '2h',
        }
      )

      user.token = token

      return res.status(200).json(user)
    }
    res.status(400).send({ message: 'Invalid credentials' })
  } catch (error) {
    res.status(error.status).json({ message: error.message })
  }
})

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!(email && password && name)) {
      return res.status(400).send('All input is required')
    }

    const oldUser = await User.findOne({ email })

    if (oldUser) {
      return res.status(409).send('User Already Exists.')
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

    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
