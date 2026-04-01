const mongoose = require('mongoose')
const { Station } = require('./server')

const samples = [
  {
    stationName: 'Melbourne Central Charging Hub',
    suburb: 'Melbourne CBD',
    connectorType: 'Type 2',
    powerOutput: 22,
    available: true
  },
  {
    stationName: 'Southbank Rapids',
    suburb: 'Southbank',
    connectorType: 'CCS',
    powerOutput: 150,
    available: false
  },
  {
    stationName: 'Richmond EV Bay',
    suburb: 'Richmond',
    connectorType: 'CHAdeMO',
    powerOutput: 50,
    available: true
  }
]

Station.deleteMany({})
  .then(() => Station.insertMany(samples))
  .then(() => {
    console.log('Stations seeded!')
    return mongoose.connection.close()
  })
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
    return mongoose.connection.close()
  })