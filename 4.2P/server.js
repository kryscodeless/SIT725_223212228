var express = require('express')
var app = express()
var port = process.env.PORT || process.env.port || 3000
const mongoose = require('mongoose')

app.use(express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/locateASocketDB')
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB')
})

// Schema — EV charging stations
const StationSchema = new mongoose.Schema({
  stationName: String,
  suburb:      String,
  connectorType: String,   // e.g. "Type 2", "CCS", "CHAdeMO"
  powerOutput:   Number,   // kW
  available:     Boolean
})

const Station = mongoose.model('Station', StationSchema)

// GET all stations
app.get('/api/stations', async (req, res) => {
  const stations = await Station.find({})
  res.json({ statusCode: 200, data: stations, message: 'Success' })
})

if (require.main === module) {
  app.listen(port, () => {
    console.log('App listening on port ' + port)
  })
}

module.exports = { Station }