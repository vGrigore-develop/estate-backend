const mongoose = require('mongoose')
const logger = require('./logger')

const { DATABASE_URL } = process.env

exports.connect = () => {
  mongoose
    .connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      logger.info('Successfully connected to database', {
        module: 'DatabaseConnection',
      })
    })
    .catch((error) => {
      logger.error('Database connection failed.', {
        module: 'DatabaseConnection',
      })
      logger.error(error.message, { module: 'DatabaseConnection' })
      process.exit(1)
    })
}
