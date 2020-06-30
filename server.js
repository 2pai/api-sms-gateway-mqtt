const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const logger = require('./logger')
const otpHandler = require('./otp')
class Server {
  constructor () {
    this.app = express()
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.use(cors())
    this.app.post('/requestOTP',otpHandler.requestOTP)
    this.app.post('/verifyOTP/:id',otpHandler.verifyOTP)
    
  }

  init (port, next) {
    this.app.listen(port, () => {
      logger.info('app-init', `app run on ${port} `, '')
    })
    next()
  }
}
module.exports = Server
