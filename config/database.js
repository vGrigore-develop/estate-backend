const mongoose = require('mongoose')
const logger = require('./logger')

const { DATABASE_URL } = process.env

exports.connect = () => {
  mongoose
    .connect(DATABASE_URL)
    .then(() => {
      logger.info('Successfully connected to database')
    })
    .catch((error) => {
      logger.error('Database connection failed.')
      logger.error(error)
      process.exit(1)
    })
}
