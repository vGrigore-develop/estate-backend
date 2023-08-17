const jwt = require('jsonwebtoken')
const logger = require('../config/logger')

const config = process.env

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token']

  if (!token) {
    logger.warn('No token provided for user authentication', {
      module: 'UserTokenVerification',
    })
    return res
      .status(403)
      .send({ message: 'A token is required for authentication' })
  }

  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY)
    req.user = decoded
  } catch (err) {
    logger.error(`User token verification failed: ${err.message}`, {
      module: 'UserTokenVerification',
    })
    return res.status(401).send({ message: 'Invalid Token' })
  }

  return next()
}

module.exports = verifyToken
