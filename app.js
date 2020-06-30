require('dotenv').config()

const s = require('./server')
const mqtt = require('./mqtt')
const server = new s()
const redis = require('./redis')

server.init(process.env.PORT || 9002, () => {
    mqtt.init()
    redis.init()
})
  