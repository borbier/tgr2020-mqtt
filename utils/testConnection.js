const conn = require('./mongoDB')
const mqtt = require('mqtt')
const mqttClient = mqtt.connect('mqtt://202.139.192.75', { clientId: 'tgr07' })

const testDatabase = () => {
  conn.then((client) => {
    if (!client) {
      console.log("X Database - Error")
      client.close()
    }
    console.log("+ Database - Connected")
    client.close()
  })
}

const testMQTT = () => {
  mqttClient.on('connect', () => {
    mqttClient.subscribe('tgr2020/pm25/data', (err) => {
      console.log("+ MQTT - Subscribed to pm25")
      mqttClient.end()
      if (err) {
        console.log("X MQTT - Connection error")
        mqttClient.end()
      }
    })
  })
}

testDatabase()
testMQTT()