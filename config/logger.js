const { format, createLogger, transports } = require('winston')
const { combine, timestamp, printf } = format

const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`
})

const logger = createLogger({
  level: 'debug',
  colorize: true,
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
