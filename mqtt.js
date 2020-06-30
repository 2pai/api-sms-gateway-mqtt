require('dotenv').config()
const mqtt = require('mqtt')
const logger = require('./logger')
const { json } = require('body-parser')
const client = mqtt.connect(process.env.MQTT_URL)
const init = () => {
  client.on('connect', () => {
    subscribe('2pai-dev/report')
    logger.info('mqtt-init', 'MQTT connected')
  })
}

const publish = (topic, msg) => {
  client.publish(topic, msg.toString(), { qos: 0 }, (err) => {
    if (err) logger.error('mqtt-publish', JSON.stringify(err))
    else logger.info('mqtt-publish', 'message published to ' + topic)
  })
}

const subscribe = (topic) => {
  client.subscribe(topic, { qos: 0 }, (err) => {
    if (err) logger.error('mqtt-subscribe', JSON.stringify(err))
    else logger.info('mqtt-subscribe', 'success subscribe to ' + topic)
  })
}


client.on('message', (topic, message) => {

    logger.info('mqtt-message', JSON.stringify({topic:topic,payload:message.toString()}))
})

module.exports = {
  init,
  publish,
  subscribe
}