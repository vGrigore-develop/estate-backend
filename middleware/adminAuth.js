const jwt = require('jsonwebtoken')
const logger = require('../config/logger')

const config = process.env

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token']

  if (!token) {
    return res
      .status(403)
      .send({ message: 'A token is required for admin authentication' })
  }
  try {
    const decoded = jwt.verify(token, config.ADMIN_TOKEN_KEY)
    req.admin = decoded
  } catch (err) {
    logger.error(err)
    return res.status(401).send({ message: 'Invalid Token' })
  }
  return next()
}

module.exports = verifyToken
