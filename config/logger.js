const { format, createLogger, transports } = require('winston')
const { combine, timestamp, printf } = format

const customFormat = printf(({ level, message, timestamp, ...metadata }) => {
  // Extract additional data from metadata
  const { module = 'General' } = metadata

  return `[${timestamp} Module: ${module} ${level}: ${message}]`
})

const logger = createLogger({
  level: 'debug',
  format: combine(
    timestamp({
      format: 'MM-DD-YYYY HH:mm:ss',
    }),
    format.colorize(),
    format.simple(),
    customFormat
  ),
  transports: [new transports.Console()],
})

module.exports = logger
