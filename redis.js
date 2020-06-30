require('dotenv').config()
const redis = require('redis')
const logger = require('./logger')
const _ = require('lodash')

const client = redis.createClient({
  url: process.env.REDIS_URL,
  port: 6379
})
const init = () => {
  client.on('connect', () => {
    logger.info('redis-init', 'Redis Client connected')
  })

  client.on('error', (err) => {
    logger.error('redis-init', JSON.stringify(err))
  })
}

const set = (key, val, duration) => {
  if (_.some([key, val], el => _.isEmpty(el))) {
    logger.error('redis-set', 'Payload Cannot be empty')
    return 1
  }

  client.set(key, val, (err, res) => {
    if (err) logger.error('redis-set', JSON.stringify(err))
    logger.info('redis-set', res)
  })

  client.expire(key,duration,(err,res) => {
    if (err) logger.error('redis-expire', JSON.stringify(err))
    logger.info('redis-expire', res)
  })
  return 0
}



module.exports = {
  init,
  set,
  client
}
