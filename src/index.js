const http = require('http')

const app = require('./app')
const logger = require('../config/logger')
const server = http.createServer(app)

const port = process.env.PORT

server.listen(port, () => {
  logger.info(`Server running on port ${port}`, { module: 'ServerStartup' })
})
