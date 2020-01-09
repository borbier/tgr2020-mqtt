const MongoClient = require('mongodb').MongoClient
const dotenv = require('dotenv')
dotenv.config()

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

module.exports = MongoClient.connect(process.env.DATABASE_URL, options)