const winston = require('winston')

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      level: 'info',
      handleExceptions: true,
      json: false
    })
  ],
  exitOnError: false
})

const info = (context, desc) => {
  const object = {
    context,
    message: desc.toString()
  }
  logger.info(object)
}

const error = (context, desc) => {
  const object = {
    context,
    message: desc.toString()
  }
  logger.error(object)
}

module.exports = {
  info,
  error
}
