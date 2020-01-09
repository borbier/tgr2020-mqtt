const mqtt = require('mqtt')
const dotenv = require('dotenv')

dotenv.config()

const mqttHandler = require('./service/mqttHandler')

const MQTTclient = mqtt.connect(process.env.MQTT_URL, { clientId: 'tgr07' }) 
const topics = ['tgr2020/pm25/data/#', 'tgr2020/track/data/#', '/tgr2020/track/data/#', '/tgr2020/pm25/data/#']

MQTTclient.on('connect', () => {
  topics.forEach(topic => {
    MQTTclient.subscribe(topic, (err) => {
      console.log("+ MQTT - Subscribed to " + topic)
      if (err) {
        console.log(err)
      }
    })
  })
})

MQTTclient.on('reconnect', function () {
  console.error("MQTT client re-connecting.")
})

MQTTclient.on('message', mqttHandler)