const conn = require('../utils/mongoDB')

const validateSensor = (topic) => {
  const splited = topic.toString().split('/')
  if (splited[2] === 'track' || splited[2] === 'pm25') {
    return {
      sensorType: splited[2],
      sensorID: splited[4]
    }
  } else if (splited[1] === 'pm25' || splited[1] === 'track') {
    return {
      sensorType: splited[1],
      sensorID: splited[3]
    }
  } 
}

const writeRawData = (payload) => {
  conn.then(client => {
    client.db('07sensor').collection('raw-data')
    .insertOne(payload, (err, res) => {
      if (err) throw err
      console.log("+ New doc inserted")
      client.close()
    })
  })
}

module.exports = (topic, message) => {
  if (topic.toString().match(/tgr2020\/.+/g)) {
    let { sensorType, sensorID } = validateSensor(topic)
    console.log("Receive payload ",sensorType,":", sensorID)
    var tmp = {}
    tmp['ts'] = new Date()
    tmp['sensor_type'] = sensorType
    tmp['sensor_id'] = sensorID
    tmp['clean'] = false

    try {
      let data
      if (sensorType === 'pm25') {
        data = JSON.parse(message)["DevEUI_uplink"]
      } else if(sensorType === 'track')  {
        data = JSON.parse(message)
      }
      if (data !== null) {
        tmp['data'] = data
        writeRawData(tmp)
      } else {
        console.log("Skip null data")
      }
    } catch (e) {
      console.log(e)
      console.error("Error data from " + sensorType + "/" + sensorID)
    }
  } else {
    console.log(topic.toString() + " => " + message.toString())
  }
}